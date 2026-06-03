import { useEffect, useRef, useState } from 'react'
import { getAISensitivity } from '../lib/groqAI'
import SensitivityForm from '../components/calculator/SensitivityForm'
import SensitivityResult from '../components/calculator/SensitivityResult'
import CalculatingScreen, {
  runCalculatingAnimation,
} from '../components/calculator/CalculatingScreen'

// NOTE: sensitivityEngine.js is intentionally NOT imported here.
// AI is the only source of sensitivity values. The formula engine
// is reached only as a fallback from inside groqAI.js.

const INITIAL_CALC_STATE = {
  stepIndex: 0,
  progress: 0,
  title: 'HAFYN X is analyzing your device profile...',
  subtitle: 'Reading DPI, device type, and hardware profile',
  isFinalizing: false,
}

const FINALIZING_STATE = {
  stepIndex: 5,
  progress: 100,
  title: 'HAFYN X is finalizing your settings...',
  subtitle: 'Waiting for HAFYN X AI to finish your personalized settings',
  isFinalizing: true,
}

export default function CalculatorPage() {
  const [result, setResult] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calcState, setCalcState] = useState(INITIAL_CALC_STATE)
  const resultRef = useRef(null)

  useEffect(() => {
    if (result && !isCalculating && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result, isCalculating])

  async function handleCalculateRequest(params) {
    setIsCalculating(true)
    setResult(null)
    setCalcState(INITIAL_CALC_STATE)

    // Pass exactly the keys the AI endpoint expects.
    // SensitivityForm already produces them with the right names,
    // but we re-shape here to make the contract explicit.
    const aiPayload = {
      deviceName: params.deviceName || 'Custom Device',
      deviceDPI: Number(params.deviceDPI) || 0,
      deviceType: params.deviceType || inferDeviceType(params.deviceDPI),
      playstyle: params.playstyle,
      experience: params.experience,
      preferredRange: params.preferredRange,
      scopes: params.scopes,
    }

    // Kick off the AI request immediately so it runs in parallel
    // with the calculating animation.
    let aiResult = null
    let aiDone = false
    let aiError = null

    const aiTask = getAISensitivity(aiPayload)
      .then((r) => {
        aiResult = r
        aiDone = true
        return r
      })
      .catch((e) => {
        aiError = e
        aiDone = true
        return null
      })

    // Run the animated progress UI.
    await runCalculatingAnimation((update) => {
      setCalcState(update)
    })

    // If the AI hasn't responded yet, show the finalizing screen
    // and wait for it. getAISensitivity already catches its own
    // failures and returns the smart fallback, so this await
    // will almost always resolve with a valid result object.
    if (!aiDone) {
      setCalcState(FINALIZING_STATE)
      await aiTask
    }

    if (!aiResult) {
      // Extremely defensive: getAISensitivity catches its own errors
      // and returns a fallback, so we should never reach here. If we
      // do, surface a clear message instead of a blank screen.
      console.error('Unexpected: no AI result and no fallback.', aiError)
      setResult({
        general: 100,
        redDot: 95,
        x2Scope: 85,
        x4Scope: 75,
        sniper: 55,
        freeLook: 120,
        closestPro: 'Pro Player Average',
        analysis:
          'We could not reach HAFYN X AI right now. These are safe default values you can fine-tune.',
        tips: 'Try again in a few seconds for a fully personalized result.',
      })
    } else {
      setResult(aiResult)
    }

    setIsCalculating(false)
  }

  return (
    <div className="min-h-screen bg-black px-4 pb-12">
      <div className="mx-auto w-full max-w-[640px]">
        <div style={{ textAlign: 'center', padding: '40px 0 20px' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(0,246,255,0.05)',
              border: '1px solid rgba(0,246,255,0.2)',
              borderRadius: '100px',
              padding: '6px 20px',
              fontSize: '12px',
              color: '#00F6FF',
              letterSpacing: '0.15em',
              marginBottom: '16px',
            }}
          >
            ⚡ AI-POWERED SENSITIVITY ENGINE
          </div>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 800,
              color: 'white',
              marginBottom: '8px',
            }}
          >
            Find Your Perfect
            <span
              style={{
                background: 'linear-gradient(135deg, #00F6FF, #0044FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {' '}
              Sensitivity
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Analyzed from world&apos;s best Free Fire players
          </p>
        </div>

        {!isCalculating && (
          <SensitivityForm onCalculateRequest={handleCalculateRequest} />
        )}

        {isCalculating && (
          <div className="mt-2">
            <CalculatingScreen {...calcState} />
          </div>
        )}

        {result && !isCalculating && (
          <div ref={resultRef} className="mt-10 scroll-mt-6">
            <SensitivityResult result={result} />
          </div>
        )}
      </div>
    </div>
  )
}

// Lightweight inference if the form ever forwards an unknown
// deviceType (e.g. manual DPI entry without a selected device).
function inferDeviceType(dpi) {
  const n = Number(dpi) || 0
  if (n >= 800) return 'android_flagship'
  if (n >= 500) return 'android_gaming'
  if (n >= 400) return 'android_mid'
  return 'android_budget'
}
