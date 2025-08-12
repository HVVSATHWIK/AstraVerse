/**
 * Execution context helper functions for workflow runs
 * Manages workflow execution state and variable resolution
 */

import { ExecutionContext, WorkflowStep, StepResult } from '../../types/domain';
import { logger } from '../logging/logger';

/**
 * Create a new execution context for a workflow run
 */
export function createExecutionContext(
  correlationId: string,
  userId?: string,
  initialVariables: Record<string, unknown> = {}
): ExecutionContext {
  return {
    correlationId,
    userId,
    variables: { ...initialVariables },
    stepResults: {},
    metrics: {
      totalSteps: 0,
      completedSteps: 0,
      failedSteps: 0,
      skippedSteps: 0,
      totalDuration: 0,
      stepDurations: {},
    },
  };
}

/**
 * Update variable in execution context
 */
export function updateVariable(
  context: ExecutionContext,
  key: string,
  value: unknown
): ExecutionContext {
  return {
    ...context,
    variables: {
      ...context.variables,
      [key]: value,
    },
  };
}

/**
 * Get variable from execution context
 */
export function getVariable(
  context: ExecutionContext,
  key: string,
  defaultValue?: unknown
): unknown {
  return context.variables[key] ?? defaultValue;
}

/**
 * Resolve variables in a string template
 * Supports simple mustache-like syntax: {{variable.path}}
 */
export function resolveTemplate(
  template: string,
  context: ExecutionContext
): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const value = resolvePath(path.trim(), context);
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Resolve a dot-notation path in the execution context
 */
