import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMetrics } from '@/hooks/api/useMetrics';

// Custom SVG Icons
const MeetingIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M8 9h8M8 15h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

const TaskIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 11l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const SpeedIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 16l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

const SatisfactionIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="9" r="1" fill="currentColor" />
    <circle cx="15" cy="9" r="1" fill="currentColor" />
  </svg>
);

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, isLoading = false }) => {
  return (
    <Card className="bg-white border border-gray-200 hover-lift-3d card-3d interactive-card rounded-4xl animate-scale-in-3d transform-3d perspective-container">
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl shadow-lg ${color}`}>
            {icon}
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl font-bold text-gray-950 text-3d">{value}</p>
          )}
        </div>

        {/* 3D decorative element */}
        <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse-3d opacity-50"></div>
      </CardContent>
    </Card>
  );
};

const OverviewMetrics: React.FC = () => {
  const { data: metrics, isLoading } = useMetrics();

  // Default values if data is not available
  const meetingReduction = metrics?.meetingReduction || 0;
  const taskCompletion = metrics?.taskCompletionRate || 0;
  const responseLatency = metrics?.avgResponseTime || 0;
  const customerSatisfaction = metrics?.customerSatisfaction || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Meeting Time Reduction"
        value={`${meetingReduction}%`}
        icon={<MeetingIcon className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-blue-500 to-blue-600"
        isLoading={isLoading}
      />
      <MetricCard
        title="Task Completion Rate"
        value={`${taskCompletion}%`}
        icon={<TaskIcon className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-green-500 to-green-600"
        isLoading={isLoading}
      />
      <MetricCard
        title="Avg Response Time"
        value={`${responseLatency}ms`}
        icon={<SpeedIcon className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-purple-500 to-purple-600"
        isLoading={isLoading}
      />
      <MetricCard
        title="Customer Satisfaction"
        value={`${customerSatisfaction}%`}
        icon={<SatisfactionIcon className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-orange-500 to-orange-600"
        isLoading={isLoading}
      />
    </div>
  );
};

export default OverviewMetrics;