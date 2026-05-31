import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSubscription } from '../../hooks/useSubscription'
import { supabase } from '../../lib/supabase'
import { getCoachChatResponse } from '../../lib/groqAI'
import AuthModal from '../auth/AuthModal'

const CHAT_COUNT_KEY = 'hafynx_chat_count'
const CHAT_RESET_KEY = 'hafynx_chat_reset'
const FREE_MESSAGE_LIMIT = 3
const RESET_MS = 48 * 60 * 60 * 1000

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    "Hey! 👋 I'm your HAFYN X sensitivity coach. Ask me anything about your Free Fire settings, sensitivity adjustments, or gameplay tips!",
}

function loadUsageFromStorage() {
  const now = Date.now()
  let count = parseInt(localStorage.getItem(CHAT_COUNT_KEY) || '0', 10)
  let resetTime = parseInt(
    localStorage.getItem(CHAT_RESET_KEY) || String(now),
    10,
  )

  if (Number.isNaN(count)) count = 0
  if (Number.isNaN(resetTime)) resetTime = now

  if (now - resetTime >= RESET_MS) {
    count = 0
    resetTime = now
    localStorage.setItem(CHAT_COUNT_KEY, '0')
    localStorage.setItem(CHAT_RESET_KEY, String(resetTime))
  }

  return { count, resetTime }
}

function getHoursUntilReset(resetTime) {
  const remaining = RESET_MS - (Date.now() - resetTime)
  if (remaining <= 0) return 0
  return Math.ceil(remaining / (60 * 60 * 1000))
}

function incrementUsageCount() {
  const { count, resetTime } = loadUsageFromStorage()
  const next = count + 1
  localStorage.setItem(CHAT_COUNT_KEY, String(next))
  if (count === 0) {
    localStorage.setItem(CHAT_RESET_KEY, String(resetTime || Date.now()))
  }
  return next
}

