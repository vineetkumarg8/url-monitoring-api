import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL as string)
const db = drizzle(client)

async function test() {
  const result = await db.execute(`SELECT NOW()`)
  console.log(result)
}

test()
