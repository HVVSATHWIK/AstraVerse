
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from '@/components/ErrorBoundary';
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

  const { worker } = await import('@/mocks/browser');
  
  return worker.start({
    onUnhandledRequest: 'warn',
  }).then(() => {
    console.log('🚀 Mock Service Worker started');
  });
}

function App() {
  // Initialize mocking before rendering the app
  React.useEffect(() => {
    enableMocking();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

