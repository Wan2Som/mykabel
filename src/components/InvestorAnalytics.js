"use client";

import React from 'react';

export default function InvestorAnalytics({ activeApplications = [] }) {
  // 1. EXTRACT DATA DIRECTLY FROM THE ONBOARDED PROFILE
  // Simulated operational metrics based on standard early-stage tech startups in Malaysia
  const baseBurnRate = 12000; // RM 12,000 operational cash burn per month
  const currentCash = 35000;  // RM 35,000 remaining cash in bank

  const parseTicketSize = (sizeStr) => {
    if (!sizeStr) return 100000;
    const cleanNum = parseInt(sizeStr.replace(/[^0-9]/g, ''));
    if (sizeStr.toUpperCase().includes('K')) return cleanNum * 1000;
    if (sizeStr.toUpperCase().includes('M')) return cleanNum * 1000000;
    return cleanNum;
  };

  if (!activeApplications || activeApplications.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh] animate-in fade-in">
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center max-w-lg shadow-2xl backdrop-blur-xl">
          <div className="text-5xl mb-4 animate-bounce">📊</div>
          <h3 className="text-xl font-black text-white mb-2 tracking-tight">Analytics Engine Offline</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Go to your Profile and save matching firms to your console. Our engine will auto-generate your strategic portfolio alignment and runway impact metrics instantly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 h-full flex flex-col pt-4">
      <header>
        <h2 className="text-3xl font-black text-white tracking-tight mb-1">Ecosystem Intelligence Console 🧠</h2>
        <p className="text-sm text-slate-500 font-medium">Strategic portfolio synergy tracking coupled with deterministic capital allocation modeling.</p>
      </header>

      {/* GLOBAL STARTUP FINANCIAL BASELINE FOOTPRINT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-900/20 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Current Cash Position</span>
          <span className="text-xl font-black text-white">RM {(currentCash).toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Monthly Operational Burn</span>
          <span className="text-xl font-black text-red-400">RM {(baseBurnRate).toLocaleString()} / mo</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Baseline Capital Runway</span>
          <span className="text-xl font-black text-amber-500">{Math.round(currentCash / baseBurnRate)} Months</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Assessed Post-Money Valuation</span>
          <span className="text-xl font-black text-emerald-400">RM 1,500,000</span>
        </div>
      </div>

      {/* CORE DUAL-LENS EVALUATION GRID PER SAVED INVESTOR */}
      <div className="space-y-8">
        {activeApplications.map((app) => {
          const injection = parseTicketSize(app.amount);
          const currentRunway = Math.round(currentCash / baseBurnRate);
          const postMoneyRunway = Math.round((currentCash + injection) / baseBurnRate);
          
          // Determine realistic equity dilution and structural attributes based on funder archetype
          const isGrant = app.type.includes('Grant');
          const estimatedDilution = isGrant ? 0 : Math.round((injection / 1500000) * 100);
          
          // Simulated Portfolio Density parameters (Idea 3)
          const densityScore = isGrant ? 85 : app.type.includes('VC') ? 65 : 75;
          const gapVerdict = isGrant 
            ? "High Alignment: Fits early developmental milestone parameters."
            : "Strategic Fit: Your tech stack plugs an ongoing sector deficit in their portfolio.";

          return (
            <div key={app.id} className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 shadow-xl space-y-8 relative overflow-hidden group hover:border-white/10 transition-all">
              
              {/* Card Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider mb-1.5 inline-block">{app.type}</span>
                  <h3 className="text-2xl font-black text-white tracking-tight">{app.name}</h3>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Target Capital Injection</span>
                  <span className="text-2xl font-black text-emerald-400">{app.amount}</span>
                </div>
              </div>

              {/* TWO LENS ANALYTICS LAYOUT MATRIX */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LENS A: STRATEGIC PORTFOLIO GAP DENSITY (IDEA 3) */}
                <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-8">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider text-slate-300">Lens 1: Portfolio Synergy Matrix</h4>
                    <p className="text-[11px] text-slate-500">Structural matching mapping against active institutional check sizes and sector allocation logs.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400">Sector Investment Density</span>
                        <span className="text-amber-500">{densityScore}% Match</span>
                      </div>
                      <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${densityScore}%` }} />
                      </div>
                    </div>

                    <div className="bg-slate-950/50 border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Ecosystem Gap Diagnosis</span>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{gapVerdict}</p>
                    </div>
                  </div>
                </div>

                {/* LENS B: FINANCIAL RUNWAY & DILUTION CALCULATOR (IDEA 1) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider text-slate-300">Lens 2: Capital Runway & Dilution Model</h4>
                    <p className="text-[11px] text-slate-500">Deterministic cash flow impact projection assessing operational extension limits.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Visual Bar Graph Comparison */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Lifespan Extension</span>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-500">Current Runway</span>
                          <span className="text-slate-400">{currentRunway} Months</span>
                        </div>
                        <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-slate-600 rounded-full" style={{ width: `${Math.min((currentRunway / postMoneyRunway) * 100, 100)}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-emerald-400">Post-Funding Runway</span>
                          <span className="text-emerald-400 font-black">{postMoneyRunway} Months</span>
                        </div>
                        <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-pulse" style={{ width: '100%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Dilution Impact Readout */}
                    <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-center text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Estimated Equity Dilution</span>
                      <div className={`text-3xl font-black tracking-tight ${isGrant ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isGrant ? '0.00% (Non-Dilutive)' : `${estimatedDilution}.00%`}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 px-2">
                        {isGrant 
                          ? "Government grants secure capital without sacrificing founder board seats." 
                          : "Calculated dilution metrics mapping standard VC priced equity targets."}
                      </p>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
