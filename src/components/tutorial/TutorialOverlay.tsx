
import React, { useEffect, useState, useCallback } from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft, Play, Target, CheckCircle } from 'lucide-react';

interface HighlightBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TutorialOverlay = () => {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTutorial, completeTutorial } = useTutorial();
  const [highlightBox, setHighlightBox] = useState<HighlightBox | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const updateHighlight = useCallback(() => {
    if (!isActive || !steps[currentStep]) return;

    const target = document.querySelector(steps[currentStep].target);
    if (target) {
      const rect = target.getBoundingClientRect();
      const padding = steps[currentStep].highlightPadding || 8;
      
      setHighlightBox({
        top: rect.top + window.scrollY - padding,
        left: rect.left + window.scrollX - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      // Calculate tooltip position
      const tooltipOffset = 20;
      let tooltipTop = rect.top + window.scrollY;
      let tooltipLeft = rect.left + window.scrollX;

      switch (steps[currentStep].position) {
        case 'top':
          tooltipTop = rect.top + window.scrollY - tooltipOffset - 120;
          tooltipLeft = rect.left + window.scrollX + rect.width / 2;
          break;
        case 'bottom':
          tooltipTop = rect.bottom + window.scrollY + tooltipOffset;
          tooltipLeft = rect.left + window.scrollX + rect.width / 2;
          break;
        case 'left':
          tooltipTop = rect.top + window.scrollY + rect.height / 2;
          tooltipLeft = rect.left + window.scrollX - tooltipOffset - 300;
          break;
        case 'right':
          tooltipTop = rect.top + window.scrollY + rect.height / 2;
          tooltipLeft = rect.right + window.scrollX + tooltipOffset;
          break;
      }

      setTooltipPosition({ top: tooltipTop, left: tooltipLeft });

      // Scroll element into view
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive, currentStep, steps]);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(updateHighlight, 100);
      window.addEventListener('resize', updateHighlight);
      window.addEventListener('scroll', updateHighlight);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateHighlight);
        window.removeEventListener('scroll', updateHighlight);
      };
    }
  }, [isActive, currentStep, updateHighlight]);

  if (!isActive || !steps[currentStep]) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Dark overlay with cutout */}
      <div className="absolute inset-0 bg-black/60 pointer-events-auto">
        {highlightBox && (
          <div
            className="absolute bg-transparent border-4 border-blue-400 rounded-lg shadow-2xl animate-pulse"
            style={{
              top: highlightBox.top,
              left: highlightBox.left,
              width: highlightBox.width,
              height: highlightBox.height,
              boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.5)`,
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <Card
        className="absolute bg-slate-900/95 backdrop-blur-sm border-slate-700 shadow-2xl max-w-sm pointer-events-auto"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="w-4 h-4 text-white" />
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={skipTutorial}
              className="text-slate-400 hover:text-white p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <h3 className="text-white font-semibold text-lg mb-2">
            {currentStepData.title}
          </h3>
          
          <p className="text-slate-300 text-sm mb-4 leading-relaxed">
            {currentStepData.description}
          </p>

          {currentStepData.action && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-400 text-xs">
                <Play className="w-3 h-3" />
                <span className="font-medium">
                  {currentStepData.action === 'click' && 'Click the highlighted element'}
                  {currentStepData.action === 'hover' && 'Hover over the highlighted element'}
                  {currentStepData.action === 'scroll' && 'Scroll to see the element'}
                  {currentStepData.action === 'wait' && 'Please wait...'}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={prevStep}
              disabled={isFirstStep}
              className="text-slate-300 border-slate-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={skipTutorial}
                className="text-slate-400 hover:text-white"
              >
                Skip
              </Button>
              
              {isLastStep ? (
                <Button
                  size="sm"
                  onClick={completeTutorial}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialOverlay;
