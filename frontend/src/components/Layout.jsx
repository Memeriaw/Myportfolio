import { NavLink, Outlet } from 'react-router-dom';
import { ArrowUp, Globe, Mail, Menu, MessageCircle, MoonStar, Send, SunMedium, Video, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div>
          <h3>Memeriaw Adugnaw</h3>
          <p>Information System Student | Full-Stack Developer</p>
        </div>
        <div className="social-links">
          <a href="https://github.com/Memeriaw" target="_blank" rel="noreferrer" aria-label="GitHub"><Globe size={18} /></a>
          <a href="https://t.me/Lectern21" target="_blank" rel="noreferrer" aria-label="Telegram"><Send size={18} /></a>
          <a href="https://www.youtube.com/@Elman_united" target="_blank" rel="noreferrer" aria-label="YouTube"><Video size={18} /></a>
          <a href="mailto:memeriawadugnaw@gmail.com" aria-label="Email"><Mail size={18} /></a>
          <a href="https://wa.me/251900000000" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={18} /></a>
        </div>
      </div>

      {showTop && (
        <button type="button" className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top">
          <ArrowUp size={18} />
        </button>
      )}
    </footer>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/skills', label: 'Skills' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrap">
          <NavLink to="/" className="brand">
            <span className="brand-mark">M</span>
            Memeriaw
          </NavLink>

          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/admin/login" className="nav-link admin-link">Admin</NavLink>
            {user && (
              <button type="button" className="button ghost small" onClick={logout}>Logout</button>
            )}
          </nav>

          <div className="nav-actions">
            <button type="button" className="theme-toggle" aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
            </button>
            <button type="button" className="menu-toggle" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="main-layout">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
