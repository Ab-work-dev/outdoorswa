import {editRecord,deleteRecord,validResource} from '@/lib/api';
type P={params:Promise<{resource:string,id:string}>};
export async function PUT(req:Request,{params}:P){const {resource,id}=await params;if(!validResource(resource))return Response.json({error:'Invalid resource'},{status:404});return editRecord(req,resource,id)}
export async function DELETE(_req:Request,{params}:P){const {resource,id}=await params;if(!validResource(resource))return Response.json({error:'Invalid resource'},{status:404});return deleteRecord(resource,id)}
