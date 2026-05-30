import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
      setEmail('')
      setPassword('')
      setError('')
      setSuccessMessage('')
      setLoading(false)
    }
  }, [isOpen, defaultTab])

  if (!isOpen) return null

  function switchTab(tab) {
    setActiveTab(tab)
    setError('')
    setSuccessMessage('')
  }

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    onClose()
  }

  async function handleSignup(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    setSuccessMessage('Check your email to confirm account')
  }

  async function handleSubmit(event) {
    if (activeTab === 'login') {
      await handleLogin(event)
    } else {
      await handleSignup(event)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-[#222222] bg-[#111111] p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <p className="font-logo text-xl font-bold tracking-widest">
            <span className="text-white">HAFYN</span>
            <span className="text-[#00D4FF]"> X</span>
          </p>
        </div>

        <div className="mb-6 flex rounded-lg border border-[#333] bg-[#0a0a0a] p-1">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`flex-1 rounded-md py-2 text-sm font-semibold ${
              activeTab === 'login'
                ? 'bg-[#F59E0B] text-black'
                : 'text-zinc-400'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchTab('signup')}
            className={`flex-1 rounded-md py-2 text-sm font-semibold ${
              activeTab === 'signup'
                ? 'bg-[#F59E0B] text-black'
                : 'text-zinc-400'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="mb-2 block text-sm text-zinc-300">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-2 block text-sm text-zinc-300"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {successMessage && (
            <p className="text-sm text-[#F59E0B]">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#F59E0B] py-3 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : activeTab === 'login'
                ? 'Login'
                : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          {activeTab === 'login' ? (
            <>
              Don&apos;t have account?{' '}
              <button
                type="button"
                onClick={() => switchTab('signup')}
                className="text-[#00D4FF] hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have account?{' '}
              <button
                type="button"
                onClick={() => switchTab('login')}
                className="text-[#00D4FF] hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
