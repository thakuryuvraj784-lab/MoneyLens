'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Projects', path: '/projects' },
    { name: 'Team', path: '/team' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      backgroundColor: 'rgba(10, 14, 26, 0.95)',
      borderBottom: '1px solid rgba(0, 194, 255, 0.2)',
      padding: '16px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      boxSizing: 'border-box',
    }}>

      {/* Logo */}
      <Link href="/" style={{
        color: '#00C2FF',
        fontSize: '22px',
        fontWeight: '800',
        textDecoration: 'none',
        letterSpacing: '-1px'
      }}>
        Money<span style={{ color: 'white' }}>Lens</span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {links.map(link => (
          <Link key={link.name} href={link.path} style={{
            color: '#8892A4',
            textDecoration: 'none',
            fontSize: '14px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: '500',
          }}>
            {link.name}
          </Link>
        ))}
      </div>

      {/* Register Button */}
      <Link href="/register" style={{
        backgroundColor: 'transparent',
        color: '#00C2FF',
        border: '1px solid #00C2FF',
        padding: '8px 20px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        textDecoration: 'none',
        letterSpacing: '1px'
      }}>
        Register
      </Link>
    </nav>
  )
}