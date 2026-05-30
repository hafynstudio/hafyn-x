import { Link } from 'react-router-dom'

const freeFeatures = ['Calculator', 'Copy settings', '1 saved config']

const proFeatures = [
  'Unlimited saves',
  'Stats tracker',
  'Export as image',
  'Pro presets',
]

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-[#F59E0B]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#0a0a0a] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 text-center sm:mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#F59E0B]">
            Pricing
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Choose your plan
          </h1>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Start free. Upgrade when you&apos;re ready to go pro.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {/* Free */}
          <article className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-800 p-6 sm:p-8">
            <div>
              <h2 className="text-lg font-semibold text-white">Free</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Everything you need to get started
              </p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-zinc-500"> forever</span>
              </p>
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {freeFeatures.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/calculator"
              className="mt-8 block rounded-xl border border-zinc-700 py-3 text-center text-sm font-semibold text-white"
            >
              Start Free
            </Link>
          </article>

          {/* Pro */}
          <article className="relative flex flex-col rounded-2xl border-2 border-[#F59E0B] bg-zinc-800 p-6 sm:p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-bold text-black">
                Most Popular
              </span>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#F59E0B]">Pro</h2>
              <p className="mt-1 text-sm text-zinc-400">
                For serious ranked grinders
              </p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-white">$2.99</span>
                <span className="text-zinc-500">/month</span>
              </p>
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {proFeatures.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>

            <button
              type="button"
              disabled
              className="mt-8 w-full cursor-not-allowed rounded-xl bg-zinc-700 py-3 text-sm font-semibold text-zinc-500"
            >
              Coming Soon
            </button>
          </article>
        </div>
      </div>
    </div>
  )
}
