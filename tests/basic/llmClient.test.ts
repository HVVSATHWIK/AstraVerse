/**
 * Basic LLM client test
 * Tests LLM provider registration and generation functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LLMClient } from '../../src/lib/llm/llmClient';
import { LLMProvider } from '../../src/types/domain';

describe('LLMClient', () => {
  let client: LLMClient;
  let testProvider: LLMProvider;

  beforeEach(() => {
    client = new LLMClient();
    
    // Create a test provider
    testProvider = {
      id: 'test-gemini',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Test Gemini Provider',
      type: 'gemini',
      configuration: {
        apiKey: 'test-api-key',
        baseUrl: 'https://generativelanguage.googleapis.com/v1',
        timeout: 30000,
      },
      status: 'active',
      supportedModels: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    };
  });

  it('should register an LLM provider', () => {
    client.registerProvider(testProvider);
    
    const providers = client.getProviders();
    expect(providers).toHaveLength(1);
    expect(providers[0].id).toBe('test-gemini');
  });

  it('should set default provider', () => {
    client.registerProvider(testProvider);
    client.setDefaultProvider('test-gemini');
    
    // Should not throw when generating without explicit provider
    expect(() => client.setDefaultProvider('test-gemini')).not.toThrow();
  });

  it('should get supported models', () => {
    client.registerProvider(testProvider);
    
    const models = client.getSupportedModels('test-gemini');
    expect(models).toEqual(['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro']);
  });

  it('should validate model support', () => {
    client.registerProvider(testProvider);
    
    expect(client.isModelSupported('test-gemini', 'gemini-pro')).toBe(true);
    expect(client.isModelSupported('test-gemini', 'gpt-4')).toBe(false);
  });

  it('should get all supported models', () => {
    client.registerProvider(testProvider);
    
    const allModels = client.getAllSupportedModels();
    expect(allModels['test-gemini']).toEqual(['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro']);
  });

  it('should remove a provider', () => {
    client.registerProvider(testProvider);
    expect(client.getProviderCount()).toBe(1);
    
    const removed = client.removeProvider('test-gemini');
    expect(removed).toBe(true);
    expect(client.getProviderCount()).toBe(0);
  });

  it('should clear all providers', () => {
    client.registerProvider(testProvider);
    expect(client.getProviderCount()).toBe(1);
    
    client.clearProviders();
    expect(client.getProviderCount()).toBe(0);
  });

  it('should reject invalid provider type', () => {
    const invalidProvider = {
      ...testProvider,
      type: 'invalid-provider',
    };
    
    expect(() => client.registerProvider(invalidProvider)).toThrow();
  });

  it('should reject text generation without provider', async () => {
    await expect(
      client.generateText({
        prompt: 'Hello world',
      }, 'test-correlation-id')
    ).rejects.toThrow('No provider specified and no default provider set');
  });

  it('should reject text generation with unknown provider', async () => {
    await expect(
      client.generateText({
        prompt: 'Hello world',
      }, 'test-correlation-id', 'unknown-provider')
    ).rejects.toThrow('Provider unknown-provider not found');
  });
});