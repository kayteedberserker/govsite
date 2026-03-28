// app/admin/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'library', 'news', 'inbox'
  
  // --- MEDIA UPLOAD STATE ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('gallery');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // --- MEDIA LIBRARY STATE (NEW) ---
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

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

  // --- INBOX STATE ---
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [expandedMsgId, setExpandedMsgId] = useState(null);

  // --- DATA FETCHING (EFFECTS) ---
  useEffect(() => {
    if (activeTab === 'inbox') fetchMessages();
    if (activeTab === 'library') fetchMedia();
  }, [activeTab]);

  // --- INBOX HANDLERS ---
  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

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
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMessageClick = (msg) => {
    if (expandedMsgId === msg._id) {
      setExpandedMsgId(null);
    } else {
      setExpandedMsgId(msg._id);
      if (msg.status === 'unread') markAsRead(msg._id);
    }
  };

  // --- MEDIA LIBRARY HANDLERS ---
  const fetchMedia = async () => {
    setIsLoadingMedia(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success) setMediaItems(data.data);
    } catch (error) {
      console.error("Failed to fetch media", error);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleDeleteMedia = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        // Remove the item from local state immediately
        setMediaItems(prev => prev.filter(item => item._id !== id));
      } else {
        alert(data.error || "Failed to delete media.");
      }
    } catch (error) {
      alert("An error occurred while deleting.");
    }
  };

  const copyToClipboard = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
  };

  // --- UPLOAD HANDLERS ---
  const handleFileChange = (e, type = 'media') => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      if (type === 'media') {
        setFile(selectedFile);
        setPreviewUrl(url);
        setIsVideo(selectedFile.type.startsWith('video/'));
        setUploadMessage('');
      } else {
        setNewsFile(selectedFile);
        setNewsPreviewUrl(url);
        setPublishMessage('');
      }
    }
  };

  const handleRemoveFile = (type = 'media') => {
    if (type === 'media') {
      setFile(null); setPreviewUrl(''); setIsVideo(false);
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
    if (!file) return setUploadMessage('Please select a file.');
    setIsUploading(true); setUploadMessage('');

    const formData = new FormData();
    formData.append('image', file); 
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    try {
      const response = await fetch('/api/media', { method: 'POST', body: formData });
      const data = await response.json();
      if (response.ok && data.success) {
        setUploadMessage('Upload successful!');
        setTitle(''); setDescription(''); handleRemoveFile('media'); 
      } else {
        setUploadMessage(data.error || 'Upload failed.');
      }
    } catch (error) {
      setUploadMessage(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // --- NEWSROOM HANDLERS ---
  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    if (!newsFile) return setPublishMessage('Please select a cover image.');
    setIsPublishing(true); setPublishMessage('');

    const formData = new FormData();
    formData.append('image', newsFile); 
    formData.append('title', newsTitle);
    formData.append('excerpt', newsExcerpt);
    formData.append('content', newsContent);
    formData.append('category', newsCategory);
    formData.append('featured', newsFeatured);

    try {
      const response = await fetch('/api/articles', { method: 'POST', body: formData });
      const data = await response.json();
      if (response.ok && data.success) {
        setPublishMessage('Article published successfully!');
        setNewsTitle(''); setNewsExcerpt(''); setNewsContent(''); setNewsFeatured(false);
        handleRemoveFile('news'); 
      } else {
        setPublishMessage(data.error || 'Publish failed.');
      }
    } catch (error) {
      setPublishMessage(`Error: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center pb-20">
      
      {/* --- DASHBOARD HEADER --- */}
      <div className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-6 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Campaign Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-widest">THE SYSTEM <span className="text-emerald-600">|</span> Authorized Access Only</p>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 font-bold py-2 px-4 rounded-xl transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="max-w-5xl mx-auto flex gap-6 mt-8 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('upload')} className={`pb-3 text-sm font-bold tracking-widest uppercase transition-colors relative whitespace-nowrap ${activeTab === 'upload' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}>
            Upload Media
            {activeTab === 'upload' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-lg"></div>}
          </button>

          <button onClick={() => setActiveTab('library')} className={`pb-3 text-sm font-bold tracking-widest uppercase transition-colors relative whitespace-nowrap ${activeTab === 'library' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}>
            Media Library
            {activeTab === 'library' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-lg"></div>}
          </button>

          <button onClick={() => setActiveTab('news')} className={`pb-3 text-sm font-bold tracking-widest uppercase transition-colors relative whitespace-nowrap ${activeTab === 'news' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}>
            Newsroom
            {activeTab === 'news' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-lg"></div>}
          </button>
          
          <button onClick={() => setActiveTab('inbox')} className={`pb-3 text-sm font-bold tracking-widest uppercase transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'inbox' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}>
            Voter Inbox
            {unreadCount > 0 && <span className="bg-emerald-100 text-emerald-700 py-0.5 px-2 rounded-full text-[10px] font-black">{unreadCount}</span>}
            {activeTab === 'inbox' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-lg"></div>}
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-5xl p-4 sm:p-8 mt-4">

        {/* ================= MEDIA LIBRARY TAB ================= */}
        {activeTab === 'library' && (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Manage Uploaded Media</h2>
              <button onClick={fetchMedia} className="text-slate-400 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-emerald-50">
                <svg className={`w-5 h-5 ${isLoadingMedia ? 'animate-spin text-emerald-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>

            {isLoadingMedia && mediaItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">Loading Library...</div>
            ) : mediaItems.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-slate-500 font-bold">No media found. Upload something first!</p>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaItems.map((item) => {
                  const isVideoItem = item.imageUrl?.includes('/video/');
                  const isCopied = copiedId === item._id;

                  return (
                    <div key={item._id} className="group border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col bg-white">
                      
                      <div className="relative aspect-video bg-slate-100 border-b border-slate-200 overflow-hidden">
                        {isVideoItem ? (
                          <video src={item.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                          {item.category}
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-slate-900 text-sm truncate mb-1" title={item.title}>{item.title}</h3>
                        <p className="text-xs text-slate-500 mb-4">{formatDate(item.createdAt)}</p>
                        
                        <div className="mt-auto flex justify-between items-center border-t border-slate-100 pt-3">
                          <button 
                            onClick={() => copyToClipboard(item._id, item.imageUrl)}
                            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${isCopied ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'}`}
                          >
                            {isCopied ? (
                              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Copied</>
                            ) : (
                              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> Copy URL</>
                            )}
                          </button>

                          <button 
                            onClick={() => handleDeleteMedia(item._id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50"
                            title="Delete Media"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* ================= NEWSROOM TAB ================= */}
        {activeTab === 'news' && (
          <form onSubmit={handleNewsSubmit} className="bg-white p-6 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Publish Campaign Update</h2>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Headline</label>
              <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} required className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" placeholder="Enter headline..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                <select value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none font-medium">
                  <option value="Policy Announcement">Policy Announcement</option>
                  <option value="On The Trail">On The Trail</option>
                  <option value="Endorsements">Endorsements</option>
                  <option value="Press Release">Press Release</option>
                </select>
              </div>
              <div className="flex items-center mt-6 md:mt-8 ml-2">
                <input type="checkbox" id="featured" checked={newsFeatured} onChange={(e) => setNewsFeatured(e.target.checked)} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300" />
                <label htmlFor="featured" className="ml-3 text-sm font-bold text-slate-700 cursor-pointer">Mark as Featured Article</label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Short Excerpt</label>
              <textarea value={newsExcerpt} onChange={(e) => setNewsExcerpt(e.target.value)} required rows="2" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none" placeholder="A brief summary for the news feed..." />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Content</label>
              <textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} required rows="10" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none" placeholder="Write the full article here..." />
            </div>

            <div className="mb-10">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Cover Image</label>
              {!newsPreviewUrl ? (
                <div className="relative">
                  <input id="news-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'news')} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-full px-4 py-10 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    <span className="font-bold text-sm">Upload Cover Photo</span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-56 rounded-xl border border-slate-200 overflow-hidden bg-black flex items-center justify-center group shadow-inner">
                  <img src={newsPreviewUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <button type="button" onClick={() => handleRemoveFile('news')} className="p-3 bg-red-500/90 hover:bg-red-600 rounded-full text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isPublishing ? (
              <div className="flex justify-center items-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-emerald-600"></div>
                <span className="ml-3 text-emerald-700 font-bold text-sm tracking-widest uppercase">Publishing...</span>
              </div>
            ) : (
              <button type="submit" className="w-full bg-slate-900 text-white font-black tracking-widest uppercase py-4 px-4 rounded-xl shadow-lg hover:bg-emerald-700 hover:-translate-y-0.5 transition-all active:scale-[0.98]">
                Publish Article
              </button>
            )}

            {publishMessage && (
              <div className={`mt-6 p-4 rounded-xl border text-center text-sm font-bold uppercase tracking-wider ${publishMessage.includes('success') ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                {publishMessage}
              </div>
            )}
          </form>
        )}

        {/* ================= MEDIA UPLOAD TAB ================= */}
        {activeTab === 'upload' && (
          <form onSubmit={handleUploadSubmit} className="bg-white p-6 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Add Campaign Media</h2>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" placeholder="E.g., Youth Town Hall 2026" />
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none font-medium">
                <option value="gallery">Main Gallery</option>
                <option value="carousel">Hero Carousel</option>
                <option value="governor">Governor Portrait</option>
                <option value="upload">General File Hosting</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none" placeholder="Enter context for this media..." rows="3" />
            </div>
            <div className="mb-10">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Media File</label>
              {!previewUrl ? (
                <div className="relative">
                  <input id="media-upload" type="file" accept="image/*,video/*" onChange={(e) => handleFileChange(e, 'media')} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-full px-4 py-10 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
                    <span className="font-bold text-sm">Click or Drag File Here</span>
                    <span className="text-xs font-medium mt-1 uppercase tracking-widest">PNG, JPG, MP4 (Max 10MB)</span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-56 rounded-xl border border-slate-200 overflow-hidden bg-black flex items-center justify-center group shadow-inner">
                  {isVideo ? <video src={previewUrl} className="w-full h-full object-cover opacity-80" /> : <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm">
                    <button type="button" onClick={() => setIsLightboxOpen(true)} className="p-3 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg></button>
                    <button type="button" onClick={() => handleRemoveFile('media')} className="p-3 bg-red-500/90 hover:bg-red-600 rounded-full text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                  </div>
                </div>
              )}
            </div>

            {isUploading ? (
              <div className="flex justify-center items-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-emerald-600"></div>
                <span className="ml-3 text-emerald-700 font-bold text-sm tracking-widest uppercase">Processing...</span>
              </div>
            ) : (
              <button type="submit" className="w-full bg-slate-900 text-white font-black tracking-widest uppercase py-4 px-4 rounded-xl shadow-lg hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]">
                Upload to Network
              </button>
            )}
            {uploadMessage && <div className={`mt-6 p-4 rounded-xl border text-center text-sm font-bold uppercase tracking-wider ${uploadMessage.includes('success') ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>{uploadMessage}</div>}
          </form>
        )}

        {/* ================= INBOX TAB ================= */}
        {activeTab === 'inbox' && (
           <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden max-w-4xl mx-auto">
             <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h2 className="text-xl font-bold text-slate-900">Voter Mandates</h2>
               <button onClick={fetchMessages} className="text-slate-400 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-emerald-50">
                 <svg className={`w-5 h-5 ${isLoadingMessages ? 'animate-spin text-emerald-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
               </button>
             </div>
             {isLoadingMessages && messages.length === 0 ? (
               <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">Loading Inbox...</div>
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

      {/* LIGHTBOX FOR UPLOADS */}
      {isLightboxOpen && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4" onClick={() => setIsLightboxOpen(false)}>
          <div className="relative max-w-4xl max-h-[80vh] w-full flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
             <button type="button" onClick={() => setIsLightboxOpen(false)} className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {isVideo ? <video src={previewUrl} controls autoPlay className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/10" /> : <img src={previewUrl} alt="Fullscreen Preview" className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/10" />}
          </div>
        </div>
      )}
    </div>
  );
}