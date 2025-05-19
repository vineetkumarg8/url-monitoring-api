import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://postgres@localhost:5432/urlmonitoring',
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    client.release();
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
