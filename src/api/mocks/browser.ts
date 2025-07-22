import { setupWorker } from 'msw/browser';
import { getMSWHandlers } from './handlers';

console.log('MSW: Initializing worker...');

const handlers = getMSWHandlers();
console.log('MSW: Registered handlers:', handlers);

export const worker = setupWorker(...handlers);
