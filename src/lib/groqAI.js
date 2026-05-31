// Real pro player data - this is our "training data"
const PRO_PLAYER_DATA = `
VERIFIED PRO PLAYER SENSITIVITY DATA:

1. White FF (MENA, iPhone 16, Freestyle Aggressive):
   General:185 RedDot:151 2x:140 4x:106 Sniper:157 FreeLook:173
   Style: Ultra high everything, extreme speed

2. ZeroX FF (Nepal, iPhone 16, Scope Rush):
   General:63 RedDot:83 2x:159 4x:185 Sniper:131 FreeLook:79
   Style: Low general, maximum scope sensitivity, scope rusher

3. SadxFF (Pakistan, RedMagic Gaming Phone, Precision Freestyle):
   General:158 RedDot:171 2x:152 4x:158 Sniper:143 FreeLook:67
   Style: High aim speed, very low free look, headshot focus

4. 4 Flag Gamer (India, iPhone 15 Pro, Speed):
   General:175 RedDot:185 2x:185 4x:170 Sniper:150 FreeLook:150
   Style: Maximum everything, aggressive fast gameplay

5. Tennyson FF (Android, iQOO Neo 10, Hip Fire Only):
   General:200 RedDot:0 2x:170 4x:166 Sniper:15 FreeLook:100
   Style: Maximum hip fire, ignores red dot and sniper completely

6. Real Freestyle Player (Pakistan, 520 DPI, Freestyle):
   General:180 RedDot:170 2x:175 4x:170 Sniper:64 FreeLook:144
   Style: High all round, low sniper, close-mid range focus

KEY INSIGHTS FROM DATA:
- iPhone users need higher values (touch response different)
- Gaming phones (RedMagic/iQOO) similar to iPhone
- Budget Android needs slightly higher than flagship Android
- Free Look does NOT need to be high - depends on style
- Red Dot can be 0 if player uses hip fire only
- Sniper can be very low if player avoids long range
- No universal pattern exists - every style is unique
`

export async function getAISensitivity({
  deviceName,
  deviceDPI,
  deviceType,
  playstyle,
  experience,
  preferredRange,
  scopes,
}) {
  const prompt = `You are an elite Free Fire sensitivity coach 
with data from the world's best freestyle players.

${PRO_PLAYER_DATA}

A player needs your help. Analyze their profile carefully:

PLAYER PROFILE:
- Device: ${deviceName}
- DPI: ${deviceDPI}
- Device Type: ${deviceType}
- Wanted Playstyle: ${playstyle}
- Experience Level: ${experience}
- Preferred Combat Range: ${preferredRange}
- Uses Scopes: ${scopes}

YOUR TASK:
Based on the pro player data above and this player's profile,
give them EXACT sensitivity values.

Think step by step:
1. Which pro player is closest to their style?
2. How does their device compare to that pro's device?
3. Adjust values based on device difference
4. Adjust values based on experience level
   (beginners need 20-30% lower values)

RESPONSE FORMAT (respond EXACTLY like this):

SENSITIVITY:
General: [number]
Red Dot: [number]
2x Scope: [number]
4x Scope: [number]
Sniper: [number]
Free Look: [number]

CLOSEST PRO: [pro player name and why]

ANALYSIS: [2-3 sentences explaining why these specific 
values suit this player's device and style]

TIPS: [2 specific tips for adjusting if feels wrong]

Rules:
- All values between 0-200
- Values must make sense for the style
- Do NOT give all same values
- Do NOT give generic advice
- Sound like a real coach, not a robot
- Keep response under 200 words total`

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content:
                'You are an elite Free Fire sensitivity coach. You give precise, personalized sensitivity settings based on real pro player data. Always respond in the exact format requested.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.4,
          max_tokens: 400,
        }),
      },
    )

    if (!response.ok) {
      throw new Error('Groq API failed')
    }

    const data = await response.json()
    const text = data.choices[0].message.content

    return parseAIResponse(text)
  } catch (error) {
    console.error('Groq AI error:', error)
    return getFallbackSensitivity(playstyle, deviceDPI, deviceType)
  }
}

function parseAIResponse(text) {
  const lines = text.split('\n')
  const result = {
    general: 100,
    redDot: 95,
    x2Scope: 85,
    x4Scope: 70,
    sniper: 55,
    freeLook: 120,
    closestPro: '',
    analysis: '',
    tips: '',
    rawResponse: text,
  }

  lines.forEach((line) => {
    const lower = line.toLowerCase()
    if (lower.includes('general:')) result.general = extractNumber(line)
    if (lower.includes('red dot:')) result.redDot = extractNumber(line)
    if (lower.includes('4x')) result.x4Scope = extractNumber(line)
    else if (lower.includes('2x')) result.x2Scope = extractNumber(line)
    if (lower.includes('sniper:')) result.sniper = extractNumber(line)
    if (lower.includes('free look:')) result.freeLook = extractNumber(line)
    if (lower.includes('closest pro:'))
      result.closestPro = line.split(':').slice(1).join(':').trim() || ''
  })

  const analysisMatch = text.match(/ANALYSIS:([\s\S]*?)(?=TIPS:|$)/)
  if (analysisMatch) result.analysis = analysisMatch[1].trim()

  const tipsMatch = text.match(/TIPS:([\s\S]*?)$/)
  if (tipsMatch) result.tips = tipsMatch[1].trim()

  return result
}

function extractNumber(line) {
  const match = line.match(/\d+/)
  if (match) {
    const num = parseInt(match[0], 10)
    return Math.min(200, Math.max(0, num))
  }
  return 0
}

function getFallbackSensitivity(playstyle, deviceDPI, deviceType) {
  const bases = {
    freestyle_speedster: { G: 178, RD: 170, x2: 172, x4: 165, SNP: 65, FL: 144 },
    hip_fire_destroyer: { G: 195, RD: 8, x2: 168, x4: 163, SNP: 12, FL: 100 },
    precision_freestyle: { G: 158, RD: 171, x2: 152, x4: 158, SNP: 143, FL: 67 },
    scope_master: { G: 63, RD: 83, x2: 159, x4: 185, SNP: 131, FL: 79 },
    balanced_competitive: { G: 95, RD: 90, x2: 82, x4: 67, SNP: 52, FL: 125 },
    beginner_friendly: { G: 65, RD: 60, x2: 55, x4: 45, SNP: 38, FL: 85 },
  }

  const base = bases[playstyle] || bases.balanced_competitive
  const mult =
    deviceType === 'iphone'
      ? 1.0
      : deviceDPI >= 800
        ? 0.82
        : deviceDPI >= 500
          ? 0.97
          : deviceDPI >= 400
            ? 0.9
            : 0.95

  return {
    general: Math.round(Math.min(200, base.G * mult)),
    redDot: Math.round(Math.min(200, base.RD * mult)),
    x2Scope: Math.round(Math.min(200, base.x2 * mult)),
    x4Scope: Math.round(Math.min(200, base.x4 * mult)),
    sniper: Math.round(Math.min(200, base.SNP * mult)),
    freeLook: Math.round(Math.min(200, base.FL * mult)),
    closestPro: 'Based on pro player averages',
    analysis: 'Settings calculated from verified pro player data.',
    tips: 'If too fast, reduce General by 10. If too slow, increase by 10.',
  }
}
