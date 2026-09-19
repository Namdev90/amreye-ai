"use client";

import {useState} from 'react';
import {ArrowUpRight, BookOpen, BrainCircuit, CirclePlay, FileText, FlaskConical, Globe2, Grid2X2, Home, Layers3, Menu, Network, Play, Search, Handshake} from 'lucide-react';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet';
import {directory} from './discovery';
import {sectionHref} from './site-routes.mjs';
import stats from './repository-stats.json';

const cards = [
  {title:'Platform',copy:'From prototype to product',icon:Layers3,href:'/#products'},
  {title:'AI Engine',copy:'Analysis beyond imaging',icon:BrainCircuit,href:'/#technology'},
  {title:'Workflow',copy:'From sample to insight',icon:Network,href:'/#workflow'},
  {title:'Applications',copy:'Research, clinical and surveillance',icon:FlaskConical,href:'/#applications'},
  {title:'World Impact',copy:'Insights for real-world change',icon:Globe2,href:'/#network'},
];

export function SiteNavigation({active,onPitch}:{active:string;onPitch:()=>void}) {
  const [open,setOpen]=useState(false);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="amr-header">
      <a className="amr-brand" href="/#home" aria-label="AMReye.AI home"><img className="amr-brand-symbol" src="/brand/amreye-symbol-colour.svg" width="64" height="64" alt=""/><span className="amr-wordmark">AMReye.<em>AI</em></span></a>
      <div className="amr-header-actions"><button className="amr-quick-pitch" onClick={onPitch}><Play aria-hidden="true"/><span>Quick pitch</span></button>
        <Sheet open={open} onOpenChange={setOpen}><SheetTrigger className="amr-menu-trigger" aria-label="Open site menu"><Menu/></SheetTrigger>
          <SheetContent className="atelier-menu amr-menu" aria-describedby={undefined}><SheetHeader><SheetTitle>Explore AMReye.AI</SheetTitle></SheetHeader>
            <div className="menu-columns">{directory.map(group=><div key={group.title}><h3>{group.title}</h3><nav aria-label={group.title}>{group.links.filter(([,id])=>!['references','sources'].includes(id)).map(([label,id])=><a key={id} href={sectionHref(id)} onClick={()=>setOpen(false)}>{label.replace('Complete project library','Knowledge library')}<ArrowUpRight size={16}/></a>)}</nav></div>)}</div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
    <nav className="amr-bottom-nav" aria-label="Primary navigation">
      {[{label:'Home',id:'home',icon:Home},{label:'Products',id:'products',icon:Layers3},{label:'Demo',id:'demo',icon:CirclePlay},{label:'Library',id:'library',icon:BookOpen}].map(({label,id,icon:Icon})=><a key={id} href={sectionHref(id)} aria-current={active===id?'page':undefined}><Icon aria-hidden="true"/><span>{label}</span></a>)}
      <button aria-label="More sections" aria-expanded={open} onClick={()=>setOpen(true)}><Grid2X2 aria-hidden="true"/><span>More</span></button>
    </nav>
  </>;
}

export function HomeDirectory(){
  const [query,setQuery]=useState('');
  return <section id="home" className="amr-home">
    <div className="amr-policy-strip" aria-label="National AMR policy context">
      <p>Informed by<br/> national AMR priorities</p>
      <a href="https://www.mohfw.gov.in/" target="_blank" rel="noopener noreferrer"><span className="policy-name">Government<br/>of India</span></a>
      <a className="amr-nap" href="https://www.mohfw.gov.in/?q=en%2Fpressrelease-345" target="_blank" rel="noopener noreferrer"><span><strong>NAP-AMR 2.0</strong><small>National Action Plan on<br/>Antimicrobial Resistance<br/>(2025–2029)</small></span></a>
      <a href="https://www.goa.gov.in/" target="_blank" rel="noopener noreferrer"><span className="policy-name">Government<br/>of Goa</span></a>
    </div>
    <div className="amr-hero">
      <img className="amr-hero-art" src="/visuals/amreye-hero.webp" width="1536" height="1024" fetchPriority="high" alt="AMReye.AI benchtop instrument concept with an illuminated plate chamber"/>
      <div className="amr-hero-copy"><p className="amr-eyebrow">AI AND ROBOTICS <span>—</span> THE FRONTIER OF SCIENCE</p>
        <h1><span className="amr-title-line"><em>A</em>ntimicrobial <em>I</em>ntelligence</span><br/>by <em>AI.</em></h1>
        <p className="amr-hero-statement">Building a more resistant future<br/> against the future of resistant diseases.</p>
      </div>
      <a className="amr-concept-card" href="/#products"><ArrowUpRight aria-hidden="true"/><h2>AMRST Platform Concept</h2><p>AI-assisted AST measurement<br/>and in-depth analysis.</p><small>Proposed platform · Concept illustration</small></a>
    </div>
    <div className="amr-directory-body">
      <form className="amr-search" role="search" action="/library"><Search aria-hidden="true"/><input name="q" type="search" aria-label="Search topics, tools and use cases" placeholder="Search topics, tools and use cases." value={query} onChange={e=>setQuery(e.target.value)}/><button type="submit" aria-label="Search the knowledge library"><ArrowUpRight/></button></form>
      <nav className="amr-feature-cards" aria-label="Explore the project">{cards.map(({title,copy,icon:Icon,href})=><a href={href} key={title}><ArrowUpRight className="amr-card-arrow" aria-hidden="true"/>{title==='Platform'?<img className="amr-card-device" src="/visuals/flagship.webp" width="108" height="72" loading="lazy" alt=""/>:<Icon className="amr-card-icon" aria-hidden="true"/>}<h2>{title}</h2><p>{copy}</p></a>)}</nav>
      <div className="amr-research-panel"><a className="amr-stat" href="/library"><FileText aria-hidden="true"/><strong>{stats.topics}</strong><span>project topics<br/>for AMReye.AI</span></a><a className="amr-research-link" href="/#research"><BookOpen aria-hidden="true"/><span><strong>Read about it in action.</strong><small>Explore the project</small></span><ArrowUpRight aria-hidden="true"/></a></div>
      <section className="amr-recognition-strip" aria-labelledby="recognition-strip-title"><div className="amr-institutions"><h2 id="recognition-strip-title">Project milestones + recognition</h2><div className="amr-institution-row"><a href="/#recognition" className="amr-university"><img src="/brand/parul-goa.svg" alt="Parul University Goa" width="233" height="26"/><span>PU EPIC selection</span></a><a href="/#team" className="amr-center-brand"><img src="/brand/amreye-logo-white.svg" width="200" height="48" alt="AMReye.AI"/><small>Research • People • Impact</small></a><a href="/#recognition" className="amr-university goa-university"><img src="/brand/goa-university.png" alt="Goa University" width="250" height="111"/><span>Bio-InnoQuest · Second place</span></a></div><small className="amr-milestone-note">Project-reported milestones. Institutional endorsement is not implied.</small></div>
        <div className="amr-socials"><h2>Our socials</h2><div>{['LinkedIn','YouTube','Instagram','GitHub'].map((name,i)=><span key={name} className={'amr-social social-'+i} title={`${name}: official profile link to be confirmed`}><img src={'/brand/'+name.toLowerCase()+'.svg'} width="26" height="26" alt=""/><span className="sr-only">{name}: profile link to be confirmed</span></span>)}</div><small>Profile links being confirmed</small></div>
      </section>
    </div>
  </section>;
}
