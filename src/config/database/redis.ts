import 'dotenv/config';
import { createClient } from 'redis';

export const pool = createClient({
  password: process.env.REDIS_PW,
  socket: {
    host: process.env.REDIS_HOST,
    port: 15561
  }
})

pool.on('error', (error) => console.error('REDIS SESSION ERROR:', error));
pool.connect().then(() => console.log('CONNECTED TO REDIS CLOUD FOR SESSIONS!'));
