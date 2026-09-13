export function isAdminEmail(email,allowlist){
 if(typeof email!=='string'||typeof allowlist!=='string')return false;
 const entries=allowlist.split(',').map(x=>x.trim().toLowerCase()).filter(x=>x.includes('@'));
 return entries.includes(email.trim().toLowerCase());
}
export const privateHeaders={'Cache-Control':'private, no-store, max-age=0','X-Robots-Tag':'noindex, nofollow, noarchive','Vary':'Cookie, oai-authenticated-user-email'};
export function reviewInput(value){return value&&typeof value.id==='string'&&/^L\d{3}$/.test(value.id)&&Number(value.id.slice(1))>=1&&Number(value.id.slice(1))<=58&&['pending','ready','implemented','needs-input','not-selected'].includes(value.status)&&typeof value.note==='string'&&value.note.length<=4000;}
