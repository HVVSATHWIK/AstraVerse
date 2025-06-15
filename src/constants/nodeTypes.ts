
import { 
  Zap, 
  Play, 
  GitBranch, 
  Sparkles
} from 'lucide-react';
import { NodeTypes } from '@/types/workflow';

export const nodeTypes: NodeTypes = {
  trigger: {
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    options: ['Schedule', 'Webhook', 'Email', 'File Upload', 'Database Change']
  },
  action: {
    icon: Play,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    options: ['Send Email', 'Update Database', 'Call API', 'Create File', 'Send Notification']
  },
  condition: {
    icon: GitBranch,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    options: ['If/Then', 'Compare Values', 'Check Status', 'Validate Data']
  },
  gemini_ai: {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
    options: ['Generate Content', 'Analyze Data', 'Classify Text', 'Extract Information', 'Summarize']
  }
};
