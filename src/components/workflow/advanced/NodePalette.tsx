
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { nodeTypes } from '@/constants/nodeTypes';

interface NodePaletteProps {
  onAddNode: (type: 'trigger' | 'action' | 'condition' | 'gemini_ai') => void;
}

const NodePalette = ({ onAddNode }: NodePaletteProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg">Node Palette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(nodeTypes).map(([type, config]) => {
          const IconComponent = config.icon;
          return (
            <Button
              key={type}
              onClick={() => onAddNode(type as 'trigger' | 'action' | 'condition' | 'gemini_ai')}
              variant="outline"
              className={`w-full justify-start ${config.bgColor} ${config.borderColor} text-white hover:bg-slate-700/50`}
            >
              <IconComponent className={`w-4 h-4 mr-2 ${config.color}`} />
              Add {type.replace('_', ' ').toUpperCase()}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default NodePalette;
