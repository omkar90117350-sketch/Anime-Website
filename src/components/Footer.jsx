import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background:'var(--black-2)', borderTop:'1px solid var(--border-blue)', padding:'48px 0 28px' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:40, marginBottom:40 }}>
          <div>
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <BookOpen size={22} color="var(--red)"/>
              <span style={{ fontFamily:'Bebas Neue', fontSize:22 }}>
                Manga<span style={{ color:'var(--red)' }}>Vault</span><span style={{ color:'var(--blue)' }}>X</span>
              </span>
            </Link>
            <p style={{ color:'var(--white-dim)', fontSize:14, lineHeight:1.7 }}>Where Legends Are Read.<br/>Free manga PDF hosting, forever.</p>
          </div>
          <div>
            <h4 style={{ fontSize:18, marginBottom:16, color:'var(--blue-light)' }}>NAVIGATE</h4>
            {[['/', 'Home'], ['/browse', 'Browse'], ['/upload', 'Add Manga'], ['/setup', 'Setup Guide']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display:'block', color:'var(--white-dim)', fontSize:15, marginBottom:10 }}
                onMouseEnter={e=>e.target.style.color='var(--red)'}
                onMouseLeave={e=>e.target.style.color='var(--white-dim)'}
              >{label}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize:18, marginBottom:16, color:'var(--blue-light)' }}>FREE HOSTING</h4>
            <p style={{ color:'var(--white-dim)', fontSize:14, lineHeight:1.8 }}>
              PDFs hosted on Google Drive, Archive.org or any free service.<br/>No storage limits. No costs.
            </p>
          </div>
        </div>
        <div style={{ borderTop:'1px solid var(--border)', paddingTop:24, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--white-dim)', fontSize:14, gap:6 }}>
          <span>© 2026 MangaVaultX. Made with</span>
          <Heart size={14} fill="var(--red)" color="var(--red)"/>
          <span>for manga fans worldwide.</span>
        </div>
      </div>
    </footer>
  )
}
