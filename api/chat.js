// api/chat.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── Debug (remove in production) ──────────────────────────
  console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
  console.log('GROQ_API_KEY starts with:',
    process.env.GROQ_API_KEY?.substring(0, 10));

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    // Step 1: Get last user message
    const lastUserMessage =
      messages.filter(m => m.role === 'user').pop()?.content || '';

    // Step 2: Extract device and playstyle
    const deviceInfo = extractDeviceInfo(lastUserMessage);

    // Step 3: Run calculator if device found
    let calculatorResult = null;
    if (deviceInfo.hasDeviceInfo) {
      try {
        calculatorResult = runCalculator(deviceInfo);
      } catch (e) {
        console.error('Calculator run failed:', e);
      }
    }

    // Step 4: Build calculator context string
    let calculatorContext = '';
    if (calculatorResult) {
      calculatorContext = `
CALCULATOR RESULT FOR THIS USER:
You just ran HAFYN X calculator internally.
These are the EXACT values to share with user:
- General:   ${calculatorResult.general}
- Red Dot:   ${calculatorResult.redDot}
- 2x Scope:  ${calculatorResult.x2Scope}
- 4x Scope:  ${calculatorResult.x4Scope}
- Sniper:    ${calculatorResult.sniper}
- Free Look: ${calculatorResult.freeLook}
- Closest Pro Player: ${calculatorResult.closestPro}

IMPORTANT: Share THESE EXACT numbers. Do not invent different numbers.
Present them naturally like a coach would.
`;
    }

    // Step 5: Call Groq
    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: buildSystemPrompt(calculatorContext),
            },
            {
              role: 'assistant',
              content:
                'Assalam o Alaikum! Main HAFYN X Coach hun. ' +
                'Device aur playstyle batao — main abhi calculate ' +
                'karke exact sensitivity dunga!',
            },
            ...messages,
          ],
          temperature: 0.3,
          max_tokens: 400,
        }),
      }
    );

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      console.error('Groq Error:', groqResponse.status, err);
      return res.status(500).json({ error: 'Groq API failed', detail: err });
    }

    const data = await groqResponse.json();
    return res.status(200).json({
      response: data.choices[0].message.content,
    });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}


// ─────────────────────────────────────────────────────────────
// SYSTEM PROMPT BUILDER
// ─────────────────────────────────────────────────────────────
function buildSystemPrompt(calculatorContext) {
  return `You are HAFYN X Coach — elite Free Fire sensitivity expert by Costa Gamerz Pakistan.

CRITICAL: Free Fire sensitivity is 0-200. NEVER say percentages.

${calculatorContext}

PRO PLAYER DATA (0-200 scale):
ZeroX FF   | POCO F3      DPI:581 | G:198 RD:185 2x:160 4x:145 SNP:85
Jack FF    | iPhone             | G:200 RD:195 2x:180 4x:165 SNP:100
White FF   | iPhone             | G:175 RD:165 2x:150 4x:140 SNP:80
SadxFF     | Samsung A54  DPI:720 | G:200 RD:190 2x:175 4x:160 SNP:95
Raistar    | POCO X3      DPI:480 | G:192 RD:175 2x:155 4x:140 SNP:75
Spero FF   |              DPI:600 | G:200 RD:198 2x:185 4x:170 SNP:95
Pahadi     | ROG          DPI:440 | G:140 RD:130 2x:120 4x:110 SNP:85
Mafia Bala | iPhone             | G:155 RD:145 2x:135 4x:125 SNP:95
Bru Wassana| ROG          DPI:460 | G:165 RD:155 2x:145 4x:135 SNP:75
EVOS MR05  | iPhone             | G:175 RD:185 2x:160 4x:150 SNP:65
Snipuw FF  | Redmi        DPI:520 | G:165 RD:155 2x:145 4x:135 SNP:90
Vasiyo CRJ7| iPhone             | G:145 RD:135 2x:120 4x:110 SNP:60
Syblus     | iPhone             | G:185 RD:175 2x:160 4x:150 SNP:90
Nobru      | ROG          DPI:480 | G:150 RD:145 2x:135 4x:125 SNP:65
Badge99    | iPhone             | G:160 RD:150 2x:140 4x:130 SNP:75
Action Bolt| Samsung S23U DPI:580 | G:170 RD:160 2x:150 4x:140 SNP:100

DEVICE RULES:
- iPhone: highest values (base 100%)
- Android Gaming (ROG/POCO/iQOO) DPI 440-600: ~95% of iPhone
- Android Flagship (Samsung S series) DPI 480-580: ~93%
- Android Mid (Samsung A/Redmi Note) DPI 380-500: ~88-92%
- Android Budget (Infinix/Tecno) DPI <400: ~85-90%
- Higher DPI = lower in-game sensitivity needed

HOW TO RESPOND:
If calculator result is available above → share those EXACT numbers naturally.
  Say: "HAFYN X ne calculate kiya hai tera..." then explain why.

If no device info → ask what device and playstyle they use.

ALWAYS:
- Give specific numbers e.g. "General: 165"
- Reference closest pro player by name
- Keep reply 3-5 sentences
- Friendly South Asian coach tone
- Numbers will match if user verifies on calculator`;
}


