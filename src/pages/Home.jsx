import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { PostCard } from '../components/PostCard';
import { Sidebar } from '../components/Sidebar';

export const Home = () => {
  const {
    paginatedPosts,
    filteredPosts,
    currentPage,
    setCurrentPage,
    totalPages,
    activeCategory,
    setActiveCategory,
    activeTag,
    setActiveTag,
    searchQuery,
    setSearchQuery
  } = useBlog();

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      {/* Hero Title Banner */}
      <section className="hero-banner">
        <h1 className="hero-title">Blog Posts</h1>
        <div className="hero-breadcrumb">
          <span>Home</span> / Blog
        </div>
      </section>

      {/* Active Filter Pills */}
      {(activeCategory || activeTag || searchQuery) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Active Filters:
          </span>
          {activeCategory && (
            <span className="tag-pill active" onClick={() => setActiveCategory(null)}>
              Category: {activeCategory} <X size={14} style={{ display: 'inline', marginLeft: '4px' }} />
            </span>
          )}
          {activeTag && (
            <span className="tag-pill active" onClick={() => setActiveTag(null)}>
              Tag: {activeTag} <X size={14} style={{ display: 'inline', marginLeft: '4px' }} />
            </span>
          )}
          {searchQuery && (
            <span className="tag-pill active" onClick={() => setSearchQuery('')}>
              Search: "{searchQuery}" <X size={14} style={{ display: 'inline', marginLeft: '4px' }} />
            </span>
          )}
        </div>
      )}

      {/* Main Grid & Sidebar Layout */}
      <div className="blog-layout">
        <div>
          {paginatedPosts.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '3rem',
                textAlign: 'center'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Blog Posts Found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Try clearing your active category, tag, or search filter.
              </p>
            </div>
          ) : (
            <div className="posts-grid">
              {paginatedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Numbered Pagination Control (Min 5 items per page) */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <button
                className="pagination-btn"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <Sidebar />
      </div>
    </div>
  );
};
