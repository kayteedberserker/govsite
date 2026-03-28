// app/contact/page.jsx
'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ name: '', email: '', subject: '', message: '' }); 
        
        setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
      } else {
        setStatus({ loading: false, success: false, error: data.error || 'Failed to send message.' });
      }
    } catch (error) {
      setStatus({ loading: false, success: false, error: 'An unexpected error occurred.' });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* ================= CAMPAIGN HEADER ================= */}
      <section className="bg-slate-950 pt-32 pb-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow for premium feel */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold tracking-[0.2em] text-xs uppercase mb-6">
            Official 2026 Campaign Desk
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight mb-6">
            Join The <span className="text-emerald-500">Movement</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Real change doesn't happen in government offices; it happens in our communities. Send a direct mandate to the Aspirant's team today.
          </p>
        </div>
      </section>

      {/* ================= ASYMMETRICAL CONTACT SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: The Form (Takes up 7 columns, overlaps the dark header) */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.08)] border border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Send a Direct Message</h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">Your input shapes our 2026 policy framework.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {status.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl font-bold text-sm tracking-wide">
                  MANDATE RECEIVED. Thank you for joining the movement.
                </div>
              )}

              {status.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl font-bold text-sm tracking-wide">
                  {status.error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Group: Stripped of default outlines, styled with clean bottom borders */}
                <div className="relative group">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block transition-colors group-focus-within:text-emerald-600">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    // The fix: outline-none and ring-0 strip the ugly browser defaults
                    className="w-full bg-transparent border-b-2 border-slate-200 py-2 text-slate-900 font-medium focus:outline-none focus:ring-0 focus:border-emerald-600 transition-colors rounded-none px-0"
                    placeholder="Citizen Name"
                  />
                </div>
                
                <div className="relative group">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block transition-colors group-focus-within:text-emerald-600">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b-2 border-slate-200 py-2 text-slate-900 font-medium focus:outline-none focus:ring-0 focus:border-emerald-600 transition-colors rounded-none px-0"
                    placeholder="email@domain.com"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block transition-colors group-focus-within:text-emerald-600">Subject / Category</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b-2 border-slate-200 py-2 text-slate-900 font-medium focus:outline-none focus:ring-0 focus:border-emerald-600 transition-colors rounded-none px-0 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Reason for Contact</option>
                  <option value="Volunteer">Volunteer for 2026</option>
                  <option value="Policy Suggestion">Policy Suggestion</option>
                  <option value="Media Inquiry">Media Inquiry</option>
                  <option value="Donation/Support">Donation / Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="relative group">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block transition-colors group-focus-within:text-emerald-600">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full bg-transparent border-b-2 border-slate-200 py-2 text-slate-900 font-medium focus:outline-none focus:ring-0 focus:border-emerald-600 transition-colors rounded-none px-0 resize-none"
                  placeholder="Tell us what matters to your community..."
                ></textarea>
              </div>

              <div className="pt-4">
                {status.loading ? (
                  <div className="flex justify-center items-center py-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-emerald-600"></div>
                    <span className="ml-3 text-emerald-700 font-bold text-sm uppercase tracking-widest">Transmitting...</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-emerald-700 text-white font-black tracking-widest uppercase py-4 px-6 rounded-2xl shadow-[0_8px_20px_rgba(4,120,87,0.3)] hover:bg-slate-900 hover:shadow-[0_8px_20px_rgba(15,23,42,0.3)] hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]"
                  >
                    Submit Mandate
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* RIGHT: Contact Info (Takes up 5 columns, sits lower) */}
          <div className="lg:col-span-5 lg:pl-8 lg:pt-16">
            <div className="space-y-10">
              
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">State Headquarters</h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-lg">Central District Office</p>
                    <p className="text-slate-500 font-medium mt-1">123 Freedom Way, Suite 400<br />Capital City, State HQ</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Direct Lines</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-lg">contact@campaign2026.com</p>
                      <p className="text-slate-500 text-sm font-medium mt-0.5">Average response: 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-lg">+1 (555) 123-4567</p>
                      <p className="text-slate-500 text-sm font-medium mt-0.5">Press 1 for Volunteer Coordination</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Official Channels</h3>
                <div className="flex gap-3">
                  {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                    <a key={social} href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-emerald-600 hover:-translate-y-1 transition-all duration-300 shadow-md">
                      <span className="text-[10px] font-bold uppercase">{social.substring(0, 2)}</span>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}