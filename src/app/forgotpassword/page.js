"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';

// --- Custom Cursor Hook ---
function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (ev) => setMousePosition({ x: ev.clientX, y: ev.clientY });
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
}

export default function ForgotPasswordPage() {
  const mousePos = useMousePosition();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsResetting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Success! Check your inbox for the password reset link.');
      setEmail(''); // Clear the input
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('No account found with this email.');
      else if (err.code === 'auth/invalid-email') setError('Please enter a valid email address.');
      else setError(err.message || 'Failed to send reset email.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center p-4 text-slate-200 relative overflow-hidden" 
         style={{
           backgroundImage: `linear-gradient(to bottom right, rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.98)), url('https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?q=80&w=2070&auto=format&fit=crop')`,
           backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#0B1120'
         }}>
         
      <style dangerouslySetInnerHTML={{__html: `
        .glass-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5); z-index: 10; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease; }
        .glass-card:hover { transform: translateY(-8px); box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.95), 0 0 20px 2px rgba(245, 158, 11, 0.5); border-color: rgba(245, 158, 11, 0.8); }
        .btn-accent { transition: all 0.3s ease; }
        .btn-accent:hover { box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4); transform: translateY(-2px); }
      `}} />

      {/* Dynamic Cursor Light Trail (Cursor Sized) */}
      <div 
        className="pointer-events-none fixed w-6 h-6 rounded-full z-50 transition-transform duration-75"
        style={{ 
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.9) 0%, rgba(245, 158, 11, 0.4) 50%, rgba(0, 0, 0, 0) 100%)',
          boxShadow: '0 0 12px 2px rgba(245, 158, 11, 0.5)',
          top: mousePos.y, left: mousePos.x, transform: 'translate(-50%, -50%)'
        }}
      />

      <div className="glass-card w-full max-w-[420px] p-10 rounded-2xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center mb-5 drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2 text-white">
            Reset Password
          </h1>
          <p className="text-sm font-medium text-slate-300 tracking-wide text-center">
            Enter your email and we'll send you a link to get back into your account.
          </p>
        </div>

        {error && <p className="text-red-400 text-xs text-center font-bold mb-4 bg-red-900/30 p-3 rounded-xl border border-red-500/20 break-words">{error}</p>}
        {message && <p className="text-emerald-400 text-xs text-center font-bold mb-4 bg-emerald-900/30 p-3 rounded-xl border border-emerald-500/20 break-words">{message}</p>}

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Account Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
              className="block w-full bg-[#0F172A]/80 px-4 py-3.5 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white sm:text-sm outline-none transition-all placeholder-slate-500 backdrop-blur-sm" 
              placeholder="founder@startup.com.my" />
          </div>

          <button type="submit" disabled={isResetting} className="btn-accent w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-extrabold text-white bg-amber-500 mt-6 drop-shadow disabled:opacity-50">
            {isResetting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          Remember your password? 
          <button onClick={() => router.push('/login')} className="font-bold text-white hover:text-amber-500 transition-colors ml-1 border-b border-amber-500/30 pb-0.5">Back to Login</button>
        </p>
      </div>
    </div>
  );
}
