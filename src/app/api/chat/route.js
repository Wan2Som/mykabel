import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing backend Gemini key." }, { status: 500 });
    }

    // Convert the conversation history into format expected by Gemini
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Inject a persistent structural context layer right at the beginning
    contents.unshift({
      role: 'user',
      parts: [{ 
        text: "System Prompt: You are 'MyKabel Advisor', a premium AI business consultant helping small-and-medium enterprises (SMEs) in Malaysia navigate funding, grants (MDEC, Cradle), pitching strategies, and strategic partnerships. Keep your responses highly practical, encouraging, and tailored to the Malaysian business landscape." 
      }]
    });
    contents.push({
      role: 'model',
      parts: [{ text: "Understood. I am online as MyKabel Advisor. Let's optimize this enterprise runtime setup." }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: "Gateway rejection.", details: errText }, { status: response.status });
    }

    const resData = await response.json();
    const aiResponseText = resData.candidates[0].content.parts[0].text;

    return NextResponse.json({ text: aiResponseText });

  } catch (error) {
    console.error("Chat routing failure:", error);
    return NextResponse.json({ error: "Internal chat engine error." }, { status: 500 });
  }
}
