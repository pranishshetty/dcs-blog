import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useBlog } from '../context/BlogContext';

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, filteredPosts } = useBlog();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleSelectPost = (slug) => {
    setIsSearchOpen(false);
    navigate(`/post/${slug}`);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSearchOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search size={20} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search blog posts by title, tag, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="icon-btn" onClick={() => setIsSearchOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="search-results-list">
          {searchQuery.trim() === '' ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
              Type something to begin searching...
            </p>
          ) : filteredPosts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
              No articles found matching "{searchQuery}"
            </p>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="search-result-item"
                onClick={() => handleSelectPost(post.slug)}
              >
                <h4 style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{post.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {post.author} • {post.categories.join(', ')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
