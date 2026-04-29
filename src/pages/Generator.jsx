import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { generatePost, generateIdeas, createPost, clearGenerated } from '../store/postsSlice';

const PLATFORMS = ['twitter','instagram','linkedin','facebook'];
const TONES     = ['professional','casual','funny','inspirational'];
const PLATFORM_ICONS = { twitter:'🐦', instagram:'📸', linkedin:'💼', facebook:'👥' };

export default function Generator() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { token } = useSelector(s => s.auth);
  const { generated, ideas, aiLoading } = useSelector(s => s.posts);

  const [form, setForm] = useState({
    topic: '', platform: 'instagram', tone: 'professional', keywords: ''
  });
  const [editedContent, setEditedContent]     = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram']);
  const [scheduleDate, setScheduleDate]       = useState('');
  const [saving, setSaving]                   = useState(false);
  const [tab, setTab]                         = useState('generate');
  const [niche, setNiche]                     = useState('');

  const handleGenerate = async () => {
    const result = await dispatch(generatePost({ data: form, token }));
    if (result.payload?.content) setEditedContent(result.payload.content);
  };

  const handleGetIdeas = async () => {
    dispatch(generateIdeas({ data: { niche, count: 6 }, token }));
  };

  const togglePlatform = (p) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const handleSave = async (status) => {
    if (!editedContent.trim()) return;
    setSaving(true);
    await dispatch(createPost({
      data: {
        content:     editedContent,
        platforms:   selectedPlatforms,
        status,
        scheduledAt: status === 'scheduled' ? new Date(scheduleDate) : undefined,
        aiGenerated: true,
        topic:       form.topic,
        tone:        form.tone,
        hashtags:    generated?.hashtags || [],
      },
      token,
    }));
    setSaving(false);
    dispatch(clearGenerated());
    setEditedContent('');
    navigate('/schedule');
  };

  const inp = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: '8px',
    fontSize: '13px', boxSizing: 'border-box',
    outline: 'none', background: '#fff',
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1000px', margin: '0 auto' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>
          ✨ AI Content Generator
        </h1>
        <p style={{ color: '#888', fontSize: '14px' }}>
          Create engaging posts with AI in seconds
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[['generate','✨ Generate Post'],['ideas','💡 Get Ideas']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', borderRadius: '20px', cursor: 'pointer',
            fontSize: '13px', fontWeight: '600',
            background: tab === t ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#fff',
            color:      tab === t ? '#fff' : '#666',
            border:     tab === t ? 'none' : '1px solid #e2e8f0',
          }}>
            {l}
          </button>
        ))}
      </div>

      {/* ===== GENERATE TAB ===== */}
      {tab === 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px' }}>

          {/* Left — Form */}
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '22px',
            border: '1px solid #f0f0f0', height: 'fit-content',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111' }}>
              Post Settings
            </h3>

            {/* Topic */}
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px', display: 'block' }}>
              Topic
            </label>
            <textarea
              value={form.topic}
              onChange={e => setForm({ ...form, topic: e.target.value })}
              placeholder="e.g. Benefits of morning exercise..."
              rows={3}
              style={{ ...inp, resize: 'none', marginBottom: '14px', lineHeight: '1.6' }}
            />

            {/* Platform */}
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '8px', display: 'block' }}>
              Platform
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setForm({ ...form, platform: p })} style={{
                  padding: '8px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: '500',
                  background: form.platform === p ? '#f0f4ff' : '#fff',
                  color:      form.platform === p ? '#667eea' : '#666',
                  border:     form.platform === p ? '1.5px solid #667eea' : '1.5px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  {PLATFORM_ICONS[p]} {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            {/* Tone */}
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '8px', display: 'block' }}>
              Tone
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
              {TONES.map(t => (
                <button key={t} onClick={() => setForm({ ...form, tone: t })} style={{
                  padding: '7px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: '500', textTransform: 'capitalize',
                  background: form.tone === t ? '#f0f4ff' : '#fff',
                  color:      form.tone === t ? '#667eea' : '#666',
                  border:     form.tone === t ? '1.5px solid #667eea' : '1.5px solid #e2e8f0',
                }}>
                  {t}
                </button>
              ))}
            </div>

            {/* Keywords */}
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px', display: 'block' }}>
              Keywords (optional)
            </label>
            <input
              value={form.keywords}
              onChange={e => setForm({ ...form, keywords: e.target.value })}
              placeholder="innovation, growth, success..."
              style={{ ...inp, marginBottom: '16px' }}
            />

            <button
              onClick={handleGenerate}
              disabled={!form.topic.trim() || aiLoading}
              style={{
                width: '100%', padding: '12px', border: 'none',
                borderRadius: '10px', cursor: form.topic.trim() && !aiLoading ? 'pointer' : 'not-allowed',
                fontSize: '14px', fontWeight: '600', color: '#fff',
                background: form.topic.trim() && !aiLoading
                  ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#ccc',
              }}>
              {aiLoading ? '⏳ Generating...' : '✨ Generate with AI'}
            </button>
          </div>

          {/* Right — Output */}
          <div>
            {/* Empty state */}
            {!generated && !aiLoading && (
              <div style={{
                background: '#fff', borderRadius: '16px', padding: '50px 40px',
                border: '1px solid #f0f0f0', textAlign: 'center',
              }}>
                <p style={{ fontSize: '44px', marginBottom: '14px' }}>✨</p>
                <p style={{ fontSize: '15px', color: '#888', marginBottom: '6px' }}>
                  Fill in the settings and click Generate
                </p>
                <p style={{ fontSize: '13px', color: '#bbb' }}>
                  AI will create the perfect post for you
                </p>
              </div>
            )}

            {/* Loading */}
            {aiLoading && (
              <div style={{
                background: '#fff', borderRadius: '16px', padding: '50px 40px',
                border: '1px solid #f0f0f0', textAlign: 'center',
              }}>
                <div style={{ display: 'inline-flex', gap: '6px', marginBottom: '16px' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: '#667eea',
                      animation: 'bounce 1.2s infinite',
                      animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </div>
                <p style={{ color: '#888', fontSize: '14px' }}>AI is crafting your post...</p>
              </div>
            )}

            {/* Generated Result */}
            {generated && !aiLoading && (
              <div style={{
                background: '#fff', borderRadius: '16px', padding: '22px',
                border: '1px solid #f0f0f0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>Generated Post</h3>
                  <span style={{
                    background: '#f0f4ff', color: '#667eea',
                    padding: '3px 10px', borderRadius: '10px',
                    fontSize: '11px', fontWeight: '600',
                  }}>✨ AI Generated</span>
                </div>

                {/* Editable Content */}
                <textarea
                  value={editedContent}
                  onChange={e => setEditedContent(e.target.value)}
                  rows={6}
                  style={{ ...inp, resize: 'vertical', lineHeight: '1.7', marginBottom: '14px', fontSize: '14px' }}
                />

                {/* Hashtags */}
                {generated.hashtags?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
                      Suggested Hashtags (click to add)
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {generated.hashtags.map((h, i) => (
                        <span key={i}
                          onClick={() => setEditedContent(prev => prev + ' ' + h)}
                          style={{
                            background: '#f0f4ff', color: '#667eea',
                            padding: '4px 10px', borderRadius: '12px',
                            fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                          }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Platform selection */}
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
                    Publish to platforms
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {PLATFORMS.map(p => (
                      <button key={p} onClick={() => togglePlatform(p)} style={{
                        padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                        fontSize: '12px', fontWeight: '500',
                        background: selectedPlatforms.includes(p) ? '#f0f4ff' : '#fff',
                        color:      selectedPlatforms.includes(p) ? '#667eea' : '#666',
                        border:     selectedPlatforms.includes(p) ? '1.5px solid #667eea' : '1.5px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', gap: '5px',
                      }}>
                        {PLATFORM_ICONS[p]} {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Schedule Date */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px', display: 'block' }}>
                    Schedule for (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    style={inp}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleSave('draft')} disabled={saving} style={{
                    flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '500', color: '#555',
                    background: '#f5f5f5', border: '1px solid #e2e8f0',
                  }}>
                    💾 Save Draft
                  </button>

                  {scheduleDate && (
                    <button onClick={() => handleSave('scheduled')} disabled={saving} style={{
                      flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '13px', fontWeight: '500', color: '#c2410c',
                      background: '#fff8f0', border: '1px solid #fed7aa',
                    }}>
                      📅 Schedule
                    </button>
                  )}

                  <button onClick={() => handleSave('published')} disabled={saving} style={{
                    flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '600', color: '#fff', border: 'none',
                    background: 'linear-gradient(135deg,#667eea,#764ba2)',
                  }}>
                    {saving ? 'Saving...' : '🚀 Publish Now'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== IDEAS TAB ===== */}
      {tab === 'ideas' && (
        <div style={{
          background: '#fff', borderRadius: '16px', padding: '22px',
          border: '1px solid #f0f0f0',
        }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              value={niche}
              onChange={e => setNiche(e.target.value)}
              placeholder="Enter your niche (e.g. fitness, tech startup, food blog)"
              style={{ ...inp, flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && handleGetIdeas()}
            />
            <button onClick={handleGetIdeas} disabled={!niche.trim() || aiLoading} style={{
              padding: '10px 20px', border: 'none', borderRadius: '8px',
              cursor: niche.trim() && !aiLoading ? 'pointer' : 'not-allowed',
              fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap',
              background: niche.trim() && !aiLoading
                ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#ccc',
            }}>
              {aiLoading ? '⏳...' : '💡 Get Ideas'}
            </button>
          </div>

          {/* Ideas Grid */}
          {ideas.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '14px' }}>
              {ideas.map((idea, i) => (
                <div key={i}
                  onClick={() => {
                    setForm({ ...form, topic: idea.title, platform: idea.platform || 'instagram' });
                    setTab('generate');
                  }}
                  style={{
                    background: '#f8f9ff', borderRadius: '12px', padding: '16px',
                    border: '1px solid #e8ecff', cursor: 'pointer',
                    transition: 'transform 0.15s',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <p style={{ fontWeight: '600', fontSize: '14px', color: '#111', flex: 1, marginRight: '8px' }}>
                      {idea.title}
                    </p>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>
                      {PLATFORM_ICONS[idea.platform] || '📱'}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.5', marginBottom: '10px' }}>
                    {idea.description}
                  </p>
                  <span style={{
                    fontSize: '11px', background: '#e8ecff', color: '#667eea',
                    padding: '3px 8px', borderRadius: '8px', fontWeight: '500',
                  }}>
                    Use this idea →
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {ideas.length === 0 && !aiLoading && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#bbb' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>💡</p>
              <p style={{ fontSize: '14px', color: '#888' }}>
                Enter your niche to get AI-powered content ideas
              </p>
            </div>
          )}

          {/* Loading */}
          {aiLoading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ display: 'inline-flex', gap: '6px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '10px', height: '10px', borderRadius: '50%', background: '#667eea',
                    animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}