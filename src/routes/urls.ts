import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../utils/db';
// import { monitoredUrls } from '../../drizzle/schema';
import { authMiddleware } from '../middleware/auth';
import { sql } from 'drizzle-orm';
import { monitoredUrls, checkResults } from '../../drizzle/schema'; // ✅ Adjust path if needed
import { and, eq } from 'drizzle-orm';

const urlRoutes = new Hono();

// URL creation schema
const urlSchema = z.object({
  url: z.string().url(),
});

// Protected route: Create a new URL for the authenticated user
urlRoutes.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  const parsed = urlSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid URL' }, 400);
  }

  // Get userId from jwtPayload set by auth middleware
  // const payload = c.get('jwtPayload') as { userId: string };
  // const userId = payload.userId;
  const userId = Number(c.get('userId'));

  if (isNaN(userId)) {
    return c.json({ error: 'Invalid user ID' }, 400);
  }

  const { url } = parsed.data;

  await db.insert( monitoredUrls).values({ userId, url });

  return c.json({ message: 'URL added successfully' });
});


// Manual Health Check Endpoint
// POST /urls/:id/check – Trigger a health check for a specific monitored URL manually.
urlRoutes.post('/:id/check', authMiddleware, async (c) => {
  const urlId = Number(c.req.param('id'));
  const userId = Number(c.get('userId'));

  if (isNaN(urlId) || isNaN(userId)) {
    return c.json({ error: 'Invalid ID(s)' }, 400);
  }

  // Get the monitored URL owned by the user
  const urlData = await db.query.monitoredUrls.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.id, urlId), eq(fields.userId, userId)),
  });

  if (!urlData) {
    return c.json({ error: 'URL not found or unauthorized' }, 404);
  }

  try {
    const response = await fetch(urlData.url);
    const isHealthy = response.ok;

    await db.insert(checkResults).values({
      urlId: urlData.id,
      status: response.status,
      checkTime: new Date(),
      isHealthy,
    });

    return c.json({
      message: 'Health check completed',
      result: {
        status: response.status,
        isHealthy,
      },
    });
  } catch (err: any) {
    await db.insert(checkResults).values({
      urlId: urlData.id,
      status: 0,
      checkTime: new Date(),
      isHealthy: false,
    });

    return c.json({
      message: 'Health check failed',
      result: {
        status: 0,
        isHealthy: false,
        error: err.message,
      },
    });
  }
});




// Protected route: Get all URLs for the authenticated user
urlRoutes.get('/', authMiddleware, async (c) => {
//   const payload = c.get('jwtPayload') as { userId: string };
// //   const userId = payload.userId;
// const userId = Number(payload.userId);
const userId = Number(c.get('userId'));

if (isNaN(userId)) {
    return c.json({ error: 'Invalid user ID' }, 400);
  }

  // Use sql tagged template literal to filter by userId (number)
  const userUrls = await db
    .select()
    .from(monitoredUrls)
    .where(sql`${monitoredUrls.userId} = ${userId}`);

  return c.json({ urls: userUrls });
});


// Update URL schema
const updateUrlSchema = z.object({
  url: z.string().url(),
});

urlRoutes.put('/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  const urlId = Number(id);
  const userId = Number(c.get('userId'));

  if (isNaN(urlId)) {
    return c.json({ error: 'Invalid URL ID' }, 400);
  }

  const body = await c.req.json();
  const parsed = updateUrlSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Invalid URL format' }, 400);
  }

  // Check if URL belongs to user
  const existing = await db.query.monitoredUrls.findFirst({
    where: and(eq(monitoredUrls.id, urlId), eq(monitoredUrls.userId, userId)),
  });

  if (!existing) {
    return c.json({ error: 'URL not found or unauthorized' }, 404);
  }

  // Update the URL
  await db
    .update(monitoredUrls)
    .set({ url: parsed.data.url })
    .where(and(eq(monitoredUrls.id, urlId), eq(monitoredUrls.userId, userId)));

  return c.json({ message: 'URL updated successfully' });
});

//Delete
urlRoutes.delete('/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  const urlId = Number(id);
  const userId = Number(c.get('userId'));

  if (isNaN(urlId)) {
    return c.json({ error: 'Invalid URL ID' }, 400);
  }

  // Check if URL belongs to user
  const existing = await db.query.monitoredUrls.findFirst({
    where: and(eq(monitoredUrls.id, urlId), eq(monitoredUrls.userId, userId)),
  });

  if (!existing) {
    return c.json({ error: 'URL not found or unauthorized' }, 404);
  }

  // Delete related check results first (if foreign key doesn't cascade)
  await db
    .delete(checkResults)
    .where(eq(checkResults.urlId, urlId));

  // Delete the URL
  await db
    .delete(monitoredUrls)
    .where(and(eq(monitoredUrls.id, urlId), eq(monitoredUrls.userId, userId)));

  return c.json({ message: 'URL and related check results deleted' });
});


export default urlRoutes;
