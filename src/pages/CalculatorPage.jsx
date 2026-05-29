import { useEffect, useRef, useState } from 'react'
import SensitivityForm from '../components/calculator/SensitivityForm'
import SensitivityResult from '../components/calculator/SensitivityResult'

export default function CalculatorPage() {
  const [result, setResult] = useState(null)
  const resultRef = useRef(null)

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

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

        <SensitivityForm onCalculate={setResult} />

        {result && (
          <div ref={resultRef} className="mt-10 scroll-mt-6">
            <SensitivityResult result={result} />
          </div>
        )}
      </div>
    </div>
  )
}
