/**
 * In-memory circuit breaker implementation
 * Provides resilience patterns for integration failures
 */

import { CircuitBreakerConfig } from '../../types/domain';
import { logger } from '../logging/logger';

export type CircuitBreakerState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerStats {
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  totalRequests: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  nextAttemptTime?: Date;
}

/**
 * Circuit breaker implementation with state management
 */
export class CircuitBreaker {
  private config: Required<CircuitBreakerConfig>;
  private state: CircuitBreakerState = 'closed';
  private failureCount = 0;
  private successCount = 0;
  private totalRequests = 0;
  private lastFailureTime?: Date;
  private lastSuccessTime?: Date;
  private nextAttemptTime?: Date;
  private monitoringTimer?: NodeJS.Timeout;

  constructor(
    private name: string,
    config: CircuitBreakerConfig
  ) {
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      recoveryTimeout: config.recoveryTimeout || 60000,
      monitoringPeriod: config.monitoringPeriod || 10000,
    };

    this.startMonitoring();
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.canAttemptReset()) {
        this.state = 'half-open';
        logger.info('Circuit breaker entering half-open state', {
          name: this.name,
          failureCount: this.failureCount,
        });
      } else {
        throw new Error(`Circuit breaker is open for ${this.name}`);
      }
    }

    this.totalRequests++;

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.successCount++;
    this.lastSuccessTime = new Date();

    if (this.state === 'half-open') {
      this.reset();
      logger.info('Circuit breaker reset to closed state', {
        name: this.name,
        successCount: this.successCount,
      });
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    if (this.state === 'half-open') {
      this.trip();
    } else if (this.failureCount >= this.config.failureThreshold) {
      this.trip();
    }
  }

  /**
   * Trip the circuit breaker to open state
   */
  private trip(): void {
    this.state = 'open';
    this.nextAttemptTime = new Date(Date.now() + this.config.recoveryTimeout);
    
    logger.warn('Circuit breaker tripped to open state', {
      name: this.name,
      failureCount: this.failureCount,
      nextAttemptTime: this.nextAttemptTime.toISOString(),
    });
  }

  /**
   * Reset the circuit breaker to closed state
   */
  private reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.nextAttemptTime = undefined;
  }

  /**
   * Check if we can attempt to reset the circuit breaker
   */
  private canAttemptReset(): boolean {
    return this.nextAttemptTime ? new Date() >= this.nextAttemptTime : false;
  }

  /**
   * Start monitoring and periodic cleanup
   */
  private startMonitoring(): void {
    this.monitoringTimer = setInterval(() => {
      this.performMonitoring();
    }, this.config.monitoringPeriod);
  }

  /**
   * Perform monitoring tasks
   */
  private performMonitoring(): void {
    const now = new Date();
    
    // Reset counters periodically to prevent stale data
    const resetInterval = this.config.monitoringPeriod * 6; // 1 minute if monitoring every 10 seconds
    
    if (this.lastFailureTime && (now.getTime() - this.lastFailureTime.getTime()) > resetInterval) {
      if (this.state === 'closed') {
        this.failureCount = 0;
      }
    }

    logger.debug('Circuit breaker monitoring', {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      totalRequests: this.totalRequests,
    });
  }

  /**
   * Get current circuit breaker statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      totalRequests: this.totalRequests,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      nextAttemptTime: this.nextAttemptTime,
    };
  }

  /**
   * Manually reset the circuit breaker
   */
  manualReset(): void {
    this.reset();
    logger.info('Circuit breaker manually reset', { name: this.name });
  }

  /**
   * Manually trip the circuit breaker
   */
  manualTrip(): void {
    this.trip();
    logger.info('Circuit breaker manually tripped', { name: this.name });
  }

  /**
   * Check if circuit breaker is open
   */
  isOpen(): boolean {
    return this.state === 'open';
  }

  /**
   * Check if circuit breaker is closed
   */
  isClosed(): boolean {
    return this.state === 'closed';
  }

  /**
   * Check if circuit breaker is half-open
   */
  isHalfOpen(): boolean {
    return this.state === 'half-open';
  }

  /**
   * Get failure rate (0-1)
   */
  getFailureRate(): number {
    if (this.totalRequests === 0) return 0;
    return this.failureCount / this.totalRequests;
  }

  /**
   * Get success rate (0-1)
   */
  getSuccessRate(): number {
    if (this.totalRequests === 0) return 0;
    return this.successCount / this.totalRequests;
  }

  /**
   * Destroy the circuit breaker and cleanup
   */
  destroy(): void {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = undefined;
    }
    
    logger.info('Circuit breaker destroyed', { name: this.name });
  }
}

