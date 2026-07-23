import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiPlus, FiX, FiExternalLink, FiUploadCloud, FiImage, FiVideo } from 'react-icons/fi';
import { notify } from '../utils/notify';
import './AdminPanel.css';

/* ─── Same local fallback images used on the Portfolio / Home pages ─────────── */
import imgShortFilms from '../assets/categories/short-films.png';
import imgDocumentaries from '../assets/categories/documentaries.png';
import imgCommercials from '../assets/categories/commercials.png';
import imgEvents from '../assets/categories/events.png';
import imgPodcasts from '../assets/categories/podcasts.png';
import imgStreaming from '../assets/categories/streaming.png';
import imgCorporate from '../assets/categories/corporate.png';
import imgMusicVideos from '../assets/categories/music-videos.png';
import imgPhotography from '../assets/categories/photography.png';
import imgBTS from '../assets/categories/behind-the-scenes.png';

const LOCAL_IMAGE_MAP = {
  'short-films': imgShortFilms,
  'documentaries': imgDocumentaries,
  'commercials': imgCommercials,
  'events': imgEvents,
  'podcasts': imgPodcasts,
  'live-streaming': imgStreaming,
  'corporate-videos': imgCorporate,
  'music-videos': imgMusicVideos,
  'photography': imgPhotography,
  'behind-the-scenes': imgBTS,
};

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8080' : '');

const resolveUrl = (src) => {
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
  return `${API_URL}${src}`;
};

const API = `${API_URL}/api/admin`;

// Auth helper – reads token from localStorage for every request
const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

import { MediaPreview } from '../components/admin/MediaPreview';
import { MediaUploader as UploadZone } from '../components/admin/MediaUploader';

// URL Validators
const isValidYoutubeVimeo = (url) => {
  if (!url) return true;
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+$/.test(url);
};

