import {createHmac,timingSafeEqual} from 'node:crypto';
import {cookies,headers} from 'next/headers';
const COOKIE='owa_session';
function secret(){if(!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length<32)throw Error('SESSION_SECRET must be at least 32 characters');return process.env.SESSION_SECRET}
function sign(payload:string){return createHmac('sha256',secret()).update(payload).digest('hex')}
export function issueToken(){const payload=String(Date.now()+1000*60*60*8);return `${payload}.${sign(payload)}`}
export async function isAdmin(){try{const token=(await cookies()).get(COOKIE)?.value||''; const [exp,sig]=token.split('.');if(!exp||!sig||!/^\d+$/.test(exp)||Number(exp)<Date.now())return false;const good=sign(exp);return sig.length===good.length && timingSafeEqual(Buffer.from(sig),Buffer.from(good))}catch{return false}}
export async function requireAdmin(){if(!await isAdmin())return Response.json({error:'Authentication required'},{status:401});return null}
export async function checkMutationOrigin(){const h=await headers();const origin=h.get('origin');const host=h.get('x-forwarded-host')||h.get('host'); if(!origin||!host)return Response.json({error:'Origin header required'},{status:403});try{if(new URL(origin).host!==host)return Response.json({error:'Cross-origin requests denied'},{status:403})}catch{return Response.json({error:'Invalid origin'},{status:403})}return null}
export const cookieName=COOKIE;
