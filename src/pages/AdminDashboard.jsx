import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit3, Trash2, Eye, LogOut, BarChart2, CheckCircle, FileText, Download } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { posts, deletePost, updatePost } = useBlog();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleTogglePublish = (post) => {
    updatePost(post.id, { published: !post.published });
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
            {posts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No posts found. Click "New Post" to create your first article.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
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
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
