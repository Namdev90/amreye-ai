import {headers} from 'next/headers';
import {env} from 'cloudflare:workers';
import {isAdminEmail} from './access-policy.mjs';
export async function adminIdentity(){
 const h=await headers();
 const email=h.get('oai-authenticated-user-email');
 const admins=(env as unknown as {ADMIN_EMAILS?:string}).ADMIN_EMAILS;
 return isAdminEmail(email,admins)?{email:email!}:null;
}
