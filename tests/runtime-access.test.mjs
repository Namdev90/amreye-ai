import test from 'node:test';
import assert from 'node:assert/strict';
const base=process.env.TEST_SITE_URL||'http://127.0.0.1:5173';
test('anonymous and non-admin requests cannot obtain private material',async()=>{
 for(const path of ['/api/private/library','/api/private/assets?name=reference%2Fwireframe.jpeg','/api/private/reviews'])for(const headers of [{},{'oai-authenticated-user-email':'outsider@example.com'}]){const r=await fetch(base+path,{headers});assert.equal(r.status,403,path);assert.match(r.headers.get('cache-control'),/no-store/);assert.match(r.headers.get('x-robots-tag'),/noindex/)}
 const page=await fetch(base+'/admin');const html=await page.text();assert.ok(html.includes('Sign in with ChatGPT'));assert.ok(!html.includes('BME690'));assert.match(page.headers.get('cache-control'),/no-store/);
});
test('previous public reference images are unavailable',async()=>{for(const path of ['/reference/wireframe.jpeg','/hardware/apex-exploded.webp'])assert.equal((await fetch(base+path)).status,404)});
test('declared collection bots are denied at the application route',async()=>{const r=await fetch(base+'/',{headers:{'User-Agent':'Mozilla/5.0 GPTBot/1.0'}});assert.equal(r.status,403)});
