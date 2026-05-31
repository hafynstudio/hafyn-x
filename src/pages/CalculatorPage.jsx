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
  title: '🔍 Analyzing your device profile...',
  subtitle: 'Reading DPI, device type, and hardware profile',
  isFinalizing: false,
}

const FINALIZING_STATE = {
  stepIndex: 5,
  progress: 100,
  title: '⏳ Finalizing...',
  subtitle: 'Waiting for AI to finish your personalized settings',
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

    const aiTask = getAISensitivity(params)
    let aiResult = null
    aiTask.then((r) => {
      aiResult = r
    })

    await runCalculatingAnimation((update) => {
      setCalcState(update)
    })

    if (!aiResult) {
      setCalcState(FINALIZING_STATE)
      aiResult = await aiTask
    }

    setResult(aiResult)
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
