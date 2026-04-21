'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'

interface User {
  name: string
  email: string
}

const registeredEvents = [
  { id: 1, title: 'Web Dev Workshop', date: 'April 25, 2026', time: '2:00 PM', location: 'Lab 301' },
  { id: 2, title: 'Hackathon 2026', date: 'May 10, 2026', time: '9:00 AM', location: 'Main Hall' },
]

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/register')
      return
    }

    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#0A0E1A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#00C2FF', fontSize: '16px' }}>Loading...</p>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0A0E1A',
      fontFamily: 'sans-serif',
      padding: '100px 40px 60px',
      boxSizing: 'border-box'
    }}>
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <p style={{
              color: '#00C2FF',
              letterSpacing: '4px',
              fontSize: '12px',
              textTransform: 'uppercase',
              margin: '0 0 8px'
            }}>
              Dashboard
            </p>
            <h1 style={{
              color: 'white',
              fontSize: '36px',
              fontWeight: '800',
              margin: 0
            }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={{
              color: '#8892A4',
              fontSize: '14px',
              margin: '8px 0 0'
            }}>
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              color: '#FF6B6B',
              border: '1px solid #FF6B6B',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              letterSpacing: '1px'
            }}
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[
            { label: 'Events Registered', value: '2', color: '#00C2FF' },
            { label: 'Projects Joined', value: '1', color: '#00FF88' },
            { label: 'Badges Earned', value: '3', color: '#FFD700' },
          ].map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(0, 194, 255, 0.15)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <p style={{
                color: stat.color,
                fontSize: '32px',
                fontWeight: '800',
                margin: '0 0 8px'
              }}>
                {stat.value}
              </p>
              <p style={{
                color: '#8892A4',
                fontSize: '13px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                margin: 0
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Registered Events */}
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(0, 194, 255, 0.15)',
          borderRadius: '12px',
          padding: '28px'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0 0 20px'
          }}>
            Your Registered Events
          </h2>

          {registeredEvents.length === 0 ? (
            <p style={{ color: '#8892A4', fontSize: '14px' }}>
              No events registered yet. Browse events to join!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {registeredEvents.map((event) => (
                <div key={event.id} style={{
                  backgroundColor: '#0A0E1A',
                  border: '1px solid rgba(0, 194, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <h3 style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: '0 0 4px'
                    }}>
                      {event.title}
                    </h3>
                    <p style={{
                      color: '#8892A4',
                      fontSize: '13px',
                      margin: 0
                    }}>
                      {event.date} • {event.time} • {event.location}
                    </p>
                  </div>
                  <span style={{
                    backgroundColor: '#00FF8820',
                    color: '#00FF88',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>
                    Registered
                  </span>
                </div>
              ))}
            </div>
          )}

          <button style={{
            backgroundColor: '#00C2FF',
            color: '#0A0E1A',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '20px',
            letterSpacing: '1px'
          }}>
            Browse More Events →
          </button>
        </div>
      </div>
    </main>
  )
}
