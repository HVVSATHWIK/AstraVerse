
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Agent } from '@/types/agents';
import { agentSimulation } from '@/services/agentSimulation';

export const useAgents = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/agents');
      const result = await response.json();
      return result.data as Agent[];
    },
    refetchInterval: 30000,
  });

  // Subscribe to real-time agent updates
  useEffect(() => {
    const unsubscribe = agentSimulation.onAgentUpdate((updatedAgent) => {
      queryClient.setQueryData(['agents'], (old: Agent[] | undefined) => {
        if (!old) return old;
        return old.map(agent => 
          agent.id === updatedAgent.id ? updatedAgent : agent
        );
      });
    });

    return unsubscribe;
  }, [queryClient]);

  return query;
};
