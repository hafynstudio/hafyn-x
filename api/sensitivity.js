// ============================================================
// HAFYN X — Unified AI Sensitivity Endpoint (Groq)
// This is the ONLY source of truth for sensitivity values.
// If parsing fails the client falls back to getSmartFallback()
// in src/lib/groqAI.js — the formula engine is no longer used.
// ============================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
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
    } = req.body || {}

    const prompt = `You are an elite Free Fire 
sensitivity coach with real pro player data.

PRO PLAYER DATABASE:
- White FF (iPhone, MENA, Freestyle): 
  G:185 RD:151 2x:140 4x:106 SNP:157 FL:173
- ZeroX FF (iPhone, Nepal, Aggressive Freestyle): 
  G:63 RD:83 2x:159 4x:185 SNP:131 FL:79
- SadxFF (RedMagic, Pakistan, Precision): 
  G:158 RD:171 2x:152 4x:158 SNP:143 FL:67
- 4 Flag (iPhone, India, Speed): 
  G:175 RD:185 2x:185 4x:170 SNP:150 FL:150
- Tennyson FF (iQOO, Android, Hip Fire): 
  G:200 RD:0 2x:170 4x:166 SNP:15 FL:100

PLAYER INFO:
Device: ${deviceName}
DPI: ${deviceDPI}
Type: ${deviceType}
Playstyle: ${playstyle}
Experience: ${experience}
Range: ${preferredRange}
Scopes: ${scopes}

TASK: Generate personalized sensitivity values.

RULES:
1. Find closest pro player to this style
2. Adjust values based on their device vs pro device
   (higher DPI phone = lower sensitivity values)
3. Adjust for experience 
   (beginner = 70-75% of pro values)
   (intermediate = 85-90%)
   (advanced = 95-100%)
   (professional = 100-105%)
4. All values: 0 to 200
5. Make each value unique (not all same)
6. Values must feel realistic

RESPOND ONLY IN THIS FORMAT:
GENERAL: [number]
RED_DOT: [number]
X2_SCOPE: [number]
X4_SCOPE: [number]
SNIPER: [number]
FREE_LOOK: [number]
PRO_MATCH: [closest pro player name]
ANALYSIS: [one sentence why these values suit them]
TIPS: [one practical adjustment tip]`

    const groqRes = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content:
                'You are a Free Fire sensitivity expert. Always respond in the exact format requested. Only output the formatted data, nothing else.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 250,
        }),
      },
    )

    if (!groqRes.ok) {
      const err = await groqRes.text()
      console.error('Groq error:', err)
      return res.status(500).json({ error: 'Groq failed' })
    }

    const groqData = await groqRes.json()
    const text = groqData?.choices?.[0]?.message?.content || ''

    console.log('AI Response:', text)

    // ------- Robust parsers -------
    const getNum = (key) => {
      const patterns = [
        new RegExp(key + ':\\s*(\\d+)', 'i'),
        new RegExp(key + '\\s*=\\s*(\\d+)', 'i'),
        new RegExp(key + '\\s+(\\d+)', 'i'),
      ]
      for (const pattern of patterns) {
        const match = text.match(pattern)
        if (match) {
          return Math.min(200, Math.max(0, parseInt(match[1], 10)))
        }
      }
      return null
    }

    const getText = (key) => {
      const match = text.match(new RegExp(key + ':\\s*(.+)', 'i'))
      return match ? match[1].trim() : ''
    }

    const result = {
      general: getNum('GENERAL'),
      redDot: getNum('RED_DOT'),
      x2Scope: getNum('X2_SCOPE'),
      x4Scope: getNum('X4_SCOPE'),
      sniper: getNum('SNIPER'),
      freeLook: getNum('FREE_LOOK'),
      closestPro: getText('PRO_MATCH'),
      analysis: getText('ANALYSIS'),
      tips: getText('TIPS'),
    }

    // Require ALL six numeric values to be parsed — otherwise let the
    // client trigger getSmartFallback() so the user never sees
    // partial/inconsistent values.
    const allValuesValid =
      result.general !== null &&
      result.redDot !== null &&
      result.x2Scope !== null &&
      result.x4Scope !== null &&
      result.sniper !== null &&
      result.freeLook !== null

    if (!allValuesValid) {
      console.error('Parsing failed. Raw:', text)
      return res.status(500).json({ error: 'Parse failed', raw: text })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('Handler error:', error)
    return res.status(500).json({ error: error.message })
  }
}