/**
 * Circuit breaker manager for handling multiple circuit breakers
 */
export class CircuitBreakerManager {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();

  /**
   * Get or create a circuit breaker
   */
  getCircuitBreaker(name: string, config: CircuitBreakerConfig): CircuitBreaker {
    let circuitBreaker = this.circuitBreakers.get(name);
    
    if (!circuitBreaker) {
      circuitBreaker = new CircuitBreaker(name, config);
      this.circuitBreakers.set(name, circuitBreaker);
      
      logger.info('Circuit breaker created', {
        name,
        config,
      });
    }
    
    return circuitBreaker;
  }

  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(
    name: string,
    fn: () => Promise<T>,
    config: CircuitBreakerConfig
  ): Promise<T> {
    const circuitBreaker = this.getCircuitBreaker(name, config);
    return circuitBreaker.execute(fn);
  }

  /**
   * Get stats for all circuit breakers
   */
  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};
    
    for (const [name, circuitBreaker] of this.circuitBreakers.entries()) {
      stats[name] = circuitBreaker.getStats();
    }
    
    return stats;
  }

  /**
   * Get stats for a specific circuit breaker
   */
  getStats(name: string): CircuitBreakerStats | null {
    const circuitBreaker = this.circuitBreakers.get(name);
    return circuitBreaker ? circuitBreaker.getStats() : null;
  }

  /**
   * Reset a circuit breaker
   */
  reset(name: string): boolean {
    const circuitBreaker = this.circuitBreakers.get(name);
    if (circuitBreaker) {
      circuitBreaker.manualReset();
      return true;
    }
    return false;
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    for (const circuitBreaker of this.circuitBreakers.values()) {
      circuitBreaker.manualReset();
    }
    
    logger.info('All circuit breakers reset');
  }

  /**
   * Remove a circuit breaker
   */
  remove(name: string): boolean {
    const circuitBreaker = this.circuitBreakers.get(name);
    if (circuitBreaker) {
      circuitBreaker.destroy();
      this.circuitBreakers.delete(name);
      
      logger.info('Circuit breaker removed', { name });
      return true;
    }
    return false;
  }

  /**
   * Get list of circuit breaker names
   */
  getNames(): string[] {
    return Array.from(this.circuitBreakers.keys());
  }

  /**
   * Get count of circuit breakers
   */
  getCount(): number {
    return this.circuitBreakers.size;
  }

  /**
   * Destroy all circuit breakers
   */
  destroy(): void {
    for (const circuitBreaker of this.circuitBreakers.values()) {
      circuitBreaker.destroy();
    }
    
    this.circuitBreakers.clear();
    logger.info('Circuit breaker manager destroyed');
  }

  /**
   * Get health summary
   */
  getHealthSummary(): {
    total: number;
    closed: number;
    open: number;
    halfOpen: number;
    averageFailureRate: number;
  } {
    const total = this.circuitBreakers.size;
    let closed = 0;
    let open = 0;
    let halfOpen = 0;
    let totalFailureRate = 0;

    for (const circuitBreaker of this.circuitBreakers.values()) {
      const stats = circuitBreaker.getStats();
      
      switch (stats.state) {
        case 'closed':
          closed++;
          break;
        case 'open':
          open++;
          break;
        case 'half-open':
          halfOpen++;
          break;
      }
      
      totalFailureRate += circuitBreaker.getFailureRate();
    }

    return {
      total,
      closed,
      open,
      halfOpen,
      averageFailureRate: total > 0 ? totalFailureRate / total : 0,
    };
  }
}

// Default circuit breaker manager instance
export const circuitBreakerManager = new CircuitBreakerManager();

/**
 * Decorator function for circuit breaker protection
 */
export function withCircuitBreaker(
  name: string,
  config: CircuitBreakerConfig
) {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const originalMethod = descriptor.value!;

    descriptor.value = async function (...args: any[]) {
      return circuitBreakerManager.execute(
        `${target.constructor.name}.${propertyKey}.${name}`,
        () => originalMethod.apply(this, args),
        config
      );
    } as T;

    return descriptor;
  };
}