export function resolvePath(
  path: string,
  context: ExecutionContext
): unknown {
  const parts = path.split('.');
  let current: any = {
    variables: context.variables,
    steps: context.stepResults,
    metrics: context.metrics,
  };

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

/**
 * Evaluate a simple boolean expression
 * Supports basic comparisons: ==, !=, >, <, >=, <=
 */
export function evaluateCondition(
  condition: string,
  context: ExecutionContext
): boolean {
  try {
    // Simple expression parser for basic conditions
    const operators = ['>=', '<=', '==', '!=', '>', '<'];
    let operator = '';
    let leftSide = '';
    let rightSide = '';

    for (const op of operators) {
      if (condition.includes(op)) {
        operator = op;
        const parts = condition.split(op);
        leftSide = parts[0].trim();
        rightSide = parts[1].trim();
        break;
      }
    }

    if (!operator) {
      // Simple boolean check
      const value = resolveValue(condition.trim(), context);
      return Boolean(value);
    }

    const leftValue = resolveValue(leftSide, context);
    const rightValue = resolveValue(rightSide, context);

    switch (operator) {
      case '==':
        return leftValue == rightValue;
      case '!=':
        return leftValue != rightValue;
      case '>':
        return Number(leftValue) > Number(rightValue);
      case '<':
        return Number(leftValue) < Number(rightValue);
      case '>=':
        return Number(leftValue) >= Number(rightValue);
      case '<=':
        return Number(leftValue) <= Number(rightValue);
      default:
        return false;
    }
  } catch (error) {
    logger.error('Failed to evaluate condition', error as Error, {
      condition,
      correlationId: context.correlationId,
    });
    return false;
  }
}

/**
 * Resolve a value (variable path, literal, or expression)
 */
function resolveValue(value: string, context: ExecutionContext): unknown {
  // Remove quotes for string literals
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  // Parse numbers
  if (!isNaN(Number(value))) {
    return Number(value);
  }

  // Parse booleans
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (value === 'undefined') return undefined;

  // Resolve as path
  return resolvePath(value, context);
}

/**
 * Add step result to execution context
 */
export function addStepResult(
  context: ExecutionContext,
  stepResult: StepResult
): ExecutionContext {
  const updatedContext = {
    ...context,
    stepResults: {
      ...context.stepResults,
      [stepResult.stepId]: stepResult,
    },
  };

  // Update metrics
  updatedContext.metrics = updateMetrics(updatedContext.metrics, stepResult);

  return updatedContext;
}

/**
 * Update execution metrics based on step result
 */
function updateMetrics(
  metrics: ExecutionContext['metrics'],
  stepResult: StepResult
): ExecutionContext['metrics'] {
  const duration = stepResult.completedAt
    ? stepResult.completedAt.getTime() - stepResult.startedAt.getTime()
    : 0;

  const updatedMetrics = { ...metrics };

  // Update step counts
  switch (stepResult.status) {
    case 'completed':
      updatedMetrics.completedSteps++;
      break;
    case 'failed':
      updatedMetrics.failedSteps++;
      break;
    case 'skipped':
      updatedMetrics.skippedSteps++;
      break;
  }

  // Update durations
  if (duration > 0) {
    updatedMetrics.stepDurations[stepResult.stepId] = duration;
    updatedMetrics.totalDuration += duration;
  }

  return updatedMetrics;
}

/**
 * Get step result from execution context
 */
export function getStepResult(
  context: ExecutionContext,
  stepId: string
): StepResult | undefined {
  return context.stepResults[stepId];
}

/**
 * Check if step has been completed
 */
export function isStepCompleted(
  context: ExecutionContext,
  stepId: string
): boolean {
  const result = getStepResult(context, stepId);
  return result?.status === 'completed';
}

/**
 * Check if step has failed
 */
export function isStepFailed(
  context: ExecutionContext,
  stepId: string
): boolean {
  const result = getStepResult(context, stepId);
  return result?.status === 'failed';
}

/**
 * Get next step to execute based on workflow logic
 */
export function getNextStep(
  currentStep: WorkflowStep,
  context: ExecutionContext,
  allSteps: WorkflowStep[]
): WorkflowStep | null {
  // Handle conditional steps
  if (currentStep.type === 'conditional') {
    const conditionResult = evaluateCondition(currentStep.condition, context);
    const nextStepId = conditionResult ? currentStep.trueStepId : currentStep.falseStepId;
    
    if (nextStepId) {
      return allSteps.find(step => step.id === nextStepId) || null;
    }
    return null;
  }

  // Handle regular steps with nextStepId
  if (currentStep.nextStepId) {
    return allSteps.find(step => step.id === currentStep.nextStepId) || null;
  }

  return null;
}

/**
 * Get all pending steps (steps that haven't been executed yet)
 */
export function getPendingSteps(
  allSteps: WorkflowStep[],
  context: ExecutionContext
): WorkflowStep[] {
  return allSteps.filter(step => !context.stepResults[step.id]);
}

/**
 * Get step output by step ID
 */
export function getStepOutput(
  context: ExecutionContext,
  stepId: string
): Record<string, unknown> | undefined {
  const result = getStepResult(context, stepId);
  return result?.output;
}

/**
 * Map step outputs to variables using output mapping configuration
 */
export function mapStepOutputs(
  context: ExecutionContext,
  stepId: string,
  outputMapping?: Record<string, string>
): ExecutionContext {
  if (!outputMapping) {
    return context;
  }

  const stepOutput = getStepOutput(context, stepId);
  if (!stepOutput) {
    return context;
  }

  let updatedContext = context;

  for (const [outputKey, variableKey] of Object.entries(outputMapping)) {
    if (outputKey in stepOutput) {
      updatedContext = updateVariable(updatedContext, variableKey, stepOutput[outputKey]);
    }
  }

  return updatedContext;
}

/**
 * Prepare step input by resolving templates and variables
 */
export function prepareStepInput(
  parameters: Record<string, unknown>,
  context: ExecutionContext
): Record<string, unknown> {
  const resolvedInput: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(parameters)) {
    if (typeof value === 'string') {
      resolvedInput[key] = resolveTemplate(value, context);
    } else if (Array.isArray(value)) {
      resolvedInput[key] = value.map(item => 
        typeof item === 'string' ? resolveTemplate(item, context) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      resolvedInput[key] = prepareStepInput(value as Record<string, unknown>, context);
    } else {
      resolvedInput[key] = value;
    }
  }

  return resolvedInput;
}

/**
 * Create a new correlation ID
 */
export function generateCorrelationId(): string {
  return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create execution summary from context
 */
export function createExecutionSummary(context: ExecutionContext): {
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  skippedSteps: number;
  successRate: number;
  totalDuration: number;
  averageStepDuration: number;
} {
  const { metrics } = context;
  const totalExecutedSteps = metrics.completedSteps + metrics.failedSteps;
  const successRate = totalExecutedSteps > 0 ? metrics.completedSteps / totalExecutedSteps : 0;
  const averageStepDuration = totalExecutedSteps > 0 ? metrics.totalDuration / totalExecutedSteps : 0;

  return {
    totalSteps: metrics.totalSteps,
    completedSteps: metrics.completedSteps,
    failedSteps: metrics.failedSteps,
    skippedSteps: metrics.skippedSteps,
    successRate: Math.round(successRate * 100) / 100,
    totalDuration: metrics.totalDuration,
    averageStepDuration: Math.round(averageStepDuration),
  };
}