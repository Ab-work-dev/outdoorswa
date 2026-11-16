import {isAdmin} from '@/lib/auth';import Workspace from '@/components/Workspace';
export const dynamic='force-dynamic';
export default async function Home(){return <Workspace initialAdmin={await isAdmin()}/>}
