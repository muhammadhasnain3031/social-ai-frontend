import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPosts } from '../store/postsSlice';
import { fetchAnalytics } from '../store/analyticsSlice';

const PLATFORM_COLORS = { twitter: '#1DA1F2', instagram: '#E1306C', linkedin: '#0A66C2', facebook: '#1877F2' };
const PLATFORM_ICONS  = { twitter: '🐦', instagram: '📸', linkedin: '💼', facebook: '👥' };

export default function Dashboard() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { token } = useSelector(s => s.auth);
  const { items: posts } = useSelector(s => s.posts);
  const { data: stats }  = useSelector(s => s.analytics);

  useEffect(() => {
    dispatch(fetchPosts({ token }));
    dispatch(fetchAnalytics(token));
  }, [token, dispatch]);

  const recent = posts.slice(0, 5);

  const statCards = [
    { label: 'Total Posts',  value: stats?.total      || 0, icon: '📝', color: '#667eea' },
    { label: 'Published',    value: stats?.published  || 0, icon: '✅', color: '#48bb78' },
    { label: 'Scheduled',    value: stats?.scheduled  || 0, icon: '⏰', color: '#ed8936' },
    { label: 'AI Generated', value: stats?.aiPosts    || 0, icon: '✨', color: '#9b59b6' },
    { label: 'Total Reach',  value: (stats?.totalReach || 0).toLocaleString(), icon: '👥', color: '#1DA1F2' },
    { label: 'Total Likes',  value: (stats?.totalLikes || 0).toLocaleString(), icon: '❤️', color: '#E1306C' },
  ];

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: '#888', fontSize: '14px' }}>Overview of your social media performance</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {statCards.map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>{card.icon}</span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: card.color }} />
            </div>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>{card.value}</p>
            <p style={{ fontSize: '12px', color: '#888' }}>{card.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Recent Posts */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Recent Posts</h3>
            <button onClick={() => navigate('/schedule')}
              style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
              View all →
            </button>
          </div>

          {recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#bbb' }}>
              <p style={{ fontSize: '28px', marginBottom: '8px' }}>📝</p>
              <p style={{ fontSize: '13px' }}>No posts yet</p>
              <button onClick={() => navigate('/generate')}
                style={{ marginTop: '12px', padding: '8px 16px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                Create with AI
              </button>
            </div>
          ) : recent.map(post => (
            <div key={post._id} style={{ padding: '12px 0', borderBottom: '1px solid #f5f5f5', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {post.aiGenerated
                  ? <span style={{ background: '#f0f4ff', color: '#667eea', padding: '2px 7px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>✨ AI</span>
                  : <span style={{ background: '#f5f5f5', color: '#888', padding: '2px 7px', borderRadius: '8px', fontSize: '11px' }}>Manual</span>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>
                  {post.content}
                </p>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {post.platforms?.map(p => (
                    <span key={p} style={{ fontSize: '12px' }}>{PLATFORM_ICONS[p]}</span>
                  ))}
                  <span style={{
                    fontSize: '11px', padding: '1px 7px', borderRadius: '10px', fontWeight: '500',
                    background: post.status==='published'?'#f0fff4':post.status==='scheduled'?'#fffbea':'#f5f5f5',
                    color: post.status==='published'?'#276749':post.status==='scheduled'?'#854d0e':'#888',
                  }}>
                    {post.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Stats */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Posts by Platform</h3>
          {Object.entries(stats?.platformStats || {}).map(([platform, count]) => (
            <div key={platform} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {PLATFORM_ICONS[platform]} {platform.charAt(0).toUpperCase()+platform.slice(1)}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{count}</span>
              </div>
              <div style={{ background: '#f5f5f5', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '4px',
                  background: PLATFORM_COLORS[platform],
                  width: `${stats?.total ? Math.max((count/stats.total)*100, 4) : 0}%`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          ))}

          {/* Quick Actions */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '10px' }}>Quick Actions</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { label: '✨ Generate Post', to: '/generate', color: '#667eea' },
                { label: '📅 Schedule',      to: '/schedule', color: '#ed8936' },
                { label: '📈 Analytics',     to: '/analytics',color: '#48bb78' },
              ].map(a => (
                <button key={a.label} onClick={() => navigate(a.to)}
                  style={{ padding: '7px 12px', background: '#f8f8f8', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: a.color, fontWeight: '500' }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}