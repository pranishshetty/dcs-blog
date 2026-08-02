import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialPosts, initialCategories, initialTags, initialAnalytics } from '../data/initialData';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('dcs_blog_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [categoryNames, setCategoryNames] = useState(() => {
    const saved = localStorage.getItem('dcs_blog_category_names');
    return saved ? JSON.parse(saved) : initialCategories.map((c) => c.name);
  });

  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState(initialTags);
  const [analytics, setAnalytics] = useState(() => {
    const saved = localStorage.getItem('dcs_blog_analytics');
    return saved ? JSON.parse(saved) : initialAnalytics;
  });

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // Minimum 5 posts per page requirement

  // Fetch initial data from PHP API if available
  useEffect(() => {
    fetch('/api/posts.php')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts);
        }
      })
      .catch(() => {});

    fetch('/api/categories.php')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategoryNames(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('dcs_blog_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('dcs_blog_category_names', JSON.stringify(categoryNames));
  }, [categoryNames]);

  useEffect(() => {
    localStorage.setItem('dcs_blog_analytics', JSON.stringify(analytics));
  }, [analytics]);

  // Recalculate Category counts dynamically
  useEffect(() => {
    const updated = categoryNames.map((catName) => {
      const count = posts.filter(p => p.published && p.categories && p.categories.includes(catName)).length;
      return { name: catName, count };
    });
    setCategories(updated);
  }, [categoryNames, posts]);

  // Category Actions: Add and Delete
  const addCategory = (name) => {
    const trimmed = name.trim();
    if (!trimmed || categoryNames.includes(trimmed)) return;

    const updated = [...categoryNames, trimmed];
    setCategoryNames(updated);

    fetch('/api/categories.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed })
    }).catch(() => {});
  };

  const deleteCategory = (name) => {
    const updated = categoryNames.filter((c) => c !== name);
    setCategoryNames(updated);

    fetch(`/api/categories.php?name=${encodeURIComponent(name)}`, {
      method: 'DELETE'
    }).catch(() => {});
  };

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeTag, searchQuery]);

  // Filtered posts logic
  const filteredPosts = posts.filter((post) => {
    if (!post.published) return false;
    if (activeCategory && post.categories && !post.categories.includes(activeCategory)) return false;
    if (activeTag && post.tags && !post.tags.includes(activeTag)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchAuthor = post.author.toLowerCase().includes(q);
      return matchTitle || matchExcerpt || matchAuthor;
    }
    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Increment view count when article opened & sync with backend server
  const incrementView = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const updatedViews = (p.views || 0) + 1;

          // Sync view count update with PHP backend API
          fetch('/api/posts.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: postId, views: updatedViews })
          }).catch(() => {});

          return { ...p, views: updatedViews };
        }
        return p;
      })
    );

    setAnalytics((prev) => ({
      ...prev,
      totalViews: prev.totalViews + 1
    }));
  };

  // Admin Actions: Create, Edit, Delete Post
  const addPost = (newPost) => {
    const created = {
      ...newPost,
      id: `post-${Date.now()}`,
      slug: newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      views: 0,
      published: true
    };
    setPosts([created, ...posts]);
    setAnalytics((prev) => ({
      ...prev,
      totalPosts: prev.totalPosts + 1
    }));

    fetch('/api/posts.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    }).catch(() => {});

    return created;
  };

  const updatePost = (id, updatedData) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));

    fetch('/api/posts.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updatedData })
    }).catch(() => {});
  };

  const deletePost = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
    setAnalytics((prev) => ({
      ...prev,
      totalPosts: Math.max(0, prev.totalPosts - 1)
    }));

    fetch(`/api/posts.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }).catch(() => {});
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        filteredPosts,
        paginatedPosts,
        categories,
        tags,
        analytics,
        activeCategory,
        setActiveCategory,
        activeTag,
        setActiveTag,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        currentPage,
        setCurrentPage,
        totalPages,
        postsPerPage,
        incrementView,
        addPost,
        updatePost,
        deletePost,
        addCategory,
        deleteCategory
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);