const isValidEmbed = (input) => {
  if (!input) return true;
  let url = input;
  const srcMatch = input.match(/src=["']([^"']+)["']/);
  if (srcMatch) {
    url = srcMatch[1];
  }
  return /^(https?:\/\/)?((iframe|player)\.mediadelivery\.net|player\.cloudinary\.com|www\.youtube\.com\/embed|res\.cloudinary\.com|player\.vimeo\.com|video\.bunnycdn\.com)\/.+$/.test(url);
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
// ─── CATEGORIES CMS ──────────────────────────────────────────────────────────

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const cRes = await axios.get(`${API}/categories`, getAuthConfig());
    setCategories(cRes.data.data);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '' });
    setCoverFile(null);
    setCoverPreview('');
    setEditingId(null);
  };

  const handleNameChange = (val) =>
    setForm(f => ({ ...f, name: val, slug: editingId ? f.slug : slugify(val) }));

  const handleFileSelect = (file) => {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.slug) return notify.error('Name and slug are required');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('slug', form.slug);
      fd.append('description', form.description);
      if (coverFile) fd.append('coverImage', coverFile);

      if (editingId) {
        await axios.put(`${API}/categories/${editingId}`, fd, getAuthConfig());
        notify.success('Category updated');
      } else {
        await axios.post(`${API}/categories`, fd, getAuthConfig());
        notify.success('Category created');
      }
      resetForm();
      load();
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '' });
    setCoverFile(null);
    setCoverPreview(cat.coverImage || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirmed = await notify.confirm('Warning - Delete this category? All projects inside will lose their category.');
    if (!confirmed) return;
    await axios.delete(`${API}/categories/${id}`, getAuthConfig());
    notify.success('Category deleted');
    load();
  };

  const handleReorder = async (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === categories.length - 1) return;
    const list = [...categories];
    [list[index], list[index + direction]] = [list[index + direction], list[index]];
    list.forEach((item, i) => { item.order = i; });
    setCategories(list);
    try {
      await axios.put(`${API}/categories/reorder`, { reorderedItems: list.map(c => ({ id: c._id, order: c.order })) }, getAuthConfig());
    } catch { notify.error('Reorder failed'); load(); }
  };

  return (
    <div>
      {/* Form */}
      <div className="cms-form-card">
        <h3 className="cms-form-title">{editingId ? '✏️ Edit Category' : '➕ New Category'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="cms-form-grid">
            <div className="cms-field">
              <label>Category Name *</label>
              <input className="form-control" placeholder="e.g. Photography" value={form.name}
                onChange={e => handleNameChange(e.target.value)} required />
            </div>
            <div className="cms-field">
              <label>Slug *</label>
              <input className="form-control" placeholder="e.g. photography" value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required />
            </div>
            <div className="cms-field" style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea className="form-control" rows={2} placeholder="Short description of this category..."
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="cms-field" style={{ gridColumn: 'span 2' }}>
              <label><FiImage style={{ verticalAlign: 'middle', marginRight: 4 }} />Cover Photo</label>
              <UploadZone
                accept="image/*"
                label="Click or drag an image here"
                preview={coverPreview}
                previewType="image"
                onChange={handleFileSelect}
                onClear={() => { setCoverFile(null); setCoverPreview(''); }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (editingId ? 'Update Category' : 'Create Category')}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      {categories.length === 0 ? (
        <div className="admin-state-card"><h3>No categories yet</h3><p>Create your first category above.</p></div>
      ) : (
        <div className="cms-card-grid">
          {categories.map((cat, index) => (
            <div key={cat._id} className="cms-item-card">
              <div className="cms-card-cover">
                {(() => {
                  const src = cat.coverImage
                    ? resolveUrl(cat.coverImage)
                    : LOCAL_IMAGE_MAP[cat.slug];
                  return src ? (
                    <img
                      src={src}
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                    />
                  ) : (
                    <div className="cms-card-cover--empty"><FiImage size={28} /></div>
                  );
                })()}
              </div>
              <div className="cms-card-body">
                <h4>{cat.name}</h4>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                  <span className="cms-slug-badge">{cat.slug}</span>
                </div>
                {cat.description && <p className="cms-card-desc">{cat.description}</p>}
              </div>
              <div className="cms-card-actions">
                <div className="cms-reorder-btns">
                  <button className="btn-icon" onClick={() => handleReorder(index, -1)} title="Move left"><FiArrowLeft /></button>
                  <button className="btn-icon" onClick={() => handleReorder(index, 1)} title="Move right"><FiArrowRight /></button>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-icon" onClick={() => handleEdit(cat)} title="Edit"><FiEdit2 /></button>
                  <button className="btn-icon cross" onClick={() => handleDelete(cat._id)} title="Delete"><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PROJECTS CMS ─────────────────────────────────────────────────────────────

const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterCat, setFilterCat] = useState('');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    title: '', slug: '', categoryId: '', description: '',
    date: '', clientName: '', tags: '', externalLink: '', embedUrl: ''
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [videoThumbnailFile, setVideoThumbnailFile] = useState(null);
  const [videoThumbnailPreview, setVideoThumbnailPreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const clientDropdownRef = useRef(null);

  const load = async () => {
    const [pRes, cRes] = await Promise.all([
      axios.get(`${API}/projects?limit=200`, getAuthConfig()),
      axios.get(`${API}/categories`, getAuthConfig())
    ]);
    setProjects(pRes.data.data);
    setCategories(cRes.data.data);
  };

  // Fetch registered users for client name autocomplete
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/users`, getAuthConfig());
        const list = res.data?.data || res.data?.users || [];
        setUsers(Array.isArray(list) ? list : []);
      } catch {
        // silently fail — admin can still type the name manually
      }
    };
    fetchUsers();
  }, []);

  // Close client dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(e.target)) {
        setShowClientDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ title: '', slug: '', categoryId: '', description: '', date: '', clientName: '', tags: '', externalLink: '', embedUrl: '' });
    setMediaFile(null);
    setMediaPreview('');
    setMediaType('image');
    setCoverFile(null);
    setCoverPreview('');
    setVideoThumbnailFile(null);
    setVideoThumbnailPreview('');
    setEditingId(null);
  };

  const handleTitleChange = (val) =>
    setForm(f => ({ ...f, title: val, slug: editingId ? f.slug : slugify(val) }));

  const handleMediaSelect = (file) => {
    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'image');
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    // clear video thumbnail if switching to image
    if (!isVideo) { setVideoThumbnailFile(null); setVideoThumbnailPreview(''); }
  };

  const handleCoverSelect = (file) => {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleVideoThumbnailSelect = (file) => {
    setVideoThumbnailFile(file);
    setVideoThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.categoryId || !form.description || !form.date) {
      return notify.error('Please fill all required fields');
    }

    if (form.externalLink && !isValidYoutubeVimeo(form.externalLink)) {
      return notify.error('Invalid External Link. Must be a YouTube or Vimeo URL.');
    }

    if (form.embedUrl && !isValidEmbed(form.embedUrl)) {
      return notify.error('Invalid Embed URL. Only Bunny.net, Cloudinary, and YouTube embeds are supported.');
    }

    const hasMedia = mediaFile || form.embedUrl || form.externalLink || coverFile || (editingId && mediaPreview);
    if (!hasMedia) {
      return notify.error('At least one media source (Video, Image, Embed, or External Link) is required.');
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('mediaType', mediaType);
      if (mediaFile) fd.append('media', mediaFile);
      if (coverFile) fd.append('coverImage', coverFile);
      if (videoThumbnailFile) fd.append('videoThumbnail', videoThumbnailFile);

      if (editingId) {
        await axios.put(`${API}/projects/${editingId}`, fd, getAuthConfig());
        notify.success('Project updated');
      } else {
        await axios.post(`${API}/projects`, fd, getAuthConfig());
        notify.success('Project created');
      }
      resetForm();
      load();
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      slug: p.slug,
      categoryId: p.category?._id || '',
      description: p.description,
      date: p.date ? new Date(p.date).toISOString().split('T')[0] : '',
      clientName: p.clientName || '',
      tags: p.tags?.join(', ') || '',
      externalLink: p.externalLink || '',
      embedUrl: p.media?.[0]?.url?.includes('http') ? p.media[0].url : ''
    });
    const featured = p.media?.[0];
    setMediaFile(null);
    setMediaPreview(featured?.url || '');
    setMediaType(featured?.type || 'image');
    setCoverFile(null);
    setCoverPreview(p.coverImage || '');
    setVideoThumbnailFile(null);
    setVideoThumbnailPreview(featured?.thumbnailUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirmed = await notify.confirm('Warning - Delete this project?');
    if (!confirmed) return;
    await axios.delete(`${API}/projects/${id}`, getAuthConfig());
    notify.success('Project deleted');
    load();
  };

  const handleReorder = async (index, direction) => {
    const list = [...filtered];
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === list.length - 1) return;
    [list[index], list[index + direction]] = [list[index + direction], list[index]];
    list.forEach((item, i) => { item.order = i; });
    setProjects(prev => {
      const map = Object.fromEntries(list.map(p => [p._id, p]));
      return prev.map(p => map[p._id] || p);
    });
    try {
      await axios.put(`${API}/projects/reorder`, { reorderedItems: list.map(p => ({ id: p._id, order: p.order })) }, getAuthConfig());
    } catch { notify.error('Reorder failed'); load(); }
  };

  const filtered = projects.filter(p => {
    if (filterCat && p.category?._id !== filterCat) return false;
    if (search && !`${p.title} ${p.clientName}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Form */}
      <div className="cms-form-card">
        <h3 className="cms-form-title">{editingId ? '✏️ Edit Project' : '➕ New Project'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="cms-form-grid">
            <div className="cms-field">
              <label>Project Title *</label>
              <input className="form-control" placeholder="e.g. TEDx Event Recap" value={form.title}
                onChange={e => handleTitleChange(e.target.value)} required />
            </div>
            <div className="cms-field">
              <label>Slug *</label>
              <input className="form-control" placeholder="e.g. tedx-event-recap" value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required />
            </div>
            <div className="cms-field">
              <label>Category *</label>
              <select className="form-control" value={form.categoryId}
                onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="cms-field" style={{ position: 'relative' }} ref={clientDropdownRef}>
              <label>Client Name</label>
              <input
                className="form-control"
                placeholder="Search registered client…"
                value={form.clientName}
                autoComplete="off"
                onChange={e => {
                  setForm(f => ({ ...f, clientName: e.target.value }));
                  setShowClientDropdown(true);
                }}
                onFocus={() => setShowClientDropdown(true)}
              />
              {showClientDropdown && (
                <div className="custom-dropdown-menu" style={{ zIndex: 999 }}>
                  {users.filter(u =>
                    u.name.toLowerCase().includes((form.clientName || '').toLowerCase())
                  ).length > 0 ? (
                    users
                      .filter(u => u.name.toLowerCase().includes((form.clientName || '').toLowerCase()))
                      .map(u => (
                        <div
                          key={u._id}
                          className="custom-dropdown-item"
                          onMouseDown={e => {
                            e.preventDefault();
                            setForm(f => ({ ...f, clientName: u.name }));
                            setShowClientDropdown(false);
                          }}
                        >
                          <div className="dropdown-avatar">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="dropdown-info">
                            <strong>{u.name}</strong>
                            <span>{u.email}</span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="custom-dropdown-empty">No matching clients found</div>
                  )}
                </div>
              )}
            </div>
            <div className="cms-field">
              <label>Date *</label>
              <input type="date" className="form-control" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>
            <div className="cms-field">
              <label>Tags (comma separated)</label>
              <input className="form-control" placeholder="e.g. film, event, documentary" value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            <div className="cms-field" style={{ gridColumn: 'span 2' }}>
              <label>Description *</label>
              <textarea className="form-control" rows={3} placeholder="What did the company do for the client..."
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div className="cms-field" style={{ gridColumn: 'span 2' }}>
              <label><FiExternalLink style={{ verticalAlign: 'middle', marginRight: 4 }} />External Link (YouTube / Vimeo)</label>
              <input className="form-control" placeholder="https://youtube.com/watch?v=..." value={form.externalLink}
                onChange={e => setForm(f => ({ ...f, externalLink: e.target.value }))} />
            </div>
            <div className="cms-field" style={{ gridColumn: 'span 1' }}>
              <label><FiImage style={{ verticalAlign: 'middle', marginRight: 4 }} />Coverage Photo (Thumbnail)</label>
              <UploadZone
                accept="image/*"
                label="Upload a cover photo for this project"
                preview={coverPreview}
                previewType="image"
                onChange={handleCoverSelect}
                onClear={() => { setCoverFile(null); setCoverPreview(''); }}
              />
            </div>
            <div className="cms-field" style={{ gridColumn: 'span 1' }}>
              <label>
                {mediaType === 'video'
                  ? <><FiVideo style={{ verticalAlign: 'middle', marginRight: 4 }} />Trailer Video / Main Media</>
                  : <><FiImage style={{ verticalAlign: 'middle', marginRight: 4 }} />Main Image / Trailer Video</>}
              </label>
              <UploadZone
                accept="image/*,video/*"
                label="Click or drag an image or video here (trailer, photo, etc.)"
                preview={mediaPreview && !form.embedUrl ? mediaPreview : ''}
                previewType={mediaType}
                onChange={handleMediaSelect}
                onClear={() => { setMediaFile(null); setMediaPreview(''); setMediaType('image'); setVideoThumbnailFile(null); setVideoThumbnailPreview(''); setForm(f => ({ ...f, embedUrl: '' })); }}
              />
              <div style={{ marginTop: 8, fontSize: '0.85rem' }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Or provide an Embed URL (Bunny.net/YouTube):</label>
                <input className="form-control" placeholder="https://iframe.mediadelivery.net/embed/..." value={form.embedUrl}
                  onChange={e => {
                    setForm(f => ({ ...f, embedUrl: e.target.value }));
                    if (e.target.value) setMediaType('video');
                  }} />
              </div>
              {mediaFile && !form.embedUrl && (
                <div style={{ marginTop: 4, fontSize: '0.78rem', color: '#94a3b8' }}>
                  Detected: <strong>{mediaType === 'video' ? '🎬 Video' : '🖼️ Image'}</strong> — {mediaFile.name}
                </div>
              )}
            </div>
            {mediaType === 'video' && (
              <div className="cms-field" style={{ gridColumn: 'span 1' }}>
                <label><FiImage style={{ verticalAlign: 'middle', marginRight: 4 }} />Video Thumbnail (Poster Image)</label>
                <UploadZone
                  accept="image/*"
                  label="Upload a thumbnail photo shown before the video plays"
                  preview={videoThumbnailPreview}
                  previewType="image"
                  onChange={handleVideoThumbnailSelect}
                  onClear={() => { setVideoThumbnailFile(null); setVideoThumbnailPreview(''); }}
                />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (editingId ? 'Update Project' : 'Create Project')}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="search-bar" style={{ maxWidth: 240 }} placeholder="Search title or client..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-control" style={{ maxWidth: 200 }} value={filterCat}
          onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{filtered.length} project{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="admin-state-card"><h3>No projects found</h3><p>Create your first project above.</p></div>
      ) : (
        <div className="cms-project-list">
          {filtered.map((p, index) => {
            const featured = p.media?.[0];
            const thumbSrc = p.coverImage || featured?.thumbnailUrl || featured?.url;
            const thumbType = (p.coverImage || featured?.thumbnailUrl) ? 'image' : featured?.type;

            return (
              <div key={p._id} className="cms-project-row">
                <div className="cms-project-thumb">
                  {thumbSrc ? (
                    <MediaPreview src={thumbSrc} type={thumbType} />
                  ) : (
                    <div className="cms-thumb-empty"><FiImage size={20} /></div>
                  )}
                </div>
                <div className="cms-project-info">
                  <div className="cms-project-header">
                    <h4>{p.title}</h4>
                    {p.category?.name && <span className="cms-cat-badge">{p.category.name}</span>}
                  </div>
                  {p.clientName && <p className="cms-project-client">Client: <strong>{p.clientName}</strong></p>}
                  <p className="cms-project-desc">{p.description}</p>
                  <div className="cms-project-meta">
                    {p.date && <span>📅 {new Date(p.date).toLocaleDateString()}</span>}
                    {featured?.type === 'video' && <span className="cms-media-badge video">🎬 Video</span>}
                    {featured?.type === 'image' && <span className="cms-media-badge image">🖼️ Image</span>}
                    {p.externalLink && (
                      <a href={p.externalLink} target="_blank" rel="noopener noreferrer" className="btn-quick success" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px' }}>
                        <FiExternalLink size={14} /> Full Project on YouTube
                      </a>
                    )}
                  </div>
                </div>
                <div className="cms-project-actions">
                  <div className="cms-reorder-btns">
                    <button className="btn-icon" onClick={() => handleReorder(index, -1)} title="Move up"><FiArrowUp /></button>
                    <button className="btn-icon" onClick={() => handleReorder(index, 1)} title="Move down"><FiArrowDown /></button>
                  </div>
                  <button className="btn-icon" onClick={() => handleEdit(p)} title="Edit"><FiEdit2 /></button>
                  <button className="btn-icon cross" onClick={() => handleDelete(p._id)} title="Delete"><FiTrash2 /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────

export const PortfolioCMS = ({ activeTab }) => {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>
        {activeTab === 'categories' ? '📁 Categories' : '🎬 Projects'}
      </h2>
      {activeTab === 'categories' && <CategoriesTab />}
      {activeTab === 'projects' && <ProjectsTab />}
    </div>
  );
};


