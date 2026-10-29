import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function setDbPool(customPool: pg.Pool | null): void {
  pool = customPool;
}

export function getDbPool(): pg.Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const cloudSqlInstance = process.env.CLOUD_SQL_CONNECTION_NAME;
  const socketDir = process.env.DB_SOCKET_DIR || '/cloudsql';

  if (connectionString) {
    const isSocket = connectionString.includes('host=/cloudsql') || connectionString.includes('host=%2Fcloudsql');
    pool = new Pool({
      connectionString,
      ssl: !isSocket ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  } else if (cloudSqlInstance) {
    pool = new Pool({
      host: `${socketDir}/${cloudSqlInstance}`,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || undefined,
      database: process.env.DB_NAME || 'versa_collection',
      max: 10,
      idleTimeoutMillis: 30000,
    });
  } else {
    throw new Error('MISSING_DB_CONFIG: Defina DATABASE_URL ou CLOUD_SQL_CONNECTION_NAME.');
  }

  pool.on('error', (err) => {
    console.error('Erro inesperado no pool PostgreSQL:', err);
  });

  return pool;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<pg.QueryResult<T>> {
  const p = getDbPool();
  return p.query<T>(text, params);
}

export interface TransactionClient {
  query<T extends pg.QueryResultRow = pg.QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<pg.QueryResult<T>>;
}

export async function withTransaction<T>(
  action: (client: TransactionClient) => Promise<T>,
): Promise<T> {
  const p = getDbPool();
  const client = await p.connect();
  try {
    await client.query('BEGIN');
    const result = await action(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('Erro ao executar ROLLBACK na transação:', rollbackErr);
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function closeDbPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

