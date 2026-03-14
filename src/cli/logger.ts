import pino from 'pino';
import { Env } from '../config/env.js';

export function createLogger(env: Env) {
  const transport = env.LOG_FORMAT === 'pretty'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    : undefined;

  return pino({ level: env.LOG_LEVEL }, transport ? pino.transport(transport) : undefined);
}

export type AppLogger = ReturnType<typeof createLogger>;
