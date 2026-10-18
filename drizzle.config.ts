import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./src/database/schema.ts', './src/database/schema.enum.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
