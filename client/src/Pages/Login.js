import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import EgyptGlobe from '../components/EgyptGlobe';

function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [theme, setTheme]       = useState(() => localStorage.getItem('darvo-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('darvo-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed. Please check your credentials.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));

      setSuccess('Welcome back! Redirecting...');
      setEmail('');
      setPassword('');

      const user = data.data;
      setTimeout(() => {
        window.location.href = user.role === 'admin' ? '/admin/properties' : '/home';
      }, 1200);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* ── Left brand panel ── */}
      <div className="auth-panel">
        <div className="auth-panel-grid" />
        <div className="auth-panel-globe-area">
          <EgyptGlobe theme={theme} />
        </div>
        <div className="auth-panel-brand">
          <span className="darvo-logo">Darvo <span>Estates</span></span>
          <p className="auth-panel-tagline">
            Egypt's premier property platform — find, compare, and list real estate with confidence.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner fade-in-up">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          <div className="auth-form-header">
            <h1>Welcome back</h1>
            <p>Sign in to your Darvo account to continue</p>
          </div>

          {error && (
            <div className="auth-alert error">
              <div className="auth-alert-icon">!</div>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="auth-alert success">
              <div className="auth-alert-icon">✓</div>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className={`auth-submit-btn${loading ? ' loading' : ''}`}
              disabled={loading}
            >
              {loading ? '' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-link">
            Don&apos;t have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
