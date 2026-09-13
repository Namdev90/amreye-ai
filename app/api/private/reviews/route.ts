const retired=()=>Response.json({error:'The admin review workspace has been removed.'},{status:410,headers:{'Cache-Control':'no-store'}});
export const GET=retired;
export const POST=retired;