// app/admin/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'library', 'news', 'manage-news', 'inbox'
  
  // --- MEDIA UPLOAD STATE ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('gallery');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [additionalFiles, setAdditionalFiles] = useState([]); 
  const [isVideo, setIsVideo] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // --- MEDIA LIBRARY & EDIT STATE ---
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [editingMedia, setEditingMedia] = useState(null);
  const [managingAlbum, setManagingAlbum] = useState(null); // NEW: For the Album Manager Modal

  // --- NEWSROOM STATE ---
  const [newsTitle, setNewsTitle] = useState('');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState('Policy Announcement');
  const [newsFeatured, setNewsFeatured] = useState(false);
  const [newsFile, setNewsFile] = useState(null);
  const [newsPreviewUrl, setNewsPreviewUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');

  // --- MANAGE NEWS STATE ---
  const [articles, setArticles] = useState([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  // --- INBOX STATE ---
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [expandedMsgId, setExpandedMsgId] = useState(null);

  // --- DATA FETCHING (EFFECTS) ---
  useEffect(() => {
    if (activeTab === 'inbox') fetchMessages();
    if (activeTab === 'library') fetchMedia();
    if (activeTab === 'manage-news') fetchArticles();
  }, [activeTab]);

  // --- FETCH FUNCTIONS ---
  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (e) { console.error(e); } finally { setIsLoadingMessages(false); }
  };

  const fetchMedia = async () => {
    setIsLoadingMedia(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success) setMediaItems(data.data);
    } catch (e) { console.error(e); } finally { setIsLoadingMedia(false); }
  };

  const fetchArticles = async () => {
    setIsLoadingArticles(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.success) setArticles(data.data);
    } catch (e) { console.error(e); } finally { setIsLoadingArticles(false); }
  };

  // --- INBOX HANDLERS ---
  const markAsRead = async (id) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(messages.map(msg => msg._id === id ? { ...msg, status: 'read' } : msg));
      }
    } catch (error) { console.error("Failed to mark as read", error); }
  };

  const handleMessageClick = (msg) => {
    if (expandedMsgId === msg._id) {
      setExpandedMsgId(null);
    } else {
      setExpandedMsgId(msg._id);
      if (msg.status === 'unread') markAsRead(msg._id);
    }
  };

  // --- MEDIA HANDLERS ---
  const handleFileChange = (e, type = 'media') => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      if (type === 'media') {
        setFile(selectedFile); setPreviewUrl(url); setIsVideo(selectedFile.type.startsWith('video/')); setUploadMessage('');
      } else {
        setNewsFile(selectedFile); setNewsPreviewUrl(url); setPublishMessage('');
      }
    }
  };

  const handleAdditionalFilesChange = (e) => {
    if (e.target.files) {
      setAdditionalFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (type = 'media') => {
    if (type === 'media') {
      setFile(null); setPreviewUrl(''); setIsVideo(false); setAdditionalFiles([]);
      const input = document.getElementById('media-upload');
      if (input) input.value = '';
    } else {
      setNewsFile(null); setNewsPreviewUrl('');
      const input = document.getElementById('news-upload');
      if (input) input.value = '';
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setUploadMessage('Please select a cover file.');
    setIsUploading(true); setUploadMessage('');

    const formData = new FormData();
    formData.append('image', file); 
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    additionalFiles.forEach(f => {
      formData.append('additionalImages', f);
    });

    try {
      const response = await fetch('/api/media', { method: 'POST', body: formData });
      const data = await response.json();
      if (response.ok && data.success) {
        setUploadMessage('Upload successful!');
        setTitle(''); setDescription(''); handleRemoveFile('media'); 
      } else {
        setUploadMessage(data.error || 'Upload failed.');
      }
    } catch (error) { setUploadMessage(`Error: ${error.message}`); } finally { setIsUploading(false); }
  };

  const handleDeleteMedia = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMediaItems(prev => prev.filter(item => item._id !== id));
      } else alert(data.error || "Failed to delete media.");
    } catch (error) { alert("An error occurred while deleting."); }
  };

  const submitMediaEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/media', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingMedia._id, title: editingMedia.title, description: editingMedia.description, category: editingMedia.category })
      });
      const data = await res.json();
      if (data.success) {
        fetchMedia(); 
        setEditingMedia(null);
      } else alert("Failed to update.");
    } catch (e) { alert("Error updating."); }
  };

  // --- ALBUM MANAGER HANDLERS (NEW) ---
  const handleRemoveAlbumImage = async (mediaId, imagePublicId) => {
    if (!window.confirm("Remove this photo from the album?")) return;
    
    // Optimistically update the UI so it feels instant
    setManagingAlbum(prev => ({
      ...prev,
      albumImages: prev.albumImages.filter(img => img.publicId !== imagePublicId)
    }));
    setMediaItems(prev => prev.map(item => 
      item._id === mediaId ? { ...item, albumImages: item.albumImages.filter(img => img.publicId !== imagePublicId) } : item
    ));

    try {
      await fetch('/api/media/album', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, publicId: imagePublicId })
      });
    } catch (error) {
      console.error("Failed to delete album image", error);
      fetchMedia(); // Revert on failure
    }
  };

  const handleAddPhotosToAlbum = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('mediaId', managingAlbum._id);
    files.forEach(f => formData.append('additionalImages', f));

    try {
      const res = await fetch('/api/media/album', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setManagingAlbum(data.data); // Update modal state
        setMediaItems(prev => prev.map(item => item._id === data.data._id ? data.data : item)); // Update library state
      } else {
        alert(data.error || "Failed to add photos.");
      }
    } catch (error) {
      alert("Error adding photos.");
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  // --- NEWSROOM HANDLERS ---
  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    if (!newsFile && !editingArticle) return setPublishMessage('Please select a cover image.');
    setIsPublishing(true); setPublishMessage('');

    const formData = new FormData();
    if (newsFile) formData.append('image', newsFile); 
    formData.append('title', newsTitle);
    formData.append('excerpt', newsExcerpt);
    formData.append('content', newsContent);
    formData.append('category', newsCategory);
    formData.append('featured', newsFeatured);
    if (editingArticle) formData.append('id', editingArticle._id);

    try {
      const method = editingArticle ? 'PUT' : 'POST';
      const response = await fetch('/api/articles', { method, body: formData });
      const data = await response.json();
      if (response.ok && data.success) {
        setPublishMessage(editingArticle ? 'Article updated successfully!' : 'Article published successfully!');
        setNewsTitle(''); setNewsExcerpt(''); setNewsContent(''); setNewsFeatured(false);
        handleRemoveFile('news'); setEditingArticle(null);
        if (editingArticle) setActiveTab('manage-news');
      } else {
        setPublishMessage(data.error || 'Publish failed.');
      }
    } catch (error) { setPublishMessage(`Error: ${error.message}`); } finally { setIsPublishing(false); }
  };

  const startEditingArticle = (article) => {
    setEditingArticle(article);
    setNewsTitle(article.title);
    setNewsExcerpt(article.excerpt);
    setNewsContent(article.content);
    setNewsCategory(article.category);
    setNewsFeatured(article.featured);
    setNewsPreviewUrl(article.imageUrl);
    setActiveTab('news');
  };

  const clearNewsForm = () => {
    setEditingArticle(null);
    setNewsTitle(''); setNewsExcerpt(''); setNewsContent(''); setNewsFeatured(false);
    handleRemoveFile('news');
    setPublishMessage('');
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setArticles(prev => prev.filter(item => item._id !== id));
      } else alert(data.error || "Failed to delete.");
    } catch (error) { alert("Error deleting."); }
  };

  const copyToClipboard = (id, url) => {
    navigator.clipboard.writeText(url); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000);
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center pb-20">
      
      {/* --- DASHBOARD HEADER --- */}
      <div className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Campaign Hub</h1>
            <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-widest">THE SYSTEM <span className="text-emerald-600">|</span> Admin</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/adminlogin/login' })} className="flex items-center gap-2 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 font-bold py-2 px-4 rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="max-w-6xl mx-auto flex gap-6 mt-8 overflow-x-auto no-scrollbar border-b border-slate-100">
          {[
            { id: 'upload', label: 'Upload Media' },
            { id: 'library', label: 'Media Library' },
            { id: 'news', label: editingArticle ? 'Editing News' : 'Write News' },
            { id: 'manage-news', label: 'Manage News' },
            { id: 'inbox', label: `Inbox ${unreadCount > 0 ? `(${unreadCount})` : ''}` }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => { 
                setActiveTab(tab.id); 
                if (tab.id !== 'news' && editingArticle) clearNewsForm(); 
              }} 
              className={`pb-3 text-sm font-bold tracking-widest uppercase transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-lg"></div>}
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full max-w-6xl p-4 sm:p-8 mt-4 relative">

        {/* ================= 1. MEDIA UPLOAD TAB ================= */}
        {activeTab === 'upload' && (
          <form onSubmit={handleUploadSubmit} className="bg-white p-6 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Add Campaign Media</h2>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Title / Event Name</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="E.g., Youth Town Hall 2026" />
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 appearance-none font-medium focus:outline-none">
                <option value="gallery">Gallery Album (Multiple Photos)</option>
                <option value="carousel">Hero Carousel Image</option>
                <option value="governor">Official Governor Portrait</option>
                <option value="upload">General File Hosting</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 resize-none focus:outline-none" placeholder="Enter context..." rows="3" />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Cover Image / Main File</label>
              {!previewUrl ? (
                <div className="relative">
                  <input type="file" accept="image/*,video/*" onChange={(e) => handleFileChange(e, 'media')} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-full px-4 py-10 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:border-emerald-400">
                    <span className="font-bold text-sm">Upload Cover Media</span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-48 rounded-xl bg-black overflow-hidden group shadow-inner">
                  {isVideo ? <video src={previewUrl} className="w-full h-full object-cover opacity-80" /> : <img src={previewUrl} className="w-full h-full object-cover opacity-80" />}
                  <button type="button" onClick={() => handleRemoveFile('media')} className="absolute top-4 right-4 p-2 bg-red-500 rounded-full text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              )}
            </div>

            {category === 'gallery' && previewUrl && (
              <div className="mb-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Upload Album Photos (Optional)</label>
                <input type="file" accept="image/*" multiple onChange={handleAdditionalFilesChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                {additionalFiles.length > 0 && <p className="mt-3 text-xs font-bold text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-full">{additionalFiles.length} additional photos selected.</p>}
              </div>
            )}

            {isUploading ? (
              <div className="flex justify-center items-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-emerald-600"></div><span className="ml-3 text-emerald-700 font-bold text-sm tracking-widest uppercase">Processing...</span>
              </div>
            ) : (
              <button type="submit" className="w-full bg-slate-900 text-white font-black tracking-widest uppercase py-4 rounded-xl hover:bg-emerald-700 transition-all active:scale-[0.98]">Upload Media</button>
            )}
            {uploadMessage && <div className="mt-4 text-center text-sm font-bold text-emerald-600 uppercase tracking-widest">{uploadMessage}</div>}
          </form>
        )}

        {/* ================= 2. MEDIA LIBRARY & EDIT MODAL ================= */}
        {activeTab === 'library' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 max-w-6xl mx-auto">
            <div className="p-2 border-b border-slate-100 flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Manage Library</h2>
              <button onClick={fetchMedia} className="text-slate-400 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-emerald-50">
                <svg className={`w-5 h-5 ${isLoadingMedia ? 'animate-spin text-emerald-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>

            {isLoadingMedia && mediaItems.length === 0 ? (
              <div className="p-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            ) : mediaItems.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-slate-500 font-bold">No media found. Upload something first!</p>
              </div>
            ) : (
              /* THE GRID FIX: Using aspect-video with w-full h-full object-cover enforces perfect uniform sizing without gaps */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mediaItems.map(item => (
                  <div key={item._id} className="group border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col bg-white hover:shadow-md transition-shadow">
                    
                    <div className="relative w-full aspect-video bg-slate-100">
                      {item.imageUrl?.includes('/video/') ? (
                        <video src={item.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <span className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow">{item.category}</span>
                      {item.albumImages?.length > 0 && <span className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-black uppercase shadow">+{item.albumImages.length}</span>}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{item.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 mb-4">{formatDate(item.createdAt)}</p>
                      
                      <div className="mt-auto flex justify-between items-center border-t border-slate-100 pt-3">
                        <button onClick={() => copyToClipboard(item._id, item.imageUrl)} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-emerald-600 transition-colors">
                          {copiedId === item._id ? 'Copied!' : 'Copy URL'}
                        </button>
                        <div className="flex gap-2">
                          {item.category === 'gallery' && (
                            <button onClick={() => setManagingAlbum(item)} className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">Album</button>
                          )}
                          <button onClick={() => setEditingMedia(item)} className="text-blue-500 font-bold text-[10px] uppercase tracking-widest hover:text-blue-700 transition-colors">Edit</button>
                          <button onClick={() => handleDeleteMedia(item._id)} className="text-red-500 font-bold text-[10px] uppercase tracking-widest hover:text-red-700 transition-colors">Del</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- ALBUM MANAGER MODAL (NEW) --- */}
        {managingAlbum && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-4xl shadow-2xl my-auto">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black uppercase tracking-tight">Manage Album: {managingAlbum.title}</h2>
                <button onClick={() => setManagingAlbum(null)} className="text-slate-400 hover:text-slate-900">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                {/* Cover Image Representation */}
                <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-emerald-500">
                  <img src={managingAlbum.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 w-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest text-center py-1">Cover (Main)</div>
                </div>

                {/* Album Images Grid */}
                {managingAlbum.albumImages && managingAlbum.albumImages.map((img) => (
                  <div key={img.publicId} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={img.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => handleRemoveAlbumImage(managingAlbum._id, img.publicId)}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transform hover:scale-110 transition-all shadow-lg"
                        title="Delete from Album"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload More Photos to this Album */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Add More Photos to Album</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input type="file" accept="image/*" multiple onChange={handleAddPhotosToAlbum} className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-widest file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer transition-colors" />
                  {isUploading && (
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-emerald-600"></div>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Uploading...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Media Modal */}
        {editingMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-black mb-6 uppercase tracking-tight">Edit Details</h2>
              <form onSubmit={submitMediaEdit}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Title</label>
                <input type="text" value={editingMedia.title} onChange={e => setEditingMedia({...editingMedia, title: e.target.value})} className="w-full mb-4 px-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                <select value={editingMedia.category} onChange={e => setEditingMedia({...editingMedia, category: e.target.value})} className="w-full mb-4 px-4 py-3.5 rounded-xl border font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none">
                  <option value="gallery">Gallery Album</option>
                  <option value="carousel">Hero Carousel</option>
                  <option value="governor">Governor Portrait</option>
                  <option value="upload">General File Hosting</option>
                </select>

                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                <textarea value={editingMedia.description} onChange={e => setEditingMedia({...editingMedia, description: e.target.value})} className="w-full mb-8 px-4 py-3.5 rounded-xl border resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none" rows="3" />
                
                <div className="flex gap-4">
                  <button type="button" onClick={() => setEditingMedia(null)} className="flex-1 py-3.5 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs">Cancel</button>
                  <button type="submit" className="flex-1 py-3.5 font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors uppercase tracking-widest text-xs shadow-lg shadow-emerald-600/20 active:scale-[0.98]">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= 3. WRITE / EDIT NEWS ================= */}
        {activeTab === 'news' && (
          <form onSubmit={handleNewsSubmit} className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">{editingArticle ? 'Edit Campaign Update' : 'Publish Campaign Update'}</h2>
              {editingArticle && (
                <button type="button" onClick={() => { clearNewsForm(); setActiveTab('manage-news'); }} className="text-xs font-bold text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full hover:bg-red-100 transition-colors">
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Headline</label>
              <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} required className="w-full px-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Headline" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                <select value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none">
                  <option>Policy Announcement</option><option>On The Trail</option><option>Endorsements</option><option>Press Release</option>
                </select>
              </div>
              <div className="flex items-center md:mt-8 ml-2 bg-slate-50 px-4 rounded-xl border border-slate-100">
                <input type="checkbox" id="featured" checked={newsFeatured} onChange={(e) => setNewsFeatured(e.target.checked)} className="w-5 h-5 text-emerald-600 rounded cursor-pointer" />
                <label htmlFor="featured" className="ml-3 text-sm font-bold text-slate-700 cursor-pointer w-full py-3.5">Mark as Featured Article</label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Short Excerpt</label>
              <textarea value={newsExcerpt} onChange={(e) => setNewsExcerpt(e.target.value)} required rows="2" className="w-full px-4 py-3.5 rounded-xl border resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Summary for the feed..." />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Content</label>
              <textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} required rows="10" className="w-full px-4 py-3.5 rounded-xl border resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Write the full article..." />
            </div>

            <div className="mb-10">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Cover Image {editingArticle && <span className="text-emerald-600 lowercase tracking-normal">(Leave empty to keep current)</span>}</label>
              {!newsPreviewUrl ? (
                <div className="relative">
                  <input id="news-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'news')} required={!editingArticle} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-full px-4 py-10 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:border-emerald-400">
                    <span className="font-bold text-sm">Upload Cover Image</span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-48 rounded-xl bg-black overflow-hidden group shadow-inner">
                  <img src={newsPreviewUrl} className="w-full h-full object-cover opacity-80" />
                  <button type="button" onClick={() => handleRemoveFile('news')} className="absolute top-4 right-4 p-2 bg-red-500 rounded-full text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                </div>
              )}
            </div>

            {isPublishing ? (
              <div className="flex justify-center items-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-emerald-600"></div><span className="ml-3 text-emerald-700 font-bold text-sm uppercase tracking-widest">Saving...</span>
              </div>
            ) : (
              <button type="submit" className="w-full bg-slate-900 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-emerald-700 transition-all active:scale-[0.98]">{editingArticle ? 'Save Changes' : 'Publish Article'}</button>
            )}
            {publishMessage && <div className="mt-4 text-center text-emerald-600 font-bold uppercase tracking-widest text-sm">{publishMessage}</div>}
          </form>
        )}

        {/* ================= 4. MANAGE NEWS TAB ================= */}
        {activeTab === 'manage-news' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto">
            <div className="p-2 border-b border-slate-100 flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Manage Published Articles</h2>
              <button onClick={fetchArticles} className="text-slate-400 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-emerald-50">
                <svg className={`w-5 h-5 ${isLoadingArticles ? 'animate-spin text-emerald-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
            
            {isLoadingArticles && articles.length === 0 ? (
              <div className="p-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            ) : articles.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-bold">No articles published yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {articles.map(article => (
                  <div key={article._id} className="p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-slate-50/30 hover:bg-white transition-colors">
                    <div>
                      <p className="font-black text-slate-900 text-lg mb-1">{article.title} {article.featured && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-widest align-middle">Featured</span>}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{article.category} <span className="mx-2 text-slate-300">•</span> {formatDate(article.createdAt)}</p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => startEditingArticle(article)} className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
                      <button onClick={() => handleDeleteArticle(article._id)} className="px-4 py-2 bg-red-50 text-red-600 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= 5. INBOX TAB ================= */}
        {activeTab === 'inbox' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-4xl mx-auto">
             <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h2 className="text-xl font-bold text-slate-900">Voter Mandates</h2>
               <button onClick={fetchMessages} className="text-slate-400 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-emerald-50">
                 <svg className={`w-5 h-5 ${isLoadingMessages ? 'animate-spin text-emerald-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
               </button>
             </div>
             {isLoadingMessages && messages.length === 0 ? (
               <div className="p-12 flex justify-center items-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
               </div>
             ) : messages.length === 0 ? (
               <div className="p-16 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                 </div>
                 <p className="text-slate-500 font-bold">Inbox is empty.</p>
               </div>
             ) : (
               <div className="divide-y divide-slate-100">
                 {messages.map((msg) => (
                   <div key={msg._id} className="transition-colors">
                     <div onClick={() => handleMessageClick(msg)} className={`p-4 sm:p-6 cursor-pointer flex gap-4 items-center hover:bg-slate-50 transition-colors ${msg.status === 'unread' ? 'bg-emerald-50/30' : 'bg-white'}`}>
                       <div className="shrink-0 w-2 flex justify-center">{msg.status === 'unread' && <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}</div>
                       <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                         <div className="flex flex-col min-w-0">
                           <p className={`truncate text-sm ${msg.status === 'unread' ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>{msg.name} <span className="font-normal text-slate-400 text-xs ml-2 hidden sm:inline">&lt;{msg.email}&gt;</span></p>
                           <p className={`truncate text-sm mt-0.5 ${msg.status === 'unread' ? 'font-bold text-slate-800' : 'font-medium text-slate-500'}`}>{msg.subject}</p>
                         </div>
                         <div className="shrink-0 text-xs font-bold text-slate-400 uppercase tracking-wider">{formatDate(msg.createdAt)}</div>
                       </div>
                     </div>
                     {expandedMsgId === msg._id && (
                       <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 text-slate-700 text-sm leading-relaxed">
                         <div className="mb-6 flex flex-col sm:hidden pb-4 border-b border-slate-200">
                           <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Reply to:</span>
                           <a href={`mailto:${msg.email}`} className="text-emerald-600 font-bold">{msg.email}</a>
                         </div>
                         <p className="whitespace-pre-wrap">{msg.message}</p>
                         <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
                           <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest py-2.5 px-6 rounded-lg transition-colors shadow-sm">Reply via Email</a>
                         </div>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             )}
           </div>
        )}

      </div>
    </div>
  );
}