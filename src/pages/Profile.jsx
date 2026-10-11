import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, BookOpen, Eye, Trash2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import Spinner from '../components/Spinner'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [manga, setManga] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    loadManga()
  }, [user])

  async function loadManga() {
    setLoading(true)
    const { data } = await supabase.from('manga').select('*')
      .eq('uploaded_by', user.id).order('created_at', { ascending: false })
    setManga(data || [])
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this manga? This cannot be undone.')) return
    setDeleting(id)
    await supabase.from('manga').delete().eq('id', id)
    setManga(prev => prev.filter(m => m.id !== id))
    setDeleting(null)
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  if (!user) return null

  const totalViews = manga.reduce((s, m) => s + (m.views || 0), 0)

  return (
    <div style={{ paddingTop:88, paddingBottom:80 }}>
      <div className="container" style={{ maxWidth:760 }}>
        {/* Profile Header */}
        <div style={{
          background:'var(--black-2)', border:'1px solid var(--border-blue)',
          borderRadius:18, padding:'36px 32px', marginBottom:36, display:'flex', alignItems:'center', gap:24, flexWrap:'wrap',
        }}>
          <div style={{
            width:80, height:80, borderRadius:'50%',
            background:'linear-gradient(135deg,var(--red),var(--blue))',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <User size={38} color="var(--white)"/>
          </div>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'Bebas Neue', fontSize:32, letterSpacing:'0.08em', marginBottom:4 }}>
              {user.user_metadata?.username || user.email?.split('@')[0]}
            </h1>
            <p style={{ color:'var(--white-dim)', fontSize:14, marginBottom:12 }}>{user.email}</p>
            <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
              {[
                [<BookOpen size={14}/>, manga.length, 'Manga Added'],
                [<Eye size={14}/>, totalViews.toLocaleString(), 'Total Reads'],
              ].map(([icon, val, label], i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6, color:'var(--white-dim)', fontSize:14 }}>
                  <span style={{ color:'var(--blue-light)' }}>{icon}</span>
                  <strong style={{ color:'var(--white)' }}>{val}</strong> {label}
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleSignOut} style={{
            background:'var(--black-3)', border:'1px solid var(--border)',
            color:'var(--red)', fontWeight:700, fontSize:14, padding:'10px 20px', borderRadius:10,
          }}>
            Sign Out
          </button>
        </div>

        {/* Manga List */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <h2 style={{ fontFamily:'Bebas Neue', fontSize:26, letterSpacing:'0.08em' }}>
            MY <span style={{ color:'var(--red)' }}>UPLOADS</span>
          </h2>
          <Link to="/upload" style={{
            background:'var(--red)', color:'var(--white)', fontWeight:700,
            fontSize:14, padding:'9px 20px', borderRadius:9,
          }}>+ Add More</Link>
        </div>

        {loading ? <Spinner/> : manga.length === 0 ? (
          <div style={{
            textAlign:'center', padding:'60px 20px',
            background:'var(--black-2)', border:'1px solid var(--border)', borderRadius:14,
            color:'var(--white-dim)',
          }}>
            <BookOpen size={48} color="var(--border)" style={{ marginBottom:16 }}/>
            <p style={{ fontSize:16, marginBottom:8 }}>No manga uploaded yet.</p>
            <Link to="/upload" style={{ color:'var(--red)', fontWeight:700 }}>Add your first manga →</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {manga.map(m => (
              <div key={m.id} style={{
                background:'var(--black-2)', border:'1px solid var(--border)',
                borderRadius:14, padding:'18px 20px',
                display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
              }}>
                {m.cover_url ? (
                  <img src={m.cover_url} alt={m.title}
                    style={{ width:52, height:72, objectFit:'cover', borderRadius:8, flexShrink:0 }}
                    onError={e=>e.target.style.display='none'}
                  />
                ) : (
                  <div style={{
                    width:52, height:72, background:'var(--black-3)', borderRadius:8,
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}>
                    <BookOpen size={20} color="var(--border)"/>
                  </div>
                )}
                <div style={{ flex:1, minWidth:0 }}>
                  <h3 style={{
                    fontFamily:'Bebas Neue', fontSize:18, letterSpacing:'0.05em',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  }}>{m.title}</h3>
                  <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginTop:4 }}>
                    {m.author && <span style={{ color:'var(--blue-light)', fontSize:13 }}>{m.author}</span>}
                    {m.genre && <span style={{ color:'var(--white-dim)', fontSize:13 }}>{m.genre}</span>}
                    <span style={{ color:'var(--white-dim)', fontSize:13, display:'flex', alignItems:'center', gap:4 }}>
                      <Eye size={12}/> {(m.views||0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:10, flexShrink:0 }}>
                  <Link to={`/read/${m.id}`} style={{
                    background:'var(--black-3)', border:'1px solid var(--border-blue)',
                    color:'var(--blue-light)', fontWeight:700, fontSize:13,
                    padding:'8px 16px', borderRadius:9,
                  }}>Read</Link>
                  <button onClick={()=>handleDelete(m.id)} disabled={deleting===m.id} style={{
                    background:'rgba(220,30,60,0.1)', border:'1px solid rgba(220,30,60,0.3)',
                    color:'var(--red)', padding:'8px 12px', borderRadius:9, cursor:'pointer',
                  }}>
                    {deleting===m.id ? '…' : <Trash2 size={15}/>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
