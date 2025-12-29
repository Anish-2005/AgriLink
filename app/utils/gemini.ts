// utils/gemini.js
export async function analyzeWaste(data) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze waste');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing waste:', error);
    throw error;
  }
}