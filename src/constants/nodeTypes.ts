
import { Brain, Zap, GitBranch, Sparkles } from 'lucide-react';

export const nodeTypes = {
  trigger: {
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    description: 'Workflow trigger events'
  },
  action: {
    icon: Brain,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    description: 'Standard workflow actions'
  },
  condition: {
    icon: GitBranch,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    description: 'Conditional logic nodes'
  },
  gemini_ai: {
    icon: Sparkles,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    description: 'Google Gemini AI actions'
  },
  openai_ai: {
    icon: Brain,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    description: 'OpenAI GPT actions'
  }
} as const;
