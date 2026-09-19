import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('activating the summary-only edition removes old document caches',async()=>{
 const listeners={},deleted=[],requests=[];
 const context={URL,Response,self:{location:{origin:'https://amreye.in'},addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>({put:async()=>{}}),keys:async()=>['amreye-reader-v8','amr-old-documents','unrelated-cache'],delete:async key=>{deleted.push(key);return true}},fetch:async path=>{requests.push(path);return new Response('Minimal offline page')}};
 vm.runInNewContext(fs.readFileSync(new URL('../public/sw.js',import.meta.url),'utf8'),context);
 let pending;listeners.install({waitUntil:p=>pending=p});await pending;
 assert.deepEqual(requests.sort(),['/amr-eye-icon.png','/offline.html']);
 listeners.activate({waitUntil:p=>pending=p});await pending;
 assert.deepEqual(deleted.sort(),['amr-old-documents','amreye-reader-v8']);
 let intercepted=false;listeners.fetch({request:{url:'https://amreye.in/repository.json',method:'GET',mode:'cors'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
 const offline=fs.readFileSync(new URL('../public/offline.html',import.meta.url),'utf8');assert.doesNotMatch(offline,/repository\.json|compendium|topic-45/);
});

test('revisiting online refreshes the reader retained for disconnected navigation',async()=>{
 const listeners={}; const saved=new Map(); let offline=false; let edition='first edition';
 const context={URL,Response,self:{location:{origin:'https://amreye.in'},addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>({put:async(key,response)=>saved.set(key,response)}),match:async key=>saved.get(key)?.clone(),keys:async()=>[],delete:async()=>true},fetch:async request=>{if(offline)throw new Error('Disconnected');return new Response(typeof request==='string'?edition:'online page',{headers:{'Content-Type':'text/html'}})}};
 vm.runInNewContext(fs.readFileSync(new URL('../public/sw.js',import.meta.url),'utf8'),context);
 let installation;listeners.install({waitUntil:p=>installation=p});await installation;
 assert.equal(await saved.get('/offline.html').clone().text(),'first edition');
 edition='updated edition';const pending=[];let navigation;
 listeners.fetch({request:{url:'https://amreye.in/',method:'GET',mode:'navigate'},waitUntil:p=>pending.push(p),respondWith:p=>navigation=p});
 assert.equal(await(await navigation).text(),'online page');await Promise.all(pending);
 assert.equal(await saved.get('/offline.html').clone().text(),'updated edition');
 offline=true;const offlinePending=[];
 listeners.fetch({request:{url:'https://amreye.in/',method:'GET',mode:'navigate'},waitUntil:p=>offlinePending.push(p),respondWith:p=>navigation=p});
 assert.equal(await(await navigation).text(),'updated edition');await Promise.all(offlinePending);
});
