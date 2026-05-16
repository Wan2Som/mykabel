"use client";

import React, { useState, useEffect } from 'react';

export default function OpportunitiesView() {
  // Load tasks from local state, allowing founders to dynamically check them off
  const [tasks, setTasks] = useState([
    { id: 'ssm', title: 'Register Company Name & Entity with SSM', desc: 'Secure an Enterprise or Sdn Bhd registration identity via MyCoID.', category: 'Incorporation', done: true },
    { id: 'bank', title: 'Open SME Corporate Banking Account', desc: 'Initialize digital corporate cash flow capabilities with local business banking desks.', category: 'Finance', done: false },
    { id: 'lhdn', title: 'Register Income Tax File with LHDN', desc: 'Activate corporate tax residency telemetry with HASiL.', category: 'Finance', done: false },
    { id: 'kwsp', title: 'Setup KWSP i-Akaun Majikan Payroll', desc: 'Configure employer statutory contribution accounts for talent retention.', category: 'Compliance', done: false },
    { id: 'perkeso', title: 'Register ASSIST Portal with PERKESO', desc: 'Establish statutory social security safety nets for operational personnel.', category: 'Compliance', done: false },
    { id: 'grant', title: 'Submit AI Matched Grant Draft Application', desc: 'Compile proposal pipelines for matched MDEC/Cradle frameworks.', category: 'Ecosystem Funding', done: false }
  ]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-1">Ecosystem Launch Checklist</h2>
          <p className="text-sm text-slate-500 font-medium">Track your administrative execution pathway from registration to active market scaling.</p>
        </div>

        {/* Circular Progress Indicator HUD */}
        <div className="flex items-center gap-4 bg-slate-950/40 border border-white/5 px-5 py-3 rounded-xl">
          <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-800" strokeWidth="3px" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-amber-500 transition-all duration-500" strokeDasharray={`${progressPercent}, 100`} strokeWidth="3px" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-xs font-black text-zinc-100">{progressPercent}%</span>
          </div>
          <div>
            <div className="text-sm font-bold text-white">Operational Readiness</div>
            <div className="text-xs text-slate-400 font-medium">{completedCount} of {tasks.length} compliances clear</div>
          </div>
        </div>
      </header>

      {/* Task Queue Group Rows */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            onClick={() => toggleTask(task.id)}
            className={`w-full text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 select-none ${
              task.done 
                ? 'bg-emerald-950/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.02)]' 
                : 'bg-slate-900/20 border-white/5 hover:border-slate-700 hover:bg-slate-900/40'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox Trigger Toggle Button HUD */}
              <div className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-all flex-shrink-0 ${
                task.done ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-black text-xs' : 'border-slate-700 bg-slate-950'
              }`}>
                {task.done && '✓'}
              </div>
              <div>
                <h4 className={`text-sm font-bold tracking-tight transition-all ${task.done ? 'text-slate-400 line-through' : 'text-white'}`}>
                  {task.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">{task.desc}</p>
              </div>
            </div>

            {/* Regulatory Category Badge Metadata */}
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border hidden sm:inline-block ${
              task.done 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' 
                : 'bg-slate-950/60 text-slate-400 border-white/5'
            }`}>
              {task.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
