'use client'
import Navbar from '../../components/Navbar'

const team = [
  {
    name: 'Yuvraj Singh',
    role: 'Frontend Developer',
    skills: ['Next.js', 'React', 'UI/UX'],
    initial: 'YS',
    color: '#00C2FF'
  },
  {
    name: 'Your Friend',
    role: 'Backend Developer',
    skills: ['Node.js', 'Express', 'JWT'],
    initial: 'YF',
    color: '#00FF88'
  },
  {
    name: 'Member Three',
    role: 'Database Engineer',
    skills: ['Supabase', 'PostgreSQL', 'SQL'],
    initial: 'M3',
    color: '#FF6B6B'
  },
  {
    name: 'Member Four',
    role: 'Data Visualizer',
    skills: ['D3.js', 'Chart.js', 'Python'],
    initial: 'M4',
    color: '#FFB347'
  },
]

export default function Team() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0A0E1A',
      fontFamily: 'sans-serif',
      padding: '100px 40px 60px',
      boxSizing: 'border-box'
    }}>
      <Navbar />

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <p style={{
          color: '#00C2FF',
          letterSpacing: '6px',
          fontSize: '13px',
          textTransform: 'uppercase',
          margin: '0 0 12px'
        }}>
          The people behind it
        </p>
        <h1 style={{
          color: 'white',
          fontSize: '48px',
          fontWeight: '800',
          margin: '0 0 20px'
        }}>
          Our Team
        </h1>
        <div style={{
          width: '60px',
          height: '2px',
          backgroundColor: '#00C2FF',
          margin: '0 auto'
        }} />
      </div>

      {/* Team Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {team.map((member) => (
          <div key={member.name} style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(0, 194, 255, 0.15)',
            borderRadius: '12px',
            padding: '32px 24px',
            textAlign: 'center',
            cursor: 'pointer',
          }}>

            {/* Avatar circle */}
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: `${member.color}20`,
              border: `2px solid ${member.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '20px',
              fontWeight: '800',
              color: member.color,
            }}>
              {member.initial}
            </div>

            {/* Name */}
            <h2 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              margin: '0 0 6px'
            }}>
              {member.name}
            </h2>

            {/* Role */}
            <p style={{
              color: member.color,
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: '0 0 20px'
            }}>
              {member.role}
            </p>

            {/* Skills */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {member.skills.map(skill => (
                <span key={skill} style={{
                  backgroundColor: 'rgba(0, 194, 255, 0.08)',
                  color: '#8892A4',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 194, 255, 0.15)'
                }}>
                  {skill}
                </span>
              ))}
            </div>

          </div>
        ))}
      </div>
    </main>
  )
}