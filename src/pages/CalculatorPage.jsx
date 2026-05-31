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
    <div className="min-h-screen bg-brand-dark px-4 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-[600px]">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Sensitivity Calculator
          </h1>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Find your perfect settings in seconds
          </p>
        </header>

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
