
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PilotPricing = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-gray-900">Basic Tier</CardTitle>
          <CardDescription className="text-gray-600">
            Transcription + Narrative Reporting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold text-gray-900">$99/month</div>
          <ul className="space-y-2 text-gray-700">
            <li>• Meeting transcription</li>
            <li>• AI narrative reports</li>
            <li>• Basic analytics</li>
            <li>• 5 integrations</li>
          </ul>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Start Basic Pilot
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-gray-900">Pro Tier</CardTitle>
          <CardDescription className="text-gray-600">
            + Autonomous Scheduling + Alerting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold text-gray-900">$299/month</div>
          <ul className="space-y-2 text-gray-700">
            <li>• All Basic features</li>
            <li>• Smart scheduling</li>
            <li>• Churn alerts</li>
            <li>• Advanced workflows</li>
          </ul>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Start Pro Pilot
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-gray-900">Enterprise</CardTitle>
          <CardDescription className="text-gray-600">
            Full Orchestration + Custom LLM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold text-gray-900">Custom</div>
          <ul className="space-y-2 text-gray-700">
            <li>• All Pro features</li>
            <li>• Custom LLM training</li>
            <li>• On-premise deployment</li>
            <li>• White-label options</li>
          </ul>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Contact Sales
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PilotPricing;
