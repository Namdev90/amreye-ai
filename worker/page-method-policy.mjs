// These public pages have only client-side interactions, not Server Actions.
// Include Vinext's RSC URLs and the legacy /rsc probe target. Do not apply this
// policy to API routes: their handlers retain their own methods and data policy.
const readOnlyPagePaths = new Set(['/', '/library', '/rsc', '/.rsc', '/library.rsc']);
const allow = 'GET, HEAD, OPTIONS';

export function pageMethodResponse(pathname, method) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (!readOnlyPagePaths.has(path) || method === 'GET' || method === 'HEAD') return null;
  const headers = {
    Allow: allow,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  };
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers });
  // Reject before Vinext reads/decodes an action payload. Never echo its content.
  return new Response('Method Not Allowed', { status: 405, headers });
}
