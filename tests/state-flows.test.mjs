import test from 'node:test';
import assert from 'node:assert/strict';
import {elapsedSeconds,timerReducer} from '../app/pitch-timer.mjs';
import {subscribeSlide,readSlide,chooseSlide} from '../app/pitch-location.mjs';
import {loadChapter} from '../app/chapter-resource.mjs';
import {readMapSession} from '../app/map-session.mjs';
import {defaultMapState} from '../app/network-data.mjs';

test('pitch timer pauses, resumes, restarts and finishes without stale elapsed closures',()=>{
 let state={duration:3,elapsed:0,startedAt:null};
 state=timerReducer(state,{type:'toggle',now:1000});
 assert.equal(elapsedSeconds(state,11000),10);
 state=timerReducer(state,{type:'toggle',now:11000});
 assert.equal(state.elapsed,10);
 assert.equal(elapsedSeconds(state,99000),10);
 state=timerReducer(state,{type:'toggle',now:100000});
 assert.equal(elapsedSeconds(state,105000),15);
 state=timerReducer(state,{type:'tick',now:300000});
 assert.equal(state.startedAt,null);
 assert.equal(state.elapsed,180);
 assert.equal(timerReducer(state,{type:'toggle',now:400000}),state);
 state=timerReducer(state,{type:'reset',now:0});
 assert.deepEqual(state,{duration:3,elapsed:0,startedAt:null});
 state=timerReducer(state,{type:'toggle',now:500000});
 state=timerReducer(state,{type:'duration',duration:5,now:501000});
 assert.deepEqual(state,{duration:5,elapsed:0,startedAt:null});
});

test('pitch URL store publishes repeated selection and history changes, preserves URL and router state, and unsubscribes',()=>{
 const old=Object.fromEntries(['window','location','history'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
 const target=new EventTarget();let href='https://example.test/?pitch=1&topic=ast#demo';const routerState={router:'preserved'};
 Object.defineProperties(globalThis,{
  window:{value:target,configurable:true},
  location:{get:()=>new URL(href),configurable:true},
  history:{value:{state:routerState,replaceState:(state,unused,url)=>{assert.equal(state,routerState);href=String(url);}},configurable:true}
 });
 try {
  let changes=0;const unsubscribe=subscribeSlide(()=>changes++);
  assert.equal(readSlide(),null);
  chooseSlide(4,6);assert.equal(readSlide(),'5');
  assert.equal(new URL(href).searchParams.get('topic'),'ast');assert.equal(new URL(href).hash,'#demo');
  chooseSlide(4,6);assert.equal(changes,2);
  href='https://example.test/?slide=2';target.dispatchEvent(new Event('popstate'));assert.equal(readSlide(),'2');
  href='https://example.test/?slide=3#pitch';target.dispatchEvent(new Event('hashchange'));assert.equal(readSlide(),'3');
  assert.equal(changes,4);unsubscribe();chooseSlide(1,6);assert.equal(changes,4);
 } finally {for(const [key,descriptor] of Object.entries(old)){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}}
});

test('chapter cancellation ignores late success, decode failure and request failure',async()=>{
 for(const failure of ['none','decode','request']) {
  const controller=new AbortController();let release;
  const pending=new Promise(resolve=>{release=resolve;});
  const request=loadChapter('older',controller.signal,async()=>{await pending;if(failure==='request')throw Error('network');return {ok:true,json:async()=>{if(failure==='decode')throw Error('decode');return {id:'older'};}};});
  controller.abort();release();assert.equal(await request,null);
 }
});

test('chapter errors can be retried and identifiers are encoded',async()=>{
 let url;const controller=new AbortController();
 const failed=await loadChapter('a/b',controller.signal,async path=>{url=path;return {ok:false};});
 assert.equal(url,'/library/a%2Fb.json');assert.equal(failed.detail,null);assert.match(failed.error,/try again/);
 const success=await loadChapter('a/b',controller.signal,async()=>({ok:true,json:async()=>({id:'a/b'})}));
 assert.deepEqual(success,{detail:{id:'a/b'},error:''});
});

test('map session restores valid independent selections and safely falls back for malformed or denied storage',()=>{
 const saved={...defaultMapState,view:'global',selection:{india:'delhi',global:'europe'}};
 assert.deepEqual(readMapSession({getItem:()=>JSON.stringify(saved)}),saved);
 for(const storage of [{getItem:()=>'{bad'},{getItem:()=>null},{getItem:()=>{throw Error('denied');}}])assert.deepEqual(readMapSession(storage),defaultMapState);
});
