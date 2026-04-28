import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`${API}/api/auth/register`, form);
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f0f2f5' }}>
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#fff' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>Join SocialAI</h1>
        <p style={{ fontSize: '16px', opacity: 0.85, textAlign: 'center', maxWidth: '300px', lineHeight: '1.6' }}>
          Start creating AI-powered social media content in minutes.
        </p>
        {['✓ Free forever plan', '✓ AI post generation', '✓ Multi-platform support', '✓ Analytics dashboard'].map(f => (
          <p key={f} style={{ marginTop: '8px', fontSize: '14px', opacity: 0.9 }}>{f}</p>
        ))}
      </div>

      <div style={{ width: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Create account</h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>Free forever, no credit card needed</p>

          {error && <div style={{ background: '#fff0f0', color: '#e53e3e', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

          {[['name','Full Name','text'],['email','Email','email'],['password','Password','password']].map(([k,p,t]) => (
            <div key={k}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px', display: 'block' }}>{p}</label>
              <input type={t} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} placeholder={p}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '14px', outline: 'none' }}
              />
            </div>
          ))}

          <button onClick={handleSubmit}
            style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            Create Free Account →
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666' }}>
            Already have account? <Link to="/login" style={{ color: '#667eea', fontWeight: '600' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}