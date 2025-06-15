
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Users, 
  ShoppingCart, 
  HelpCircle, 
  Briefcase,
  Heart,
  BookOpen,
  Zap
} from 'lucide-react';

interface ChatTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  context: string;
  samplePrompts: string[];
  useCase: string;
}

const chatTemplates: ChatTemplate[] = [
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'Handle customer inquiries and support tickets',
    category: 'Support',
    icon: <HelpCircle className="w-5 h-5" />,
    context: 'You are a professional customer support agent. Be helpful, empathetic, and solution-focused. Always try to resolve issues efficiently while maintaining a friendly tone.',
    samplePrompts: [
      'How can I help you today?',
      'I understand your concern. Let me look into this for you.',
      'Is there anything else I can assist you with?'
    ],
    useCase: 'Customer service departments, help desks, technical support'
  },
  {
    id: 'sales-assistant',
    name: 'Sales Assistant',
    description: 'Qualify leads and support sales processes',
    category: 'Sales',
    icon: <ShoppingCart className="w-5 h-5" />,
    context: 'You are a knowledgeable sales assistant. Help prospects understand products, qualify their needs, and guide them through the sales process. Be persuasive but not pushy.',
    samplePrompts: [
      'What specific challenges are you looking to solve?',
      'Let me show you how our solution can help.',
      'Would you like to schedule a demo?'
    ],
    useCase: 'Sales teams, lead generation, product demonstrations'
  },
  {
    id: 'hr-assistant',
    name: 'HR Assistant',
    description: 'Support HR processes and employee inquiries',
    category: 'HR',
    icon: <Users className="w-5 h-5" />,
    context: 'You are an HR assistant. Help employees with HR-related questions, policies, and procedures. Be professional, confidential, and supportive.',
    samplePrompts: [
      'What HR-related question can I help you with?',
      'Let me check our policy on that.',
      'I can connect you with the right person for this.'
    ],
    useCase: 'HR departments, employee onboarding, policy questions'
  },
  {
    id: 'healthcare-assistant',
    name: 'Healthcare Assistant',
    description: 'Provide general health information and appointment scheduling',
    category: 'Healthcare',
    icon: <Heart className="w-5 h-5" />,
    context: 'You are a healthcare assistant. Provide general health information, help with appointment scheduling, and offer supportive guidance. Always remind users to consult healthcare professionals for medical advice.',
    samplePrompts: [
      'How can I assist you with your health-related questions?',
      'Would you like to schedule an appointment?',
      'Please remember to consult with your healthcare provider.'
    ],
    useCase: 'Medical offices, patient services, appointment scheduling'
  },
  {
    id: 'education-tutor',
    name: 'Education Tutor',
    description: 'Provide educational support and answer academic questions',
    category: 'Education',
    icon: <BookOpen className="w-5 h-5" />,
    context: 'You are an educational tutor. Help students with their academic questions, provide explanations, and encourage learning. Be patient, encouraging, and clear in your explanations.',
    samplePrompts: [
      'What subject would you like help with today?',
      'Let me break this concept down for you.',
      'Great question! Here\'s how to think about it...'
    ],
    useCase: 'Schools, tutoring services, educational platforms'
  },
  {
    id: 'legal-assistant',
    name: 'Legal Assistant',
    description: 'Provide general legal information and document assistance',
    category: 'Legal',
    icon: <Briefcase className="w-5 h-5" />,
    context: 'You are a legal assistant. Provide general legal information and help with document preparation. Always clarify that you cannot provide legal advice and recommend consulting with qualified attorneys.',
    samplePrompts: [
      'What legal information can I help you find?',
      'I can provide general information, but please consult an attorney.',
      'Let me help you understand this legal concept.'
    ],
    useCase: 'Law firms, legal services, document preparation'
  }
];

interface ChatTemplatesProps {
  onSelectTemplate: (template: ChatTemplate) => void;
}

const ChatTemplates = ({ onSelectTemplate }: ChatTemplatesProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      'Support': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      'Sales': 'bg-green-500/20 text-green-400 border-green-500/50',
      'HR': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      'Healthcare': 'bg-red-500/20 text-red-400 border-red-500/50',
      'Education': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      'Legal': 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Chat Workflow Templates</h2>
        <p className="text-slate-400">Choose from pre-built templates to get started quickly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatTemplates.map((template) => (
          <Card key={template.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-blue-400">
                  {template.icon}
                  <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                </div>
                <Badge variant="outline" className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm">{template.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Use Case:</h4>
                <p className="text-slate-400 text-sm">{template.useCase}</p>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Sample Prompts:</h4>
                <div className="space-y-1">
                  {template.samplePrompts.slice(0, 2).map((prompt, index) => (
                    <div key={index} className="text-slate-400 text-xs bg-slate-700/30 p-2 rounded">
                      "{prompt}"
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => onSelectTemplate(template)}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <h3 className="text-xl font-semibold text-white mb-2">Custom Workflow</h3>
          <p className="text-slate-400 mb-4">Need something specific? Create a custom chat workflow from scratch.</p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Zap className="w-4 h-4 mr-2" />
            Create Custom Workflow
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatTemplates;
