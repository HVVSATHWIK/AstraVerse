import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { realtimeService } from '@/services/realtimeService';
import { supabase } from '@/integrations/supabase/client';

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

    console.log('Setting up realtime subscriptions...');

    // Set up Supabase real-time subscriptions
    const metricsSubscription = supabase
      .channel('metrics_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'metrics' 
        }, 
        (payload) => {
          console.log('Metrics table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['metrics'] });
          setLastUpdate(new Date());
          setIsConnected(true);
        }
      )
      .subscribe();

    // Subscribe to various real-time events
    const unsubscribeMetrics = realtimeService.subscribe('metrics-update', (data: any) => {
      console.log('Received metrics update:', data);
      queryClient.invalidateQueries({ queryKey: ['system-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      setLastUpdate(new Date());
      setIsConnected(true);
    });

    const unsubscribeActivity = realtimeService.subscribe('activity-update', (data: any) => {
      console.log('Received activity update:', data);
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      queryClient.invalidateQueries({ queryKey: ['user-activity-logs'] });
      setLastUpdate(new Date());
    });

    const unsubscribeNotifications = realtimeService.subscribe('notification', (data: any) => {
      console.log('Received notification:', data);
      if (data.type === 'error') {
        toast({
          title: data.title || "System Alert",
          description: data.message,
          variant: "destructive",
        });
      } else if (data.type === 'success') {
        toast({
          title: data.title || "Success",
          description: data.message,
        });
      }
      setLastUpdate(new Date());
    });

    const unsubscribeSystemStatus = realtimeService.subscribe('system-status', (data: any) => {
      console.log('Received system status:', data);
      setIsConnected(data.status === 'online');
      setLastUpdate(new Date());
    });

    // Periodic refresh for queries
    const interval = setInterval(() => {
      if (isRealtimeEnabled) {
        queryClient.invalidateQueries({ queryKey: ['system-metrics'] });
        queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
        queryClient.invalidateQueries({ queryKey: ['kpis'] });
        queryClient.invalidateQueries({ queryKey: ['user-activity-logs'] });
        queryClient.invalidateQueries({ queryKey: ['metrics'] });
        setLastUpdate(new Date());
      }
    }, 30000);

    return () => {
      console.log('Cleaning up realtime subscriptions...');
      metricsSubscription.unsubscribe();
      unsubscribeMetrics();
      unsubscribeActivity();
      unsubscribeNotifications();
      unsubscribeSystemStatus();
      clearInterval(interval);
    };
  }, [queryClient, isRealtimeEnabled]);

  const toggleRealtime = () => {
    const newState = !isRealtimeEnabled;
    setIsRealtimeEnabled(newState);
    
    toast({
      title: newState ? "Real-time updates enabled" : "Real-time updates disabled",
      description: newState 
        ? "Dashboard will refresh automatically" 
        : "Dashboard will no longer auto-refresh",
    });

    if (newState) {
      // Immediately refresh data when re-enabling
      queryClient.invalidateQueries({ queryKey: ['system-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['user-activity-logs'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    }
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