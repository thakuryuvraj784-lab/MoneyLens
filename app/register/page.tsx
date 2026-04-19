'use client'
import Navbar from '../../components/Navbar'
import { useState } from 'react'

export default function Register() {
  const [isLogin, setIsLogin] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (!form.email || !form.password) {
      setMessage('Please fill all fields!')
      return
    }
    if (!isLogin && !form.name) {
      setMessage('Please enter your name!')
      return
    }
    setMessage(isLogin ? 'Login successful! 🎉' : 'Account created! 🎉')
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0A0E1A',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px 60px',
      boxSizing: 'border-box'
    }}>
      <Navbar />

      {/* Card */}
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid rgba(0, 194, 255, 0.2)',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
      }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '50px',
            height: '2px',
            backgroundColor: '#00C2FF',
            margin: '0 auto 20px'
          }} />
          <h1 style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: '800',
            margin: '0 0 8px'
          }}>
            {isLogin ? 'Welcome Back' : 'Join ProTech'}
          </h1>
          <p style={{ color: '#8892A4', fontSize: '14px', margin: 0 }}>
            {isLogin ? 'Login to your account' : 'Create your account today'}
          </p>
        </div>

        {/* Name field — only for Register */}
        {!isLogin && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              color: '#8892A4',
              fontSize: '12px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Yuvraj Singh"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#0A0E1A',
                border: '1px solid rgba(0, 194, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {/* Email field */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            color: '#8892A4',
            fontSize: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@college.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#0A0E1A',
              border: '1px solid rgba(0, 194, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Password field */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            color: '#8892A4',
            fontSize: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#0A0E1A',
              border: '1px solid rgba(0, 194, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Message */}
        {message && (
          <p style={{
            color: message.includes('🎉') ? '#00FF88' : '#FF6B6B',
            fontSize: '13px',
            textAlign: 'center',
            marginBottom: '16px',
            fontWeight: '600'
          }}>
            {message}
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#00C2FF',
            color: '#0A0E1A',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '800',
            cursor: 'pointer',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>
          {isLogin ? 'Login →' : 'Create Account →'}
        </button>

        {/* Switch between login/register */}
        <p style={{
          color: '#8892A4',
          fontSize: '13px',
          textAlign: 'center',
          margin: 0
        }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setIsLogin(!isLogin); setMessage('') }}
            style={{
              color: '#00C2FF',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>

      </div>
    </main>
  )
}