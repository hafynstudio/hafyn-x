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

function OptionCards({ label, options, value, onChange, disabled }) {
  return (
    <section className="rounded-xl border border-brand-border bg-brand-card p-4 sm:p-5">
      <label className="mb-3 block text-sm font-semibold text-white">
        {label}
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className={`rounded-xl border p-3 text-left transition disabled:opacity-60 ${
                isSelected
                  ? 'border-brand-yellow text-brand-yellow'
                  : 'border-brand-border text-white hover:border-zinc-600'
              }`}
            >
              <p className="text-sm font-semibold">{option.label}</p>
              <p
                className={`mt-0.5 text-xs ${
                  isSelected ? 'text-brand-yellow/80' : 'text-zinc-400'
                }`}
              >
                {option.description}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function DeviceInfoCard({ device, dpiOverride, customDPI, onToggleOverride, onCustomDPIChange }) {
  const displayDpi =
    dpiOverride && customDPI ? Number(customDPI) : device.dpi

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-xl border border-[#333] bg-[#111111] p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden>
            📱
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">
              {getDeviceDisplayName(device)}
            </p>
            <p className="mt-1 text-sm text-[#00D4FF]">
              Detected DPI: {displayDpi}
            </p>
            <span className="mt-2 inline-block rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-300">
              {getTierBadgeLabel(device)}
            </span>
            <p className="mt-2 text-xs text-zinc-500">
              DPI affects your sensitivity calculation
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-brand-border bg-brand-card px-4 py-3">
        <span className="text-sm text-zinc-300">⚙️ Override DPI manually</span>
        <button
          type="button"
          role="switch"
          aria-checked={dpiOverride}
          onClick={onToggleOverride}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            dpiOverride ? 'bg-[#00D4FF]' : 'bg-brand-border'
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
            className="mb-2 block text-sm font-medium text-white"
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
            className="w-full rounded-lg border border-[#333] bg-[#111111] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
          />
          <p className="mt-2 text-xs text-zinc-500">
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
        dpiOverride && customDPI && parsedOverride >= 100 && parsedOverride <= 1200
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
    <div className="space-y-6">
      <section className="rounded-xl border border-brand-border bg-brand-card p-4 sm:p-5">
        <label className="mb-3 block text-sm font-semibold text-white">
          Your Phone Model
        </label>

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
                  if (searchQuery.length > 0) {
                    setShowDropdown(true)
                  }
                }}
                placeholder="Search your phone model..."
                className="w-full rounded-lg border border-[#333] bg-[#111111] py-3 pl-4 pr-10 text-white placeholder:text-zinc-500 focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
              />

              {(selectedDevice || searchQuery) && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-white"
                  aria-label="Clear selection"
                >
                  ✕
                </button>
              )}
            </div>

            {isDropdownVisible && filteredDevices.length > 0 && (
              <ul className="absolute z-20 mt-1 max-h-[200px] w-full overflow-y-auto rounded-lg border border-[#333] bg-[#111111] shadow-lg">
                {filteredDevices.map((device) => {
                  const isSelected =
                    selectedDevice?.brand === device.brand &&
                    selectedDevice?.name === device.name

                  return (
                    <li key={`${device.brand}-${device.name}`}>
                      <button
                        type="button"
                        onClick={() => handleSelectDevice(device)}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-[#1a1a1a] ${
                          isSelected
                            ? 'border-l-2 border-l-[#00D4FF] bg-[#1a1a1a]'
                            : 'border-l-2 border-l-transparent'
                        }`}
                      >
                        <span className="text-white">
                          {getDeviceDisplayName(device)}
                        </span>
                        <span className="ml-3 shrink-0 text-zinc-500">
                          {device.dpi} DPI
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {isDropdownVisible && filteredDevices.length === 0 && (
              <p className="absolute z-20 mt-1 w-full rounded-lg border border-[#333] bg-[#111111] px-4 py-3 text-sm text-zinc-400">
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
            className="mt-4 cursor-pointer text-sm text-[#00D4FF] hover:underline"
          >
            📱 My phone isn&apos;t listed — enter DPI manually
          </button>
        )}

        {manualOnly && (
          <div className="mt-4">
            <label
              htmlFor="manual-dpi-only"
              className="mb-2 block text-sm font-medium text-white"
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
              className="w-full rounded-lg border border-[#333] bg-[#111111] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
            />
            <button
              type="button"
              onClick={() => {
                setManualOnly(false)
                setManualDPI('')
              }}
              className="mt-2 text-xs text-zinc-500 hover:text-white"
            >
              ← Back to device search
            </button>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-brand-border bg-brand-card p-4 sm:p-5">
        <label className="mb-3 block text-sm font-semibold text-white">
          Your Playstyle
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PROFILE_IDS.map((profileId) => {
            const profile = PLAYER_PROFILES[profileId]
            const isSelected = selectedPlaystyle === profileId

            return (
              <button
                key={profileId}
                type="button"
                onClick={() => setSelectedPlaystyle(profileId)}
                className={`rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-brand-yellow text-brand-yellow'
                    : 'border-brand-border text-white hover:border-zinc-600'
                }`}
              >
                <span className="text-2xl" role="img" aria-hidden>
                  {profile.icon}
                </span>
                <p className="mt-2 text-sm font-semibold">{profile.name}</p>
                <p
                  className={`mt-1 text-xs leading-relaxed ${
                    isSelected ? 'text-brand-yellow/80' : 'text-zinc-400'
                  }`}
                >
                  {profile.description}
                </p>
                <p className="mt-2 text-xs text-[#00D4FF]">
                  Like: {profile.proPlayer}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <OptionCards
        label="Experience Level"
        options={EXPERIENCE_OPTIONS}
        value={experience}
        onChange={setExperience}
      />

      <OptionCards
        label="Preferred Range"
        options={RANGE_OPTIONS}
        value={preferredRange}
        onChange={setPreferredRange}
      />

      <OptionCards
        label="Scope Usage"
        options={SCOPE_OPTIONS}
        value={scopes}
        onChange={setScopes}
      />

      <div>
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-xl bg-brand-yellow py-4 text-base font-bold text-black transition hover:bg-yellow-400"
        >
          Calculate My Sensitivity 🎯
        </button>

        {showError && (
          <p className="mt-3 text-center text-sm text-red-500">
            ⚠️ Please select your phone or enter your DPI to continue
          </p>
        )}
      </div>
    </div>
  )
}
