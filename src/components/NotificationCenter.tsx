import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, X, CheckCircle, AlertTriangle, Info, MoreVertical, Check, Trash2 } from 'lucide-react';
import { useRealtime } from '@/contexts/RealtimeContext';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category?: 'system' | 'workflow' | 'agent' | 'integration';
}

const NotificationCenter = () => {
  const { isConnected, lastUpdate, isRealtimeEnabled } = useRealtime();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Workflow Completed',
      message: 'Meeting Optimization workflow executed successfully',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      category: 'workflow'
    },
    {
      id: '2',
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Memory usage has reached 82% capacity',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      category: 'system'
    },
    {
      id: '3',
      type: 'info',
      title: 'System Update',
      message: 'Real-time monitoring is active',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      category: 'system'
    },
    {
      id: '4',
      type: 'error',
      title: 'Integration Error',
      message: 'Failed to connect to Slack API',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: false,
      category: 'integration'
    },
    {
      id: '5',
      type: 'success',
      title: 'Agent Task Completed',
      message: 'Data Analyzer agent completed the analysis task',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      category: 'agent'
    }
  ]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate receiving new notifications
  useEffect(() => {
    if (!isRealtimeEnabled) return;
    
    const interval = setInterval(() => {
      const shouldAddNotification = Math.random() > 0.7;
      if (shouldAddNotification) {
        const types = ['success', 'warning', 'error', 'info'] as const;
        const categories = ['system', 'workflow', 'agent', 'integration'] as const;
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        const newNotification: Notification = {
          id: `notification-${Date.now()}`,
          type: randomType,
          title: `New ${randomType} notification`,
          message: `This is a simulated ${randomCategory} notification for testing purposes`,
          timestamp: new Date(),
          read: false,
          category: randomCategory
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        toast({
          title: newNotification.title,
          description: newNotification.message,
          variant: randomType === 'error' ? 'destructive' : 'default',
        });
      }
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, [isRealtimeEnabled]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    toast({
      title: "Notification marked as read",
      duration: 2000,
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "All notifications marked as read",
      duration: 2000,
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification removed",
      duration: 2000,
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "All notifications cleared",
      duration: 2000,
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = activeCategory === 'all' 
    ? notifications 
    : notifications.filter(n => 
        activeCategory === 'unread' 
          ? !n.read 
          : n.category === activeCategory
      );

  return (
    <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-gray-800 dark:text-white flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-500" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-500 dark:text-slate-400">
              {isRealtimeEnabled ? (lastUpdate ? `Updated ${formatTimestamp(lastUpdate)}` : 'Live') : 'Paused'}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <DropdownMenuItem onClick={markAllAsRead} disabled={unreadCount === 0} className="text-gray-700 dark:text-slate-300">
                  <Check className="w-4 h-4 mr-2" />
                  Mark all as read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearAllNotifications} disabled={notifications.length === 0} className="text-gray-700 dark:text-slate-300">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-4">
          <TabsList className="bg-gray-100 dark:bg-slate-700 grid grid-cols-6 mb-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
            <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
            <TabsTrigger value="workflow" className="text-xs">Workflows</TabsTrigger>
            <TabsTrigger value="agent" className="text-xs">Agents</TabsTrigger>
            <TabsTrigger value="integration" className="text-xs">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeCategory} className="space-y-3 max-h-80 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border rounded-lg transition-colors cursor-pointer ${
                    notification.read 
                      ? 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50' 
                      : 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-800 dark:text-white text-sm font-medium">{notification.title}</h4>
                        <p className="text-gray-600 dark:text-slate-300 text-xs mt-1">{notification.message}</p>
                        <span className="text-gray-500 dark:text-slate-400 text-xs">{formatTimestamp(notification.timestamp)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 h-auto"
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 p-1 h-auto"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-slate-400 text-center py-8">No notifications</p>
            )}
          </TabsContent>
        </Tabs>
        
        {notifications.length > 0 && (
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-sm"
            >
              Mark all as read
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllNotifications}
              className="text-sm"
            >
              Clear all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;