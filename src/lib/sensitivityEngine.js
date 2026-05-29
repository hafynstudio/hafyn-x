const SETTING_KEYS = [
  'general',
  'redDot',
  'x2Scope',
  'x4Scope',
  'sniper',
  'freeLook',
]

const PLAYSTYLE_CONFIG = {
  aggressive: {
    multipliers: {
      general: 1.4,
      redDot: 1.2,
      x2Scope: 1.0,
      x4Scope: 0.8,
      sniper: 0.6,
      freeLook: 1.3,
    },
    tip:
      'High sensitivity helps you track moving targets in close range fights. Your red dot is tuned for fast peek-and-shoot. Practice in clash squad to get used to these settings.',
  },
  balanced: {
    multipliers: {
      general: 1.0,
      redDot: 0.9,
      x2Scope: 0.8,
      x4Scope: 0.7,
      sniper: 0.55,
      freeLook: 1.0,
    },
    tip:
      'These settings work for all situations. Good for ranked matches where you need both mobility and accuracy. Most pro players in South Asia use balanced settings as their base.',
  },
  sniper: {
    multipliers: {
      general: 0.6,
      redDot: 0.7,
      x2Scope: 0.9,
      x4Scope: 1.1,
      sniper: 1.3,
      freeLook: 0.7,
    },
    tip:
      'Low general sensitivity gives you stable movement for positioning. High scope sensitivity helps you track targets at distance. Perfect for CS ranking and battle royale.',
  },
  rusher: {
    multipliers: {
      general: 1.6,
      redDot: 1.4,
      x2Scope: 1.1,
      x4Scope: 0.8,
      sniper: 0.5,
      freeLook: 1.5,
    },
    tip:
      'Maximum speed settings. Your camera moves very fast — takes 2-3 days to adjust. Once adjusted, you will out-rotate every enemy. Best for aggressive solo vs squad.',
  },
}

function clamp(value) {
  return Math.min(200, Math.max(1, value))
}

function roundValue(value) {
  return Math.round(value)
}

function ensureUniqueValues(values) {
  const result = { ...values }
  const used = new Set()

  for (const key of SETTING_KEYS) {
    let val = result[key]

    if (used.has(val)) {
      let increased = val
      while (used.has(increased) && increased < 200) {
        increased++
      }

      if (!used.has(increased)) {
        val = increased
      } else {
        let decreased = val
        while (used.has(decreased) && decreased > 1) {
          decreased--
        }
        val = decreased
      }
    }

    result[key] = val
    used.add(val)
  }

  return result
}

export function calculateSensitivity({ deviceDPI, playstyle }) {
  const config = PLAYSTYLE_CONFIG[playstyle] ?? PLAYSTYLE_CONFIG.balanced
  const normalizedDPI = 400 / deviceDPI
  const baseValue = normalizedDPI * 100

  const raw = {
    general: baseValue * config.multipliers.general,
    redDot: baseValue * config.multipliers.redDot,
    x2Scope: baseValue * config.multipliers.x2Scope,
    x4Scope: baseValue * config.multipliers.x4Scope,
    sniper: baseValue * config.multipliers.sniper,
    freeLook: baseValue * config.multipliers.freeLook,
  }

  const rounded = Object.fromEntries(
    SETTING_KEYS.map((key) => [key, roundValue(clamp(raw[key]))]),
  )

  const unique = ensureUniqueValues(rounded)

  return {
    ...unique,
    tip: config.tip,
  }
}
