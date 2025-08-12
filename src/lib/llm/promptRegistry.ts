/**
 * Versioned prompt template registry with in-memory storage
 * Manages prompt templates with versioning and variable interpolation
 */

import { PromptTemplate, PromptVariable } from '../../types/domain';
import { OrchestratorError, createLLMError } from '../errors/OrchestratorError';
import { ERROR_CODES } from '../errors/errorCodes';
import { logger } from '../logging/logger';

export interface TemplateRenderContext {
  variables: Record<string, unknown>;
  functions?: Record<string, (...args: any[]) => any>;
}

export interface RenderedTemplate {
  content: string;
  resolvedVariables: Record<string, unknown>;
  missingVariables: string[];
}

/**
 * Prompt template registry with versioning support
 */
export class PromptRegistry {
  private templates: Map<string, Map<string, PromptTemplate>> = new Map();
  private defaultVersions: Map<string, string> = new Map();

  /**
   * Register a new prompt template
   */
  registerTemplate(template: PromptTemplate): void {
    if (!this.templates.has(template.name)) {
      this.templates.set(template.name, new Map());
    }

    const templateVersions = this.templates.get(template.name)!;
    templateVersions.set(template.version, template);

    // Set as default version if it's the first or if no default is set
    if (!this.defaultVersions.has(template.name)) {
      this.defaultVersions.set(template.name, template.version);
    }

    logger.info('Prompt template registered', {
      name: template.name,
      version: template.version,
      variableCount: template.variables.length,
      tags: template.tags,
    });
  }

  /**
   * Get a prompt template by name and version
   */
  getTemplate(name: string, version?: string): PromptTemplate | null {
    const templateVersions = this.templates.get(name);
    if (!templateVersions) {
      return null;
    }

    const targetVersion = version || this.defaultVersions.get(name);
    if (!targetVersion) {
      return null;
    }

    return templateVersions.get(targetVersion) || null;
  }

  /**
   * Get all versions of a template
   */
  getTemplateVersions(name: string): PromptTemplate[] {
    const templateVersions = this.templates.get(name);
    return templateVersions ? Array.from(templateVersions.values()) : [];
  }

  /**
   * Get all template names
   */
  getTemplateNames(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Set default version for a template
   */
  setDefaultVersion(name: string, version: string): boolean {
    const templateVersions = this.templates.get(name);
    if (!templateVersions || !templateVersions.has(version)) {
      return false;
    }

    this.defaultVersions.set(name, version);
    logger.info('Default template version updated', { name, version });
    return true;
  }

  /**
   * Render a template with provided context
   */
  renderTemplate(
    name: string,
    context: TemplateRenderContext,
    version?: string
  ): RenderedTemplate {
    const template = this.getTemplate(name, version);
    if (!template) {
      throw createLLMError(
        ERROR_CODES.LLM_PROMPT_TEMPLATE_NOT_FOUND,
        `Template '${name}' ${version ? `version '${version}'` : ''} not found`
      );
    }

    return this.renderTemplateContent(template, context);
  }

  /**
   * Render template content with variable substitution
   */
  private renderTemplateContent(
    template: PromptTemplate,
    context: TemplateRenderContext
  ): RenderedTemplate {
    const resolvedVariables: Record<string, unknown> = {};
    const missingVariables: string[] = [];
    let content = template.content;

    // Validate and resolve variables
    for (const variable of template.variables) {
      const value = this.resolveVariable(variable, context);
      
      if (value !== undefined) {
        resolvedVariables[variable.name] = value;
      } else if (variable.required) {
        missingVariables.push(variable.name);
      } else if (variable.defaultValue !== undefined) {
        resolvedVariables[variable.name] = variable.defaultValue;
      }
    }

    // Check for missing required variables
    if (missingVariables.length > 0) {
      throw createLLMError(
        ERROR_CODES.LLM_PROMPT_TEMPLATE_INVALID,
        `Missing required variables: ${missingVariables.join(', ')}`,
        undefined,
        {
          templateName: template.name,
          templateVersion: template.version,
          missingVariables,
        }
      );
    }

    // Replace variables in content
    content = this.substituteVariables(content, resolvedVariables, context.functions);

    return {
      content,
      resolvedVariables,
      missingVariables,
    };
  }

  /**
   * Resolve a variable value from context
   */
  private resolveVariable(
    variable: PromptVariable,
    context: TemplateRenderContext
  ): unknown {
    const value = context.variables[variable.name];

    if (value === undefined) {
      return undefined;
    }

    // Validate the value
    if (!this.validateVariableValue(variable, value)) {
      throw createLLMError(
        ERROR_CODES.LLM_PROMPT_TEMPLATE_INVALID,
        `Invalid value for variable '${variable.name}': expected ${variable.type}`,
        undefined,
        {
          variable: variable.name,
          expectedType: variable.type,
          actualValue: value,
        }
      );
    }

    return value;
  }

  /**
   * Validate variable value against its definition
   */
  private validateVariableValue(variable: PromptVariable, value: unknown): boolean {
    // Type validation
    switch (variable.type) {
      case 'string':
        if (typeof value !== 'string') return false;
        break;
      case 'number':
        if (typeof value !== 'number') return false;
        break;
      case 'boolean':
        if (typeof value !== 'boolean') return false;
        break;
      case 'array':
        if (!Array.isArray(value)) return false;
        break;
      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
        break;
    }

    // Additional validation if specified
    if (variable.validation) {
      const validation = variable.validation;

      if (typeof value === 'string') {
        if (validation.minLength && value.length < validation.minLength) return false;
        if (validation.maxLength && value.length > validation.maxLength) return false;
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) return false;
      }

      if (typeof value === 'number') {
        if (validation.min !== undefined && value < validation.min) return false;
        if (validation.max !== undefined && value > validation.max) return false;
      }

      if (validation.enum && !validation.enum.includes(value)) return false;
    }

    return true;
  }

