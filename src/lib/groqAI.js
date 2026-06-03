// ============================================================
// HAFYN X — Unified AI Sensitivity Client
// AI is the single source of truth.
// sensitivityEngine.js is no longer called from the UI;
// the only fallback path is getSmartFallback() below,
// which runs ONLY when the AI endpoint fails.
// ============================================================

export async function getAISensitivity({
  deviceName,
  deviceDPI,
  deviceType,
  playstyle,
  experience,
  preferredRange,
  scopes,
}) {
  try {
    const response = await fetch('/api/sensitivity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceName,
        deviceDPI,
        deviceType,
        playstyle,
        experience,
        preferredRange,
        scopes,
      }),
    })

    if (!response.ok) throw new Error('API failed')

    const data = await response.json()

    // Validate all required numeric values exist and are numbers
    const required = [
      'general',
      'redDot',
      'x2Scope',
      'x4Scope',
      'sniper',
      'freeLook',
    ]

    for (const key of required) {
      if (data[key] === undefined || data[key] === null || isNaN(data[key])) {
        throw new Error(`Invalid value for ${key}`)
      }
    }

    return data
  } catch (error) {
    console.error('AI failed, using fallback:', error)
    return getSmartFallback({
      playstyle,
      deviceDPI,
      deviceType,
      experience,
      preferredRange,
      scopes,
    })
  }
}

export async function sendChatMessage(messages, systemPrompt) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt }),
    })
    if (!response.ok) throw new Error('Chat failed')
    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('Chat error:', error)
    return null
  }
}

// ------------------------------------------------------------
// Smart fallback — used ONLY when the AI endpoint is down.
// Built from real pro-player anchors so values still feel
// authentic even without the AI.
// ------------------------------------------------------------
function getSmartFallback({
  playstyle,
  deviceDPI,
  deviceType,
  experience,
  // preferredRange and scopes are reserved for future tuning
  // eslint-disable-next-line no-unused-vars
  preferredRange,
  // eslint-disable-next-line no-unused-vars
  scopes,
}) {
  // Real pro player anchors
  const PROFILES = {
    hip_fire_destroyer: { G: 195, RD: 8, x2: 168, x4: 163, SNP: 12, FL: 100 },
    freestyle_speedster: { G: 178, RD: 170, x2: 172, x4: 165, SNP: 65, FL: 144 },
    precision_freestyle: { G: 158, RD: 171, x2: 152, x4: 158, SNP: 143, FL: 67 },
    scope_master: { G: 63, RD: 83, x2: 159, x4: 185, SNP: 131, FL: 79 },
    balanced_competitive: { G: 95, RD: 90, x2: 82, x4: 67, SNP: 52, FL: 125 },
    beginner_friendly: { G: 65, RD: 60, x2: 55, x4: 45, SNP: 38, FL: 85 },
  }

  const base = PROFILES[playstyle] || PROFILES.balanced_competitive

  // Device multiplier — explicit types win; DPI tiers are a fallback
  let mult = 1.0
  if (deviceType === 'iphone') mult = 1.0
  else if (deviceType === 'android_gaming') mult = 0.97
  else if (deviceType === 'android_flagship') mult = 0.82
  else if (deviceType === 'android_mid') mult = 0.9
  else if (deviceType === 'android_budget') mult = 0.95
  else if (deviceDPI >= 800) mult = 0.82
  else if (deviceDPI >= 500) mult = 0.95
  else if (deviceDPI >= 400) mult = 0.9
  else mult = 0.95

  // Experience adjustment
  let expMult = 1.0
  if (experience === 'beginner') expMult = 0.75
  else if (experience === 'intermediate') expMult = 0.9
  else if (experience === 'advanced') expMult = 1.0
  else if (experience === 'professional') expMult = 1.05

  const calc = (val) => {
    const result = Math.round(val * mult * expMult)
    return Math.min(200, Math.max(1, result))
  }

  // Make each value slightly unique
  const offset = () => Math.floor(Math.random() * 5) - 2
  const clamp = (n) => Math.min(200, Math.max(1, n))

  return {
    general: clamp(calc(base.G) + offset()),
    redDot: clamp(calc(base.RD) + offset()),
    x2Scope: clamp(calc(base.x2) + offset()),
    x4Scope: clamp(calc(base.x4) + offset()),
    sniper: clamp(calc(base.SNP) + offset()),
    freeLook: clamp(calc(base.FL) + offset()),
    closestPro: getClosestPro(playstyle),
    analysis: getFallbackAnalysis(playstyle, deviceType),
    tips: getFallbackTip(playstyle),
  }
}

function getClosestPro(playstyle) {
  const map = {
    hip_fire_destroyer: 'Tennyson FF',
    freestyle_speedster: 'White FF / 4 Flag Gamer',
    precision_freestyle: 'SadxFF',
    scope_master: 'ZeroX FF',
    balanced_competitive: 'Standard Esports Pro',
    beginner_friendly: 'Recommended Starting Point',
  }
  return map[playstyle] || 'Pro Player Average'
}

function getFallbackAnalysis(playstyle, deviceType) {
  const device = deviceType === 'iphone' ? 'iPhone' : 'Android'
  const analyses = {
    hip_fire_destroyer: `Your ${device} settings are tuned for maximum hip fire speed like Tennyson FF. Red dot is kept minimal since you rely on hip fire.`,
    freestyle_speedster: `High speed settings for your ${device} matching White FF style. Everything is fast for aggressive freestyle gameplay.`,
    precision_freestyle: `Precision-tuned for your ${device} like SadxFF. High aim speed with controlled camera for accurate headshots.`,
    scope_master: `Low general with high scope sensitivity for your ${device} like ZeroX FF. Perfect for scope rush playstyle.`,
    balanced_competitive: `Balanced settings for your ${device} suitable for ranked and scrimmage matches.`,
    beginner_friendly: `Lower sensitivity for your ${device} to build muscle memory. Increase by 5-10 each week as you improve.`,
  }
  return analyses[playstyle] || analyses.balanced_competitive
}

function getFallbackTip(playstyle) {
  const tips = {
    hip_fire_destroyer:
      'If hip fire feels too fast, reduce General by 10. Practice in Training Ground for 15 mins before ranked.',
    freestyle_speedster:
      'If movement feels uncontrolled, reduce General by 10-15. Takes 2-3 days to adjust to high sensitivity.',
    precision_freestyle:
      'Focus on headshots in Training Mode. If aim overshoots target, reduce Red Dot by 5-10.',
    scope_master:
      'Your hip fire will feel slow — this is normal. Practice peek-and-scope in clash squad first.',
    balanced_competitive:
      'Good for all situations. Fine tune by adjusting General up or down by 5 based on your feel.',
    beginner_friendly:
      'Increase General by 5 every week as you get comfortable. Do not rush the process.',
  }
  return tips[playstyle] || tips.balanced_competitive
}
