export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          bio: string | null
          company: string | null
          location: string | null
          phone: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          bio?: string | null
          company?: string | null
          location?: string | null
          phone?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          bio?: string | null
          company?: string | null
          location?: string | null
          phone?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          config: Json | null
          created_at: string
          enabled: boolean
          id: string
          integration_type: string
          last_sync: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          enabled?: boolean
          id?: string
          integration_type: string
          last_sync?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          enabled?: boolean
          id?: string
          integration_type?: string
          last_sync?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_workflows: {
        Row: {
          config: Json | null
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      metrics: {
        Row: {
          id: string
          user_id: string
          metric_name: string
          metric_value: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          metric_name: string
          metric_value: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          metric_name?: string
          metric_value?: number
          created_at?: string
        }
        Relationships: []
      }
      workflow_executions: {
        Row: {
          id: string
          workflow_id: string
          user_id: string
          status: string
          started_at: string
          completed_at: string | null
          result: Json | null
          error: string | null
          execution_time: number | null
        }
        Insert: {
          id?: string
          workflow_id: string
          user_id: string
          status: string
          started_at?: string
          completed_at?: string | null
          result?: Json | null
          error?: string | null
          execution_time?: number | null
        }
        Update: {
          id?: string
          workflow_id?: string
          user_id?: string
          status?: string
          started_at?: string
          completed_at?: string | null
          result?: Json | null
          error?: string | null
          execution_time?: number | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          status: string
          description: string
          capabilities: Json | null
          current_task_id: string | null
          performance: Json | null
          config: Json | null
          metrics: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          status: string
          description: string
          capabilities?: Json | null
          current_task_id?: string | null
          performance?: Json | null
          config?: Json | null
          metrics?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          status?: string
          description?: string
          capabilities?: Json | null
          current_task_id?: string | null
          performance?: Json | null
          config?: Json | null
          metrics?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_tasks: {
        Row: {
          id: string
          agent_id: string
          type: string
          status: string
          priority: string
          title: string
          description: string
          input: Json | null
          output: Json | null
          progress: number | null
          estimated_duration: number | null
          actual_duration: number | null
          error: string | null
          retry_count: number | null
          max_retries: number | null
          created_at: string
          started_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          agent_id: string
          type: string
          status: string
          priority: string
          title: string
          description: string
          input?: Json | null
          output?: Json | null
          progress?: number | null
          estimated_duration?: number | null
          actual_duration?: number | null
          error?: string | null
          retry_count?: number | null
          max_retries?: number | null
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          agent_id?: string
          type?: string
          status?: string
          priority?: string
          title?: string
          description?: string
          input?: Json | null
          output?: Json | null
          progress?: number | null
          estimated_duration?: number | null
          actual_duration?: number | null
          error?: string | null
          retry_count?: number | null
          max_retries?: number | null
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
        Relationships: []
      }
      agent_events: {
        Row: {
          id: string
          agent_id: string
          type: string
          message: string
          severity: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          type: string
          message: string
          severity: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          type?: string
          message?: string
          severity?: string
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_latest_metrics: {
        Args: {
          p_user_id: string
        }
        Returns: {
          metric_name: string
          metric_value: number
          created_at: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const