import React from 'react';
import { Link } from 'react-router-dom';
import { User, Folder, Calendar } from 'lucide-react';

export const PostCard = ({ post }) => {
  const isVideo =
    post.coverImage &&
    (post.coverImage.startsWith('data:video/') ||
      Boolean(post.coverImage.match(/\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i)));

  return (
    <article className="post-card">
      <Link to={`/post/${post.slug}`} className="post-card-img-wrapper">
        {post.coverImage ? (
          isVideo ? (
            <video
              src={post.coverImage}
              className="post-card-img"
              autoPlay
              loop
              muted
              playsInline
              style={{ objectFit: 'contain', width: '100%', height: '100%', backgroundColor: '#000' }}
            />
          ) : (
            <>
              <img src={post.coverImage} alt="" className="post-card-img-blur" aria-hidden="true" />
              <img src={post.coverImage} alt={post.title} className="post-card-img" />
            </>
          )
        ) : (
          <div className="post-card-placeholder">
            <span style={{ fontSize: '2rem' }}>📷</span>
            <span>Media Preview</span>
          </div>
        )}
      </Link>

      <div className="post-card-body">
        <h3 className="post-card-title">
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h3>

        <div className="post-card-meta">
          <div className="post-meta-item post-meta-author">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.author}
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <User size={15} />
            )}
            <span>{post.author}</span>
          </div>

          <div className="post-meta-item post-meta-categories">
            <Folder size={15} />
            <span>{post.categories.join(', ')}</span>
          </div>

          <div className="post-meta-item">
            <Calendar size={15} />
            <span>{post.date}</span>
          </div>
        </div>

        <p className="post-card-excerpt">{post.excerpt}</p>

        <Link to={`/post/${post.slug}`} className="read-more-btn">
          read more
        </Link>
      </div>
    </article>
  );
};
