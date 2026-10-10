const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { getStore } = require('../utils/store');

dotenv.config();

const seedDatabase = async () => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      await Profile.create({
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
          youtube: 'https://www.youtube.com/@Elman_united'
        }
      });
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: 'Ethiopian News Portal',
          slug: 'ethiopian-news-portal',
          description: 'A responsive news site for local stories and updates.',
          longDescription: 'A professional news portal created to aggregate stories, highlight headline categories and present content in a modern, mobile-friendly layout.',
          imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
          technologies: ['React', 'Node.js', 'MongoDB'],
          category: 'Web App',
          githubUrl: 'https://github.com/Memeriaw',
          liveUrl: '#',
          featured: true
        },
        {
          title: 'Student Course Manager',
          slug: 'student-course-manager',
          description: 'A course management dashboard for students and instructors.',
          longDescription: 'This dashboard helps users manage academic schedules, track assignments and keep course data organized.',
          imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
          technologies: ['JavaScript', 'Express.js', 'MongoDB'],
          category: 'Dashboard',
          githubUrl: 'https://github.com/Memeriaw',
          liveUrl: '#',
          featured: false
        }
      ]);
    }

    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        { name: 'React', category: 'Frontend', level: 'Advanced', icon: 'react', displayOrder: 1 },
        { name: 'Node.js', category: 'Backend', level: 'Advanced', icon: 'node', displayOrder: 2 },
        { name: 'Express.js', category: 'Backend', level: 'Advanced', icon: 'express', displayOrder: 3 },
        { name: 'MongoDB', category: 'Database', level: 'Intermediate', icon: 'mongo', displayOrder: 4 },
        { name: 'JavaScript', category: 'Programming Languages', level: 'Advanced', icon: 'javascript', displayOrder: 5 },
        { name: 'C++', category: 'Programming Languages', level: 'Intermediate', icon: 'cpp', displayOrder: 6 },
        { name: 'Java', category: 'Programming Languages', level: 'Intermediate', icon: 'java', displayOrder: 7 },
        { name: 'PHP', category: 'Programming Languages', level: 'Intermediate', icon: 'php', displayOrder: 8 },
        { name: 'Dart', category: 'Programming Languages', level: 'Intermediate', icon: 'dart', displayOrder: 9 },
        { name: 'HTML', category: 'Frontend', level: 'Advanced', icon: 'html', displayOrder: 10 },
        { name: 'CSS', category: 'Frontend', level: 'Advanced', icon: 'css', displayOrder: 11 },
        { name: 'SQL', category: 'Database', level: 'Intermediate', icon: 'sql', displayOrder: 12 }
      ]);
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@memeriaw.dev';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const existingUser = await User.findOne({
      $or: [{ email: adminEmail }, { name: 'Admin' }],
    });
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    if (existingUser) {
      existingUser.name = 'Admin';
      existingUser.email = adminEmail;
      existingUser.password = hashedPassword;
      await existingUser.save();
    } else {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword
      });
    }

    console.log('Database initialized with demo data.');
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/memeriaw-portfolio';

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
    await seedDatabase();
    return mongoose.connection;
  } catch (error) {
    console.warn('MongoDB connection error:', error.message);
    console.warn('Using in-memory fallback data store for local development.');
    getStore();
    return null;
  }
};

module.exports = connectDB;
