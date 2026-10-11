import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, BookOpen, Trash2, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'

const DELETE_PASSWORD = 'MangaVaultX@2026!'

export default function MangaCard({ manga, onDeleted }) {
  const { id, title, author, genre, cover_url, views, description } = manga
  const [deleting, setDeleting] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)

  function handleDeleteClick(e) {
    e.preventDefault()
    e.stopPropagation()
    setShowPrompt(true)
    setPwInput('')
    setPwError(false)
  }

  async function confirmDelete(e) {
    e.stopPropagation()
    if (pwInput !== DELETE_PASSWORD) {
      setPwError(true)
      return
    }
    setShowPrompt(false)
    setDeleting(true)
    await supabase.from('manga').delete().eq('id', id)
    if (onDeleted) onDeleted(id)
  }

  function cancelDelete(e) {
    e.stopPropagation()
    setShowPrompt(false)
    setPwInput('')
    setPwError(false)
  }

  return (
    <div style={{ position:'relative' }}>
      <Link to={`/read/${id}`} style={{ textDecoration:'none', display:'block' }}>
        <div style={{
          background:'var(--black-2)', border:'1px solid var(--border)',
          borderRadius:14, overflow:'hidden', transition:'all 0.25s ease', cursor:'pointer',
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
            {genre && (
              <div style={{
                position:'absolute', top:10, left:10,
                background:'rgba(220,30,60,0.85)', color:'var(--white)',
                fontSize:11, fontWeight:700, letterSpacing:'0.06em',
                padding:'3px 10px', borderRadius:20,
              }}>{genre.toUpperCase()}</div>
            )}
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

      {/* Delete button */}
      <button onClick={handleDeleteClick} disabled={deleting} title="Delete manga"
        style={{
          position:'absolute', top:10, right:10,
          background:'rgba(0,0,0,0.7)', border:'1px solid rgba(220,30,60,0.4)',
          borderRadius:7, padding:'5px 7px', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          opacity: deleting ? 0.5 : 1, transition:'all 0.2s',
        }}
        onMouseEnter={e=>{ e.currentTarget.style.background='var(--red)'; e.currentTarget.style.borderColor='var(--red)' }}
        onMouseLeave={e=>{ e.currentTarget.style.background='rgba(0,0,0,0.7)'; e.currentTarget.style.borderColor='rgba(220,30,60,0.4)' }}
      >
        <Trash2 size={13} color="white"/>
      </button>

      {/* Password prompt overlay */}
      {showPrompt && (
        <div onClick={cancelDelete} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.75)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999,
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:'var(--black-2)', border:'1px solid var(--border-blue)',
            borderRadius:16, padding:'32px 28px', width:320, textAlign:'center',
          }}>
            <Lock size={32} color="var(--red)" style={{ marginBottom:12 }}/>
            <h3 style={{ fontFamily:'Bebas Neue', fontSize:22, marginBottom:6 }}>DELETE MANGA</h3>
            <p style={{ color:'var(--white-dim)', fontSize:13, marginBottom:20 }}>
              Enter the admin password to delete<br/>
              <strong style={{ color:'var(--white)' }}>"{title}"</strong>
            </p>
            <input
              type="password"
              value={pwInput}
              onChange={e=>{ setPwInput(e.target.value); setPwError(false) }}
              onKeyDown={e=>{ if(e.key==='Enter') confirmDelete(e) }}
              placeholder="Enter password…"
              autoFocus
              style={{
                width:'100%', boxSizing:'border-box',
                background:'var(--black-3)', border: pwError ? '1px solid var(--red)' : '1px solid var(--border)',
                borderRadius:9, padding:'11px 14px', color:'var(--white)', fontSize:15,
                outline:'none', marginBottom:6,
              }}
            />
            {pwError && <p style={{ color:'var(--red)', fontSize:12, marginBottom:10 }}>❌ Wrong password</p>}
            <div style={{ display:'flex', gap:10, marginTop:14 }}>
              <button onClick={cancelDelete} style={{
                flex:1, padding:'10px', borderRadius:9, fontSize:14, fontWeight:700,
                background:'var(--black-3)', border:'1px solid var(--border)', color:'var(--white-dim)', cursor:'pointer',
              }}>Cancel</button>
              <button onClick={confirmDelete} style={{
                flex:1, padding:'10px', borderRadius:9, fontSize:14, fontWeight:700,
                background:'var(--red)', color:'var(--white)', cursor:'pointer',
                boxShadow:'0 0 12px var(--red-glow)',
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
