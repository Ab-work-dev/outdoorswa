import {pool} from '@/lib/db';
import {error} from '@/lib/api';
export const dynamic='force-dynamic';
const allowed=['activities','organisations','locations','relationships'];
function csvCell(v:unknown){
 const s=Array.isArray(v)?v.join('; '):v==null?'':typeof v==='object'?JSON.stringify(v):String(v);
 const safe=/^[=+@\-\t\r]/.test(s)?"'"+s:s;
 return '"'+safe.replaceAll('"','""')+'"';
}
export async function GET(req:Request){
 const resource=new URL(req.url).searchParams.get('resource')||'activities';
 if(!allowed.includes(resource))return Response.json({error:'Invalid resource'},{status:400});
 try{
  const r=await pool.query(`SELECT * FROM ${resource} ORDER BY created_at DESC LIMIT 20000`);
  const cols=r.fields.map(f=>f.name);
  const rows=[cols.join(','),...r.rows.map(row=>cols.map(c=>csvCell(row[c])).join(','))];
  return new Response('\uFEFF'+rows.join('\r\n'),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="outdoors-wa-${resource}.csv"`}});
 }catch(e){return error(e)}
}
