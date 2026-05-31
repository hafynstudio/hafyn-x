import { useEffect, useState } from 'react'

const STEPS = [
  {
    title: '🔍 Analyzing your device profile...',
    subtitle: 'Reading DPI, device type, and hardware profile',
    progress: 20,
    duration: 2000,
  },
  {
    title: '📊 Calculating optimal sensitivity range...',
    subtitle: 'Finding your ideal sensitivity range based on device',
    progress: 40,
    duration: 2000,
  },
  {
    title: '🎯 Matching with pro player database...',
    subtitle: 'Comparing with White FF, ZeroX, SadxFF and more',
    progress: 60,
    duration: 2000,
  },
  {
    title: '🤖 AI is generating your settings...',
    subtitle: 'Groq AI analyzing your playstyle preferences',
    progress: 80,
    duration: 2000,
  },
  {
    title: '⚡ Applying device-specific optimizations...',
    subtitle: 'Fine-tuning values for maximum accuracy',
    progress: 95,
    duration: 2000,
  },
  {
    title: '✅ Your perfect sensitivity is ready!',
    subtitle: 'Settings optimized for your exact setup',
    progress: 100,
    duration: 2000,
  },
]

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.duration, 0)

export function runCalculatingAnimation(onUpdate) {
  return new Promise((resolve) => {
    let elapsed = 0
    let stepIndex = 0

    onUpdate({
      stepIndex: 0,
      progress: 0,
      title: STEPS[0].title,
      subtitle: STEPS[0].subtitle,
      isFinalizing: false,
    })

    const interval = setInterval(() => {
      elapsed += 50
      const currentStep = STEPS[stepIndex]
      const stepStart = STEPS.slice(0, stepIndex).reduce(
        (s, st) => s + st.duration,
        0,
      )
      const stepProgress = Math.min(
        1,
        (elapsed - stepStart) / currentStep.duration,
      )
      const prevProgress = stepIndex > 0 ? STEPS[stepIndex - 1].progress : 0
      const progress =
        prevProgress +
        (currentStep.progress - prevProgress) * stepProgress

      onUpdate({
        stepIndex,
        progress: Math.min(100, progress),
        title: currentStep.title,
        subtitle: currentStep.subtitle,
        isFinalizing: false,
      })

      if (elapsed >= stepStart + currentStep.duration) {
        if (stepIndex < STEPS.length - 1) {
          stepIndex++
        } else if (elapsed >= TOTAL_DURATION) {
          clearInterval(interval)
          onUpdate({
            stepIndex: STEPS.length - 1,
            progress: 100,
            title: STEPS[STEPS.length - 1].title,
            subtitle: STEPS[STEPS.length - 1].subtitle,
            isFinalizing: false,
          })
          resolve()
        }
      }
    }, 50)
  })
}

export default function CalculatingScreen({
  stepIndex,
  progress,
  title,
  subtitle,
  isFinalizing,
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [stepIndex, title])

  return (
    <div className="rounded-2xl border border-brand-border bg-[#0a0a0a] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-md text-center">
        <p className="font-logo text-sm font-bold tracking-widest">
          <span className="text-white">HAFYN</span>
          <span className="text-[#00D4FF]"> X</span>
        </p>

        <div
          className={`mt-8 transition-opacity duration-500 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="flex items-center justify-center gap-2 text-lg font-semibold text-white sm:text-xl">
            {isFinalizing ? '⏳ Finalizing...' : title}
            {!isFinalizing && (
              <span className="inline-flex">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse [animation-delay:150ms]">.</span>
                <span className="animate-pulse [animation-delay:300ms]">.</span>
              </span>
            )}
          </h2>
          <p className="mt-3 text-sm text-zinc-500">
            {isFinalizing
              ? 'Waiting for AI to finish your personalized settings'
              : subtitle}
          </p>
        </div>

        <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#00A3CC] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-zinc-600">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}
