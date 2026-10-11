import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, TrendingUp, Star, ArrowRight, Users, Eye } from 'lucide-react'
import { supabase } from '../lib/supabase'
import MangaCard from '../components/MangaCard'
import Spinner from '../components/Spinner'

export default function Home() {
  const [recent, setRecent] = useState([])
  const [popular, setPopular] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, views: 0 })

  useEffect(() => {
    async function load() {
      const [{ data: rec }, { data: pop }, { data: all }] = await Promise.all([
        supabase.from('manga').select('*').order('created_at', { ascending: false }).limit(8),
        supabase.from('manga').select('*').order('views', { ascending: false }).limit(8),
        supabase.from('manga').select('views'),
      ])
      setRecent(rec || [])
      setPopular(pop || [])
      const totalViews = (all || []).reduce((s, m) => s + (m.views || 0), 0)
      setStats({ total: (all || []).length, views: totalViews })
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ paddingTop:68 }}>
      {/* Hero */}
      <section style={{
        minHeight:'88vh', display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative', overflow:'hidden',
        background:'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,80,200,0.18) 0%, transparent 70%), var(--black)',
      }}>
        {/* Animated bg lines */}
        <div style={{ position:'absolute', inset:0, opacity:0.04 }}>
          {[...Array(12)].map((_,i)=>(
            <div key={i} style={{
              position:'absolute', left:`${(i*8.5)%100}%`, top:0, bottom:0,
              width:1, background:'var(--blue-light)',
            }}/>
          ))}
        </div>

        <div className="container" style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(220,30,60,0.12)', border:'1px solid rgba(220,30,60,0.3)',
            borderRadius:30, padding:'6px 18px', fontSize:13, fontWeight:700,
            color:'var(--red)', letterSpacing:'0.1em', marginBottom:28,
            animation:'fadeInUp 0.5s ease',
          }}>
            <Star size={13} fill="var(--red)"/> FREE MANGA PDF HOSTING
          </div>

          <h1 style={{
            fontFamily:'Bebas Neue', fontSize:'clamp(52px,10vw,110px)',
            letterSpacing:'0.04em', lineHeight:0.95, marginBottom:24,
            animation:'fadeInUp 0.6s ease 0.1s both',
          }}>
            MANGA<span style={{ color:'var(--red)', textShadow:'0 0 40px var(--red-glow)' }}>VAULT</span>
            <span style={{ color:'var(--blue)', textShadow:'0 0 40px var(--blue-glow)' }}>X</span>
          </h1>

          <p style={{
            fontSize:'clamp(16px,3vw,22px)', color:'var(--white-dim)', maxWidth:560, margin:'0 auto 36px',
            lineHeight:1.6, animation:'fadeInUp 0.6s ease 0.2s both',
          }}>
            Where Legends Are Read.<br/>
            <span style={{ color:'var(--blue-light)', fontWeight:600 }}>Zero cost. Zero limits. Forever free.</span>
          </p>

          <div style={{
            display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap',
            animation:'fadeInUp 0.6s ease 0.3s both',
          }}>
            <Link to="/browse" style={{
              background:'var(--red)', color:'var(--white)',
              fontFamily:'Bebas Neue', fontSize:20, letterSpacing:'0.12em',
              padding:'14px 40px', borderRadius:10,
              boxShadow:'0 0 32px var(--red-glow)',
              display:'flex', alignItems:'center', gap:10,
            }}>
              <BookOpen size={20}/> START READING
            </Link>
            <Link to="/upload" style={{
              background:'transparent', color:'var(--blue-light)',
              fontFamily:'Bebas Neue', fontSize:20, letterSpacing:'0.12em',
              padding:'14px 40px', borderRadius:10,
              border:'1px solid var(--border-blue)',
              display:'flex', alignItems:'center', gap:10,
            }}>
              ADD MANGA <ArrowRight size={18}/>
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display:'flex', gap:40, justifyContent:'center', marginTop:56, flexWrap:'wrap',
            animation:'fadeInUp 0.6s ease 0.4s both',
          }}>
            {[
              [<BookOpen size={18}/>, stats.total, 'Manga Titles'],
              [<Eye size={18}/>, stats.views, 'Total Reads'],
              [<Users size={18}/>, 'Free', 'Always'],
            ].map(([icon, val, label], i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ color:'var(--blue-light)', display:'flex', alignItems:'center', gap:6, justifyContent:'center', fontSize:13, marginBottom:4 }}>
                  {icon} {label}
                </div>
                <div style={{ fontFamily:'Bebas Neue', fontSize:34, color:'var(--white)', letterSpacing:'0.05em' }}>
                  {typeof val === 'number' ? val.toLocaleString() : val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular */}
      {popular.length > 0 && (
        <section style={{ padding:'72px 0 0' }}>
          <div className="container">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
              <h2 style={{ fontFamily:'Bebas Neue', fontSize:32, letterSpacing:'0.08em', display:'flex', alignItems:'center', gap:10 }}>
                <TrendingUp size={26} color="var(--red)"/> MOST POPULAR
              </h2>
              <Link to="/browse" style={{ color:'var(--blue-light)', fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                View All <ArrowRight size={14}/>
              </Link>
            </div>
            {loading ? <Spinner/> : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:20 }}>
                {popular.map(m => <MangaCard key={m.id} manga={m} onDeleted={id=>setPopular(prev=>prev.filter(x=>x.id!==id))}/>)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recently Added */}
      <section style={{ padding:'72px 0 80px' }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
            <h2 style={{ fontFamily:'Bebas Neue', fontSize:32, letterSpacing:'0.08em', display:'flex', alignItems:'center', gap:10 }}>
              <Star size={26} color="var(--blue)"/> RECENTLY ADDED
            </h2>
            <Link to="/browse" style={{ color:'var(--blue-light)', fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
              View All <ArrowRight size={14}/>
            </Link>
          </div>
          {loading ? <Spinner/> : recent.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--white-dim)' }}>
              <BookOpen size={48} color="var(--border)" style={{ marginBottom:16 }}/>
              <p style={{ fontSize:18, marginBottom:8 }}>No manga yet.</p>
              <Link to="/upload" style={{ color:'var(--red)', fontWeight:700 }}>Be the first to add one →</Link>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:20 }}>
              {recent.map(m => <MangaCard key={m.id} manga={m} onDeleted={id=>setRecent(prev=>prev.filter(x=>x.id!==id))}/>)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background:'linear-gradient(90deg, rgba(220,30,60,0.12), rgba(0,80,200,0.18))',
        border:'1px solid var(--border-blue)', margin:'0 auto 80px',
        borderRadius:20, padding:'48px 32px', textAlign:'center', maxWidth:760,
        marginLeft:'auto', marginRight:'auto',
      }}>
        <div className="container">
          <h2 style={{ fontFamily:'Bebas Neue', fontSize:38, letterSpacing:'0.08em', marginBottom:12 }}>
            SHARE YOUR <span style={{ color:'var(--red)' }}>MANGA</span> COLLECTION
          </h2>
          <p style={{ color:'var(--white-dim)', fontSize:16, marginBottom:28, lineHeight:1.6 }}>
            Host on Google Drive, Archive.org or any free service — just paste the link.<br/>
            No file uploads. No storage costs. No limits.
          </p>
          <Link to="/upload" style={{
            background:'var(--red)', color:'var(--white)',
            fontFamily:'Bebas Neue', fontSize:20, letterSpacing:'0.12em',
            padding:'14px 40px', borderRadius:10,
            boxShadow:'0 0 24px var(--red-glow)',
            display:'inline-flex', alignItems:'center', gap:10,
          }}>
            ADD MANGA NOW <ArrowRight size={18}/>
          </Link>
        </div>
      </section>
    </div>
  )
}
