"use client";

import React, { useState } from 'react';

export default function InvestorAnalytics({ activeApplications = [] }) {
  // Interactive sliders for the founder to adjust their current reality
  const [metrics, setMetrics] = useState({
    mvpStatus: 50, // 0-100%
    traction: 20,  // 0-100%
    team: 50       // 0-100%
  });

  const handleSliderChange = (key, value) => {
    setMetrics(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  // The "Predictive Algorithm" (Tailored to different investor archetypes)
  const calculateProbability = (type) => {
    let score = 0;
    
    if (type.includes('Grant')) {
      // Grants care deeply about MVP and Team, less about current revenue/traction
      score = (metrics.mvpStatus * 0.5) + (metrics.team * 0.4) + (metrics.traction * 0.1);
    } else if (type.includes('Capital') || type.includes('VC')) {
      // VCs care massively about Traction and Team
      score = (metrics.traction * 0.6) + (metrics.team * 0.3) + (metrics.mvpStatus * 0.1);
    } else if (type.includes('Crowdfunding') || type.includes('ECF')) {
      // ECF cares about MVP (showing the crowd) and Traction (showing demand)
      score = (metrics.mvpStatus * 0.4) + (metrics.traction * 0.4) + (metrics.team * 0.2);
    } else {
      // Generic fallback weighting
      score = (metrics.mvpStatus * 0.33) + (metrics.traction * 0.33) + (metrics.team * 0.33);
    }

    // Add a baseline of 15% so it never looks completely hopeless
    return Math.min(Math.round(score + 15), 98); 
  };

  if (activeApplications.length === 0) {
    return (
      <div className="flex items-center justify-center h-full animate-in fade-in">
        <div className="bg-slate-900/40 border border-dashed border-slate-700 rounded-3xl p-12 text-center max-w-lg">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-black text-white mb-2">No Data to Analyze</h3>
          <p className="text-sm text-slate-500">You need to add investors to your Launch Board before the AI can run predictive acceptance models.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col pt-4">
      <header>
        <h2 className="text-3xl font-black text-white tracking-tight mb-1">Predictive Acceptance Engine 🔮</h2>
        <p className="text-sm text-slate-500 font-medium">Simulate your chances of securing funds by adjusting your current metrics.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: The Variables Control Panel */}
        <div className="lg:col-span-4 space-y-6 bg-slate-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-4">Startup Variables</h3>
          
          <div className="space-y-6">
            {/* Slider 1: MVP */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">MVP Readiness</label>
                <span className="text-xs font-bold text-amber-500">{metrics.mvpStatus}%</span>
              </div>
              <input type="range" min="0" max="100" value={metrics.mvpStatus} onChange={(e) => handleSliderChange('mvpStatus', e.target.value)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              <p className="text-[10px] text-slate-500 mt-1">Idea phase to fully launched product.</p>
            </div>

            {/* Slider 2: Traction */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Traction / Revenue</label>
                <span className="text-xs font-bold text-amber-500">{metrics.traction}%</span>
              </div>
              <input type="range" min="0" max="100" value={metrics.traction} onChange={(e) => handleSliderChange('traction', e.target.value)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              <p className="text-[10px] text-slate-500 mt-1">Zero users up to RM 50k+ Monthly Revenue.</p>
            </div>

            {/* Slider 3: Team */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Completeness</label>
                <span className="text-xs font-bold text-amber-500">{metrics.team}%</span>
              </div>
              <input type="range" min="0" max="100" value={metrics.team} onChange={(e) => handleSliderChange('team', e.target.value)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              <p className="text-[10px] text-slate-500 mt-1">Solo founder vs Full execution team.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Live Analytics Dashboard */}
        <div className="lg:col-span-8 space-y-4">
          {activeApplications.map((app) => {
            const prob = calculateProbability(app.type);
            
            // Dynamic color grading based on probability
            let colorStr = "from-red-500 to-rose-500";
            let statusText = "Highly Unlikely";
            if (prob > 40) { colorStr = "from-amber-500 to-orange-500"; statusText = "Possible fit, needs work"; }
            if (prob > 70) { colorStr = "from-emerald-400 to-green-500"; statusText = "Strong Candidate!"; }

            return (
              <div key={app.id} className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                
                {/* Background Glow Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colorStr} opacity-5 blur-3xl rounded-full`} />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">{app.type}</span>
                    <h4 className="text-lg font-black text-white">{app.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black tracking-tighter text-white">{prob}%</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Approval Odds</span>
                  </div>
                </div>

                {/* Custom Tailwind Progress Bar */}
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner relative z-10">
                  <div 
                    className={`h-full bg-gradient-to-r ${colorStr} transition-all duration-500 ease-out`}
                    style={{ width: `${prob}%` }}
                  />
                </div>
                
                <div className="mt-3 flex justify-between items-center relative z-10">
                  <span className={`text-xs font-bold ${prob > 70 ? 'text-emerald-400' : prob > 40 ? 'text-amber-500' : 'text-red-400'}`}>
                    AI Verdict: {statusText}
                  </span>
                  
                  <span className="text-[10px] text-slate-500">
                    {app.type.includes('Grant') ? "Heavily weights MVP status." : app.type.includes('VC') ? "Heavily weights revenue traction." : "Requires balanced metrics."}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
