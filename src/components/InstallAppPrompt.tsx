"use client";
import {useEffect,useState} from "react";

function forceInstall(){try{return new URLSearchParams(location.search).get('install')==='1'}catch{return false}}
function InstallQr(){
  const [qr,setQr]=useState('');
  useEffect(()=>{if(typeof window==='undefined'||window.innerWidth<760)return;try{const u=new URL(location.href);u.hash='';u.search='';u.searchParams.set('install','1');setQr('https://wfkohcwxxsrhcxhepfql.supabase.co/functions/v1/app-install-qr?url='+encodeURIComponent(u.toString()))}catch{}},[]);
  if(!qr)return null;
  return <aside aria-label="Scan to install app" style={{position:'fixed',right:22,bottom:22,zIndex:2147483002,width:188,padding:12,borderRadius:20,background:'rgba(7,8,11,.97)',border:'1px solid rgba(255,255,255,.16)',boxShadow:'0 24px 70px rgba(0,0,0,.48)',color:'#fff',fontFamily:'Arial,sans-serif'}}>
    <img src={qr} alt="QR code to install this app" width="164" height="164" style={{display:'block',width:'100%',height:'auto',borderRadius:12,background:'#fff',padding:6}}/>
    <strong style={{display:'block',marginTop:10,fontSize:10,letterSpacing:'.14em'}}>SCAN TO GET THE APP</strong>
    <small style={{display:'block',marginTop:5,color:'rgba(255,255,255,.62)',fontSize:9,lineHeight:1.45}}>iPhone: Share → Add to Home Screen → Open as Web App → Add. Android: tap Install App.</small>
  </aside>
}

const CAP="https://wfkohcwxxsrhcxhepfql.supabase.co/functions/v1/marketing-event-capture",KEY="infinity-water:pwa-dismissed",WEEK=604800000;
const get=(k:string)=>{try{return localStorage.getItem(k)}catch{return null}},put=(k:string,v:string)=>{try{localStorage.setItem(k,v)}catch{}};
const ios=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const standalone=()=>matchMedia("(display-mode: standalone)").matches||Boolean((navigator as Navigator&{standalone?:boolean}).standalone);
function visitor(){let v=get("khg_vid");if(v)return v;v=crypto.randomUUID();put("khg_vid",v);return v}
function track(event_type:string,metadata:Record<string,string>={}){fetch(CAP,{method:"POST",keepalive:true,headers:{"content-type":"application/json"},body:JSON.stringify({brand_key:"infinity-water",event_type,visitor_key:visitor(),metadata:{event_id:crypto.randomUUID(),app:"infinity-water",path:(location.pathname+location.search).slice(0,500),...metadata}})}).catch(()=>{})}
export default function InstallAppPrompt(){
 const[prompt,setPrompt]=useState<any>(null),[show,setShow]=useState(false),[steps,setSteps]=useState(false),[apple,setApple]=useState(false);
 useEffect(()=>{if(standalone())return;const a=ios();setApple(a);if("serviceWorker"in navigator)navigator.serviceWorker.register("/sw.js").catch(()=>{});const d=Number(get(KEY)||0),eligible=!d||Date.now()-d>WEEK;const before=(e:any)=>{e.preventDefault();setPrompt(e);if(eligible)setTimeout(()=>setShow(true),1800)},done=()=>{setShow(false);track("app_install",{platform:a?"ios":"web",variant:"infinity_pwa"})};addEventListener("beforeinstallprompt",before);addEventListener("appinstalled",done);let t=0;if(eligible&&a)t=window.setTimeout(()=>setShow(true),4800);return()=>{removeEventListener("beforeinstallprompt",before);removeEventListener("appinstalled",done);if(t)clearTimeout(t)}},[]);
 if(!show)return null;
 const close=()=>{put(KEY,String(Date.now()));setShow(false);track("cta_click",{cta:"pwa_prompt_dismiss"})};
 const install=async()=>{track("app_install_click",{platform:apple?"ios":"web",variant:prompt?"native_prompt":"instructions"});if(prompt){const r=await prompt.prompt();setPrompt(null);if(r.outcome==="accepted")setShow(false);return}setSteps(true)};
 return <div className="iw-pwa">
    <InstallQr/><section><button className="x" onClick={close}>×</button><img className="logo" src="/infinity-logo.png" alt="Infinity Water"/>{!steps?<><div className="k">PREMIUM HYDRATION / HOME SCREEN</div><h2>KEEP<br/><em>INFINITY</em><br/>ONE TAP AWAY.</h2><p>Collections, hospitality programs, wholesale, distribution and the next Infinity Water drop — directly from your Home Screen.</p><button className="go" onClick={install}>{prompt?"INSTALL INFINITY":"ADD INFINITY"}</button><button className="later" onClick={close}>Keep exploring</button></>:<><div className="k">{apple?"IPHONE / HOME SCREEN":"INSTALL / HOME SCREEN"}</div><h2>THREE TAPS.<br/><em>STAY HYDRATED.</em></h2><p>1. {apple?"Tap Share in Safari":"Open the browser menu"}<br/>2. Choose Add to Home Screen / Install App<br/>3. Tap Add</p><button className="go" onClick={close}>GOT IT</button></>}<style jsx>{`.iw-pwa{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:end center;padding:16px;background:#020407dd;backdrop-filter:blur(12px)}section{position:relative;width:min(650px,100%);padding:34px 24px 22px;border:1px solid #cbb57a66;border-radius:28px;background:radial-gradient(circle at 87% 4%,#d5bd7830,transparent 32%),linear-gradient(145deg,#11161d,#030508 72%);color:#fff;box-shadow:0 35px 100px #000d}.x{position:absolute;right:13px;top:13px;width:38px;height:38px;border-radius:50%;border:1px solid #fff2;background:#fff1;color:#fff;font-size:24px}.logo{width:150px;height:64px;object-fit:contain;object-position:left center;margin-bottom:20px}.k{color:#d5bd78;font:900 9px Arial;letter-spacing:.2em}.iw-pwa h2{font:900 clamp(36px,9vw,60px)/.84 Arial;margin:12px 0;letter-spacing:-.06em}.iw-pwa h2 em{font-style:normal;color:#d5bd78}.iw-pwa p{max-width:470px;color:#c4c9ce;font:500 14px/1.6 Arial}.go{width:100%;min-height:56px;border:0;border-radius:14px;background:#d5bd78;color:#080a0d;font:900 12px Arial;letter-spacing:.08em}.later{width:100%;border:0;background:none;color:#8c949b;padding:13px;font:700 11px Arial}@media(min-width:700px){.iw-pwa{place-items:center}}`}</style></section></div>
}