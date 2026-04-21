'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import { Toaster, toast } from 'sonner'
import { supabase } from '../../lib/supabase'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  is_upcoming: boolean
}

interface User {
  id: string
  name: string
  email: string
}

export default function Events() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchEvents()
    fetchRegisteredEvents(parsedUser.id)
    setLoading(false)
  }, [router])

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      toast.error('Failed to load events')
      return
    }

    setEvents(data || [])
  }

  const fetchRegisteredEvents = async (userId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to load registrations:', error)
      return
    }

    setRegisteredEvents(data?.map(r => r.event_id) || [])
  }

  const handleRegister = async (eventId: string) => {
    if (!user) return

    const { error } = await supabase
      .from('event_registrations')
      .insert([{ user_id: user.id, event_id: eventId }])

    if (error) {
      toast.error('Failed to register for event')
      return
    }

    setRegisteredEvents([...registeredEvents, eventId])
    toast.success('Successfully registered for event! 🎉')
  }

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all'
      ? true
      : filter === 'upcoming'
        ? event.is_upcoming
        : !event.is_upcoming

    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

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

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            color: '#00C2FF',
            letterSpacing: '6px',
            fontSize: '13px',
            textTransform: 'uppercase',
            margin: '0 0 12px'
          }}>
            ProTech College
          </p>
          <h1 style={{
            color: 'white',
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 0 20px'
          }}>
            Events
          </h1>
          <div style={{
            width: '60px',
            height: '2px',
            backgroundColor: '#00C2FF',
            margin: '0 auto'
          }} />
        </div>

        {/* Filters and Search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {(['all', 'upcoming', 'past'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: filter === f ? '#00C2FF' : 'transparent',
                  color: filter === f ? '#0A0E1A' : '#8892A4',
                  border: '1px solid rgba(0, 194, 255, 0.3)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '12px 16px',
              backgroundColor: '#111827',
              border: '1px solid rgba(0, 194, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              width: '280px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Events Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {filteredEvents.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px',
              color: '#8892A4'
            }}>
              <p style={{ fontSize: '18px', margin: 0 }}>No events found</p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const isRegistered = registeredEvents.includes(event.id)
              const eventDate = new Date(event.date)
              const isPast = !event.is_upcoming

              return (
                <div key={event.id} style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(0, 194, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      backgroundColor: event.is_upcoming ? '#00FF8820' : '#8892A420',
                      color: event.is_upcoming ? '#00FF88' : '#8892A4',
                    }}>
                      {event.is_upcoming ? 'Upcoming' : 'Past'}
                    </span>
                    {isRegistered && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        backgroundColor: '#00C2FF20',
                        color: '#00C2FF',
                      }}>
                        Registered
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 style={{
                    color: 'white',
                    fontSize: '22px',
                    fontWeight: '700',
                    margin: 0
                  }}>
                    {event.title}
                  </h2>

                  {/* Description */}
                  <p style={{
                    color: '#8892A4',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    margin: 0,
                    flex: 1
                  }}>
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#00C2FF', fontSize: '14px' }}>📅</span>
                      <span style={{ color: '#8892A4', fontSize: '14px' }}>
                        {eventDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#00C2FF', fontSize: '14px' }}>🕒</span>
                      <span style={{ color: '#8892A4', fontSize: '14px' }}>{event.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#00C2FF', fontSize: '14px' }}>📍</span>
                      <span style={{ color: '#8892A4', fontSize: '14px' }}>{event.location}</span>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    onClick={() => !isRegistered && !isPast && handleRegister(event.id)}
                    disabled={isRegistered || isPast}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: isRegistered
                        ? '#00C2FF20'
                        : isPast
                          ? '#1a2332'
                          : '#00C2FF',
                      color: isRegistered
                        ? '#00C2FF'
                        : isPast
                          ? '#8892A4'
                          : '#0A0E1A',
                      border: isRegistered
                        ? '1px solid #00C2FF'
                        : isPast
                          ? '1px solid #8892A4'
                          : 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: isRegistered || isPast ? 'not-allowed' : 'pointer',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      marginTop: '8px'
                    }}
                  >
                    {isRegistered
                      ? '✓ Registered'
                      : isPast
                        ? 'Event Ended'
                        : 'Register Now →'}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}
