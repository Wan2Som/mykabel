"use client";

import React from 'react';

export default function LaunchStatus() {
  // Mock data representing live application pipelines
  const columns = [
    { id: 'prep', title: 'Preparing Docs', border: 'border-slate-500' },
    { id: 'submitted', title: 'Under Review', border: 'border-blue-500' },
    { id: 'interview', title: 'Interview / Due Diligence', border: 'border-amber-500' },
    { id: 'approved', title: 'Funds Secured', border: 'border-emerald-500' }
  ];

  const applications = [
    { id: 1, name: 'Cradle CIP Spark', type: 'Government Grant', status: 'prep', amount: 'RM 150K' },
    { id: 2, name: 'NEXEA Accelerator', type: 'Venture Capital', status: 'submitted', amount: 'RM 50K' },
    { id: 3, name: 'pitchIN ECF', type: 'Equity Crowdfunding', status: 'interview', amount: 'RM 500K' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-black text-white tracking-tight mb-1">Launch Status Board 🎯</h2>
        <p className="text-sm text-slate-500 font-medium">Track your active venture and grant applications in real-time.</p>
      </header>

      {/* Kanban Grid */}
      <div className="flex-1 overflow-x-auto custom-scrollbar pb-6">
        <div className="flex gap-6 h-full min-w-[800px]">
          {columns.map(col => (
            <div key={col.id} className="flex-1 bg-slate-900/20 border border-white/5 rounded-2xl p-4 flex flex-col">
              <div className={`border-t-2 ${col.border} pt-3 pb-4 mb-2`}>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">{col.title}</h3>
              </div>
              
              <div className="space-y-4 flex-1">
                {applications.filter(app => app.status === col.id).map(app => (
                  <div key={app.id} className="bg-slate-900/60 border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-colors shadow-lg cursor-grab">
                    <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                      {app.type}
                    </span>
                    <h4 className="font-bold text-white text-sm mb-1">{app.name}</h4>
                    <p className="text-xs font-semibold text-emerald-400 mt-2">Target: {app.amount}</p>
                  </div>
                ))}
                
                {applications.filter(app => app.status === col.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center">
                    <span className="text-xs text-slate-600 font-medium">Empty Phase</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
