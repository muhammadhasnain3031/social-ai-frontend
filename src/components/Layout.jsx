import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const NAV = [
  { to: '/',          icon: '📊', label: 'Dashboard'  },
  { to: '/generate',  icon: '✨', label: 'AI Generate' },
  { to: '/schedule',  icon: '📅', label: 'Scheduler'   },
  { to: '/analytics', icon: '📈', label: 'Analytics'   },
];

const PLATFORM_COLORS = {
  twitter:   '#1DA1F2',
  instagram: '#E1306C',
  linkedin:  '#0A66C2',
  facebook:  '#1877F2',
};

export { PLATFORM_COLORS };

export default function Layout() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user }   = useSelector(s => s.auth);
  const [mob, setMob] = useState(false);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <aside style={{
        width: '240px', background: '#fff', borderRight: '1px solid #e8e8e8',
        display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              🚀
            </div>
            <div>
              <p style={{ fontWeight: '700', fontSize: '15px', color: '#111' }}>SocialAI</p>
              <p style={{ fontSize: '11px', color: '#888' }}>{user?.plan === 'pro' ? '⭐ Pro Plan' : 'Free Plan'}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '10px', marginBottom: '4px',
                textDecoration: 'none', fontSize: '14px', fontWeight: '500',
                background: isActive ? 'linear-gradient(135deg, #667eea15, #764ba215)' : 'transparent',
                color:      isActive ? '#667eea' : '#555',
                borderLeft: isActive ? '3px solid #667eea' : '3px solid transparent',
              })}>
              <span style={{ fontSize: '16px' }}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '14px', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '13px' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{user?.name}</p>
              <p style={{ fontSize: '11px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ width: '100%', padding: '8px', background: '#f8f0ff', border: 'none', borderRadius: '8px', color: '#764ba2', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}