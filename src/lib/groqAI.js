export async function sendChatMessage(
  messages,
  systemPrompt,
  lastCalculatorResult = null
) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        systemPrompt,
        lastCalculatorResult
      })
    });

    if (!response.ok) throw new Error('Failed');
    const data = await response.json();
    return data.response;

  } catch (error) {
    console.error('Chat error:', error);
    return null;
  }
}