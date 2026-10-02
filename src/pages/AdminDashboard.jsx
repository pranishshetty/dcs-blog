import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit3, Trash2, Eye, LogOut, BarChart2, CheckCircle, FileText, Download, Clock, Calendar, AlertCircle, X, Check } from 'lucide-react';
import { useBlog, getPostStatus } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { posts, deletePost, updatePost } = useBlog();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Filter tab state: 'all' | 'published' | 'scheduled' | 'draft'
  const [filterTab, setFilterTab] = useState('all');

  // Quick Schedule Modal state
  const [scheduleModalPost, setScheduleModalPost] = useState(null);
  const [newScheduleTime, setNewScheduleTime] = useState('');

  const handleTogglePublish = (post) => {
    const status = getPostStatus(post);
    if (status === 'scheduled') {
      openScheduleModal(post);
    } else {
      updatePost(post.id, { published: !post.published, scheduledAt: null });
    }
  };

  const openScheduleModal = (post) => {
    setScheduleModalPost(post);
    if (post.scheduledAt) {
      const d = new Date(post.scheduledAt);
      const pad = (n) => String(n).padStart(2, '0');
      setNewScheduleTime(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
    } else {
      const target = new Date();
      target.setDate(target.getDate() + 1);
      target.setHours(9, 0, 0, 0);
      const pad = (n) => String(n).padStart(2, '0');
      setNewScheduleTime(`${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`);
    }
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!newScheduleTime) return;
    const timeVal = new Date(newScheduleTime).getTime();
    if (isNaN(timeVal) || timeVal <= Date.now()) {
      alert('Please choose a future date and time.');
      return;
    }
    updatePost(scheduleModalPost.id, {
      published: true,
      scheduledAt: new Date(newScheduleTime).toISOString()
    });
    setScheduleModalPost(null);
  };

  const handlePublishImmediately = () => {
    if (!scheduleModalPost) return;
    updatePost(scheduleModalPost.id, {
      published: true,
      scheduledAt: null,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setScheduleModalPost(null);
  };

  const handleRevertToDraft = () => {
    if (!scheduleModalPost) return;
    updatePost(scheduleModalPost.id, {
      published: false,
      scheduledAt: null
    });
    setScheduleModalPost(null);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deletePost(id);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleBackup = () => {
    window.open('/api/backup.php', '_blank');
  };

  // Status counts
  const publishedPosts = posts.filter(p => getPostStatus(p) === 'published');
  const scheduledPosts = posts.filter(p => getPostStatus(p) === 'scheduled').sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  const draftPosts = posts.filter(p => getPostStatus(p) === 'draft');

  const displayedPosts = posts.filter(p => {
    if (filterTab === 'all') return true;
    return getPostStatus(p) === filterTab;
  });

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">DCS Content Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage, edit, publish, and delete blog articles across the DCS platform.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleBackup}
            className="btn-primary"
            style={{ backgroundColor: 'var(--accent-green)', gap: '0.4rem' }}
            title="Download full backup ZIP of articles and uploaded media"
          >
            <Download size={18} /> Backup Data & Photos
          </button>
          <Link to="/analytics" className="btn-primary" style={{ backgroundColor: 'var(--accent-purple)' }}>
            <BarChart2 size={18} /> Analytics
          </Link>
          <Link to="/admin/editor" className="btn-primary">
            <Plus size={18} /> New Post
          </Link>
          <button className="read-more-btn" onClick={handleLogout} style={{ gap: '0.4rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Scheduled Posts Notice Banner */}
      {scheduledPosts.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid var(--accent-purple)',
          borderRadius: '12px',
          padding: '0.9rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-purple)', fontWeight: 600, fontSize: '0.92rem' }}>
            <Clock size={18} />
            <span>
              <strong>{scheduledPosts.length} post{scheduledPosts.length > 1 ? 's' : ''} scheduled</strong> to be published automatically. Next release: <em>"{scheduledPosts[0].title}"</em> ({new Date(scheduledPosts[0].scheduledAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })})
            </span>
          </div>
          <button
            onClick={() => setFilterTab('scheduled')}
            className="read-more-btn"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}
          >
            View Scheduled Pipeline
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterTab('all')}
            className={`tag-pill ${filterTab === 'all' ? 'active' : ''}`}
            style={{ fontWeight: 700 }}
          >
            All Articles ({posts.length})
          </button>
          <button
            onClick={() => setFilterTab('published')}
            className={`tag-pill ${filterTab === 'published' ? 'active' : ''}`}
            style={{ fontWeight: 700 }}
          >
            Published ({publishedPosts.length})
          </button>
          <button
            onClick={() => setFilterTab('scheduled')}
            className={`tag-pill ${filterTab === 'scheduled' ? 'active' : ''}`}
            style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Clock size={13} /> Scheduled ({scheduledPosts.length})
          </button>
          <button
            onClick={() => setFilterTab('draft')}
            className={`tag-pill ${filterTab === 'draft' ? 'active' : ''}`}
            style={{ fontWeight: 700 }}
          >
            Drafts ({draftPosts.length})
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing {displayedPosts.length} of {posts.length} articles
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Category</th>
              <th>Author</th>
              <th>Date</th>
              <th>Views</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedPosts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  {filterTab === 'scheduled' ? 'No scheduled posts found. Use "Schedule for Later" when creating or editing posts.' : 'No posts found in this view.'}
                </td>
              </tr>
            ) : (
              displayedPosts.map((post) => {
                const status = getPostStatus(post);
                return (
                  <tr key={post.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          style={{ width: '48px', height: '36px', borderRadius: '6px', objectFit: 'cover', backgroundColor: 'var(--bg-elevated)' }}
                        />
                        <div>
                          <Link
                            to={`/post/${post.slug}`}
                            style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}
                          >
                            {post.title}
                          </Link>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            slug: /{post.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {post.categories ? post.categories.join(', ') : 'Uncategorized'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{post.author}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{post.date}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                        {post.views || 0}
                      </span>
                    </td>
                    <td>
                      {status === 'scheduled' ? (
                        <div>
                          <button
                            onClick={() => openScheduleModal(post)}
                            title="Click to change schedule or publish now"
                            style={{
                              padding: '0.25rem 0.6rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: 'rgba(139, 92, 246, 0.15)',
                              color: 'var(--accent-purple)',
                              border: '1px solid var(--accent-purple)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Clock size={12} /> Scheduled
                          </button>
                          <div style={{ fontSize: '0.72rem', color: 'var(--accent-purple)', marginTop: '3px', fontWeight: 500 }}>
                            {new Date(post.scheduledAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleTogglePublish(post)}
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: post.published ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: post.published ? '#10b981' : '#f59e0b',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </button>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => openScheduleModal(post)}
                          className="icon-btn"
                          title="Schedule / Change Publish Time"
                          style={{ color: status === 'scheduled' ? 'var(--accent-purple)' : undefined }}
                        >
                          <Clock size={16} />
                        </button>
                        <Link
                          to={`/post/${post.slug}`}
                          className="icon-btn"
                          title="Preview Article"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/editor/${post.id}`}
                          className="icon-btn"
                          title="Edit Article"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          className="icon-btn"
                          style={{ color: '#ef4444' }}
                          onClick={() => handleDelete(post.id, post.title)}
                          title="Delete Article"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Schedule Modal */}
      {scheduleModalPost && (
        <div className="modal-overlay" style={{ zIndex: 400 }}>
          <div className="modal-content" style={{ maxWidth: '480px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Clock size={18} style={{ color: 'var(--accent-purple)' }} /> Post Scheduler
              </h3>
              <button onClick={() => setScheduleModalPost(null)} className="icon-btn">
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Schedule automated publishing for: <strong>"{scheduleModalPost.title}"</strong>
            </p>

            <form onSubmit={handleSaveSchedule}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={14} /> Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={newScheduleTime}
                  onChange={(e) => setNewScheduleTime(e.target.value)}
                  required
                />
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    const t = new Date();
                    t.setHours(t.getHours() + 1);
                    const pad = (n) => String(n).padStart(2, '0');
                    setNewScheduleTime(`${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}T${pad(t.getHours())}:${pad(t.getMinutes())}`);
                  }}
                  className="read-more-btn"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                >
                  +1 Hr
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const t = new Date();
                    t.setDate(t.getDate() + 1);
                    t.setHours(9, 0, 0, 0);
                    const pad = (n) => String(n).padStart(2, '0');
                    setNewScheduleTime(`${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}T${pad(t.getHours())}:${pad(t.getMinutes())}`);
                  }}
                  className="read-more-btn"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                >
                  Tomorrow 9 AM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const t = new Date();
                    t.setDate(t.getDate() + 1);
                    t.setHours(18, 0, 0, 0);
                    const pad = (n) => String(n).padStart(2, '0');
                    setNewScheduleTime(`${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}T${pad(t.getHours())}:${pad(t.getMinutes())}`);
                  }}
                  className="read-more-btn"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                >
                  Tomorrow 6 PM
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handlePublishImmediately}
                    className="read-more-btn"
                    style={{ fontSize: '0.8rem', color: 'var(--accent-green)', borderColor: 'var(--accent-green)' }}
                    title="Publish this article immediately"
                  >
                    ⚡ Publish Now
                  </button>
                  <button
                    type="button"
                    onClick={handleRevertToDraft}
                    className="read-more-btn"
                    style={{ fontSize: '0.8rem', color: '#f59e0b', borderColor: '#f59e0b' }}
                    title="Move to draft"
                  >
                    Save as Draft
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="read-more-btn"
                    onClick={() => setScheduleModalPost(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ backgroundColor: 'var(--accent-purple)' }}
                  >
                    <Clock size={16} /> Save Schedule
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
