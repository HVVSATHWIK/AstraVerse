
import { useQuery } from '@tanstack/react-query';
import { AgentStats, AgentCluster } from '@/types/agents';

export const useAgentStats = () => {
  return useQuery({
    queryKey: ['agent-stats'],
    queryFn: async () => {
      const response = await fetch('/api/agents/stats');
      const result = await response.json();
      return result.data as AgentStats;
    },
    refetchInterval: 30000,
  });
};

export const useAgentClusters = () => {
  return useQuery({
    queryKey: ['clusters'],
    queryFn: async () => {
      const response = await fetch('/api/clusters');
      const result = await response.json();
      return result.data as AgentCluster[];
    },
    refetchInterval: 30000,
  });
};
