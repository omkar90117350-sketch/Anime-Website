import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, Link as LinkIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const GENRES = ['Action','Adventure','Comedy','Drama','Fantasy','Horror','Mystery','Romance','Sci-Fi','Slice of Life','Sports','Supernatural','Thriller','Other']

export default function Upload() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title:'', author:'', genre:'Action', description:'', pdf_url:'', cover_url:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!form.pdf_url.trim()) { setError('PDF link is required.'); return }
    if (!form.pdf_url.startsWith('http')) { setError('Please enter a valid URL starting with http.'); return }

    setLoading(true); setError('')
    const { error: err } = await supabase.from('manga').insert([{
      title: form.title.trim(),
      author: form.author.trim() || null,
      genre: form.genre,
      description: form.description.trim() || null,
      pdf_url: form.pdf_url.trim(),
      cover_url: form.cover_url.trim() || null,
      views: 0,
    }])
    setLoading(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    setTimeout(() => navigate('/browse'), 1800)
  }

  if (success) return (
    <div style={{ paddingTop:120, textAlign:'center', minHeight:'70vh' }}>
      <div className="container">
        <CheckCircle size={64} color="#22c55e" style={{ marginBottom:20 }}/>
        <h2 style={{ fontFamily:'Bebas Neue', fontSize:36, color:'#22c55e', marginBottom:8 }}>MANGA ADDED!</h2>
        <p style={{ color:'var(--white-dim)' }}>Redirecting to browse…</p>
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop:88, paddingBottom:80 }}>
      <div className="container" style={{ maxWidth:640 }}>
        <h1 style={{ fontFamily:'Bebas Neue', fontSize:42, letterSpacing:'0.08em', marginBottom:8 }}>
          ADD <span style={{ color:'var(--red)' }}>MANGA</span>
        </h1>
        <p style={{ color:'var(--white-dim)', marginBottom:36, lineHeight:1.6 }}>
          Host your PDF on <strong style={{ color:'var(--blue-light)' }}>Google Drive</strong>, <strong style={{ color:'var(--blue-light)' }}>Archive.org</strong> or any service — then paste the link below. Free, unlimited, forever.
        </p>

        <div style={{
          background:'var(--black-2)', border:'1px solid var(--border-blue)',
          borderRadius:16, padding:'36px 32px',
        }}>
          {error && (
            <div style={{
              background:'rgba(220,30,60,0.1)', border:'1px solid var(--red)',
              borderRadius:10, padding:'12px 16px', marginBottom:24,
              display:'flex', alignItems:'center', gap:10, color:'var(--red)', fontSize:14,
            }}>
              <AlertCircle size={16}/> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:'var(--blue-light)', letterSpacing:'0.08em', display:'block', marginBottom:8 }}>
                MANGA TITLE *
              </label>
              <input value={form.title} onChange={e=>set('title',e.target.value)}
                placeholder="e.g. Naruto Vol. 1" required style={inputStyle}/>
            </div>

            <div>
              <label style={labelStyle}>AUTHOR</label>
              <input value={form.author} onChange={e=>set('author',e.target.value)}
                placeholder="e.g. Masashi Kishimoto" style={inputStyle}/>
            </div>

            <div>
              <label style={labelStyle}>GENRE</label>
              <select value={form.genre} onChange={e=>set('genre',e.target.value)} style={inputStyle}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>DESCRIPTION</label>
              <textarea value={form.description} onChange={e=>set('description',e.target.value)}
                placeholder="Brief summary of the manga…" rows={3}
                style={{ ...inputStyle, resize:'vertical', lineHeight:1.6 }}/>
            </div>

            <div>
              <label style={{ fontSize:13, fontWeight:700, color:'var(--red)', letterSpacing:'0.08em', display:'block', marginBottom:8 }}>
                PDF LINK * <span style={{ color:'var(--white-dim)', fontWeight:400, textTransform:'none', letterSpacing:0 }}>(Google Drive, Archive.org, Dropbox…)</span>
              </label>
              <div style={{ position:'relative' }}>
                <LinkIcon size={16} color="var(--blue-light)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}/>
                <input value={form.pdf_url} onChange={e=>set('pdf_url',e.target.value)}
                  placeholder="https://drive.google.com/file/d/..." required
                  style={{ ...inputStyle, paddingLeft:42 }}/>
              </div>
              <p style={{ color:'var(--white-dim)', fontSize:12, marginTop:6, lineHeight:1.5 }}>
                For Google Drive: File → Share → "Anyone with the link" → Copy link
              </p>
            </div>

            <div>
              <label style={labelStyle}>COVER IMAGE URL <span style={{ color:'var(--white-dim)', fontWeight:400, textTransform:'none', letterSpacing:0 }}>(optional)</span></label>
              <input value={form.cover_url} onChange={e=>set('cover_url',e.target.value)}
                placeholder="https://…/cover.jpg" style={inputStyle}/>
            </div>

            <button type="submit" disabled={loading} style={{
              background: loading ? 'var(--black-4)' : 'var(--red)',
              color:'var(--white)', fontFamily:'Bebas Neue', fontSize:22, letterSpacing:'0.12em',
              padding:'16px', borderRadius:10, marginTop:4, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 24px var(--red-glow)',
              display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'all 0.2s',
            }}>
              <UploadIcon size={20}/>
              {loading ? 'ADDING MANGA…' : 'ADD MANGA TO VAULTX'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width:'100%', background:'var(--black-3)', border:'1px solid var(--border)',
  borderRadius:10, padding:'12px 14px', color:'var(--white)', fontSize:15,
  outline:'none', fontFamily:'inherit', boxSizing:'border-box',
}
const labelStyle = {
  fontSize:13, fontWeight:700, color:'var(--blue-light)',
  letterSpacing:'0.08em', display:'block', marginBottom:8,
}
