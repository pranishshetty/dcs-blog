import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image, Video, Eye, Bold, Heading, Quote, Plus, Trash2, Upload, Minus, List, X, Clock, Calendar, FileText, CheckCircle2 } from 'lucide-react';
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

  // Publishing & Scheduling state: 'now' | 'schedule' | 'draft'
  const [publishOption, setPublishOption] = useState('now');
  const [scheduledAt, setScheduledAt] = useState('');

  // Category creation & media upload states
  const [newCatInput, setNewCatInput] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Admin Section Image Insertion states
  const [showSectionImgModal, setShowSectionImgModal] = useState(false);
  const [sectionImgUrl, setSectionImgUrl] = useState('');
  const [sectionImgCaption, setSectionImgCaption] = useState('');
  const [uploadingSectionImg, setUploadingSectionImg] = useState(false);

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

        if (existing.scheduledAt && new Date(existing.scheduledAt).getTime() > Date.now()) {
          setPublishOption('schedule');
          const d = new Date(existing.scheduledAt);
          const pad = (n) => String(n).padStart(2, '0');
          const localStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          setScheduledAt(localStr);
        } else if (existing.published === false) {
          setPublishOption('draft');
          setScheduledAt('');
        } else {
          setPublishOption('now');
          setScheduledAt('');
        }
      }
    } else {
      setCoverImage('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80');
    }
  }, [id, isEditing, posts]);

  const setQuickSchedule = (type) => {
    const target = new Date();
    if (type === '1hour') {
      target.setHours(target.getHours() + 1);
    } else if (type === 'tomorrow9am') {
      target.setDate(target.getDate() + 1);
      target.setHours(9, 0, 0, 0);
    } else if (type === 'tomorrow6pm') {
      target.setDate(target.getDate() + 1);
      target.setHours(18, 0, 0, 0);
    } else if (type === 'nextweek') {
      target.setDate(target.getDate() + 7);
      target.setHours(9, 0, 0, 0);
    }
    const pad = (n) => String(n).padStart(2, '0');
    const localStr = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
    setScheduledAt(localStr);
    setPublishOption('schedule');
  };

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

    if (publishOption === 'schedule') {
      if (!scheduledAt) {
        alert('Please choose a scheduled date and time.');
        return;
      }
      const scheduledTime = new Date(scheduledAt).getTime();
      if (isNaN(scheduledTime) || scheduledTime <= Date.now()) {
        alert('Please choose a future date and time to schedule this post.');
        return;
      }
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const formattedContent = formatArticleContent(content);

    const isScheduled = publishOption === 'schedule';
    const isDraft = publishOption === 'draft';
    const scheduledIso = isScheduled ? new Date(scheduledAt).toISOString() : null;
    const isPublished = isDraft ? false : true;

    const postPayload = {
      title,
      author,
      authorAvatar,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
      categories: selectedCategories,
      tags: tagsArray,
      excerpt,
      content: formattedContent,
      published: isPublished,
      scheduledAt: scheduledIso
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
                onClick={() => setShowSectionImgModal(true)}
                title="Upload or link an image to insert into any article section"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', backgroundColor: 'var(--accent-blue)', gap: '0.35rem' }}
              >
                <Image size={15} /> Insert Section Image
              </button>
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

        {/* Publishing & Scheduling Section */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginTop: '1.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label className="form-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>
              <Clock size={18} style={{ color: 'var(--accent-purple)' }} /> Publishing Schedule & Status
            </label>
            {publishOption === 'schedule' && scheduledAt && (
              <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', fontWeight: 600 }}>
                ⏰ Scheduled
              </span>
            )}
            {publishOption === 'now' && (
              <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', fontWeight: 600 }}>
                ⚡ Ready to Publish
              </span>
            )}
            {publishOption === 'draft' && (
              <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 600 }}>
                📝 Saved as Draft
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {/* Option 1: Publish Now */}
            <div
              onClick={() => { setPublishOption('now'); setScheduledAt(''); }}
              style={{
                border: `2px solid ${publishOption === 'now' ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                backgroundColor: publishOption === 'now' ? 'var(--bg-elevated)' : 'transparent',
                borderRadius: '10px',
                padding: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--accent-green)' }}>⚡</span> Publish Immediately
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Make article live for all visitors immediately upon saving.
              </p>
            </div>

            {/* Option 2: Schedule for Later */}
            <div
              onClick={() => {
                setPublishOption('schedule');
                if (!scheduledAt) {
                  setQuickSchedule('tomorrow9am');
                }
              }}
              style={{
                border: `2px solid ${publishOption === 'schedule' ? 'var(--accent-purple)' : 'var(--border-color)'}`,
                backgroundColor: publishOption === 'schedule' ? 'var(--bg-elevated)' : 'transparent',
                borderRadius: '10px',
                padding: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-purple)' }}>
                <Clock size={16} /> Schedule for Later
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Set a future date & time. The system will publish automatically.
              </p>
            </div>

            {/* Option 3: Draft */}
            <div
              onClick={() => { setPublishOption('draft'); setScheduledAt(''); }}
              style={{
                border: `2px solid ${publishOption === 'draft' ? '#f59e0b' : 'var(--border-color)'}`,
                backgroundColor: publishOption === 'draft' ? 'var(--bg-elevated)' : 'transparent',
                borderRadius: '10px',
                padding: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
                <FileText size={16} style={{ color: '#f59e0b' }} /> Save as Draft
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Keep article hidden from visitors until you are ready.
              </p>
            </div>
          </div>

          {/* Schedule Settings when "Schedule for Later" is selected */}
          {publishOption === 'schedule' && (
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--accent-purple)',
              borderRadius: '10px',
              padding: '1rem',
              marginTop: '0.75rem',
              animation: 'fadeIn 0.2s ease'
            }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Calendar size={15} style={{ color: 'var(--accent-purple)' }} /> Select Target Publish Date & Time
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
                <input
                  type="datetime-local"
                  className="form-input"
                  style={{ maxWidth: '300px', fontWeight: 600 }}
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required={publishOption === 'schedule'}
                />

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '2px' }}>Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setQuickSchedule('1hour')}
                    className="read-more-btn"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    +1 Hour
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickSchedule('tomorrow9am')}
                    className="read-more-btn"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    Tomorrow 9 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickSchedule('tomorrow6pm')}
                    className="read-more-btn"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    Tomorrow 6 PM
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickSchedule('nextweek')}
                    className="read-more-btn"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    Next Week
                  </button>
                </div>
              </div>

              {scheduledAt && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--accent-green)" />
                  Will automatically publish on: <strong style={{ color: 'var(--text-primary)' }}>{new Date(scheduledAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="read-more-btn" onClick={() => navigate('/admin')}>
            Cancel
          </button>
          {publishOption === 'schedule' ? (
            <button type="submit" className="btn-primary" style={{ backgroundColor: 'var(--accent-purple)' }}>
              <Clock size={18} /> {isEditing ? 'Update Schedule' : 'Schedule Post'}
            </button>
          ) : publishOption === 'draft' ? (
            <button type="submit" className="btn-primary" style={{ backgroundColor: '#f59e0b' }}>
              <FileText size={18} /> {isEditing ? 'Save Draft' : 'Save as Draft'}
            </button>
          ) : (
            <button type="submit" className="btn-primary">
              <Save size={18} /> {isEditing ? 'Update & Publish' : 'Publish Article'}
            </button>
          )}
        </div>
      </form>

      {/* Admin Section Image Upload Modal */}
      {showSectionImgModal && (
        <div className="modal-overlay" style={{ zIndex: 300 }}>
          <div className="modal-content" style={{ maxWidth: '520px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Image size={20} style={{ color: 'var(--accent-blue)' }} /> Insert Image into Section
              </h3>
              <button onClick={() => setShowSectionImgModal(false)} className="icon-btn">
                <X size={18} />
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Upload Image File</label>
              <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Upload size={16} /> {uploadingSectionImg ? 'Uploading...' : 'Choose Image File'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  disabled={uploadingSectionImg}
                  onChange={(e) => handleFileUpload(e.target.files[0], setSectionImgUrl, setUploadingSectionImg)}
                />
              </label>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Or Image URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://images.unsplash.com/photo-..."
                value={sectionImgUrl}
                onChange={(e) => setSectionImgUrl(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Caption / Description (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Figure 1: Architecture diagram of the application"
                value={sectionImgCaption}
                onChange={(e) => setSectionImgCaption(e.target.value)}
              />
            </div>

            {sectionImgUrl && (
              <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Preview:</div>
                <img
                  src={sectionImgUrl}
                  alt="Section preview"
                  style={{ maxHeight: '180px', borderRadius: '8px', border: '1px solid var(--border-color)', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="read-more-btn" onClick={() => setShowSectionImgModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={!sectionImgUrl}
                onClick={() => {
                  if (!sectionImgUrl) return;
                  const altText = sectionImgCaption.trim() || 'Section Image';
                  const captionHtml = sectionImgCaption.trim() ? `<figcaption>${sectionImgCaption.trim()}</figcaption>` : '';
                  const imgBlock = `\n<figure class="article-image-block">\n  <img src="${sectionImgUrl}" alt="${altText}" />\n  ${captionHtml}\n</figure>\n`;
                  handleInsertHTML(imgBlock);
                  setSectionImgUrl('');
                  setSectionImgCaption('');
                  setShowSectionImgModal(false);
                }}
              >
                Insert into Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
