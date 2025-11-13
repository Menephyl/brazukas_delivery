import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

// Carrega explicitamente as variáveis do arquivo .env.local
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in your .env.local file');
}

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;