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

      Based on this data, generate exactly 7 highly relevant, unique, and realistic entities in the Malaysian venture/SME ecosystem. 
      Mix them across appropriate categories based on what the user is looking for. Choose from prominent ecosystem players such as:
      Gobi Partners, Cradle Fund, Artem Ventures, NEXEA, Sunway iLabs, MTDC, MRANTI, pitchIN, 1337 Ventures, ScaleUp Malaysia, MDEC grants, WatchTower and Friends, Alpha Startups, or relevant Malaysian corporate VC arms.

      CRITICAL FOR LATENCY: Keep the "explanation" for each match extremely concise (under 25 words max) so the response generates instantly without timing out the server.

      Return ONLY a raw, valid JSON object matching the schema below. Do not wrap it in markdown code blocks.

      Required JSON Response Schema Format:
      {
        "matchesCount": 24,
        "opportunitiesCount": 19,
        "connectionsCount": 4,
        "recommendations": [
          {
            "name": "Name of Entity",
            "type": "Investor" or "Mentor" or "Government Grants" or "Strategic Partnerships",
            "matchScore": "95%",
            "focus": "Keywords of what they focus on",
            "stage": "Stages they support",
            "ticketSize": "Funding ranges or capital metrics they deploy",
            "explanation": "Snappy 1-sentence explanation matching their specific criteria."
          }
        ]
      }
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing backend system deployment key." }, { status: 500 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
