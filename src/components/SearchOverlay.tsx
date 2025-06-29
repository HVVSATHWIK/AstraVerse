import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, X, Workflow, Users, Settings, Zap, Calendar } from 'lucide-react';
import { UserWorkflow } from '@/types';
import { Agent } from '@/types/agents';
import { Integration } from '@/types';

interface SearchResult {
  id: string;
  name: string;
  description?: string;
  type: 'workflow' | 'agent' | 'integration' | 'setting';
  icon: React.ReactNode;
  badge?: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  workflows?: UserWorkflow[];
  agents?: Agent[];
  integrations?: Integration[];
  onSelectResult: (result: SearchResult) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  workflows = [],
  agents = [],
  integrations = [],
  onSelectResult
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search workflows
    if (activeTab === 'all' || activeTab === 'workflows') {
      const matchedWorkflows = workflows
        .filter(w => 
          w.name.toLowerCase().includes(term) || 
          (w.description && w.description.toLowerCase().includes(term))
        )
        .map(w => ({
          id: w.id,
          name: w.name,
          description: w.description || '',
          type: 'workflow' as const,
          icon: <Workflow className="w-4 h-4 text-blue-400" />,
          badge: w.status
        }));
      searchResults.push(...matchedWorkflows);
    }

    // Search agents
    if (activeTab === 'all' || activeTab === 'agents') {
      const matchedAgents = agents
        .filter(a => 
          a.name.toLowerCase().includes(term) || 
          a.description.toLowerCase().includes(term)
        )
        .map(a => ({
          id: a.id,
          name: a.name,
          description: a.description,
          type: 'agent' as const,
          icon: <Users className="w-4 h-4 text-purple-400" />,
          badge: a.status
        }));
      searchResults.push(...matchedAgents);
    }

    // Search integrations
    if (activeTab === 'all' || activeTab === 'integrations') {
      const matchedIntegrations = integrations
        .filter(i => 
          i.name.toLowerCase().includes(term) || 
          i.description.toLowerCase().includes(term)
        )
        .map(i => ({
          id: i.id,
          name: i.name,
          description: i.description,
          type: 'integration' as const,
          icon: <Zap className="w-4 h-4 text-green-400" />,
          badge: i.status
        }));
      searchResults.push(...matchedIntegrations);
    }

    // Settings search (static for now)
    if (activeTab === 'all' || activeTab === 'settings') {
      const settingsItems = [
        { id: 'profile', name: 'User Profile', description: 'Manage your profile settings' },
        { id: 'appearance', name: 'Appearance', description: 'Customize the look and feel' },
        { id: 'notifications', name: 'Notifications', description: 'Configure notification preferences' },
        { id: 'security', name: 'Security', description: 'Manage security settings' },
        { id: 'language', name: 'Language', description: 'Change language preferences' }
      ];
      
      const matchedSettings = settingsItems
        .filter(s => 
          s.name.toLowerCase().includes(term) || 
          s.description.toLowerCase().includes(term)
        )
        .map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          type: 'setting' as const,
          icon: <Settings className="w-4 h-4 text-slate-400" />
        }));
      searchResults.push(...matchedSettings);
    }

    setResults(searchResults);
  }, [searchTerm, activeTab, workflows, agents, integrations]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'paused':
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'connected':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 bg-slate-800 border-slate-700 text-white">
        <div className="flex items-center p-4 border-b border-slate-700">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for workflows, agents, integrations, settings..."
            className="flex-1 bg-transparent border-none text-white placeholder:text-slate-400 focus-visible:ring-0 text-lg"
            onKeyDown={handleKeyDown}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4 pt-2">
            <TabsList className="bg-slate-700/50 w-full justify-start">
              <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
              <TabsTrigger value="workflows" className="text-sm">Workflows</TabsTrigger>
              <TabsTrigger value="agents" className="text-sm">Agents</TabsTrigger>
              <TabsTrigger value="integrations" className="text-sm">Integrations</TabsTrigger>
              <TabsTrigger value="settings" className="text-sm">Settings</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            {searchTerm.trim() === '' ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Start typing to search...</p>
                <p className="text-slate-500 text-sm mt-2">
                  Search across workflows, agents, integrations, and settings
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No results found for "{searchTerm}"</p>
                <p className="text-slate-500 text-sm mt-2">
                  Try different keywords or check your spelling
                </p>
              </div>
            ) : (
              <TabsContent value={activeTab} forceMount className="mt-0">
                <ScrollArea className="max-h-[60vh]">
                  <div className="space-y-2">
                    {results.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        className="flex items-start p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors"
                        onClick={() => {
                          onSelectResult(result);
                          onClose();
                        }}
                      >
                        <div className="flex-shrink-0 mt-1 mr-3">
                          {result.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-medium truncate">{result.name}</h4>
                            {result.badge && (
                              <Badge variant="outline" className={getStatusColor(result.badge)}>
                                {result.badge}
                              </Badge>
                            )}
                          </div>
                          {result.description && (
                            <p className="text-slate-400 text-sm truncate">{result.description}</p>
                          )}
                          <div className="text-xs text-slate-500 mt-1">
                            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            )}
          </div>
        </Tabs>

        <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
          <div className="flex justify-between">
            <div>
              Press <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">ESC</kbd> to close
            </div>
            <div>
              {results.length > 0 && `${results.length} results found`}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchOverlay;