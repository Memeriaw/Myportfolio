import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import SectionTitle from '../components/SectionTitle';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await api.get('/skills');
        setSkills(response.data.data || []);
      } catch (error) {
        console.error('Unable to fetch skills.', error);
      }
    };

    loadSkills();
  }, []);

  const groupedSkills = useMemo(() => {
    return skills.reduce((groups, skill) => {
      groups[skill.category] = groups[skill.category] || [];
      groups[skill.category].push(skill);
      return groups;
    }, {});
  }, [skills]);

  return (
    <div className="page-shell">
      <section className="section-block">
        <div className="container">
          <SectionTitle eyebrow="Skills" title="Technical Skills" description="A structured overview of the tools and technologies I use across build processes and applications." />
          {Object.entries(groupedSkills).length > 0 ? (
            <div className="skills-category-list">
              {Object.entries(groupedSkills).map(([category, items]) => (
                <div key={category} className="glass-panel">
                  <h3>{category}</h3>
                  <div className="chip-row">
                    {items.map((skill) => (
                      <span key={skill._id} className="chip large">{skill.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No skills available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
