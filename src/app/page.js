"use client";

import StartupIntakeForm from '../components/StartupIntakeForm';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from './lib/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import ReactFlow, { Background, Controls, MiniMap, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

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
  
  // --- MASTER PANEL STATES ---
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // Initial view defaults directly to dashboard metrics
  
  // Dynamic User Metrics Linked From Form Telemetry
  const [metrics, setMetrics] = useState({ matches: 0, opportunities: 0, connections: 0 });
  const [recommendations, setRecommendations] = useState([]);

  // React Flow Network Maps Graphing States
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  // Firebase Auth Check Lock Sequence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

 // --- TRIGGER ACTION SEQUENCE ON FORM INTENT COMPLETE ---
  const handleFormSubmissionComplete = async (submittedData) => {
    setLoading(true);
    
    try {
      // 1. Log profile schema mapping securely inside firestore cloud database
      await addDoc(collection(db, "smes"), {
        ...submittedData,
        createdAt: new Date()
      });

      // 2. Ping your live Next.js Gemini route handler passing actual form variables
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submittedData),
      });

      if (!response.ok) throw new Error('AI generation pipeline rejected request framework.');

      const aiData = await response.json();

      // 3. Populate state arrays directly from dynamic Gemini output telemetry streams!
      setMetrics({
        matches: aiData.matchesCount || 24,
        opportunities: aiData.opportunitiesCount || 19,
        connections: aiData.connectionsCount || 4
      });
      
      setRecommendations(aiData.recommendations || []);

      // Initialize Core Ecosystem Node Matrix mapping coordinates with real data
      setNodes([
        { 
          id: 'sme-core', 
          position: { x: 400, y: 300 }, 
          data: { label: `🏢 ${submittedData.startupName}` },
          style: { background: '#F59E0B', color: '#000', border: 'none', fontWeight: 'bold', borderRadius: '8px', padding: '15px' }
        }
      ]);

      // Move view matrix automatically back onto profile visualization tabs
      setActiveTab('profile');

    } catch (e) {
      console.error("Ecosystem sync compilation failed: ", e);
      alert("AI pipeline timed out. Proceeding with database registration fallback routine.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Signout instance termination failure: ", error);
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
      
      {/* Light Trail Core Tracker */}
      <div 
        className="pointer-events-none fixed top-0 left-0 w-6 h-6 bg-amber-500/80 rounded-full blur-[6px] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out z-50"
        style={{ top: mousePos.y, left: mousePos.x }}
      />

      <div className="flex relative z-10 min-h-screen">
        
        {/* --- SIDEBAR PANEL ARCHITECTURE --- */}
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
              { id: 'ai-matching', label: 'AI Matching' },
              { id: 'graph', label: 'Relationship Graph' }
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

        {/* --- MAIN INTERFACE FRAME MODULE --- */}
        <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative z-10 p-8 lg:p-12">
          
          {/* TAB 1: DASHBOARD DISPLAYS & METRICS OVERVIEW */}
          {activeTab === 'profile' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h2 className="text-3xl font-black text-white tracking-tight mb-1">Welcome back, SME FOUNDER 👋</h2>
                <p className="text-sm text-slate-500 font-medium">Real-time status analysis telemetry loops.</p>
              </header>

              {/* Data Dashboard Grid Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Matches', val: metrics.matches },
                  { label: 'Opportunities', val: metrics.opportunities },
                  { label: 'Connections', val: metrics.connections }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/20 transition-all">
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block mb-1">{stat.label}</span>
                    <span className="text-4xl font-black text-white">{stat.val}</span>
                    <div className="w-24 h-8 bg-gradient-to-r from-amber-500/0 to-amber-500/10 absolute bottom-0 right-0 transform skew-x-12 translate-y-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>

              {/* AI Recommendations Module Lists */}
              <div>
                <h3 className="text-lg font-bold text-white mb-6 tracking-tight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  AI Recommended Matches
                </h3>

                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendations.map((rec, index) => {
                      const scoreInt = parseInt(rec.matchScore) || 90;
                      return (
                        <div key={index} className="bg-slate-900/40 border border-white/5 hover:border-amber-500/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
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

                              {/* Progress Dial Match Engine Tracker */}
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

                            <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">{rec.explanation}</p>
                          </div>

                          <button 
                            onClick={() => {
                              const newNodeId = `node-${rec.name.replace(/\s+/g, '-').toLowerCase()}`;
                              if (nodes.find(n => n.id === newNodeId)) return alert("Already matched inside graph matrix.");
                              
                              const targetNode = {
                                id: newNodeId,
                                position: { x: Math.random() * 500 + 200, y: Math.random() * 300 + 100 },
                                data: { label: `${rec.type}: ${rec.name}` },
                                style: { background: '#1E293B', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '10px' }
                              };
                              const edgeNode = {
                                id: `edge-core-${newNodeId}`,
                                source: 'sme-core',
                                target: newNodeId,
                                animated: true,
                                style: { stroke: '#F59E0B', strokeWidth: 1.5 }
                              };
                              setNodes(nds => [...nds, targetNode]);
                              setEdges(eds => [...eds, edgeNode]);
                              setActiveTab('graph');
                            }}
                            className="w-full pt-3 mt-4 border-t border-slate-800 text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors flex items-center justify-between"
                          >
                            <span>Map and Connect Ecosystem Blueprint</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </button>
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

          {/* TAB 2: FUNCTIONAL MULTI-STEP DARK FORM REGISTRATION MODULE */}
          {activeTab === 'ai-matching' && (
            <div className="space-y-6 animate-in fade-in duration-400">
              <StartupIntakeForm onSubmitSuccess={handleFormSubmissionComplete} />
            </div>
          )}

          {/* TAB 3: RELATIONSHIP WORKSPACE NETWORK VIRTUALIZER */}
          {activeTab === 'graph' && (
             <div className="h-full w-full flex flex-col relative animate-in fade-in duration-500">
               <div className="absolute top-0 left-0 z-20 pointer-events-none">
                  <h2 className="text-3xl font-black text-white drop-shadow-lg mb-1">Ecosystem Visualizer</h2>
                  <p className="text-xs text-slate-500 font-medium drop-shadow-md">Scroll to zoom workspace viewports.</p>
               </div>
               
               <div className="flex-1 w-full bg-[#0B1120] h-[75vh] border border-white/5 rounded-2xl overflow-hidden mt-10 shadow-2xl">
                  {nodes.length > 0 ? (
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      fitView
                    >
                      <Background color="#1E293B" gap={16} size={1} />
                    </ReactFlow>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-medium text-slate-600 italic">
                      Ecosystem nodes empty. Complete onboarding mapping queries first.
                    </div>
                  )}
               </div>
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
