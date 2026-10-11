import React from 'react'
export default function Spinner({ size = 40, color = 'var(--red)' }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      border:'3px solid var(--border)', borderTopColor:color,
      animation:'spin 0.7s linear infinite', margin:'0 auto',
    }}/>
  )
}
