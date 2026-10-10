import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import SectionTitle from '../components/SectionTitle';

export default function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileResponse, skillsResponse] = await Promise.all([
          api.get('/profile'),
          api.get('/skills'),
        ]);
        setProfile(profileResponse.data.data);
        setSkills(skillsResponse.data.data || []);
      } catch (error) {
        console.error('Failed to load profile data.', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="page-shell">
      <section className="section-block">
        <div className="container content-grid">
          <div>
            <SectionTitle eyebrow="About Me" title="My Story" description="A focused learner creating practical digital products and web experiences." />
            <p className="lead-text">{profile?.bio}</p>
            <div className="info-list">
              <div><strong>Education:</strong> {profile?.education || 'Bahir Dar University'}</div>
              <div><strong>Location:</strong> {profile?.location || 'Bahir Dar, Ethiopia'}</div>
              <div><strong>Email:</strong> {profile?.email || 'memeriawadugnaw@gmail.com'}</div>
            </div>
          </div>
          <div className="glass-panel">
            <h3>Career Goals</h3>
            <ul>
              <li>Build impactful and user-friendly web applications.</li>
              <li>Keep learning modern frontend and backend technologies.</li>
              <li>Contribute to digital solutions in Ethiopia and beyond.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="container">
          <SectionTitle eyebrow="Technical Stack" title="What I Work With" />
          <div className="skill-grid">
            {skills.map((skill) => (
              <div key={skill._id} className="skill-card compact">
                <h3>{skill.name}</h3>
                <p>{skill.category}</p>
                <span>{skill.level}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
