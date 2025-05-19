// import { defineSchema } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, varchar, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const monitoredUrls = pgTable('monitored_urls', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  lastCheckedAt: timestamp('last_checked_at'),
});

export const checkResults = pgTable('check_results', {
  id: serial('id').primaryKey(),
  urlId: integer('url_id').notNull().references(() => monitoredUrls.id),
  status: integer('status').notNull(),  // Example: 200 (success), 404 (not found), etc.
  checkTime: timestamp('check_time').defaultNow(),
  isHealthy: boolean('is_healthy').notNull().default(true),
});

export const schema = {
  monitoredUrls,
  checkResults,
};

// export const schema = defineSchema{{
//   users,
//   monitoredUrls,
//   checkResults,
// });
