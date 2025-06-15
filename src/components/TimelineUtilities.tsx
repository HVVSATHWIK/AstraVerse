
export const getStatusIcon = (status: string) => {
  const iconMap = {
    completed: 'CheckCircle',
    success: 'CheckCircle', 
    failed: 'XCircle',
    error: 'XCircle',
    running: 'Activity',
    active: 'Activity',
    warning: 'AlertTriangle'
  };
  return iconMap[status as keyof typeof iconMap] || 'Clock';
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'running':
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'busy':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'idle':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    case 'error':
    case 'failed':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'queued':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'medium':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'low':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return date.toLocaleDateString();
};
