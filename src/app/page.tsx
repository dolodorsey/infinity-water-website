"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════════
   INFINITY WATER — V3 EXTRAORDINARY
   Video intro → becomes hero BG. Belgian luxury. No templates.
   ═══════════════════════════════════════════════════════════════════════ */

const C = {
  void: "#090D12", deep: "#1E2A35", water: "#4B7BAA", ice: "#F6F8FA",
  mist: "#C0CAD3", frost: "#96A3AE", surface: "#E2E7EC",
  faint: "#151C24", gold: "#C5A55A", goldGlow: "rgba(197,165,90,0.08)"
};

function useInView(t=0.1){const ref=useRef<HTMLDivElement>(null);const[v,setV]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.unobserve(el)}},{threshold:t});obs.observe(el);return()=>obs.disconnect()},[t]);return[ref,v] as const}

function R({children,delay=0,dir="up",style={}}:{children:React.ReactNode;delay?:number;dir?:string;style?:React.CSSProperties}){
  const[ref,vis]=useInView();
  const t:Record<string,string>={up:"translateY(60px)",left:"translateX(80px)",right:"translateX(-80px)",scale:"scale(0.92)"};
  return(<div ref={ref} style={{...style,opacity:vis?1:0,transform:vis?"none":t[dir]||t.up,transition:`all 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,willChange:"transform,opacity"}}>{children}</div>);
}

const Grain=()=>(<div style={{position:"fixed",inset:0,zIndex:9999,pointerEvents:"none",mixBlendMode:"overlay",opacity:0.03}}><svg width="100%" height="100%"><filter id="g"><feTurbulence baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg></div>);

function CursorGlow(){const[pos,setPos]=useState({x:-400,y:-400});useEffect(()=>{const m=(e:MouseEvent)=>setPos({x:e.clientX,y:e.clientY});window.addEventListener("mousemove",m);return()=>window.removeEventListener("mousemove",m)},[]);return(<div style={{position:"fixed",zIndex:9998,pointerEvents:"none",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}06 0%,transparent 70%)`,transform:`translate(${pos.x-300}px,${pos.y-300}px)`,transition:"transform 0.15s cubic-bezier(0.16,1,0.3,1)"}}/>);}

