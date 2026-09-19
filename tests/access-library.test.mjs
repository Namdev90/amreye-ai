import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {searchTopics} from '../app/search-core.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const catalog=read('../app/dossier.json'),publicData=read('../app/public-knowledge.json');
test('all 150 project topics retain a short distinct explanation and project reference',()=>{
 assert.equal(publicData.topics.length,150);
 assert.deepEqual(publicData.topics.map(t=>t.id).sort(),catalog.topics.map(t=>t.id).sort());
 assert.equal(new Set(publicData.topics.map(t=>t.text[0])).size,150);
 for(const t of publicData.topics){assert.ok(t.text[0].length>40,t.id);assert.ok(t.text[0].length<700,t.id);assert.match(t.referenceLabel,/Internal project reference/);assert.ok(!('pages' in t));assert.ok(!('searchText' in t));assert.deepEqual(t.tables,[]);}
});
test('legacy topic bookmarks, references and categories resolve',()=>{
 const ids=new Set(publicData.topics.map(t=>t.id)),sources=new Set(publicData.sources.map(s=>s.id)),areas=new Set(publicData.areas.map(a=>a.id));
 for(const id of read('../private/legacy-ids.json'))assert.ok(ids.has(id),id);
 for(const t of publicData.topics){assert.ok(areas.has(t.category),t.id);for(const id of t.related)assert.ok(ids.has(id),id);for(const id of t.sourceIds)assert.ok(sources.has(id),id);assert.ok(!t.sourceIds.includes('R36'));}
});
test('public summary search covers the major scientific and engineering subjects',()=>{for(const q of ['Reader V1','digital twin','heteroresistance','BME690','PIMS','stem cells','campus audit'])assert.ok(searchTopics(publicData.topics,q).length,q)});
test('private documents and raw catalogue are absent from public hosting and build assets',()=>{
 for(const dir of ['../public','../dist/client'])for(const name of fs.readdirSync(new URL(dir,import.meta.url),{recursive:true}))assert.doesNotMatch(name,/repository\.json$|library[\\/].*\.json$|\.(pdf|docx?|xlsx?|csv|md|map)$/i,name);
 const s=JSON.stringify(publicData);assert.doesNotMatch(s,/C:[\\/]|ADMIN_EMAILS|api[_-]?key["']?\s*[:=]|drive\.google\.com|docs\.google\.com/i);
 for(const source of publicData.sources)assert.equal(new URL(source.url).protocol,'https:');
});
