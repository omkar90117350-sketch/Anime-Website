import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Upload from './pages/Upload'
import Reader from './pages/Reader'
import SetupGuide from './pages/SetupGuide'

export default function App() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <main style={{ flex:1 }}>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/browse"   element={<Browse />} />
          <Route path="/upload"   element={<Upload />} />
          <Route path="/read/:id" element={<Reader />} />
          <Route path="/setup"    element={<SetupGuide />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
