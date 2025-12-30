
export async function POST(request) {
  try {
    const { image, description, analysisType, cropType, wasteDescription, quantity, moistureLevel, age } = await request.json();
    // Validate input
    if (!analysisType || (!image && !description)) {
      return Response.json({
        error: 'Either image or description is required',
        required_fields: ['analysisType', 'image|description']
      }, { status: 400 });
    }


    const prompt = `
    You are an expert agricultural waste classification assistant. 
    Analyze the provided waste information and return complete data in the specified JSON format.

    For image analysis, examine the visual characteristics.
    For text analysis, use the provided description.

    Required Output Format:
    {
      "cropType": "string (Rice/Wheat/Sugarcane)",
      "wasteType": "string (stubble/straw/stalk/bagasse/bran)",
      "wasteDescription": "string (detailed description)",
      "quantity": "number",
      "quantityUnit": "string (kg/ton)",
      "moistureLevel": "string (Low/Medium/High)",
      "ageOfWaste": "string (Fresh/1-2 weeks/2-4 weeks/1-2 months/2+ months)",
      "qualityAssessment": {
        "condition": "string",
        "contamination": "string (Present/Not present)"
      },
      "suggestedUses": ["array", "of", "suggestions"],
      "estimatedValue": "number (INR per ton)",
      "confidence": "number (0-1)",
      "notes": "string (additional observations)"
    }

    ${analysisType === 'image' ? 
      'Analyze this agricultural waste image:' : 
      `Analyze this description:\nCrop Type: ${cropType || 'Not specified'}\nWaste Description: ${description}\nQuantity: ${quantity || 'Not specified'}\nMoisture Level: ${moistureLevel || 'Not specified'}\nAge of Waste: ${age || 'Not specified'}`
    }

    Provide complete output in exact specified JSON format.
    `;

    // Prepare headers (include API key only when present)
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.PUTER_API_KEY) headers['X-API-Key'] = process.env.PUTER_API_KEY;

    // Use Puter API for Gemini (messages-style payload). If that fails, retry with simple {prompt} payload.
    let puterRes = await fetch('https://api.puter.com/v2/ai/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gemini-3-pro-preview',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    // If unauthorized or not OK, attempt fallback payload shape
    if (!puterRes.ok) {
      const errText = await puterRes.text().catch(() => '');
      console.warn('Initial Puter call failed:', puterRes.status, errText);
      // Fallback: try { prompt, model }
      puterRes = await fetch('https://api.puter.com/v2/ai/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, model: 'gemini-3-pro-preview' })
      });
    }

    if (!puterRes.ok) {
      const errText = await puterRes.text().catch(() => '');
      console.error('Puter API returned non-OK after fallback:', puterRes.status, errText);
      return Response.json({ error: 'Puter API error', status: puterRes.status, details: errText }, { status: 500 });
    }

    const puterData = await puterRes.json();

    // Try multiple places where Puter might return text
    const text = puterData.output_text || puterData.response || puterData.text || puterData.choices?.[0]?.message?.content || puterData.choices?.[0]?.text || puterData.result || (typeof puterData === 'string' ? puterData : JSON.stringify(puterData));

    // Extract JSON from response
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd).trim();

    try {
      const data = JSON.parse(jsonString);
      // Validate required fields
      if (!data.cropType || !data.wasteType) {
        throw new Error('Incomplete response from AI');
      }
      return Response.json(data);
    } catch (parseError) {
      return Response.json({
        error: 'Failed to parse AI response',
        parseError: parseError.message,
        rawResponse: text
      }, { status: 500 });
    }
  } catch (error) {
    return Response.json({
      error: 'Failed to process request',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
