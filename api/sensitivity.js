export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const {
      deviceName,
      deviceDPI,
      deviceType,
      playstyle,
      experience,
      preferredRange,
      scopes,
    } = req.body

    const PRO_PLAYER_DATA = `
VERIFIED PRO PLAYER DATA:
1. White FF (iPhone 16, MENA, Freestyle): 
   G:185 RD:151 2x:140 4x:106 SNP:157 FL:173
2. ZeroX FF (iPhone 16, Nepal, Aggressive Freestyle): 
   G:63 RD:83 2x:159 4x:185 SNP:131 FL:79
3. SadxFF (RedMagic, Pakistan, Precision Freestyle): 
   G:158 RD:171 2x:152 4x:158 SNP:143 FL:67
4. 4 Flag (iPhone 15 Pro, India, Speed): 
   G:175 RD:185 2x:185 4x:170 SNP:150 FL:150
5. Tennyson FF (iQOO Neo 10, Android, Hip Fire): 
   G:200 RD:0 2x:170 4x:166 SNP:15 FL:100
6. Real Freestyle (520 DPI, Pakistan): 
   G:180 RD:170 2x:175 4x:170 SNP:64 FL:144
`

    const prompt = `${PRO_PLAYER_DATA}

Player profile:
- Device: ${deviceName} (${deviceDPI} DPI, ${deviceType})
- Playstyle: ${playstyle}
- Experience: ${experience}
- Range preference: ${preferredRange}
- Scope usage: ${scopes}

Give EXACT sensitivity values. 
Think: which pro player matches this profile?
Adjust for their device vs that pro's device.

Respond ONLY in this exact format, nothing else:
GENERAL: [number]
RED_DOT: [number]
X2_SCOPE: [number]
X4_SCOPE: [number]
SNIPER: [number]
FREE_LOOK: [number]
PRO_MATCH: [pro player name]
ANALYSIS: [2 sentences max explaining why]
TIPS: [1 tip for adjustment]

All numbers must be between 0-200.
Make them realistic and varied.`

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.4,
          max_tokens: 200,
        }),
      },
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Groq sensitivity error:', error)
      return res.status(500).json({ error: 'Groq API failed' })
    }

    const data = await response.json()
    const text = data.choices[0].message.content

    const getValue = (key) => {
      const match = text.match(new RegExp(key + ':\\s*(\\d+)'))
      return match
        ? Math.min(200, Math.max(0, parseInt(match[1], 10)))
        : null
    }

    const getText = (key) => {
      const match = text.match(new RegExp(key + ':\\s*(.+)'))
      return match ? match[1].trim() : ''
    }

    return res.status(200).json({
      general: getValue('GENERAL') || 100,
      redDot: getValue('RED_DOT') || 95,
      x2Scope: getValue('X2_SCOPE') || 85,
      x4Scope: getValue('X4_SCOPE') || 75,
      sniper: getValue('SNIPER') || 55,
      freeLook: getValue('FREE_LOOK') || 120,
      closestPro: getText('PRO_MATCH'),
      analysis: getText('ANALYSIS'),
      tips: getText('TIPS'),
    })
  } catch (error) {
    console.error('Sensitivity error:', error)
    return res.status(500).json({ error: error.message })
  }
}
