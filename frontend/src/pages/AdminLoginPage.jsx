import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back-link"><ArrowLeft size={16} /> Back to portfolio</Link>
      <div className="auth-card">
        <div className="auth-icon"><ShieldCheck size={24} /></div>
        <span className="eyebrow">Private workspace</span>
        <h1>Welcome back</h1>
        <p className="auth-description">Sign in to manage your portfolio, projects, and messages.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Email address</span>
            <input type="email" autoComplete="username" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            <span>Password</span>
            <span className="password-field">
              <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
          {error && <div className="status-box error" role="alert">{error}</div>}
          <button type="submit" className="button primary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in to dashboard'}
          </button>
        </form>
        <p className="auth-footnote">Authorized administrators only.</p>
      </div>
    </div>
  );
}
