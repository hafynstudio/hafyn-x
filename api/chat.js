export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { messages } = req.body;

    // Step 1: Analyze user message for device/style info
    const lastUserMessage = messages
      .filter(m => m.role === 'user')
      .pop()?.content || '';

    // Step 2: Extract device and playstyle from message
    const deviceInfo = extractDeviceInfo(lastUserMessage);

    // Step 3: If device info found, run calculator first
    let calculatorResult = null;
    if (deviceInfo.hasDeviceInfo) {
      try {
        calculatorResult = await runCalculator(deviceInfo);
      } catch (e) {
        console.error('Calculator run failed:', e);
      }
    }

    // Step 4: Build context with calculator result
    let calculatorContext = '';
    if (calculatorResult) {
      calculatorContext = `
CALCULATOR RESULT FOR THIS USER:
You just ran HAFYN X calculator internally.
These are the EXACT values to share with user:
- General: ${calculatorResult.general}
- Red Dot: ${calculatorResult.redDot}
- 2x Scope: ${calculatorResult.x2Scope}
- 4x Scope: ${calculatorResult.x4Scope}
- Sniper: ${calculatorResult.sniper}
- Free Look: ${calculatorResult.freeLook}
- Closest Pro Player: ${calculatorResult.closestPro}

IMPORTANT: Share THESE EXACT numbers.
Do not make up different numbers.
Present them naturally like a coach would.
`;
    }

    // Step 5: Call Groq with full context
    const groqResponse = await fetch(
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
              content: `You are HAFYN X Coach — 
elite Free Fire sensitivity expert by Costa Gamerz Pakistan.

CRITICAL: Free Fire sensitivity is 0-200. NEVER say percentages.

${calculatorContext}

PRO PLAYER DATA (0-200 scale):
ZeroX FF | POCO F3 DPI:581 | G:198 RD:185 2x:160 4x:145 SNP:85
Jack FF | iPhone | G:200 RD:195 2x:180 4x:165 SNP:100
White FF | iPhone | G:175 RD:165 2x:150 4x:140 SNP:80
SadxFF | Samsung A54 DPI:720 | G:200 RD:190 2x:175 4x:160 SNP:95
Raistar | POCO X3 DPI:480 | G:192 RD:175 2x:155 4x:140 SNP:75
Spero FF | DPI:600 | G:200 RD:198 2x:185 4x:170 SNP:95
Pahadi Gaming | ROG DPI:440 | G:140 RD:130 2x:120 4x:110 SNP:85
Mafia Bala | iPhone | G:155 RD:145 2x:135 4x:125 SNP:95
Bru Wassana | ROG DPI:460 | G:165 RD:155 2x:145 4x:135 SNP:75
EVOS MR05 | iPhone | G:175 RD:185 2x:160 4x:150 SNP:65
Snipuw FF | Redmi DPI:520 | G:165 RD:155 2x:145 4x:135 SNP:90
Vasiyo CRJ7 | iPhone | G:145 RD:135 2x:120 4x:110 SNP:60
Syblus | iPhone | G:185 RD:175 2x:160 4x:150 SNP:90
Nobru | ROG DPI:480 | G:150 RD:145 2x:135 4x:125 SNP:65
Badge99 | iPhone | G:160 RD:150 2x:140 4x:130 SNP:75
Action Bolt | Samsung S23U DPI:580 | G:170 RD:160 2x:150 4x:140 SNP:100

DEVICE RULES:
- iPhone: highest values
- Android Gaming ROG/POCO/iQOO DPI 440-600: 95% of iPhone
- Android Mid Samsung A/Redmi Note DPI 380-500: 88-92%
- Android Budget Infinix/Tecno DPI <400: 90-95%
- Vivo Y100 DPI ~401: Android mid values
- Higher DPI = lower sensitivity

HOW TO RESPOND:
If calculator result is available above:
Share those EXACT numbers naturally.
Say: "HAFYN X ne calculate kiya hai tera..."
Then explain WHY those values suit them.

If no device info in message:
Ask what device and playstyle they use.
Then you can calculate for them.

ALWAYS:
- Specific numbers like "General: 165"
- Reference pro player by name
- Short 3-5 sentences
- Friendly South Asian coach tone
- If they verify on calculator → same numbers will show`
            },
            {
              role: 'assistant',
              content: 'Assalam o Alaikum! Main HAFYN X Coach hun. Device aur playstyle batao — main abhi calculate karke exact sensitivity dunga!'
            },
            ...messages
          ],
          temperature: 0.3,
          max_tokens: 400
        })
      }
    );

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      console.error('Groq Error:', groqResponse.status, err);
      return res.status(500).json({ error: 'Groq failed' });
    }

    const data = await groqResponse.json();
    return res.status(200).json({
      response: data.choices[0].message.content
    });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// ─── Helper: Extract device info from message ───────────────
