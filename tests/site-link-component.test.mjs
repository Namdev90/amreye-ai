import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';

const root=fileURLToPath(new URL('..',import.meta.url));
const vite=await createServer({appType:'custom',configFile:false,root,server:{middlewareMode:true,hmr:false,ws:false}});
after(()=>vite.close());
const {default:SiteLink}=await vite.ssrLoadModule('/app/site-link.tsx');

test('shell Link keeps SSR href and accessible attributes',()=>{
  const html=renderToStaticMarkup(React.createElement(SiteLink,{href:'/#team','aria-label':'Meet the team'},'Team'));
  assert.match(html,/href="\/#team"/);
  assert.match(html,/aria-label="Meet the team"/);
  assert.match(html,/>Team<\/a>/);
});

test('shell Link composes menu dismissal before navigation and honors caller cancellation',()=>{
  const previous=globalThis.window;
  const order=[];
  globalThis.window={location:new URL('https://example.test/'),history:{pushState(){order.push('push');}},PopStateEvent:class{},dispatchEvent(){order.push('notify');}};
  try {
    const event={button:0,defaultPrevented:false,currentTarget:{href:'https://example.test/library',target:'',hasAttribute(){return false;}},preventDefault(){this.defaultPrevented=true;}};
    const element=SiteLink({href:'/library',onClick(){order.push('dismiss');},children:'Library'});
    element.props.onClick(event);
    assert.deepEqual(order,['dismiss','push','notify']);
    assert.equal(event.defaultPrevented,true);
    order.length=0;event.defaultPrevented=false;
    SiteLink({href:'/library',onClick(e){order.push('cancel');e.preventDefault();}}).props.onClick(event);
    assert.deepEqual(order,['cancel']);
  } finally {
    if(previous===undefined)delete globalThis.window;else globalThis.window=previous;
  }
});
