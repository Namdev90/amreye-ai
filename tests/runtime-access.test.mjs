import test from 'node:test';
import assert from 'node:assert/strict';
const base=process.env.TEST_SITE_URL||'http://127.0.0.1:5179';
test('legacy admin links redirect directly to the public library without sign-in',async()=>{const r=await fetch(base+'/admin?topic=topic-45',{redirect:'manual'});assert.ok([307,308].includes(r.status));const target=new URL(r.headers.get('location'),base);assert.equal(target.pathname+target.search+target.hash,'/library?topic=topic-45')});
test('technical chapters, references and the compendium are public',async()=>{for(const path of ['/library/compendium-011-015.json','/library/topic-45.json','/reference/wireframe.jpeg','/hardware/apex-exploded.webp','/documents/amreye-compendium.pdf']){const r=await fetch(base+path);assert.equal(r.status,200,path);await r.body.cancel()}});
test('retired admin review endpoints cannot write or expose review notes',async()=>{for(const method of ['GET','POST']){const r=await fetch(base+'/api/private/reviews',{method});assert.equal(r.status,410);const b=await r.json();assert.equal(Object.hasOwn(b,'rows'),false)}});
