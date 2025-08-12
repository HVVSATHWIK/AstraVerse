/**
 * Basic queue-driven workflow execution engine
 * Orchestrates workflow runs with step-by-step execution
 */

import {
  Workflow,
  WorkflowRun,
  WorkflowStep,
  StepResult,
  RunStatus,
  LLMStep,
  IntegrationStep,
  ConditionalStep,
  LoopStep,
  WaitStep,
  RetryPolicy,
} from '../../types/domain';
import {
  createExecutionContext,
  addStepResult,
  getNextStep,
  evaluateCondition,
  prepareStepInput,
  mapStepOutputs,
  generateCorrelationId,
  createExecutionSummary,
} from './executionContext';
import {
  eventStore,
  createRunStartedEvent,
  createRunCompletedEvent,
  createRunFailedEvent,
  createStepStartedEvent,
  createStepCompletedEvent,
  createStepFailedEvent,
} from './runEvents';
import { OrchestratorError, createWorkflowError } from '../errors/OrchestratorError';
import { ERROR_CODES } from '../errors/errorCodes';
import { logger, createWorkflowLogger } from '../logging/logger';

export interface WorkflowExecutionConfig {
  maxConcurrentRuns: number;
  defaultTimeout: number;
  retryPolicy: RetryPolicy;
  enableMetrics: boolean;
  enableTracing: boolean;
}

export interface RunOptions {
  correlationId?: string;
  userId?: string;
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

const DEFAULT_CONFIG: WorkflowExecutionConfig = {
  maxConcurrentRuns: 10,
  defaultTimeout: 300000, // 5 minutes
  retryPolicy: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
  },
  enableMetrics: true,
  enableTracing: true,
};

/**
 * Workflow execution engine with queue-based processing
 */
export class WorkflowEngine {
  private config: WorkflowExecutionConfig;
  private runQueue: Map<string, WorkflowRun> = new Map();
  private activeRuns: Map<string, WorkflowRun> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private stepExecutors: Map<string, StepExecutor> = new Map();
  private isProcessing = false;

  constructor(config: Partial<WorkflowExecutionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.registerDefaultStepExecutors();
  }

