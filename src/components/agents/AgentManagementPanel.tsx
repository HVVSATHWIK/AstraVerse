import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Activity } from 'lucide-react';
import { useAgentsQuery } from '@/hooks/useAgentService';
import AgentCard from '@/components/AgentCard';
import CreateAgentForm from '@/components/agents/CreateAgentForm';
import AgentTimeline from '@/components/AgentTimeline';

const AgentManagementPanel = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: agents, isLoading } = useAgentsQuery();

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(selectedAgent === agentId ? null : agentId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Users className="w-6 h-6 text-purple-400" />
          <span>Agent Management</span>
        </h2>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
            </DialogHeader>
            <CreateAgentForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="agents" className="text-slate-300">Agents</TabsTrigger>
          <TabsTrigger value="timeline" className="text-slate-300">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span>Active Agents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-48 bg-slate-700/50 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : agents && agents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map(agent => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      isSelected={selectedAgent === agent.id}
                      onSelect={handleAgentSelect}
                      onCommand={() => {}}
                      isCommandPending={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">No agents found</p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Agent
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <AgentTimeline 
            agentId={selectedAgent || undefined}
            showAllAgents={!selectedAgent}
            maxHeight="600px"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentManagementPanel;