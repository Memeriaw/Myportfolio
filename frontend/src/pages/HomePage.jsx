import { ArrowRight, BriefcaseBusiness, Code2, MapPin, PenTool, Rocket, ServerCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ProjectCard from '../components/ProjectCard';

const services = [
  { title: 'Frontend Development', description: 'Responsive interfaces, modern layouts, and smooth user experiences using React and clean UI systems.', icon: Code2 },
  { title: 'Backend APIs', description: 'RESTful services, data handling, authentication, and scalable server-side logic with Node.js and Express.', icon: ServerCog },
  { title: 'Product Design', description: 'Clear user flows, polished interactions, and conversion-focused features that make ideas feel usable.', icon: PenTool },
];

const processSteps = [
  { step: '01', title: 'Discover', text: 'I study the problem, target audience, and product goals before drafting any solution.' },
  { step: '02', title: 'Design', text: 'I shape the interface and data flow into a clean and structured experience for users.' },
  { step: '03', title: 'Build', text: 'I create the application with maintainable architecture, strong logic, and practical performance.' },
  { step: '04', title: 'Launch', text: 'I refine the release, validate behavior, and make sure the final result is ready to use.' },
];

export default function HomePage() {
  const [profile, setProfile] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileResponse, projectsResponse, skillsResponse] = await Promise.all([
          api.get('/profile'),
          api.get('/projects?featured=true'),
          api.get('/skills'),
        ]);

        setProfile(profileResponse.data.data);
        setFeaturedProjects(projectsResponse.data.data || []);
        setSkills((skillsResponse.data.data || []).slice(0, 6));
      } catch (error) {
        console.error('Unable to load homepage data.', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading portfolio...</div></div>;
  }

  const cvHref = profile?.resumeUrl && profile.resumeUrl !== '#' ? profile.resumeUrl : null;

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><span className="availability-dot" /> Portfolio · Developer</span>
            <h1>Hello, I’m <span>{profile?.name || 'Memeriaw Adugnaw'}</span></h1>
            <h2>{profile?.title}</h2>
            <p className="lead-text">{profile?.bio}</p>
            <div className="button-row">
              <Link to="/projects" className="button primary">Explore my work <ArrowRight size={16} /></Link>
              <Link to="/contact" className="button secondary">Let’s talk</Link>
              {cvHref && <a href={cvHref} className="button ghost" target="_blank" rel="noreferrer">View résumé</a>}
            </div>
            <div className="mini-badges">
              {profile?.location && <span><MapPin size={14} />{profile.location}</span>}
              {profile?.education && <span><BriefcaseBusiness size={14} />{profile.education}</span>}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />
            <div className="profile-card">
              <img src={profile?.profileImage || '/profile-portrait.png'} alt={profile?.name || 'Portfolio owner'} />
            </div>
            <div className="hero-note"><span className="hero-note-icon"><Code2 size={17} /></span><span><strong>Thoughtful code</strong><small>Built for people</small></span></div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">What I Do</span>
            <h2>Building useful digital experiences</h2>
            <p>I combine thoughtful design and dependable engineering to turn ideas into practical products.</p>
          </div>
          <div className="service-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="service-card">
                  <div className="service-icon"><Icon size={22} /></div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Process</span>
            <h2>How I turn ideas into products</h2>
          </div>
          <div className="timeline-grid">
            {processSteps.map((item) => (
              <div key={item.step} className="timeline-card">
                <span className="step-tag">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Selected Work</span>
            <h2>Featured Projects</h2>
          </div>
          <div className="project-grid">
            {featuredProjects.length > 0 ? featuredProjects.map((project) => <ProjectCard key={project._id} project={project} />) : <p>No featured projects yet.</p>}
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="container">
          <div className="cta-panel">
            <div>
              <span className="eyebrow">Let’s build</span>
              <h2>Need a clean, functional, and modern web product?</h2>
            </div>
            <Link to="/contact" className="button primary">Start a conversation <Rocket size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Core Strength</span>
            <h2>Skills Overview</h2>
            <p>A selection of tools and technologies I use to plan and build digital products.</p>
          </div>
          <div className="skill-grid">
            {skills.length > 0 ? skills.map((skill) => (
              <div key={skill._id} className="skill-card">
                <div className="skill-icon">{skill.icon || '⚡'}</div>
                <h3>{skill.name}</h3>
                <p>{skill.category}</p>
              </div>
            )) : <p className="empty-state">Skills will appear here soon.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
