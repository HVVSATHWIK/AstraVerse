
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3 } from 'lucide-react';

const SystemHealth = () => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-900 text-lg flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">CPU Usage</span>
            <span className="text-gray-900 font-medium">67%</span>
          </div>
          <Progress value={67} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Memory Usage</span>
            <span className="text-gray-900 font-medium">82%</span>
          </div>
          <Progress value={82} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Storage</span>
            <span className="text-gray-900 font-medium">45%</span>
          </div>
          <Progress value={45} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Network I/O</span>
            <span className="text-gray-900 font-medium">23%</span>
          </div>
          <Progress value={23} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
