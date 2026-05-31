import { useEffect, useMemo, useRef, useState } from 'react'
import { DEVICES } from '../../utils/deviceList'
import { PLAYER_PROFILES } from '../../lib/sensitivityEngine'

const PROFILE_IDS = Object.keys(PLAYER_PROFILES)

const EXPERIENCE_OPTIONS = [
  { id: 'beginner', label: 'Beginner', description: 'Just started' },
  { id: 'intermediate', label: 'Intermediate', description: 'Few months' },
  { id: 'advanced', label: 'Advanced', description: '1+ year' },
  { id: 'professional', label: 'Professional', description: 'Competitive' },
]

const RANGE_OPTIONS = [
  { id: 'close_range', label: 'Close Range', description: 'Rush / hip fire' },
  { id: 'mid_range', label: 'Mid Range', description: 'Balanced' },
  { id: 'long_range', label: 'Long Range', description: 'Scope / sniper' },
  { id: 'all_range', label: 'All Range', description: 'Mixed' },
]

const SCOPE_OPTIONS = [
  { id: 'rarely', label: 'Rarely', description: 'Mostly hip fire' },
  { id: 'sometimes', label: 'Sometimes', description: '2x mainly' },
  { id: 'often', label: 'Often', description: '2x and 4x' },
  { id: 'always', label: 'Always', description: 'Scope everything' },
]

const SECTION_CARD =
  'rounded-2xl border border-white/[0.06] p-6 mb-4 backdrop-blur-[20px] animate-fadeInUp opacity-0'
const SECTION_BG = { background: 'rgba(10, 11, 20, 0.8)' }

const INPUT_CLASS =
  'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-[15px] text-white outline-none transition-all duration-200 placeholder:text-[#64748b] focus:border-[#00F6FF] focus:shadow-[0_0_0_3px_rgba(0,246,255,0.1)]'

function SectionLabel({ children }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="h-px w-4 bg-[#00F6FF]/50" aria-hidden />
      <span className="text-xs font-semibold uppercase tracking-widest text-[#00F6FF]">
        {children}
      </span>
    </div>
  )
}

function getDeviceDisplayName(device) {
  return `${device.brand} ${device.name}`
}

function getTierBadgeLabel(device) {
  if (device.deviceType === 'iphone') return 'iPhone'
  if (device.deviceType === 'android_gaming') return 'Gaming'
  const tierLabels = {
    budget: 'Budget',
    mid: 'Mid',
    flagship: 'Flagship',
  }
  return tierLabels[device.tier] || device.tier
}

