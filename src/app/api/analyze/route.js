import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { startupName, sector, stage, teamSize, fundingNeededMin, fundingNeededMax, lookingFor } = body;

    const prompt = `
      You are the core intelligence matching routing module for "MyKabel", an enterprise SME matching engine in Malaysia.
      Analyze the following startup profile telemetry:
      - Startup Name: ${startupName}
      - Sector Focus: ${sector}
      - Growth Phase Stage: ${stage}
      - Active Team Size: ${teamSize} members
      - Funding Target Window: RM ${fundingNeededMin}K to RM ${fundingNeededMax}K
      - Seeking Channels: ${lookingFor.join(', ')}

      Based on this data, generate exactly 2 highly relevant, realistic entities in the Malaysian venture/SME ecosystem (choose from well-known Malaysian VCs, angel networks, MDEC/Cradle grants, accelerators, or corporate partners like Gobi Partners, Cradle Fund, Artem Ventures, NEXEA, Sunway iLabs, MTDC, MRANTI, or pitchIN).

      CRITICAL: You must return ONLY a raw, valid JSON object matching the schema below. Do not wrap it in markdown code blocks (like \`\`\`json), do not include any conversational prose.

      Required JSON Response Schema Format:
      {
        "matchesCount": 24,
        "opportunitiesCount": 19,
        "connectionsCount": 4,
        "recommendations": [
          {
            "name": "Name of Entity",
            "type": "Investor",
            "matchScore": "95%",
            "focus": "Keywords of what they focus on",
            "stage": "Stages they support",
            "ticketSize": "Funding ranges or capital metrics they deploy",
            "explanation": "A direct, concise 1-2 sentence explanation detailing why this specific entity matches the user's startup data inputs."
          }
        ]
      }
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing backend system deployment key." }, { status: 500 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: "Gemini API gateway thread reject.", details: errText }, { status: response.status });
    }

    const resData = await response.json();
    const rawAiText = resData.candidates[0].content.parts[0].text;
    
    const structuredOutput = JSON.parse(rawAiText.trim());
    return NextResponse.json(structuredOutput);

  } catch (error) {
    console.error("Analytical pipeline failure:", error);
    return NextResponse.json({ error: "Internal telemetry pipeline generation error." }, { status: 500 });
  }
}
