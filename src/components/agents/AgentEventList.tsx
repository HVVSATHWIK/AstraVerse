import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Activity
} from 'lucide-react';
import { useAgentEventsQuery } from '@/hooks/useAgentService';
import { formatTimestamp } from '@/components/TimelineUtilities';

interface AgentEventListProps {
  agentId: string;
}

const AgentEventList = ({ agentId }: AgentEventListProps) => {
  const { data: events, isLoading } = useAgentEventsQuery(agentId);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Agent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-700/50 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Agent Events</CardTitle>
      </CardHeader>
      <CardContent>
        {events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(event.severity)}
                    <h4 className="text-white font-medium capitalize">{event.type.replace('_', ' ')}</h4>
                  </div>
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                </div>
                
                <p className="text-slate-300 text-sm mb-2">{event.message}</p>
                
                {event.metadata && (
                  <div className="bg-slate-800/50 p-2 rounded text-xs text-slate-400 mb-2">
                    {Object.entries(event.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>{key}:</span>
                        <span>{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-slate-500 mt-2">
                  {formatTimestamp(event.timestamp)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No events found for this agent</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentEventList;