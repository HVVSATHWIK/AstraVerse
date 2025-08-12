/**
 * In-memory RunEvents store for append-only event logging
 * Provides event storage and retrieval for workflow execution tracking
 */

import { RunEvent, RunEventType } from '../../types/domain';
import { logger } from '../logging/logger';

export interface EventFilter {
  runId?: string;
  type?: RunEventType;
  correlationId?: string;
  fromTimestamp?: Date;
  toTimestamp?: Date;
  limit?: number;
  offset?: number;
}

export interface EventQuery extends EventFilter {
  orderBy?: 'timestamp' | 'type';
  orderDirection?: 'asc' | 'desc';
}

/**
 * In-memory event store implementation
 * In production, this would be replaced with a persistent storage solution
 */
export class RunEventStore {
  private events: Map<string, RunEvent> = new Map();
  private runEventsByRunId: Map<string, string[]> = new Map();
  private eventsByCorrelationId: Map<string, string[]> = new Map();
  private eventsByType: Map<RunEventType, string[]> = new Map();

  /**
   * Append a new event to the store
   */
  async appendEvent(event: RunEvent): Promise<void> {
    const eventLogger = logger.withCorrelationId(event.correlationId);
    
    try {
      // Validate event
      if (!event.id || !event.runId || !event.type) {
        throw new Error('Event must have id, runId, and type');
      }

      // Check for duplicate event ID
      if (this.events.has(event.id)) {
        throw new Error(`Event with ID ${event.id} already exists`);
      }

      // Store the event
      this.events.set(event.id, { ...event });

      // Update indexes
      this.updateIndexes(event);

      eventLogger.debug('Event appended to store', {
        eventId: event.id,
        runId: event.runId,
        type: event.type,
        timestamp: event.timestamp.toISOString(),
      });
    } catch (error) {
      eventLogger.error('Failed to append event', error as Error, {
        eventId: event.id,
        runId: event.runId,
        type: event.type,
      });
      throw error;
    }
  }

  /**
   * Append multiple events in batch
   */
  async appendEvents(events: RunEvent[]): Promise<void> {
    for (const event of events) {
      await this.appendEvent(event);
    }
  }

  /**
   * Get events by run ID
   */
  async getEventsByRunId(runId: string, filter?: EventFilter): Promise<RunEvent[]> {
    const eventIds = this.runEventsByRunId.get(runId) || [];
    const events = eventIds
      .map(id => this.events.get(id)!)
      .filter(event => this.matchesFilter(event, filter));

    return this.sortAndPaginate(events, {
      ...filter,
      orderBy: filter?.orderBy || 'timestamp',
      orderDirection: filter?.orderDirection || 'asc',
    });
  }

  /**
   * Get events by correlation ID
   */
  async getEventsByCorrelationId(correlationId: string, filter?: EventFilter): Promise<RunEvent[]> {
    const eventIds = this.eventsByCorrelationId.get(correlationId) || [];
    const events = eventIds
      .map(id => this.events.get(id)!)
      .filter(event => this.matchesFilter(event, filter));

    return this.sortAndPaginate(events, {
      ...filter,
      orderBy: filter?.orderBy || 'timestamp',
      orderDirection: filter?.orderDirection || 'asc',
    });
  }

  /**
   * Get events by type
   */
  async getEventsByType(type: RunEventType, filter?: EventFilter): Promise<RunEvent[]> {
    const eventIds = this.eventsByType.get(type) || [];
    const events = eventIds
      .map(id => this.events.get(id)!)
      .filter(event => this.matchesFilter(event, filter));

    return this.sortAndPaginate(events, {
      ...filter,
      orderBy: filter?.orderBy || 'timestamp',
      orderDirection: filter?.orderDirection || 'asc',
    });
  }

  /**
   * Query events with advanced filtering
   */
  async queryEvents(query: EventQuery): Promise<RunEvent[]> {
    let events = Array.from(this.events.values());

    // Apply filters
    if (query.runId) {
      events = events.filter(event => event.runId === query.runId);
    }

    if (query.type) {
      events = events.filter(event => event.type === query.type);
    }

    if (query.correlationId) {
      events = events.filter(event => event.correlationId === query.correlationId);
    }

    if (query.fromTimestamp) {
      events = events.filter(event => event.timestamp >= query.fromTimestamp!);
    }

    if (query.toTimestamp) {
      events = events.filter(event => event.timestamp <= query.toTimestamp!);
    }

    return this.sortAndPaginate(events, query);
  }

  /**
   * Get a single event by ID
   */
  async getEventById(id: string): Promise<RunEvent | null> {
    return this.events.get(id) || null;
  }

  /**
   * Get the latest event for a run
   */
  async getLatestEventForRun(runId: string): Promise<RunEvent | null> {
    const events = await this.getEventsByRunId(runId);
    if (events.length === 0) {
      return null;
    }

    return events.reduce((latest, current) => 
      current.timestamp > latest.timestamp ? current : latest
    );
  }

  /**
   * Get event count by run ID
   */
  async getEventCountByRunId(runId: string): Promise<number> {
    const eventIds = this.runEventsByRunId.get(runId) || [];
    return eventIds.length;
  }

  /**
   * Get total event count
   */
  async getTotalEventCount(): Promise<number> {
    return this.events.size;
  }

  /**
   * Get event statistics
   */
  async getEventStatistics(): Promise<{
    totalEvents: number;
    eventsByType: Record<RunEventType, number>;
    uniqueRuns: number;
    uniqueCorrelations: number;
    oldestEvent?: Date;
    newestEvent?: Date;
  }> {
    const events = Array.from(this.events.values());
    
    if (events.length === 0) {
      return {
        totalEvents: 0,
        eventsByType: {} as Record<RunEventType, number>,
        uniqueRuns: 0,
        uniqueCorrelations: 0,
      };
    }

    const eventsByType: Record<string, number> = {};
    let oldestEvent = events[0].timestamp;
    let newestEvent = events[0].timestamp;

    for (const event of events) {
      // Count by type
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;

      // Track oldest/newest
      if (event.timestamp < oldestEvent) {
        oldestEvent = event.timestamp;
      }
      if (event.timestamp > newestEvent) {
        newestEvent = event.timestamp;
      }
    }

    return {
      totalEvents: events.length,
      eventsByType: eventsByType as Record<RunEventType, number>,
      uniqueRuns: this.runEventsByRunId.size,
      uniqueCorrelations: this.eventsByCorrelationId.size,
      oldestEvent,
      newestEvent,
    };
  }

  /**
   * Clear all events (for testing/maintenance)
   */
  async clearAllEvents(): Promise<void> {
    this.events.clear();
    this.runEventsByRunId.clear();
    this.eventsByCorrelationId.clear();
    this.eventsByType.clear();

    logger.info('All events cleared from store');
  }

  /**
   * Clear events older than specified date
   */
  async clearEventsOlderThan(date: Date): Promise<number> {
    const eventsToRemove: string[] = [];
    
    for (const [id, event] of this.events.entries()) {
      if (event.timestamp < date) {
        eventsToRemove.push(id);
      }
    }

    for (const id of eventsToRemove) {
      const event = this.events.get(id)!;
      this.events.delete(id);
      this.removeFromIndexes(event);
    }

    logger.info('Cleared old events from store', {
      removedCount: eventsToRemove.length,
      olderThan: date.toISOString(),
    });

    return eventsToRemove.length;
  }

  /**
   * Update indexes when adding an event
   */
  private updateIndexes(event: RunEvent): void {
    // Index by run ID
    if (!this.runEventsByRunId.has(event.runId)) {
      this.runEventsByRunId.set(event.runId, []);
    }
    this.runEventsByRunId.get(event.runId)!.push(event.id);

    // Index by correlation ID
    if (!this.eventsByCorrelationId.has(event.correlationId)) {
      this.eventsByCorrelationId.set(event.correlationId, []);
    }
    this.eventsByCorrelationId.get(event.correlationId)!.push(event.id);

    // Index by type
    if (!this.eventsByType.has(event.type)) {
      this.eventsByType.set(event.type, []);
    }
    this.eventsByType.get(event.type)!.push(event.id);
  }

