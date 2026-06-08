// src/pages/ProSuccessPage.jsx
// User lands here after successful Lemon Squeezy payment

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function ProSuccessPage() {
  const { user } = useAuth()
  const [isPro, setIsPro] = useState(false)
  const [checking, setChecking] = useState(true)
  const [attempts, setAttempts] = useState(0)

  // Poll Supabase until is_pro = true (webhook might take a few seconds)
  useEffect(() => {
    if (!user) { setChecking(false); return }

    let tries = 0
    const MAX_TRIES = 10

    async function checkStatus() {
      tries++
      setAttempts(tries)

      const { data } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', user.id)
        .single()

      if (data?.is_pro) {
        setIsPro(true)
        setChecking(false)
        return
      }

      if (tries < MAX_TRIES) {
        setTimeout(checkStatus, 2000) // retry every 2s
      } else {
        setChecking(false) // give up after 20s
      }
    }

    checkStatus()
  }, [user])

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center"
    >
      {checking ? (
        /* Waiting for webhook */
        <div>
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: 'rgba(0,246,255,0.1)',
              border: '2px solid rgba(0,246,255,0.3)',
            }}
          >
            <svg
              className="h-8 w-8 animate-spin text-[#00F6FF]"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Activating Your Pro Account...
          </h1>
          <p className="mt-3 text-sm text-[#64748b]">
            Please wait, this usually takes a few seconds.
            <br />
            (Attempt {attempts} / 10)
          </p>
        </div>
      ) : isPro ? (
        /* Success */
        <div>
          {/* Glow circle */}
          <div
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background: 'rgba(0,246,255,0.1)',
              border: '2px solid #00F6FF',
              boxShadow: '0 0 40px rgba(0,246,255,0.3)',
            }}
          >
            <span style={{ fontSize: 40 }}>⚡</span>
          </div>

          <div
            className="mb-4 inline-block rounded-full px-4 py-1 text-xs font-bold text-black"
            style={{ background: 'linear-gradient(135deg, #00F6FF, #0044FF)' }}
          >
            PRO ACTIVATED
          </div>

          <h1 className="mt-2 text-4xl font-black text-white">
            Welcome to HAFYN X Pro!
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-[#64748b]">
            You now have unlimited AI Coach access, exclusive pro player
            sensitivity packs, and all Pro features unlocked. Let&apos;s
            dominate.
          </p>

          {/* Features unlocked */}
          <div
            className="mx-auto mt-8 max-w-sm rounded-2xl p-6 text-left"
            style={{
              background: 'rgba(0,246,255,0.04)',
              border: '1px solid rgba(0,246,255,0.2)',
            }}
          >
            <p className="mb-4 text-sm font-semibold text-[#00F6FF]">
              UNLOCKED FOR YOU
            </p>
            {[
              '♾️ Unlimited AI Coach messages',
              '🏆 Exclusive Pro Player Sensitivity Packs',
              '📊 Player Stats Tracker',
              '💾 Unlimited Saved Configs',
              '⚡ Priority AI Processing',
            ].map((f) => (
              <div key={f} className="mb-2 flex gap-2 text-sm text-[#94A3B8]">
                <span className="text-[#00F6FF]">✓</span>
                {f}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/calculator"
              className="rounded-xl px-8 py-3.5 text-sm font-bold text-black transition-all hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #00F6FF, #0044FF)',
                boxShadow: '0 0 20px rgba(0,246,255,0.3)',
              }}
            >
              Calculate My Sensitivity →
            </Link>
            <Link
              to="/"
              className="rounded-xl border border-white/20 px-8 py-3.5 text-sm font-bold text-white transition-all hover:border-[#00F6FF]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        /* Webhook took too long — manual instructions */
        <div>
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: 'rgba(245,158,11,0.1)',
              border: '2px solid rgba(245,158,11,0.4)',
            }}
          >
            <span style={{ fontSize: 36 }}>⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Payment Received!
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#64748b]">
            Your payment was successful but Pro activation is taking longer
            than expected. Please wait a minute and refresh the page. If the
            issue persists, contact us:
          </p>
          <a
            href="mailto:hafynstudio@gmail.com"
            className="mt-4 inline-block text-sm font-semibold text-[#00F6FF] hover:underline"
          >
            hafynstudio@gmail.com
          </a>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white hover:border-[#00F6FF]"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}
    </div>
  )
}