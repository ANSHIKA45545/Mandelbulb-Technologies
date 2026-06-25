const MOCK_RESPONSE = {
  estimatedEffort: '4 hours',
  suggestedDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  reasoning: 'Based on typical task complexity, this appears to be a medium-effort item that can be completed within a few days.',
  isMock: true,
};

const parseGeminiResponse = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid AI response format');
  const parsed = JSON.parse(jsonMatch[0]);
  return {
    estimatedEffort: parsed.estimatedEffort || parsed.effort || '2-4 hours',
    suggestedDueDate: parsed.suggestedDueDate || parsed.dueDate,
    reasoning: parsed.reasoning || 'AI-generated estimate based on task details.',
    isMock: false,
  };
};

export const suggestEstimate = async (title, description = '') => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const isPlaceholder = !apiKey || apiKey === 'your-gemini-api-key' || apiKey.startsWith('your-');

  if (isPlaceholder) {
    return { ...MOCK_RESPONSE, reasoning: 'AI unavailable — showing sample estimate. Add GEMINI_API_KEY to backend/.env and restart the server.' };
  }

  const prompt = `You are a project management assistant. Given a task, suggest an effort estimate and due date.

Task title: ${title}
Task description: ${description || 'No description provided'}

Respond ONLY with valid JSON (no markdown):
{
  "estimatedEffort": "e.g. 2 hours or Size M",
  "suggestedDueDate": "YYYY-MM-DD",
  "reasoning": "One short sentence explaining your estimate"
}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 256 },
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      return { ...MOCK_RESPONSE, reasoning: 'AI service temporarily unavailable — showing fallback estimate.' };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty AI response');

    return parseGeminiResponse(text);
  } catch (err) {
    console.error('AI suggestion error:', err.message);
    return { ...MOCK_RESPONSE, reasoning: 'Could not reach AI service — showing fallback estimate.' };
  } finally {
    clearTimeout(timeout);
  }
};
