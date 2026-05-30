export const PLAYER_PROFILES = {
  hip_fire_destroyer: {
    name: 'Hip Fire Destroyer',
    description:
      'Maximum hip fire speed. You barely use scopes. Close range king.',
    icon: '💥',
    proPlayer: 'Tennyson FF',
    base: { G: 195, RD: 10, x2: 168, x4: 163, SNP: 12, FL: 100 },
    tip:
      "Apply these and jump into clash squad. First 10 minutes will feel weird — that's normal. Your hip fire will become lethal after 2-3 hours practice.",
  },
  freestyle_speedster: {
    name: 'Freestyle Speedster',
    description:
      'Everything fast. High movement, high aim, dominate every fight.',
    icon: '⚡',
    proPlayer: 'White FF / 4 Flag',
    base: { G: 178, RD: 173, x2: 170, x4: 165, SNP: 153, FL: 155 },
    tip:
      'These are aggressive settings. Go to training ground first — practice 360 turns. If too fast, reduce General by 10 and try again.',
  },
  precision_freestyle: {
    name: 'Precision Freestyle',
    description:
      'Fast aim but controlled camera. Headshots over movement.',
    icon: '🎯',
    proPlayer: 'SadxFF',
    base: { G: 158, RD: 171, x2: 152, x4: 158, SNP: 143, FL: 67 },
    tip:
      'Focus on headshots in training mode first. These settings reward accuracy over speed. Your kill consistency will improve significantly.',
  },
  scope_master: {
    name: 'Scope Master',
    description:
      'Slow movement, ultra fast scope tracking. Scope rush style.',
    icon: '🔭',
    proPlayer: 'ZeroX FF',
    base: { G: 63, RD: 83, x2: 159, x4: 185, SNP: 131, FL: 79 },
    tip:
      "Your hip fire will feel slow — that's intentional. Practice peek-and-scope in training. Best used with 2x and 4x scopes as primary weapons.",
  },
  balanced_competitive: {
    name: 'Balanced Competitive',
    description:
      'Consistent and controlled. Works in ranked and scrims.',
    icon: '⚔️',
    proPlayer: 'Standard Esports',
    base: { G: 95, RD: 90, x2: 82, x4: 67, SNP: 52, FL: 125 },
    tip:
      'Perfect for ranked matches. Consistent in all situations. Most pro scrimmage players use values in this range.',
  },
  beginner_friendly: {
    name: 'Beginner Friendly',
    description:
      'Easier to control. Build muscle memory before going faster.',
    icon: '🌱',
    proPlayer: 'Recommended for new players',
    base: { G: 65, RD: 60, x2: 55, x4: 45, SNP: 38, FL: 85 },
    tip:
      "Start here and increase General by 5 every week as you get comfortable. Don't rush — muscle memory takes time.",
  },
}

export const DEVICE_MULTIPLIERS = {
  iphone: 1.0,
  android_gaming: 0.97,
  android_flagship: 0.82,
  android_mid: 0.9,
  android_budget: 0.95,
}

const SETTING_KEYS = [
  'general',
  'redDot',
  'x2Scope',
  'x4Scope',
  'sniper',
  'freeLook',
]

const BASE_KEY_MAP = {
  G: 'general',
  RD: 'redDot',
  x2: 'x2Scope',
  x4: 'x4Scope',
  SNP: 'sniper',
  FL: 'freeLook',
}

const OFFSET_RANGES = {
  G: 4,
  RD: 5,
  x2: 4,
  x4: 5,
  SNP: 4,
  FL: 4,
}

function clamp(value) {
  return Math.min(200, Math.max(1, value))
}

function roundValue(value) {
  return Math.round(value)
}

function randomOffset(max) {
  const magnitude = Math.floor(Math.random() * (max + 1))
  const sign = Math.random() < 0.5 ? -1 : 1
  return magnitude * sign
}

export function getDeviceMultiplier(deviceDPI, deviceType) {
  if (deviceType === 'iphone') {
    return DEVICE_MULTIPLIERS.iphone
  }

  if (deviceType && DEVICE_MULTIPLIERS[deviceType] !== undefined) {
    return DEVICE_MULTIPLIERS[deviceType]
  }

  if (deviceDPI >= 800) return DEVICE_MULTIPLIERS.android_flagship
  if (deviceDPI >= 500) return DEVICE_MULTIPLIERS.android_gaming
  if (deviceDPI >= 400) return DEVICE_MULTIPLIERS.android_mid
  return DEVICE_MULTIPLIERS.android_budget
}

function ensureUniqueValues(values) {
  const result = { ...values }
  const used = new Set()

  for (const key of SETTING_KEYS) {
    let val = result[key]

    if (used.has(val)) {
      val = clamp(val + 1)
      while (used.has(val) && val < 200) {
        val++
      }
      if (used.has(val)) {
        val = clamp(result[key] - 1)
        while (used.has(val) && val > 1) {
          val--
        }
      }
    }

    result[key] = val
    used.add(val)
  }

  return result
}

export function calculateSensitivity({ deviceDPI, deviceType, playstyle }) {
  const profile =
    PLAYER_PROFILES[playstyle] ?? PLAYER_PROFILES.balanced_competitive
  const multiplier = getDeviceMultiplier(deviceDPI, deviceType)

  const raw = {}

  for (const [baseKey, outputKey] of Object.entries(BASE_KEY_MAP)) {
    const baseVal = profile.base[baseKey]
    const offset = randomOffset(OFFSET_RANGES[baseKey])
    raw[outputKey] = roundValue(clamp(baseVal * multiplier + offset))
  }

  const unique = ensureUniqueValues(raw)

  return {
    general: unique.general,
    redDot: unique.redDot,
    x2Scope: unique.x2Scope,
    x4Scope: unique.x4Scope,
    sniper: unique.sniper,
    freeLook: unique.freeLook,
    profileName: profile.name,
    proPlayer: profile.proPlayer,
    tip: profile.tip,
  }
}
