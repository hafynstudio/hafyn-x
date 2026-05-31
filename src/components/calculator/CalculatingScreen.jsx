import { useEffect, useState } from 'react'
import hafynLogo from '../../assets/hafynx-logo.png'

const STEPS = [
  {
    title: 'HAFYN X is analyzing your device profile...',
    subtitle: 'Reading DPI, device type, and hardware profile',
    progress: 20,
    duration: 2000,
  },
  {
    title: 'HAFYN X is calculating optimal sensitivity range...',
    subtitle: 'Finding your ideal sensitivity range based on device',
    progress: 40,
    duration: 2000,
  },
  {
    title: 'HAFYN X is matching with pro player database...',
    subtitle: 'Comparing with White FF, ZeroX, SadxFF and more',
    progress: 60,
    duration: 2000,
  },
  {
    title: 'HAFYN X AI is generating your settings...',
    subtitle: 'Personalizing values for your playstyle',
    progress: 80,
    duration: 2000,
  },
  {
    title: 'HAFYN X is applying device optimizations...',
    subtitle: 'Fine-tuning values for maximum accuracy',
    progress: 95,
    duration: 2000,
  },
  {
    title: 'Your perfect sensitivity is ready!',
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
    <div className="rounded-2xl border border-white/[0.06] bg-black/80 px-4 py-12 backdrop-blur-sm sm:py-16">
      <div className="mx-auto max-w-md text-center">
        <img
          src={hafynLogo}
          alt="HAFYN X"
          style={{
            width: 60,
            height: 60,
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 20px #00F6FF)',
            marginBottom: 16,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
        <p
          style={{
            fontWeight: 800,
            fontSize: '18px',
            letterSpacing: '0.15em',
            color: 'white',
          }}
        >
          HAFYN
          <span
            className="hafyn-logo-x"
            style={{
              color: '#00F6FF',
              textShadow: '0 0 20px #00F6FF, 0 0 40px #00F6FF',
              animation: 'hafynPulse 2s ease-in-out infinite',
            }}
          >
            {' '}
            X
          </span>
        </p>

        <div
          className={`mt-8 transition-opacity duration-500 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            {isFinalizing ? 'HAFYN X is finalizing your settings...' : title}
            {!isFinalizing && stepIndex < STEPS.length - 1 && (
              <span className="inline-flex">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse [animation-delay:150ms]">.</span>
                <span className="animate-pulse [animation-delay:300ms]">.</span>
              </span>
            )}
          </h2>
          <p className="mt-3 text-sm text-[#64748b]">
            {isFinalizing
              ? 'Waiting for HAFYN X AI to finish your personalized settings'
              : subtitle}
          </p>
        </div>

        <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #00F6FF, #0044FF)',
              boxShadow: '0 0 10px #00F6FF, 0 0 20px #00F6FF',
            }}
          />
        </div>
        <p className="mt-2 text-xs text-[#64748b]">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}
