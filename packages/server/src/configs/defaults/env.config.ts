import { IEnv } from '../../interfaces/other/env.interface';

export const defaultEnv = {
  HOST: 'localhost',
  PORT: '7070',
  NODE_ENV: 'development',
  PROTOCOL: 'http',
  IS_AUTH_ENABLED: 'false',
} as IEnv;