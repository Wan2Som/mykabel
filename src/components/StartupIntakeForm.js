import React, { useState } from 'react';

export default function StartupIntakeForm() {
  // State to track which chips are clicked
  const [selectedStage, setSelectedStage] = useState('Idea Stage');
  const [selectedSector, setSelectedSector] = useState('FinTech');

  const stages = ['Idea Stage', 'MVP', 'Early Revenue', 'Scaling'];
  const steps = ['Basic Info', 'Startup Information', 'Funding Needed', 'Business Goals'];

  return (
    <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.05)] p-10 flex gap-12">
      
      {/* Left Column: The Form Content */}
      <div className="flex-1">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-8">Startup Information</h2>
        
        {/* Sector Selection */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-3">Primary Sector</label>
          <div className="flex flex-wrap gap-3">
            {['FinTech', 'AgriTech', 'EdTech', 'E-Commerce'].map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                  selectedSector === sector
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        {/* Stage Selection */}
        <div className="mb-10">
          <label className="block text-sm font-bold text-slate-700 mb-3">Current Startup Stage</label>
          <div className="flex flex-wrap gap-3">
            {stages.map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                  selectedStage === stage
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-black py-3 px-10 rounded-xl transition-colors shadow-lg shadow-amber-500/30">
            Next Step →
          </button>
        </div>
      </div>

      {/* Right Column: The Stepper Tracker */}
      <div className="w-64 border-l-2 border-slate-100 pl-8 py-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Setup Progress</h4>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4 group cursor-pointer">
              {/* Step Circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                index === 1 // Hardcoded to step 2 ("Startup Information") for the demo
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/40 ring-4 ring-amber-50'
                  : index < 1 
                    ? 'bg-emerald-500 text-white' // Completed steps
                    : 'bg-slate-100 text-slate-400' // Future steps
              }`}>
                {index < 1 ? '✓' : index + 1}
              </div>
              {/* Step Text */}
              <span className={`font-bold text-sm ${
                index === 1 ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
