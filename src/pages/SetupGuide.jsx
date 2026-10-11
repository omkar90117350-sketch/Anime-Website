import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Copy, ExternalLink, Database, Key, Globe, BookOpen } from 'lucide-react'

const sql = `-- Run this in Supabase SQL Editor
create table if not exists manga (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text,
  genre text,
  description text,
  pdf_url text not null,
  cover_url text,
  views integer default 0,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table manga enable row level security;

-- Anyone can read manga
create policy "Public read" on manga
  for select using (true);

-- Signed-in users can insert their own
create policy "Auth insert" on manga
  for insert with check (auth.uid() = uploaded_by);

-- Users can delete only their own
create policy "Auth delete" on manga
  for delete using (auth.uid() = uploaded_by);

-- Users can update only their own (for view counts use service key or bypass RLS)
create policy "Auth update" on manga
  for update using (true);`

export default function SetupGuide() {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const steps = [
    {
      num: '01',
      icon: <Globe size={22} color="var(--blue-light)"/>,
      title: 'Create a Supabase Project',
      content: (
        <>
          <p style={{ color:'var(--white-dim)', lineHeight:1.7, marginBottom:12 }}>
            Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color:'var(--blue-light)' }}>supabase.com</a> and create a free account. Click "New Project", give it a name (e.g. <em>mangavaultx</em>), set a database password, and choose a region.
          </p>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" style={{
            display:'inline-flex', alignItems:'center', gap:6,
            background:'var(--black-4)', border:'1px solid var(--border-blue)',
            borderRadius:8, padding:'8px 16px', color:'var(--blue-light)', fontSize:13, fontWeight:600,
          }}>
            <ExternalLink size={13}/> Open Supabase Dashboard
          </a>
        </>
      ),
    },
    {
      num: '02',
      icon: <Database size={22} color="var(--blue-light)"/>,
      title: 'Run the Database SQL',
      content: (
        <>
          <p style={{ color:'var(--white-dim)', lineHeight:1.7, marginBottom:12 }}>
            In your Supabase project, go to <strong style={{ color:'var(--white)' }}>SQL Editor → New Query</strong>. Paste the SQL below and click <strong style={{ color:'var(--white)' }}>Run</strong>.
          </p>
          <div style={{ position:'relative' }}>
            <pre style={{
              background:'var(--black-4)', border:'1px solid var(--border)',
              borderRadius:10, padding:'16px', fontSize:12, color:'#a8e6cf',
              overflowX:'auto', lineHeight:1.6, margin:0,
            }}>{sql}</pre>
            <button onClick={copy} style={{
              position:'absolute', top:10, right:10,
              background:'var(--black-3)', border:'1px solid var(--border-blue)',
              borderRadius:7, padding:'6px 12px', color: copied ? '#22c55e' : 'var(--blue-light)',
              fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6,
            }}>
              {copied ? <><CheckCircle size={12}/> Copied!</> : <><Copy size={12}/> Copy SQL</>}
            </button>
          </div>
        </>
      ),
    },
    {
      num: '03',
      icon: <Key size={22} color="var(--blue-light)"/>,
      title: 'Get Your API Keys',
      content: (
        <>
          <p style={{ color:'var(--white-dim)', lineHeight:1.7, marginBottom:12 }}>
            In Supabase, go to <strong style={{ color:'var(--white)' }}>Project Settings → API</strong>. You need two values:
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
            {[
              ['VITE_SUPABASE_URL', 'Project URL — starts with https://'],
              ['VITE_SUPABASE_ANON_KEY', 'anon / public key — long JWT string'],
            ].map(([k, v]) => (
              <div key={k} style={{
                background:'var(--black-4)', border:'1px solid var(--border)',
                borderRadius:9, padding:'12px 14px',
              }}>
                <code style={{ color:'var(--red)', fontSize:13 }}>{k}</code>
                <span style={{ color:'var(--white-dim)', fontSize:13 }}> — {v}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      num: '04',
      icon: <BookOpen size={22} color="var(--blue-light)"/>,
      title: 'Add Keys to Vercel',
      content: (
        <>
          <p style={{ color:'var(--white-dim)', lineHeight:1.7, marginBottom:12 }}>
            In your Vercel project dashboard, go to <strong style={{ color:'var(--white)' }}>Settings → Environment Variables</strong>. Add both variables with your Supabase values, then <strong style={{ color:'var(--white)' }}>redeploy</strong> the project.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              'Go to vercel.com → your project',
              'Settings → Environment Variables',
              'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY',
              'Deployments → Redeploy latest',
            ].map((s, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, color:'var(--white-dim)', fontSize:14 }}>
                <CheckCircle size={14} color="var(--blue)"/> {s}
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      num: '05',
      icon: <Globe size={22} color="var(--blue-light)"/>,
      title: 'Host Your PDFs (Free)',
      content: (
        <>
          <p style={{ color:'var(--white-dim)', lineHeight:1.7, marginBottom:16 }}>
            MangaVaultX doesn't store files — you paste links. Here are the best free PDF hosts:
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
            {[
              ['Google Drive', 'Upload PDF → Share → Anyone with link → Copy link', 'Free 15GB'],
              ['Archive.org', 'archive.org/upload — Permanent, no limits, public domain friendly', 'Unlimited'],
              ['Dropbox', 'Upload → Share → Create link', 'Free 2GB'],
            ].map(([name, desc, badge]) => (
              <div key={name} style={{
                background:'var(--black-4)', border:'1px solid var(--border)',
                borderRadius:10, padding:'14px',
              }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <strong style={{ color:'var(--white)', fontSize:15 }}>{name}</strong>
                  <span style={{
                    background:'rgba(0,80,200,0.2)', color:'var(--blue-light)',
                    fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:12,
                  }}>{badge}</span>
                </div>
                <p style={{ color:'var(--white-dim)', fontSize:13, lineHeight:1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
  ]

  return (
    <div style={{ paddingTop:88, paddingBottom:80 }}>
      <div className="container" style={{ maxWidth:800 }}>
        <h1 style={{ fontFamily:'Bebas Neue', fontSize:42, letterSpacing:'0.08em', marginBottom:8 }}>
          SETUP <span style={{ color:'var(--red)' }}>GUIDE</span>
        </h1>
        <p style={{ color:'var(--white-dim)', marginBottom:48, fontSize:16, lineHeight:1.6 }}>
          Get MangaVaultX fully working in 10 minutes. Supabase is free forever for small projects.
        </p>

        <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              background:'var(--black-2)', border:'1px solid var(--border)',
              borderRadius:16, padding:'28px 28px',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
                <div style={{
                  fontFamily:'Bebas Neue', fontSize:32, color:'var(--red)',
                  lineHeight:1, minWidth:40,
                }}>{step.num}</div>
                {step.icon}
                <h2 style={{ fontFamily:'Bebas Neue', fontSize:22, letterSpacing:'0.06em' }}>{step.title}</h2>
              </div>
              {step.content}
            </div>
          ))}
        </div>

        <div style={{
          marginTop:48, textAlign:'center',
          background:'linear-gradient(90deg,rgba(220,30,60,0.1),rgba(0,80,200,0.14))',
          border:'1px solid var(--border-blue)', borderRadius:16, padding:'36px 24px',
        }}>
          <h2 style={{ fontFamily:'Bebas Neue', fontSize:30, marginBottom:10 }}>ALL DONE? START READING!</h2>
          <p style={{ color:'var(--white-dim)', marginBottom:24 }}>Your site is live. Add manga and share it with the world.</p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/upload" style={{
              background:'var(--red)', color:'var(--white)', fontFamily:'Bebas Neue',
              fontSize:18, letterSpacing:'0.1em', padding:'12px 32px', borderRadius:10,
            }}>ADD MANGA</Link>
            <Link to="/browse" style={{
              background:'transparent', color:'var(--blue-light)', fontFamily:'Bebas Neue',
              fontSize:18, letterSpacing:'0.1em', padding:'12px 32px', borderRadius:10,
              border:'1px solid var(--border-blue)',
            }}>BROWSE</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
