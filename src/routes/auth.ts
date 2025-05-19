import { Hono } from 'hono';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '../utils/db';
import { users } from '../../drizzle/schema';
import { sql } from 'drizzle-orm';
import { sign } from 'hono/jwt';

// Create Hono instance
const auth = new Hono();

// Zod validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// REGISTER
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: 'Invalid input' }, 400);
    }

    const { email, password } = parsed.data;

    // Check for existing user
    const existing = await db
      .select()
      .from(users)
      .where(sql`${users.email} = ${email}`)
      .limit(1);

    if (existing.length > 0) {
      return c.json({ error: 'User already exists' }, 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(users).values({ email, passwordHash });

    return c.json({ message: 'User registered successfully' }, 201);
  } catch (err:any) {
    console.error(err);
    return c.json({ error:err.message}, 500);
  }
});

// LOGIN
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: 'Invalid input' }, 400);
    }

    const { email, password } = parsed.data;

    const user = await db
      .select()
      .from(users)
      .where(sql`${users.email} = ${email}`)
      .limit(1);

    if (user.length === 0) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const foundUser = user[0];
    if (!foundUser.passwordHash) {
      return c.json({ error: 'Invalid user record' }, 500);
    }

    const isValid = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isValid) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const jwtSecret = (c as any).env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('Missing JWT_SECRET in environment');
      return c.json({ error: 'Server configuration error' }, 500);
    }

    // const token = await sign({ userId: foundUser.id }, jwtSecret, {
    //   expiresIn: '1d',
    // });
    const token = await sign(
  {
    userId: foundUser.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // expires in 1 day
  },
  jwtSecret
);

  return c.json({ token });
  
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default auth;
