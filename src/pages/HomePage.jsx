import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import HafynLogo from '../components/brand/HafynLogo'
import costaLogo from '../assets/costa-logo.png'

const PRO_PLAYERS = [
  {
    name: 'White FF',
    tag: 'MENA • Freestyle',
    stat: 'General: 185',
    description: 'Ultra aggressive MENA freestyle legend',
    icon: '⚡',
  },
  {
    name: 'ZeroX FF',
    tag: 'Nepal • Freestyle',
    stat: '4x Scope: 185',
    description: "Nepal's most aggressive and best freestyle player",
    icon: '🔭',
  },
  {
    name: 'SadxFF',
    tag: 'Pakistan • Precision',
    stat: 'Red Dot: 171',
    description: "Pakistan's best freestyle headshot artist",
    icon: '🎯',
  },
  {
    name: '4 Flag Gamer',
    tag: 'India • Speed',
    stat: 'General: 175',
    description: "India's fastest movement speed player",
    icon: '🚀',
  },
  {
    name: 'Tennyson FF',
    tag: 'Android • Hip Fire',
    stat: 'General: 200',
    description: 'Maximum hip fire destroyer',
    icon: '💥',
  },
]

const STEPS = [
  {
    num: '01',
    icon: '📱',
    title: 'Select Your Device',
    description:
      'Choose from 200+ phones including iPhone, Samsung, Xiaomi, OPPO, Vivo, Infinix, Tecno and more',
  },
  {
    num: '02',
    icon: '🎮',
    title: 'Choose Your Playstyle',
    description:
      'Select from 6 pro-verified styles — Freestyle, Hip Fire, Scope Rush, Precision, Competitive, or Beginner',
  },
  {
    num: '03',
    icon: '🤖',
    title: 'AI Generates Settings',
    description:
      'Our AI matches you with the closest pro player profile and generates personalized sensitivity values',
  },
]

const FEATURES = [
  {
    icon: '🤖',
    title: 'Real AI Analysis',
    description:
      'Groq-powered AI analyzes your device and playstyle to generate truly personalized settings',
  },
  {
    icon: '📱',
    title: '200+ Devices',
    description:
      'iPhone, Samsung, Xiaomi, OPPO, Vivo, Realme, Infinix, Tecno, ROG, RedMagic and more',
  },
  {
    icon: '🎯',
    title: 'Pro Player Profiles',
    description:
      'Settings based on real data from White FF, ZeroX, SadxFF, Tennyson and more legends',
  },
  {
    icon: '⚡',
    title: 'Instant Results',
    description:
      'Advanced 12-step AI calculation gives you complete sensitivity settings in seconds',
  },
  {
    icon: '📋',
    title: 'One-Click Copy',
    description:
      'Copy all your settings formatted perfectly. Paste directly into Free Fire settings',
  },
  {
    icon: '🔒',
    title: 'Save Your Configs (Pro)',
    description:
      'Save unlimited sensitivity profiles. Switch between setups instantly. Never lose your settings again',
  },
]

const TESTIMONIALS = [
  {
    text: 'Finally a calculator that actually works! My headshot rate went up after using HAFYN X. The AI settings matched my style perfectly.',
    name: 'Zaid_FF',
    tag: 'Pakistan • Aggressive Player',
  },
  {
    text: 'I was using wrong sensitivity for months. HAFYN X detected I was a scope rusher and gave me ZeroX-style settings. Game changer.',
    name: 'ProGamer_AK',
    tag: 'India • Scope Rush',
  },
  {
    text: 'The calculating animation is so satisfying. And the settings actually feel right. Best Free Fire tool in South Asia.',
    name: 'FF_Legend_Omar',
    tag: 'UAE • Freestyle',
  },
]

const MARQUEE_ROW_1 = [
  '🍎 Apple',
  'Samsung',
  'Xiaomi',
  'Redmi',
  'POCO',
  'Vivo',
  'OPPO',
  'Realme',
  'OnePlus',
  'Infinix',
  'Tecno',
  'iQOO',
  'ASUS ROG',
  'RedMagic',
  'Honor',
]

const MARQUEE_ROW_2 = [
  'Motorola',
  'Google Pixel',
  'Sony',
  'Nokia',
  'Huawei',
  'Lenovo Legion',
  'Black Shark',
  'Samsung M Series',
  'Redmi Note',
  'POCO F Series',
]

