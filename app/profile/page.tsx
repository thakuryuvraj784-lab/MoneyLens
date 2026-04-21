'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import { Toaster, toast } from 'sonner'
import { supabase } from '../../lib/supabase'

interface User {
  id: string
  name: string
  email: string
  created_at: string
}

interface Badge {
  id: string
  name: string
  description: string
  color: string
}

const STATIC_BADGES: Badge[] = [
  { id: '1', name: 'Early Adopter', description: 'Joined MoneyLens early', color: '#00C2FF' },
  { id: '2', name: 'Event Enthusiast', description: 'Registered for 3+ events', color: '#00FF88' },
  { id: '3', name: 'Project Contributor', description: 'Contributed to a project', color: '#FFD700' },
]

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    fetchUserDetails(parsedUser.id)
    setLoading(false)
  }, [router])

  const fetchUserDetails = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Failed to fetch user:', error)
      return
    }

    setUser(data)
    setEditName(data.name)
  }

  const handleSaveName = async () => {
    if (!user || !editName.trim()) return

    const { error } = await supabase
      .from('users')
      .update({ name: editName.trim() })
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to update name')
      return
    }

    // Update local storage
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    userData.name = editName.trim()
    localStorage.setItem('user', JSON.stringify(userData))

    setUser({ ...user, name: editName.trim() })
    setIsEditing(false)
    toast.success('Name updated!')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
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
      <Toaster position="top-right" theme="dark" />
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            color: '#00C2FF',
            letterSpacing: '6px',
            fontSize: '13px',
            textTransform: 'uppercase',
            margin: '0 0 12px'
          }}>
            My Account
          </p>
          <h1 style={{
            color: 'white',
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 0 20px'
          }}>
            Profile
          </h1>
          <div style={{
            width: '60px',
            height: '2px',
            backgroundColor: '#00C2FF',
            margin: '0 auto'
          }} />
        </div>

        {/* Profile Card */}
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(0, 194, 255, 0.15)',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '32px'
        }}>
          {/* Avatar and Name */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            {/* Avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#00C2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '700',
              color: '#0A0E1A'
            }}>
              {user ? getInitials(user.name) : '?'}
            </div>

            {/* Name and Edit */}
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#0A0E1A',
                      border: '1px solid rgba(0, 194, 255, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#00C2FF',
                      color: '#0A0E1A',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setEditName(user?.name || '')
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'transparent',
                      color: '#8892A4',
                      border: '1px solid rgba(139, 148, 158, 0.3)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <h2 style={{
                    color: 'white',
                    fontSize: '28px',
                    fontWeight: '700',
                    margin: '0 0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    {user?.name}
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#00C2FF',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '4px'
                      }}
                      title="Edit name"
                    >
                      ✏️
                    </button>
                  </h2>
                  <p style={{ color: '#8892A4', fontSize: '14px', margin: 0 }}>
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Joined Date */}
          <div style={{
            padding: '16px',
            backgroundColor: '#0A0E1A',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#8892A4', fontSize: '13px', margin: '0 0 4px' }}>
              Member Since
            </p>
            <p style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A'}
            </p>
          </div>

          {/* Badges */}
          <div>
            <h3 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              margin: '0 0 16px'
            }}>
              Badges Earned
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {STATIC_BADGES.map((badge) => (
                <div
                  key={badge.id}
                  style={{
                    backgroundColor: `${badge.color}15`,
                    border: `1px solid ${badge.color}40`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: badge.color
                  }} />
                  <div>
                    <p style={{
                      color: badge.color,
                      fontSize: '13px',
                      fontWeight: '600',
                      margin: '0 0 2px'
                    }}>
                      {badge.name}
                    </p>
                    <p style={{
                      color: '#8892A4',
                      fontSize: '11px',
                      margin: 0
                    }}>
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(0, 194, 255, 0.15)',
          borderRadius: '16px',
          padding: '28px'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0 0 20px'
          }}>
            My Projects
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              backgroundColor: '#0A0E1A',
              border: '1px solid rgba(0, 194, 255, 0.1)',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 4px'
                }}>
                  MoneyLens
                </h3>
                <p style={{
                  color: '#8892A4',
                  fontSize: '13px',
                  margin: 0
                }}>
                  Full Stack Developer
                </p>
              </div>
              <span style={{
                backgroundColor: '#00C2FF20',
                color: '#00C2FF',
                fontSize: '11px',
                padding: '4px 12px',
                borderRadius: '20px',
                fontWeight: '600'
              }}>
                In Progress
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
