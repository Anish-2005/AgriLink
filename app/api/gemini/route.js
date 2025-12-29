import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const { image, description, analysisType, cropType, wasteDescription, quantity, moistureLevel, age } = await request.json();
    
    // Validate input
    if (!analysisType || (!image && !description)) {
      return Response.json({
        error: 'Either image or description is required',
        required_fields: ['analysisType', 'image|description']
      }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { temperature: 0.7, topP: 0.9 }
    });

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
      `Analyze this description:
      Crop Type: ${cropType || 'Not specified'}
      Waste Description: ${description}
      Quantity: ${quantity || 'Not specified'}
      Moisture Level: ${moistureLevel || 'Not specified'}
      Age of Waste: ${age || 'Not specified'}`
    }

    Provide complete output in exact specified JSON format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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
      console.error('Failed to parse Gemini response:', parseError, 'Raw response:', text);
      return Response.json({
        error: 'Failed to parse AI response',
        rawResponse: text
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    return Response.json({
      error: 'Failed to process request',
      details: error.message 
    }, { status: 500 });
  }
}