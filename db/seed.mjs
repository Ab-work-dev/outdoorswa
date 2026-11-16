import pg from 'pg';
if(!process.env.DATABASE_URL){console.error('DATABASE_URL missing');process.exit(1)}
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});
try{
 const activities=[['Bushwalking','Land','Recreation'],['Sea Kayaking','Water','Adventure & Tourism'],['Mountain Biking','Land','Recreation'],['Skydiving','Air','Adventure & Tourism'],['Snorkelling','Water','Recreation']];
 for(const [name,environment,category] of activities){await pool.query(`INSERT INTO activities(code,name,environment,category,description,status) VALUES('ACT-' || lpad(nextval('activity_code_seq')::text,5,'0'),$1,$2,$3,'Illustrative activity record — replace with verified research.','Researching') ON CONFLICT DO NOTHING`,[name,environment,category])}
 const orgs=[['Example Adventure Operator','Commercial Operator',['Activity Provider','Tour Operator']],['Example Equipment Supplier','Retailer',['Equipment Supplier']]];
 for(const [name,organisation_type,roles] of orgs){await pool.query(`INSERT INTO organisations(code,name,organisation_type,roles,services,status) VALUES('ORG-' || lpad(nextval('organisation_code_seq')::text,5,'0'),$1,$2,$3,'Demonstration only — not a real organisation','Researching') ON CONFLICT DO NOTHING`,[name,organisation_type,roles])}
 console.log('Illustrative demo seed inserted (no real operator claims).');
}finally{await pool.end()}