export default function CoachChat() {
  const { user } = useAuth()
  const { isPro, loading: subscriptionLoading } = useSubscription()

  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [lastResetTime, setLastResetTime] = useState(Date.now())
  const [canSendMessage, setCanSendMessage] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const { count, resetTime } = loadUsageFromStorage()
    setMessageCount(count)
    setLastResetTime(resetTime)
  }, [])

  useEffect(() => {
    if (subscriptionLoading) return

    if (isPro) {
      setCanSendMessage(true)
      return
    }

    const { count, resetTime } = loadUsageFromStorage()
    setMessageCount(count)
    setLastResetTime(resetTime)
    setCanSendMessage(count < FREE_MESSAGE_LIMIT)
  }, [isPro, subscriptionLoading, isOpen])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, isOpen])

  useEffect(() => {
    if (isOpen && user && canSendMessage) {
      inputRef.current?.focus()
    }
  }, [isOpen, user, canSendMessage])

  async function handleSend() {
    const text = input.trim()
    if (!text || isTyping || !user) return
    if (!isPro && !canSendMessage) return

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      setIsAuthModalOpen(true)
      return
    }

    const userMessage = { role: 'user', content: text }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setIsTyping(true)

    const apiMessages = nextMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map(({ role, content }) => ({ role, content }))

    const reply = await getCoachChatResponse(apiMessages)

    setIsTyping(false)
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }])

    if (!isPro) {
      const newCount = incrementUsageCount()
      setMessageCount(newCount)
      setLastResetTime(
        parseInt(localStorage.getItem(CHAT_RESET_KEY) || String(Date.now()), 10),
      )
      if (newCount >= FREE_MESSAGE_LIMIT) {
        setCanSendMessage(false)
      }
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const hoursUntilReset = getHoursUntilReset(lastResetTime)

  return (
    <>
      {isOpen && (
        <div
          className="coach-slide-up fixed z-[99] flex max-h-[520px] flex-col overflow-hidden"
          style={{
            bottom: '100px',
            right: '24px',
            width: 'min(360px, calc(100vw - 32px))',
            background: 'rgba(8, 9, 18, 0.95)',
            border: '1px solid rgba(0,246,255,0.2)',
            borderRadius: '20px',
            backdropFilter: 'blur(20px)',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,246,255,0.1)',
          }}
        >
          {/* Header */}
          <div
            className="flex shrink-0 items-center gap-3 border-b border-[rgba(0,246,255,0.1)] px-5 py-4"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,246,255,0.1), rgba(0,68,255,0.1))',
            }}
          >
            <div className="relative shrink-0">
              <img
                src="/costa-logo.png"
                alt="HAFYN X Coach"
                className="h-[42px] w-[42px] rounded-full border-2 border-[#00F6FF] object-cover"
              />
              <span
                className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#080912] bg-[#22c55e]"
                aria-label="Online"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">HAFYN X Coach</p>
              <p className="text-xs text-[#64748b]">
                Ask me anything about sensitivity
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#64748b] transition-colors hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="coach-chat-scroll flex flex-1 flex-col gap-3 overflow-y-auto p-4"
            style={{ height: '280px', maxHeight: '280px' }}
          >
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                style={
                  msg.role === 'user'
                    ? {
                        alignSelf: 'flex-end',
                        maxWidth: '75%',
                        background:
                          'linear-gradient(135deg, #00F6FF, #0044FF)',
                        color: 'black',
                        borderRadius: '18px 18px 4px 18px',
                        padding: '10px 14px',
                        fontSize: '14px',
                        lineHeight: 1.5,
                      }
                    : {
                        alignSelf: 'flex-start',
                        maxWidth: '85%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'white',
                        borderRadius: '18px 18px 18px 4px',
                        padding: '10px 14px',
                        fontSize: '14px',
                        lineHeight: 1.5,
                      }
                }
              >
                {msg.content}
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '18px 18px 18px 4px',
                  padding: '12px 16px',
                }}
              >
                <div className="flex gap-1">
                  <span
                    className="coach-typing-dot inline-block h-2 w-2 rounded-full bg-[#64748b]"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="coach-typing-dot inline-block h-2 w-2 rounded-full bg-[#64748b]"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="coach-typing-dot inline-block h-2 w-2 rounded-full bg-[#64748b]"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer: login / limit / input */}
          <div className="shrink-0 border-t border-white/[0.06]">
            {!user ? (
              <div className="flex flex-col items-center gap-3 px-4 py-5 text-center">
                <p className="text-sm text-[#94A3B8]">
                  Login to chat with your coach
                </p>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="rounded-lg border border-white/20 px-5 py-2 text-sm font-semibold text-white transition-all hover:border-[#00F6FF] hover:text-[#00F6FF]"
                >
                  Login
                </button>
              </div>
            ) : !isPro && !canSendMessage ? (
              <div
                className="m-3 rounded-xl border border-[#00F6FF]/30 p-4 text-center"
                style={{ background: 'rgba(0,246,255,0.05)' }}
              >
                <p className="text-2xl">🔒</p>
                <p className="mt-2 text-sm font-semibold text-white">
                  You&apos;ve used your 3 free messages
                </p>
                <p className="mt-1 text-xs text-[#64748b]">
                  Resets in {hoursUntilReset} hour
                  {hoursUntilReset !== 1 ? 's' : ''}
                </p>
                <Link
                  to="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 inline-block rounded-lg bg-gradient-to-r from-[#00F6FF] to-[#0044FF] px-4 py-2 text-sm font-bold text-black transition hover:brightness-110"
                >
                  Go Pro for unlimited coaching →
                </Link>
              </div>
            ) : (
              <div className="flex gap-2 px-4 py-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  placeholder="Ask about your sensitivity..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#64748b] focus:border-[#00F6FF] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-lg font-bold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background:
                      'linear-gradient(135deg, #00F6FF, #0044FF)',
                  }}
                  aria-label="Send message"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed z-[100] flex items-center justify-center"
        style={{
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00F6FF, #0044FF)',
          boxShadow: isHovered
            ? '0 0 32px rgba(0,246,255,0.6), 0 4px 24px rgba(0,0,0,0.4)'
            : '0 0 20px rgba(0,246,255,0.4), 0 4px 20px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          transition: 'all 0.3s',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          border: 'none',
        }}
        aria-label={isOpen ? 'Close coach chat' : 'Open coach chat'}
      >
        <span
          className="coach-ripple pointer-events-none absolute rounded-full"
          style={{
            inset: '-4px',
            border: '2px solid rgba(0,246,255,0.4)',
          }}
          aria-hidden
        />
        <img
          src="/costa-logo.png"
          alt="Coach"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            objectFit: 'cover',
            position: 'relative',
            zIndex: 1,
          }}
        />
        {!isOpen && (
          <span
            className="absolute rounded-full bg-red-500"
            style={{
              width: 12,
              height: 12,
              top: 2,
              right: 2,
              zIndex: 2,
            }}
            aria-hidden
          />
        )}
      </button>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="login"
      />
    </>
  )
}
