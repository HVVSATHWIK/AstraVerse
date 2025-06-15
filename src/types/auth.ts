
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { fullName: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface SignUpMetadata {
  fullName: string;
}
