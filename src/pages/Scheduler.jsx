import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, updatePost, deletePost } from '../store/postsSlice';

const STATUS_STYLES = {
  draft:     { bg: '#f5f5f5',  color: '#888',    label: 'Draft'     },
  scheduled: { bg: '#fff8f0',  color: '#c2410c', label: 'Scheduled' },
  published: { bg: '#f0fff4',  color: '#276749', label: 'Published' },
  failed:    { bg: '#fff0f0',  color: '#c53030', label: 'Failed'    },
};

const PLATFORM_ICONS = {
  twitter: '🐦', instagram: '📸', linkedin: '💼', facebook: '👥'
};

export default function Scheduler() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { token } = useSelector(s => s.auth);
  const { items: posts, loading } = useSelector(s => s.posts);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchPosts({ token }));
  }, [token, dispatch]);

  const filtered = filter === 'all'
    ? posts
    : posts.filter(p => p.status === filter);

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>
          📅 Post Scheduler
        </h1>
        <p style={{ color: '#888', fontSize: '14px' }}>
          Manage all your scheduled and published posts
        </p>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'draft', 'scheduled', 'published'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'capitalize',
              background: filter === f
                ? 'linear-gradient(135deg,#667eea,#764ba2)'
                : '#fff',
              color: filter === f ? '#fff' : '#666',
              border: filter === f ? 'none' : '1px solid #e2e8f0',
            }}>
            {f} ({f === 'all'
              ? posts.length
              : posts.filter(p => p.status === f).length})
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
          Loading...
        </p>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px',
          background: '#fff', borderRadius: '16px',
          border: '1px solid #f0f0f0', color: '#bbb',
        }}>
          <p style={{ fontSize: '36px', marginBottom: '12px' }}>📅</p>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
            No posts found
          </p>
          <button onClick={() => navigate('/generate')}
            style={{
              padding: '9px 20px',
              background: 'linear-gradient(135deg,#667eea,#764ba2)',
              color: '#fff', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
            }}>
            ✨ Create with AI
          </button>
        </div>
      )}

      {/* Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(post => {
          const ss = STATUS_STYLES[post.status] || STATUS_STYLES.draft;
          return (
            <div key={post._id} style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '18px',
              border: '1px solid #f0f0f0',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>

                {/* Badges */}
                <div style={{
                  display: 'flex', gap: '8px',
                  alignItems: 'center', marginBottom: '8px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    background: ss.bg, color: ss.color,
                    padding: '3px 10px', borderRadius: '10px',
                    fontSize: '11px', fontWeight: '600',
                  }}>
                    {ss.label}
                  </span>

                  {post.aiGenerated && (
                    <span style={{
                      background: '#f0f4ff', color: '#667eea',
                      padding: '3px 8px', borderRadius: '10px',
                      fontSize: '11px', fontWeight: '600',
                    }}>
                      ✨ AI
                    </span>
                  )}

                  {(post.platforms || []).map(p => (
                    <span key={p} style={{ fontSize: '14px' }}>
                      {PLATFORM_ICONS[p] || '📱'}
                    </span>
                  ))}
                </div>

                {/* Content text */}
                <p style={{
                  fontSize: '14px', color: '#333',
                  lineHeight: '1.5', marginBottom: '8px',
                }}>
                  {post.content?.length > 200
                    ? post.content.substring(0, 200) + '...'
                    : post.content}
                </p>

                {/* Hashtags */}
                {(post.hashtags || []).length > 0 && (
                  <div style={{
                    display: 'flex', flexWrap: 'wrap',
                    gap: '4px', marginBottom: '8px',
                  }}>
                    {post.hashtags.slice(0, 3).map((h, i) => (
                      <span key={i} style={{
                        fontSize: '11px', color: '#667eea',
                        background: '#f0f4ff',
                        padding: '2px 7px', borderRadius: '8px',
                      }}>
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta info */}
                <div style={{
                  display: 'flex', gap: '16px',
                  fontSize: '12px', color: '#888', flexWrap: 'wrap',
                }}>
                  {post.scheduledAt && (
                    <span>📅 {new Date(post.scheduledAt).toLocaleString()}</span>
                  )}
                  {post.publishedAt && (
                    <span>✅ {new Date(post.publishedAt).toLocaleDateString()}</span>
                  )}
                  {post.status === 'published' && (
                    <>
                      <span>❤️ {post.analytics?.likes    || 0}</span>
                      <span>💬 {post.analytics?.comments || 0}</span>
                      <span>🔁 {post.analytics?.shares   || 0}</span>
                      <span>👥 {post.analytics?.reach    || 0}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {post.status === 'draft' && (
                  <button
                    onClick={() => dispatch(updatePost({
                      id: post._id,
                      data: { status: 'published' },
                      token,
                    }))}
                    style={{
                      padding: '6px 12px',
                      background: '#f0fff4',
                      border: '1px solid #c6f6d5',
                      borderRadius: '7px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: '#276749',
                      fontWeight: '500',
                    }}>
                    Publish
                  </button>
                )}
                <button
                  onClick={() => dispatch(deletePost({ id: post._id, token }))}
                  style={{
                    padding: '6px 10px',
                    background: '#fff0f0',
                    border: '1px solid #fed7d7',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#c53030',
                  }}>
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}