export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 
    'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 
    'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { 
      deviceName, deviceDPI, deviceType,
      playstyle, experience, 
      preferredRange, scopes 
    } = req.body;

    // COMPLETE PRO PLAYER DATABASE
    const PRO_DATABASE = `
=== FREESTYLE LEGENDS ===
ZeroX FF | POCO F3 | DPI:581 | G:198 RD:185 2x:160 4x:145 SNP:85
Jack FF | iPhone 11 | DPI:iOS | G:200 RD:195 2x:180 4x:165 SNP:100
White FF | iPhone 13 | DPI:iOS | G:175 RD:165 2x:150 4x:140 SNP:80
SadxFF | Samsung A54 | DPI:720 | G:200 RD:190 2x:175 4x:160 SNP:95
Spero FF | POCO/Moto | DPI:600 | G:200 RD:198 2x:185 4x:170 SNP:95
Goppad Gaming | ROG Phone 5 | DPI:440 | G:185 RD:170 2x:160 4x:150 SNP:80
Black444 | ROG Phone 5 | DPI:500 | G:190 RD:180 2x:165 4x:155 SNP:85
Sitar07 | Infinix Note | DPI:550 | G:200 RD:195 2x:180 4x:170 SNP:90
Apelapato | iPhone 11 Pro | DPI:iOS | G:165 RD:180 2x:150 4x:135 SNP:70
Tornado FF | iPhone 13 Pro | DPI:iOS | G:195 RD:175 2x:160 4x:150 SNP:85
Raistar | POCO X3 | DPI:480 | G:192 RD:175 2x:155 4x:140 SNP:75
Apple FF | iPhone 14 Pro | DPI:iOS | G:170 RD:160 2x:145 4x:135 SNP:70
JotaFF | Redmi K40 | DPI:620 | G:200 RD:190 2x:170 4x:155 SNP:90
Syblus | iPhone 12 Pro | DPI:iOS | G:185 RD:175 2x:160 4x:150 SNP:90
Nexus FF | Samsung S22U | DPI:680 | G:195 RD:185 2x:165 4x:155 SNP:80

=== RUSHERS ===
Bru Wassana | ROG Phone 6 | DPI:460 | G:165 RD:155 2x:145 4x:135 SNP:75
EVOS MR05 | iPhone 14 Pro | DPI:iOS | G:175 RD:185 2x:160 4x:150 SNP:65
Loud Cauan7 | iPhone 14 | DPI:iOS | G:180 RD:170 2x:155 4x:145 SNP:70
Killer FF | iPhone 13 | DPI:iOS | G:160 RD:150 2x:140 4x:130 SNP:80
Jack FF Rush | iPhone 8 | DPI:iOS | G:200 RD:195 2x:180 4x:170 SNP:95
TSG Legend | iPhone 13 Pro | DPI:iOS | G:158 RD:148 2x:138 4x:128 SNP:72
Fluxo Regis | iPhone 14 | DPI:iOS | G:162 RD:155 2x:145 4x:135 SNP:68
Loud Yago Rush | iPhone 13 | DPI:iOS | G:155 RD:145 2x:135 4x:125 SNP:80
Frontal Gaming | iPhone 13 | DPI:iOS | G:155 RD:165 2x:145 4x:135 SNP:60
Bru Moshi | ROG Phone 6 | DPI:450 | G:170 RD:160 2x:150 4x:140 SNP:75
Bru Joena | ROG Phone 6 | DPI:460 | G:165 RD:155 2x:145 4x:135 SNP:70
Loud Thurzin | iPhone 13 | DPI:iOS | G:160 RD:150 2x:140 4x:130 SNP:85
Ungraduate Gamer | ROG Phone 5 | DPI:430 | G:160 RD:150 2x:140 4x:130 SNP:75
Fluxo Syaz | iPhone 13 Pro | DPI:iOS | G:144 RD:134 2x:124 4x:114 SNP:60

=== SNIPERS ===
Pahadi Gaming | ROG Phone 5 | DPI:440 | G:140 RD:130 2x:120 4x:110 SNP:85
Mafia Bala | iPhone 14 Pro | DPI:iOS | G:155 RD:145 2x:135 4x:125 SNP:95
Loud Kroonos | iPhone 13 | DPI:iOS | G:145 RD:135 2x:125 4x:115 SNP:75
Snipuw FF | Redmi K Series | DPI:520 | G:165 RD:155 2x:145 4x:135 SNP:90
TSG Ritik | iPhone 13 | DPI:iOS | G:148 RD:138 2x:128 4x:118 SNP:80
Bru Lukzbaa | ROG Phone 6 | DPI:450 | G:150 RD:140 2x:130 4x:120 SNP:88
Action Bolt | Samsung S23U | DPI:580 | G:170 RD:160 2x:150 4x:140 SNP:100
Kaka FF | ROG Phone 5 | DPI:460 | G:160 RD:150 2x:140 4x:130 SNP:86
Najeeb Gaming | iPhone 13 Pro | DPI:iOS | G:158 RD:148 2x:138 4x:128 SNP:92
Guxs FF | POCO X4 Pro | DPI:600 | G:180 RD:165 2x:155 4x:145 SNP:90
Vincenzo | iPhone 11 Pro | DPI:iOS | G:145 RD:135 2x:125 4x:115 SNP:65
EVOS Sam13 Sniper | iPhone 14 Pro | DPI:iOS | G:150 RD:140 2x:130 4x:120 SNP:78
Frostty | iPhone XR | DPI:iOS | G:162 RD:152 2x:142 4x:132 SNP:88
Ajay TG | ROG Phone 3 | DPI:430 | G:142 RD:132 2x:122 4x:112 SNP:70
Loud Yago Sniper | iPhone 13 | DPI:iOS | G:152 RD:142 2x:132 4x:122 SNP:82

=== LONG RANGE / MARKSMAN ===
Vasiyo CRJ7 | iPhone 14 Pro | DPI:iOS | G:145 RD:135 2x:120 4x:110 SNP:60
TSG Jash | iPhone 13 | DPI:iOS | G:150 RD:140 2x:130 4x:120 SNP:65
Loud Will | iPhone 14 Pro | DPI:iOS | G:142 RD:132 2x:122 4x:112 SNP:62
Fozyajay | ROG Phone 5 | DPI:411 | G:140 RD:130 2x:125 4x:115 SNP:70
Rakesh0007 | OnePlus 9 Pro | DPI:480 | G:155 RD:145 2x:135 4x:125 SNP:75
Jigs | iPhone 11 Pro | DPI:iOS | G:160 RD:150 2x:140 4x:130 SNP:80
Aura Gaming | ROG Phone 3 | DPI:420 | G:148 RD:138 2x:128 4x:118 SNP:68
Delete FF | iPhone 11 | DPI:iOS | G:158 RD:148 2x:138 4x:128 SNP:78
Total Gaming Ajay | ROG Phone 5 | DPI:430 | G:145 RD:135 2x:125 4x:115 SNP:65
Bru Joena LR | ROG Phone 6 | DPI:460 | G:165 RD:155 2x:145 4x:135 SNP:70
Fluxo Syaz LR | iPhone 13 Pro | DPI:iOS | G:144 RD:134 2x:124 4x:114 SNP:60
Desi Gamers Amit | ROG Phone 5 | DPI:420 | G:145 RD:135 2x:125 4x:115 SNP:65
Sooneeta | iPhone 13 Pro | DPI:iOS | G:152 RD:142 2x:132 4x:122 SNP:72
Loud Cauan7 LR | iPhone 14 | DPI:iOS | G:160 RD:150 2x:138 4x:128 SNP:70
EVOS Sam13 LR | iPhone 14 Pro | DPI:iOS | G:152 RD:142 2x:132 4x:122 SNP:72

=== MID RANGE ===
Raistar Mid | POCO X3 | DPI:480 | G:192 RD:175 2x:155 4x:140 SNP:75
Syblus Mid | iPhone 12 Pro | DPI:iOS | G:185 RD:175 2x:160 4x:150 SNP:90
Bru Wassana Mid | ROG Phone 6 | DPI:460 | G:165 RD:155 2x:145 4x:135 SNP:75
BNL | iPhone 13 Pro | DPI:iOS | G:175 RD:190 2x:160 4x:150 SNP:85
Badge99 | iPhone 14 Pro | DPI:iOS | G:160 RD:150 2x:140 4x:130 SNP:75
Nobru | ROG Phone 6 | DPI:480 | G:150 RD:145 2x:135 4x:125 SNP:65
Gyan Sujan | OnePlus 9 Pro | DPI:450 | G:165 RD:160 2x:150 4x:140 SNP:80
M8N Egypt | iPhone 12 | DPI:iOS | G:180 RD:170 2x:155 4x:145 SNP:85
Ungraduate Mid | ROG Phone 5 | DPI:430 | G:162 RD:157 2x:147 4x:137 SNP:77
Frontal Mid | iPhone 13 | DPI:iOS | G:155 RD:165 2x:145 4x:135 SNP:65
White FF Mid | iPhone 11 | DPI:iOS | G:160 RD:185 2x:155 4x:145 SNP:80
Techno Gamerz | OnePlus 8T | DPI:450 | G:158 RD:148 2x:138 4x:128 SNP:78
AS Gaming | iPhone 12 Pro | DPI:iOS | G:150 RD:140 2x:130 4x:120 SNP:70
EVOS MR05 Mid | iPhone 14 Pro | DPI:iOS | G:175 RD:185 2x:160 4x:150 SNP:65
Loud Cauan7 Mid | iPhone 13 | DPI:iOS | G:165 RD:185 2x:150 4x:140 SNP:80
`;

    // Smart device multiplier
    const getDeviceMultiplier = (dpi, type) => {
      if (type === 'iphone') return 1.0;
      if (type === 'android_gaming') return 0.97;
      if (type === 'android_flagship') return 0.85;
      if (type === 'android_mid') return 0.90;
      if (type === 'android_budget') return 0.95;
      if (dpi >= 700) return 0.83;
      if (dpi >= 550) return 0.90;
      if (dpi >= 450) return 0.93;
      if (dpi >= 380) return 0.90;
      return 0.95;
    };

    const mult = getDeviceMultiplier(deviceDPI, deviceType);

    const prompt = `You are HAFYN X — the world's most 
accurate Free Fire sensitivity AI coach.

You have access to a database of 75+ verified 
pro player sensitivity settings from all over the world.

COMPLETE PRO PLAYER DATABASE:
${PRO_DATABASE}

KEY RULES FROM PRO DATA:
- iPhone players naturally use higher values
- Android Gaming phones (ROG/POCO/iQOO): 
  slightly lower than iPhone
- Freestyle players: General 165-200
- Rushers: General 155-185, controlled scopes
- Snipers: General 140-170, Sniper 65-100
- Long Range: General 140-165, LOW scopes
- Mid Range: General 150-192, Red Dot varies
- Beginner = 70% of pro values
- Intermediate = 85% of pro values
- Advanced = 95-100% of pro values
- Professional = 100% of pro values

DEVICE MULTIPLIER FOR ${deviceName}:
Apply ${mult} multiplier to base pro values
(This adjusts for their device vs pro device)

PLAYER TO ANALYZE:
Device: ${deviceName} (${deviceDPI} DPI)
Device Type: ${deviceType}
Device Multiplier: ${mult}
Playstyle Category: ${playstyle}
Experience: ${experience}
Preferred Range: ${preferredRange}
Scope Usage: ${scopes}

YOUR TASK:
1. Find 3 pro players from database 
   closest to this player's style
2. Calculate average of their values
3. Apply device multiplier (${mult})
4. Apply experience adjustment
5. Give final personalized values

CRITICAL: Respond ONLY in this exact format:
GENERAL: [number]
RED_DOT: [number]
X2_SCOPE: [number]
X4_SCOPE: [number]
SNIPER: [number]
FREE_LOOK: [number]
PRO_MATCH: [name of closest pro player]
ANALYSIS: [why these values suit this player]
TIPS: [one specific adjustment tip]

All numbers 0-200. No text before or after format.`;

    const groqRes = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `You are HAFYN X AI. 
You ONLY respond in the exact format given.
Never add extra text. Never explain.
Just output the formatted sensitivity data.`
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 300
        })
      }
    );

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('Groq error:', err);
      return res.status(500).json({ 
        error: 'AI unavailable' 
      });
    }

    const groqData = await groqRes.json();
    const text = groqData.choices[0].message.content;
    console.log('AI Raw Response:', text);

    const getNum = (key) => {
      const regex = new RegExp(
        key + '[:\\s]+([0-9]+)', 'i'
      );
      const match = text.match(regex);
      if (match) {
        return Math.min(200, 
          Math.max(0, parseInt(match[1])));
      }
      return null;
    };

    const getStr = (key) => {
      const regex = new RegExp(
        key + '[:\\s]+(.+)', 'i'
      );
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    const result = {
      general:    getNum('GENERAL'),
      redDot:     getNum('RED_DOT'),
      x2Scope:    getNum('X2_SCOPE'),
      x4Scope:    getNum('X4_SCOPE'),
      sniper:     getNum('SNIPER'),
      freeLook:   getNum('FREE_LOOK'),
      closestPro: getStr('PRO_MATCH'),
      analysis:   getStr('ANALYSIS'),
      tips:       getStr('TIPS')
    };

    // Validate
    if (result.general === null || 
        result.redDot === null) {
      console.error('Parse failed:', text);
      return res.status(500).json({ 
        error: 'Parse failed', 
        raw: text 
      });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message 
    });
  }
}