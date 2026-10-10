import { useEffect, useState } from 'react';
import api from '../api/client';
import ProjectCard from '../components/ProjectCard';
import SectionTitle from '../components/SectionTitle';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data.data || []);
      } catch (error) {
        console.error('Unable to load projects.', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))];
  const visibleProjects = category === 'All' ? projects : projects.filter((project) => project.category === category);

  return (
    <div className="page-shell">
      <section className="section-block">
        <div className="container">
          <SectionTitle eyebrow="Portfolio" title="My Projects" description="A collection of web apps, interfaces, and technical experiments." />
          <div className="filter-row">
            {categories.map((item) => (
              <button key={item} type="button" className={`filter-chip ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-box">Loading projects...</div>
          ) : visibleProjects.length > 0 ? (
            <div className="project-grid">
              {visibleProjects.map((project) => <ProjectCard key={project._id} project={project} />)}
            </div>
          ) : (
            <div className="empty-state">No projects available yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
