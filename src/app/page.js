"use client";

import StartupIntakeForm from '../components/StartupIntakeForm';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from './lib/firebaseConfig';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

// --- CUSTOM HOOK: Glow Cursor Trail ---
function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
}

export default function Dashboard() {
  const router = useRouter();
  const mousePos = useMousePosition();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); 
  const [userName, setUserName] = useState('Founder'); // Dynamic display name state variable
  
  const [metrics, setMetrics] = useState({ matches: 0, opportunities: 0, connections: 0 });
  const [recommendations, setRecommendations] = useState([]);

  // Firebase Auth Check & Session State Recovery
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
      } else {
        // Fallback name prioritizing Google Auth Display Names or Email prefixes
        let nameToSet = user.displayName || user.email.split('@')[0] || 'Founder';
        
        try {
          // Query Firestore using the unique User ID as the document locator anchor
          const docRef = doc(db, "smes", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Re-hydrate the dashboard states from the saved database profile cache
            setMetrics(data.metrics || { matches: 24, opportunities: 19, connections: 4 });
            setRecommendations(data.recommendations || []);
            
            if (data.founderName) {
              nameToSet = data.founderName;
            }
            setActiveTab('profile'); // Profile data exists, send directly to dashboard view
          } else {
            setActiveTab('ai-matching'); // No profile data exists, route directly to setup wizard
          }
        } catch (error) {
          console.error("Error loading user ecosystem profile state:", error);
          setActiveTab('ai-matching');
        }
        
        setUserName(nameToSet);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // --- TRIGGER ACTION SEQUENCE ON FORM INTENT COMPLETE ---
  const handleFormSubmissionComplete = async (submittedData) => {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
      alert("Session expired. Please authenticate again.");
      router.push('/login');
      return;
    }
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submittedData),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown Server Error");
        throw new Error(`Server Status ${response.status}: ${errorText}`);
      }

      const aiData = await response.json();

      const newMetrics = {
        matches: aiData.matchesCount || 24,
        opportunities: aiData.opportunitiesCount || 19,
        connections: aiData.connectionsCount || 4
      };
      const newRecs = aiData.recommendations || [];

      // Write data directly using the user's secure UID as the absolute document ID map path
      await setDoc(doc(db, "smes", user.uid), {
        ...submittedData,
        metrics: newMetrics,
        recommendations: newRecs,
        userId: user.uid,
        createdAt: new Date()
      });

      // Update runtime environment variables
      setMetrics(newMetrics);
      setRecommendations(newRecs);
      setUserName(submittedData.founderName || user.displayName || user.email.split('@')[0]);
      setActiveTab('profile');

    } catch (e) {
      console.error("Ecosystem sync compilation failed: ", e);
      alert(`AI Pipeline Failed!\nReason: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Signout failure: ", error);
    }
  }; 

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-amber-500 animate-pulse text-xl font-bold tracking-widest uppercase">Syncing Cloud Matrix...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans overflow-hidden relative selection:bg-amber-500/30">
      
      {/* Light Trail */}
      <div 
        className="pointer-events-none fixed top-0 left-0 w-6 h-6 bg-amber-500/80 rounded-full blur-[6px] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out z-50"
        style={{ top: mousePos.y, left: mousePos.x }}
      />

      <div className="flex relative z-10 min-h-screen">
        
        {/* SIDEBAR PANEL */}
        <aside className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col z-20">
          <div className="mb-10 px-4">
            <h1 className="text-2xl font-black text-white tracking-tighter">
              MyKabel<span className="text-amber-500 animate-pulse">|</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Ecosystem Matrix Router</p>
          </div>
          
          <nav className="space-y-1.5 flex-1">
            {[
              { id: 'profile', label: 'My Profile' },
              { id: 'ai-matching', label: 'AI Matching' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold ${
                  activeTab === tab.id 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.08)]' 
                    : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full mt-auto px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider text-red-400/60 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/10 transition-all"
          >
            🚪 Sign Out
          </button>
        </aside>

        {/* MAIN INTERFACE CONTEXT FRAME */}
        <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative z-10 p-8 lg:p-12">
          
          {/* TAB 1: PROFILE METRICS & ACTION LINKS */}
          {activeTab === 'profile' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                {/* Fixed Dynamic Welcome Header */}
                <h2 className="text-3xl font-black text-white tracking-tight mb-1">Welcome back, {userName} 👋</h2>
                <p className="text-sm text-slate-500 font-medium">Real-time status analysis telemetry loops.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Matches', val: metrics.matches },
                  { label: 'Opportunities', val: metrics.opportunities },
                  { label: 'Connections', val: metrics.connections }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/20 transition-all">
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block mb-1">{stat.label}</span>
                    <span className="text-4xl font-black text-white">{stat.val}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-6 tracking-tight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  AI Recommended Matches
                </h3>

                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recommendations.map((rec, index) => {
                      const scoreInt = parseInt(rec.matchScore) || 90;
                      return (
                        <div key={index} className="bg-slate-900/40 border border-white/5 hover:border-amber-500/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-inner">
                                  {rec.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-bold text-white text-base tracking-tight line-clamp-1">{rec.name}</h4>
                                  <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider">{rec.type}</span>
                                </div>
                              </div>

                              <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                  <path className="text-slate-800" strokeWidth="3px" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <path className="text-amber-500" strokeDasharray={`${scoreInt}, 100`} strokeWidth="3px" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <span className="absolute text-[10px] font-black text-zinc-100">{scoreInt}%</span>
                              </div>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-400 mb-4 border-t border-b border-slate-800/50 py-3 my-3">
                              <div><span className="font-bold text-slate-500 inline-block w-24">Sector Focus:</span> {rec.focus}</div>
                              <div><span className="font-bold text-slate-500 inline-block w-24">Stage Criteria:</span> {rec.stage}</div>
                              <div><span className="font-bold text-slate-500 inline-block w-24">Ticket Limits:</span> <span className="text-emerald-400 font-semibold">{rec.ticketSize}</span></div>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed min-h-[36px] mb-4">{rec.explanation}</p>
                          </div>

                          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
                            <a 
                              href={rec.portalUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-center py-2.5 rounded-xl text-xs tracking-wide shadow-md shadow-amber-500/10 transition-all flex items-center justify-center gap-1"
                            >
                              <span>Apply Now Portal</span>
                              <span>↗</span>
                            </a>
                            <a 
                              href={rec.faqUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-slate-300 transition-colors py-1"
                            >
                              Read Institutional Guidelines & FAQ
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
                    <p className="text-sm text-slate-500 font-medium mb-4">No match data detected. Onboard your business parameters.</p>
                    <button onClick={() => setActiveTab('ai-matching')} className="bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-amber-400 transition-all">
                      Initialize Onboarding Wizard
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FUNCTIONAL MULTI-STEP INTENT ROUTER */}
          {activeTab === 'ai-matching' && (
            <div className="space-y-6 animate-in fade-in duration-400">
              <StartupIntakeForm onSubmitSuccess={handleFormSubmissionComplete} />
            </div>
          )}

        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0B1120; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}
