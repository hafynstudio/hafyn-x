import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../auth/AuthModal'
import hafynLogo from '../../assets/hafynx-logo.png'

function NavbarLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img
        src={hafynLogo}
        alt="HAFYN X"
        style={{
          height: '32px',
          width: '32px',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 10px rgba(0,246,255,0.8))',
        }}
      />
      <span
        style={{
          fontWeight: 800,
          fontSize: '20px',
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
      </span>
    </div>
  )
}

const SOON_BADGE = (
  <span className="ml-1 rounded-full border border-[#00F6FF]/30 bg-[#00F6FF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00F6FF]">
    SOON
  </span>
)

function NavLink({ to, children, className = '' }) {
  return (
    <Link
      to={to}
      className={`text-sm transition-all duration-300 hover:text-[#00F6FF] ${className}`}
    >
      {children}
    </Link>
  )
}

function GoProButton({ className = '', onClick }) {
  return (
    <Link
      to="/pricing"
      onClick={onClick}
      className={`inline-block rounded-lg bg-gradient-to-br from-[#00F6FF] to-[#0044FF] px-4 py-1.5 text-sm font-bold text-black transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,246,255,0.3)] ${className}`}
    >
      Go Pro
    </Link>
  )
}

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const displayName =
    profile?.username ?? user?.email?.split('@')[0] ?? 'User'

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
      <header
        className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl"
        style={{ background: 'rgba(0,0,0,0.8)' }}
      >
        <nav className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="opacity-95 transition-opacity hover:opacity-100">
            <NavbarLogo />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <NavLink to="/calculator" className="text-white">
              Calculator
            </NavLink>

            <span className="flex cursor-not-allowed items-center text-sm text-[#94A3B8]">
              Stats
              {SOON_BADGE}
            </span>

            <NavLink to="/pricing" className="text-white">
              Pricing
            </NavLink>

            <span className="flex cursor-not-allowed items-center text-sm text-[#94A3B8]">
              Dashboard
              {SOON_BADGE}
            </span>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white">
                  <span className="text-[#00F6FF]" aria-hidden>
                    ●
                  </span>
                  {displayName}
                </span>
                <GoProButton />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-gray-500 transition-all hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="rounded-lg border border-white/20 px-4 py-1.5 text-sm text-white transition-all hover:border-[#00F6FF] hover:text-[#00F6FF]"
                >
                  Login
                </button>
                <GoProButton />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/5 md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        <div
          className={`overflow-hidden border-t border-white/5 transition-all duration-300 ease-in-out md:hidden ${
            isOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ background: 'rgba(0,0,0,0.95)' }}
        >
          <div className="space-y-1 px-4 py-4">
            <Link
              to="/calculator"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-2.5 text-sm text-white hover:bg-white/5 hover:text-[#00F6FF]"
            >
              Calculator
            </Link>
            <span className="flex items-center rounded-lg px-3 py-2.5 text-sm text-[#94A3B8]">
              Stats
              {SOON_BADGE}
            </span>
            <Link
              to="/pricing"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-2.5 text-sm text-white hover:bg-white/5 hover:text-[#00F6FF]"
            >
              Pricing
            </Link>
            <span className="flex items-center rounded-lg px-3 py-2.5 text-sm text-[#94A3B8]">
              Dashboard
              {SOON_BADGE}
            </span>

            <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
              {user ? (
                <>
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                    <span className="text-[#00F6FF]">●</span>
                    {displayName}
                  </span>
                  <GoProButton className="w-full text-center" onClick={closeMenu} />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="py-2 text-left text-xs text-gray-500 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="w-full rounded-lg border border-white/20 py-2.5 text-sm text-white transition-all hover:border-[#00F6FF] hover:text-[#00F6FF]"
                  >
                    Login
                  </button>
                  <Link
                    to="/pricing"
                    onClick={closeMenu}
                    className="block w-full rounded-lg bg-gradient-to-br from-[#00F6FF] to-[#0044FF] py-2.5 text-center text-sm font-bold text-black"
                  >
                    Go Pro
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="login"
      />
    </>
  )
}
