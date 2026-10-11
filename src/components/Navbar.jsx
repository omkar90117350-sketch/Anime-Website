import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, BookOpen, Search } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const links = [['/', 'Home'], ['/browse', 'Browse'], ['/upload', 'Upload'], ['/setup', 'Setup']]

  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? 'rgba(10,10,15,0.97)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border-blue)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition:'all 0.3s ease',
    }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:68 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <BookOpen size={26} color="var(--red)"/>
          <span style={{ fontFamily:'Bebas Neue', fontSize:26, letterSpacing:'0.08em' }}>
            Manga<span style={{ color:'var(--red)' }}>Vault</span>
            <span style={{ color:'var(--blue)', textShadow:'0 0 12px var(--blue-glow)' }}>X</span>
          </span>
        </Link>

        <nav style={{ display:'flex', alignItems:'center', gap:28 }} className="desktop-nav">
          {links.map(([to, label]) => (
            <Link key={to} to={to} style={{
              fontWeight:600, fontSize:16, letterSpacing:'0.06em',
              color: location.pathname===to ? 'var(--red)' : 'var(--white-dim)',
              borderBottom: location.pathname===to ? '2px solid var(--red)' : '2px solid transparent',
              paddingBottom:2, transition:'color 0.2s',
            }}>{label}</Link>
          ))}
          <Link to="/browse" style={{
            display:'flex', alignItems:'center', gap:6,
            background:'var(--black-3)', border:'1px solid var(--border-blue)',
            borderRadius:8, padding:'6px 14px', color:'var(--white-dim)', fontSize:14,
          }}><Search size={14}/> Search</Link>
        </nav>

        <button onClick={()=>setOpen(!open)}
          style={{ display:'none', background:'none', color:'var(--white)', padding:6 }}
          className="hamburger">
          {open ? <X size={26}/> : <Menu size={26}/>}
        </button>
      </div>

      {open && (
        <div style={{ background:'var(--black-2)', borderTop:'1px solid var(--border)', padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
          {links.map(([to, label]) => (
            <Link key={to} to={to} style={{ fontSize:22, fontFamily:'Bebas Neue', letterSpacing:'0.08em', color: location.pathname===to ? 'var(--red)' : 'var(--white)' }}>{label}</Link>
          ))}
        </div>
      )}
      <style>{`@media(max-width:768px){.desktop-nav{display:none!important;}.hamburger{display:block!important;}}`}</style>
    </header>
  )
}
