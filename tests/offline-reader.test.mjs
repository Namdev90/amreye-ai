import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

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
