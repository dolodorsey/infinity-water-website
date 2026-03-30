'use client';
import { useState } from 'react';

const BRAND_KEY = 'infinity_water';
const BRAND = { name: 'Infinity Water', bg: '#060D14', accent: '#4FC3F7', text: '#E8F4FD', font: "'DM Sans', sans-serif" };
const WEBHOOK = 'https://dorsey.app.n8n.cloud/webhook/khg-form-submit';
const BG_IMG = '/images/forms-bg.png';

const FORMS = {
  vendor:{title:'Vendor Application',sub:'Join our vendor network',icon:'🏪',cat:'Business',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'business_name',l:'Business Name',t:'text',r:1},{n:'vendor_type',l:'Vendor Type',t:'select',r:1,o:['Food & Beverage','Merchandise','Art','Services','Technology','Other']},
    {n:'website',l:'Website / Social',t:'text'},{n:'description',l:'Describe what you offer',t:'textarea',r:1}]},
  artist_painter:{title:'Artist (Painter)',sub:'Showcase your visual art',icon:'🎨',cat:'Creative',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'artist_name',l:'Artist / Stage Name',t:'text'},{n:'medium',l:'Primary Medium',t:'select',r:1,o:['Oil','Acrylic','Watercolor','Mixed Media','Digital','Sculpture','Mural','Other']},
    {n:'portfolio',l:'Portfolio / Instagram',t:'text',r:1},{n:'description',l:'Tell us about your work',t:'textarea',r:1}]},
  artist_music:{title:'Artist (Music)',sub:'Perform at our events',icon:'🎵',cat:'Creative',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'artist_name',l:'Artist / Stage Name',t:'text',r:1},{n:'genre',l:'Genre',t:'select',r:1,o:["R&B","Hip Hop","Afrobeats","Neo Soul","Pop","Jazz","DJ","Live Band","Other"]},
    {n:'music_link',l:'Music Link (Spotify / SoundCloud)',t:'text',r:1},{n:'social',l:'Instagram Handle',t:'text'},{n:'bio',l:'Short Bio',t:'textarea',r:1}]},
  influencer:{title:'Influencer',sub:'Partner with us for content',icon:'📸',cat:'Creative',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'instagram',l:'Instagram Handle',t:'text',r:1},{n:'tiktok',l:'TikTok Handle',t:'text'},
    {n:'follower_count',l:'Total Following',t:'select',r:1,o:['Under 5K','5K–10K','10K–25K','25K–50K','50K–100K','100K+']},
    {n:'niche',l:'Content Niche',t:'text',r:1},{n:'pitch',l:'Why should we work together?',t:'textarea',r:1}]},
  sponsor:{title:'Sponsor Inquiry',sub:'Sponsor our events & experiences',icon:'🤝',cat:'Business',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'company',l:'Company / Brand',t:'text',r:1},{n:'title',l:'Your Title',t:'text'},
    {n:'budget_range',l:'Budget Range',t:'select',r:1,o:['Under $1,000','$1,000–$5,000','$5,000–$10,000','$10,000–$25,000','$25,000+']},
    {n:'interest',l:'What are you looking to achieve?',t:'textarea',r:1}]},
  consultation:{title:'Consultation',sub:'Book a consultation',icon:'💬',cat:'Business',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'service_interest',l:'Service Interest',t:'text',r:1},{n:'preferred_date',l:'Preferred Date',t:'date'},{n:'details',l:'Tell us what you need',t:'textarea',r:1}]},
  onboarding:{title:'Onboarding',sub:'Welcome aboard',icon:'🚀',cat:'Team',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'role',l:'Role / Position',t:'text',r:1},{n:'start_date',l:'Start Date',t:'date'},
    {n:'emergency_contact',l:'Emergency Contact',t:'text',r:1},{n:'notes',l:'Anything else?',t:'textarea'}]},
  what_you_do:{title:'What You Do',sub:'Tell us your skills & talents',icon:'⚡',cat:'General',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'profession',l:'What do you do?',t:'text',r:1},{n:'skills',l:'Key Skills / Talents',t:'textarea',r:1},
    {n:'social',l:'Instagram / Website',t:'text'},{n:'interest',l:'How would you like to be involved?',t:'textarea'}]},
  rsvp:{title:'RSVP',sub:'Reserve your spot',icon:'🎟️',cat:'Events',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'guest_count',l:'Number of Guests',t:'select',r:1,o:['1','2','3','4','5+']},{n:'event_name',l:'Event',t:'text'}]},
  intern:{title:'Intern Application',sub:'Launch your career with us',icon:'🎓',cat:'Team',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'school',l:'School / University',t:'text',r:1},{n:'major',l:'Major',t:'text',r:1},
    {n:'department_interest',l:'Department Interest',t:'select',r:1,o:['Marketing','Events','Design','Operations','Content','Tech','Sales','Other']},
    {n:'availability',l:'Availability',t:'select',r:1,o:['Full-time','Part-time','Weekends Only','Flexible']},
    {n:'why',l:'Why do you want to intern with us?',t:'textarea',r:1}]},
  volunteer:{title:'Volunteer',sub:'Be part of something bigger',icon:'🙌',cat:'Team',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'availability',l:'Availability',t:'select',r:1,o:['Weekdays','Weekends','Evenings','Flexible','Event-Day Only']},
    {n:'skills',l:'Skills / Experience',t:'text'},{n:'interest',l:'What interests you?',t:'textarea',r:1}]},
  hiring_inquiry:{title:'Hiring Inquiry',sub:'Explore career opportunities',icon:'💼',cat:'Team',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'position_interest',l:'Position of Interest',t:'text',r:1},
    {n:'experience',l:'Years of Experience',t:'select',r:1,o:['0–1','1–3','3–5','5–10','10+']},
    {n:'resume_link',l:'Resume / LinkedIn',t:'text'},{n:'cover',l:'Why should we hire you?',t:'textarea',r:1}]},
  inquiry:{title:'General Inquiry',sub:'Get in touch',icon:'📩',cat:'General',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel'},
    {n:'subject',l:'Subject',t:'text',r:1},{n:'message',l:'Your Message',t:'textarea',r:1}]},
  group_pricing:{title:'Group Pricing',sub:'Special rates for groups',icon:'👥',cat:'Events',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'group_size',l:'Group Size',t:'select',r:1,o:['10–20','20–50','50–100','100–200','200+']},
    {n:'event_name',l:'Event / Experience',t:'text'},{n:'preferred_date',l:'Preferred Date',t:'date'},{n:'details',l:'Details',t:'textarea'}]},
  table_reservation:{title:'Table / Section',sub:'Secure your section',icon:'🍾',cat:'Events',fields:[
    {n:'full_name',l:'Full Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'party_size',l:'Party Size',t:'select',r:1,o:['2–4','4–6','6–10','10–15','15+']},
    {n:'event_name',l:'Event',t:'text',r:1},{n:'section_pref',l:'Section',t:'select',o:['VIP','Standard','Stage-Side','No Preference']},
    {n:'special_requests',l:'Special Requests',t:'textarea'}]},
  nda:{title:'NDA',sub:'Confidentiality agreement',icon:'🔒',cat:'Business',fields:[
    {n:'full_name',l:'Full Legal Name',t:'text',r:1},{n:'email',l:'Email',t:'email',r:1},{n:'phone',l:'Phone',t:'tel',r:1},
    {n:'company',l:'Company / Organization',t:'text'},{n:'title',l:'Title / Role',t:'text'},
    {n:'acknowledge',l:'I acknowledge and agree to the terms of confidentiality',t:'checkbox',r:1}]},
};

