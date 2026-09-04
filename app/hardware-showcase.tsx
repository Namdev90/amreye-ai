"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { ArrowUpRight, Box, Camera, Cpu, Layers3, Lightbulb, Move, ShieldCheck, Thermometer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const parts = [
  { name: "Camera & precision optics", short: "Optics", icon: Camera, purpose: "Capture the plate with controlled geometry.", description: "The proposed metrology path pairs an industrial camera with whole-plate telecentric optics. The final camera–lens combination needs calibration and measurement validation.", topic: "topic-20", category: "OPTICAL ACQUISITION", exploded: [50, 19], assembled: [51, 37] },
  { name: "Multimode illumination", short: "Lighting", icon: Lightbulb, purpose: "Shape the light around the assay.", description: "Transmitted, epi and oblique lighting provide different optical perspectives. Additional NIR and fluorescence channels remain application-specific research or validation paths.", topic: "topic-23", category: "CONTROLLED LIGHT", exploded: [49, 31], assembled: [52, 45] },
  { name: "Plate stage & Bio-Vault", short: "Bio-Vault", icon: Move, purpose: "Give each plate a repeatable position.", description: "A proposed plate carrier sits within the Bio-Vault. The chassis separates biological, logic and power areas; this illustration shows a simplified imaging assembly.", topic: "topic-16", category: "SAMPLE & ENCLOSURE", exploded: [49, 46], assembled: [51, 55] },
  { name: "Incubation & environment", short: "Incubation", icon: Thermometer, purpose: "Control and record the culture environment.", description: "Calibrated sensing, thermal actuation and humidity management are part of the proposed incubation system. Setpoint stability and performance require testing under load.", topic: "topic-28", category: "ENVIRONMENTAL CONTROL", exploded: [49, 62], assembled: [30, 52] },
  { name: "Local edge compute", short: "Edge AI", icon: Cpu, purpose: "Process images close to the instrument.", description: "The proposed Cortex runs vision and analysis locally. APEX XR names a Jetson Thor / T5000 development platform; production requires qualified module and carrier hardware.", topic: "topic-19", category: "LOCAL INTELLIGENCE", exploded: [56, 78], assembled: [63, 74] },
  { name: "Independent Reflex control", short: "Control", icon: ShieldCheck, purpose: "Keep instrument control separate from AI.", description: "An STM32-class controller is proposed for timing, lighting, environmental control and interlocks. The concept board is illustrative and does not depict final safety circuitry.", topic: "topic-17", category: "REAL-TIME CONTROL", exploded: [35, 80], assembled: [32, 74] },
] as const;

export function HardwareHero() {
  return <div className="hero-hardware" data-tilt>
    <div className="hardware-hero-label"><span className="live-dot" /> APEX XR <span>HARDWARE CONCEPT</span></div>
    <div className="hero-product-frame"><img src="/hardware/apex-concept.webp" width={1536} height={1024} fetchPriority="high" alt="Concept render of a glass-fronted AMR-Eye plate-imaging instrument with camera, plate stage and lower electronics enclosure" /><div className="product-glint" aria-hidden="true" /></div>
    <div className="hero-hardware-footer"><span>Imaging · Incubation · Edge intelligence</span><a href="#hardware">Explore the hardware <ArrowUpRight size={16} /></a></div>
    <p className="hardware-caption">Illustrative design concept · Proposed product</p>
  </div>;
}

export default function HardwareShowcase() {
  const [view, setView] = useState("exploded");
  const [active, setActive] = useState(0);
  const part = parts[active];
  const ActiveIcon = part.icon;
  return <section className="section hardware-section" id="hardware">
    <div className="hardware-intro"><div><div className="section-kicker"><span>APEX XR · INSIDE THE INSTRUMENT</span><span className="scope-tag scope-proposed">Proposed product</span></div><h2>Intelligence has<br /><em>a physical side.</em></h2></div><p>Explore the hardware layers behind the proposed platform. Select a component to see its role in the system.</p></div>
    <div className="hardware-layout">
      <Tabs value={view} onValueChange={setView} className="hardware-stage">
        <div className="hardware-stage-top"><span><Layers3 size={17} /> APEX XR / CONCEPT STUDY</span><TabsList aria-label="Hardware view"><TabsTrigger value="assembled"><Box /> Assembled</TabsTrigger><TabsTrigger value="exploded"><Layers3 /> Exploded</TabsTrigger></TabsList></div>
        <div className="hardware-model" data-tilt>
          {(["assembled", "exploded"] as const).map(mode => <TabsContent forceMount value={mode} key={mode} aria-hidden={view !== mode} className={`hardware-view hardware-view-${mode}`}>
            <img src={mode === "assembled" ? "/hardware/apex-concept.webp" : "/hardware/apex-exploded.webp"} width={mode === "assembled" ? 1536 : 1254} height={mode === "assembled" ? 1024 : 1254} loading="lazy" alt={mode === "assembled" ? "Assembled conceptual plate-imaging instrument" : "Exploded concept assembly with camera, illumination ring, plate carrier, thermal stage and electronics"} />
            <div className="hardware-hotspots">
              {parts.map((item, index) => <button key={item.short} type="button" tabIndex={view === mode ? 0 : -1} className={`hardware-hotspot ${active === index ? "selected" : ""}`} style={{ left: `${item[mode][0]}%`, top: `${item[mode][1]}%` }} onClick={() => setActive(index)} aria-label={`${index + 1}. ${item.name}`} aria-pressed={active === index} aria-controls="hardware-part-detail"><span>{String(index + 1).padStart(2, "0")}</span></button>)}
              <div className="hardware-focus" aria-hidden="true" style={{ "--focus-x": `${part[mode][0]}%`, "--focus-y": `${part[mode][1]}%` } as CSSProperties} />
            </div>
          </TabsContent>)}
        </div>
        <div className="hardware-stage-bottom"><span><i className="live-dot" /> {view === "exploded" ? "EXPLODED ASSEMBLY" : "ENCLOSURE VIEW"}</span><span>SELECT A NUMBERED PART</span></div>
      </Tabs>
      <div className="hardware-side">
        <div className="hardware-part-list" aria-label="Instrument components">{parts.map((item, index) => {
          const Icon = item.icon;
          return <button type="button" key={item.name} className={active === index ? "active" : ""} onClick={() => setActive(index)} aria-pressed={active === index} aria-controls="hardware-part-detail"><span className="part-index">{String(index + 1).padStart(2, "0")}</span><Icon size={19} /><span>{item.name}</span><ArrowUpRight size={16} /></button>;
        })}</div>
        <div className="hardware-details" id="hardware-part-detail" aria-live="polite" aria-atomic="true"><div key={active} className="part-detail-content"><div className="part-detail-kicker"><ActiveIcon size={20} /><span>{part.category}</span></div><h3>{part.purpose}</h3><p>{part.description}</p><a href={`/?topic=${part.topic}#apex`}>Read the subsystem specification <ArrowUpRight size={17} /></a></div></div>
      </div>
    </div>
    <p className="hardware-boundary">Concept renders show a simplified assembly, not a manufactured device or final engineering layout. Component selection, integration and performance remain subject to validation.</p>
  </section>;
}
