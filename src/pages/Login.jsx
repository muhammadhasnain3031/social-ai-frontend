import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, form);
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f0f2f5' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#fff' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>SocialAI</h1>
        <p style={{ fontSize: '16px', opacity: 0.85, textAlign: 'center', maxWidth: '300px', lineHeight: '1.6' }}>
          AI-powered social media management. Create, schedule & analyze posts with ease.
        </p>
        <div style={{ marginTop: '40px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['✨ AI Content', '📅 Auto Schedule', '📊 Analytics', '🎯 Multi-platform'].map(f => (
            <span key={f} style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px', color: '#111' }}>Welcome back</h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>Sign in to your SocialAI account</p>

          {error && <div style={{ background: '#fff0f0', color: '#e53e3e', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

          <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px', display: 'block' }}>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '14px', outline: 'none' }}
          />

          <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px', display: 'block' }}>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '20px', outline: 'none' }}
          />

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666' }}>
            No account? <Link to="/register" style={{ color: '#667eea', fontWeight: '600' }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}