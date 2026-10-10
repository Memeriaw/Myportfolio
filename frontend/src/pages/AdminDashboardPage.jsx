import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const emptySkill = {
  name: '',
  category: '',
  level: 'Intermediate',
  icon: '✨',
  displayOrder: 1,
};

const emptyProject = {
  title: '',
  description: '',
  longDescription: '',
  imageUrl: '',
  technologies: '',
  category: 'Web App',
  githubUrl: '',
  liveUrl: '',
  featured: false,
};

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    location: '',
    education: '',
    profileImage: '',
    resumeUrl: '',
    socialLinks: { github: '', telegram: '', youtube: '' },
  });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const [profileResponse, projectsResponse, skillsResponse, messagesResponse] = await Promise.all([
        api.get('/profile'),
        api.get('/projects'),
        api.get('/skills'),
        api.get('/messages'),
      ]);

      setProfile(profileResponse.data.data || {});
      setProjects(projectsResponse.data.data || []);
      setSkills(skillsResponse.data.data || []);
      setMessages(messagesResponse.data.data || []);
    } catch (error) {
      console.error('Dashboard load failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleSocialChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      socialLinks: { ...current.socialLinks, [field]: value },
    }));
  };

  const saveProfile = async () => {
    try {
      await api.put('/profile', profile);
      await loadDashboard();
    } catch (error) {
      console.error('Profile save failed:', error);
    }
  };

  const resetSkillForm = () => {
    setSkillForm(emptySkill);
    setEditingSkillId(null);
  };

  const resetProjectForm = () => {
    setProjectForm(emptyProject);
    setEditingProjectId(null);
  };

  const handleSkillInput = (event) => {
    const { name, value } = event.target;
    setSkillForm((current) => ({ ...current, [name]: value }));
  };

  const handleProjectInput = (event) => {
    const { name, value, type, checked } = event.target;
    setProjectForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitSkill = async () => {
    try {
      if (!skillForm.name || !skillForm.category) {
        return;
      }

      const payload = {
        ...skillForm,
        displayOrder: Number(skillForm.displayOrder || 1),
      };

      if (editingSkillId) {
        await api.put(`/skills/${editingSkillId}`, payload);
      } else {
        await api.post('/skills', payload);
      }

      await loadDashboard();
      resetSkillForm();
    } catch (error) {
      console.error('Skill save failed:', error);
    }
  };

  const submitProject = async () => {
    try {
      if (!projectForm.title || !projectForm.description) {
        return;
      }

      const payload = {
        ...projectForm,
        technologies: projectForm.technologies
          .split(',')
          .map((tech) => tech.trim())
          .filter(Boolean),
      };

      if (editingProjectId) {
        await api.put(`/projects/${editingProjectId}`, payload);
      } else {
        await api.post('/projects', payload);
      }

      await loadDashboard();
      resetProjectForm();
    } catch (error) {
      console.error('Project save failed:', error);
    }
  };

  const editSkill = (skill) => {
    setEditingSkillId(skill._id);
    setSkillForm({
      name: skill.name || '',
      category: skill.category || '',
      level: skill.level || 'Intermediate',
      icon: skill.icon || '✨',
      displayOrder: skill.displayOrder || 1,
    });
  };

  const editProject = (project) => {
    setEditingProjectId(project._id);
    setProjectForm({
      title: project.title || '',
      description: project.description || '',
      longDescription: project.longDescription || '',
      imageUrl: project.imageUrl || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      category: project.category || 'Web App',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: Boolean(project.featured),
    });
  };

  const deleteSkill = async (id) => {
    try {
      await api.delete(`/skills/${id}`);
      await loadDashboard();
      if (editingSkillId === id) resetSkillForm();
    } catch (error) {
      console.error('Delete skill failed:', error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      await loadDashboard();
      if (editingProjectId === id) resetProjectForm();
    } catch (error) {
      console.error('Delete project failed:', error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      await loadDashboard();
    } catch (error) {
      console.error('Delete message failed:', error);
    }
  };

  const toggleMessageRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`);
      await loadDashboard();
    } catch (error) {
      console.error('Mark message read failed:', error);
    }
  };

  if (loading) return <div className="page-shell"><div className="loading-box">Loading admin dashboard...</div></div>;

  return (
    <div className="page-shell admin-shell">
      <div className="container admin-grid">
        <aside className="glass-panel admin-sidebar">
          <h2>Dashboard</h2>
          <button type="button" className="button ghost" onClick={saveProfile}>Save Profile</button>
          <button type="button" className="button ghost" onClick={resetSkillForm}>New Skill</button>
          <button type="button" className="button ghost" onClick={resetProjectForm}>New Project</button>
          <button type="button" className="button ghost" onClick={logout}>Logout</button>
        </aside>

        <div className="admin-main">
          <section className="glass-panel">
            <h3>Profile</h3>
            <div className="admin-form-grid">
              <label><span>Name</span><input name="name" value={profile.name || ''} onChange={handleProfileChange} /></label>
              <label><span>Title</span><input name="title" value={profile.title || ''} onChange={handleProfileChange} /></label>
              <label className="wide"><span>Bio</span><textarea name="bio" value={profile.bio || ''} onChange={handleProfileChange} rows="4" /></label>
              <label><span>Email</span><input name="email" value={profile.email || ''} onChange={handleProfileChange} /></label>
              <label><span>Location</span><input name="location" value={profile.location || ''} onChange={handleProfileChange} /></label>
              <label><span>Education</span><input name="education" value={profile.education || ''} onChange={handleProfileChange} /></label>
              <label><span>Profile Image URL</span><input name="profileImage" value={profile.profileImage || ''} onChange={handleProfileChange} /></label>
              <label><span>Resume URL</span><input name="resumeUrl" value={profile.resumeUrl || ''} onChange={handleProfileChange} /></label>
              <label><span>GitHub</span><input value={profile.socialLinks?.github || ''} onChange={(e) => handleSocialChange('github', e.target.value)} /></label>
              <label><span>Telegram</span><input value={profile.socialLinks?.telegram || ''} onChange={(e) => handleSocialChange('telegram', e.target.value)} /></label>
              <label><span>YouTube</span><input value={profile.socialLinks?.youtube || ''} onChange={(e) => handleSocialChange('youtube', e.target.value)} /></label>
            </div>
          </section>

          <section className="glass-panel">
            <h3>{editingSkillId ? 'Edit Skill' : 'Add Skill'}</h3>
            <div className="admin-form-grid">
              <label><span>Name</span><input name="name" value={skillForm.name} onChange={handleSkillInput} /></label>
              <label><span>Category</span><input name="category" value={skillForm.category} onChange={handleSkillInput} /></label>
              <label><span>Level</span><input name="level" value={skillForm.level} onChange={handleSkillInput} /></label>
              <label><span>Icon</span><input name="icon" value={skillForm.icon} onChange={handleSkillInput} /></label>
              <label><span>Display Order</span><input type="number" name="displayOrder" value={skillForm.displayOrder} onChange={handleSkillInput} /></label>
            </div>
            <div className="button-row small-row admin-actions">
              <button type="button" className="button primary" onClick={submitSkill}>{editingSkillId ? 'Update Skill' : 'Create Skill'}</button>
              {editingSkillId && <button type="button" className="button ghost" onClick={resetSkillForm}>Cancel</button>}
            </div>
            <div className="mini-list">
              {skills.map((skill) => (
                <div key={skill._id} className="mini-item">
                  <span>{skill.name} — {skill.category}</span>
                  <div className="inline-actions">
                    <button type="button" className="button ghost small" onClick={() => editSkill(skill)}>Edit</button>
                    <button type="button" className="button ghost small danger" onClick={() => deleteSkill(skill._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel">
            <h3>{editingProjectId ? 'Edit Project' : 'Add Project'}</h3>
            <div className="admin-form-grid">
              <label><span>Title</span><input name="title" value={projectForm.title} onChange={handleProjectInput} /></label>
              <label><span>Category</span><input name="category" value={projectForm.category} onChange={handleProjectInput} /></label>
              <label className="wide"><span>Description</span><textarea name="description" value={projectForm.description} onChange={handleProjectInput} rows="3" /></label>
              <label className="wide"><span>Long Description</span><textarea name="longDescription" value={projectForm.longDescription} onChange={handleProjectInput} rows="4" /></label>
              <label className="wide"><span>Image URL</span><input name="imageUrl" value={projectForm.imageUrl} onChange={handleProjectInput} /></label>
              <label className="wide"><span>Technologies</span><input name="technologies" value={projectForm.technologies} onChange={handleProjectInput} /></label>
              <label><span>GitHub URL</span><input name="githubUrl" value={projectForm.githubUrl} onChange={handleProjectInput} /></label>
              <label><span>Live URL</span><input name="liveUrl" value={projectForm.liveUrl} onChange={handleProjectInput} /></label>
              <label className="checkbox-row wide">
                <input type="checkbox" name="featured" checked={projectForm.featured} onChange={handleProjectInput} />
                <span>Featured project</span>
              </label>
            </div>
            <div className="button-row small-row admin-actions">
              <button type="button" className="button primary" onClick={submitProject}>{editingProjectId ? 'Update Project' : 'Create Project'}</button>
              {editingProjectId && <button type="button" className="button ghost" onClick={resetProjectForm}>Cancel</button>}
            </div>
            <div className="mini-list">
              {projects.map((project) => (
                <div key={project._id} className="mini-item">
                  <span>{project.title}</span>
                  <div className="inline-actions">
                    <button type="button" className="button ghost small" onClick={() => editProject(project)}>Edit</button>
                    <button type="button" className="button ghost small danger" onClick={() => deleteProject(project._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel">
            <h3>Messages</h3>
            <div className="message-list">
              {messages.map((message) => (
                <div key={message._id} className={`message-item ${message.isRead ? 'read' : 'unread'}`}>
                  <div>
                    <strong>{message.name}</strong>
                    <p>{message.subject}</p>
                    <small>{message.email}</small>
                    <div className="message-text">{message.message}</div>
                  </div>
                  <div className="inline-actions">
                    <button type="button" className="button ghost small" onClick={() => toggleMessageRead(message._id)}>{message.isRead ? 'Mark unread' : 'Mark read'}</button>
                    <button type="button" className="button ghost small danger" onClick={() => deleteMessage(message._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
