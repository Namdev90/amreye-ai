import assets from '../../../../private/assets.json';
import {adminIdentity} from '../../../server-access';
import {privateHeaders} from '../../../access-policy.mjs';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!await adminIdentity())return Response.json({error:'Admin access required'},{status:403,headers:privateHeaders});
 const name=new URL(request.url).searchParams.get('name');
 if(!name||!Object.prototype.hasOwnProperty.call(assets,name))return new Response('Not found',{status:404,headers:privateHeaders});
 const asset=(assets as Record<string,{type:string;data:string}>)[name];
 const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
 return new Response(bytes,{headers:{...privateHeaders,'Content-Type':asset.type}});
}
