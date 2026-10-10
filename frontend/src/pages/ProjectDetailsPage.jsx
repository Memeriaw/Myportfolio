import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import SectionTitle from '../components/SectionTitle';

export default function ProjectDetailsPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await api.get(`/projects/${slug}`);
        setProject(response.data.data);
      } catch (error) {
        console.error('Unable to fetch project.', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  if (loading) return <div className="page-shell"><div className="loading-box">Loading project...</div></div>;
  if (!project) return <div className="page-shell"><div className="container"><p>Project not found.</p></div></div>;

  return (
    <div className="page-shell">
      <section className="section-block">
        <div className="container project-detail-layout">
          <img className="project-hero-image" src={project.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'} alt={project.title} />
          <div>
            <SectionTitle eyebrow={project.category} title={project.title} />
            <p className="lead-text">{project.longDescription || project.description}</p>
            <div className="chip-row">
              {project.technologies?.map((tech) => <span key={tech} className="chip large">{tech}</span>)}
            </div>
            <div className="button-row">
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="button primary">GitHub</a>}
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="button ghost">Live Demo</a>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
