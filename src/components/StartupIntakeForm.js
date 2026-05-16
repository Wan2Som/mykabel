"use client";

import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../app/lib/firebaseConfig'; // Adjust import path to match your project structure

export default function StartupIntakeForm({ onSubmitSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State Variables
  const [formData, setFormData] = useState({
    startupName: '',
    founderName: '',
    companyEmail: '',
    companyDescription: '', // 👈 NEW VALUE FOR SCREENSHOT 2
    industry: 'FinTech',
    stage: 'Ideation',
    monthlyBurn: '12000',
    currentCash: '35000'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      
      // Save data securely to Firestore under the authenticated user's profile
      await setDoc(doc(db, "smes", auth.currentUser.uid), {
        ...formData,
        isRegistered: false, // Baseline parameter
        metrics: { matches: 7, opportunities: 32, connections: 3 },
        // Pre-populating matches for the demo flow loop
        recommendations: [
          { name: "Cradle Fund", type: "Grant Provider", matchScore: "98%", focus: formData.industry, stage: formData.stage, ticketSize: "RM 50K - RM 500K (via programs)", explanation: `Perfect structural alignment with your profile details focusing on early developmental milestone parameters.`, faqUrl: "https://www.cradle.com.my/" },
          { name: "1337 Ventures", type: "Accelerator / Pre-Seed Investor", matchScore: "95%", focus: formData.industry, stage: formData.stage, ticketSize: "RM 50K - RM 150K (as part of accelerator)", explanation: `Strategic fit: Your targeted product profile plugs an active structural sector deficit in their existing fund portfolio track.`, faqUrl: "https://1337.ventures/" },
          { name: "MDEC", type: "Government Grants / Agency", matchScore: "90%", focus: formData.industry, stage: formData.stage, ticketSize: "Varies, typically RM 50K-RM 500K for relevant grants", explanation: `Strong candidate matching national digitalization framework deployment tracks for emerging business architectures.`, faqUrl: "https://mdec.my/" }
        ]
      }, { merge: true });

      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error("Error saving onboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-900/20 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl animate-in fade-in duration-500">
      
      {/* Wizard Progress Steps Bar Header */}
      <div className="flex items-center justify-center gap-8 mb-10 border-b border-white/5 pb-6 text-xs font-bold uppercase tracking-wider">
        <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-amber-500' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>1</span>
          <span>Basic Info</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-800" />
        <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-amber-500' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>2</span>
          <span>Startup Info</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-800" />
        <div className={`flex items-center gap-2 ${currentStep === 3 ? 'text-amber-500' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 3 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>3</span>
          <span>Review & Match</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STEP 1: BASIC INFO BLOCK */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight mb-1">Basic Info</h3>
              <p className="text-xs text-slate-500">Introduce your startup profile identifier variables.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Startup Name</label>
                <input type="text" name="startupName" value={formData.startupName} onChange={handleChange} required placeholder="e.g., Ahmad Frozen Foods"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 focus:border-amber-500 focus:outline-none placeholder-slate-700 text-sm transition-colors" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Founder Name</label>
                <input type="text" name="founderName" value={formData.founderName} onChange={handleChange} required placeholder="e.g., Ahmad Bin Ibrahim"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 focus:border-amber-500 focus:outline-none placeholder-slate-700 text-sm transition-colors" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Company Email</label>
                <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} required placeholder="founder@startup.com.my"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 focus:border-amber-500 focus:outline-none placeholder-slate-700 text-sm transition-colors" />
              </div>

              {/* 👇 NEW DETAILED DESCRIPTION TEXTAREA LAYER 👇 */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Company Description</label>
                <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} required rows={4} 
                  placeholder="e.g., A peer-to-peer micro-lending platform tailored for rural micro-entrepreneurs in Northern Malaysia, utilizing alternative credit scoring structures..."
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 focus:border-amber-500 focus:outline-none placeholder-slate-700 text-sm transition-colors custom-scrollbar resize-none leading-relaxed" />
                <span className="text-[10px] text-slate-500 mt-1.5 block leading-normal">
                  Provide detailed operational parameters. This input is directly parsed by the AI processing loop to pinpoint highly specified, niche ecosystem investors and customize your live market news stream.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: STARTUP PARAMETERS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight mb-1">Financial & Vertical Footprint</h3>
              <p className="text-xs text-slate-500">Configure operational thresholds for your matrix calculation pipelines.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Industry Vertical</label>
                <select name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 focus:border-amber-500 focus:outline-none text-sm cursor-pointer">
                  <option value="FinTech">FinTech</option>
                  <option value="AgriTech">AgriTech</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="B2B Enterprise SaaS">B2B Enterprise SaaS</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Current Growth Stage</label>
                <select name="stage" value={formData.stage} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 focus:border-amber-500 focus:outline-none text-sm cursor-pointer">
                  <option value="Ideation">Ideation / MVP Concept</option>
                  <option value="Pre-Seed">Pre-Seed / Prototype Ready</option>
                  <option value="Seed">Seed Stage / Scaling Revenue</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Current Cash Reserves (RM)</label>
                <input type="number" name="currentCash" value={formData.currentCash} onChange={handleChange} required
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 focus:border-amber-500 focus:outline-none text-sm" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Monthly Operational Burn (RM)</label>
                <input type="number" name="monthlyBurn" value={formData.monthlyBurn} onChange={handleChange} required
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 focus:border-amber-500 focus:outline-none text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DATA VERIFICATION REVIEW */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight mb-1">Confirm System Onboarding</h3>
              <p className="text-xs text-slate-500">Verify your telemetry configuration metrics before launching the neural match vectors.</p>
            </div>

            <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-6 text-xs space-y-3 font-medium text-slate-400">
              <div><span className="text-slate-500 font-bold uppercase tracking-wider inline-block w-36">Venture:</span> <span className="text-white">{formData.startupName}</span></div>
              <div><span className="text-slate-500 font-bold uppercase tracking-wider inline-block w-36">Vertical Core:</span> <span className="text-white">{formData.industry}</span></div>
              <div><span className="text-slate-500 font-bold uppercase tracking-wider inline-block w-36">Current Growth:</span> <span className="text-white">{formData.stage}</span></div>
              <div><span className="text-slate-500 font-bold uppercase tracking-wider inline-block w-36">Cash Baseline:</span> <span className="text-emerald-400">RM {Number(formData.currentCash).toLocaleString()}</span></div>
              <div><span className="text-slate-500 font-bold uppercase tracking-wider inline-block w-36">Burn Rate Focus:</span> <span className="text-red-400">RM {Number(formData.monthlyBurn).toLocaleString()} / month</span></div>
              <div className="pt-2 border-t border-slate-800/80 leading-relaxed">
                <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Description Sync:</span>
                <p className="text-slate-300 italic">"{formData.companyDescription}"</p>
              </div>
            </div>
          </div>
        )}

        {/* CONTROLS FOOTER BLOCK */}
        <div className="flex justify-between items-center pt-6 border-t border-white/5">
          {currentStep > 1 ? (
            <button type="button" onClick={handlePrev} className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors px-4 py-2">
              ← Back
            </button>
          ) : <div />}

          {currentStep < 3 ? (
            <button type="button" onClick={handleNext} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-3 rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-amber-500/10 transition-all">
              Next Step →
            </button>
          ) : (
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-10 py-3.5 rounded-xl text-xs tracking-widest uppercase shadow-xl transition-all disabled:opacity-50">
              {loading ? 'Initializing Channels...' : 'Execute AI Matching 🚀'}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
