"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Bot, BrainCircuit, Building2, Cloud, Database, Globe2, GraduationCap, Layers3, Map, Network, RefreshCw, Server, ShieldCheck, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Product3D from "./product-3d";

type Status = "Prototype demo" | "Proposed product" | "Future R&D";
type Product = {
  id: string; name: string; label: string; summary: string; status: Status;
  group: "Products" | "Platform" | "Intelligence" | "Services";
  icon: typeof Layers3; points: string[]; action: string; href?: string;
};

const products: Product[] = [
  { id:"lite", name:"AMR-Eye Lite", label:"PORTABLE AST", summary:"A compact imaging and zone-measurement pathway for resource-conscious labs.", status:"Prototype demo", group:"Products", icon:Layers3, points:["Guided image capture","Synthetic zone-analysis demo","Human review record"], action:"Open analysis", href:"#demo" },
  { id:"core", name:"AMR-Eye Core", label:"CONNECTED WORKBENCH", summary:"Smart incubation, repeat imaging and traceable AST workflow in one proposed system.", status:"Proposed product", group:"Products", icon:Server, points:["Time-lapse acquisition","Plate digital twin","Edge-first operation"], action:"Explore hardware", href:"#hardware" },
  { id:"pro", name:"AMR-Eye Pro", label:"MULTIMODAL LAB", summary:"A future research tier for richer sensing, analytics and laboratory integration.", status:"Future R&D", group:"Products", icon:BrainCircuit, points:["Multiple optical modes","Auxiliary sensor fusion","Custom model workflows"], action:"View product brief" },
  { id:"clinical", name:"Clinical Pathway", label:"VALIDATION TRACK", summary:"A future regulated pathway for validated AST, MIC, QC and standards traceability.", status:"Future R&D", group:"Products", icon:ShieldCheck, points:["Analytical validation","Clinical protocols","Regulatory planning"], action:"View validation path", href:"#roadmap" },
  { id:"bahu", name:"SaaS–BAHU", label:"HUMAN CONTROL LAYER", summary:"A proposed software layer connecting people, instruments, AI and biological workflows.", status:"Future R&D", group:"Platform", icon:Bot, points:["Operator workflow","Instrument orchestration","Human-in-the-loop release"], action:"Open BAHU", href:"#bahu" },
  { id:"edge", name:"Edge AI", label:"LOCAL INTELLIGENCE", summary:"Local processing for lower latency, offline continuity and reduced cloud dependence.", status:"Proposed product", group:"Platform", icon:BrainCircuit, points:["On-device inference","Local result queue","Selective cloud sync"], action:"Open architecture", href:"#architecture" },
  { id:"cloud", name:"AMR-Eye Cloud", label:"FLEET + DATA LAYER", summary:"A proposed connected-services layer for device management, governed data and updates.", status:"Proposed product", group:"Platform", icon:Cloud, points:["Fleet observability","Versioned model delivery","Enterprise workspace"], action:"View platform brief" },
  { id:"connect", name:"Connect", label:"LAB INTEROPERABILITY", summary:"A future connectivity layer for LIMS, LIS, HIS and governed exchange standards.", status:"Future R&D", group:"Platform", icon:Network, points:["LIMS / LIS / HIS","FHIR-ready pathway","Auditable data exchange"], action:"View connectivity", href:"#architecture" },
  { id:"nap", name:"NAP-AMR Command Map", label:"NATIONAL INTELLIGENCE", summary:"A concept for governed AMR signals, hotspots and variation trends across regions.", status:"Future R&D", group:"Intelligence", icon:Map, points:["Synthetic hotspot explorer","Region and organism filters","Policy-ready trend views"], action:"Open intelligence concept", href:"#network" },
  { id:"global", name:"Global AMR Network", label:"LOCAL → GLOBAL", summary:"A federated concept connecting local health centres to national and international views.", status:"Future R&D", group:"Intelligence", icon:Globe2, points:["Local health-centre nodes","Country-specific governance","Cross-border aggregate views"], action:"View network model" },
  { id:"models", name:"Model Registry", label:"MULTIMODAL AI", summary:"Separate models for plate imaging, growth kinetics and research data, each with its own evidence boundary.", status:"Future R&D", group:"Intelligence", icon:Database, points:["Image-to-measurement","Growth-curve analysis","Omics association only with qualified source data"], action:"Explore model stack" },
  { id:"research", name:"Research Studio", label:"COLLEGE + R&D", summary:"A future workspace for universities and research centres to study governed, de-identified datasets.", status:"Future R&D", group:"Intelligence", icon:GraduationCap, points:["Cohort workspaces","Model comparison","Reproducible export"], action:"View research pathway" },
  { id:"government", name:"Government Programs", label:"PUBLIC HEALTH", summary:"A proposed deployment and support pathway for national and state AMR programs.", status:"Future R&D", group:"Services", icon:Building2, points:["Program configuration","Governed aggregation","Training and adoption"], action:"View program model" },
  { id:"support", name:"Maintenance + Support", label:"SYSTEM CARE", summary:"Planned service coverage for devices, software, databases and connected operations.", status:"Proposed product", group:"Services", icon:Wrench, points:["Preventive maintenance","Calibration pathway","Support desk"], action:"View service scope" },
  { id:"updates", name:"Updates + Assurance", label:"CONTINUOUS SERVICE", summary:"Versioned software, model and standards updates with traceability and rollback controls.", status:"Proposed product", group:"Services", icon:RefreshCw, points:["Signed releases","Model registry","Standards database versions"], action:"View update model" },
];

