'use client';
import { useState } from 'react';

const BRAND_KEY = 'infinity_water';
const BRAND = { name: 'Infinity Water', bg: '#060D14', accent: '#4FC3F7', text: '#E8F4FD', font: "'DM Sans', serif" };
const WEBHOOK = 'https://dorsey.app.n8n.cloud/webhook/khg-form-submit';

const FORMS = {
  vendor: { title: 'Vendor Application', icon: '🏪', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true }, { n: 'business_name', l: 'Business Name', t: 'text', r: true },
    { n: 'vendor_type', l: 'Vendor Type', t: 'select', r: true, o: ['Food & Beverage','Merchandise','Art','Services','Technology','Other'] },
    { n: 'website', l: 'Website / Social', t: 'text' }, { n: 'description', l: 'Describe what you offer', t: 'textarea', r: true },
  ]},
  artist_painter: { title: 'Artist (Painter)', icon: '🎨', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true }, { n: 'artist_name', l: 'Artist / Stage Name', t: 'text' },
    { n: 'medium', l: 'Primary Medium', t: 'select', r: true, o: ['Oil','Acrylic','Watercolor','Mixed Media','Digital','Sculpture','Mural','Other'] },
    { n: 'portfolio', l: 'Portfolio / Instagram', t: 'text', r: true }, { n: 'description', l: 'Tell us about your work', t: 'textarea', r: true },
  ]},
  artist_music: { title: 'Artist (Music)', icon: '🎵', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true }, { n: 'artist_name', l: 'Artist / Stage Name', t: 'text', r: true },
    { n: 'genre', l: 'Genre', t: 'select', r: true, o: ['R&B','Hip Hop','Afrobeats','Neo Soul','Pop','Jazz','DJ','Live Band','Other'] },
    { n: 'music_link', l: 'Music Link (Spotify / SoundCloud)', t: 'text', r: true },
    { n: 'social', l: 'Instagram Handle', t: 'text' }, { n: 'bio', l: 'Short Bio', t: 'textarea', r: true },
  ]},
  influencer: { title: 'Influencer Application', icon: '📸', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true }, { n: 'instagram', l: 'Instagram Handle', t: 'text', r: true },
    { n: 'tiktok', l: 'TikTok Handle', t: 'text' },
    { n: 'follower_count', l: 'Total Following', t: 'select', r: true, o: ['Under 5K','5K–10K','10K–25K','25K–50K','50K–100K','100K+'] },
    { n: 'niche', l: 'Content Niche', t: 'text', r: true }, { n: 'pitch', l: 'Why should we work together?', t: 'textarea', r: true },
  ]},
  sponsor: { title: 'Sponsor Inquiry', icon: '🤝', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true }, { n: 'company', l: 'Company / Brand', t: 'text', r: true },
    { n: 'title', l: 'Your Title', t: 'text' },
    { n: 'budget_range', l: 'Budget Range', t: 'select', r: true, o: ['Under $1,000','$1,000–$5,000','$5,000–$10,000','$10,000–$25,000','$25,000+'] },
    { n: 'interest', l: 'What are you looking to achieve?', t: 'textarea', r: true },
  ]},
  consultation: { title: 'Consultation Request', icon: '💬', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true }, { n: 'service_interest', l: 'Service Interest', t: 'text', r: true },
    { n: 'preferred_date', l: 'Preferred Date', t: 'date' }, { n: 'details', l: 'Tell us what you need', t: 'textarea', r: true },
  ]},
  onboarding: { title: 'Onboarding Form', icon: '🚀', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true }, { n: 'role', l: 'Role / Position', t: 'text', r: true },
    { n: 'start_date', l: 'Start Date', t: 'date' }, { n: 'emergency_contact', l: 'Emergency Contact (Name & Phone)', t: 'text', r: true },
    { n: 'notes', l: 'Anything else we should know?', t: 'textarea' },
  ]},
  what_you_do: { title: 'What You Do', icon: '⚡', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true }, { n: 'profession', l: 'What do you do?', t: 'text', r: true },
    { n: 'skills', l: 'Key Skills / Talents', t: 'textarea', r: true }, { n: 'social', l: 'Instagram / Website', t: 'text' },
    { n: 'interest', l: 'How would you like to be involved?', t: 'textarea' },
  ]},
  rsvp: { title: 'RSVP', icon: '🎟️', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true },
    { n: 'guest_count', l: 'Number of Guests', t: 'select', r: true, o: ['1','2','3','4','5+'] },
    { n: 'event_name', l: 'Event (if applicable)', t: 'text' },
  ]},
  intern: { title: 'Intern Application', icon: '🎓', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true }, { n: 'school', l: 'School / University', t: 'text', r: true },
    { n: 'major', l: 'Major / Field of Study', t: 'text', r: true },
    { n: 'department_interest', l: 'Department Interest', t: 'select', r: true, o: ['Marketing','Events','Design','Operations','Content','Tech','Sales','Other'] },
    { n: 'availability', l: 'Availability', t: 'select', r: true, o: ['Full-time','Part-time','Weekends Only','Flexible'] },
    { n: 'why', l: 'Why do you want to intern with us?', t: 'textarea', r: true },
  ]},
  volunteer: { title: 'Volunteer Application', icon: '🙌', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true },
    { n: 'availability', l: 'Availability', t: 'select', r: true, o: ['Weekdays','Weekends','Evenings','Flexible','Event-Day Only'] },
    { n: 'skills', l: 'Skills / Experience', t: 'text' }, { n: 'interest', l: 'What interests you about volunteering?', t: 'textarea', r: true },
  ]},
  hiring_inquiry: { title: 'Hiring Inquiry', icon: '💼', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true }, { n: 'position_interest', l: 'Position of Interest', t: 'text', r: true },
    { n: 'experience', l: 'Years of Experience', t: 'select', r: true, o: ['0–1','1–3','3–5','5–10','10+'] },
    { n: 'resume_link', l: 'Resume / LinkedIn Link', t: 'text' }, { n: 'cover', l: 'Why should we hire you?', t: 'textarea', r: true },
  ]},
  inquiry: { title: 'General Inquiry', icon: '📩', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel' }, { n: 'subject', l: 'Subject', t: 'text', r: true },
    { n: 'message', l: 'Your Message', t: 'textarea', r: true },
  ]},
  group_pricing: { title: 'Group Pricing Request', icon: '👥', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true },
    { n: 'group_size', l: 'Group Size', t: 'select', r: true, o: ['10–20','20–50','50–100','100–200','200+'] },
    { n: 'event_name', l: 'Event / Experience', t: 'text' }, { n: 'preferred_date', l: 'Preferred Date', t: 'date' },
    { n: 'details', l: 'Additional Details', t: 'textarea' },
  ]},
  table_reservation: { title: 'Table / Section Reservation', icon: '🍾', fields: [
    { n: 'full_name', l: 'Full Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true },
    { n: 'party_size', l: 'Party Size', t: 'select', r: true, o: ['2–4','4–6','6–10','10–15','15+'] },
    { n: 'event_name', l: 'Event', t: 'text', r: true },
    { n: 'section_pref', l: 'Section Preference', t: 'select', o: ['VIP','Standard','Stage-Side','No Preference'] },
    { n: 'special_requests', l: 'Special Requests', t: 'textarea' },
  ]},
  nda: { title: 'Non-Disclosure Agreement', icon: '🔒', fields: [
    { n: 'full_name', l: 'Full Legal Name', t: 'text', r: true }, { n: 'email', l: 'Email', t: 'email', r: true },
    { n: 'phone', l: 'Phone', t: 'tel', r: true }, { n: 'company', l: 'Company / Organization', t: 'text' },
    { n: 'title', l: 'Title / Role', t: 'text' },
    { n: 'acknowledge', l: 'I acknowledge and agree to the terms of confidentiality', t: 'checkbox', r: true },
  ]},
};

