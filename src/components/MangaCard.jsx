import React from 'react'
import { Link } from 'react-router-dom'
import { Eye, BookOpen } from 'lucide-react'

export default function MangaCard({ manga }) {
  const { id, title, author, genre, cover_url, views, description } = manga

  return (
    <Link to={`/read/${id}`} style={{ textDecoration:'none', display:'block' }}>
      <div style={{
        background:'var(--black-2)', border:'1px solid var(--border)',
        borderRadius:14, overflow:'hidden', transition:'all 0.25s ease',
        cursor:'pointer',
      }}
        onMouseEnter={e=>{
          e.currentTarget.style.border='1px solid var(--border-blue)'
          e.currentTarget.style.transform='translateY(-4px)'
          e.currentTarget.style.boxShadow='0 12px 40px rgba(0,80,200,0.18)'
        }}
        onMouseLeave={e=>{
          e.currentTarget.style.border='1px solid var(--border)'
          e.currentTarget.style.transform='translateY(0)'
          e.currentTarget.style.boxShadow='none'
        }}
      >
        {/* Cover */}
        <div style={{ position:'relative', paddingTop:'140%', background:'var(--black-3)', overflow:'hidden' }}>
          {cover_url ? (
            <img src={cover_url} alt={title}
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
              onError={e=>{ e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
            />
          ) : null}
          <div style={{
            position:'absolute', inset:0,
            display: cover_url ? 'none' : 'flex',
            alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10,
            background:'linear-gradient(135deg,var(--black-3),var(--black-4))',
          }}>
            <BookOpen size={48} color="var(--border-blue)"/>
            <span style={{ color:'var(--white-dim)', fontSize:13, textAlign:'center', padding:'0 10px' }}>{title}</span>
          </div>
          {/* Genre badge */}
          {genre && (
            <div style={{
              position:'absolute', top:10, left:10,
              background:'rgba(220,30,60,0.85)', color:'var(--white)',
              fontSize:11, fontWeight:700, letterSpacing:'0.06em',
              padding:'3px 10px', borderRadius:20, backdropFilter:'blur(4px)',
            }}>{genre.toUpperCase()}</div>
          )}
          {/* Views overlay */}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0,
            background:'linear-gradient(transparent, rgba(0,0,0,0.85))',
            padding:'20px 10px 10px',
            display:'flex', alignItems:'center', gap:5,
            color:'var(--white-dim)', fontSize:12,
          }}>
            <Eye size={12}/> {(views||0).toLocaleString()} reads
          </div>
        </div>

        {/* Info */}
        <div style={{ padding:'14px 14px 16px' }}>
          <h3 style={{
            fontSize:15, fontFamily:'Bebas Neue', letterSpacing:'0.05em',
            color:'var(--white)', marginBottom:4,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{title}</h3>
          {author && <p style={{ color:'var(--blue-light)', fontSize:12, fontWeight:600, marginBottom:4 }}>{author}</p>}
          {description && (
            <p style={{
              color:'var(--white-dim)', fontSize:12, lineHeight:1.5,
              display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
            }}>{description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
