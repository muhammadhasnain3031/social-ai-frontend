import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../store/analyticsSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


export default function Analytics() {
  const dispatch  = useDispatch();
  const { token } = useSelector(s => s.auth);
  const { data: stats, loading } = useSelector(s => s.analytics);

  useEffect(() => { dispatch(fetchAnalytics(token)); }, [token, dispatch]);

  if (loading || !stats) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading analytics...</div>
  );

  const engagementCards = [
    { label: 'Total Reach',    value: (stats.totalReach   ||0).toLocaleString(), icon: '👥', color: '#1DA1F2' },
    { label: 'Total Likes',    value: (stats.totalLikes   ||0).toLocaleString(), icon: '❤️', color: '#E1306C' },
    { label: 'Total Comments', value: (stats.totalComments||0).toLocaleString(), icon: '💬', color: '#0A66C2' },
    { label: 'Total Shares',   value: (stats.totalShares  ||0).toLocaleString(), icon: '🔁', color: '#48bb78' },
  ];

  const platformData = Object.entries(stats.platformStats || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase()+name.slice(1), value
  }));

  const COLORS = ['#1DA1F2','#E1306C','#0A66C2','#1877F2'];

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1000px', margin: '0 auto' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>📈 Analytics</h1>
        <p style={{ color: '#888', fontSize: '14px' }}>Track your social media performance</p>
      </div>

      {/* Engagement Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {engagementCards.map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>{c.icon}</span>
              <div style={{ width: '32px', height: '4px', borderRadius: '2px', background: c.color, opacity: 0.6 }} />
            </div>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>{c.value}</p>
            <p style={{ fontSize: '12px', color: '#888' }}>{c.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Posts per day chart */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111' }}>Posts — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.last7Days || []} barSize={28}>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="posts" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platform distribution */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111' }}>Posts by Platform</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={platformData} barSize={36}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {platformData.map((_, i) => (
                  <rect key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Post status summary */}
      <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0f0f0', marginTop: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111' }}>Post Status Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
          {[
            { label: 'Total',     value: stats.total,     color: '#667eea', bg: '#f0f4ff' },
            { label: 'Published', value: stats.published, color: '#276749', bg: '#f0fff4' },
            { label: 'Scheduled', value: stats.scheduled, color: '#c2410c', bg: '#fff8f0' },
            { label: 'Drafts',    value: stats.drafts,    color: '#888',    bg: '#f5f5f5' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: '700', color: s.color }}>{s.value || 0}</p>
              <p style={{ fontSize: '12px', color: s.color, opacity: 0.8 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}