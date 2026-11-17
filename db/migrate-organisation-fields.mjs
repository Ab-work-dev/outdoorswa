import pg from 'pg';
import {readFile} from 'node:fs/promises';
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL missing from .env.local'); process.exit(1); }
const pool = new pg.Pool({connectionString:process.env.DATABASE_URL});
try {
 const sql=await readFile(new URL('./migrations/001_organisation_mapping_fields.sql', import.meta.url),'utf8');
 await pool.query(sql);
 console.log('Organisation mapping fields migrated successfully.');
} catch(err) { console.error(err); process.exitCode=1; }
finally {await pool.end();}
