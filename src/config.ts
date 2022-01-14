import dotenv from 'dotenv';
import { cleanEnv, str, num, bool } from 'envalid';

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

export default cleanEnv(
  { ...result.parsed, ...process.env },
  {
    NODE_ENV: str({ choices: ['test', 'development', 'production', 'stag'] }),
    PORT: num({ default: 8080, devDefault: 8080 }),
    HTTP_ENABLE: bool({ default: true, devDefault: true }),
    WORKER_ENABLE: bool({ default: false, devDefault: false }),
    MONGO_DIRECT_CONNECTION: bool({ default: true, devDefault: true }),
    MONGO_USE_NEW_URL_PARSER: bool({ default: true, devDefault: true }),
    MONGO_USE_UNIFIED_TOPOLOGY: bool({ default: true, devDefault: true }),
    MONGO_URL: str({
      example: 'mongodb://localhost:27017/example',
      default: '',
      devDefault: '',
    }),
  },
);
