import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users } from 'lucide-react';
import AgentManagementPanel from '@/components/agents/AgentManagementPanel';
import AgentDetailPanel from '@/components/agents/AgentDetailPanel';
import CreateAgentForm from '@/components/agents/CreateAgentForm';
import { useAgentsQuery } from '@/hooks/useAgentService';

const AgentsTab = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: agents, isLoading } = useAgentsQuery();

  return (
    <TabsContent value="agents" className="space-y-8">
      <section className="space-y-6 animate-fade-in-3d">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white text-3d">Agent Management</h2>
          <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1 ml-6"></div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-slate-400">
            Create and manage AI agents to automate tasks and workflows
          </p>
          
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent List */}
          <div className="animate-scale-in-3d stagger-1">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>Available Agents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-slate-700/50 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : agents && agents.length > 0 ? (
                  <div className="space-y-3">
                    {agents.map(agent => (
                      <div 
                        key={agent.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedAgentId === agent.id 
                            ? 'bg-purple-500/20 border border-purple-500/50' 
                            : 'bg-slate-700/50 border border-slate-600 hover:bg-slate-700'
                        }`}
                        onClick={() => setSelectedAgentId(agent.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            agent.status === 'active' ? 'bg-green-400 animate-pulse' :
                            agent.status === 'busy' ? 'bg-blue-400 animate-pulse' :
                            agent.status === 'error' ? 'bg-red-400' : 'bg-slate-400'
                          }`} />
                          <div>
                            <h4 className="text-white font-medium">{agent.name}</h4>
                            <p className="text-slate-400 text-sm">{agent.type}</p>
                          </div>
                        </div>
                      </div>
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
          </div>

          {/* Agent Details */}
          <div className="lg:col-span-2 animate-scale-in-3d stagger-2">
            {selectedAgentId ? (
              <AgentDetailPanel 
                agentId={selectedAgentId} 
                onDeleted={() => setSelectedAgentId(null)} 
              />
            ) : (
              <AgentManagementPanel />
            )}
          </div>
        </div>
      </section>
    </TabsContent>
  );
};

export default AgentsTab;