
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Activity
} from 'lucide-react';
import { Agent, AgentEvent } from '@/types/agents';
import { getStatusColor, formatTimestamp } from './TimelineUtilities';

interface EventTimelineItemProps {
  event: AgentEvent;
  agent?: Agent;
  showAllAgents: boolean;
}

const EventTimelineItem = ({ event, agent, showAllAgents }: EventTimelineItemProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running':
      case 'active':
        return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div key={event.id} className="flex items-start space-x-4 p-4 border-l-2 border-slate-700/50 hover:border-purple-500/50 transition-colors">
      <div className="flex-shrink-0 mt-1">
        {getStatusIcon(event.severity)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white font-medium capitalize">{event.type.replace('_', ' ')}</span>
          <span className="text-slate-500 text-xs">{formatTimestamp(event.timestamp)}</span>
        </div>
        <p className="text-slate-300 text-sm mb-1">{event.message}</p>
        <div className="flex items-center space-x-4 text-xs text-slate-500">
          {showAllAgents && agent && (
            <span>Agent: {agent.name}</span>
          )}
          <Badge className={getStatusColor(event.severity)}>
            {event.severity}
          </Badge>
        </div>
        {event.metadata && (
          <div className="mt-2 p-2 bg-slate-700/30 rounded text-xs text-slate-400">
            {Object.entries(event.metadata).map(([key, value]) => (
              <div key={key}>
                <span className="text-slate-500">{key}:</span> {String(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTimelineItem;
