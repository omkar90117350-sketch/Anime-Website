import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BookOpen, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setInfo('')
    if (!email || !password) { setError('Email and password are required.'); return }
    if (mode === 'signup' && password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    let err
    if (mode === 'signin') {
      ({ error: err } = await signIn(email, password))
      if (!err) { navigate('/'); return }
    } else {
      ({ error: err } = await signUp(email, password, username))
      if (!err) {
        setInfo('Account created! Check your email to confirm, then sign in.')
        setMode('signin'); setLoading(false); return
      }
    }
    setError(err?.message || 'Something went wrong.')
    setLoading(false)
  }

  return (
    <div style={{
      paddingTop:68, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(0,80,200,0.14) 0%, transparent 70%), var(--black)',
    }}>
      <div className="container" style={{ maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <BookOpen size={30} color="var(--red)"/>
            <span style={{ fontFamily:'Bebas Neue', fontSize:30 }}>
              Manga<span style={{ color:'var(--red)' }}>Vault</span><span style={{ color:'var(--blue)' }}>X</span>
            </span>
          </Link>
          <h1 style={{ fontFamily:'Bebas Neue', fontSize:36, letterSpacing:'0.08em' }}>
            {mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h1>
          <p style={{ color:'var(--white-dim)', fontSize:14 }}>
            {mode === 'signin' ? 'Welcome back, legend.' : 'Join the vault. Read everything.'}
          </p>
        </div>

        <div style={{
          background:'var(--black-2)', border:'1px solid var(--border-blue)',
          borderRadius:18, padding:'36px 32px',
        }}>
          {/* Mode toggle */}
          <div style={{ display:'flex', background:'var(--black-3)', borderRadius:10, padding:4, marginBottom:28 }}>
            {[['signin','Sign In'],['signup','Register']].map(([m, label]) => (
              <button key={m} onClick={()=>{ setMode(m); setError(''); setInfo('') }} style={{
                flex:1, padding:'9px', borderRadius:8, fontSize:15, fontWeight:700,
                cursor:'pointer', transition:'all 0.2s',
                background: mode===m ? 'var(--red)' : 'transparent',
                color: mode===m ? 'var(--white)' : 'var(--white-dim)',
                boxShadow: mode===m ? '0 0 12px var(--red-glow)' : 'none',
              }}>{label}</button>
            ))}
          </div>

          {error && (
            <div style={{
              background:'rgba(220,30,60,0.1)', border:'1px solid rgba(220,30,60,0.4)',
              borderRadius:10, padding:'12px 14px', marginBottom:20,
              display:'flex', alignItems:'center', gap:10, color:'#ff6b6b', fontSize:14,
            }}>
              <AlertCircle size={15}/> {error}
            </div>
          )}
          {info && (
            <div style={{
              background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.4)',
              borderRadius:10, padding:'12px 14px', marginBottom:20,
              color:'#22c55e', fontSize:14,
            }}>
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {mode === 'signup' && (
              <div>
                <label style={labelStyle}>USERNAME</label>
                <input value={username} onChange={e=>setUsername(e.target.value)}
                  placeholder="your_handle" style={inputStyle}/>
              </div>
            )}
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@example.com" required style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>PASSWORD</label>
              <div style={{ position:'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••" required style={{ ...inputStyle, paddingRight:44 }}/>
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{
                  position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'none', color:'var(--white-dim)',
                }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              background: loading ? 'var(--black-4)' : 'var(--red)',
              color:'var(--white)', fontFamily:'Bebas Neue', fontSize:20, letterSpacing:'0.1em',
              padding:'14px', borderRadius:10, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 20px var(--red-glow)',
              marginTop:4, transition:'all 0.2s',
            }}>
              {loading ? '…' : mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', color:'var(--white-dim)', fontSize:13, marginTop:20 }}>
          By signing in you agree to use MangaVaultX for legal purposes only.
        </p>
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
  fontSize:12, fontWeight:700, color:'var(--blue-light)',
  letterSpacing:'0.1em', display:'block', marginBottom:8,
}
