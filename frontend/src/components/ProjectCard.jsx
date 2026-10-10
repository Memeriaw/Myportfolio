export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <img
        src={project.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'}
        alt={project.title}
      />
      <div className="project-card-body">
        <div className="project-meta">
          <span>{project.category}</span>
          {project.featured && <span className="featured-badge">Featured</span>}
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="chip-row">
          {project.technologies?.slice(0, 4).map((tech) => (
            <span key={tech} className="chip">{tech}</span>
          ))}
        </div>
        <div className="card-actions">
          <a href={`/projects/${project.slug}`} className="button primary small">Details</a>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="button ghost small">
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
