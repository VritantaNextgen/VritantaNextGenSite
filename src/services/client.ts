import db from './database';
import realtime from './realtime';

// Create a client with the same interface as the Blink client
const client = {
  db,
  realtime,
  // Add any other required properties or methods here
};

export const createClient = () => {
  return client;
};

export default client;