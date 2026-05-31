import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { DEVICES } from '../../utils/deviceList'
import { getAISensitivity } from '../../lib/groqAI'
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

function OptionCards({ label, options, value, onChange }) {
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
              onClick={() => onChange(option.id)}
              className={`rounded-xl border p-3 text-left transition ${
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

export default function SensitivityForm({ onCalculate, onLoadingChange }) {
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [manualDPI, setManualDPI] = useState('')
  const [isManualDPIOpen, setIsManualDPIOpen] = useState(false)
  const [selectedPlaystyle, setSelectedPlaystyle] = useState('balanced_competitive')
  const [experience, setExperience] = useState('intermediate')
  const [preferredRange, setPreferredRange] = useState('mid_range')
  const [scopes, setScopes] = useState('sometimes')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
    setSearchQuery(getDeviceDisplayName(device))
    setShowDropdown(false)
    setIsInputFocused(false)
    clearError()
  }

  function handleClearSelection() {
    setSelectedDevice(null)
    setSearchQuery('')
    setShowDropdown(false)
    clearError()
  }

  function resolveDeviceInput() {
    const parsedManualDPI = Number(manualDPI)

    if (
      isManualDPIOpen &&
      manualDPI &&
      parsedManualDPI >= 100 &&
      parsedManualDPI <= 1200
    ) {
      return {
        dpi: parsedManualDPI,
        deviceType: null,
        deviceName: `Manual Entry (${parsedManualDPI} DPI)`,
      }
    }

    if (selectedDevice) {
      return {
        dpi: selectedDevice.dpi,
        deviceType: selectedDevice.deviceType,
        deviceName: getDeviceDisplayName(selectedDevice),
      }
    }

    return null
  }

  async function handleCalculate() {
    const deviceInput = resolveDeviceInput()

    if (!deviceInput) {
      setShowError(true)
      return
    }

    setShowError(false)
    setIsLoading(true)
    onLoadingChange?.(true)

    try {
      const result = await getAISensitivity({
        deviceName: deviceInput.deviceName,
        deviceDPI: deviceInput.dpi,
        deviceType: deviceInput.deviceType ?? 'unknown',
        playstyle: selectedPlaystyle,
        experience,
        preferredRange,
        scopes,
      })

      onCalculate(result)
    } catch {
      setShowError(true)
    } finally {
      setIsLoading(false)
      onLoadingChange?.(false)
    }
  }

  const isDropdownVisible =
    isInputFocused && searchQuery.length > 0 && showDropdown

  return (
    <div className="space-y-6">
      {/* Section 1 — Device */}
      <section className="rounded-xl border border-brand-border bg-brand-card p-4 sm:p-5">
        <label className="mb-3 block text-sm font-semibold text-white">
          Your Phone Model
        </label>

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
              disabled={isLoading}
              className="w-full rounded-lg border border-[#333] bg-[#111111] py-3 pl-4 pr-10 text-white placeholder:text-zinc-500 focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF] disabled:opacity-60"
            />

            {(selectedDevice || searchQuery) && (
              <button
                type="button"
                onClick={handleClearSelection}
                disabled={isLoading}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-white disabled:opacity-50"
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

        <button
          type="button"
          onClick={() => setIsManualDPIOpen((prev) => !prev)}
          disabled={isLoading}
          className="mt-4 cursor-pointer text-sm text-[#00D4FF] hover:underline disabled:opacity-50"
        >
          📱 My phone isn&apos;t listed — enter DPI manually
        </button>

        {isManualDPIOpen && (
          <div className="mt-4">
            <label
              htmlFor="manual-dpi"
              className="mb-2 block text-sm font-medium text-white"
            >
              Enter your phone&apos;s DPI
            </label>
            <input
              id="manual-dpi"
              type="number"
              min="100"
              max="1200"
              value={manualDPI}
              onChange={(e) => {
                setManualDPI(e.target.value)
                clearError()
              }}
              disabled={isLoading}
              placeholder="e.g. 400"
              className="w-full rounded-lg border border-[#333] bg-[#111111] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF] disabled:opacity-60"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Common DPI values: Budget phones 240-400 | Mid-range 400-800 |
              Flagship 800-1200
            </p>
          </div>
        )}
      </section>

      {/* Section 2 — Pro player profiles */}
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
                disabled={isLoading}
                className={`rounded-xl border p-4 text-left transition disabled:opacity-60 ${
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

      {/* Calculate */}
      <div>
        <button
          type="button"
          onClick={handleCalculate}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-yellow py-4 text-base font-bold text-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              🤖 AI Analyzing...
            </>
          ) : (
            'Calculate My Sensitivity 🎯'
          )}
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
