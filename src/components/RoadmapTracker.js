"use client";

import React, { useState } from 'react';

export default function RoadmapTracker({ onCompleteRoadmap }) {
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    { 
      id: 'ssm', 
      title: 'SSM Registration', 
      desc: 'Register as an Enterprise, PLT, or Sdn Bhd with the Companies Commission of Malaysia.',
      link: 'https://ezbiz.ssm.com.my/'
    },
    { 
      id: 'bank', 
      title: 'Corporate Bank Account', 
      desc: 'Open a business current account (e.g., Maybank SME, CIMB Biz) using your SSM cert.',
      link: null
    },
    { 
      id: 'tax', 
      title: 'LHDN Tax PIN', 
      desc: 'Register your company with the Inland Revenue Board for your corporate tax file.',
      link: 'https://mytax.hasil.gov.my/'
    },
    { 
      id: 'pbt', 
      title: 'Local Council / PBT License', 
      desc: 'Obtain premise or operational licenses depending on your local municipality.',
      link: null
    }
  ];

  const toggleStep = (id) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(step => step !== id) : [...prev, id]
    );
  };

  const progress = (completedSteps.length / steps.length) * 100;
  const isFullyUnlocked = completedSteps.length === steps.length;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pt-4">
      
      {/* Header & Progress Bar */}
      <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">Pre-Flight Checklist 🚀</h2>
        <p className="text-sm text-slate-400 mb-6">Complete these mandatory legal frameworks to unlock institutional applications.</p>
        
        <div className="relative h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-3 text-xs font-bold uppercase tracking-wider">
          <span className="text-slate-500">Status: {progress === 100 ? 'Cleared for Launch' : 'Pending Compliance'}</span>
          <span className={progress === 100 ? 'text-amber-500 animate-pulse' : 'text-slate-400'}>{progress}%</span>
        </div>
      </div>

      {/* Interactive Checklist */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isDone = completedSteps.includes(step.id);
          return (
            <div 
              key={step.id} 
              onClick={() => toggleStep(step.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex gap-5 items-start group ${
                isDone 
                  ? 'bg-amber-500/5 border-amber-500/30' 
                  : 'bg-slate-900/30 border-white/5 hover:border-slate-600'
              }`}
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                isDone ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-600 text-transparent group-hover:border-slate-400'
              }`}>
                {isDone ? '✓' : index + 1}
              </div>
              
              <div className="flex-1">
                <h3 className={`text-lg font-bold tracking-tight mb-1 ${isDone ? 'text-amber-400' : 'text-white'}`}>
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
                
                {step.link && !isDone && (
                  <a href={step.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} 
                     className="inline-block mt-3 text-xs font-bold text-blue-400 hover:text-blue-300">
                    Go to Portal ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unlock Action */}
      <div className={`transition-all duration-500 ${isFullyUnlocked ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
        <button 
          onClick={onCompleteRoadmap}
          disabled={!isFullyUnlocked}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-2xl text-sm tracking-widest uppercase shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all"
        >
          Initialize Applications Pipeline
        </button>
      </div>

    </div>
  );
}
