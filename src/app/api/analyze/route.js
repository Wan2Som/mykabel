import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Trying the most likely 2026 standard model string
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview', 
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemInstruction = `
      You are the core intelligence of DesaLink AI, a routing platform for the Malaysian SME ecosystem. 
      Analyze the user's input describing a rural SME. 
      
      You MUST return your response as a valid JSON object with the exact following structure:
      {
        "maturity": "Short phrase describing digital maturity (e.g., 'Low Digital Maturity')",
        "potential": "Short phrase describing growth/export potential",
        "summary": "A 2-sentence summary of what this SME needs based on the query.",
        "recommendations": [
          {
            "type": "Choose one: Programme, Grant, Mentor, or Agency",
            "name": "Name of the specific Malaysian initiative or persona",
            "explanation": "A 1-sentence reasoning of WHY this fits based on historical context.",
            "matchScore": "A percentage like '95%'",
            "image": "Return this exact string: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400'"
          }
        ]
      }
      Provide exactly 6 recommendations in the array. Ensure a mix of Grants, Mentors, and Programmes.
    `;

    const fullPrompt = `${systemInstruction}\n\nUser Query: ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();
    
    const parsedData = JSON.parse(responseText);

    return NextResponse.json(parsedData, { status: 200 });

  } catch (error) {
    console.error("🔥 Detailed Gemini API Error:", error.message || error);
    
    // --- THE MAGIC DEBUGGER ---
    // If it fails, this will ask Google's servers for your EXACT allowed models
    try {
      console.log("\n⏳ Fetching the list of models your API key has access to...");
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
      const data = await res.json();
      
      console.log("\n✅ AVAILABLE MODELS FOR YOUR KEY:");
      const generateContentModels = data.models
        .filter(m => m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name);
      
      console.log(generateContentModels);
      console.log("\n👉 Fix: Copy one of the names above (like 'models/gemini-pro') and paste it into the 'model:' field in your code!\n");
    } catch (fetchError) {
      console.error("Could not fetch model list.", fetchError);
    }

    return NextResponse.json({ error: "Failed to analyze SME profile. Check VS Code Terminal." }, { status: 500 });
  }
}