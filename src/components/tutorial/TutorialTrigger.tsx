
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, BookOpen } from 'lucide-react';
import { useTutorial } from '@/contexts/TutorialContext';
import { dashboardTutorialSteps } from '@/config/tutorialSteps';

interface TutorialTriggerProps {
  variant?: 'dashboard' | 'landing';
  className?: string;
}

const TutorialTrigger: React.FC<TutorialTriggerProps> = ({ 
  variant = 'dashboard', 
  className = '' 
}) => {
  const { startTutorial, isActive } = useTutorial();

  const handleStartTutorial = () => {
    if (variant === 'dashboard') {
      startTutorial(dashboardTutorialSteps);
    }
    // Add other variants as needed
  };

  // Check if tutorial was completed
  const isCompleted = localStorage.getItem('astraai-tutorial-completed') === 'true';

  if (isActive) return null;

  return (
    <div className={className}>
      <Button
        onClick={handleStartTutorial}
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50 text-blue-300 hover:from-blue-600/30 hover:to-purple-600/30 hover:text-blue-200"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        {isCompleted ? 'Replay Tutorial' : 'Start Tutorial'}
        {!isCompleted && (
          <Badge className="ml-2 bg-blue-500/20 text-blue-300 border-blue-500/50 text-xs">
            New
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default TutorialTrigger;
