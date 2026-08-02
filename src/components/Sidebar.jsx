import React from 'react';
import { useBlog } from '../context/BlogContext';

export const Sidebar = () => {
  const {
    categories,
    tags,
    activeCategory,
    setActiveCategory,
    activeTag,
    setActiveTag
  } = useBlog();

  const handleCategoryClick = (catName) => {
    if (activeCategory === catName) {
      setActiveCategory(null);
    } else {
      setActiveCategory(catName);
    }
  };

  const handleTagClick = (tagName) => {
    if (activeTag === tagName) {
      setActiveTag(null);
    } else {
      setActiveTag(tagName);
    }
  };

  return (
    <aside className="sidebar">
      {/* Categories Widget */}
      <div className="sidebar-widget">
        <h3 className="widget-title">Categories</h3>
        <ul className="category-list">
          {categories.map((cat) => (
            <li
              key={cat.name}
              className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <span>{cat.name}</span>
              <span className="category-count">({cat.count})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags Widget */}
      <div className="sidebar-widget">
        <h3 className="widget-title">Tags</h3>
        <div className="tags-cloud">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`tag-pill ${activeTag === tag ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
