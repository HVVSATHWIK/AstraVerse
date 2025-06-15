
import React from 'react';
import GeminiOverviewCards from '@/components/GeminiOverviewCards';
import GeminiUsageQuotas from '@/components/GeminiUsageQuotas';
import GeminiPerformanceMetrics from '@/components/GeminiPerformanceMetrics';

interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  avgResponseTime: number;
  successRate: number;
  dailyLimit: number;
  monthlyLimit: number;
  quotaUsed: number;
}

const GeminiUsageMonitor = () => {
  // Mock data - in real implementation this would come from API
  const usageStats: UsageStats = {
    totalRequests: 1247,
    totalTokens: 458392,
    totalCost: 23.67,
    avgResponseTime: 680,
    successRate: 97.8,
    dailyLimit: 10000,
    monthlyLimit: 100000,
    quotaUsed: 45.8
  };

  const dailyUsage = 4580; // tokens used today
  const monthlyUsage = 45800; // tokens used this month

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <GeminiOverviewCards usageStats={usageStats} />

      {/* Usage Quotas */}
      <GeminiUsageQuotas 
        dailyUsage={dailyUsage}
        monthlyUsage={monthlyUsage}
        dailyLimit={usageStats.dailyLimit}
        monthlyLimit={usageStats.monthlyLimit}
      />

      {/* Performance Metrics */}
      <GeminiPerformanceMetrics 
        successRate={usageStats.successRate}
        totalCost={usageStats.totalCost}
        totalRequests={usageStats.totalRequests}
        totalTokens={usageStats.totalTokens}
      />
    </div>
  );
};

export default GeminiUsageMonitor;