  /**
   * Register a workflow definition
   */
  registerWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
    logger.info('Workflow registered', {
      workflowId: workflow.id,
      name: workflow.name,
      version: workflow.version,
      stepCount: workflow.steps.length,
    });
  }

  /**
   * Start a workflow run
   */
  async startWorkflow(
    workflowId: string,
    input: Record<string, unknown>,
    options: RunOptions = {}
  ): Promise<WorkflowRun> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw createWorkflowError(
        ERROR_CODES.WORKFLOW_NOT_FOUND,
        `Workflow with ID ${workflowId} not found`,
        workflowId
      );
    }

    if (workflow.status !== 'active') {
      throw createWorkflowError(
        ERROR_CODES.WORKFLOW_INVALID_STATE,
        `Workflow ${workflowId} is not active (status: ${workflow.status})`,
        workflowId
      );
    }

    const correlationId = options.correlationId || generateCorrelationId();
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const workflowRun: WorkflowRun = {
      id: runId,
      createdAt: new Date(),
      updatedAt: new Date(),
      workflowId,
      workflowVersion: workflow.version,
      status: 'queued',
      input,
      context: createExecutionContext(correlationId, options.userId, input),
      startedAt: new Date(),
    };

    // Update context with workflow metadata
    workflowRun.context.variables.workflowId = workflowId;
    workflowRun.context.variables.runId = runId;
    workflowRun.context.metrics.totalSteps = workflow.steps.length;

    // Add to queue
    this.runQueue.set(runId, workflowRun);

    // Log run started event
    await eventStore.appendEvent(
      createRunStartedEvent(runId, correlationId, {
        workflowId,
        workflowVersion: workflow.version,
        input,
      })
    );

    const workflowLogger = createWorkflowLogger(workflowId, correlationId);
    workflowLogger.info('Workflow run queued', {
      runId,
      workflowName: workflow.name,
      inputKeys: Object.keys(input),
    });

    // Start processing if not already running
    this.processQueue();

    return workflowRun;
  }

  /**
   * Get workflow run status
   */
  getRunStatus(runId: string): WorkflowRun | null {
    return this.activeRuns.get(runId) || this.runQueue.get(runId) || null;
  }

  /**
   * Cancel a workflow run
   */
  async cancelRun(runId: string): Promise<boolean> {
    const run = this.getRunStatus(runId);
    if (!run) {
      return false;
    }

    if (run.status === 'completed' || run.status === 'failed' || run.status === 'cancelled') {
      return false;
    }

    // Update run status
    run.status = 'cancelled';
    run.completedAt = new Date();
    run.updatedAt = new Date();

    // Remove from queues
    this.runQueue.delete(runId);
    this.activeRuns.delete(runId);

    // Log cancellation event
    await eventStore.appendEvent(
      createRunFailedEvent(runId, run.context.correlationId, {
        reason: 'cancelled',
        cancelledAt: new Date().toISOString(),
      })
    );

    logger.info('Workflow run cancelled', {
      runId,
      correlationId: run.context.correlationId,
    });

    return true;
  }

  /**
   * Process the run queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.runQueue.size > 0 && this.activeRuns.size < this.config.maxConcurrentRuns) {
        const [runId, run] = Array.from(this.runQueue.entries())[0];
        this.runQueue.delete(runId);
        this.activeRuns.set(runId, run);

        // Execute run asynchronously
        this.executeWorkflowRun(run).catch(error => {
          logger.error('Workflow run execution failed', error as Error, {
            runId,
            correlationId: run.context.correlationId,
          });
        });
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Execute a workflow run
   */
  private async executeWorkflowRun(run: WorkflowRun): Promise<void> {
    const workflow = this.workflows.get(run.workflowId)!;
    const workflowLogger = createWorkflowLogger(run.workflowId, run.context.correlationId);

    try {
      // Update run status to running
      run.status = 'running';
      run.updatedAt = new Date();

      workflowLogger.info('Starting workflow execution', {
        runId: run.id,
        workflowName: workflow.name,
      });

      // Execute workflow steps
      await this.executeWorkflowSteps(workflow, run);

      // Mark as completed
      run.status = 'completed';
      run.completedAt = new Date();
      run.updatedAt = new Date();

      // Log completion event
      await eventStore.appendEvent(
        createRunCompletedEvent(run.id, run.context.correlationId, {
          summary: createExecutionSummary(run.context),
          output: run.output,
        })
      );

      workflowLogger.info('Workflow execution completed', {
        runId: run.id,
        summary: createExecutionSummary(run.context),
      });
    } catch (error) {
      // Mark as failed
      run.status = 'failed';
      run.completedAt = new Date();
      run.updatedAt = new Date();
      run.error = {
        code: error instanceof OrchestratorError ? error.code : ERROR_CODES.WORKFLOW_EXECUTION_FAILED,
        message: error instanceof Error ? error.message : String(error),
        retryable: error instanceof OrchestratorError ? error.retryable : true,
      };

      // Log failure event
      await eventStore.appendEvent(
        createRunFailedEvent(run.id, run.context.correlationId, {
          error: run.error,
          summary: createExecutionSummary(run.context),
        })
      );

      workflowLogger.error('Workflow execution failed', error as Error, {
        runId: run.id,
        summary: createExecutionSummary(run.context),
      });
    } finally {
      // Remove from active runs
      this.activeRuns.delete(run.id);

      // Continue processing queue
      this.processQueue();
    }
  }

  /**
   * Execute workflow steps in sequence
   */
  private async executeWorkflowSteps(workflow: Workflow, run: WorkflowRun): Promise<void> {
    if (workflow.steps.length === 0) {
      return;
    }

    // Find the first step (position 0 or lowest position)
    const firstStep = workflow.steps.reduce((prev, current) =>
      current.position < prev.position ? current : prev
    );

    let currentStep: WorkflowStep | null = firstStep;

    while (currentStep) {
      if (run.status === 'cancelled') {
        break;
      }

      try {
        // Execute the current step
        const stepResult = await this.executeStep(currentStep, run.context, workflow);

        // Add step result to context
        run.context = addStepResult(run.context, stepResult);

        // Map outputs to variables if configured
        if ('outputMapping' in currentStep && currentStep.outputMapping) {
          run.context = mapStepOutputs(run.context, currentStep.id, currentStep.outputMapping);
        }

        // Determine next step
        if (stepResult.status === 'completed') {
          currentStep = getNextStep(currentStep, run.context, workflow.steps);
        } else if (stepResult.status === 'failed') {
          // Handle error based on step configuration
          if (currentStep.onError) {
            switch (currentStep.onError.strategy) {
              case 'skip':
                currentStep = getNextStep(currentStep, run.context, workflow.steps);
                break;
              case 'fallback':
                if (currentStep.onError.fallbackStepId) {
                  currentStep = workflow.steps.find(s => s.id === currentStep!.onError!.fallbackStepId!) || null;
                } else {
                  currentStep = null;
                }
                break;
              case 'fail':
              default:
                throw createWorkflowError(
                  ERROR_CODES.WORKFLOW_STEP_FAILED,
                  `Step ${currentStep.id} failed: ${stepResult.error?.message}`,
                  workflow.id,
                  currentStep.id
                );
            }
          } else {
            throw createWorkflowError(
              ERROR_CODES.WORKFLOW_STEP_FAILED,
              `Step ${currentStep.id} failed: ${stepResult.error?.message}`,
              workflow.id,
              currentStep.id
            );
          }
        } else {
          // Step was skipped, continue to next
          currentStep = getNextStep(currentStep, run.context, workflow.steps);
        }
      } catch (error) {
        // Log step error
        await eventStore.appendEvent(
          createStepFailedEvent(run.id, run.context.correlationId, currentStep.id, {
            error: error instanceof Error ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            } : { message: String(error) },
          })
        );

        throw error;
      }
    }

    // Set final output
    run.output = { ...run.context.variables };
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(
    step: WorkflowStep,
    context: typeof run.context,
    workflow: Workflow
  ): Promise<StepResult> {
    const stepLogger = logger.withCorrelationId(context.correlationId).withStepId(step.id);

    const stepResult: StepResult = {
      stepId: step.id,
      status: 'running',
      startedAt: new Date(),
      input: {},
      attempts: 0,
    };

    // Log step started
    await eventStore.appendEvent(
      createStepStartedEvent(context.correlationId, step.id, {
        stepType: step.type,
        stepName: step.name,
      })
    );

    stepLogger.info('Step execution started', {
      stepType: step.type,
      stepName: step.name,
    });

    try {
      // Prepare step input
      const input = this.prepareStepInputForType(step, context);
      stepResult.input = input;

      // Execute step based on type
      const output = await this.executeStepByType(step, input, context);
      
      stepResult.status = 'completed';
      stepResult.completedAt = new Date();
      stepResult.output = output;

      // Log step completion
      await eventStore.appendEvent(
        createStepCompletedEvent(context.correlationId, step.id, {
          duration: stepResult.completedAt.getTime() - stepResult.startedAt.getTime(),
          outputKeys: output ? Object.keys(output) : [],
        })
      );

      stepLogger.info('Step execution completed', {
        duration: stepResult.completedAt.getTime() - stepResult.startedAt.getTime(),
      });

      return stepResult;
    } catch (error) {
      stepResult.status = 'failed';
      stepResult.completedAt = new Date();
      stepResult.error = {
        code: error instanceof OrchestratorError ? error.code : ERROR_CODES.WORKFLOW_STEP_FAILED,
        message: error instanceof Error ? error.message : String(error),
        retryable: error instanceof OrchestratorError ? error.retryable : true,
      };

      stepLogger.error('Step execution failed', error as Error);

      return stepResult;
    }
  }

  /**
   * Prepare input for different step types
   */
  private prepareStepInputForType(step: WorkflowStep, context: typeof run.context): Record<string, unknown> {
    switch (step.type) {
      case 'llm':
        return prepareStepInput(step.parameters as Record<string, unknown>, context);
      case 'integration':
        return prepareStepInput(step.parameters, context);
      case 'conditional':
        return { condition: step.condition };
      case 'loop':
        return { iterable: step.iterable, maxIterations: step.maxIterations };
      case 'wait':
        return { duration: step.duration, condition: step.condition };
      default:
        return {};
    }
  }

  /**
   * Execute step based on its type
   */
  private async executeStepByType(
    step: WorkflowStep,
    input: Record<string, unknown>,
    context: typeof run.context
  ): Promise<Record<string, unknown>> {
    const executor = this.stepExecutors.get(step.type);
    if (!executor) {
      throw createWorkflowError(
        ERROR_CODES.WORKFLOW_STEP_NOT_FOUND,
        `No executor found for step type: ${step.type}`,
        undefined,
        step.id
      );
    }

    return executor.execute(step, input, context);
  }

  /**
   * Register default step executors
   */
  private registerDefaultStepExecutors(): void {
    // LLM step executor (placeholder)
    this.stepExecutors.set('llm', {
      execute: async (step: WorkflowStep, input: Record<string, unknown>) => {
        const llmStep = step as LLMStep;
        // Placeholder implementation - would integrate with LLM client
        return {
          response: `Mock LLM response for provider ${llmStep.provider}`,
          tokens: 100,
        };
      },
    });

    // Integration step executor (placeholder)
    this.stepExecutors.set('integration', {
      execute: async (step: WorkflowStep, input: Record<string, unknown>) => {
        const integrationStep = step as IntegrationStep;
        // Placeholder implementation - would integrate with integration adapters
        return {
          result: `Mock integration result for ${integrationStep.adapterId}`,
          status: 'success',
        };
      },
    });

    // Conditional step executor
    this.stepExecutors.set('conditional', {
      execute: async (step: WorkflowStep, input: Record<string, unknown>, context) => {
        const conditionalStep = step as ConditionalStep;
        const result = evaluateCondition(conditionalStep.condition, context);
        return { conditionResult: result };
      },
    });

    // Loop step executor (placeholder)
    this.stepExecutors.set('loop', {
      execute: async (step: WorkflowStep, input: Record<string, unknown>) => {
        const loopStep = step as LoopStep;
        // Placeholder implementation - would implement loop logic
        return {
          iterations: 1,
          maxIterations: loopStep.maxIterations,
        };
      },
    });

    // Wait step executor
    this.stepExecutors.set('wait', {
      execute: async (step: WorkflowStep) => {
        const waitStep = step as WaitStep;
        await new Promise(resolve => setTimeout(resolve, waitStep.duration));
        return { waited: waitStep.duration };
      },
    });
  }

  /**
   * Register a custom step executor
   */
  registerStepExecutor(type: string, executor: StepExecutor): void {
    this.stepExecutors.set(type, executor);
    logger.info('Step executor registered', { stepType: type });
  }

  /**
   * Get engine statistics
   */
  getStatistics(): {
    queuedRuns: number;
    activeRuns: number;
    registeredWorkflows: number;
    registeredExecutors: number;
  } {
    return {
      queuedRuns: this.runQueue.size,
      activeRuns: this.activeRuns.size,
      registeredWorkflows: this.workflows.size,
      registeredExecutors: this.stepExecutors.size,
    };
  }
}

/**
 * Interface for step executors
 */
export interface StepExecutor {
  execute(
    step: WorkflowStep,
    input: Record<string, unknown>,
    context: any
  ): Promise<Record<string, unknown>>;
}

// Default workflow engine instance
export const workflowEngine = new WorkflowEngine();