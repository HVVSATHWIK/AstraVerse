
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface RealtimeContextType {
  isConnected: boolean;
  lastUpdate: Date | null;
  toggleRealtime: () => void;
  isRealtimeEnabled: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isRealtimeEnabled) return;

    const interval = setInterval(() => {
      // Simulate real-time updates by invalidating queries
      queryClient.invalidateQueries({ queryKey: ['system-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      
      setLastUpdate(new Date());
      setIsConnected(true);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [queryClient, isRealtimeEnabled]);

  const toggleRealtime = () => {
    setIsRealtimeEnabled(!isRealtimeEnabled);
    toast({
      title: isRealtimeEnabled ? "Real-time updates disabled" : "Real-time updates enabled",
      description: isRealtimeEnabled 
        ? "Dashboard will no longer auto-refresh" 
        : "Dashboard will refresh every 30 seconds",
    });
  };

  return (
    <RealtimeContext.Provider value={{
      isConnected,
      lastUpdate,
      toggleRealtime,
      isRealtimeEnabled
    }}>
      {children}
    </RealtimeContext.Provider>
  );
};
