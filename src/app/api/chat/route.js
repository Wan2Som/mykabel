import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages, smeProfile } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing backend Gemini key." }, { status: 500 });
    }

    // Map out context anchors if the profile exists
    let contextTelemetry = "The user hasn't provided details yet.";
    if (smeProfile) {
      contextTelemetry = `
        - Startup Identity: ${smeProfile.startupName || 'Unknown'}
        - Sector Niche: ${smeProfile.sector || 'General'}
        - Growth Phase: ${smeProfile.stage || 'Early Stage'}
        - Team Capacity: ${smeProfile.teamSize || '1'} people
        - Funding Target Windows: RM ${smeProfile.fundingNeededMin || '0'}K to RM ${smeProfile.fundingNeededMax || '0'}K
      `;
    }

    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // 👇 THE NEW "FRIENDLY HUMAN" PROMPT OVERRIDE 👇
    contents.unshift({
      role: 'user',
      parts: [{ 
        text: `System Persona: You are 'MyKabel Advisor', a highly friendly, empathetic, and human-like business mentor helping SMEs in Malaysia.
        You are currently chatting with the founder of this business:
        ${contextTelemetry}
        
        CRITICAL INSTRUCTIONS FOR YOUR BEHAVIOR:
        1. Be warm and conversational. Speak like a supportive friend who happens to be an expert in Malaysian startups, grants (Cradle, MDEC), and venture capital.
        2. DO NOT OVERWHELM THE USER. Give short, straightforward, and highly meaningful advice. Maximum 2 or 3 short paragraphs per response.
        3. STRICTLY NO MARKDOWN FORMATTING. Do NOT use asterisks (**), hashtags (###), or weird symbols. 
        4. Use natural paragraph spacing (double line breaks) to make your text easy to read.
        5. If they ask where to start, give them just the very first 1 or 2 actionable steps so they aren't paralyzed by a massive to-do list.` 
      }]
    });
    
    contents.push({
      role: 'model',
      parts: [{ text: "Got it! I will be friendly, concise, human-like, and I will strictly avoid using any Markdown symbols like asterisks. I'm ready to help them out!" }]
    });

    // Generate the Stream
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Stream engine reject thread." }, { status: response.status });
    }

    // Safely pipe the text stream back to the UI in real-time
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.trim().startsWith('"text":')) {
                const match = line.match(/"text":\s*"(.*)"/);
                if (match && match[1]) {
                  // Clean escaped newlines so the UI renders them properly
                  let cleanChunk = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
                  controller.enqueue(encoder.encode(cleanChunk));
                }
              }
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });

  } catch (error) {
    console.error("Chat routing failure:", error);
    return NextResponse.json({ error: "Internal chat engine error." }, { status: 500 });
  }
}
