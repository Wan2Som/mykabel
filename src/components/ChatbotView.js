"use client";

import React, { useState, useRef, useEffect } from 'react';

export default function ChatbotView() {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Selamat sejahtera! I am your MyKabel Advisor. Ask me anything about scaling your startup, maximizing grant compliance, or optimizing investor pitches.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Network chat response was not ok');
      const data = await response.json();

      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error interacting with advisory nodes. Check connectivity settings.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[78vh] bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/60 px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="font-black text-white tracking-tight">AI Advisory Lounge</h3>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Gemini 2.5 Consultative Engine Connected</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}>
            <div className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-md leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none' 
                : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-white/5 text-amber-500/80 text-xs font-bold px-4 py-3 rounded-2xl rounded-tl-none animate-pulse">
              Advisor is analyzing metrics...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-900/60 border-t border-white/5 flex gap-3">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Cradle CIP Spark criteria, pitch structuring..."
          className="flex-1 bg-slate-950 border border-slate-800 text-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all placeholder-slate-600 shadow-inner"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 rounded-xl text-sm tracking-wide shadow-md shadow-amber-500/10 transition-all disabled:opacity-50"
        >
          Consult
        </button>
      </form>
    </div>
  );
}