/* ─── VIDEO INTRO → HERO BACKGROUND ─── */
function VideoIntroHero(){
  const[phase,setPhase]=useState(0);
  const[mouse,setMouse]=useState({x:0.5,y:0.5});
  const[scrollY,setScrollY]=useState(0);

  useEffect(()=>{
    const t1=setTimeout(()=>setPhase(1),1800);
    const t2=setTimeout(()=>setPhase(2),2800);
    const t3=setTimeout(()=>setPhase(3),3400);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3)};
  },[]);
  useEffect(()=>{const fn=()=>setScrollY(window.scrollY);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn)},[]);

  return(
    <>
    {/* INTRO OVERLAY */}
    <div style={{
      position:"fixed",inset:0,zIndex:phase<3?10000:-1,background:C.void,
      display:"flex",alignItems:"center",justifyContent:"center",
      opacity:phase>=3?0:1,transition:"opacity 0.8s cubic-bezier(0.16,1,0.3,1)",
      pointerEvents:phase>=3?"none":"all"
    }}>
      <div style={{
        width:"100vw",
        height:"100vh",
        overflow:"hidden",transition:"all 1s cubic-bezier(0.16,1,0.3,1)",position:"relative",
      }}>
        <video autoPlay muted loop playsInline style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.55) contrast(1.15) saturate(0.7)"}}>
          <source src="/hero.mp4" type="video/mp4"/>
        </video>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:phase>=2?0:1,transition:"opacity 0.5s ease"}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:2,height:phase>=1?40:0,background:`linear-gradient(180deg,transparent,${C.gold})`,margin:"0 auto 20px",transition:"height 1s cubic-bezier(0.16,1,0.3,1)",borderRadius:1}}/>
            <img src="/infinity-logo.png" alt="Infinity Water" style={{height:"clamp(100px,20vw,200px)",width:"auto",objectFit:"contain",opacity:phase>=1?0:1,transition:"opacity 0.5s ease 0.4s"}} />
          </div>
        </div>
      </div>
      <div style={{position:"absolute",top:"clamp(20px,4vh,40px)",left:"clamp(20px,4vw,40px)",width:phase>=2?0:32,height:1,background:`${C.gold}40`,transition:"width 0.5s ease"}}/>
      <div style={{position:"absolute",bottom:"clamp(20px,4vh,40px)",right:"clamp(20px,4vw,40px)",width:phase>=2?0:32,height:1,background:`${C.gold}40`,transition:"width 0.5s ease"}}/>
    </div>

    {/* HERO — video is now BG */}
    <section
      onMouseMove={e=>setMouse({x:e.clientX/window.innerWidth,y:e.clientY/window.innerHeight})}
      style={{height:"100vh",position:"relative",overflow:"hidden",background:C.void,cursor:"crosshair"}}
    >
      <div style={{position:"absolute",inset:"-5%",width:"110%",height:"110%",
        WebkitMaskImage:"radial-gradient(ellipse 75% 70% at 50% 50%, black 35%, transparent 100%)",
        maskImage:"radial-gradient(ellipse 75% 70% at 50% 50%, black 35%, transparent 100%)"
      }}>
        <video autoPlay muted loop playsInline style={{
          width:"100%",height:"100%",objectFit:"cover",
          opacity:phase>=3?0.5:0,filter:"brightness(0.4) contrast(1.2) saturate(0.65)",
          transition:"opacity 2.5s cubic-bezier(0.16,1,0.3,1)",
          transform:`scale(${1.05+scrollY*0.0002}) translate(${(mouse.x-0.5)*-12}px,${(mouse.y-0.5)*-12}px)`
        }}><source src="/hero.mp4" type="video/mp4"/></video>
      </div>

      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at ${mouse.x*100}% ${mouse.y*100}%,${C.goldGlow},transparent 50%)`}}/>
      <div style={{position:"absolute",top:"50%",left:"8vw",right:"8vw",height:1,background:`linear-gradient(90deg,transparent,${C.gold}15,transparent)`,opacity:phase>=3?1:0,transition:"opacity 2s ease 0.5s"}}/>

      <div style={{position:"absolute",bottom:"14vh",left:"8vw",zIndex:3,maxWidth:"70vw"}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"clamp(8px,0.8vw,10px)",letterSpacing:"0.6em",textTransform:"uppercase",color:C.gold,marginBottom:28,opacity:phase>=3?1:0,transform:phase>=3?"translateX(0)":"translateX(-30px)",transition:"all 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s",display:"flex",alignItems:"center",gap:14}}>
          <span style={{width:32,height:1,background:C.gold,display:"inline-block"}}/>
          Premium Hydration — Born in Belgium
        </div>
        <h1 style={{fontFamily:"'Cormorant',serif",fontSize:"clamp(64px,16vw,220px)",fontWeight:300,lineHeight:0.82,letterSpacing:"-0.05em",color:C.ice,margin:0}}>
          <span style={{display:"block",opacity:phase>=3?1:0,transform:phase>=3?"translateY(0)":"translateY(100%)",transition:"all 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s"}}>Infinity</span>
          <span style={{display:"block",fontStyle:"italic",color:C.gold,opacity:phase>=3?1:0,transform:phase>=3?"translateY(0)":"translateY(100%)",transition:"all 1.4s cubic-bezier(0.16,1,0.3,1) 0.45s",textShadow:`0 0 100px ${C.gold}12`}}>Water</span>
        </h1>
        <div style={{marginTop:44,marginLeft:"clamp(80px,14vw,220px)",opacity:phase>=3?1:0,transform:phase>=3?"translateY(0)":"translateY(30px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1) 0.9s"}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(13px,1.1vw,17px)",fontWeight:300,color:C.frost,lineHeight:1.7,maxWidth:360}}>Sculpted in Belgium. Three collections. Nine metallic finishes. One infinite standard.</p>
        </div>
      </div>

      <div style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",opacity:phase>=3?0.25:0,transition:"opacity 1s ease 2s",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <div style={{width:1,height:28,background:`linear-gradient(180deg,transparent,${C.gold})`,animation:"ipulse 2.5s ease-in-out infinite"}}/>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:7,letterSpacing:"0.4em",textTransform:"uppercase",color:C.frost}}>Scroll</div>
      </div>
      <style>{`@keyframes ipulse{0%,100%{opacity:0.2}50%{opacity:0.8}}`}
@media(max-width:768px){
  .dg,.DG,[style*="gridTemplateColumns"]{grid-template-columns:1fr!important}
  .nl,.desktop-nav{display:none!important}
  .fg,.stat-grid,.feature-grid{grid-template-columns:1fr!important}
  .eg{grid-template-columns:1fr!important}
  h1,h2,.hero-title{word-break:break-word}
  nav{padding:16px!important}
  section{padding-left:16px!important;padding-right:16px!important}
}
</style>
    </section>
    </>
  );
}

/* ─── NAV ─── */
function Nav(){const[s,setS]=useState(false);useEffect(()=>{const fn=()=>setS(window.scrollY>100);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn)},[]);return(
<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,padding:"24px 8vw",display:"flex",justifyContent:"space-between",alignItems:"center",background:s?`${C.ice}F0`:"transparent",backdropFilter:s?"blur(28px) saturate(1.3)":"none",borderBottom:s?`1px solid ${C.mist}30`:"1px solid transparent",transition:"all 0.6s ease"}}>
<a href="#" style={{display:"flex",alignItems:"center"}}><img src="/infinity-logo.png" alt="Infinity Water" style={{height:32,width:"auto",objectFit:"contain"}} /></a>
<div style={{display:"flex",gap:36,alignItems:"center"}}>
{["Collections","Origin","Lifestyle"].map(i=>(<a key={i} href={`#${i.toLowerCase()}`} className="nav-link-hide" style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:s?C.deep:C.frost,textDecoration:"none",opacity:0.5,transition:"all 0.3s ease"}} onMouseEnter={e=>{(e.target as HTMLElement).style.opacity="1"}} onMouseLeave={e=>{(e.target as HTMLElement).style.opacity="0.5"}}>{i}</a>))}
<a href="#order" style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:s?C.ice:C.void,background:s?C.deep:C.gold,padding:"9px 24px",textDecoration:"none",transition:"all 0.4s ease"}}>Order</a>
</div></nav>)}