function GradientText({ children, className = '' }) {
  return (
    <span
      className={`bg-gradient-to-r from-[#00F6FF] to-[#0044FF] bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#00F6FF]">
      {children}
    </p>
  )
}

function MarqueeRow({ items, direction = 'left' }) {
  const doubled = [...items, ...items]
  const animation =
    direction === 'left' ? 'hafyn-marquee-left' : 'hafyn-marquee-right'

  return (
    <div className="relative overflow-hidden">
      <div className={`flex w-max gap-3 ${animation}`}>
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 rounded-full border border-[#222222] bg-[#111111] px-4 py-2 text-sm text-white"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="bg-black text-white">
      <style>{`
        @keyframes hafyn-marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes hafyn-marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .hafyn-marquee-left {
          animation: hafyn-marquee-left 40s linear infinite;
        }
        .hafyn-marquee-right {
          animation: hafyn-marquee-right 40s linear infinite;
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-black px-4 py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,246,255,0.06)_0%,_transparent_55%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex rounded-full border border-[#00F6FF]/40 bg-[#00F6FF]/5 px-4 py-1.5 shadow-[0_0_20px_rgba(0,246,255,0.15)]">
            <span className="text-sm font-medium text-[#00F6FF]">
              ⚡ Free Fire&apos;s #1 Sensitivity Calculator
            </span>
          </div>

          <h1 className="text-5xl font-bold tracking-wide md:text-7xl">
            <span className="block text-white">Master Your Aim.</span>
            <GradientText className="mt-2 block">
              Dominate Every Match.
            </GradientText>
          </h1>

          <p className="mx-auto mt-6 max-w-[600px] text-lg leading-relaxed text-[#94A3B8]">
            HAFYN X uses real pro player data from world&apos;s best Free Fire
            players to calculate your perfect sensitivity. 200+ devices
            supported. AI-powered. Free.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/calculator"
              className="w-full rounded-xl bg-gradient-to-r from-[#00F6FF] to-[#0044FF] px-8 py-4 text-center text-base font-bold text-black transition-all duration-300 hover:shadow-[0_0_32px_rgba(0,246,255,0.45)] sm:w-auto"
            >
              Calculate My Sensitivity →
            </Link>
            <Link
              to="/pricing"
              className="w-full rounded-xl border border-[#333333] bg-[#111111] px-8 py-4 text-center text-base font-semibold text-white transition-all duration-300 hover:border-[#444444] sm:w-auto"
            >
              View Pricing
            </Link>
          </div>

          <p className="mt-8 text-sm text-[#94A3B8]">
            200+ Devices <span className="text-[#333]">•</span> Real Pro Data{' '}
            <span className="text-[#333]">•</span> AI Powered
          </p>
        </div>
      </section>

      {/* ── PRO PLAYERS ── */}
      <section className="bg-[#0a0a0a] px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>BUILT ON REAL DATA</SectionLabel>
          <h2 className="mt-4 text-center text-4xl font-bold md:text-6xl">
            <span className="text-white">Trained On World&apos;s Best</span>
            <br />
            <GradientText>Free Fire Players</GradientText>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[#94A3B8]">
            Our AI analyzed sensitivity data from top freestyle and competitive
            players worldwide
          </p>

          <div className="mt-12 flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
            {PRO_PLAYERS.map((player) => (
              <article
                key={player.name}
                className="min-w-[240px] shrink-0 rounded-xl border border-[#222222] bg-[#111111] p-5 transition-all duration-300 hover:border-[#00F6FF]/50 hover:shadow-[0_0_24px_rgba(0,246,255,0.12)] md:min-w-0"
              >
                <span className="text-3xl" role="img" aria-hidden>
                  {player.icon}
                </span>
                <h3 className="mt-3 text-lg font-bold text-white">
                  {player.name}
                </h3>
                <p className="mt-1 text-xs text-[#00F6FF]">{player.tag}</p>
                <p className="mt-3 text-2xl font-bold text-[#00F6FF]">
                  {player.stat}
                </p>
                <p className="mt-2 text-sm text-[#94A3B8]">{player.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-black px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>SIMPLE PROCESS</SectionLabel>
          <h2 className="mt-4 text-center text-4xl font-bold text-white md:text-6xl">
            Get Your Perfect Settings
            <br />
            In Under 60 Seconds
          </h2>

          <div className="mt-16 flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-center lg:gap-4">
            {STEPS.map((step, index) => (
              <Fragment key={step.num}>
                {index > 0 && (
                  <span
                    className="hidden shrink-0 self-center text-3xl text-[#333333] lg:block"
                    aria-hidden
                  >
                    →
                  </span>
                )}
                <div className="flex max-w-xs flex-1 flex-col items-center text-center">
                  <div className="relative mb-4 flex h-20 w-20 items-center justify-center">
                    <span className="absolute text-7xl font-bold text-[#00F6FF]/10">
                      {step.num}
                    </span>
                    <span className="relative text-4xl">{step.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
                    {step.description}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-[#0a0a0a] px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>FEATURES</SectionLabel>
          <h2 className="mt-4 text-center text-4xl font-bold text-white md:text-6xl">
            Everything You Need To
            <br />
            Win More Gunfights
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#00F6FF]/40"
              >
                <span className="text-3xl" role="img" aria-hidden>
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVICE MARQUEE ── */}
      <section className="overflow-hidden bg-black px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            200+ Devices Supported
          </h2>
          <p className="mt-2 text-[#94A3B8]">
            Find your exact phone model instantly
          </p>
        </div>
        <div className="mt-10 space-y-4">
          <MarqueeRow items={MARQUEE_ROW_1} direction="left" />
          <MarqueeRow items={MARQUEE_ROW_2} direction="right" />
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#0a0a0a] px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>COMMUNITY</SectionLabel>
          <h2 className="mt-4 text-center text-4xl font-bold text-white md:text-6xl">
            What Players Are Saying
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <article
                key={t.name}
                className="rounded-xl border border-[#222222] bg-[#111111] p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[#F59E0B]" aria-label="5 stars">
                    ⭐⭐⭐⭐⭐
                  </p>
                  <span className="rounded-full bg-[#1a1a1a] px-2 py-0.5 text-[10px] text-[#94A3B8]">
                    Early User
                  </span>
                </div>
                <p className="mt-4 text-sm italic leading-relaxed text-white">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="mt-4 font-bold text-white">{t.name}</p>
                <p className="mt-1 text-xs text-[#00F6FF]">{t.tag}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#00F6FF]/20 bg-gradient-to-r from-black via-[#001a1a] to-black px-6 py-16 text-center md:px-12">
          <span className="inline-block rounded-full border border-[#00F6FF]/30 bg-[#00F6FF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#00F6FF]">
            Free To Use
          </span>
          <h2 className="mt-6 text-4xl font-bold text-white md:text-6xl">
            Ready To Find Your
            <br />
            <GradientText>Perfect Sensitivity?</GradientText>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[#94A3B8]">
            Join thousands of Free Fire players who use HAFYN X to dominate their
            matches. No signup required to start.
          </p>
          <Link
            to="/calculator"
            className="mt-8 inline-block rounded-xl bg-gradient-to-r from-[#00F6FF] to-[#0044FF] px-10 py-4 text-lg font-bold text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,246,255,0.4)]"
          >
            Calculate My Sensitivity — It&apos;s Free →
          </Link>
          <p className="mt-4 text-sm text-[#94A3B8]">
            No account needed • Takes 60 seconds • 200+ devices
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#111111] bg-black px-4 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <HafynLogo />
            <p className="mt-4 text-sm leading-relaxed text-[#94A3B8]">
              The most advanced Free Fire sensitivity calculator in South Asia
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '12px',
              }}
            >
              <img
                src={costaLogo}
                alt="Costa Gamerz"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '2px solid rgba(0,246,255,0.3)',
                  boxShadow: '0 0 15px rgba(0,246,255,0.2)',
                }}
              />
              <div>
                <div
                  style={{
                    color: '#00F6FF',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  COSTA GAMERZ
                </div>
                <div style={{ color: '#475569', fontSize: '12px' }}>
                  Developer & Creator
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-[#94A3B8]">
              <li>
                <Link
                  to="/calculator"
                  className="transition-colors hover:text-[#00F6FF]"
                >
                  Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="transition-colors hover:text-[#00F6FF]"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="transition-colors hover:text-[#00F6FF]"
                >
                  Pro Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white">Contact</h4>
            <p className="mt-4 text-sm text-[#94A3B8]">
              📧 Personal &amp; Business Inquiries:
            </p>
            <a
              href="mailto:hafynstudio@gmail.com"
              className="mt-2 inline-block text-sm font-medium text-[#00F6FF] hover:underline"
            >
              hafynstudio@gmail.com
            </a>
            <p className="mt-3 text-sm text-[#94A3B8]">
              For collaborations, partnerships, and business inquiries
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-[#111111] pt-8 text-xs text-[#94A3B8] md:flex-row">
          <p>© 2025 HAFYN X. Developed by COSTA GAMERZ</p>
          <p>Made with ❤️ for Free Fire Players</p>
        </div>
      </footer>
    </div>
  )
}
