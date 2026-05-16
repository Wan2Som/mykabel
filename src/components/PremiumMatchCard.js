import React from 'react';

export default function PremiumMatchCard() {
  const matchPercentage = 94; // You can pass this in as a prop!

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(245,158,11,0.1)] transition-all duration-300 relative overflow-hidden group">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          {/* Dynamic Dummy Logo (Uses first letter of company) */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-inner">
            G
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors">
              GrowthFund Capital
            </h3>
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-md">
              Top Match
            </span>
          </div>
        </div>

        {/* Circular Progress Ring for Match Score */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background Ring */}
            <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            {/* Colored Progress Ring */}
            <path className="text-emerald-500 drop-shadow-md transition-all duration-1000 ease-out" strokeDasharray={`${matchPercentage}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <span className="absolute text-sm font-black text-slate-700">{matchPercentage}%</span>
        </div>
      </div>

      {/* Details List */}
      <div className="space-y-2 mb-6">
        <div className="flex text-sm">
          <span className="font-bold text-slate-600 w-32">Sector Focus:</span>
          <span className="text-slate-500">AI, SaaS, Fintech</span>
        </div>
        <div className="flex text-sm">
          <span className="font-bold text-slate-600 w-32">Stage:</span>
          <span className="text-slate-500">Seed – Series A</span>
        </div>
        <div className="flex text-sm">
          <span className="font-bold text-slate-600 w-32">Ticket Size:</span>
          <span className="text-slate-500 font-medium text-emerald-600">RM 100K – RM 2M</span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Supports scalable Malaysian startups focused on digital transformation and ecosystem innovation.
        </p>
      </div>
    </div>
  );
}
