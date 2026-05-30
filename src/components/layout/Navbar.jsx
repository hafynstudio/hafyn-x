import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../auth/AuthModal'

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

function AuthButtons({ onLoginClick, onLogout, user, className = '' }) {
  if (user) {
    const username = user.email?.split('@')[0] ?? 'User'

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="text-xs text-zinc-500">{username}</span>
        <a
          href="/dashboard"
          className="text-sm text-white hover:text-[#F59E0B]"
        >
          Dashboard
        </a>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-600 hover:text-white"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={onLoginClick}
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:border-zinc-600"
      >
        Login
      </button>
      <a
        href="/pro"
        className="flex items-center gap-1.5 rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-bold text-black hover:bg-amber-400"
      >
        <Zap className="h-4 w-4" />
        Go Pro 👑
      </a>
    </div>
  )
}

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
  }

  function openLoginModal() {
    setIsAuthModalOpen(true)
    closeMenu()
  }

  async function handleLogout() {
    await signOut()
    closeMenu()
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-brand-border bg-[#111111]">
        <nav className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="opacity-90 hover:opacity-100">
            <Logo />
          </a>

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
                  className="text-sm text-white hover:text-brand-yellow"
                >
                  {link.label}
                </a>
              ),
            )}

            <AuthButtons
              user={user}
              onLoginClick={openLoginModal}
              onLogout={handleLogout}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-brand-border md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

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
                    className="rounded-lg px-3 py-2.5 text-sm text-white hover:bg-brand-border hover:text-brand-yellow"
                  >
                    {link.label}
                  </a>
                ),
              )}

              <div className="mt-3 border-t border-brand-border pt-3">
                <AuthButtons
                  user={user}
                  onLoginClick={openLoginModal}
                  onLogout={handleLogout}
                  className="flex-col items-stretch gap-2"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="login"
      />
    </>
  )
}
