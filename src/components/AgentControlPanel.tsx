
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap } from 'lucide-react';
import { useAgents } from '@/hooks/useAgents';
import { useAgentStats, useAgentClusters } from '@/hooks/useAgentStats';
import { useAgentCommand } from '@/hooks/useAgentCommands';
import SystemOverview from './SystemOverview';
import AgentCard from './AgentCard';
import ClusterCard from './ClusterCard';

const AgentControlPanel = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Use the new hooks
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const { data: stats, isLoading: statsLoading } = useAgentStats();
  const { data: clusters, isLoading: clustersLoading } = useAgentClusters();
  const commandMutation = useAgentCommand();

  const executeCommand = (agentId: string, command: string, parameters?: any) => {
    commandMutation.mutate({ agentId, command, parameters });
  };

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(selectedAgent === agentId ? null : agentId);
  };

  if (agentsLoading || statsLoading || clustersLoading) {
    return (
      <div className="space-y-6">
        <SystemOverview stats={undefined} isLoading={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview Stats */}
      <SystemOverview stats={stats} isLoading={statsLoading} />

      {/* Agent Management Tabs */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span>Agent Control Center</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="agents" className="w-full">
            <TabsList className="bg-slate-700/50 border-slate-600">
              <TabsTrigger value="agents" className="data-[state=active]:bg-purple-600">
                Agents ({agents?.length})
              </TabsTrigger>
              <TabsTrigger value="clusters" className="data-[state=active]:bg-purple-600">
                Clusters ({clusters?.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="agents" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents?.map(agent => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedAgent === agent.id}
                    onSelect={handleAgentSelect}
                    onCommand={executeCommand}
                    isCommandPending={commandMutation.isPending}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="clusters" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clusters?.map(cluster => (
                  <ClusterCard key={cluster.id} cluster={cluster} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentControlPanel;
