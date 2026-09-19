"use client";
import {useEffect,useMemo,useState} from 'react';
import {ArrowUpRight, ArrowLeft, BookOpen, Search, X, Copy} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle} from '@/components/ui/dialog';
import data from './public-knowledge.json';
import {searchTopics,relatedTopics} from './search-core.mjs';
import VisualExplainer from './visual-explainer';

export default function KnowledgeLibrary(){
 const [query,setQuery]=useState(''),[area,setArea]=useState(''),[id,setId]=useState<string|null>(null),[notice,setNotice]=useState(''),[limit,setLimit]=useState(12),[ready,setReady]=useState(false);
 useEffect(()=>{const read=()=>{const p=new URLSearchParams(location.search);setId(p.get('topic'));setQuery(p.get('q')||'');const next=p.get('area')||p.get('category')||'';setArea(data.areas.some(a=>a.id===next)?next:next==='all'?'all':'');setReady(true)};read();addEventListener('popstate',read);addEventListener('hashchange',read);return()=>{removeEventListener('popstate',read);removeEventListener('hashchange',read)}},[]);
 useEffect(()=>{if(!ready)return;const timer=setTimeout(()=>{const u=new URL(location.href);if(u.pathname!=='/library')return;query?u.searchParams.set('q',query):u.searchParams.delete('q');area?u.searchParams.set('area',area):u.searchParams.delete('area');u.searchParams.delete('category');history.replaceState({},'',u)},180);return()=>clearTimeout(timer)},[query,area,ready]);
 useEffect(()=>setLimit(12),[query,area]);
 const pick=(next:string|null)=>{if(next===id)return;setId(next);setNotice('');const u=new URL(location.href);u.pathname='/library';u.hash='';next?u.searchParams.set('topic',next):u.searchParams.delete('topic');history.pushState({},'',u)};
 const filtered=useMemo(()=>{const list=query.trim()?searchTopics(data.topics,query).map(x=>x.topic):data.topics;return list.filter(t=>!area||area==='all'||t.category===area)},[query,area]);
 const topic=data.topics.find(t=>t.id===id),expanded=!!(query.trim()||area);
 const group=data.areas.find(a=>a.id===area);
 const reset=()=>{setQuery('');setArea('');setNotice('')};
 return <section id="library" className="section editorial-page knowledge-library">
  <header className="knowledge-heading"><span className="eyebrow">AMReye.AI KNOWLEDGE LIBRARY</span><h1>A little of everything.<br/><em>Clearly explained.</em></h1><p>{data.topics.length} project topics across microbiology, instruments, AI and the work ahead. Start with an area, or search a question.</p></header>
  <form className="amr-search knowledge-search" role="search" onSubmit={e=>{e.preventDefault();if(!query.trim())setArea('all')}}><Search aria-hidden="true"/><input type="search" aria-label="Search the library" placeholder="Try antibiotic testing, AI or data…" value={query} onChange={e=>setQuery(e.target.value)}/><button aria-label="Find topics" type="submit"><ArrowUpRight/></button></form>
  <nav className="knowledge-areas" aria-label="Knowledge areas">{data.areas.map(a=><button key={a.id} aria-pressed={area===a.id} onClick={()=>{setArea(area===a.id?'':a.id);setQuery('')}}><span>{a.title}<ArrowUpRight size={18} aria-hidden="true"/></span><p>{a.description}</p><small>{data.topics.filter(t=>t.category===a.id).length} topics</small></button>)}</nav>
  {!query&&area!=='all'&&<VisualExplainer area={area||'ast'} onTopic={pick} compact/>}
  <div className="knowledge-results-heading"><div><h2>{group?.title||(query?'Search results':'Explore at your own pace')}</h2><p role="status">{expanded?`${filtered.length} matching topics`:'Choose an area above for short explanations and references.'}</p></div>{expanded?<button className="text-link" onClick={reset}>Clear filters<X size={16}/></button>:<button className="text-link" onClick={()=>setArea('all')}>Browse all {data.topics.length} topics<ArrowUpRight size={17}/></button>}</div>
  {id&&!topic&&<aside className="offline-card" role="status"><h2>Topic not found</h2><p>This bookmark may be out of date. Search a subject above.</p><button onClick={()=>pick(null)}>Close this topic</button></aside>}
  {expanded&&<div className="knowledge-topics">{filtered.slice(0,limit).map(t=><button key={t.id} onClick={()=>pick(t.id)}><span className="knowledge-stage">{t.status}</span><h3>{t.title}</h3><p>{t.text[0]}</p><span className="knowledge-read">Understand this topic<ArrowUpRight size={17}/></span></button>)}</div>}
  {expanded&&!filtered.length&&<div className="offline-card"><h3>No matching topics</h3><p>Try a shorter term, such as “AST”, “camera” or “privacy”.</p><button className="secondary-action" onClick={reset}>Reset search</button></div>}
  {expanded&&filtered.length>limit&&<button className="secondary-action library-more" onClick={()=>setLimit(n=>n+12)}>Show more topics ({filtered.length-limit} remaining)</button>}
  <aside className="knowledge-guide"><BookOpen aria-hidden="true"/><p>These are short introductions to project research. “Proposed” and “future research” describe work to be developed and tested. A reference explains the background; it does not validate AMReye.AI’s product.</p></aside>
  <Dialog open={!!topic} onOpenChange={open=>!open&&pick(null)}><DialogContent className="knowledge-dialog" aria-describedby="knowledge-description"><DialogHeader><span className="eyebrow">{data.areas.find(a=>a.id===topic?.category)?.title} · {topic?.status}</span><DialogTitle>{topic?.title}</DialogTitle></DialogHeader>
   {topic&&<><p id="knowledge-description" className="knowledge-meaning">{topic.text[0]}</p><div className="knowledge-reference"><h3>Project reference</h3><p>{topic.referenceLabel}</p><small>Summarised from the project’s consolidated research and technical records. Original documents remain private.</small></div>
    {topic.sourceIds.length>0&&<div className="knowledge-citations"><h3>Background references</h3>{data.sources.filter(s=>topic.sourceIds.includes(s.id)).map(s=><a href={s.url} key={s.id} target="_blank" rel="noopener noreferrer"><span>{s.title}</span><ArrowUpRight size={16} aria-hidden="true"/></a>)}</div>}
    <div className="knowledge-related"><h3>A little further</h3>{relatedTopics(data.topics,topic).slice(0,4).map(t=><button key={t.id} onClick={()=>pick(t.id)}>{t.title}<ArrowUpRight size={16}/></button>)}</div>
    <div className="topic-actions"><button onClick={()=>pick(null)}><ArrowLeft size={16}/>Back to the library</button><button onClick={async()=>{try{await navigator.clipboard.writeText(location.href);setNotice('Topic link copied')}catch{setNotice('Copy this page’s address from your browser')}}}><Copy size={16}/>Copy topic link</button><span role="status">{notice}</span></div>
   </>}
  </DialogContent></Dialog>
 </section>;
}