const groups = ["All", "Products", "Platform", "Intelligence", "Services"] as const;

export default function ProductShowcase() {
  const [group, setGroup] = useState<(typeof groups)[number]>("All");
  const [selected, setSelected] = useState<Product | null>(null);
  const [visual, setVisual] = useState<Product>(products[0]);
  const visible = useMemo(() => group === "All" ? products : products.filter(item => item.group === group), [group]);
  const activate = (item: Product) => { setVisual(item); setSelected(item); };
  return <section className="section products-section" id="products">
    <div className="products-head"><div><span>02 / PRODUCT ECOSYSTEM</span><h2>One AMR operating layer.<br/><em>Built to scale by evidence.</em></h2></div><p>Explore hardware, software, services and governed intelligence—from a local health centre to a national AMR program.</p></div>
    <Product3D productId={visual.id} name={visual.name} label={visual.label} />
    <div className="product-filters" role="toolbar" aria-label="Filter AMR-Eye products">{groups.map(item => <button key={item} aria-pressed={group === item} onClick={() => setGroup(item)}>{item}</button>)}</div>
    <div className="product-grid">{visible.map((item, index) => { const Icon = item.icon; return <button className={`product-card ${visual.id===item.id?"visual-active":""}`} key={item.id} onPointerEnter={()=>setVisual(item)} onFocus={()=>setVisual(item)} onClick={() => {setVisual(item);activate(item)}} aria-label={`${item.name}: ${item.action}`}><div className="product-card-top"><span>{String(index + 1).padStart(2,"0")}</span><Icon/><ArrowUpRight/></div><small>{item.label}</small><h3>{item.name}</h3><p>{item.summary}</p><div><span className={`product-status status-${item.status.toLowerCase().replaceAll(" ", "-")}`}>{item.status}</span><b>{item.action}</b></div></button>})}</div>
    <div className="evidence-boundary"><ShieldCheck/><p><b>Evidence boundary</b> Image AI can measure visible plate features. Strain, protein or genomic insight would require qualified assays or omics data and separate validation; the site does not present image-only inference as established capability.</p></div>
    <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}><DialogContent className="product-dialog"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>{selected && <><span className="product-dialog-label">{selected.label} · {selected.group}</span><p>{selected.summary}</p><ul>{selected.points.map(point => <li key={point}>{point}</li>)}</ul>{selected.href&&<a className="primary-action product-dialog-action" href={selected.href} onClick={()=>setSelected(null)}>{selected.action}<ArrowUpRight/></a>}<div className="product-dialog-foot"><span className={`product-status status-${selected.status.toLowerCase().replaceAll(" ", "-")}`}>{selected.status}</span><small>Concept scope may change as validation and partnerships develop.</small></div></>}</DialogContent></Dialog>
  </section>;
}
