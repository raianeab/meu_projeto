const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

// Mantém só pra leads (fluxo público da landing)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

function assertTenantContext(session) {
  if (!session?.company_id) throw new Error('Tenant context missing — company_id ausente na sessão');
  if (!session?.id) throw new Error('Tenant context missing — user id ausente na sessão');
}

async function withTenantContext(session, callback) {
  assertTenantContext(session);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `SELECT
        set_config('app.current_company_id', $1, true),
        set_config('app.current_user_id',    $2, true)`,
      [session.company_id.toString(), session.id.toString()]
    );
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { supabase, pool, withTenantContext };