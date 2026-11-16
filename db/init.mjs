import pg from 'pg'; import {readFile} from 'node:fs/promises';
if(!process.env.DATABASE_URL){console.error('DATABASE_URL missing');process.exit(1)}
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});
try{await pool.query(await readFile(new URL('./schema.sql',import.meta.url),'utf8'));console.log('Database schema initialized.')}finally{await pool.end()}
