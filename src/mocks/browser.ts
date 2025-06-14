
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup the Service Worker for browser environment
export const worker = setupWorker(...handlers);