const CATS = ['Events','Creative','Business','Team','General'];
const CAT_ICONS = {Events:'🎪',Creative:'🎨',Business:'💼',Team:'👥',General:'📋'};

function Input({field:f,value:v,onChange:c,brand:b}){
  const base={width:'100%',padding:'14px 16px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:15,fontFamily:"'DM Sans',sans-serif",outline:'none',boxSizing:'border-box',backdropFilter:'blur(8px)',transition:'border-color 0.3s'};
  const focus=e=>e.target.style.borderColor=b.accent+'80';
  const blur=e=>e.target.style.borderColor='rgba(255,255,255,0.1)';
  if(f.t==='textarea')return<textarea name={f.n} required={f.r} rows={4} value={v||''} onChange={e=>c(f.n,e.target.value)} style={{...base,resize:'vertical'}} onFocus={focus} onBlur={blur}/>;
  if(f.t==='select')return<select name={f.n} required={f.r} value={v||''} onChange={e=>c(f.n,e.target.value)} style={{...base,color:v?'#fff':'rgba(255,255,255,0.35)',cursor:'pointer',appearance:'none'}}><option value="" style={{background:'#111'}}>Select...</option>{(f.o||[]).map(o=><option key={o} value={o} style={{background:'#111',color:'#fff'}}>{o}</option>)}</select>;
  if(f.t==='checkbox')return<label style={{display:'flex',alignItems:'flex-start',gap:12,cursor:'pointer',fontSize:14,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5,color:'rgba(255,255,255,0.75)'}}><input type="checkbox" name={f.n} required={f.r} checked={v||false} onChange={e=>c(f.n,e.target.checked)} style={{marginTop:3,accentColor:b.accent,width:18,height:18,flexShrink:0}}/>{f.l}</label>;
  return<input type={f.t} name={f.n} required={f.r} value={v||''} onChange={e=>c(f.n,e.target.value)} style={base} onFocus={focus} onBlur={blur}/>;
}

function FormsIndex(){
  const [filter,setFilter]=useState('All');
  const filtered=Object.entries(FORMS).filter(([,f])=>filter==='All'||f.cat===filter);
  return(
    <div style={{minHeight:'100vh',position:'relative',overflow:'hidden'}}>
      {/* Background */}
      <div style={{position:'fixed',inset:0,zIndex:0}}>
        <img src={BG_IMG} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.8) 100%)'}}/>
      </div>
      {/* Grain */}
      <div style={{position:'fixed',inset:0,opacity:0.03,pointerEvents:'none',zIndex:1,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`}}/>
      {/* Content */}
      <div style={{position:'relative',zIndex:2,padding:'clamp(80px,12vw,140px) 20px 60px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          {/* Header */}
          <div style={{textAlign:'center',marginBottom:50}}>
            <div style={{display:'inline-block',padding:'6px 20px',border:`1px solid ${BRAND.accent}40`,borderRadius:100,marginBottom:20}}>
              <span style={{fontSize:11,letterSpacing:4,textTransform:'uppercase',color:BRAND.accent,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{BRAND.name}</span>
            </div>
            <h1 style={{fontSize:'clamp(36px,7vw,64px)',fontWeight:300,lineHeight:1.05,margin:'0 0 16px',letterSpacing:'-0.03em',color:'#fff',fontFamily:BRAND.font}}>
              Connect With Us
            </h1>
            <p style={{fontSize:'clamp(14px,1.5vw,17px)',color:'rgba(255,255,255,0.45)',maxWidth:520,margin:'0 auto',lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>
              Whether you are a vendor, artist, sponsor, volunteer, or just want to collaborate — we would love to hear from you.
            </p>
          </div>
          {/* Category Filter */}
          <div style={{display:'flex',justifyContent:'center',gap:8,marginBottom:40,flexWrap:'wrap'}}>
            {['All',...CATS].map(c=>(
              <button key={c} onClick={()=>setFilter(c)} style={{
                padding:'8px 18px',borderRadius:100,border:filter===c?`1px solid ${BRAND.accent}`:'1px solid rgba(255,255,255,0.1)',
                background:filter===c?`${BRAND.accent}18`:'rgba(255,255,255,0.04)',
                color:filter===c?BRAND.accent:'rgba(255,255,255,0.5)',fontSize:12,fontFamily:"'DM Sans',sans-serif",
                fontWeight:500,letterSpacing:1,textTransform:'uppercase',cursor:'pointer',transition:'all 0.3s',backdropFilter:'blur(12px)'
              }}>
                {c!=='All'&&<span style={{marginRight:6}}>{CAT_ICONS[c]}</span>}{c}
              </button>
            ))}
          </div>
          {/* Form Grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
            {filtered.map(([key,form])=>(
              <a key={key} href={`/forms/${key}`} style={{
                display:'block',padding:'24px 22px',background:'rgba(0,0,0,0.45)',backdropFilter:'blur(20px) saturate(1.3)',
                border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,textDecoration:'none',color:'#fff',
                transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)',position:'relative',overflow:'hidden'
              }}
              onMouseEnter={e=>{e.currentTarget.style.background=`rgba(0,0,0,0.6)`;e.currentTarget.style.borderColor=`${BRAND.accent}35`;e.currentTarget.style.transform='translateY(-4px) scale(1.01)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,0,0,0.45)';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.transform='translateY(0) scale(1)'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                  <span style={{fontSize:28}}>{form.icon}</span>
                  <span style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:BRAND.accent,fontFamily:"'DM Sans',sans-serif",opacity:0.7,background:`${BRAND.accent}12`,padding:'4px 10px',borderRadius:100}}>{form.cat}</span>
                </div>
                <h3 style={{fontSize:17,fontWeight:500,margin:'0 0 6px',fontFamily:"'DM Sans',sans-serif",letterSpacing:'-0.01em'}}>{form.title}</h3>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',margin:0,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{form.sub}</p>
                <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg, transparent, ${BRAND.accent}40, transparent)`,opacity:0}}/>
              </a>
            ))}
          </div>
          {/* Footer */}
          <p style={{textAlign:'center',marginTop:50,fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:"'DM Sans',sans-serif",letterSpacing:1}}>
            © {new Date().getFullYear()} {BRAND.name} — Powered by The Kollective Hospitality Group
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FormPage({params}){
  const type=params?.type;
  const form=FORMS[type];
  const [data,setData]=useState({});
  const [status,setStatus]=useState('idle');
  const set=(n,v)=>setData(p=>({...p,[n]:v}));
  const submit=async(e)=>{
    e.preventDefault();setStatus('submitting');
    try{await fetch(WEBHOOK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({brand_key:BRAND_KEY,form_type:type,full_name:data.full_name||'',email:data.email||'',phone:data.phone||'',form_data:data,source:'standalone_form',submitted_at:new Date().toISOString()})});setStatus('success');}catch{setStatus('error');}
  };

  if(!form) return <FormsIndex/>;

  if(status==='success') return(
    <div style={{minHeight:'100vh',position:'relative',overflow:'hidden'}}>
      <div style={{position:'fixed',inset:0,zIndex:0}}><img src={BG_IMG} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/><div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.75)'}}/></div>
      <div style={{position:'relative',zIndex:2,display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',padding:20}}>
        <div style={{textAlign:'center',maxWidth:480}}>
          <div style={{width:72,height:72,borderRadius:'50%',border:`2px solid ${BRAND.accent}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',fontSize:32,color:BRAND.accent}}>✓</div>
          <h1 style={{fontSize:32,fontWeight:300,marginBottom:12,color:'#fff',fontFamily:BRAND.font}}>Submitted</h1>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.5)',fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>Thank you{data.full_name?', '+data.full_name:''}. We received your {form.title.toLowerCase()} and will be in touch shortly.</p>
          <a href={'/forms/'+type} style={{display:'inline-block',marginTop:32,padding:'12px 32px',border:`1px solid ${BRAND.accent}60`,color:BRAND.accent,borderRadius:6,textDecoration:'none',fontSize:13,letterSpacing:1,textTransform:'uppercase',fontFamily:"'DM Sans',sans-serif"}}>Submit Another</a>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:'100vh',position:'relative',overflow:'hidden'}}>
      {/* Background */}
      <div style={{position:'fixed',inset:0,zIndex:0}}>
        <img src={BG_IMG} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.85) 100%)'}}/>
      </div>
      <div style={{position:'fixed',inset:0,opacity:0.03,pointerEvents:'none',zIndex:1,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`}}/>
      {/* Form */}
      <div style={{position:'relative',zIndex:2,padding:'clamp(80px,12vw,120px) 20px 80px'}}>
        <div style={{maxWidth:560,margin:'0 auto'}}>
          <div style={{background:'rgba(0,0,0,0.5)',backdropFilter:'blur(24px) saturate(1.3)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,padding:'clamp(28px,5vw,48px)',boxShadow:'0 20px 80px rgba(0,0,0,0.5)'}}>
            {/* Form Header */}
            <div style={{textAlign:'center',marginBottom:36}}>
              <a href="/forms" style={{fontSize:11,letterSpacing:4,textTransform:'uppercase',color:BRAND.accent,textDecoration:'none',fontFamily:"'DM Sans',sans-serif",display:'inline-block',marginBottom:16,opacity:0.8}}>← {BRAND.name} Forms</a>
              <div style={{fontSize:36,marginBottom:12}}>{form.icon}</div>
              <h1 style={{fontSize:'clamp(24px,4vw,36px)',fontWeight:300,lineHeight:1.15,margin:'0 0 8px',letterSpacing:'-0.02em',color:'#fff',fontFamily:BRAND.font}}>{form.title}</h1>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.4)',fontFamily:"'DM Sans',sans-serif",margin:0}}>{form.sub}</p>
              <div style={{width:40,height:1,background:BRAND.accent,margin:'20px auto 0',opacity:0.4}}/>
            </div>
            {/* Form Fields */}
            <form onSubmit={submit}>
              <div style={{display:'flex',flexDirection:'column',gap:18}}>
                {form.fields.map(f=><div key={f.n}>
                  {f.t!=='checkbox'&&<label style={{display:'block',fontSize:11,letterSpacing:2,textTransform:'uppercase',marginBottom:8,color:'rgba(255,255,255,0.5)',fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{f.l}{f.r?<span style={{color:BRAND.accent,marginLeft:4}}>*</span>:null}</label>}
                  <Input field={f} value={data[f.n]} onChange={set} brand={BRAND}/>
                </div>)}
              </div>
              {status==='error'&&<p style={{color:'#EF5350',fontSize:14,fontFamily:"'DM Sans',sans-serif",marginTop:16,textAlign:'center'}}>Something went wrong. Please try again.</p>}
              <button type="submit" disabled={status==='submitting'} style={{width:'100%',marginTop:28,padding:'16px 32px',background:status==='submitting'?`${BRAND.accent}40`:BRAND.accent,color:'#000',border:'none',borderRadius:8,fontSize:13,fontWeight:600,letterSpacing:2,textTransform:'uppercase',fontFamily:"'DM Sans',sans-serif",cursor:status==='submitting'?'wait':'pointer',transition:'all 0.3s'}}>
                {status==='submitting'?'Submitting...':'Submit'}
              </button>
            </form>
          </div>
          <p style={{textAlign:'center',marginTop:32,fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:"'DM Sans',sans-serif",letterSpacing:1}}>© {new Date().getFullYear()} {BRAND.name} — Powered by The Kollective</p>
        </div>
      </div>
    </div>
  );
}
