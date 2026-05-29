import { useEffect, useMemo, useRef, useState } from 'react'
import { DEVICES, PLAYSTYLES } from '../../utils/deviceList'
import { calculateSensitivity } from '../../lib/sensitivityEngine'

function getDeviceDisplayName(device) {
  return `${device.brand} ${device.name}`
}

export default function SensitivityForm({ onCalculate }) {
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [manualDPI, setManualDPI] = useState('')
  const [isManualDPIOpen, setIsManualDPIOpen] = useState(false)
  const [selectedPlaystyle, setSelectedPlaystyle] = useState('balanced')
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

  function resolveDPI() {
    const parsedManualDPI = Number(manualDPI)

    if (isManualDPIOpen && manualDPI && parsedManualDPI >= 100 && parsedManualDPI <= 1200) {
      return parsedManualDPI
    }

    if (selectedDevice) {
      return selectedDevice.dpi
    }

    return null
  }

  function handleCalculate() {
    const dpi = resolveDPI()

    if (!dpi) {
      setShowError(true)
      return
    }

    setShowError(false)

    const result = calculateSensitivity({
      deviceDPI: dpi,
      playstyle: selectedPlaystyle,
    })

    onCalculate(result)
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
              className="w-full rounded-lg border border-[#333] bg-[#111111] py-3 pl-4 pr-10 text-white placeholder:text-zinc-500 focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
            />

            {(selectedDevice || searchQuery) && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 transition hover:text-white"
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

        {/* Manual DPI Mode */}
        <button
          type="button"
          onClick={() => setIsManualDPIOpen((prev) => !prev)}
          className="mt-4 cursor-pointer text-sm text-[#00D4FF] transition hover:underline"
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
              placeholder="e.g. 400"
              className="w-full rounded-lg border border-[#333] bg-[#111111] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Common DPI values: Budget phones 240-400 | Mid-range 400-800 |
              Flagship 800-1200
            </p>
          </div>
        )}
      </section>

      {/* Section 2 — Playstyle */}
      <section className="rounded-xl border border-brand-border bg-brand-card p-4 sm:p-5">
        <label className="mb-3 block text-sm font-semibold text-white">
          Your Playstyle
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PLAYSTYLES.map((style) => {
            const isSelected = selectedPlaystyle === style.id
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelectedPlaystyle(style.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-brand-yellow text-brand-yellow'
                    : 'border-brand-border text-white hover:border-zinc-600'
                }`}
              >
                <span className="text-2xl" role="img" aria-hidden>
                  {style.icon}
                </span>
                <p className="mt-2 text-sm font-semibold">{style.name}</p>
                <p
                  className={`mt-1 text-xs leading-relaxed ${
                    isSelected ? 'text-brand-yellow/80' : 'text-zinc-400'
                  }`}
                >
                  {style.description}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Calculate */}
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
