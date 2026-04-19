'use client'

import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

export default function Home() {
  const [text, setText] = useState('')
  const fullText = 'MoneyLens'

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      setText(fullText.slice(0, i + 1))
      i++
      if (i === fullText.length) clearInterval(timer)
    }, 150)
    return () => clearInterval(timer)
  }, [])

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0A0E1A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '20px',
      paddingTop: '100px'
    }}>
      <Navbar />

      <div style={{
        width: '100px',
        height: '2px',
        backgroundColor: '#00C2FF',
        marginBottom: '40px',
        boxShadow: '0 0 20px #00C2FF'
      }} />

      <p style={{
        color: '#00C2FF',
        fontSize: '14px',
        letterSpacing: '6px',
        textTransform: 'uppercase',
        marginBottom: '16px'
      }}>
        ProTech College
      </p>

      <h1 style={{
        color: 'white',
        fontSize: '72px',
        fontWeight: '800',
        margin: '0 0 24px',
        letterSpacing: '-2px'
      }}>
        {text}
        <span style={{ color: '#00C2FF', animation: 'blink 1s infinite' }}>|</span>
      </h1>

      <p style={{
        color: '#8892A4',
        fontSize: '18px',
        textAlign: 'center',
        maxWidth: '500px',
        lineHeight: '1.6',
        marginBottom: '48px'
      }}>
        Your college tech club — events, projects, and people, all in one place.
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={{
          backgroundColor: '#00C2FF',
          color: '#0A0E1A',
          border: 'none',
          padding: '14px 32px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer'
        }}>Explore Events</button>

        <button style={{
          backgroundColor: 'transparent',
          color: '#00C2FF',
          border: '2px solid #00C2FF',
          padding: '14px 32px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer'
        }}>Join Now</button>
      </div>

      <div style={{
        display: 'flex',
        gap: '60px',
        marginTop: '80px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {[
          { num: '200+', label: 'Members' },
          { num: '50+', label: 'Events' },
          { num: '30+', label: 'Projects' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <p style={{ color: '#00C2FF', fontSize: '32px', fontWeight: '800', margin: 0 }}>{stat.num}</p>
            <p style={{ color: '#8892A4', fontSize: '14px', margin: '4px 0 0' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
      `}</style>
    </main>
  )
}