function SmallOptionCards({ label, options, value, onChange, delay = '0s' }) {
  return (
    <section
      className={SECTION_CARD}
      style={{ ...SECTION_BG, animationDelay: delay }}
    >
      <SectionLabel>{label}</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isSelected = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-[14px] border p-3.5 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-[#00F6FF]/40 bg-[#00F6FF]/[0.08] shadow-[0_0_20px_rgba(0,246,255,0.1)]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
              }`}
            >
              <p className="text-sm font-bold text-white">{option.label}</p>
              <p className="mt-0.5 text-xs text-[#64748b]">{option.description}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function DeviceInfoCard({
  device,
  dpiOverride,
  customDPI,
  onToggleOverride,
  onCustomDPIChange,
}) {
  const displayDpi =
    dpiOverride && customDPI ? Number(customDPI) : device.dpi

  return (
    <div className="mt-4 space-y-3">
      <div
        className="rounded-xl border border-white/[0.06] p-4"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden>
            📱
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white">{getDeviceDisplayName(device)}</p>
            <p className="mt-1 text-sm text-[#00F6FF]">
              Detected DPI: {displayDpi}
            </p>
            <span className="mt-2 inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-[#94A3B8]">
              {getTierBadgeLabel(device)}
            </span>
            <p className="mt-2 text-xs text-[#64748b]">
              DPI affects your sensitivity calculation
            </p>
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <span className="text-sm text-[#94A3B8]">⚙️ Override DPI manually</span>
        <button
          type="button"
          role="switch"
          aria-checked={dpiOverride}
          onClick={onToggleOverride}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            dpiOverride ? 'bg-[#00F6FF]' : 'bg-white/10'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
              dpiOverride ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {dpiOverride && (
        <div>
          <label
            htmlFor="custom-dpi-override"
            className="mb-2 block text-sm text-[#94A3B8]"
          >
            Enter Custom DPI
          </label>
          <input
            id="custom-dpi-override"
            type="number"
            min="100"
            max="1200"
            value={customDPI}
            onChange={(e) => onCustomDPIChange(e.target.value)}
            placeholder="e.g. 520"
            className={INPUT_CLASS}
          />
          <p className="mt-2 text-xs text-[#64748b]">
            Your phone&apos;s actual DPI if you know it
          </p>
        </div>
      )}
    </div>
  )
}

export default function SensitivityForm({ onCalculateRequest }) {
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [manualOnly, setManualOnly] = useState(false)
  const [manualDPI, setManualDPI] = useState('')
  const [dpiOverride, setDpiOverride] = useState(false)
  const [customDPI, setCustomDPI] = useState('')
  const [selectedPlaystyle, setSelectedPlaystyle] = useState('balanced_competitive')
  const [experience, setExperience] = useState('intermediate')
  const [preferredRange, setPreferredRange] = useState('mid_range')
  const [scopes, setScopes] = useState('sometimes')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [showError, setShowError] = useState(false)

  const dropdownRef = useRef(null)

  const filteredDevices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return []
    return DEVICES.filter(
      (device) =>
        device.name.toLowerCase().includes(query) ||
        device.brand.toLowerCase().includes(query),
    )
  }, [searchQuery])

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
        setIsInputFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function clearError() {
    setShowError(false)
  }

  function handleSelectDevice(device) {
    setSelectedDevice(device)
    setManualOnly(false)
    setSearchQuery(getDeviceDisplayName(device))
    setShowDropdown(false)
    setIsInputFocused(false)
    setDpiOverride(false)
    setCustomDPI('')
    clearError()
  }

  function handleClearSelection() {
    setSelectedDevice(null)
    setSearchQuery('')
    setShowDropdown(false)
    setDpiOverride(false)
    setCustomDPI('')
    clearError()
  }

  function resolveDeviceInput() {
    if (manualOnly) {
      const parsed = Number(manualDPI)
      if (manualDPI && parsed >= 100 && parsed <= 1200) {
        return {
          dpi: parsed,
          deviceType: null,
          deviceName: `Manual Entry (${parsed} DPI)`,
        }
      }
      return null
    }

    if (selectedDevice) {
      const parsedOverride = Number(customDPI)
      const dpi =
        dpiOverride &&
        customDPI &&
        parsedOverride >= 100 &&
        parsedOverride <= 1200
          ? parsedOverride
          : selectedDevice.dpi

      return {
        dpi,
        deviceType: selectedDevice.deviceType,
        deviceName: getDeviceDisplayName(selectedDevice),
      }
    }

    return null
  }

  function handleCalculate() {
    const deviceInput = resolveDeviceInput()

    if (!deviceInput) {
      setShowError(true)
      return
    }

    setShowError(false)

    onCalculateRequest({
      deviceName: deviceInput.deviceName,
      deviceDPI: deviceInput.dpi,
      deviceType: deviceInput.deviceType ?? 'unknown',
      playstyle: selectedPlaystyle,
      experience,
      preferredRange,
      scopes,
    })
  }

  const isDropdownVisible =
    isInputFocused && searchQuery.length > 0 && showDropdown && !manualOnly

  return (
    <div>
      <section
        className={SECTION_CARD}
        style={{ ...SECTION_BG, animationDelay: '0.05s' }}
      >
        <SectionLabel>Your Phone Model</SectionLabel>

        {!manualOnly && (
          <div ref={dropdownRef} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedDevice(null)
                  setShowDropdown(true)
                  clearError()
                }}
                onFocus={() => {
                  setIsInputFocused(true)
                  if (searchQuery.length > 0) setShowDropdown(true)
                }}
                placeholder="Search your phone model..."
                className={INPUT_CLASS}
              />

              {(selectedDevice || searchQuery) && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#64748b] hover:text-white"
                  aria-label="Clear selection"
                >
                  ✕
                </button>
              )}
            </div>

            {isDropdownVisible && filteredDevices.length > 0 && (
              <ul
                className="absolute z-20 mt-2 max-h-[220px] w-full overflow-y-auto rounded-xl border border-white/[0.08]"
                style={{ background: '#0a0b14' }}
              >
                {filteredDevices.map((device) => (
                  <li key={`${device.brand}-${device.name}`}>
                    <button
                      type="button"
                      onClick={() => handleSelectDevice(device)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#00F6FF]/5"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {device.name}
                        </p>
                        <p className="text-xs text-[#64748b]">{device.brand}</p>
                      </div>
                      <span className="shrink-0 text-xs text-[#00F6FF]">
                        {device.dpi} DPI
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {isDropdownVisible && filteredDevices.length === 0 && (
              <p
                className="absolute z-20 mt-2 w-full rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-[#64748b]"
                style={{ background: '#0a0b14' }}
              >
                Phone not found? Use manual DPI below
              </p>
            )}
          </div>
        )}

        {selectedDevice && !manualOnly && (
          <DeviceInfoCard
            device={selectedDevice}
            dpiOverride={dpiOverride}
            customDPI={customDPI}
            onToggleOverride={() => setDpiOverride((prev) => !prev)}
            onCustomDPIChange={(value) => {
              setCustomDPI(value)
              clearError()
            }}
          />
        )}

        {!selectedDevice && (
          <button
            type="button"
            onClick={() => {
              setManualOnly((prev) => !prev)
              setSelectedDevice(null)
              setSearchQuery('')
              setDpiOverride(false)
              setCustomDPI('')
            }}
            className="mt-4 text-sm text-[#00F6FF] transition hover:underline"
          >
            📱 My phone isn&apos;t listed — enter DPI manually
          </button>
        )}

        {manualOnly && (
          <div className="mt-4">
            <label
              htmlFor="manual-dpi-only"
              className="mb-2 block text-sm text-[#94A3B8]"
            >
              Enter your phone&apos;s DPI
            </label>
            <input
              id="manual-dpi-only"
              type="number"
              min="100"
              max="1200"
              value={manualDPI}
              onChange={(e) => {
                setManualDPI(e.target.value)
                clearError()
              }}
              placeholder="e.g. 400"
              className={INPUT_CLASS}
            />
            <button
              type="button"
              onClick={() => {
                setManualOnly(false)
                setManualDPI('')
              }}
              className="mt-2 text-xs text-[#64748b] hover:text-white"
            >
              ← Back to device search
            </button>
          </div>
        )}
      </section>

      <section
        className={SECTION_CARD}
        style={{ ...SECTION_BG, animationDelay: '0.15s' }}
      >
        <SectionLabel>Your Playstyle</SectionLabel>

        <div className="grid grid-cols-2 gap-3">
          {PROFILE_IDS.map((profileId) => {
            const profile = PLAYER_PROFILES[profileId]
            const isSelected = selectedPlaystyle === profileId

            return (
              <button
                key={profileId}
                type="button"
                onClick={() => setSelectedPlaystyle(profileId)}
                className={`cursor-pointer rounded-[14px] border p-[18px] text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-[#00F6FF]/40 bg-[#00F6FF]/[0.08] shadow-[0_0_20px_rgba(0,246,255,0.1)]'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
                }`}
              >
                <span className="mb-2 block text-2xl" role="img" aria-hidden>
                  {profile.icon}
                </span>
                <p className="text-[15px] font-bold text-white">{profile.name}</p>
                <p className="mt-1 text-[13px] text-[#64748b]">
                  {profile.description}
                </p>
                <p className="mt-2 text-xs text-[#00F6FF]">
                  Like: {profile.proPlayer}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <SmallOptionCards
        label="Experience Level"
        options={EXPERIENCE_OPTIONS}
        value={experience}
        onChange={setExperience}
        delay="0.25s"
      />

      <SmallOptionCards
        label="Preferred Range"
        options={RANGE_OPTIONS}
        value={preferredRange}
        onChange={setPreferredRange}
        delay="0.35s"
      />

      <SmallOptionCards
        label="Scope Usage"
        options={SCOPE_OPTIONS}
        value={scopes}
        onChange={setScopes}
        delay="0.45s"
      />

      <div
        className="animate-fadeInUp opacity-0"
        style={{ animationDelay: '0.55s' }}
      >
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full cursor-pointer rounded-[14px] border-none py-[18px] text-lg font-extrabold tracking-wide text-black transition-all duration-300 active:translate-y-0 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_8px_30px_rgba(0,246,255,0.3)]"
          style={{
            background: 'linear-gradient(135deg, #00F6FF 0%, #0044FF 100%)',
            letterSpacing: '0.05em',
          }}
        >
          Calculate My Sensitivity →
        </button>

        {showError && (
          <p className="mt-3 text-center text-sm text-red-400">
            ⚠️ Please select your phone or enter your DPI to continue
          </p>
        )}
      </div>
    </div>
  )
}
