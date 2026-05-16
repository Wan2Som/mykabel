"use client";

import React, { useState } from 'react';

export default function StartupIntakeForm({ onSubmitSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // --- FORM STATES ---
  const [formData, setFormData] = useState({
    startupName: '',
    founderName: '',
    email: '',
    sector: 'FinTech',
    stage: 'Idea Stage',
    teamSize: '',
    fundingNeededMin: '',
    fundingNeededMax: '',
    lookingFor: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLookingFor = (item) => {
    setFormData(prev => {
      const current = prev.lookingFor;
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, lookingFor: updated };
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFinalSubmit = () => {
    // Pass form data back up to the main dashboard container to trigger matchmaking!
    if (onSubmitSuccess) {
      onSubmitSuccess(formData);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      
      {/* STEPPERS TAB INDICATOR */}
      <div className="flex items-center justify-center gap-4 mb-10 border-b border-slate-800 pb-6">
        {[
          { step: 1, label: 'Basic Info' },
          { step: 2, label: 'Startup Info' },
          { step: 3, label: 'Review & Match' }
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
              currentStep === item.step 
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 ring-4 ring-amber-500/10'
                : currentStep > item.step ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              {currentStep > item.step ? '✓' : item.step}
            </div>
            <span className={`text-xs font-bold tracking-wide uppercase ${
              currentStep === item.step ? 'text-amber-500' : 'text-slate-500'
            }`}>
              {item.label}
            </span>
            {item.step < 3 && <div className="w-8 h-[2px] bg-slate-800 mx-1" />}
          </div>
        ))}
      </div>

      {/* --- STEP 1: BASIC INFO --- */}
      {currentStep === 1 && (
        <form onSubmit={handleNext} className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-2">Basic Info</h3>
            <p className="text-sm text-slate-400">Introduce your startup profile identifier variables.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Startup Name</label>
              <input type="text" value={formData.startupName} onChange={(e) => handleInputChange('startupName', e.target.value)} required
                className="block w-full bg-[#0F172A]/80 px-4 py-3.5 border border-slate-700 rounded-xl text-white sm:text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-600"
                placeholder="e.g., Ahmad Frozen Foods" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Founder Name</label>
              <input type="text" value={formData.founderName} onChange={(e) => handleInputChange('founderName', e.target.value)} required
                className="block w-full bg-[#0F172A]/80 px-4 py-3.5 border border-slate-700 rounded-xl text-white sm:text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-600"
                placeholder="e.g., Ahmad Bin Ibrahim" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Company Email</label>
              <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required
                className="block w-full bg-[#0F172A]/80 px-4 py-3.5 border border-slate-700 rounded-xl text-white sm:text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-600"
                placeholder="founder@startup.com.my" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95">
              Next Step →
            </button>
          </div>
        </form>
      )}

      {/* --- STEP 2: STARTUP INFORMATION --- */}
      {currentStep === 2 && (
        <form onSubmit={handleNext} className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-2">Startup Information</h3>
            <p className="text-sm text-slate-400">Provide quantitative details about your business operation limits.</p>
          </div>

          <div className="space-y-5">
            {/* Sector Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Sector</label>
              <div className="flex flex-wrap gap-2">
                {['FinTech', 'AgriTech', 'EdTech', 'E-Commerce', 'SaaS'].map((sec) => (
                  <button type="button" key={sec} onClick={() => handleInputChange('sector', sec)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.sector === sec 
                        ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                    }`}>
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Startup Stage</label>
              <div className="flex flex-wrap gap-2">
                {['Idea Stage', 'MVP', 'Early Revenue', 'Scaling'].map((stg) => (
                  <button type="button" key={stg} onClick={() => handleInputChange('stage', stg)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.stage === stg 
                        ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                    }`}>
                    {stg}
                  </button>
                ))}
              </div>
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Team Size</label>
              <input type="number" value={formData.teamSize} onChange={(e) => handleInputChange('teamSize', e.target.value)} required
                className="block w-full bg-[#0F172A]/80 px-4 py-3.5 border border-slate-700 rounded-xl text-white sm:text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-600"
                placeholder="e.g., 5" />
            </div>

            {/* Funding Windows */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Funding Needed (RM)</label>
              <div className="flex items-center gap-3">
                <input type="number" value={formData.fundingNeededMin} onChange={(e) => handleInputChange('fundingNeededMin', e.target.value)} required
                  className="block w-full bg-[#0F172A]/80 px-4 py-3.5 border border-slate-700 rounded-xl text-white sm:text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-600"
                  placeholder="Min K (e.g., 10)" />
                <span className="text-slate-500 text-sm font-bold">to</span>
                <input type="number" value={formData.fundingNeededMax} onChange={(e) => handleInputChange('fundingNeededMax', e.target.value)} required
                  className="block w-full bg-[#0F172A]/80 px-4 py-3.5 border border-slate-700 rounded-xl text-white sm:text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-600"
                  placeholder="Max K (e.g., 50)" />
              </div>
            </div>

            {/* Looking For */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Looking For</label>
              <div className="grid grid-cols-2 gap-2">
                {['Investor', 'Mentor', 'Government Grants', 'Strategic Partnerships'].map((target) => {
                  const isChecked = formData.lookingFor.includes(target);
                  return (
                    <button type="button" key={target} onClick={() => toggleLookingFor(target)}
                      className={`px-4 py-3 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition-all ${
                        isChecked 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                          : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}>
                      <span>{target}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isChecked ? 'border-amber-400 bg-amber-500 text-slate-950' : 'border-slate-600'
                      }`}>
                        {isChecked && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800/60">
            <button type="button" onClick={handleBack} className="border border-slate-700 hover:border-slate-500 hover:text-white font-bold py-3.5 px-6 rounded-xl transition-all">
              ← Back
            </button>
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95">
              Next Step →
            </button>
          </div>
        </form>
      )}

      {/* --- STEP 3: REVIEW YOUR INFORMATION --- */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-2">Review Your Information</h3>
            <p className="text-sm text-slate-400">Verify structured telemetry before linking down into the AI matchmaking grid arrays.</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-4 text-sm text-slate-300 shadow-inner">
            <div className="grid grid-cols-2 gap-4 border-b border-slate-900 pb-3">
              <div><span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-0.5">Startup Identity</span> <strong className="text-white text-base">{formData.startupName || 'Not Specifed'}</strong></div>
              <div><span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-0.5">Operational Founder</span> <span className="text-slate-200 font-medium">{formData.founderName}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-slate-900 pb-3">
              <div><span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-0.5">Contact Node Email</span> <span className="text-slate-300 font-mono">{formData.email}</span></div>
              <div><span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-0.5">Sector Matrix</span> <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded">{formData.sector}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-slate-900 pb-3">
              <div><span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-0.5">Current Phase</span> <span className="text-slate-200 font-medium">{formData.stage}</span></div>
              <div><span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-0.5">Personnel Capacity</span> <span className="text-slate-200 font-medium">{formData.teamSize} active members</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-slate-900 pb-3">
              <div><span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-0.5">Target Ticket Size</span> <span className="text-emerald-400 font-bold">RM {formData.fundingNeededMin}K – RM {formData.fundingNeededMax}K</span></div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Target Pathways</span> 
                <div className="flex flex-wrap gap-1">
                  {formData.lookingFor.length > 0 ? formData.lookingFor.map(item => (
                    <span key={item} className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{item}</span>
                  )) : <span className="text-xs text-slate-600 italic">No ecosystem targets designated</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800/60">
            <button type="button" onClick={handleBack} className="border border-slate-700 hover:border-slate-500 hover:text-white font-bold py-3.5 px-6 rounded-xl transition-all">
              ← Back
            </button>
            <button type="button" onClick={handleFinalSubmit} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3.5 px-10 rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95">
              Link Ecosystem →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
