import {pool} from '@/lib/db';import {parsePagination,pageResult} from '@/lib/pagination';import {requireAdmin,checkMutationOrigin} from '@/lib/auth';import {relationshipSchema} from '@/lib/validation';import {error} from '@/lib/api';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{
  const url=new URL(req.url);
  const search=(url.searchParams.get('q')||'').trim().slice(0,150);
  const values:unknown[]=[];
  const condition=search?`WHERE (a.name ILIKE $1 OR a.code ILIKE $1 OR coalesce(o.name,l.name) ILIKE $1 OR r.role ILIKE $1)`:'';
  if(search)values.push('%'+search+'%');
  const joins=`FROM relationships r JOIN activities a ON a.id=r.activity_id LEFT JOIN organisations o ON o.id=r.organisation_id LEFT JOIN locations l ON l.id=r.location_id`;
  const columns=`r.*,a.name AS activity_name,a.code AS activity_code,coalesce(o.name,l.name) AS target_name,CASE WHEN o.id IS NOT NULL THEN 'Organisation' ELSE 'Location' END AS target_type`;
  if(url.searchParams.has('page')){
    const {page,pageSize,offset}=parsePagination(url);
    const total=Number((await pool.query(`SELECT COUNT(*) AS total ${joins} ${condition}`,values)).rows[0].total);
    const args=[...values,pageSize,offset];
    const rows=(await pool.query(`SELECT ${columns} ${joins} ${condition} ORDER BY a.name,r.role,r.id LIMIT $${args.length-1} OFFSET $${args.length}`,args)).rows;
    return Response.json(pageResult(rows,total,page,pageSize));
  }
  return Response.json((await pool.query(`SELECT ${columns} ${joins} ${condition} ORDER BY a.name,r.role,r.id LIMIT 1000`,values)).rows);
}catch(e){return error(e)}}
export async function POST(req:Request){const auth=await requireAdmin();if(auth)return auth;const origin=await checkMutationOrigin();if(origin)return origin;try{const d=relationshipSchema.parse(await req.json());const r=await pool.query(`INSERT INTO relationships(activity_id,organisation_id,location_id,role,note,source_url) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,[d.activity_id,d.organisation_id,d.location_id,d.role,d.note,d.source_url]);await pool.query('INSERT INTO audit_log(resource,resource_id,operation,data) VALUES($1,$2,$3,$4)',['relationships',r.rows[0].id,'CREATE',JSON.stringify(r.rows[0])]);return Response.json(r.rows[0],{status:201})}catch(e){return error(e)}}
