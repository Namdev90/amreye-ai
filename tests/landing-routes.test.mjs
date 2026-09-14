import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {resolveSiteRoute,sectionHref} from '../app/site-routes.mjs';
const base=process.env.TEST_SITE_URL||'http://127.0.0.1:5179';

test('Library has a named route; old APEX bookmarks retain topics and filters',()=>{
  for(const fragment of ['apex','library']) assert.deepEqual(resolveSiteRoute('https://amreye.in/?topic=reader-v1&q=AST#'+fragment),{section:'library',href:'/library?topic=reader-v1&q=AST'});
  assert.deepEqual(resolveSiteRoute('https://amreye.in/library'),{section:'library',href:'/library'});
  assert.deepEqual(resolveSiteRoute('https://amreye.in/library#team'),{section:'team',href:'/#team'});
  assert.equal(sectionHref('library'),'/library');
  assert.equal(sectionHref('home'),'/#home');
});

test('landing topic count matches the actual repository',async()=>{
  const [stats,data]=await Promise.all(['../app/repository-stats.json','../app/dossier.json'].map(path=>readFile(new URL(path,import.meta.url),'utf8').then(JSON.parse)));
  assert.equal(stats.topics,data.topics.length);
  assert.equal(stats.sources,data.sources.length);
});

test('Library URL returns its own title and canonical and is in sitemap',async()=>{
  const response=await fetch(base+'/library');
  assert.equal(response.status,200);
  const html=await response.text();
  assert.match(html,/<title>Library · AMReye.AI<\/title>/);
  assert.match(html,/<link[^>]*rel="canonical"[^>]*href="https:\/\/amreye\.in\/library"/);
  const sitemap=await fetch(base+'/sitemap.xml').then(r=>r.text());
  assert.ok(sitemap.includes('<loc>https://amreye.in/library</loc>'));
});
