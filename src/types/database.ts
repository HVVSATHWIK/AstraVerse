
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      user_workflows: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          config: any;
          status: 'active' | 'paused' | 'draft';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          config?: any;
          status?: 'active' | 'paused' | 'draft';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          config?: any;
          status?: 'active' | 'paused' | 'draft';
          updated_at?: string;
        };
      };
      user_integrations: {
        Row: {
          id: string;
          user_id: string;
          integration_type: string;
          name: string;
          config: any;
          enabled: boolean;
          last_sync: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          integration_type: string;
          name: string;
          config?: any;
          enabled?: boolean;
          last_sync?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          integration_type?: string;
          name?: string;
          config?: any;
          enabled?: boolean;
          last_sync?: string | null;
          updated_at?: string;
        };
      };
      user_activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          description: string;
          metadata: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          description: string;
          metadata?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          description?: string;
          metadata?: any | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
