
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup the server for Node.js environment (testing)
export const server = setupServer(...handlers);

