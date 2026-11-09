import test from 'node:test';
import assert from 'node:assert/strict';
import {navigateSiteLink} from '../app/site-link-navigation.mjs';

function fixture(href='https://example.test/') {
  const entries=[href]; let index=0;
  const events=[];
  const browser={
    get location(){ return new URL(entries[index]); },
    history:{pushState(_state,_unused,url){entries.splice(++index);entries.push(new URL(url,entries[index-1]).href);}},
    PopStateEvent:class { constructor(type){this.type=type;} },
    dispatchEvent(event){events.push({type:event.type,href:browser.location.href});},
    back(){if(index>0){index--;browser.dispatchEvent(new browser.PopStateEvent('popstate'));}},
    forward(){if(index<entries.length-1){index++;browser.dispatchEvent(new browser.PopStateEvent('popstate'));}},
  };
  const event={button:0,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;}};
  const anchor={href:'https://example.test/library',target:'',hasAttribute(){return false;}};
  return {browser,event,anchor,events,entries};
}

test('shell Links canonicalize legacy library bookmarks and preserve filters',()=>{
  const f=fixture();f.anchor.href='https://example.test/?q=AST&topic=reader-v1#apex';
  assert.equal(navigateSiteLink(f.event,f.anchor,f.browser),true);
  assert.equal(f.browser.location.pathname,'/library');
  assert.equal(f.browser.location.search,'?q=AST&topic=reader-v1');
  assert.equal(f.browser.location.hash,'');
  assert.equal(f.event.defaultPrevented,true);
  assert.equal(f.events.length,1);
  // The document's delegated listener must not push again after a Link handles it.
  assert.equal(navigateSiteLink(f.event,f.anchor,f.browser),false);
  assert.equal(f.entries.length,2);
});

test('section changes, library navigation, Back and Forward retain distinct history entries',()=>{
  const f=fixture();
  for(const path of ['/#products','/library?topic=reader-v1','/#team']) {
    f.event.defaultPrevented=false;f.anchor.href='https://example.test'+path;
    navigateSiteLink(f.event,f.anchor,f.browser);
  }
  f.browser.back();assert.equal(f.browser.location.pathname+f.browser.location.search,'/library?topic=reader-v1');
  f.browser.back();assert.equal(f.browser.location.hash,'#products');
  f.browser.forward();assert.equal(f.browser.location.pathname,'/library');
  assert.equal(f.events.length,6);
});

test('repeated navigation prevents framework fallback without adding duplicate history',()=>{
  const f=fixture('https://example.test/library');
  assert.equal(navigateSiteLink(f.event,f.anchor,f.browser),true);
  assert.equal(f.event.defaultPrevented,true);
  assert.equal(f.events.length,0);
  assert.equal(f.entries.length,1);
});

test('modified clicks, cancellation, targets, downloads, skip links and external/file URLs stay native',()=>{
  for(const changes of [
    {event:{button:1}},{event:{metaKey:true}},{event:{ctrlKey:true}},
    {event:{shiftKey:true}},{event:{altKey:true}},{event:{defaultPrevented:true}},
    {anchor:{target:'_blank'}},{anchor:{target:'named-frame'}},{anchor:{target:'_parent'}},
    {anchor:{hasAttribute:name=>name==='download'}},
    {anchor:{href:'https://other.test/library'}},
    {anchor:{href:'https://example.test/#main-content'}},
    {anchor:{href:'https://example.test/offline.html'}},
  ]) {
    const f=fixture();Object.assign(f.event,changes.event);Object.assign(f.anchor,changes.anchor);
    assert.equal(navigateSiteLink(f.event,f.anchor,f.browser),false);
    assert.equal(f.entries.length,1);assert.equal(f.events.length,0);
  }
});

test('an explicit self target still supports shell navigation',()=>{
  const f=fixture();f.anchor.target='_self';
  assert.equal(navigateSiteLink(f.event,f.anchor,f.browser),true);
  assert.equal(f.browser.location.pathname,'/library');
});
