"use client";

import React, { useState, useRef, useEffect } from 'react';

export default function ChatbotView({ smeProfile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Initialize personalized welcome messages based on input variables
  useEffect(() => {
    const bizName = smeProfile?.startupName ? `for ${smeProfile.startupName}` : '';
    setMessages([
      { role: 'model', text: `Selamat sejahtera! I am your MyKabel Advisor. I have synchronized with your profile details ${bizName}. Ask me anything about navigating your next steps!` }
    ]);
  }, [smeProfile]);

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

    // Append an empty block placeholder where streaming text chunks roll in
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          smeProfile: smeProfile // Pass profile metadata down into generation pipelines
        }),
      });

      if (!response.ok) throw new Error('Stream request initialization error.');

      // 👇 STREAM READER READING LOOP PROCESSOR 👇
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value);
        
        // Append text text chunk-by-chunk right into the active conversation array item
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex].text += textChunk;
          return updated;
        });
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = 'Connection lost during data stream generation sync phase.';
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[78vh] bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-300">
      <div className="bg-slate-900/60 px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="font-black text-white tracking-tight">AI Advisory Lounge</h3>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            {smeProfile?.startupName ? `Context Locked: ${smeProfile.startupName}` : 'Standard System Context Online'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-md leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none' 
                : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
            }`}>
              {msg.text || (loading && i === messages.length - 1 ? 'Typing...' : '')}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-slate-900/60 border-t border-white/5 flex gap-3">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={smeProfile?.sector ? `Ask specific strategic questions about expanding your ${smeProfile.sector} business...` : "Ask a question..."}
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