  /**
   * Remove event from indexes
   */
  private removeFromIndexes(event: RunEvent): void {
    // Remove from run ID index
    const runEvents = this.runEventsByRunId.get(event.runId);
    if (runEvents) {
      const index = runEvents.indexOf(event.id);
      if (index > -1) {
        runEvents.splice(index, 1);
      }
      if (runEvents.length === 0) {
        this.runEventsByRunId.delete(event.runId);
      }
    }

    // Remove from correlation ID index
    const correlationEvents = this.eventsByCorrelationId.get(event.correlationId);
    if (correlationEvents) {
      const index = correlationEvents.indexOf(event.id);
      if (index > -1) {
        correlationEvents.splice(index, 1);
      }
      if (correlationEvents.length === 0) {
        this.eventsByCorrelationId.delete(event.correlationId);
      }
    }

    // Remove from type index
    const typeEvents = this.eventsByType.get(event.type);
    if (typeEvents) {
      const index = typeEvents.indexOf(event.id);
      if (index > -1) {
        typeEvents.splice(index, 1);
      }
      if (typeEvents.length === 0) {
        this.eventsByType.delete(event.type);
      }
    }
  }

  /**
   * Check if event matches filter criteria
   */
  private matchesFilter(event: RunEvent, filter?: EventFilter): boolean {
    if (!filter) return true;

    if (filter.runId && event.runId !== filter.runId) return false;
    if (filter.type && event.type !== filter.type) return false;
    if (filter.correlationId && event.correlationId !== filter.correlationId) return false;
    if (filter.fromTimestamp && event.timestamp < filter.fromTimestamp) return false;
    if (filter.toTimestamp && event.timestamp > filter.toTimestamp) return false;

    return true;
  }

  /**
   * Sort and paginate events
   */
  private sortAndPaginate(events: RunEvent[], query: EventQuery): RunEvent[] {
    // Sort events
    events.sort((a, b) => {
      const orderBy = query.orderBy || 'timestamp';
      const direction = query.orderDirection === 'desc' ? -1 : 1;

      if (orderBy === 'timestamp') {
        return direction * (a.timestamp.getTime() - b.timestamp.getTime());
      } else if (orderBy === 'type') {
        return direction * a.type.localeCompare(b.type);
      }

      return 0;
    });

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit;

    if (limit !== undefined) {
      return events.slice(offset, offset + limit);
    }

    return events.slice(offset);
  }
}

// Default event store instance
export const eventStore = new RunEventStore();

// Helper function to create a run event
export function createRunEvent(
  runId: string,
  type: RunEventType,
  correlationId: string,
  payload: Record<string, unknown> = {}
): RunEvent {
  return {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    runId,
    type,
    timestamp: new Date(),
    payload,
    correlationId,
  };
}

// Helper functions for common event types
export function createRunStartedEvent(
  runId: string,
  correlationId: string,
  payload?: Record<string, unknown>
): RunEvent {
  return createRunEvent(runId, 'run.started', correlationId, payload);
}

export function createRunCompletedEvent(
  runId: string,
  correlationId: string,
  payload?: Record<string, unknown>
): RunEvent {
  return createRunEvent(runId, 'run.completed', correlationId, payload);
}

export function createRunFailedEvent(
  runId: string,
  correlationId: string,
  payload?: Record<string, unknown>
): RunEvent {
  return createRunEvent(runId, 'run.failed', correlationId, payload);
}

export function createStepStartedEvent(
  runId: string,
  correlationId: string,
  stepId: string,
  payload?: Record<string, unknown>
): RunEvent {
  return createRunEvent(runId, 'step.started', correlationId, { ...payload, stepId });
}

export function createStepCompletedEvent(
  runId: string,
  correlationId: string,
  stepId: string,
  payload?: Record<string, unknown>
): RunEvent {
  return createRunEvent(runId, 'step.completed', correlationId, { ...payload, stepId });
}

export function createStepFailedEvent(
  runId: string,
  correlationId: string,
  stepId: string,
  payload?: Record<string, unknown>
): RunEvent {
  return createRunEvent(runId, 'step.failed', correlationId, { ...payload, stepId });
}