import { Pool } from 'pg';
const globalForPg = globalThis as unknown as { outdoorsPool?: Pool };
export const pool = globalForPg.outdoorsPool ?? new Pool({connectionString:process.env.DATABASE_URL, max:10});
if (process.env.NODE_ENV !== 'production') globalForPg.outdoorsPool = pool;
export async function query<T extends Record<string,unknown> = Record<string,unknown>>(sql:string,params:unknown[]=[]){return (await pool.query<T>(sql,params)).rows;}
