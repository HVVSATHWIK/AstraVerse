
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/pages/Auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute render:', { user: !!user, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          <div className="text-white text-xl font-medium">Loading AstraAI...</div>
          <div className="text-slate-300 text-sm">Initializing your workspace</div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, showing auth page');
    return <AuthPage />;
  }

  console.log('User authenticated, showing protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
