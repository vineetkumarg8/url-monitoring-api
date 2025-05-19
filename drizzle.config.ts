import type { Config } from 'drizzle-kit';

const config = {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'db.xwkbrumvoodhpdovuapr.supabase.co',
    port: 5432,
    user: 'postgres',
    password: 'Indina%159done',
    database: 'postgres',
    // ssl: true, // required for Supabase
    ssl: {
      rejectUnauthorized: false, // <-- this skips cert validation
    }
  },
} satisfies Config;

export default config;