/* ─── HERO PRODUCT ─── */
function HeroProduct(){return(
<section style={{position:"relative",overflow:"hidden",background:C.ice}}>
<div className="dg hero-prod-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"90vh"}}>
<div style={{display:"flex",alignItems:"center",padding:"100px 6vw 100px 8vw"}}><div>
<R><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.45em",textTransform:"uppercase",color:C.water,marginBottom:44,display:"flex",alignItems:"center",gap:12}}><span style={{width:40,height:1,background:C.water,display:"inline-block"}}/>The Vessel</div></R>
<R delay={0.12}><h2 style={{fontFamily:"'Cormorant',serif",fontSize:"clamp(44px,6vw,88px)",fontWeight:300,lineHeight:0.98,letterSpacing:"-0.035em",color:C.deep,margin:"0 0 36px"}}>Not a bottle.<br/><em style={{color:C.gold}}>A sculpture.</em></h2></R>
<R delay={0.25}><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(14px,1.2vw,17px)",fontWeight:300,lineHeight:1.85,color:C.deep,opacity:0.5,maxWidth:420}}>Brushed metallic finish. Wine-bottle silhouette. Every color a statement. Precision-engineered to preserve purity and elevate the act of drinking.</p></R>
<R delay={0.35}><div style={{marginTop:52,display:"flex",gap:36}}>
{[{n:"9",l:"Colors"},{n:"750",l:"ml"},{n:"∞",l:"Standard"}].map(s=>(<div key={s.l} style={{borderLeft:`1px solid ${C.mist}`,paddingLeft:18}}>
<div style={{fontFamily:"'Cormorant',serif",fontSize:36,fontWeight:300,color:C.deep}}>{s.n}</div>
<div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:"0.35em",textTransform:"uppercase",color:C.frost,marginTop:4}}>{s.l}</div></div>))}
</div></R></div></div>
<R delay={0.1} dir="left" style={{position:"relative",minHeight:600}}>
<div style={{position:"absolute",inset:"-10%",width:"120%",height:"120%",WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 10%, black 100%), linear-gradient(to bottom, black 0%, black 90%, transparent 100%)",maskImage:"linear-gradient(to right, transparent 0%, black 10%, black 100%), linear-gradient(to bottom, black 0%, black 90%, transparent 100%)",WebkitMaskComposite:"intersect" as unknown as string,maskComposite:"intersect"}}>
<Image src="/gold-splash.png" alt="Infinity Water Gold" fill style={{objectFit:"cover",objectPosition:"center"}} priority/>
</div></R>
</div></section>)}

