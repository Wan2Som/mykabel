"use client";

import StartupIntakeForm from '../components/StartupIntakeForm';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from './lib/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import ReactFlow, { Background, Controls, MiniMap, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
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

// --- MOCK DATABASE (Replaces Firebase for the demo) ---
const initialSME = {
  id: "sme-1",
  name: "Warisan Snack Co.",
  location: "Kelantan",
  industry: "Traditional Food",
  goal: "E-commerce expansion & Halal Export",
  dateAdded: "2026-05-16",
  status: "Active"
};

export default function Dashboard() {
  const router = useRouter();
  const mousePos = useMousePosition();
  
  // --- ALL HOOKS & STATES MUST LIVE AT THE TOP ---
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [promptInput, setPromptInput] = useState("Traditional food SME from Kelantan looking for digitalization grants and halal export mentors.");
  
  // Data States
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  // React Flow States
  const [nodes, setNodes] = useState([
    { 
      id: 'sme-1', 
      position: { x: 400, y: 300 }, 
      data: { label: '🏢 Warisan Snack Co.' },
      style: { background: '#06b6d4', color: '#000', border: 'none', fontWeight: 'bold', borderRadius: '8px', padding: '15px' }
    }
  ]);
  const [edges, setEdges] = useState([]);

  // React Flow Handlers
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  // Firebase Auth Check
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

  // --- ACTIONS ---
  
  // 1. Fetch AI Data
  const triggerGeminiAnalysis = async () => {
    if (!promptInput.trim()) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setRecommendations([]);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setAiAnalysis({ maturity: data.maturity, potential: data.potential, summary: data.summary });
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      alert("Failed to connect to the AI Engine.");
    } finally {
      setIsAnalyzing(false);
    }  
  };

  // 2. Save SME metadata to Firebase
  const saveSMEToDatabase = async (smeData, aiResults) => {
    try {
      const docRef = await addDoc(collection(db, "smes"), {
        name: smeData.name,
        location: smeData.location,
        needs: smeData.needs,
        aiMatches: aiResults,
        createdAt: new Date()
      });
      console.log("SME saved to database with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // 3. Add to Graph Function
  const handleAddToGraph = (rec) => {
    const newNodeId = `node-${rec.name.replace(/\s+/g, '-').toLowerCase()}`;
    
    if (nodes.find(n => n.id === newNodeId)) {
      alert(`${rec.name} is already in the graph!`);
      return;
    }

    let nodeColor = '#3b82f6'; 
    if (rec.type === 'Grant') nodeColor = '#10b981'; 
    if (rec.type === 'Programme') nodeColor = '#8b5cf6'; 

    const newNode = {
      id: newNodeId,
      position: { x: Math.random() * 600 + 100, y: Math.random() * 400 + 50 }, 
      data: { label: `${rec.type}: ${rec.name}` },
      style: { background: nodeColor, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px' }
    };
    
    const newEdge = {
      id: `edge-sme1-${newNodeId}`,
      source: 'sme-1',
      target: newNodeId,
      animated: true,
      style: { stroke: nodeColor, strokeWidth: 2 }
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setActiveTab('graph');
  };

  // 4. Handle Sign Out
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }; 

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-cyan-500 animate-pulse text-xl font-bold">Verifying MyKabel Access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* Light Trail */}
      <div 
        className="pointer-events-none fixed top-0 left-0 w-6 h-6 bg-cyan-400/80 rounded-full blur-[6px] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out z-50"
        style={{ top: mousePos.y, left: mousePos.x }}
      />

      <div className="flex relative z-10 min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800/50 p-6 flex flex-col z-20">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-10 tracking-tight">
            MyKabel
          </h1>
          <nav className="space-y-2 flex-1">
            {[
              { id: 'dashboard', label: 'Ecosystem Engine' },
              { id: 'intakes', label: 'SME Database' },
              { id: 'graph', label: 'Relationship Graph' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  activeTab === tab.id 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full mt-auto px-4 py-3 rounded-lg text-left text-sm font-medium text-red-400/70 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all"
          >
            🚪 Sign Out
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative z-10">
          
          {/* TAB: DASHBOARD */}
          <div className={`p-8 lg:p-12 ${activeTab === 'dashboard' ? 'block' : 'hidden'}`}>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-10">
                <h2 className="text-4xl font-bold text-white mb-2">Intelligence Hub</h2>
                <p className="text-zinc-500">Route SMEs instantly using Gemini AI context awareness.</p>
              </header>

              <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 mb-8 shadow-xl">
                <div className="w-full">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Custom AI Prompt (Describe the SME)</label>
                  <div className="relative">
                    <textarea 
                      rows="2"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="Describe the business, location, and goals..."
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none shadow-inner"
                    />
                    <button 
                      onClick={triggerGeminiAnalysis}
                      disabled={isAnalyzing || !promptInput}
                      className="absolute bottom-3 right-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium py-1.5 px-4 rounded-md transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                    >
                      {isAnalyzing ? "Processing..." : "Generate Routing"}
                    </button>
                  </div>
                </div>
              </div>

              {aiAnalysis && (
                <div className="bg-gradient-to-br from-cyan-950/30 to-blue-900/10 border border-cyan-900/50 rounded-2xl p-6 mb-8 animate-in fade-in duration-700">
                  <div className="flex gap-3 mb-4">
                    <span className="px-3 py-1 bg-zinc-950 border border-cyan-800/50 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-wide">
                      {aiAnalysis.maturity}
                    </span>
                    <span className="px-3 py-1 bg-zinc-950 border border-emerald-800/50 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wide">
                      {aiAnalysis.potential}
                    </span>
                  </div>
                  <p className="text-cyan-100/80 leading-relaxed text-lg">
                    {aiAnalysis.summary}
                  </p>
                </div>
              )}

              {recommendations.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    Optimized Pathways ({recommendations.length} Matches)
                  </h3>
                  
                  {/* --- OVERHAULED PREMIUM MATCH CARD GRID --- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec, index) => {
                      // Strip percentage sign if it exists in data to use cleanly in formula
                      const scoreNum = parseInt(rec.matchScore) || 90;
                      
                      return (
                        <div key={index} className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-cyan-500/30 hover:bg-zinc-800/30 transition-all duration-300 flex flex-col justify-between relative group shadow-xl">
                          <div>
                            {/* Card Header Row */}
                            <div className="flex justify-between items-start mb-5">
                              <div className="flex items-center gap-3">
                                {/* Gradient Initial Logo Emblem */}
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-inner uppercase">
                                  {rec.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors line-clamp-1">
                                    {rec.name}
                                  </h4>
                                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 border border-cyan-900/50 px-2 py-0.5 rounded">
                                    {rec.type}
                                  </span>
                                </div>
                              </div>

                              {/* Circular AI Matching Progress Circle */}
                              <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                  <path className="text-zinc-800" strokeWidth="3px" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <path className="text-cyan-500 transition-all duration-500" strokeDasharray={`${scoreNum}, 100`} strokeWidth="3px" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <span className="absolute text-[11px] font-black text-zinc-200">{scoreNum}%</span>
                              </div>
                            </div>

                            {/* Inside Context Box */}
                            <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80 text-xs text-zinc-400 leading-relaxed mb-4 min-h-[72px]">
                              {rec.explanation}
                            </div>
                          </div>

                          {/* Interactive Connect Blueprint Trigger */}
                          <button 
                            onClick={() => handleAddToGraph(rec)}
                            className="text-xs font-semibold text-zinc-400 hover:text-cyan-400 transition-colors w-full pt-3 border-t border-zinc-800/60 flex items-center justify-between"
                          >
                            <span>Map Into Ecosystem</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TAB: SME INTAKES */}
          <div className={`p-8 lg:p-12 h-full ${activeTab === 'intakes' ? 'block' : 'hidden'}`}>
             <div className="animate-in fade-in duration-500 h-full flex flex-col gap-10">
               <div>
                 <h2 className="text-4xl font-bold text-white mb-2">SME Onboarding</h2>
                 <p className="text-zinc-500">Register and manage ecosystems using structured matching profiles.</p>
               </div>

               {/* --- RENDER THE NEW LIGHT MODE INTAKE FORM WIZARD --- */}
               <div className="theme-light-wrapper">
                 <StartupIntakeForm />
               </div>
               
               {/* Saved Records Data Ledger */}
               <div>
                 <h3 className="text-xl font-bold text-white mb-4">Historical Records</h3>
                 <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                   <table className="w-full text-left text-sm text-zinc-400">
                     <thead className="bg-zinc-950 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                       <tr>
                         <th className="px-6 py-4 font-semibold">Business Name</th>
                         <th className="px-6 py-4 font-semibold">Location</th>
                         <th className="px-6 py-4 font-semibold">Industry</th>
                         <th className="px-6 py-4 font-semibold">Status</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                         <td className="px-6 py-4 font-medium text-white">{initialSME.name}</td>
                         <td className="px-6 py-4">{initialSME.location}</td>
                         <td className="px-6 py-4">{initialSME.industry}</td>
                         <td className="px-6 py-4"><span className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded text-xs">Active</span></td>
                       </tr>
                       <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                         <td className="px-6 py-4 font-medium text-white">Desa Tech Craft</td>
                         <td className="px-6 py-4">Pahang</td>
                         <td className="px-6 py-4">Handicrafts</td>
                         <td className="px-6 py-4"><span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-xs">Matched</span></td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </div>

             </div>
          </div>

          {/* TAB: RELATIONSHIP GRAPH */}
          {activeTab === 'graph' && (
             <div className="h-full w-full flex flex-col relative animate-in fade-in duration-500">
               <div className="absolute top-8 left-8 z-20 pointer-events-none">
                  <h2 className="text-4xl font-bold text-white drop-shadow-lg">Ecosystem Visualizer</h2>
                  <p className="text-zinc-400 drop-shadow-md">Drag to pan, scroll to zoom.</p>
               </div>
               
               <div className="flex-1 w-full bg-zinc-950 h-screen">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    className="dark-theme-graph"
                  >
                    <Background color="#27272a" gap={16} size={1} />
                    <Controls className="bg-zinc-900 border-zinc-800 fill-zinc-400" />
                    <MiniMap 
                      nodeColor={(node) => node.style?.background || '#333'} 
                      maskColor="rgba(0,0,0,0.7)"
                      className="bg-zinc-900 border-zinc-800"
                    />
                  </ReactFlow>
               </div>
             </div>
          )}

        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #09090b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
        /* React Flow Dark Mode Fixes */
        .react-flow__panel { background: #18181b; border: 1px solid #27272a; border-radius: 8px; overflow: hidden; }
        .react-flow__controls-button { background: #18181b; border-bottom: 1px solid #27272a; fill: #a1a1aa; }
        .react-flow__controls-button:hover { background: #27272a; }
      `}} />
    </div>
  );
}
