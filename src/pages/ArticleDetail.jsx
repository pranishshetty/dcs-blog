import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Folder, Eye, Share2, Check, Link2 } from 'lucide-react';
import { useBlog } from '../context/BlogContext';

export const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { posts, incrementView } = useBlog();
  const [copied, setCopied] = useState(false);

  const post = posts.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) {
      incrementView(post.id);
    }
  }, [slug]);

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Article Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem 0' }}>
          The article you are looking for does not exist or has been removed.
        </p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Blog
        </button>
      </div>
    );
  }

  const currentUrl = window.location.href;
  const shareText = `Check out "${post.title}" on DCS Blog!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedPosts = posts
    .filter((p) => p.id !== post.id && p.categories.some((c) => post.categories.includes(c)))
    .slice(0, 2);

  return (
    <article className="article-container">
      <button
        className="read-more-btn"
        onClick={() => navigate('/')}
        style={{ marginBottom: '2rem', gap: '0.4rem' }}
      >
        <ArrowLeft size={16} /> Back to posts
      </button>

      <header className="article-header">
        <span className="article-category-badge">{post.categories[0]}</span>
        <h1 className="article-title">{post.title}</h1>

        <div className="article-meta-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.author}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <User size={18} />
            )}
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{post.author}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Folder size={16} />
            <span>{post.categories.join(', ')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={16} />
            <span>{post.date}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-blue)' }}>
            <Eye size={16} />
            <span>{post.views || 0} views</span>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className="article-cover-wrapper">
          {post.coverImage.startsWith('data:video/') || Boolean(post.coverImage.match(/\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i)) ? (
            <video
              controls
              autoPlay
              loop
              src={post.coverImage}
              className="article-cover-img"
              style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', borderRadius: '12px', backgroundColor: '#000' }}
            />
          ) : (
            <img src={post.coverImage} alt={post.title} className="article-cover-img" />
          )}
        </div>
      )}

      {/* Render HTML / Formatted Body */}
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Share Article Section */}
      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <h4 style={{ marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Share2 size={18} style={{ color: 'var(--accent-blue)' }} /> Share This Article
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* WhatsApp Share Button */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more-btn"
            style={{
              backgroundColor: '#25D366',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.994 9.994 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.037-5.176-2.922-7.062A9.927 9.927 0 0012.012 2zm5.835 14.195c-.247.693-1.436 1.327-1.98 1.385-.502.053-1.157.081-3.327-.81-2.775-1.139-4.571-3.957-4.708-4.14-.139-.183-1.116-1.488-1.116-2.838 0-1.35.705-2.013.955-2.263.247-.249.541-.311.723-.311.181 0 .363.003.522.01.171.007.4.015.586.438.192.435.652 1.587.708 1.701.057.114.095.249.019.4-.076.152-.114.248-.227.382-.114.134-.239.299-.341.401-.114.114-.233.238-.101.464.133.227.591.975 1.268 1.579.873.778 1.609 1.019 1.836 1.132.227.114.36.096.495-.057.135-.152.578-.673.733-.903.155-.23.31-.191.522-.114.212.076 1.344.634 1.573.748.229.114.382.172.438.268.057.095.057.553-.19 1.246z"/>
            </svg>
            WhatsApp
          </a>

          {/* Instagram Share / Link Button */}
          <a
            href={`https://www.instagram.com/`}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more-btn"
            style={{
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="read-more-btn"
            style={{
              backgroundColor: copied ? '#10b981' : 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {copied ? <Check size={16} /> : <Link2 size={16} />}
            {copied ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Article Tags */}
      {post.tags && post.tags.length > 0 && (
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h4 style={{ marginBottom: '1rem', fontWeight: 700 }}>Article Tags</h4>
          <div className="tags-cloud">
            {post.tags.map((t) => (
              <span key={t} className="tag-pill">
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            Related Articles
          </h3>
          <div className="posts-grid">
            {relatedPosts.map((rPost) => (
              <div key={rPost.id} className="post-card">
                <Link to={`/post/${rPost.slug}`} className="post-card-img-wrapper" style={{ height: '160px' }}>
                  <img src={rPost.coverImage} alt={rPost.title} className="post-card-img" />
                </Link>
                <div className="post-card-body" style={{ padding: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <Link to={`/post/${rPost.slug}`}>{rPost.title}</Link>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{rPost.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