/* ─── COLLECTIONS — all 3 visible ─── */
function Collections(){const cols=[
{name:"Gold Collection",type:"SPARKLING",img:"/gold-trio.png",accent:C.gold,desc:"The original. Champagne, bronze, 24K. Effervescent purity — carbonated at the source."},
{name:"Blue Collection",type:"SPRING",img:"/blue-trio.png",accent:C.water,desc:"Aqua, navy, cobalt. Still water drawn from protected Belgian springs."},
{name:"Black Collection",type:"ALKALINE",img:"/black-trio.png",accent:C.frost,desc:"Silver, gunmetal, obsidian. pH-balanced alkaline water for peak performance."},
];return(
<section id="collections" style={{background:C.void,position:"relative",overflow:"hidden"}}>
<div style={{padding:"80px 8vw 48px"}}>
<R><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.45em",textTransform:"uppercase",color:C.gold,marginBottom:36,display:"flex",alignItems:"center",gap:12}}><span style={{width:40,height:1,background:C.gold,display:"inline-block"}}/>Three Collections · Three Waters</div></R>
<R delay={0.1}><h2 style={{fontFamily:"'Cormorant',serif",fontSize:"clamp(44px,7vw,96px)",fontWeight:300,lineHeight:0.92,color:C.ice,margin:"0 0 72px"}}>Every color.<br/><em style={{color:C.gold}}>A purpose.</em></h2></R>
</div>
<div className="dg collections-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:2,padding:"0 2px"}}>
{cols.map((col,i)=>(<R key={col.name} delay={0.1*i}>
<div style={{position:"relative",background:C.faint,overflow:"hidden",padding:"52px 36px 0",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)"}}
  onMouseEnter={e=>{e.currentTarget.style.background="#1A222C"}} onMouseLeave={e=>{e.currentTarget.style.background=C.faint}}>
<div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:"0.55em",textTransform:"uppercase",color:col.accent,marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
<span style={{width:20,height:1,background:col.accent,display:"inline-block"}}/>{col.type}</div>
<h3 style={{fontFamily:"'Cormorant',serif",fontSize:"clamp(26px,2.8vw,40px)",fontWeight:300,color:C.ice,marginBottom:14,letterSpacing:"-0.02em"}}>{col.name}</h3>
<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:300,lineHeight:1.75,color:C.frost,opacity:0.45,marginBottom:36}}>{col.desc}</p>
<div style={{position:"relative",width:"100%",aspectRatio:"4/3",WebkitMaskImage:"linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",maskImage:"linear-gradient(to bottom, black 0%, black 65%, transparent 100%)"}}>
<Image src={col.img} alt={col.name} fill style={{objectFit:"contain",objectPosition:"center bottom"}}/>
</div></div></R>))}
</div>
<div style={{padding:"52px 8vw 108px",display:"flex",justifyContent:"center",gap:0,flexWrap:"wrap"}}>
{[{color:"24K Gold",a:C.gold},{color:"Champagne",a:C.gold},{color:"Bronze",a:C.gold},{color:"Aqua",a:C.water},{color:"Navy",a:C.water},{color:"Cobalt",a:C.water},{color:"Silver",a:C.frost},{color:"Gunmetal",a:C.frost},{color:"Obsidian",a:C.frost}].map((c,i)=>(<R key={c.color} delay={0.04*i}>
<span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:c.a,padding:"8px 18px",opacity:0.5}}>{c.color}</span></R>))}
</div></section>)}

