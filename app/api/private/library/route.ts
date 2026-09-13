import {adminIdentity} from '../../../server-access';
import {privateHeaders} from '../../../access-policy.mjs';
import library from '../../../../private/library.json';
import intake from '../../../../private/intake.json';
export const dynamic='force-dynamic';
export async function GET(){if(!await adminIdentity())return Response.json({error:'Admin access required'},{status:403,headers:privateHeaders});return Response.json({library,intake,supplements},{headers:privateHeaders});}
import supplements from '../../../../private/supplements.json';
