import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from '@/components/ErrorBoundary';
import AuthProvider from '@/contexts/AuthProvider';
import { TutorialProvider } from '@/contexts/TutorialContext';
import TutorialOverlay from '@/components/tutorial/TutorialOverlay';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import env from '@/config/environment';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize Mock Service Worker in development
async function enableMocking() {
  if (!env.isDev() || !env.get('enableMockApi')) {
    return;
  }

  // Check if service worker API is available
  if (typeof navigator === 'undefined' || !navigator.serviceWorker) {
    console.warn('Service Worker API is not available in this environment');
    return;
  }

  try {
    // Wait for the service worker to be ready before starting MSW
    await navigator.serviceWorker.ready;
    
    const { worker } = await import('@/mocks/browser');
    
    return worker.start({
      onUnhandledRequest: 'warn',
    }).then(() => {
      console.log('🚀 Mock Service Worker started');
    });
  } catch (error) {
    console.error('Error starting Mock Service Worker:', error);
  }
}

function App() {
  // Initialize mocking before rendering the app
  React.useEffect(() => {
    enableMocking();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <TutorialProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <TutorialOverlay />
            </Router>
          </QueryClientProvider>
        </TutorialProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;