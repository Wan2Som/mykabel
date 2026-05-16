"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebaseConfig';

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

export default function LoginPage() {
  const mousePos = useMousePosition();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 1. Handle Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirects to your main dashboard
    } catch (err) {
      setError("Failed to sign in. Check your email and password.");
    }
  };

  // 2. Handle Google Login
  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (err) {
      setError("Google sign-in failed.");
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

      {/* Dynamic Cursor Light Trail */}
      <div 
        className="pointer-events-none fixed w-[200px] h-[200px] rounded-full z-0 transition-transform duration-75"
        style={{ 
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(245, 158, 11, 0.15) 40%, rgba(0, 0, 0, 0) 70%)',
          top: mousePos.y, left: mousePos.x, transform: 'translate(-50%, -50%)'
        }}
      />

      <div className="glass-card w-full max-w-[420px] p-10 rounded-2xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <svg width="65" height="65" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-5 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            <circle cx="15" cy="85" r="8" fill="#475569" />
            <circle cx="15" cy="15" r="8" fill="#475569" />
            <circle cx="50" cy="50" r="8" fill="#475569" />
            <circle cx="85" cy="15" r="8" fill="#475569" />
            <circle cx="85" cy="85" r="8" fill="#475569" />
            <line x1="15" y1="15" x2="50" y2="50" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round"/>
            <line x1="50" y1="50" x2="85" y2="15" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round"/>
            <line x1="85" y1="15" x2="85" y2="85" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="10" fill="#F59E0B" />
            <circle cx="85" cy="15" r="10" fill="#F59E0B" />
          </svg>
          <h1 className="text-4xl font-black tracking-tighter mb-2 text-white">
            MyKabel<span className="text-amber-500 animate-pulse">|</span>
          </h1>
          <p className="text-sm font-bold text-slate-300 tracking-wide">The only kabel <i>you</i> need.</p>
        </div>

        {error && <p className="text-red-400 text-xs text-center font-bold mb-4 bg-red-900/30 py-2 rounded">{error}</p>}

        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3.5 text-sm font-bold text-white hover:bg-slate-700 hover:border-amber-500 transition-all focus:outline-none backdrop-blur-sm">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Connect via Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-slate-600/50"></div>
          <span className="px-4 text-xs text-slate-400 font-bold uppercase tracking-widest">Or manual entry</span>
          <div className="flex-grow border-t border-slate-600/50"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Company Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
              className="block w-full bg-[#0F172A]/80 px-4 py-3.5 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white sm:text-sm outline-none transition-all placeholder-slate-500 backdrop-blur-sm" 
              placeholder="founder@startup.com.my" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors">Forgot password?</a>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
              className="block w-full bg-[#0F172A]/80 px-4 py-3.5 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white sm:text-sm outline-none transition-all placeholder-slate-500 backdrop-blur-sm" 
              placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-accent w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-extrabold text-white bg-amber-500 mt-6 drop-shadow">
            Jom Connect
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          No account yet? 
          <button onClick={() => router.push('/signup')} className="font-bold text-white hover:text-amber-500 transition-colors ml-1 border-b border-amber-500/30 pb-0.5">Sign up here</button>
        </p>
      </div>
    </div>
  );
}