function Input({ field, value, onChange, brand }) {
  const base = { width:'100%', padding:'14px 16px', background:brand.text+'06', border:'1px solid '+brand.text+'12',
    borderRadius:8, color:brand.text, fontSize:15, fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' };
  if (field.t === 'textarea') return <textarea name={field.n} required={field.r} rows={4} value={value||''} onChange={e=>onChange(field.n,e.target.value)} style={{...base,resize:'vertical'}} onFocus={e=>e.target.style.borderColor=brand.accent+'50'} onBlur={e=>e.target.style.borderColor=brand.text+'12'} />;
  if (field.t === 'select') return <select name={field.n} required={field.r} value={value||''} onChange={e=>onChange(field.n,e.target.value)} style={{...base,color:value?brand.text:brand.text+'40',cursor:'pointer',appearance:'none'}}><option value="" style={{background:brand.bg}}>Select...</option>{(field.o||[]).map(o=><option key={o} value={o} style={{background:brand.bg,color:brand.text}}>{o}</option>)}</select>;
  if (field.t === 'checkbox') return <label style={{display:'flex',alignItems:'flex-start',gap:12,cursor:'pointer',fontSize:14,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5,opacity:0.8}}><input type="checkbox" name={field.n} required={field.r} checked={value||false} onChange={e=>onChange(field.n,e.target.checked)} style={{marginTop:3,accentColor:brand.accent,width:18,height:18,flexShrink:0}} />{field.l}</label>;
  return <input type={field.t} name={field.n} required={field.r} value={value||''} onChange={e=>onChange(field.n,e.target.value)} style={base} onFocus={e=>e.target.style.borderColor=brand.accent+'50'} onBlur={e=>e.target.style.borderColor=brand.text+'12'} />;
}

export default function FormPage({ params }) {
  const type = params?.type;
  const form = FORMS[type];
  const [data, setData] = useState({});
  const [status, setStatus] = useState('idle');
  const set = (n,v) => setData(p=>({...p,[n]:v}));
  const submit = async (e) => {
    e.preventDefault(); setStatus('submitting');
    try {
      await fetch(WEBHOOK, { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ brand_key:BRAND_KEY, form_type:type, full_name:data.full_name||'', email:data.email||'', phone:data.phone||'', form_data:data, source:'standalone_form', submitted_at:new Date().toISOString() })
      });
      setStatus('success');
    } catch { setStatus('error'); }
  };

  if (!form) return (
    <div style={{minHeight:'100vh',background:BRAND.bg,color:BRAND.text,fontFamily:BRAND.font,padding:'60px 20px'}}>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:60}}>
          <p style={{fontSize:11,letterSpacing:4,textTransform:'uppercase',color:BRAND.accent,marginBottom:16,fontFamily:"'DM Sans',sans-serif"}}>{BRAND.name}</p>
          <h1 style={{fontSize:'clamp(32px,6vw,56px)',fontWeight:300,lineHeight:1.1,margin:0,letterSpacing:'-0.02em'}}>Forms & Applications</h1>
          <div style={{width:60,height:1,background:BRAND.accent,margin:'24px auto',opacity:0.6}} />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
          {Object.entries(FORMS).map(([k,f])=><a key={k} href={'/forms/'+k} style={{display:'flex',alignItems:'center',gap:14,padding:'18px 20px',background:BRAND.text+'08',border:'1px solid '+BRAND.text+'10',borderRadius:10,textDecoration:'none',color:BRAND.text,transition:'all 0.3s'}}><span style={{fontSize:22}}>{f.icon}</span><span style={{fontSize:14,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{f.title}</span></a>)}
        </div>
      </div>
    </div>
  );

  if (status==='success') return (
    <div style={{minHeight:'100vh',background:BRAND.bg,color:BRAND.text,fontFamily:BRAND.font,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{textAlign:'center',maxWidth:480}}>
        <div style={{fontSize:64,marginBottom:20}}>✓</div>
        <h1 style={{fontSize:32,fontWeight:300,marginBottom:12}}>Submitted</h1>
        <p style={{fontSize:15,opacity:0.6,fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>Thank you{data.full_name?', '+data.full_name:''}. We received your {form.title.toLowerCase()} and will be in touch shortly.</p>
        <a href={'/forms/'+type} style={{display:'inline-block',marginTop:32,padding:'12px 32px',border:'1px solid '+BRAND.accent+'60',color:BRAND.accent,borderRadius:6,textDecoration:'none',fontSize:13,letterSpacing:1,textTransform:'uppercase',fontFamily:"'DM Sans',sans-serif"}}>Submit Another</a>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:BRAND.bg,color:BRAND.text,fontFamily:BRAND.font}}>
      <div style={{position:'fixed',inset:0,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",pointerEvents:'none',zIndex:0}} />
      <div style={{position:'relative',zIndex:1,padding:'60px 20px 80px'}}>
        <div style={{maxWidth:560,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <a href="/forms" style={{fontSize:11,letterSpacing:4,textTransform:'uppercase',color:BRAND.accent,textDecoration:'none',fontFamily:"'DM Sans',sans-serif",display:'inline-block',marginBottom:20,opacity:0.8}}>{BRAND.name}</a>
            <h1 style={{fontSize:'clamp(28px,5vw,44px)',fontWeight:300,lineHeight:1.15,margin:'0 0 8px',letterSpacing:'-0.02em'}}>{form.title}</h1>
            <div style={{width:40,height:1,background:BRAND.accent,margin:'24px auto 0',opacity:0.4}} />
          </div>
          <form onSubmit={submit}>
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              {form.fields.map(f=><div key={f.n}>
                {f.t!=='checkbox'&&<label style={{display:'block',fontSize:11,letterSpacing:2,textTransform:'uppercase',marginBottom:8,opacity:0.6,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{f.l}{f.r&&<span style={{color:BRAND.accent,marginLeft:4}}>*</span>}</label>}
                <Input field={f} value={data[f.n]} onChange={set} brand={BRAND} />
              </div>)}
            </div>
            {status==='error'&&<p style={{color:'#EF5350',fontSize:14,fontFamily:"'DM Sans',sans-serif",marginTop:16,textAlign:'center'}}>Something went wrong. Please try again.</p>}
            <button type="submit" disabled={status==='submitting'} style={{width:'100%',marginTop:32,padding:'16px 32px',background:status==='submitting'?BRAND.accent+'40':BRAND.accent,color:BRAND.bg,border:'none',borderRadius:8,fontSize:13,fontWeight:600,letterSpacing:2,textTransform:'uppercase',fontFamily:"'DM Sans',sans-serif",cursor:status==='submitting'?'wait':'pointer'}}>
              {status==='submitting'?'Submitting...':'Submit'}
            </button>
          </form>
          <p style={{textAlign:'center',marginTop:40,fontSize:11,opacity:0.25,fontFamily:"'DM Sans',sans-serif",letterSpacing:1}}>© {new Date().getFullYear()} Infinity Water — Powered by The Kollective</p>
        </div>
      </div>
    </div>
  );
}
