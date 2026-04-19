'use client'
import Navbar from '../../components/Navbar'

const projects = [
  {
    title: 'SmartAttend',
    desc: 'AI-powered attendance system using face recognition for classrooms.',
    tech: ['Python', 'OpenCV', 'React'],
    status: 'Completed',
    team: 'Team Alpha'
  },
  {
    title: 'CampusCart',
    desc: 'Buy and sell second-hand books and gadgets within college campus.',
    tech: ['Next.js', 'Supabase', 'Tailwind'],
    status: 'In Progress',
    team: 'Team Beta'
  },
  {
    title: 'MoneyLens',
    desc: 'College tech club platform for events, projects and team management.',
    tech: ['Next.js', 'Node.js', 'JWT'],
    status: 'In Progress',
    team: 'ProTech Core'
  },
  {
    title: 'EcoTrack',
    desc: 'Track your carbon footprint and get suggestions to reduce it daily.',
    tech: ['React', 'Chart.js', 'Firebase'],
    status: 'Completed',
    team: 'Team Gamma'
  },
]

const statusColor: Record<string, string> = {
  'Completed': '#00FF88',
  'In Progress': '#00C2FF',
}

export default function Projects() {
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
          What we built
        </p>
        <h1 style={{
          color: 'white',
          fontSize: '48px',
          fontWeight: '800',
          margin: '0 0 20px'
        }}>
          Our Projects
        </h1>
        <div style={{
          width: '60px',
          height: '2px',
          backgroundColor: '#00C2FF',
          margin: '0 auto'
        }} />
      </div>

      {/* Projects Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {projects.map((project) => (
          <div key={project.title} style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(0, 194, 255, 0.15)',
            borderRadius: '12px',
            padding: '28px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>

            {/* Status badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                padding: '4px 12px',
                borderRadius: '20px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                backgroundColor: `${statusColor[project.status]}20`,
                color: statusColor[project.status],
              }}>
                {project.status}
              </span>
              <span style={{ color: '#8892A4', fontSize: '12px' }}>
                {project.team}
              </span>
            </div>

            {/* Title */}
            <h2 style={{
              color: 'white',
              fontSize: '22px',
              fontWeight: '700',
              margin: 0
            }}>
              {project.title}
            </h2>

            {/* Description */}
            <p style={{
              color: '#8892A4',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: 0,
              flex: 1
            }}>
              {project.desc}
            </p>

            {/* Tech stack tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {project.tech.map(t => (
                <span key={t} style={{
                  backgroundColor: 'rgba(0, 194, 255, 0.08)',
                  color: '#00C2FF',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 194, 255, 0.2)'
                }}>
                  {t}
                </span>
              ))}
            </div>

          </div>
        ))}
      </div>
    </main>
  )
}