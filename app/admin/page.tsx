import {headers} from 'next/headers';
import {adminIdentity} from '../server-access';
import {chatGPTSignInPath,chatGPTSignOutPath} from '../chatgpt-auth';
import AdminWorkspace from '../admin-workspace';
export const dynamic='force-dynamic';
export const metadata={title:'AMREye · Admin',robots:{index:false,follow:false},openGraph:{title:'AMREye · Admin',description:'Authorized access only.',images:[]},twitter:{images:[]}};
export default async function AdminPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const params=await searchParams;const topic=typeof params.topic==='string'?params.topic:null;const returnTo='/admin'+(topic?'?topic='+encodeURIComponent(topic)+'#apex':'');
 const admin=await adminIdentity();const h=await headers();const signedIn=!!h.get('oai-authenticated-user-email');
 return <main className="admin-shell"><header><a href="/">AMREye · Public overview</a>{admin&&<a href={chatGPTSignOutPath('/')} target="_top">Sign out</a>}</header>{admin?<AdminWorkspace/>:<section className="section"><span className="eyebrow">ADMIN ACCESS</span><h1>Protected project review.</h1><p>Technical detail and the presentation workspace require the admin account.</p>{signedIn?<p role="alert">This account cannot open the admin workspace.</p>:<a className="solid-link" href={chatGPTSignInPath(returnTo)} target="_top">Sign in with ChatGPT</a>}<p><a href="/">Return to the public overview</a></p></section>}</main>
}
