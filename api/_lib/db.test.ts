import { afterEach, describe, expect, it, vi } from 'vitest';
import type pg from 'pg';
import { setDbPool, withTransaction } from './db.js';

describe('withTransaction helper', () => {
  afterEach(() => {
    setDbPool(null);
  });

  it('executes BEGIN, action, COMMIT and releases client on success', async () => {
    const executedQueries: string[] = [];
    const mockClient = {
      query: vi.fn(async (text: string) => {
        executedQueries.push(text);
        return { rows: [], command: 'SELECT', rowCount: 0, oid: 0, fields: [] };
      }),
      release: vi.fn(),
    };

    const mockPool = {
      connect: vi.fn(async () => mockClient),
      on: vi.fn(),
    } as unknown as pg.Pool;

    setDbPool(mockPool);

    const result = await withTransaction(async (client) => {
      await client.query('INSERT INTO test (name) VALUES ($1)', ['ok']);
      return 'success_val';
    });

    expect(result).toBe('success_val');
    expect(mockClient.release).toHaveBeenCalledTimes(1);
    expect(executedQueries).toEqual([
      'BEGIN',
      'INSERT INTO test (name) VALUES ($1)',
      'COMMIT',
    ]);
  });

  it('executes BEGIN, action, ROLLBACK and releases client on error', async () => {
    const executedQueries: string[] = [];
    const mockClient = {
      query: vi.fn(async (text: string) => {
        executedQueries.push(text);
        if (text.includes('FAIL')) {
          throw new Error('DATABASE_ERROR_SIMULATED');
        }
        return { rows: [], command: 'SELECT', rowCount: 0, oid: 0, fields: [] };
      }),
      release: vi.fn(),
    };

    const mockPool = {
      connect: vi.fn(async () => mockClient),
      on: vi.fn(),
    } as unknown as pg.Pool;

    setDbPool(mockPool);

    await expect(
      withTransaction(async (client) => {
        await client.query('INSERT INTO test (name) VALUES ($1)', ['ok']);
        await client.query('FAIL TRANSACTION');
      }),
    ).rejects.toThrow('DATABASE_ERROR_SIMULATED');

    expect(mockClient.release).toHaveBeenCalledTimes(1);
    expect(executedQueries).toEqual([
      'BEGIN',
      'INSERT INTO test (name) VALUES ($1)',
      'FAIL TRANSACTION',
      'ROLLBACK',
    ]);
  });
});
