const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";


const SYSTEM_INSTRUCTION = `You are Falcon AI, an advanced year 2100 AI Mobility Operating System for Sri Lanka (NEXUS 2100).
Your task is to assist commuters in real time across high-speed Maglev trains, AeroLink flying air taxis, autonomous EV shuttles, and smart highways connecting Sri Lankan cities (Colombo Fort, Maradana, Kandy, Galle, Jaffna, Gampaha, Negombo, Nuwara Eliya).
Keep your answers concise, intelligent, futuristic, and helpful (maximum 2 to 3 sentences).
If the user asks to travel somewhere, confirm the destination enthusiasm and note that the 3D map trajectory is generating.`;

/**
 * Sends a real-time user query to Google Gemini API and returns the AI response text.
 */
export async function queryGeminiAI(userPrompt) {
  if (!userPrompt || !userPrompt.trim()) return null;

  const requestPayload = {
    contents: [
      {
        parts: [
          { text: `${SYSTEM_INSTRUCTION}\n\nUser Question: ${userPrompt}` }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 180,
      temperature: 0.7
    }
  };

  // Try endpoints (gemini-1.5-flash, gemini-2.0-flash, gemini-1.5-pro)
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload)
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return text.trim();
        }
      }
    } catch (err) {
      console.warn(`Gemini API error with ${model}:`, err);
    }
  }

  // Smart fallback response if network fails
  const lower = userPrompt.toLowerCase();
  if (lower.includes('kandy')) return "Greeting traveler! Generating your high-speed 312 km/h Maglev route from Colombo Fort to Kandy Central Hub now.";
  if (lower.includes('galle')) return "Welcome aboard! Routing your premium AeroLink flight along the Southern Galle Fort coastline.";
  if (lower.includes('jaffna')) return "Connecting to Northern Express Maglev corridor to Jaffna Central Terminal.";
  
  return `Falcon AI online. Optimizing Sri Lanka smart transit corridor for "${userPrompt}". 3D map trajectory active!`;
}
