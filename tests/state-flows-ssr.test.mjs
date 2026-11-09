import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..',import.meta.url));
const vite=await createServer({appType:'custom',configFile:false,root,resolve:{alias:{'@':root}},server:{middlewareMode:true,hmr:false,ws:false}});
after(()=>vite.close());

test('pitch controls render stable first-slide and stopped timer server snapshots without a browser',async()=>{
 const {usePitchSlide,usePitchTimer}=await vite.ssrLoadModule('/app/use-pitch-controls.ts');
 function Snapshot(){const {index}=usePitchSlide(6);const {left,running}=usePitchTimer();return React.createElement('output',null,`${index}/${left}/${running}`);}
 assert.equal(renderToString(React.createElement(Snapshot)),'<output>0/240/false</output>');
});

test('network SSR renders default synthetic selection without touching browser storage',async()=>{
 const {default:NetworkExplorer}=await vite.ssrLoadModule('/app/network-explorer.tsx');
 const html=renderToString(React.createElement(NetworkExplorer));
 assert.match(html,/Synthetic demonstration, not live surveillance/);
 assert.match(html,/<h3>Goa<\/h3>/);
 assert.match(html,/aria-pressed="true"[^>]*><span>1<\/span><b>Goa<\/b>/);
});

test('library pagination SSR starts at twelve rows for each filter',async()=>{
 const {useFilterLimit}=await vite.ssrLoadModule('/app/use-filter-limit.ts');
 function Snapshot({filter}){const {limit}=useFilterLimit(filter);return React.createElement('output',null,String(limit));}
 for(const filter of ['["",""]','["AST","all"]'])assert.equal(renderToString(React.createElement(Snapshot,{filter})),'<output>12</output>');
});
