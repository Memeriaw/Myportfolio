const bcrypt = require('bcryptjs');

const createDefaultProfile = () => ({
  _id: 'profile-default',
  name: 'Memeriaw Adugnaw',
  title: 'Information System Student | Full-Stack Developer',
  bio: 'I am a motivated Information System student at Bahir Dar University with a passion for building modern digital experiences and useful web applications.',
  email: 'memeriawadugnaw@gmail.com',
  location: 'Bahir Dar, Ethiopia',
  education: 'Bahir Dar University - Information Systems',
  profileImage: '/profile-portrait.png',
  resumeUrl: '#',
  socialLinks: {
    github: 'https://github.com/Memeriaw',
    telegram: 'https://t.me/Lectern21',
    youtube: 'https://www.youtube.com/@Elman_united',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const createDefaultProjects = () => [
  {
    _id: 'project-1',
    title: 'Ethiopian News Portal',
    slug: 'ethiopian-news-portal',
    description: 'A responsive news site for local stories and updates.',
    longDescription: 'A professional news portal created to aggregate stories, highlight headline categories and present content in a modern, mobile-friendly layout.',
    imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    technologies: ['React', 'Node.js', 'MongoDB'],
    category: 'Web App',
    githubUrl: 'https://github.com/Memeriaw',
    liveUrl: '#',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'project-2',
    title: 'Student Course Manager',
    slug: 'student-course-manager',
    description: 'A course management dashboard for students and instructors.',
    longDescription: 'This dashboard helps users manage academic schedules, track assignments and keep course data organized.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    technologies: ['JavaScript', 'Express.js', 'MongoDB'],
    category: 'Dashboard',
    githubUrl: 'https://github.com/Memeriaw',
    liveUrl: '#',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const createDefaultSkills = () => [
  { _id: 'skill-1', name: 'React', category: 'Frontend', level: 'Advanced', icon: 'react', displayOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'skill-2', name: 'Node.js', category: 'Backend', level: 'Advanced', icon: 'node', displayOrder: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'skill-3', name: 'Express.js', category: 'Backend', level: 'Advanced', icon: 'express', displayOrder: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'skill-4', name: 'MongoDB', category: 'Database', level: 'Intermediate', icon: 'mongo', displayOrder: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'skill-5', name: 'JavaScript', category: 'Programming Languages', level: 'Advanced', icon: 'javascript', displayOrder: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'skill-6', name: 'C++', category: 'Programming Languages', level: 'Intermediate', icon: 'cpp', displayOrder: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const ensureStore = () => {
  if (!global.__portfolioStore) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const userPassword = bcrypt.hashSync(adminPassword, 10);
    global.__portfolioStore = {
      profile: createDefaultProfile(),
      projects: createDefaultProjects(),
      skills: createDefaultSkills(),
      messages: [],
      users: [{ _id: 'admin-user', name: 'Admin', email: (process.env.ADMIN_EMAIL || 'admin@memeriaw.dev').toLowerCase(), password: userPassword }],
    };
  }
  return global.__portfolioStore;
};

const getStore = () => ensureStore();

module.exports = { getStore, ensureStore };
