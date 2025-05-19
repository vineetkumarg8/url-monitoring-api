// src/utils/db.ts
import 'dotenv/config'; // load .env
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from '../../drizzle/schema'; // adjust the path as needed



// Create client
const client = postgres("postgresql://postgres:Indina%2525159done@db.xwkbrumvoodhpdovuapr.supabase.co:5432/postgres", {
  max: 5, // optional, adjust pool settings if needed
});

// Export drizzle instance
export const db = drizzle(client, { schema }); // ✅ important!
// export const db = drizzle(client);

