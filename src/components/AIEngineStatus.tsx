
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain } from 'lucide-react';

interface AIEngineStatusProps {
  aiEngines: any;
  isLoading: boolean;
}

const AIEngineStatus = ({ aiEngines, isLoading }: AIEngineStatusProps) => {
  return (
    <Card className="bg-white border border-gray-200 rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-900 text-lg flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-600" />
          AI Engine Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))
        ) : (
          aiEngines?.map((engine: any) => (
            <div key={engine.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:bg-gray-50">
              <span className="text-gray-700 font-medium">{engine.name}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "rounded-full",
                  engine.status === 'active' 
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : engine.status === 'scaling'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                )}
              >
                {engine.status}
              </Badge>
            </div>
          )) || (
            <>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:bg-gray-50">
                <span className="text-gray-700 font-medium">Drools Engine</span>
                <Badge className="bg-green-50 text-green-700 border-green-200 rounded-full">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:bg-gray-50">
                <span className="text-gray-700 font-medium">LLM Pipeline</span>
                <Badge className="bg-green-50 text-green-700 border-green-200 rounded-full">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:bg-gray-50">
                <span className="text-gray-700 font-medium">Multi-modal Processor</span>
                <Badge className="bg-green-50 text-green-700 border-green-200 rounded-full">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:bg-gray-50">
                <span className="text-gray-700 font-medium">Vector Embeddings</span>
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 rounded-full">Scaling</Badge>
              </div>
            </>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default AIEngineStatus;
