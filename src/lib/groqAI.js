export async function getAISensitivity(params) {
  try {
    const response = await fetch('/api/sensitivity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    if (!response.ok) throw new Error('API failed')
    return await response.json()
  } catch (error) {
    console.error('Sensitivity API error:', error)
    return getFallback(params.playstyle, params.deviceDPI)
  }
}

export async function sendChatMessage(messages, systemPrompt) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt }),
    })

    if (!response.ok) throw new Error('Chat API failed')
    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('Chat error:', error)
    return null
  }
}

function getFallback(playstyle, dpi) {
  const bases = {
    freestyle_speedster: {
      general: 178,
      redDot: 170,
      x2Scope: 172,
      x4Scope: 165,
      sniper: 65,
      freeLook: 144,
    },
    hip_fire_destroyer: {
      general: 195,
      redDot: 8,
      x2Scope: 168,
      x4Scope: 163,
      sniper: 12,
      freeLook: 100,
    },
    precision_freestyle: {
      general: 158,
      redDot: 171,
      x2Scope: 152,
      x4Scope: 158,
      sniper: 143,
      freeLook: 67,
    },
    scope_master: {
      general: 63,
      redDot: 83,
      x2Scope: 159,
      x4Scope: 185,
      sniper: 131,
      freeLook: 79,
    },
    balanced_competitive: {
      general: 95,
      redDot: 90,
      x2Scope: 82,
      x4Scope: 67,
      sniper: 52,
      freeLook: 125,
    },
    beginner_friendly: {
      general: 65,
      redDot: 60,
      x2Scope: 55,
      x4Scope: 45,
      sniper: 38,
      freeLook: 85,
    },
  }
  return bases[playstyle] || bases.balanced_competitive
}
