import {pool} from '@/lib/db';import {parsePagination,pageResult} from '@/lib/pagination';import {createRecord,validResource,error} from '@/lib/api';
export const dynamic='force-dynamic';
type P={params:Promise<{resource:string}>};
export async function GET(req:Request,{params}:P){const {resource}=await params;if(!validResource(resource))return Response.json({error:'Invalid resource'},{status:404});try{const url=new URL(req.url);const q=(url.searchParams.get('q')||'').slice(0,150);const env=url.searchParams.get('environment');const cat=url.searchParams.get('category');const region=url.searchParams.get('region');const where:string[]=[];const args:unknown[]=[];if(q){args.push('%'+q+'%');where.push(`(name ILIKE $${args.length} OR code ILIKE $${args.length})`)}if(resource==='activities'&&env&&['Land','Water','Air'].includes(env)){args.push(env);where.push(`environment=$${args.length}`)}if(resource==='activities'&&cat){args.push(cat);where.push(`category=$${args.length}`)}if(resource!=='activities'&&region){args.push(region);where.push(`region=$${args.length}`)}const condition=where.length?'WHERE '+where.join(' AND '):'';
  // ?page=1&pageSize=25 activates the paginated response. Legacy consumers
  // can still request the original array, capped at 500 for compatibility.
  if(url.searchParams.has('page')){
    const {page,pageSize,offset}=parsePagination(url);
    const total=Number((await pool.query(`SELECT COUNT(*) AS total FROM ${resource} ${condition}`,args)).rows[0].total);
    const values=[...args,pageSize,offset];
    const rows=(await pool.query(`SELECT * FROM ${resource} ${condition} ORDER BY name ASC,id ASC LIMIT $${values.length-1} OFFSET $${values.length}`,values)).rows;
    return Response.json(pageResult(rows,total,page,pageSize));
  }
  const sql=`SELECT * FROM ${resource} ${condition} ORDER BY name ASC,id ASC LIMIT 500`;return Response.json((await pool.query(sql,args)).rows)}catch(e){return error(e)}}
export async function POST(req:Request,{params}:P){const {resource}=await params;if(!validResource(resource))return Response.json({error:'Invalid resource'},{status:404});return createRecord(req,resource)}
