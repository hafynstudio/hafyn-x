// ─── AI Sensitivity Calculator ───────────────────────────
export async function getAISensitivity(params) {
  try {
    const response = await fetch('/api/sensitivity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })

    if (!response.ok) throw new Error('API failed')

    const data = await response.json()

    if (data.error) throw new Error(data.error)

    if (!data.general || !data.redDot) {
      throw new Error('Invalid response')
    }

    return data

  } catch (error) {
    console.error('AI error, using fallback:', error)
    return getSmartFallback(params)
  }
}

// ─── Chat Message Sender ─────────────────────────────────
export async function sendChatMessage(
  messages,
  systemPrompt = null,
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
    })

    if (!response.ok) throw new Error('Chat failed')

    const data = await response.json()
    return data.response

  } catch (error) {
    console.error('Chat error:', error)
    return null
  }
}

// ─── Smart Fallback (when AI fails) ─────────────────────
function getSmartFallback({
  playstyle,
  deviceDPI,
  deviceType,
  experience
}) {
  const AVERAGES = {
    freestyle_speedster: {
      G: 187, RD: 180, x2: 165, x4: 152, SNP: 85, FL: 140
    },
    hip_fire_destroyer: {
      G: 196, RD: 12, x2: 168, x4: 155, SNP: 15, FL: 105
    },
    precision_freestyle: {
      G: 178, RD: 178, x2: 160, x4: 150, SNP: 87, FL: 80
    },
    scope_master: {
      G: 155, RD: 148, x2: 138, x4: 128, SNP: 78, FL: 90
    },
    balanced_competitive: {
      G: 162, RD: 157, x2: 145, x4: 135, SNP: 75, FL: 115
    },
    beginner_friendly: {
      G: 110, RD: 105, x2: 95, x4: 85, SNP: 55, FL: 80
    }
  }

  const base = AVERAGES[playstyle] || AVERAGES.balanced_competitive

  // Device multiplier
  let mult = 1.0
  if (deviceType === 'iphone') mult = 1.0
  else if (deviceType === 'android_gaming') mult = 0.97
  else if (deviceType === 'android_flagship') mult = 0.85
  else if (deviceType === 'android_mid') mult = 0.90
  else if (deviceType === 'android_budget') mult = 0.95
  else if (Number(deviceDPI) >= 700) mult = 0.83
  else if (Number(deviceDPI) >= 550) mult = 0.90
  else if (Number(deviceDPI) >= 450) mult = 0.93
  else mult = 0.95

  // Experience multiplier
  const expMult = {
    beginner: 0.72,
    intermediate: 0.87,
    advanced: 0.97,
    professional: 1.0
  }[experience] || 0.87

  const calc = (val) => {
    const result = Math.round(val * mult * expMult)
    return Math.min(200, Math.max(1, result))
  }

  const o = () => Math.floor(Math.random() * 4) - 2

  return {
    general:    calc(base.G)   + o(),
    redDot:     calc(base.RD)  + o(),
    x2Scope:    calc(base.x2)  + o(),
    x4Scope:    calc(base.x4)  + o(),
    sniper:     calc(base.SNP) + o(),
    freeLook:   calc(base.FL)  + o(),
    closestPro: getProMatch(playstyle),
    analysis:   getAnalysis(playstyle, deviceType),
    tips:       getTip(playstyle)
  }
}

function getProMatch(playstyle) {
  const map = {
    freestyle_speedster:  'White FF / ZeroX FF',
    hip_fire_destroyer:   'Jack FF / SadxFF',
    precision_freestyle:  'Raistar / Apelapato',
    scope_master:         'Pahadi Gaming / Loud Kroonos',
    balanced_competitive: 'Nobru / TSG Legend',
    beginner_friendly:    'TSG Jash (beginner settings)'
  }
  return map[playstyle] || 'Pro Player Average'
}

function getAnalysis(playstyle, deviceType) {
  const device = deviceType === 'iphone'
    ? 'iPhone' : 'Android'
  const map = {
    freestyle_speedster:
      `High speed settings like White FF and ZeroX FF. ` +
      `Your ${device} values adjusted from their verified settings.`,
    hip_fire_destroyer:
      `Maximum hip fire like Jack FF and SadxFF. ` +
      `Red dot kept minimal as you rely on hip fire.`,
    precision_freestyle:
      `Balanced precision like Raistar. ` +
      `High aim speed with controlled camera for headshots.`,
    scope_master:
      `Controlled like Pahadi Gaming. ` +
      `Lower general for stability, tuned scopes for accuracy.`,
    balanced_competitive:
      `Tournament-ready like Nobru. ` +
      `Works in all situations from rush to long range.`,
    beginner_friendly:
      `Safe starting point. ` +
      `Build muscle memory before increasing gradually.`
  }
  return map[playstyle] || map.balanced_competitive
}

function getTip(playstyle) {
  const tips = {
    freestyle_speedster:
      'Too fast? Reduce General by 10 and ' +
      'practice in Training Ground for 20 minutes.',
    hip_fire_destroyer:
      'Practice hip fire drills in Clash Squad. ' +
      'After 2 hours you will feel the difference.',
    precision_freestyle:
      'Focus on headshots in Training Mode. ' +
      'If overshooting, reduce Red Dot by 8-10.',
    scope_master:
      'Hip fire will feel slow — normal. ' +
      'Practice peek-and-scope in Clash Squad first.',
    balanced_competitive:
      'Perfect for ranked. Adjust General up or ' +
      'down by 5 based on feel after 1 hour.',
    beginner_friendly:
      'Increase General by 5 every week. ' +
      'Do not rush the process.'
  }
  return tips[playstyle] || tips.balanced_competitive
}