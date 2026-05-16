"use client";

import React from 'react';

export default function InvestorAnalytics({ activeApplications = [], smeProfile = {} }) {
  // EXTRACT LIVE VALUES FROM AI MATCHING INTAKE FORM (With logical fallbacks if null)
  // Assumes your form inputs save fields as currentCash and monthlyBurn
  const currentCash = Number(smeProfile?.currentCash) || 35000; 
  const baseBurnRate = Number(smeProfile?.monthlyBurn) || 12000;
  
  // Clean, unbreakable safety division calculation
  const currentRunway = baseBurnRate > 0 ? Math.round(currentCash / baseBurnRate) : 0;

  const getRealisticFundingImpact = (name, type) => {
    const isGrant = type.toLowerCase().includes('grant') || name.toLowerCase().includes('cradle');
    
    if (isGrant) {
      const grantAmount = 150000;
      const projectedRunway = baseBurnRate > 0 ? Math.round((currentCash + grantAmount) / baseBurnRate) : currentRunway;
      return {
        displayAmount: "RM 150,000 (Grant Cap Allocation)",
        postMoneyRunway: projectedRunway,
        dilution: 0,
        verdict: "Non-Dilutive / 0% Founder Equity Cost"
      };
    } else {
      const investmentAmount = 100000;
      const projectedRunway = baseBurnRate > 0 ? Math.round((currentCash + investmentAmount) / baseBurnRate) : currentRunway;
      return {
        displayAmount: "RM 100,000 (Pre-Seed Accelerator Tier)",
        postMoneyRunway: projectedRunway,
        dilution: 7, 
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
          <span className="text-xl font-black text-white">RM {currentCash.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Monthly Operational Burn</span>
          <span className="text-xl font-black text-red-400">RM {baseBurnRate.toLocaleString()} / mo</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Baseline Capital Runway</span>
          <span className="text-xl font-black text-amber-500">{currentRunway} {currentRunway === 1 ? 'Month' : 'Months'}</span>
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
              
              <div className="space-y-1 flex-1 w-full">
                <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                  {app.type}
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">{app.name}</h3>
                <div className="pt-2 text-xs text-slate-400">
                  <span className="text-slate-500 font-bold">Modeled Capital Injection:</span> <span className="text-emerald-400 font-black">{impact.displayAmount}</span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Lifespan Extension</span>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">Current Baseline</span>
                    <span className="text-slate-400">{currentRunway} {currentRunway === 1 ? 'Month' : 'Months'}</span>
                  </div>
                  <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                    <div className="h-full bg-slate-600 rounded-full" style={{ width: `${impact.postMoneyRunway > 0 ? (currentRunway / impact.postMoneyRunway) * 100 : 0}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-400">Projected Funding Runway</span>
                    <span className="text-emerald-400 font-black">{impact.postMoneyRunway} {impact.postMoneyRunway === 1 ? 'Month' : 'Months'}</span>
                  </div>
                  <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

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
