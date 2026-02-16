export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: 'free' | 'pro' | 'enterprise';
          usage_limit: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          plan?: 'free' | 'pro' | 'enterprise';
          usage_limit?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          plan?: 'free' | 'pro' | 'enterprise';
          usage_limit?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          organization_id: string | null;
          role: 'owner' | 'admin' | 'member';
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          organization_id?: string | null;
          role?: 'owner' | 'admin' | 'member';
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          role?: 'owner' | 'admin' | 'member';
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_events: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string | null;
          event_type: string;
          credits_used: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id?: string | null;
          event_type: string;
          credits_used?: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string | null;
          event_type?: string;
          credits_used?: number;
          metadata?: Json;
          created_at?: string;
        };
      };
      workflow_executions: {
        Row: {
          id: string;
          organization_id: string;
          workflow_name: string;
          status: 'running' | 'success' | 'error';
          input: Json | null;
          output: Json | null;
          error: string | null;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          workflow_name: string;
          status?: 'running' | 'success' | 'error';
          input?: Json | null;
          output?: Json | null;
          error?: string | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          workflow_name?: string;
          status?: 'running' | 'success' | 'error';
          input?: Json | null;
          output?: Json | null;
          error?: string | null;
          started_at?: string;
          completed_at?: string | null;
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
