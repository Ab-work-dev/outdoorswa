import {NextResponse} from 'next/server';import {checkMutationOrigin} from '@/lib/auth';
export async function POST(){const err=await checkMutationOrigin();if(err)return err;const r=NextResponse.json({ok:true});r.cookies.set('owa_session','',{path:'/',maxAge:0});return r}
