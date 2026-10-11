import React, { useEffect, useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import MangaCard from '../components/MangaCard'
import Spinner from '../components/Spinner'

const GENRES = ['All','Action','Adventure','Comedy','Drama','Fantasy','Horror','Mystery','Romance','Sci-Fi','Slice of Life','Sports','Supernatural','Thriller']

export default function Browse() {
  const [manga, setManga] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('All')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    async function load() {
      setLoading(true)
      let q = supabase.from('manga').select('*')
      if (genre !== 'All') q = q.eq('genre', genre)
      if (sort === 'newest') q = q.order('created_at', { ascending: false })
      else if (sort === 'popular') q = q.order('views', { ascending: false })
      else if (sort === 'title') q = q.order('title', { ascending: true })
      const { data } = await q
      setManga(data || [])
      setLoading(false)
    }
    load()
  }, [genre, sort])

  const filtered = query
    ? manga.filter(m =>
        m.title?.toLowerCase().includes(query.toLowerCase()) ||
        m.author?.toLowerCase().includes(query.toLowerCase()) ||
        m.description?.toLowerCase().includes(query.toLowerCase())
      )
    : manga

  return (
    <div style={{ paddingTop:88, paddingBottom:80 }}>
      <div className="container">
        <h1 style={{ fontFamily:'Bebas Neue', fontSize:42, letterSpacing:'0.08em', marginBottom:8 }}>
          BROWSE <span style={{ color:'var(--red)' }}>MANGA</span>
        </h1>
        <p style={{ color:'var(--white-dim)', marginBottom:36 }}>
          {manga.length} title{manga.length !== 1 ? 's' : ''} available — all free to read
        </p>

        {/* Filters */}
        <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:32 }}>
          {/* Search */}
          <div style={{
            display:'flex', alignItems:'center', gap:10,
            background:'var(--black-2)', border:'1px solid var(--border-blue)',
            borderRadius:10, padding:'10px 16px', flex:'1 1 260px',
          }}>
            <Search size={16} color="var(--blue-light)"/>
            <input value={query} onChange={e=>setQuery(e.target.value)}
              placeholder="Search by title, author…"
              style={{ background:'none', border:'none', outline:'none', color:'var(--white)', fontSize:15, flex:1 }}
            />
            {query && <button onClick={()=>setQuery('')} style={{ background:'none', color:'var(--white-dim)' }}><X size={14}/></button>}
          </div>

          {/* Sort */}
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{
            background:'var(--black-2)', border:'1px solid var(--border)', borderRadius:10,
            color:'var(--white)', padding:'10px 16px', fontSize:14, cursor:'pointer',
          }}>
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="title">A → Z</option>
          </select>
        </div>

        {/* Genre pills */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:36 }}>
          {GENRES.map(g => (
            <button key={g} onClick={()=>setGenre(g)} style={{
              padding:'6px 16px', borderRadius:20, fontSize:13, fontWeight:600,
              cursor:'pointer', transition:'all 0.2s',
              background: genre===g ? 'var(--red)' : 'var(--black-3)',
              color: genre===g ? 'var(--white)' : 'var(--white-dim)',
              border: genre===g ? '1px solid var(--red)' : '1px solid var(--border)',
              boxShadow: genre===g ? '0 0 12px var(--red-glow)' : 'none',
            }}>{g}</button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ padding:'60px 0' }}><Spinner/></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'var(--white-dim)' }}>
            <Filter size={48} color="var(--border)" style={{ marginBottom:16 }}/>
            <p style={{ fontSize:18, marginBottom:8 }}>No manga found</p>
            <p style={{ fontSize:14 }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p style={{ color:'var(--white-dim)', fontSize:14, marginBottom:20 }}>
              Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {query && <> for "<span style={{ color:'var(--blue-light)' }}>{query}</span>"</>}
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:20 }}>
              {filtered.map(m => <MangaCard key={m.id} manga={m}/>)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
