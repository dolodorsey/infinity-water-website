"use client";
import { useEffect, useMemo, useState } from "react";

const STAGES=[
  ["SURFACE","INTRO"],
  ["VESSEL","OBJECT"],
  ["COLLECTION","FINISH"],
  ["SOURCE","PURITY"],
  ["HOSPITALITY","PLACEMENT"],
] as const;

export default function InfinityExperienceLayer(){
  const [progress,setProgress]=useState(0);
  const [mouse,setMouse]=useState({x:-400,y:-400});
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const onScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);setProgress(Math.min(1,scrollY/max));};
    const onMove=(e:MouseEvent)=>setMouse({x:e.clientX,y:e.clientY});
    onScroll();window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("mousemove",onMove,{passive:true});
    return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("mousemove",onMove)};
  },[]);
  const active=Math.min(STAGES.length-1,Math.floor(progress*STAGES.length));
  const percent=Math.round(progress*100);
  const stage=useMemo(()=>STAGES[active],[active]);
  return <>
    <div className="infinity-experience-progress" aria-hidden="true"><i style={{height:`${progress*100}%`}}/></div>
    <aside className="infinity-depth-rail" aria-label="Infinity experience depth">
      <span className="infinity-depth-label">DEPTH / {String(active+1).padStart(2,"0")}</span>
      <div className="infinity-depth-line"><i style={{height:`${progress*100}%`}}/></div>
      <strong>{stage[0]}</strong><small>{stage[1]} · {percent}%</small>
      <button onClick={()=>setOpen(true)}>OPEN CHAMBER ↗</button>
    </aside>
    <div className="infinity-lens" aria-hidden="true" style={{transform:`translate3d(${mouse.x-115}px,${mouse.y-115}px,0)`}}/>
    {open?<div className="infinity-chamber" role="dialog" aria-modal="true" aria-label="Infinity chamber">
      <button className="infinity-chamber-close" onClick={()=>setOpen(false)}>CLOSE ×</button>
      <div className="infinity-chamber-orbit" aria-hidden="true"><i/><i/><i/></div>
      <div className="infinity-chamber-copy"><span>THE CHAMBER OF INFINITY</span><h2>HYDRATION<br/>AS AN<br/><em>OBJECT.</em></h2><p>Move through Infinity as a designed system: source, vessel, finish, hospitality and placement. The interface stays restrained because the product should feel architectural—not promotional.</p></div>
      <div className="infinity-chamber-index">{STAGES.map((s,i)=><article key={s[0]}><b>0{i+1}</b><strong>{s[0]}</strong><span>{s[1]}</span></article>)}</div>
    </div>:null}
  </>;
}
