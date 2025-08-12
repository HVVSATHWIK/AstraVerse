/**
 * Basic workflow engine test
 * Tests the core workflow execution functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { WorkflowEngine } from '../../src/lib/workflows/workflowEngine';
import { Workflow, WorkflowStep, LLMStep } from '../../src/types/domain';

describe('WorkflowEngine', () => {
  let engine: WorkflowEngine;
  let testWorkflow: Workflow;

  beforeEach(() => {
    engine = new WorkflowEngine();
    
    // Create a simple test workflow
    const llmStep: LLMStep = {
      id: 'step1',
      type: 'llm',
      name: 'Generate greeting',
      position: 0,
      provider: 'gemini',
      promptTemplateId: 'greeting-template',
      parameters: {
        temperature: 0.7,
        maxTokens: 100,
      },
    };

    testWorkflow = {
      id: 'test-workflow-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Test Workflow',
      description: 'A simple test workflow',
      version: '1.0.0',
      steps: [llmStep],
      status: 'active',
      metadata: {},
    };
  });

  it('should register a workflow', () => {
    engine.registerWorkflow(testWorkflow);
    expect(engine.getStatistics().registeredWorkflows).toBe(1);
  });

  it('should start a workflow run', async () => {
    engine.registerWorkflow(testWorkflow);
    
    const run = await engine.startWorkflow('test-workflow-1', {
      userName: 'John Doe',
    });

    expect(run).toBeDefined();
    expect(run.workflowId).toBe('test-workflow-1');
    expect(['queued', 'running', 'completed']).toContain(run.status); // Allow any of these states
    expect(run.input).toEqual({ userName: 'John Doe' });
  });

  it('should reject invalid workflow ID', async () => {
    await expect(
      engine.startWorkflow('invalid-workflow', {})
    ).rejects.toThrow('Workflow with ID invalid-workflow not found');
  });

  it('should track run status', async () => {
    engine.registerWorkflow(testWorkflow);
    
    const run = await engine.startWorkflow('test-workflow-1', {});
    const status = engine.getRunStatus(run.id);
    
    expect(status).toBeDefined();
    expect(status!.id).toBe(run.id);
  });

  it('should provide engine statistics', () => {
    engine.registerWorkflow(testWorkflow);
    
    const stats = engine.getStatistics();
    expect(stats.registeredWorkflows).toBe(1);
    expect(stats.queuedRuns).toBe(0);
    expect(stats.activeRuns).toBe(0);
    expect(stats.registeredExecutors).toBeGreaterThan(0);
  });

  it('should cancel a workflow run', async () => {
    engine.registerWorkflow(testWorkflow);
    
    const run = await engine.startWorkflow('test-workflow-1', {});
    
    // Try to cancel immediately - might succeed or fail if already completed
    const cancelled = await engine.cancelRun(run.id);
    
    // The test passes if cancellation succeeds OR if the run completed too quickly
    const status = engine.getRunStatus(run.id);
    const isValidOutcome = cancelled === true || status?.status === 'completed';
    
    expect(isValidOutcome).toBe(true);
  });
});