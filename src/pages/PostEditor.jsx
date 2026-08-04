import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image, Video, Eye, Bold, Heading, Quote, Plus, Trash2, Upload, Minus, List } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { formatArticleContent } from '../utils/formatContent';

export const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, addPost, updatePost, categories: availableCategories, addCategory, deleteCategory } = useBlog();

  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('John Doe');
  const [authorAvatar, setAuthorAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
  const [coverImage, setCoverImage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['Application']);
  const [tagsInput, setTagsInput] = useState('React, Technology, Software');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  // Category creation & media upload states
  const [newCatInput, setNewCatInput] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const existing = posts.find((p) => p.id === id);
      if (existing) {
        setTitle(existing.title || '');
        setAuthor(existing.author || 'John Doe');
        setAuthorAvatar(existing.authorAvatar || '');
        setCoverImage(existing.coverImage || '');
        setSelectedCategories(existing.categories || ['Application']);
        setTagsInput(existing.tags ? existing.tags.join(', ') : '');
        setExcerpt(existing.excerpt || '');
        setContent(existing.content || '');
      }
    } else {
      setCoverImage('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80');
    }
  }, [id, isEditing, posts]);

  const isVideoUrl = (url) => {
    if (!url) return false;
    return url.startsWith('data:video/') || Boolean(url.match(/\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i));
  };

  const handleFileUpload = async (file, setMediaUrl, setLoading) => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success && data.url) {
        setMediaUrl(data.url);
      } else {
        // Fallback to FileReader Data URL if API fails or offline
        const reader = new FileReader();
        reader.onload = (e) => {
          setMediaUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      // Fallback for local development when PHP server is not active
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (catName) => {
    if (selectedCategories.includes(catName)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catName));
      }
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    addCategory(newCatInput.trim());
    if (!selectedCategories.includes(newCatInput.trim())) {
      setSelectedCategories([...selectedCategories, newCatInput.trim()]);
    }
    setNewCatInput('');
  };

  const handleDeleteCat = (e, catName) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      deleteCategory(catName);
      setSelectedCategories(selectedCategories.filter((c) => c !== catName));
    }
  };

  const handleInsertHTML = (snippet) => {
    setContent((prev) => prev + '\n' + snippet);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const formattedContent = formatArticleContent(content);

    const postPayload = {
      title,
      author,
      authorAvatar,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
      categories: selectedCategories,
      tags: tagsArray,
      excerpt,
      content: formattedContent
    };

    if (isEditing) {
      updatePost(id, postPayload);
    } else {
      addPost(postPayload);
    }

    navigate('/admin');
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button className="read-more-btn" onClick={() => navigate('/admin')} style={{ gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* Title */}
        <div className="form-group">
          <label className="form-label">Article Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. How to build an Application with modern Technology"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Cover Media (Video/Image) Upload & Preview */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Cover Photo / Video Upload</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, WEBP & MP4, WEBM videos</span>
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <label
              className="btn-primary"
              style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                fontSize: '0.9rem'
              }}
            >
              <Upload size={16} /> {uploadingCover ? 'Uploading Media...' : 'Choose Photo / Video File'}
              <input
                type="file"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                disabled={uploadingCover}
                onChange={(e) => handleFileUpload(e.target.files[0], setCoverImage, setUploadingCover)}
              />
            </label>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>or enter URL directly:</span>
          </div>

          <input
            type="text"
            className="form-input"
            style={{ marginTop: '0.5rem' }}
            placeholder="https://... or select a file above"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />

          {coverImage && (
            <div style={{ marginTop: '0.75rem', position: 'relative' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.36rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {isVideoUrl(coverImage) ? <Video size={14} /> : <Image size={14} />} Media Preview:
              </div>

              {isVideoUrl(coverImage) ? (
                <video
                  controls
                  src={coverImage}
                  style={{
                    width: '100%',
                    maxHeight: '260px',
                    borderRadius: '10px',
                    backgroundColor: '#000',
                    border: '1px solid var(--border-color)'
                  }}
                />
              ) : (
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  style={{
                    width: '100%',
                    maxHeight: '220px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Author Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Author Name</label>
            <input
              type="text"
              className="form-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Author Avatar (Upload or URL)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1:1 Square (e.g. 100x100px)</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                value={authorAvatar}
                onChange={(e) => setAuthorAvatar(e.target.value)}
                placeholder="Avatar URL (e.g. 100x100px square)..."
              />
              <label className="read-more-btn" style={{ cursor: 'pointer', whitespace: 'nowrap', padding: '0.5rem 0.8rem' }}>
                {uploadingAvatar ? '...' : <Upload size={16} />}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  disabled={uploadingAvatar}
                  onChange={(e) => handleFileUpload(e.target.files[0], setAuthorAvatar, setUploadingAvatar)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Categories Selection & Creation / Deletion */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Categories</label>
            {/* Create Category form inline */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                placeholder="New Category..."
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', width: '150px' }}
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
              />
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', gap: '0.2rem' }}
                onClick={handleCreateCategory}
              >
                <Plus size={14} /> Add Category
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.4rem' }}>
            {availableCategories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.name);
              return (
                <div
                  key={cat.name}
                  className={`tag-pill ${isSelected ? 'active' : ''}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                  onClick={() => handleCategoryToggle(cat.name)}
                >
                  <span>{cat.name} {isSelected && '✓'}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      padding: '2px',
                      marginLeft: '2px',
                      opacity: 0.75
                    }}
                    title={`Delete category ${cat.name}`}
                    onClick={(e) => handleDeleteCat(e, cat.name)}
                  >
                    <Trash2 size={12} color={isSelected ? '#fff' : 'var(--text-muted)'} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            className="form-input"
            placeholder="React, Nextjs, Software, Architecture"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        {/* Short Summary Excerpt */}
        <div className="form-group">
          <label className="form-label">Teaser Excerpt Summary</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="Brief 2-3 sentence overview shown on post cards..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
          />
        </div>

        {/* Main Body Text Editor */}
        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label className="form-label">Main Article Body (Supports Plain Text, Markdown & HTML)</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setContent((prev) => formatArticleContent(prev))}
                title="Automatically format pasted ChatGPT or raw text into bullet points, headings & paragraphs"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', backgroundColor: 'var(--accent-purple)', gap: '0.35rem' }}
              >
                ✨ Auto-Format Pasted Text
              </button>
              <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => handleInsertHTML('\nIntroduction\n')}
                  title="Insert Section Title"
                  style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.2rem 0.5rem' }}
                >
                  H2
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => handleInsertHTML('\n1. Section Subheading\n')}
                  title="Insert Numbered Section"
                  style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.2rem 0.5rem' }}
                >
                  1. H3
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => handleInsertHTML('\n---\n')}
                  title="Insert Section Divider Line"
                >
                  <Minus size={16} />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => handleInsertHTML('\n- Point item 1\n- Point item 2\n')}
                  title="Insert Bullet List"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => handleInsertHTML('<blockquote>"Insert quote here"</blockquote>')}
                  title="Insert Quote"
                >
                  <Quote size={16} />
                </button>
              </div>
            </div>
          </div>
          <textarea
            className="form-textarea"
            rows={10}
            placeholder="Write full article body..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="read-more-btn" onClick={() => navigate('/admin')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Save size={18} /> {isEditing ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
};
