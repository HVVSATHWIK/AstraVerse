
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Rocket, TrendingUp, Users, Zap, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { APIResponse, PilotFeature, PilotAnalytics } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundary from './ErrorBoundary';

const PilotModePanel = () => {
  const { toast } = useToast();

  const { data: features, isLoading: featuresLoading } = useQuery({
    queryKey: ['pilot-features'],
    queryFn: () => apiClient.get<APIResponse<PilotFeature[]>>('/pilot/features'),
    select: (response) => response.data?.data || [],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['pilot-analytics'],
    queryFn: async () => {
      if (!features || features.length === 0) return [];
      
      const analyticsData = await Promise.all(
        features.map(feature => 
          apiClient.get<APIResponse<PilotAnalytics>>(`/pilot/analytics/${feature.id}`)
        )
      );
      
      return analyticsData.map(response => response.data?.data).filter(Boolean);
    },
    enabled: !!features && features.length > 0,
  });

  const handleFeatureToggle = async (featureId: string, enabled: boolean) => {
    try {
      await apiClient.put(`/pilot/features/${featureId}`, { enabled });
      toast({
        title: 'Pilot Feature Updated',
        description: `Feature has been ${enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update pilot feature',
        variant: 'destructive',
      });
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Rocket className="w-6 h-6 mr-2 text-purple-400" />
              Pilot Mode
            </h2>
            <p className="text-slate-400 mt-1">
              Experimental features and early access capabilities
            </p>
          </div>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            Beta Access
          </Badge>
        </div>

        {/* Pilot Features */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Pilot Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuresLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-600 rounded-lg">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))
            ) : features && features.length > 0 ? (
              features.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-4 border border-slate-600 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{feature.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{feature.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge 
                        variant="outline" 
                        className={feature.enabled 
                          ? 'bg-green-500/20 text-green-400 border-green-500/50'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                        }
                      >
                        {feature.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-slate-500 text-xs">
                        {feature.rolloutPercentage}% rollout
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={(enabled) => handleFeatureToggle(feature.id, enabled)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">No pilot features available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics */}
        {analytics && analytics.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analytics.map((analytic) => (
              <Card key={analytic?.featureId} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                    Feature Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  ) : analytic ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{analytic.metrics.adoption}%</div>
                          <div className="text-slate-400 text-sm">Adoption Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{analytic.metrics.usage}</div>
                          <div className="text-slate-400 text-sm">Daily Usage</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{analytic.metrics.feedback}</div>
                          <div className="text-slate-400 text-sm">Avg Feedback</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {(analytic.metrics.performance * 100).toFixed(1)}%
                          </div>
                          <div className="text-slate-400 text-sm">Performance</div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Feedback Section */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-400" />
              Pilot Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">
                Help us improve by sharing your experience with pilot features
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Share Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default PilotModePanel;

