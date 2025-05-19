// export default resultRoutes;

import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../utils/db';
import { checkResults, monitoredUrls } from '../../drizzle/schema';
import { authMiddleware } from '../middleware/auth';
import { eq, sql } from 'drizzle-orm';

const resultRoutes = new Hono();

const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

resultRoutes.get('/', authMiddleware, async (c) => {
  try {
    const userId = Number(c.get('userId'));
    if (isNaN(userId)) {
      return c.json({ error: 'Invalid user ID' }, 400);
    }

    const query = c.req.query();
    const parsed = paginationSchema.safeParse(query);
    if (!parsed.success) {
      return c.json({ error: 'Invalid pagination parameters' }, 400);
    }

    const page = parsed.data.page ?? 1;
    const limit = parsed.data.limit ?? 10;
    const offset = (page - 1) * limit;

    // Query results with join
    const results = await db
      .select({
        id: checkResults.id,
        urlId: checkResults.urlId,
        status: checkResults.status,
        checkTime: checkResults.checkTime,
        isHealthy: checkResults.isHealthy,
        url: monitoredUrls.url,
      })
      .from(checkResults)
      .innerJoin(monitoredUrls, eq(checkResults.urlId, monitoredUrls.id))
      .where(eq(monitoredUrls.userId, userId))
      .limit(limit)
      .offset(offset);

    // Total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(checkResults)
      .innerJoin(monitoredUrls, eq(checkResults.urlId, monitoredUrls.id))
      .where(eq(monitoredUrls.userId, userId));

    const total = Number(totalResult[0]?.count ?? 0);

    return c.json({
      page,
      limit,
      total,
      results,
    });
  } catch (error) {
    console.error('Error in /results route:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export default resultRoutes;
