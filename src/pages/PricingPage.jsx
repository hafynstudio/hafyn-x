import { Link } from 'react-router-dom'

const FREE_FEATURES = [
  'AI Sensitivity Calculator',
  '200+ Device Support',
  '6 Pro Player Profiles',
  'Copy Settings to Clipboard',
  '3 AI Coach Messages (per 48 hours)',
  '1 Saved Configuration',
]

const PRO_FEATURES = [
  {
    title: 'Everything in Free, plus:',
    description: null,
    isIntro: true,
  },
  {
    title: '♾️ Unlimited AI Coach Conversations',
    description: null,
  },
  {
    title: '🏆 Exclusive Pro Player Sensitivity Packs',
    description:
      "Premium paid settings from world's best players — available only here, free elsewhere costs money",
  },
  {
    title: '📊 In-Game Player Stats Tracker',
    description: 'Track your K/D ratio, win rate, match history',
  },
  {
    title: '🎯 Player Age & Profile Analysis',
    description:
      'See how long a player has been playing, their progression over time',
  },
  {
    title: '💾 Unlimited Saved Configurations',
    description:
      'Save unlimited sensitivity profiles, switch instantly',
  },
  {
    title: '⚡ Priority AI Processing',
    description: 'Faster calculations, no queue',
  },
  {
    title: '🔓 Early Access to New Features',
    description: 'Get new tools before anyone else',
  },
]

const FAQ = [
  {
    q: 'Is there a free trial?',
    a: 'Yes! Our free tier gives you full calculator access forever.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel with one click, no questions asked.',
  },
  {
    q: 'Do you accept payments from Pakistan/India?',
    a: 'Yes! We use Lemon Squeezy which accepts all major cards and payment methods from South Asia and MENA.',
  },
]

function CyanCheck() {
  return (
    <span className="mt-0.5 shrink-0 text-[#00F6FF]" aria-hidden>
      ✓
    </span>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-black px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#00F6FF]">
            Pricing
          </p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-[#64748b]">
            Start free forever. Upgrade to Pro when you&apos;re ready to dominate
            every match.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Free */}
          <article
            className="flex flex-col rounded-[20px] p-8"
            style={{
              background: 'rgba(10, 11, 20, 0.8)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div>
              <h2 className="text-2xl font-bold text-white">Free</h2>
              <p className="mt-1 text-sm text-[#64748b]">
                Perfect for getting started
              </p>
              <p className="mt-6">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-[#64748b]"> forever</span>
              </p>
            </div>

            <ul className="mt-8 flex-1 space-y-4">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm">
                  <CyanCheck />
                  <span className="text-[#94A3B8]">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/calculator"
              className="mt-8 block rounded-xl border border-white/20 py-3.5 text-center text-sm font-bold text-white transition-all duration-300 hover:border-[#00F6FF] hover:text-[#00F6FF]"
            >
              Start Free
            </Link>
          </article>

          {/* Pro */}
          <article className="relative flex flex-col">
            <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
              <span
                className="rounded-full px-4 py-1 text-xs font-bold text-black"
                style={{
                  background: 'linear-gradient(135deg, #00F6FF, #0044FF)',
                }}
              >
                MOST POPULAR
              </span>
            </div>

            <div
              className="flex h-full flex-col rounded-[20px] p-8 pt-10"
              style={{
                background: 'rgba(0,246,255,0.03)',
                border: '2px solid rgba(0,246,255,0.4)',
                boxShadow: '0 0 40px rgba(0,246,255,0.1)',
              }}
            >
              <div>
                <h2 className="text-2xl font-bold text-[#00F6FF]">Pro</h2>
                <p className="mt-1 text-sm text-[#64748b]">
                  For serious competitive players
                </p>

                <div className="mt-6">
                  <div>
                    <span
                      style={{
                        fontSize: 48,
                        fontWeight: 900,
                        color: 'white',
                      }}
                    >
                      $1.99
                    </span>
                    <span style={{ color: '#64748b' }}>/month</span>
                  </div>
                  <div
                    style={{ color: '#00F6FF', fontSize: 14, marginTop: 8 }}
                  >
                    Cancel anytime • No questions asked
                  </div>
                </div>
              </div>

              <ul className="mt-8 flex-1 space-y-4">
                {PRO_FEATURES.map((feature) => (
                  <li
                    key={feature.title}
                    className={`flex gap-3 ${feature.isIntro ? 'mb-1' : ''}`}
                  >
                    {!feature.isIntro && <CyanCheck />}
                    <div className={feature.isIntro ? 'w-full' : ''}>
                      <p
                        className={`text-sm ${
                          feature.isIntro
                            ? 'font-semibold text-white'
                            : 'font-medium text-[#94A3B8]'
                        }`}
                      >
                        {feature.title}
                      </p>
                      {feature.description && (
                        <p className="mt-1 text-xs leading-relaxed text-[#64748b]">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-8 w-full rounded-xl py-3.5 text-sm font-bold text-black transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_32px_rgba(0,246,255,0.45)]"
                style={{
                  background:
                    'linear-gradient(135deg, #00F6FF 0%, #0044FF 100%)',
                  boxShadow: '0 0 20px rgba(0,246,255,0.25)',
                }}
              >
                Go Pro Now →
              </button>
              <p className="mt-3 text-center text-xs text-[#64748b]">
                Payments secured by Lemon Squeezy
              </p>
            </div>
          </article>
        </div>

        {/* FAQ */}
        <section className="mt-16 sm:mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-2xl space-y-4">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-white/[0.06] p-6"
                style={{ background: 'rgba(10, 11, 20, 0.6)' }}
              >
                <h3 className="font-semibold text-white">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