/* ─── CINEMATIC FLOAT ─── */
function CinematicFloat(){return(
<section style={{position:"relative",height:"80vh",overflow:"hidden",background:C.void}}>
<div style={{position:"absolute",inset:0,WebkitMaskImage:"radial-gradient(ellipse 72% 68% at 50% 50%, black 35%, transparent 100%)",maskImage:"radial-gradient(ellipse 72% 68% at 50% 50%, black 35%, transparent 100%)"}}>
<Image src="/gold-float.png" alt="Gold bottle floating" fill style={{objectFit:"contain",objectPosition:"center"}}/>
</div>
<div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 50%, transparent 25%, ${C.void} 70%)`}}/>
</section>)}

/* ─── BELGIAN ORIGIN ─── */
function BelgianOrigin(){return(
<section id="origin" style={{background:C.void,position:"relative",overflow:"hidden"}}>
<div className="dg origin-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"80vh"}}>
<R style={{position:"relative",minHeight:500}}>
<div style={{position:"absolute",inset:0,WebkitMaskImage:"radial-gradient(ellipse 80% 75% at 50% 50%, black 40%, transparent 100%)",maskImage:"radial-gradient(ellipse 80% 75% at 50% 50%, black 40%, transparent 100%)"}}>
<Image src="/gold-ice.png" alt="Gold bottle in ice" fill style={{objectFit:"cover",objectPosition:"center"}}/>
</div></R>
<div style={{display:"flex",alignItems:"center",padding:"100px 8vw 100px 4vw"}}><div>
<R><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.45em",textTransform:"uppercase",color:C.gold,marginBottom:44,display:"flex",alignItems:"center",gap:12}}><span style={{width:40,height:1,background:C.gold,display:"inline-block"}}/>Origin</div></R>
<R delay={0.12}><h2 style={{fontFamily:"'Cormorant',serif",fontSize:"clamp(40px,5vw,72px)",fontWeight:300,lineHeight:1.02,letterSpacing:"-0.035em",color:C.ice,margin:"0 0 36px"}}>Born in<br/><em style={{color:C.gold}}>Belgium.</em></h2></R>
<R delay={0.25}><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(14px,1.2vw,17px)",fontWeight:300,lineHeight:1.9,color:C.frost,opacity:0.5,maxWidth:440,marginBottom:44}}>Sourced from protected aquifers deep beneath the Ardennes. Filtered through millennia of Devonian limestone. Bottled at origin — never transported in bulk, never treated, never compromised.</p></R>
<R delay={0.35}><div className="dg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>
{[{label:"Source",value:"Ardennes Aquifer"},{label:"Filtration",value:"Natural Limestone"},{label:"Bottled",value:"At Origin"},{label:"Three Waters",value:"Sparkling · Spring · Alkaline"}].map(item=>(<div key={item.label} style={{background:C.faint,padding:"22px 18px"}}>
<div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:"0.4em",textTransform:"uppercase",color:C.gold,marginBottom:8}}>{item.label}</div>
<div style={{fontFamily:"'Cormorant',serif",fontSize:17,fontWeight:400,color:C.ice,lineHeight:1.4}}>{item.value}</div>
</div>))}</div></R>
<R delay={0.45}><div style={{marginTop:44}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:C.frost,opacity:0.25}}>Belgium · Est. 2024 · A Kollective Hospitality Group Brand</div></div></R>
</div></div></div></section>)}

/* ─── FULL LINEUP ─── */
function FullLineup(){return(
<section style={{background:C.ice,position:"relative",overflow:"hidden"}}>
<div style={{padding:"80px 8vw 44px"}}><R><h2 style={{fontFamily:"'Cormorant',serif",fontSize:"clamp(52px,9vw,140px)",fontWeight:300,fontStyle:"italic",lineHeight:0.88,letterSpacing:"-0.045em",color:C.deep,margin:0}}>The Full<br/>Collection.</h2></R></div>
<R delay={0.15}><div style={{position:"relative",width:"100%",height:"clamp(450px,60vh,850px)",WebkitMaskImage:"linear-gradient(to bottom, black 0%, black 80%, transparent 100%), linear-gradient(to right, transparent 1%, black 6%, black 94%, transparent 99%)",maskImage:"linear-gradient(to bottom, black 0%, black 80%, transparent 100%), linear-gradient(to right, transparent 1%, black 6%, black 94%, transparent 99%)",WebkitMaskComposite:"intersect" as unknown as string,maskComposite:"intersect"}}>
<Image src="/v-formation.png" alt="All bottles V formation" fill style={{objectFit:"contain",objectPosition:"center"}}/>
</div></R></section>)}

/* ─── SPIRAL GRID ─── */
function SpiralGrid(){return(
<section style={{background:C.void,position:"relative",overflow:"hidden"}}>
<div style={{padding:"80px 8vw 32px"}}>
<R><div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.45em",textTransform:"uppercase",color:C.gold,marginBottom:36,display:"flex",alignItems:"center",gap:12}}><span style={{width:40,height:1,background:C.gold,display:"inline-block"}}/>Every Finish</div></R>
<R delay={0.1}><h2 style={{fontFamily:"'Cormorant',serif",fontSize:"clamp(44px,7vw,96px)",fontWeight:300,lineHeight:0.92,color:C.ice}}>Nine finishes.<br/><em style={{color:C.gold}}>Infinite elegance.</em></h2></R>
</div>
<R delay={0.2}><div style={{position:"relative",width:"100%",height:"clamp(350px,50vh,600px)"}}>
<Image src="/spiral-grid.png" alt="All bottles with water spirals" fill style={{objectFit:"contain",objectPosition:"center"}}/>
</div></R><div style={{height:8}}/></section>)}

/* ─── LIFESTYLE ─── */
function LifestyleGallery(){const scenes=[{img:"/lifestyle-picnic.png",label:"Golden Hour"},{img:"/lifestyle-club.png",label:"After Dark"},{img:"/lifestyle-festival.png",label:"Festival Season"},{img:"/lifestyle-gym.png",label:"Performance"},{img:"/lifestyle-beachgroup.png",label:"Coastline"},{img:"/luxury-yacht.png",label:"On Deck"}];return(
<section id="lifestyle" style={{padding:"80px 8vw",background:C.void}}>
<R><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.45em",textTransform:"uppercase",color:C.gold,marginBottom:36,display:"flex",alignItems:"center",gap:12}}><span style={{width:40,height:1,background:C.gold,display:"inline-block"}}/>Lifestyle</div></R>
<R delay={0.1}><h2 style={{fontFamily:"'Cormorant',serif",fontSize:"clamp(44px,7vw,96px)",fontWeight:300,lineHeight:0.92,color:C.ice,margin:"0 0 72px"}}>Where Infinity<br/><em style={{color:C.gold}}>lives.</em></h2></R>
<div className="dg lifestyle-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
{scenes.map((s,i)=>(<R key={s.label} delay={0.06*i}>
<div style={{position:"relative",aspectRatio:"3/4",overflow:"hidden",cursor:"pointer",WebkitMaskImage:"radial-gradient(ellipse 78% 72% at 50% 45%, black 45%, transparent 100%)",maskImage:"radial-gradient(ellipse 78% 72% at 50% 45%, black 45%, transparent 100%)",transition:"all 0.6s cubic-bezier(0.16,1,0.3,1)"}}
onMouseEnter={e=>{const img=e.currentTarget.querySelector("img") as HTMLElement;if(img)img.style.transform="scale(1.06)"}}
onMouseLeave={e=>{const img=e.currentTarget.querySelector("img") as HTMLElement;if(img)img.style.transform="scale(1)"}}>
<Image src={s.img} alt={s.label} fill style={{objectFit:"cover",transition:"transform 0.8s cubic-bezier(0.16,1,0.3,1)"}}/>
<div style={{position:"absolute",bottom:0,left:0,right:0,padding:"44px 20px 16px",background:"linear-gradient(transparent,rgba(0,0,0,0.5))"}}><span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.28em",textTransform:"uppercase",color:C.ice,opacity:0.8}}>{s.label}</span></div>
</div></R>))}
</div></section>)}

/* ─── LUXURY CONTEXT ─── */
function LuxuryContext(){return(
<section style={{background:C.void,position:"relative",overflow:"hidden"}}>
<div style={{padding:"80px 8vw 64px"}}>
<R><h2 style={{fontFamily:"'Cormorant',serif",fontSize:"clamp(44px,7vw,96px)",fontWeight:300,lineHeight:0.92,color:C.ice,margin:"0 0 20px"}}>Everywhere<br/><em style={{color:C.gold}}>that matters.</em></h2></R>
<R delay={0.1}><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:300,lineHeight:1.75,color:C.frost,opacity:0.45,maxWidth:420,marginBottom:36}}>Private aviation. Five-star suites. Yacht decks. The standard for premium hospitality worldwide.</p></R>
</div>
<div className="dg" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:3}}>
{[{img:"/luxury-hotel.png",label:"Five-Star Suites"},{img:"/luxury-jet.png",label:"Private Aviation"},{img:"/luxury-jetbucket.png",label:"First Class"}].map((s,i)=>(<R key={s.label} delay={0.08*i}>
<div style={{position:"relative",aspectRatio:"4/3",overflow:"hidden",WebkitMaskImage:"radial-gradient(ellipse 80% 75% at 50% 45%, black 45%, transparent 100%)",maskImage:"radial-gradient(ellipse 80% 75% at 50% 45%, black 45%, transparent 100%)"}}>
<Image src={s.img} alt={s.label} fill style={{objectFit:"cover"}}/>
<div style={{position:"absolute",bottom:0,left:0,right:0,padding:"48px 20px 16px",background:"linear-gradient(transparent,rgba(0,0,0,0.5))"}}><span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.28em",textTransform:"uppercase",color:C.ice,opacity:0.8}}>{s.label}</span></div>
</div></R>))}
</div></section>)}

/* ─── STUDIO ─── */
function GalleryStudio(){return(
<section style={{position:"relative",background:C.ice,overflow:"hidden"}}>
<div style={{padding:"72px 8vw 44px"}}>
<R><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.45em",textTransform:"uppercase",color:C.water,marginBottom:36,display:"flex",alignItems:"center",gap:12}}><span style={{width:40,height:1,background:C.water,display:"inline-block"}}/>Studio</div></R>
<R delay={0.1}><h2 style={{fontFamily:"'Cormorant',serif",fontSize:"clamp(40px,6vw,72px)",fontWeight:300,lineHeight:1.02,color:C.deep}}>Designed to be<br/><em>displayed.</em></h2></R>
</div>
<R delay={0.15}><div style={{position:"relative",width:"100%",height:"clamp(450px,58vh,800px)",WebkitMaskImage:"linear-gradient(to bottom, black 0%, black 75%, transparent 100%), linear-gradient(to right, transparent 2%, black 10%, black 90%, transparent 98%)",maskImage:"linear-gradient(to bottom, black 0%, black 75%, transparent 100%), linear-gradient(to right, transparent 2%, black 10%, black 90%, transparent 98%)",WebkitMaskComposite:"intersect" as unknown as string,maskComposite:"intersect"}}>
<Image src="/lineup-full.png" alt="Infinity Water full lineup" fill style={{objectFit:"contain"}}/>
</div></R><div style={{height:84}}/></section>)}

/* ─── CONVERSION ─── */
function Conversion(){const[email,setEmail]=useState("");const[done,setDone]=useState(false);return(
<section id="order" style={{minHeight:"80vh",background:C.void,display:"flex",alignItems:"center",position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",inset:0,opacity:0.06,WebkitMaskImage:"radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)",maskImage:"radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)"}}><Image src="/gold-ice.png" alt="" fill style={{objectFit:"cover"}}/></div>
<div style={{padding:"100px 8vw",position:"relative",zIndex:1}}>
<R><h2 style={{fontFamily:"'Cormorant',serif",fontSize:"clamp(52px,12vw,180px)",fontWeight:300,lineHeight:0.86,letterSpacing:"-0.05em",color:C.ice,margin:"0 0 52px"}}>Enter<br/><em style={{color:C.gold}}>Infinity.</em></h2></R>
<R delay={0.15}><div style={{maxWidth:520}}>
<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:300,lineHeight:1.75,color:C.frost,opacity:0.45,marginBottom:44}}>First access to new collections. Partner announcements. Invitations.</p>
{!done?(<div style={{display:"flex",border:`1px solid ${C.faint}`,background:`${C.faint}40`}}>
<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{flex:1,padding:"20px 28px",fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:300,border:"none",outline:"none",background:"transparent",color:C.ice,letterSpacing:"0.03em"}}/>
<button onClick={()=>email&&setDone(true)} style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",padding:"20px 36px",background:C.gold,color:C.void,border:"none",cursor:"pointer",transition:"background 0.3s"}} onMouseEnter={e=>{(e.target as HTMLElement).style.background=C.ice}} onMouseLeave={e=>{(e.target as HTMLElement).style.background=C.gold}}>Join</button>
</div>):(<div style={{fontFamily:"'Cormorant',serif",fontSize:30,fontWeight:300,fontStyle:"italic",color:C.gold}}>Welcome to Infinity.</div>)}
</div></R></div></section>)}

/* ─── FOOTER ─── */
function Footer(){return(
<footer style={{background:C.void,padding:"72px 8vw 52px",borderTop:`1px solid ${C.faint}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:28}}>
<div><div style={{marginBottom:14}}><img src="/infinity-logo.png" alt="Infinity Water" style={{height:36,width:"auto",objectFit:"contain"}} /></div>
<div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:C.frost,opacity:0.2}}>© 2026 Infinity Water · Belgium · A Kollective Hospitality Group Brand</div></div>
<div style={{display:"flex",gap:32}}>{["Instagram","Press","Legal"].map(l=>(<a key={l} href="#" style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:C.frost,textDecoration:"none",opacity:0.25,transition:"opacity 0.3s"}} onMouseEnter={e=>{(e.target as HTMLElement).style.opacity="1"}} onMouseLeave={e=>{(e.target as HTMLElement).style.opacity="0.25"}}>{l}</a>))}</div>
</div></footer>)}

/* ─── MAIN ─── */
export default function HomePage(){return(
<main style={{overflowX:"hidden"}}>
<style>{`
@media(max-width:900px){
.collections-grid,.lifestyle-grid{grid-template-columns:1fr!important}
.hero-prod-grid,.origin-grid{grid-template-columns:1fr!important}
div[style*="grid-template-columns: 1fr 1fr 1fr"]{grid-template-columns:1fr!important}
h1{font-size:52px!important}
.nav-link-hide{display:none}
}
`}</style>
<Grain/>
<CursorGlow/>
<Nav/>
<VideoIntroHero/>
<HeroProduct/>
<Collections/>
<CinematicFloat/>
<BelgianOrigin/>
<FullLineup/>
<SpiralGrid/>
<LifestyleGallery/>
<LuxuryContext/>
<GalleryStudio/>
<Conversion/>
<Footer/>
</main>)}
