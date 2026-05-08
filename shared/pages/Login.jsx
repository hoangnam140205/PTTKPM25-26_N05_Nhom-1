import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const success = login(username, password);
    if (success) {
      // Navigate based on role
      if (username === 'admin') navigate('/admin');
      else if (username === 'staff') navigate('/staff/orders');
      else navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex-center animate-fade-in" style={{ height: '100vh', background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.1) 0%, rgba(13, 15, 18, 1) 100%)' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="btn-icon" style={{ background: 'var(--primary-color)', color: '#fff', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Lock size={32} />
          </div>
          <h2 className="heading-2" style={{ margin: 0 }}>Welcome Back</h2>
          <p className="text-muted">Sign in to Symphony</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ display: 'block', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Username (admin/staff/khachhang)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Password (123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <p>Demo Accounts (Password: 123):</p>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
            <li>Admin: <strong style={{ color: 'var(--text-main)' }}>admin</strong></li>
            <li>Staff: <strong style={{ color: 'var(--text-main)' }}>staff</strong></li>
            <li>Customer: <strong style={{ color: 'var(--text-main)' }}>khachhang</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
