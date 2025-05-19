// export default authMiddleware;
import 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
  }
}


import { verify } from 'hono/jwt';
import { MiddlewareHandler } from 'hono';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');
//   const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    console.log('No token provided');
    return c.json({ error: 'Unauthorized' }, 401);
  }

   const jwtSecret = (c as any).env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET is not set in environment variables');
    return c.json({ error: 'Server configuration error' }, 500);
  }

  try {
    const payload = await verify(token,(c as any).env.JWT_SECRET || '');
    // c.set('userId', payload.userId);
    console.log('Token payload:', payload);
    c.set('userId', String((payload as { userId?: string | number }).userId));

    await next();

  } catch (e) {
    console.log('JWT verification failed:', e);
    return c.json({ error: 'Invalid token' }, 401);
  }
};


