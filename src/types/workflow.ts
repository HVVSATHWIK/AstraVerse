
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'gemini_ai';
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

export interface WorkflowConnection {
  from: string;
  to: string;
  condition?: string;
}

export interface NodeTypeConfig {
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  options: string[];
}

export type NodeTypes = Record<string, NodeTypeConfig>;
