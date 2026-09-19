"use client";
import {useEffect,useState,lazy,Suspense} from 'react';
import {Dialog,DialogContent,DialogTitle} from '@/components/ui/dialog';
import {directory} from './discovery';
import VisualPitch from './visual-pitch';
import VisualExplainer,{routeArea} from './visual-explainer';
import {HomeDirectory,SiteNavigation} from './landing';
import ProjectAssistant from './project-assistant';
import {resolveSiteRoute,sectionHref} from './site-routes.mjs';
import data from './public-knowledge.json';
const Pathways=lazy(()=>import('./project-pages').then(m=>({default:m.Pathways})));
const Recognition=lazy(()=>import('./project-pages').then(m=>({default:m.Recognition})));
const Team=lazy(()=>import('./project-pages').then(m=>({default:m.Team})));
const Contact=lazy(()=>import('./contact'));
const ProjectGuide=lazy(()=>import('./project-pages').then(m=>({default:m.ProjectGuide})));
const LibraryView=lazy(()=>import('./library-screen'));
const ProductShowcase=lazy(()=>import('./product-showcase'));
const Analysis=lazy(()=>import('./analysis-workbench'));
const Network=lazy(()=>import('./network-explorer'));
const Workflow=lazy(()=>import('./workflow'));
const topicFor:Record<string,string>={problem:'reader-v1',hardware:'topic-75',technology:'compendium-092-102',imaging:'reader-v1',modules:'topic-75',twin:'plate-provenance',bahu:'topic-39',architecture:'topic-45',integration:'interoperability',automation:'topic-70',applications:'topic-67',positioning:'topic-73',wall:'automation-glossary',sources:'topic-80','project-progress':'topic-80',business:'system-service',roadmap:'topic-80',research:'compendium-229-238',references:'research-configurations'};
export default function SiteShell({initialActive='home'}:{initialActive?:string}){
 const [active,setActive]=useState(initialActive),[pitch,setPitch]=useState(false);
 useEffect(()=>{
  const read=()=>{const route=resolveSiteRoute(location.href);setActive(route.section);if(route.href!==location.pathname+location.search+location.hash)history.replaceState({},'',route.href);setPitch(new URLSearchParams(location.search).get('pitch')==='1')};
  const navigate=(event:MouseEvent)=>{if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const anchor=(event.target as Element)?.closest<HTMLAnchorElement>('a[href]');if(!anchor||anchor.target==='_blank'||anchor.hasAttribute('download'))return;const target=new URL(anchor.href,location.href);if(target.origin!==location.origin||!['/','/library'].includes(target.pathname)||target.hash==='#main-content')return;const route=resolveSiteRoute(target.href);event.preventDefault();if(route.href===location.pathname+location.search+location.hash)return;history.pushState({},'',route.href);window.dispatchEvent(new PopStateEvent('popstate'))};
  read();addEventListener('hashchange',read);addEventListener('popstate',read);document.addEventListener('click',navigate);if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).catch(()=>{});return()=>{removeEventListener('hashchange',read);removeEventListener('popstate',read);document.removeEventListener('click',navigate)};
 },[]);
 useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});document.title=active==='library'?'Library · AMReye.AI':active==='home'?'AMReye.AI · Antimicrobial Intelligence':`${directory.flatMap(g=>g.links).find(l=>l[1]===active)?.[0]||'Explore'} · AMReye.AI`;document.querySelector('link[rel="canonical"]')?.setAttribute('href',active==='library'?'https://amreye.in/library':'https://amreye.in/')},[active]);
 const togglePitch=(value:boolean)=>{setPitch(value);const url=new URL(location.href);if(value)url.searchParams.set('pitch','1');else{url.searchParams.delete('pitch');url.searchParams.delete('slide')}history.replaceState({},'',url)};
 const topic=data.topics.find(t=>t.id===topicFor[active]);const label=active==='research'?'Research across the project':directory.flatMap(g=>g.links).find(l=>l[1]===active)?.[0]||'Explore AMReye.AI';
 return <div className="amr-site"><SiteNavigation active={active} onPitch={()=>togglePitch(true)}/><main id="main-content" tabIndex={-1}><Suspense fallback={<section className="section route-loading" role="status">Opening AMReye.AI…</section>}>
 {active==='home'?<HomeDirectory/>:active==='pathways'?<Pathways/>:active==='products'?<ProductShowcase/>:active==='team'?<Team/>:active==='recognition'?<Recognition/>:active==='guide'?<ProjectGuide/>:active==='library'?<LibraryView/>:active==='workflow'?<Workflow/>:active==='about'?<section id="about" className="section editorial-page"><h1>Start a conversation.</h1><Contact/></section>:active==='demo'||active==='console'?<section id={active} className="section"><h1>Synthetic plate review</h1><p>Explore measurement, correction and qualified review with fictional examples.</p><Analysis/></section>:active==='network'?<section id="network" className="section"><h1>AMR network concept</h1><p>Explore fixed synthetic examples. These are not live surveillance data.</p><Network/></section>:<section id={active} className="section editorial-page"><span className="eyebrow">{topic?.status||'AMReye.AI'}</span><h1>{label}</h1><h2>{topic?.title||'Explore the project.'}</h2><p className="editorial-intro">{topic?.text[0]||'Browse the topic summaries or return to the home page.'}</p>{active==='applications'&&<p>Clinical settings are a proposed application, not evidence of clinical validation or clearance.</p>}<VisualExplainer area={routeArea[active]||"ast"}/><div className="atelier-actions"><a className="solid-link" href={topic?'/library?topic='+topic.id:'/library'}>Explore connected topics ↗</a><a href="/#demo">Try the synthetic demo ↗</a></div>{active==='roadmap'&&<ol className="roadmap-steps"><li>Define the intended use and reference comparison.</li><li>Establish calibration, repeatability and unreadable-image handling.</li><li>Evaluate uncertainty and qualified review.</li><li>Agree a supervised pilot with a suitable partner.</li></ol>}</section>}
 </Suspense></main>{active!=='home'&&<footer className="public-footer"><a href="/#about">Contact</a><a href="/#team">Team</a><a href="/#recognition">Recognition</a><small>© {new Date().getFullYear()} AMReye.AI · Prototype project · Synthetic demonstrations</small></footer>}
 {!pitch&&<ProjectAssistant/>}
 <Dialog open={pitch} onOpenChange={togglePitch}><DialogContent className="pitch-modal visual-pitch-modal" aria-describedby={undefined}><DialogTitle className="sr-only">AMReye.AI quick pitch</DialogTitle><VisualPitch onExit={()=>togglePitch(false)} onNavigate={id=>{togglePitch(false);const target=sectionHref(id);history.pushState({},'',target);window.dispatchEvent(new PopStateEvent('popstate'))}}/></DialogContent></Dialog></div>;
}