// ─────────────────────────────────────────────────────────────
// DEVICE INFO EXTRACTOR
// ─────────────────────────────────────────────────────────────
function extractDeviceInfo(message) {
  const msg = message.toLowerCase();
  let hasDeviceInfo = false;

  // ── Playstyle ──────────────────────────────────────────────
  let playstyle = 'balanced_competitive';
  if (msg.includes('freestyle') || msg.includes('free style'))
    playstyle = 'freestyle_speedster';
  else if (msg.includes('sniper') || msg.includes('long range'))
    playstyle = 'scope_master';
  else if (msg.includes('rush') || msg.includes('aggressive'))
    playstyle = 'hip_fire_destroyer';
  else if (msg.includes('beginner') || msg.includes('new'))
    playstyle = 'beginner_friendly';

  // ── Experience ────────────────────────────────────────────
  let experience = 'intermediate';
  if (msg.includes('beginner') || msg.includes('new player'))
    experience = 'beginner';
  else if (msg.includes('pro') || msg.includes('professional'))
    experience = 'professional';
  else if (msg.includes('advanced') || msg.includes('experienced'))
    experience = 'advanced';

  // ── DPI from message ──────────────────────────────────────
  let deviceDPI = 400;
  let deviceType = 'android_mid';
  let deviceName = 'Android Phone';

  const dpiMatch = msg.match(/(\d{3,4})\s*dpi/);
  if (dpiMatch) deviceDPI = parseInt(dpiMatch[1]);

  // ── Device Detection ──────────────────────────────────────

  if (msg.includes('iphone') || msg.includes('ios') || msg.includes('apple')) {
    hasDeviceInfo = true;
    deviceType = 'iphone';
    deviceDPI = 460;
    deviceName = 'iPhone';

    if (msg.includes('16 pro max')) deviceName = 'iPhone 16 Pro Max';
    else if (msg.includes('16 pro'))  deviceName = 'iPhone 16 Pro';
    else if (msg.includes('16'))      deviceName = 'iPhone 16';
    else if (msg.includes('15 pro'))  deviceName = 'iPhone 15 Pro';
    else if (msg.includes('15'))      deviceName = 'iPhone 15';
    else if (msg.includes('14 pro'))  deviceName = 'iPhone 14 Pro';
    else if (msg.includes('14'))      deviceName = 'iPhone 14';
    else if (msg.includes('13 pro'))  deviceName = 'iPhone 13 Pro';
    else if (msg.includes('13'))      deviceName = 'iPhone 13';
    else if (msg.includes('12'))      deviceName = 'iPhone 12';
    else if (msg.includes('11'))      deviceName = 'iPhone 11';
    else if (msg.includes('se'))      deviceName = 'iPhone SE';
  }

  else if (msg.includes('samsung') || msg.includes('galaxy')) {
    hasDeviceInfo = true;
    deviceName = 'Samsung Galaxy';

    if (msg.includes('s24 ultra') || msg.includes('s23 ultra')) {
      deviceType = 'android_flagship'; deviceDPI = 580;
      deviceName = 'Samsung Galaxy S Ultra';
    } else if (msg.includes('s24') || msg.includes('s23') || msg.includes('s22')) {
      deviceType = 'android_flagship'; deviceDPI = 500;
      deviceName = 'Samsung Galaxy S Series';
    } else if (msg.includes('a54') || msg.includes('a55') || msg.includes('a34')) {
      deviceType = 'android_mid'; deviceDPI = 401;
      deviceName = 'Samsung Galaxy A54/A55';
    } else if (msg.includes('a14') || msg.includes('a15') || msg.includes('a05')) {
      deviceType = 'android_budget'; deviceDPI = 401;
      deviceName = 'Samsung Galaxy A14/A15';
    } else {
      deviceType = 'android_mid'; deviceDPI = 401;
    }
  }

  else if (msg.includes('poco') || msg.includes('xiaomi') || msg.includes('redmi')) {
    hasDeviceInfo = true;

    if (msg.includes('poco f5') || msg.includes('poco f4') || msg.includes('poco f3')) {
      deviceType = 'android_gaming'; deviceDPI = 500;
      deviceName = 'POCO F Series';
    } else if (msg.includes('poco x6') || msg.includes('poco x5') || msg.includes('poco x4')) {
      deviceType = 'android_gaming'; deviceDPI = 450;
      deviceName = 'POCO X Series';
    } else if (msg.includes('poco m')) {
      deviceType = 'android_mid'; deviceDPI = 400;
      deviceName = 'POCO M Series';
    } else if (msg.includes('redmi note 12') || msg.includes('redmi note 13')) {
      deviceType = 'android_mid'; deviceDPI = 395;
      deviceName = 'Redmi Note 12/13';
    } else if (msg.includes('redmi note')) {
      deviceType = 'android_mid'; deviceDPI = 395;
      deviceName = 'Redmi Note Series';
    } else {
      deviceType = 'android_mid'; deviceDPI = 395;
      deviceName = 'Xiaomi/Redmi';
    }
  }

  else if (
    msg.includes('rog phone') || msg.includes('rog gaming') ||
    msg.includes('redmagic') || msg.includes('red magic') ||
    msg.includes('black shark') || msg.includes('iqoo')
  ) {
    hasDeviceInfo = true;
    deviceType = 'android_gaming';
    deviceDPI = 480;

    if (msg.includes('rog'))        deviceName = 'ASUS ROG Phone';
    else if (msg.includes('iqoo')) deviceName = 'iQOO Gaming';
    else if (msg.includes('redmagic') || msg.includes('red magic'))
                                    deviceName = 'RedMagic';
    else                            deviceName = 'Black Shark';
  }

  else if (msg.includes('oneplus') || msg.includes('one plus')) {
    hasDeviceInfo = true;
    deviceDPI = 460;
    deviceName = 'OnePlus';

    if (msg.includes('oneplus 12') || msg.includes('oneplus 11')) {
      deviceType = 'android_flagship'; deviceDPI = 500;
      deviceName = 'OnePlus 12/11';
    } else if (msg.includes('nord')) {
      deviceType = 'android_mid'; deviceDPI = 401;
      deviceName = 'OnePlus Nord';
    } else {
      deviceType = 'android_gaming';
    }
  }

  else if (msg.includes('vivo')) {
    hasDeviceInfo = true;
    deviceName = 'Vivo';

    if (msg.includes('x90') || msg.includes('x80') || msg.includes('x100')) {
      deviceType = 'android_flagship'; deviceDPI = 480;
      deviceName = 'Vivo X Series';
    } else if (msg.includes('y100') || msg.includes('y200')) {
      deviceType = 'android_mid'; deviceDPI = 401;
      deviceName = 'Vivo Y100/Y200';
    } else {
      deviceType = 'android_mid'; deviceDPI = 401;
    }
  }

  else if (msg.includes('oppo')) {
    hasDeviceInfo = true;
    deviceName = 'OPPO';

    if (msg.includes('find x')) {
      deviceType = 'android_flagship'; deviceDPI = 480;
      deviceName = 'OPPO Find X';
    } else if (msg.includes('reno')) {
      deviceType = 'android_mid'; deviceDPI = 401;
      deviceName = 'OPPO Reno';
    } else if (msg.includes('a') && /a\d{2}/.test(msg)) {
      deviceType = 'android_budget'; deviceDPI = 401;
      deviceName = 'OPPO A Series';
    } else {
      deviceType = 'android_mid'; deviceDPI = 401;
    }
  }

  else if (msg.includes('infinix') || msg.includes('tecno') || msg.includes('itel')) {
    hasDeviceInfo = true;
    deviceType = 'android_budget';
    deviceDPI = 380;
    deviceName = msg.includes('infinix') ? 'Infinix'
               : msg.includes('tecno')   ? 'Tecno'
               : 'itel';
  }

  else if (msg.includes('realme')) {
    hasDeviceInfo = true;
    deviceName = 'Realme';

    if (msg.includes('gt')) {
      deviceType = 'android_gaming'; deviceDPI = 460;
      deviceName = 'Realme GT';
    } else if (msg.includes('narzo') || /realme \d/.test(msg)) {
      deviceType = 'android_mid'; deviceDPI = 401;
      deviceName = 'Realme Mid-Range';
    } else {
      deviceType = 'android_mid'; deviceDPI = 401;
    }
  }

  // Override DPI if user explicitly mentioned it
  if (dpiMatch) deviceDPI = parseInt(dpiMatch[1]);

  return {
    hasDeviceInfo,
    deviceType,
    deviceName,
    deviceDPI,
    playstyle,
    experience,
  };
}


