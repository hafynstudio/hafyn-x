import { useEffect, useRef, useState } from 'react'
import { getAISensitivity } from '../lib/groqAI'
import SensitivityForm from '../components/calculator/SensitivityForm'
import SensitivityResult from '../components/calculator/SensitivityResult'
import CalculatingScreen, {
  runCalculatingAnimation,
} from '../components/calculator/CalculatingScreen'

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
  const [lastParams, setLastParams] = useState(null)
  const resultRef = useRef(null)

  useEffect(() => {
    if (result && !isCalculating && resultRef.current) {
      resultRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }, [result, isCalculating])

  async function handleCalculateRequest(params) {
    setIsCalculating(true)
    setResult(null)
    setCalcState(INITIAL_CALC_STATE)
    setLastParams(params)

    const aiPayload = {
      deviceName: params.deviceName || 'Custom Device',
      deviceDPI: Number(params.deviceDPI) || 0,
      deviceType: params.deviceType || 
        inferDeviceType(params.deviceDPI),
      playstyle: params.playstyle,
      experience: params.experience,
      preferredRange: params.preferredRange,
      scopes: params.scopes,
    }

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

    await runCalculatingAnimation((update) => {
      setCalcState(update)
    })

    if (!aiDone) {
      setCalcState(FINALIZING_STATE)
      await aiTask
    }

    if (!aiResult) {
      console.error('No AI result:', aiError)
      const fallback = {
        general: 100,
        redDot: 95,
        x2Scope: 85,
        x4Scope: 75,
        sniper: 55,
        freeLook: 120,
        closestPro: 'Pro Player Average',
        analysis: 'Could not reach HAFYN X AI. Safe default values.',
        tips: 'Try again for fully personalized result.',
      }
      setResult(fallback)
      saveToSession(fallback, aiPayload)
    } else {
      setResult(aiResult)
      saveToSession(aiResult, aiPayload)
    }

    setIsCalculating(false)
  }

  // Save result to sessionStorage so CoachChat can use it
  function saveToSession(resultData, params) {
    try {
      const toStore = {
        general:    resultData.general,
        redDot:     resultData.redDot,
        x2Scope:    resultData.x2Scope,
        x4Scope:    resultData.x4Scope,
        sniper:     resultData.sniper,
        freeLook:   resultData.freeLook,
        closestPro: resultData.closestPro || '',
        deviceName: params.deviceName || 'Custom Device',
        deviceDPI:  params.deviceDPI || 0,
        playstyle:  params.playstyle || '',
      }
      sessionStorage.setItem(
        'hafynx_last_result',
        JSON.stringify(toStore)
      )
    } catch (e) {
      console.error('Session save error:', e)
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 pb-12">
      <div className="mx-auto w-full max-w-[640px]">
        
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '40px 0 20px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(0,246,255,0.05)',
            border: '1px solid rgba(0,246,255,0.2)',
            borderRadius: '100px',
            padding: '6px 20px',
            fontSize: '12px',
            color: '#00F6FF',
            letterSpacing: '0.15em',
            marginBottom: '16px',
          }}>
            ⚡ AI-POWERED SENSITIVITY ENGINE
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800,
            color: 'white',
            marginBottom: '8px',
          }}>
            Find Your Perfect
            <span style={{
              background: 'linear-gradient(135deg, #00F6FF, #0044FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {' '}Sensitivity
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Analyzed from world's best Free Fire players
          </p>
        </div>

        {/* Form */}
        {!isCalculating && (
          <SensitivityForm 
            onCalculateRequest={handleCalculateRequest} 
          />
        )}

        {/* Calculating Animation */}
        {isCalculating && (
          <div className="mt-2">
            <CalculatingScreen {...calcState} />
          </div>
        )}

        {/* Results */}
        {result && !isCalculating && (
          <div ref={resultRef} className="mt-10 scroll-mt-6">
            <SensitivityResult result={result} />
          </div>
        )}

      </div>
    </div>
  )
}

function inferDeviceType(dpi) {
  const n = Number(dpi) || 0
  if (n >= 800) return 'android_flagship'
  if (n >= 500) return 'android_gaming'
  if (n >= 400) return 'android_mid'
  return 'android_budget'
}