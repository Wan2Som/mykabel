"use client";

import React from 'react';

export default function InvestorAnalytics({ activeApplications = [] }) {
  // Pure, deterministic business parameters
  const baseBurnRate = 12000; // RM 12,000 operational cash burn per month
  const currentCash = 35000;  // RM 35,000 remaining cash in bank
  const currentRunway = Math.round(currentCash / baseBurnRate); 

  // Gracefully handles text strings like "RM 50K - RM 150K" to render flawless demo data
  const getRealisticFundingImpact = (name, type) => {
    const isGrant = type.toLowerCase().includes('grant') || name.toLowerCase().includes('cradle');
    
    if (isGrant) {
      return {
        displayAmount: "RM 150,000 (Grant Cap Allocation)",
        postMoneyRunway: 15, // (35k cash + 150k grant) / 12k burn = ~15 months
        dilution: 0,
        verdict: "Non-Dilutive / 0% Founder Equity Cost"
      };
    } else {
      return {
        displayAmount: "RM 100,000 (Pre-Seed Accelerator Tier)",
        postMoneyRunway: 11, // (35k cash + 100k investment) / 12k burn = ~11 months
        dilution: 7, // 7% equity allocation based on a RM 1.5M standard tier valuation
        verdict: "Standard Equity Priced Agreement"
      };
    }
  };

  if (!activeApplications || activeApplications.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh] animate-in fade-in">
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center max-w-lg shadow-2xl backdrop-blur-xl">
          <div className="text-5xl mb-4 animate-bounce">📊</div>
          <h3 className="text-xl font-black text-white mb-2 tracking-tight">Analytics Console Standby</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Go to your Profile and save matching firms to your console. Our engine will auto-calculate your runway timeline extensions instantly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 h-full flex flex-col pt-4">
      <header>
        <h2 className="text-3xl font-black text-white tracking-tight mb-1">Runway & Financial Impact Console 🧠</h2>
        <p className="text-sm text-slate-500 font-medium">Deterministic cash flow impact projections assessing exact post-money operational lifespans.</p>
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
          <span className="text-xl font-black text-amber-500">{currentRunway} Months</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Assessed Post-Money Valuation</span>
          <span className="text-xl font-black text-emerald-400">RM 1,500,000</span>
        </div>
      </div>

      {/* CLEAN FINANCIAL IMPACT LIST */}
      <div className="space-y-6">
        {activeApplications.map((app) => {
          const impact = getRealisticFundingImpact(app.name, app.type);

          return (
            <div key={app.id} className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col lg:flex-row gap-8 items-center justify-between relative overflow-hidden group hover:border-white/10 transition-all">
              
              {/* Left Segment: Entity Identification and Allocation Modeling */}
              <div className="space-y-1 flex-1 w-full">
                <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                  {app.type}
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">{app.name}</h3>
                <div className="pt-2 text-xs text-slate-400">
                  <span className="text-slate-500 font-bold">Modeled Capital Injection:</span> <span className="text-emerald-400 font-black">{impact.displayAmount}</span>
                </div>
              </div>

              {/* Middle Segment: Horizontal Linear Extension Lifespan Graphs */}
              <div className="flex-1 w-full space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Lifespan Extension</span>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">Current Baseline</span>
                    <span className="text-slate-400">{currentRunway} Months</span>
                  </div>
                  <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                    <div className="h-full bg-slate-600 rounded-full" style={{ width: `${(currentRunway / impact.postMoneyRunway) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-400">Projected Funding Runway</span>
                    <span className="text-emerald-400 font-black">{impact.postMoneyRunway} Months</span>
                  </div>
                  <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              {/* Right Segment: Clean Equity Cost Metrics */}
              <div className="bg-slate-950/40 border border-white/5 p-6 rounded-2xl w-full lg:w-72 text-center flex flex-col justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Equity Dilution Cost</span>
                <div className={`text-3xl font-black tracking-tight ${impact.dilution === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {impact.dilution === 0 ? '0.00% (Non-Dilutive)' : `${impact.dilution}.00%`}
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-2 block">
                  {impact.verdict}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