// ─────────────────────────────────────────────────────────────
// SENSITIVITY CALCULATOR
// ─────────────────────────────────────────────────────────────
function runCalculator(deviceInfo) {
  const { deviceType, deviceDPI, playstyle, experience } = deviceInfo;

  // ── Base values by device type ────────────────────────────
  const baseValues = {
    iphone:           { g: 175, rd: 165, x2: 150, x4: 140, snp: 80,  fl: 100 },
    android_flagship: { g: 168, rd: 158, x2: 144, x4: 133, snp: 76,  fl: 95  },
    android_gaming:   { g: 165, rd: 155, x2: 142, x4: 132, snp: 74,  fl: 92  },
    android_mid:      { g: 155, rd: 145, x2: 132, x4: 122, snp: 70,  fl: 88  },
    android_budget:   { g: 145, rd: 135, x2: 122, x4: 112, snp: 65,  fl: 82  },
  };

  const base = baseValues[deviceType] || baseValues['android_mid'];

  // ── DPI adjustment (higher DPI → lower sensitivity) ───────
  // Baseline DPI = 460. Each 100 DPI above → reduce ~5 pts
  const dpiDelta = Math.round(((deviceDPI - 460) / 100) * 5);

  let { g, rd, x2, x4, snp, fl } = base;
  g   = clamp(g   - dpiDelta);
  rd  = clamp(rd  - dpiDelta);
  x2  = clamp(x2  - dpiDelta);
  x4  = clamp(x4  - dpiDelta);
  snp = clamp(snp - dpiDelta);
  fl  = clamp(fl  - dpiDelta);

  // ── Playstyle multipliers ─────────────────────────────────
  const playstyleMultiplier = {
    freestyle_speedster:  { g: 1.10, rd: 1.08, x2: 1.05, x4: 1.02, snp: 0.90, fl: 1.05 },
    hip_fire_destroyer:   { g: 1.08, rd: 1.06, x2: 1.00, x4: 0.98, snp: 0.85, fl: 1.03 },
    scope_master:         { g: 0.92, rd: 0.95, x2: 1.05, x4: 1.08, snp: 1.12, fl: 0.95 },
    beginner_friendly:    { g: 0.85, rd: 0.88, x2: 0.88, x4: 0.85, snp: 0.80, fl: 0.85 },
    balanced_competitive: { g: 1.00, rd: 1.00, x2: 1.00, x4: 1.00, snp: 1.00, fl: 1.00 },
  };

  const pm = playstyleMultiplier[playstyle] || playstyleMultiplier['balanced_competitive'];

  g   = clamp(Math.round(g   * pm.g));
  rd  = clamp(Math.round(rd  * pm.rd));
  x2  = clamp(Math.round(x2  * pm.x2));
  x4  = clamp(Math.round(x4  * pm.x4));
  snp = clamp(Math.round(snp * pm.snp));
  fl  = clamp(Math.round(fl  * pm.fl));

  // ── Experience adjustment ─────────────────────────────────
  const expOffset = { beginner: -10, intermediate: 0, advanced: 5, professional: 8 };
  const offset = expOffset[experience] || 0;

  g   = clamp(g   + offset);
  rd  = clamp(rd  + offset);
  x2  = clamp(x2  + offset);
  x4  = clamp(x4  + offset);
  snp = clamp(snp + offset);

  // ── Find closest pro player ───────────────────────────────
  const closestPro = findClosestPro({ g, rd, x2, x4, snp }, deviceType);

  return {
    general:    g,
    redDot:     rd,
    x2Scope:    x2,
    x4Scope:    x4,
    sniper:     snp,
    freeLook:   fl,
    closestPro,
  };
}