function extractDeviceInfo(message) {
  const msg = message.toLowerCase();

  // Detect playstyle
  let playstyle = 'balanced_competitive';
  if (msg.includes('freestyle') || msg.includes('free style'))
    playstyle = 'freestyle_speedster';
  else if (msg.includes('sniper') || msg.includes('long range'))
    playstyle = 'scope_master';
  else if (msg.includes('rush') || msg.includes('aggressive'))
    playstyle = 'hip_fire_destroyer';
  else if (msg.includes('beginner') || msg.includes('new'))
    playstyle = 'beginner_friendly';
  else if (msg.includes('mid') || msg.includes('balanced'))
    playstyle = 'balanced_competitive';

  // Detect experience
  let experience = 'intermediate';
  if (msg.includes('beginner') || msg.includes('new player'))
    experience = 'beginner';
  else if (msg.includes('pro') || msg.includes('professional'))
    experience = 'professional';
  else if (msg.includes('advanced') || msg.includes('experienced'))
    experience = 'advanced';

  // Detect DPI from message
  let deviceDPI = 400;
  let deviceType = 'android_mid';
  let deviceName = 'Android Phone';

  const dpiMatch = msg.match(/(\d{3,4})\s*dpi/);
  if (dpiMatch) {
    deviceDPI = parseInt(dpiMatch[1]);
  }

  // Detect device type
  if (msg.includes('iphone') || msg.includes('ios') || 
      msg.includes('apple')) {
    deviceType = 'iphone';
    deviceDPI = 460;
    deviceName = 'iPhone';
    
    // Specific models
    if (msg.includes('16 pro')) deviceName = 'iPhone 16 Pro';
    else if (msg.includes('16')) deviceName = 'iPhone 16';
    else if (msg.includes('15 pro')) deviceName = 'iPhone 15 Pro';
    else if (msg.includes('15')) deviceName = 'iPhone 15';
    else if (msg.includes('14 pro')) deviceName = 'iPhone 14 Pro';
    else if (msg.includes('14')) deviceName = 'iPhone 14';
    else if (msg.includes('13 pro')) deviceName = 'iPhone 13 Pro';
    else if (msg.includes('13')) deviceName = 'iPhone 13';
    else if (msg.includes('12')) deviceName = 'iPhone 12';
    else if (msg.includes('11')) deviceName = 'iPhone 11';
  }

  // Samsung
  else if (msg.includes('samsung') || msg.includes('galaxy')) {
    deviceName = 'Samsung Galaxy';
    if (msg.includes('s23') || msg.includes('s24') || 
        msg.includes('s22')) {
      deviceType = 'android_flagship';
      deviceDPI = 500;
      deviceName = 'Samsung Galaxy S Series';
    } else if (msg.includes('a54') || msg.includes('a34') || 
               msg.includes('a55')) {
      deviceType = 'android_mid';
      deviceDPI = 401;
      deviceName = 'Samsung Galaxy A Series';
    } else if (msg.includes('a14') || msg.includes('a15') || 
               msg.includes('a05')) {
      deviceType = 'android_budget';
      deviceDPI = 401;
      deviceName = 'Samsung Galaxy A14/A15';
    } else {
      deviceType = 'android_mid';
      deviceDPI = 401;
    }
  }

  // Xiaomi/Redmi/POCO
  else if (msg.includes('xiaomi') || msg.includes('redmi') || 
           msg.includes('poco')) {
    if (msg.includes('poco f') || msg.includes('poco x5') || 
        msg.includes('poco x6')) {
      deviceType = 'android_gaming';
      deviceDPI = 450;
      deviceName = 'POCO F/X Series';
    } else if (msg.includes('redmi note')) {
      deviceType = 'android_mid';
      deviceDPI = 395;
      deviceName = 'Redmi Note Series';
    } else {
      deviceType = 'android_mid';
      deviceDPI = 395;
      deviceName = 'Xiaomi/Redmi';
    }
  }

  // ROG / Gaming
  else if (msg.includes('rog') || msg.includes('redmagic') || 
           msg.includes('iqoo') || msg.includes('black shark')) {
    deviceType = 'android_gaming';
    deviceDPI = 480;
    deviceName 