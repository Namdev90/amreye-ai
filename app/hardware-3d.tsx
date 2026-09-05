"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, Expand, Focus, Layers3, LoaderCircle, Minus, Plus, RotateCcw, RotateCw } from "lucide-react";
import type { HardwareScene, SceneSettings } from "./hardware-scene";

const names = ["Camera & optics", "Illumination ring", "Plate carrier", "Thermal stage", "Edge compute board", "Reflex control board"];

export default function Hardware3D({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HardwareScene | null>(null);
  const selectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [isolated, setIsolated] = useState(false);
  const [exploded, setExploded] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [motion, setMotion] = useState(false);
  const settings = useRef<SceneSettings>({ active, isolated, exploded, spinning });
  selectRef.current = onSelect;

  useEffect(() => {
    settings.current = { active, isolated, exploded, spinning };
    scene.current?.update(settings.current);
  }, [active, isolated, exploded, spinning]);

  useEffect(() => {
    const sync = () => {
      const allowed = document.documentElement.dataset.motion === "on" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
      setMotion(allowed);
      if (!allowed) setSpinning(false);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setReady(false); setError(false);
    const failed = () => { if (!cancelled) { scene.current?.dispose(); scene.current = null; setReady(false); setError(true); } };
    // Three.js is only requested when the user opens the 3D tab.
    import("./hardware-scene").then(({ createHardwareScene }) => {
      if (cancelled || !canvas.current) return;
      try {
        scene.current = createHardwareScene(canvas.current, index => selectRef.current(index), failed);
        scene.current.update(settings.current);
        setReady(true);
      } catch { failed(); }
    }).catch(failed);
    return () => { cancelled = true; scene.current?.dispose(); scene.current = null; };
  }, [attempt]);

  return <div className="hardware-3d">
    <div className="three-canvas-wrap">
      <canvas key={attempt} ref={canvas} className="three-canvas" aria-label="Interactive schematic hardware assembly. Use the labeled controls and component list to explore the six parts." onKeyDown={event => {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "-", "Home"].includes(event.key)) event.preventDefault();
        if (event.key === "ArrowLeft") scene.current?.rotate(-1);
        if (event.key === "ArrowRight") scene.current?.rotate(1);
        if (event.key === "+" || event.key === "ArrowUp") scene.current?.zoom(-1);
        if (event.key === "-" || event.key === "ArrowDown") scene.current?.zoom(1);
        if (event.key === "Home") scene.current?.reset();
      }} tabIndex={ready ? 0 : -1} />
      {!ready && <div className="three-loading" role="status">{error ? <><img src="/hardware/apex-exploded.webp" alt="Hardware assembly illustration" /><span>3D is unavailable on this device. The assembled and exploded views still work.</span><button type="button" onClick={() => setAttempt(value => value + 1)}>Retry 3D</button></> : <><LoaderCircle size={26} /><span>Opening the 3D assembly…</span></>}</div>}
      {ready && <div className="three-selection"><span>SELECTED PART</span><b>{names[active]}</b></div>}
      <span className="three-schematic-label">SCHEMATIC · NOT PRODUCTION CAD</span>
    </div>
    <div className="three-controls">
      <div className="three-options"><button type="button" disabled={!ready} onClick={() => setExploded(value => !value)} aria-pressed={exploded}><Layers3 size={17} /> Separate layers</button><button type="button" disabled={!ready} onClick={() => setIsolated(value => !value)} aria-pressed={isolated}><Focus size={17} /> Isolate part</button><button type="button" disabled={!ready || !motion} onClick={() => setSpinning(value => !value)} aria-pressed={spinning} title={motion ? "Rotate automatically while visible" : "Enable motion to use automatic rotation"}><RotateCw size={17} /> Auto rotate</button></div>
      <div className="three-tools" role="group" aria-label="3D view controls">
        <button type="button" disabled={!ready} onClick={() => scene.current?.rotate(-1)} aria-label="Rotate left" title="Rotate left"><ArrowLeft /></button>
        <button type="button" disabled={!ready} onClick={() => scene.current?.rotate(1)} aria-label="Rotate right" title="Rotate right"><ArrowRight /></button>
        <button type="button" disabled={!ready} onClick={() => scene.current?.zoom(-1)} aria-label="Zoom in" title="Zoom in"><Plus /></button>
        <button type="button" disabled={!ready} onClick={() => scene.current?.zoom(1)} aria-label="Zoom out" title="Zoom out"><Minus /></button>
        <button type="button" disabled={!ready} onClick={() => scene.current?.top()} aria-label="Toggle top view" title="Toggle top view"><ArrowUp /></button>
        <button type="button" disabled={!ready} onClick={() => { scene.current?.reset(); setExploded(true); setIsolated(false); setSpinning(false); }} aria-label="Reset 3D view" title="Reset 3D view"><RotateCcw /></button>
      </div>
      <p><Expand size={14} /> Drag sideways to rotate · Tap a part to select · Scroll vertically to continue</p>
    </div>
  </div>;
}