// Clamp to 0-200
function clamp(val) {
  return Math.min(200, Math.max(0, val));
}

// ─────────────────────────────────────────────────────────────
// PRO PLAYER MATCHER
// ─────────────────────────────────────────────────────────────
function findClosestPro(userVals, deviceType) {
  const pros = [
    { name: 'ZeroX FF',    device: 'android_gaming',   g: 198, rd: 185, x2: 160, x4: 145, snp: 85  },
    { name: 'Jack FF',     device: 'iphone',            g: 200, rd: 195, x2: 180, x4: 165, snp: 100 },
    { name: 'White FF',    device: 'iphone',            g: 175, rd: 165, x2: 150, x4: 140, snp: 80  },
    { name: 'SadxFF',      device: 'android_mid',       g: 200, rd: 190, x2: 175, x4: 160, snp: 95  },
    { name: 'Raistar',     device: 'android_gaming',    g: 192, rd: 175, x2: 155, x4: 140, snp: 75  },
    { name: 'Spero FF',    device: 'android_gaming',    g: 200, rd: 198, x2: 185, x4: 170, snp: 95  },
    { name: 'Pahadi',      device: 'android_gaming',    g: 140, rd: 130, x2: 120, x4: 110, snp: 85  },
    { name: 'Mafia Bala',  device: 'iphone',            g: 155, rd: 145, x2: 135, x4: 125, snp: 95  },
    { name: 'Bru Wassana', device: 'android_gaming',    g: 165, rd: 155, x2: 145, x4: 135, snp: 75  },
    { name: 'EVOS MR05',   device: 'iphone',            g: 175, rd: 185, x2: 160, x4: 150, snp: 65  },
    { name: 'Snipuw FF',   device: 'android_mid',       g: 165, rd: 155, x2: 145, x4: 135, snp: 90  },
    { name: 'Vasiyo CRJ7', device: 'iphone',            g: 145, rd: 135, x2: 120, x4: 110, snp: 60  },
    { name: 'Syblus',      device: 'iphone',            g: 185, rd: 175, x2: 160, x4: 150, snp: 90  },
    { name: 'Nobru',       device: 'android_gaming',    g: 150, rd: 145, x2: 135, x4: 125, snp: 65  },
    { name: 'Badge99',     device: 'iphone',            g: 160, rd: 150, x2: 140, x4: 130, snp: 75  },
    { name: 'Action Bolt', device: 'android_flagship',  g: 170, rd: 160, x2: 150, x4: 140, snp: 100 },
  ];

  let bestPro  = pros[0];
  let bestScore = Infinity;

  for (const pro of pros) {
    // Weighted difference (device match gives bonus)
    const diff =
      Math.abs(pro.g   - userVals.g)   * 1.0 +
      Math.abs(pro.rd  - userVals.rd)  * 1.0 +
      Math.abs(pro.x2  - userVals.x2)  * 1.2 +
      Math.abs(pro.x4  - userVals.x4)  * 1.2 +
      Math.abs(pro.snp - userVals.snp) * 1.5;

    // Device type bonus
    const deviceBonus = pro.device === deviceType ? -15 : 0;
    const score = diff + deviceBonus;

    if (score < bestScore) {
      bestScore = score;
      bestPro   = pro;
    }
  }

  return bestPro.name;
}