  /**
   * Substitute variables and functions in template content
   */
  private substituteVariables(
    content: string,
    variables: Record<string, unknown>,
    functions?: Record<string, (...args: any[]) => any>
  ): string {
    // Replace simple variables: {{variableName}}
    content = content.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      const trimmed = expression.trim();
      
      // Check if it's a function call: {{functionName(arg1, arg2)}}
      const functionMatch = trimmed.match(/^(\w+)\((.*)\)$/);
      if (functionMatch && functions) {
        const [, functionName, argsStr] = functionMatch;
        const func = functions[functionName];
        
        if (func) {
          try {
            const args = this.parseArguments(argsStr, variables);
            const result = func(...args);
            return String(result);
          } catch (error) {
            logger.warn('Function call failed in template', {
              functionName,
              error: error instanceof Error ? error.message : String(error),
            });
            return match; // Return original if function fails
          }
        }
      }

      // Simple variable replacement
      const value = this.resolveNestedPath(trimmed, variables);
      return value !== undefined ? String(value) : match;
    });

    return content;
  }

  /**
   * Parse function arguments from string
   */
  private parseArguments(argsStr: string, variables: Record<string, unknown>): any[] {
    if (!argsStr.trim()) return [];

    const args: any[] = [];
    const parts = argsStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      
      // String literal
      if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
          (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        args.push(trimmed.slice(1, -1));
      }
      // Number literal
      else if (!isNaN(Number(trimmed))) {
        args.push(Number(trimmed));
      }
      // Boolean literal
      else if (trimmed === 'true' || trimmed === 'false') {
        args.push(trimmed === 'true');
      }
      // Variable reference
      else {
        const value = this.resolveNestedPath(trimmed, variables);
        args.push(value);
      }
    }

    return args;
  }

  /**
   * Resolve nested object paths like "user.profile.name"
   */
  private resolveNestedPath(path: string, variables: Record<string, unknown>): unknown {
    const parts = path.split('.');
    let current: any = variables;

    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }

    return current;
  }

  /**
   * Search templates by tags
   */
  searchByTags(tags: string[]): PromptTemplate[] {
    const results: PromptTemplate[] = [];

    for (const templateVersions of this.templates.values()) {
      for (const template of templateVersions.values()) {
        if (tags.some(tag => template.tags.includes(tag))) {
          results.push(template);
        }
      }
    }

    return results;
  }

  /**
   * Get template statistics
   */
  getStatistics(): {
    totalTemplates: number;
    totalVersions: number;
    templatesByTag: Record<string, number>;
    averageVariables: number;
  } {
    let totalVersions = 0;
    let totalVariables = 0;
    const tagCounts: Record<string, number> = {};

    for (const templateVersions of this.templates.values()) {
      for (const template of templateVersions.values()) {
        totalVersions++;
        totalVariables += template.variables.length;

        for (const tag of template.tags) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      }
    }

    return {
      totalTemplates: this.templates.size,
      totalVersions,
      templatesByTag: tagCounts,
      averageVariables: totalVersions > 0 ? totalVariables / totalVersions : 0,
    };
  }

  /**
   * Remove a template
   */
  removeTemplate(name: string, version?: string): boolean {
    const templateVersions = this.templates.get(name);
    if (!templateVersions) {
      return false;
    }

    if (version) {
      // Remove specific version
      const removed = templateVersions.delete(version);
      
      // If this was the default version, find a new default
      if (removed && this.defaultVersions.get(name) === version) {
        const remainingVersions = Array.from(templateVersions.keys());
        if (remainingVersions.length > 0) {
          this.defaultVersions.set(name, remainingVersions[0]);
        } else {
          this.defaultVersions.delete(name);
        }
      }

      // Remove template entirely if no versions left
      if (templateVersions.size === 0) {
        this.templates.delete(name);
      }

      if (removed) {
        logger.info('Template version removed', { name, version });
      }

      return removed;
    } else {
      // Remove all versions
      this.templates.delete(name);
      this.defaultVersions.delete(name);
      
      logger.info('Template removed entirely', { name });
      return true;
    }
  }

  /**
   * Clear all templates
   */
  clear(): void {
    this.templates.clear();
    this.defaultVersions.clear();
    logger.info('All templates cleared from registry');
  }

  /**
   * Export templates for backup/migration
   */
  exportTemplates(): PromptTemplate[] {
    const allTemplates: PromptTemplate[] = [];
    
    for (const templateVersions of this.templates.values()) {
      allTemplates.push(...templateVersions.values());
    }
    
    return allTemplates;
  }

  /**
   * Import templates from backup/migration
   */
  importTemplates(templates: PromptTemplate[]): void {
    for (const template of templates) {
      this.registerTemplate(template);
    }
    
    logger.info('Templates imported', { count: templates.length });
  }
}

// Default prompt registry instance
export const promptRegistry = new PromptRegistry();

// Helper function to create a prompt template
export function createPromptTemplate(
  name: string,
  version: string,
  content: string,
  variables: PromptVariable[] = [],
  metadata: Record<string, unknown> = {},
  tags: string[] = []
): PromptTemplate {
  return {
    id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    name,
    version,
    content,
    variables,
    metadata,
    tags,
  };
}