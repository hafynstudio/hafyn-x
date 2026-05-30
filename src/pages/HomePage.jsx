import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Instant Results',
    description:
      'Get calibrated sensitivity values for every scope in seconds — no guesswork, no spreadsheets.',
    icon: '⚡',
  },
  {
    title: '50+ Devices Supported',
    description:
      'Search popular phones from Samsung, Xiaomi, Infinix, OPPO, Vivo, and Tecno across South Asia & MENA.',
    icon: '📱',
  },
  {
    title: 'Pro Player Presets',
    description:
      'Playstyle-based presets tuned for aggressive rushers, balanced ranked players, and long-range specialists.',
    icon: '🎯',
  },
]

const stats = [
  { value: '2,000+', label: 'Players Helped' },
  { value: '50+', label: 'Devices' },
  { value: 'Free', label: 'Forever' },
]

export default function HomePage() {
  return (
    <div className="bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:pb-20 sm:pt-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.07)_0%,_transparent_55%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#F59E0B] sm:text-sm">
            HAFYN X
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Master Your Aim in{' '}
            <span className="text-[#F59E0B]">Free Fire</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
            Find your perfect sensitivity settings in seconds — free
          </p>
          <Link
            to="/calculator"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-8 py-3.5 text-sm font-bold text-black sm:text-base"
          >
            Calculate My Sensitivity
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-800 bg-zinc-900/40 px-4 py-5">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-0 sm:divide-x sm:divide-zinc-800">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 px-6 text-center sm:text-left"
            >
              <span className="text-sm font-bold text-[#F59E0B] sm:text-base">
                {stat.value}
              </span>
              <span className="text-sm text-zinc-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center sm:mb-12">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Built for competitive players
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Everything you need to dial in your settings before your next ranked match.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-800 p-6"
              >
                <span className="text-2xl" role="img" aria-hidden>
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
