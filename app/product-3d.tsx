"use client";

import { useEffect, useRef, useState } from "react";
import { Box, RotateCcw } from "lucide-react";

type Props = { productId: string; name: string; label: string };

const profiles: Record<string, { color:number; accent:number; form:"device"|"stack"|"network"|"orb"|"service" }> = {
  lite:{color:0xd3f66a,accent:0x7f9c2d,form:"device"}, core:{color:0xb9d8ff,accent:0x4c6f9d,form:"device"}, pro:{color:0x9f7cff,accent:0x4b357e,form:"stack"}, clinical:{color:0x70e1cd,accent:0x276b67,form:"stack"},
  bahu:{color:0xf2b66d,accent:0x8f5a26,form:"orb"}, edge:{color:0xd3f66a,accent:0x405c20,form:"stack"}, cloud:{color:0xb9d8ff,accent:0x4d6b91,form:"orb"}, connect:{color:0x70e1cd,accent:0x2f716b,form:"network"},
  nap:{color:0xff8b78,accent:0x8c3c35,form:"network"}, global:{color:0x79b7ff,accent:0x345b8b,form:"orb"}, models:{color:0xb59cff,accent:0x59417e,form:"stack"}, research:{color:0x78e6c0,accent:0x36745e,form:"network"},
  government:{color:0xf2c46d,accent:0x856728,form:"network"}, support:{color:0xaac3d9,accent:0x4f687c,form:"service"}, updates:{color:0xd3f66a,accent:0x557126,form:"service"},
};

export default function Product3D({ productId, name, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready,setReady]=useState(false);
  const [paused,setPaused]=useState(false);
  useEffect(()=>{
    let disposed=false, frame=0, renderer:any, observer:IntersectionObserver|undefined;
    const boot=async()=>{
      const THREE=await import("three"); if(disposed||!canvasRef.current)return;
      const canvas=canvasRef.current; const profile=profiles[productId]||profiles.lite;
      const scene=new THREE.Scene(); const camera=new THREE.PerspectiveCamera(34,1,.1,100); camera.position.set(5,3.5,7); camera.lookAt(0,0,0);
      renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"low-power"}); renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.35;
      scene.add(new THREE.AmbientLight(0xffffff,2.8)); const key=new THREE.DirectionalLight(profile.color,5); key.position.set(4,6,5); scene.add(key); const rim=new THREE.DirectionalLight(0x8ab6ff,3);rim.position.set(-4,2,-3);scene.add(rim);
      const group=new THREE.Group(); scene.add(group); const dark=new THREE.MeshStandardMaterial({color:0x343b48,metalness:.68,roughness:.3}); const glow=new THREE.MeshStandardMaterial({color:profile.color,emissive:profile.accent,emissiveIntensity:.45,metalness:.3,roughness:.22}); const glass=new THREE.MeshPhysicalMaterial({color:profile.accent,transparent:true,opacity:.62,roughness:.12,metalness:.12,transmission:.18});
      const add=(geo:any,mat:any,x=0,y=0,z=0)=>{const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);group.add(mesh);return mesh};
      if(profile.form==="device"){add(new THREE.BoxGeometry(3.2,2.4,2.25),dark);add(new THREE.BoxGeometry(2.65,1.45,.08),glass,0,.25,1.17);add(new THREE.CylinderGeometry(.68,.68,.14,48),glow,0,.15,1.28).rotation.x=Math.PI/2;add(new THREE.BoxGeometry(2.8,.22,2),glow,0,-1.28,0)}
      if(profile.form==="stack"){[-1.1,0,1.1].forEach((y,i)=>{const m=add(new THREE.BoxGeometry(3.2,.72,2.1),i===1?glow:dark,0,y,0);m.rotation.y=i*.12});add(new THREE.TorusGeometry(1.65,.035,12,72),glass,0,0,0).rotation.x=Math.PI/2}
      if(profile.form==="network"){add(new THREE.IcosahedronGeometry(.72,2),glow);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const node=add(new THREE.SphereGeometry(.22,20,20),i%2?glass:glow,Math.cos(a)*2,Math.sin(a*.8)*1.1,Math.sin(a)*2);const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),node.position]),new THREE.LineBasicMaterial({color:profile.color,transparent:true,opacity:.55}));group.add(line)}}
      if(profile.form==="orb"){add(new THREE.SphereGeometry(1.2,48,48),glass);[0,1,2].forEach(i=>{const ring=add(new THREE.TorusGeometry(1.65+i*.23,.035,12,90),i===1?glow:dark);ring.rotation.set(Math.PI/2+i*.55,i*.4,0)});add(new THREE.IcosahedronGeometry(.42,1),glow)}
      if(profile.form==="service"){add(new THREE.CylinderGeometry(1.25,1.25,.7,8),dark,0,-.65,0);add(new THREE.CylinderGeometry(.9,.9,.65,8),glow,0,.05,0);add(new THREE.CylinderGeometry(.55,.55,.6,8),glass,0,.68,0);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;add(new THREE.BoxGeometry(.15,1.2,.28),glow,Math.cos(a)*1.8,0,Math.sin(a)*1.8).rotation.y=-a}}
      const floor=new THREE.Mesh(new THREE.CircleGeometry(3.2,64),new THREE.MeshStandardMaterial({color:0x101219,metalness:.2,roughness:.8,transparent:true,opacity:.7}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.7;scene.add(floor);
      const size=()=>{const rect=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);camera.aspect=rect.width/Math.max(1,rect.height);camera.updateProjectionMatrix()};size();const resize=new ResizeObserver(size);resize.observe(canvas);
      let visible=true;observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)render()},{rootMargin:"100px"});observer.observe(canvas);
      let dragging=false,lastX=0;canvas.onpointerdown=e=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(dragging){group.rotation.y+=(e.clientX-lastX)*.012;lastX=e.clientX;renderer.render(scene,camera)}};canvas.onpointerup=()=>{dragging=false};
      const render=()=>{if(disposed||!visible)return;group.rotation.y+=paused?0:.0025;renderer.render(scene,camera);frame=requestAnimationFrame(render)};setReady(true);render();
      return()=>{resize.disconnect()};
    }; let cleanup:(()=>void)|undefined;boot().then(fn=>cleanup=fn);
    return()=>{disposed=true;cancelAnimationFrame(frame);observer?.disconnect();cleanup?.();renderer?.dispose()};
  },[productId,paused]);
  return <div className="product-3d"><canvas ref={canvasRef} aria-label={`Interactive conceptual 3D visualization of ${name}`}/><div className="product-3d-copy"><small>INTERACTIVE CONCEPT MODEL</small><h3>{name}</h3><p>{label}</p></div><div className="product-3d-actions"><button onClick={()=>setPaused(v=>!v)} aria-pressed={paused}><Box/>{paused?"Resume":"Pause"}</button><button onClick={()=>setPaused(v=>!v)} aria-label="Toggle model rotation"><RotateCcw/></button></div>{!ready&&<span className="product-3d-loading">Loading 3D model…</span>}</div>;
}
