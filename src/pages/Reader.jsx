import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Eye, User, Tag, ExternalLink, BookOpen, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Spinner from '../components/Spinner'

export default function Reader() {
  const { id } = useParams()
  const [manga, setManga] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [iframeError, setIframeError] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error: err } = await supabase.from('manga').select('*').eq('id', id).single()
      if (err || !data) { setError('Manga not found.'); setLoading(false); return }
      setManga(data)
      setLoading(false)
      // Increment view counter
      await supabase.from('manga').update({ views: (data.views || 0) + 1 }).eq('id', id)
    }
    load()
  }, [id])

  if (loading) return (
    <div style={{ paddingTop:120, textAlign:'center', minHeight:'70vh' }}>
      <Spinner size={52}/>
      <p style={{ color:'var(--white-dim)', marginTop:20 }}>Loading manga…</p>
    </div>
  )

  if (error) return (
    <div style={{ paddingTop:120, textAlign:'center', minHeight:'70vh' }}>
      <div className="container">
        <AlertCircle size={56} color="var(--red)" style={{ marginBottom:16 }}/>
        <h2 style={{ fontFamily:'Bebas Neue', fontSize:32, marginBottom:12 }}>NOT FOUND</h2>
        <p style={{ color:'var(--white-dim)', marginBottom:24 }}>{error}</p>
        <Link to="/browse" style={{ color:'var(--blue-light)', fontWeight:700 }}>← Back to Browse</Link>
      </div>
    </div>
  )

  // Convert Google Drive share link to direct embed link
  function getEmbedUrl(url) {
    if (!url) return ''
    // Google Drive: /file/d/FILE_ID/view → /file/d/FILE_ID/preview
    const gdMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
    if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`
    // Archive.org: already embeddable
    if (url.includes('archive.org')) return url
    // Direct PDF URL: use Google PDF viewer as fallback for CORS
    if (url.endsWith('.pdf') || url.includes('.pdf?')) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    }
    return url
  }

  const embedUrl = getEmbedUrl(manga.pdf_url)

  return (
    <div style={{ paddingTop:68, minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      {/* Header bar */}
      <div style={{
        background:'var(--black-2)', borderBottom:'1px solid var(--border-blue)',
        padding:'14px 0', position:'sticky', top:68, zIndex:100,
      }}>
        <div className="container" style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
          <Link to="/browse" style={{
            display:'flex', alignItems:'center', gap:8, color:'var(--white-dim)',
            fontSize:14, fontWeight:600, flexShrink:0,
          }}>
            <ArrowLeft size={16}/> Back
          </Link>
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{
              fontFamily:'Bebas Neue', fontSize:24, letterSpacing:'0.06em',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>{manga.title}</h1>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginTop:2 }}>
              {manga.author && (
                <span style={{ color:'var(--blue-light)', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                  <User size={11}/> {manga.author}
                </span>
              )}
              {manga.genre && (
                <span style={{ color:'var(--white-dim)', fontSize:12, display:'flex', alignItems:'center', gap:4 }}>
                  <Tag size={11}/> {manga.genre}
                </span>
              )}
              <span style={{ color:'var(--white-dim)', fontSize:12, display:'flex', alignItems:'center', gap:4 }}>
                <Eye size={11}/> {((manga.views||0)+1).toLocaleString()} reads
              </span>
            </div>
          </div>
          <a href={manga.pdf_url} target="_blank" rel="noopener noreferrer" style={{
            display:'flex', alignItems:'center', gap:6,
            background:'var(--black-3)', border:'1px solid var(--border)',
            borderRadius:8, padding:'8px 14px', color:'var(--blue-light)', fontSize:13, fontWeight:600,
            flexShrink:0,
          }}>
            <ExternalLink size={14}/> Open Original
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <div style={{ flex:1, background:'#1a1a1a', position:'relative' }}>
        {iframeError ? (
          <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--white-dim)' }}>
            <BookOpen size={56} color="var(--border)" style={{ marginBottom:20 }}/>
            <h3 style={{ fontFamily:'Bebas Neue', fontSize:28, marginBottom:12 }}>VIEWER UNAVAILABLE</h3>
            <p style={{ marginBottom:8 }}>This PDF cannot be displayed inline due to the hosting provider's settings.</p>
            <p style={{ fontSize:14, marginBottom:28 }}>Try opening it directly:</p>
            <a href={manga.pdf_url} target="_blank" rel="noopener noreferrer" style={{
              background:'var(--red)', color:'var(--white)', fontWeight:700,
              padding:'12px 28px', borderRadius:10, display:'inline-flex', alignItems:'center', gap:8,
            }}>
              <ExternalLink size={16}/> Open PDF in New Tab
            </a>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title={manga.title}
            style={{ width:'100%', height:'calc(100vh - 140px)', border:'none', display:'block' }}
            onError={() => setIframeError(true)}
            allow="fullscreen"
          />
        )}
      </div>

      {/* Description */}
      {manga.description && (
        <div style={{ background:'var(--black-2)', borderTop:'1px solid var(--border)', padding:'24px 0' }}>
          <div className="container">
            <h3 style={{ fontFamily:'Bebas Neue', fontSize:20, letterSpacing:'0.06em', marginBottom:10, color:'var(--blue-light)' }}>
              ABOUT THIS MANGA
            </h3>
            <p style={{ color:'var(--white-dim)', fontSize:15, lineHeight:1.8, maxWidth:720 }}>{manga.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
