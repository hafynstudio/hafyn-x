import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

const navLinks = [
  { label: 'Calculator', href: '/calculator', disabled: false },
  { label: 'Stats', href: '#', disabled: true, badge: 'Soon' },
  { label: 'Pricing', href: '/pricing', disabled: false },
]

function Logo() {
  return (
    <span
      className="font-logo text-lg font-bold tracking-widest"
      aria-label="HAFYN X"
    >
      <span className="text-white">HAFYN</span>
      <span className="text-[#00D4FF]"> X</span>
    </span>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-[#111111]">
      <nav className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left — Logo */}
        <a
          href="/"
          className="transition opacity-90 hover:opacity-100"
        >
          <Logo />
        </a>

        {/* Right — Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) =>
            link.disabled ? (
              <span
                key={link.label}
                className="flex cursor-not-allowed items-center gap-1.5 text-sm text-zinc-500"
              >
                {link.label}
                {link.badge && (
                  <span className="rounded bg-brand-yellow px-1.5 py-0.5 text-[10px] font-bold leading-none text-black">
                    {link.badge}
                  </span>
                )}
              </span>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-white transition hover:text-brand-yellow"
              >
                {link.label}
              </a>
            ),
          )}

          <a
            href="/pro"
            className="flex items-center gap-1.5 rounded-lg bg-brand-yellow px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-400"
          >
            <Zap className="h-4 w-4" />
            Go Pro 👑
          </a>
        </div>

        {/* Mobile — Hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-brand-border md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile — Dropdown */}
      {isOpen && (
        <div className="border-t border-brand-border bg-[#111111] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.disabled ? (
                <span
                  key={link.label}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-zinc-500"
                >
                  {link.label}
                  {link.badge && (
                    <span className="rounded bg-brand-yellow px-1.5 py-0.5 text-[10px] font-bold leading-none text-black">
                      {link.badge}
                    </span>
                  )}
                </span>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2.5 text-sm text-white transition hover:bg-brand-border hover:text-brand-yellow"
                >
                  {link.label}
                </a>
              ),
            )}

            <a
              href="/pro"
              onClick={closeMenu}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-brand-yellow px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-400"
            >
              <Zap className="h-4 w-4" />
              Go Pro 👑
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
