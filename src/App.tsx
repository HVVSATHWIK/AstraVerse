import React, { useEffect } from 'react';
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

  // Check if we're in a browser-like environment with all required APIs
  if (typeof window === 'undefined' || 
      typeof document === 'undefined' || 
      typeof navigator === 'undefined' || 
      !navigator || 
      !navigator.serviceWorker || 
      typeof navigator.userAgent !== 'string' || 
      !navigator.userAgent) {
    console.warn('Required browser APIs not available - skipping MSW initialization');
    return;
  }

  try {
    // Wait for the service worker to be ready before starting MSW
    await navigator.serviceWorker.ready;
    
    const { worker } = await import('@/mocks/browser');
    
    return worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js'
      },
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
  useEffect(() => {
    enableMocking();
  }, []);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Listen for theme change events
    const handleThemeChange = (event: CustomEvent) => {
      if (event.detail.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    window.addEventListener('themeChange', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
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