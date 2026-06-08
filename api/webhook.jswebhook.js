// api/webhook.js
// Lemon Squeezy sends events here after payment
// We verify signature then update Supabase

import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Supabase admin client (service role — bypasses RLS)
function getSupabase() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// Verify Lemon Squeezy webhook signature
function verifySignature(rawBody, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody)
  const digest = hmac.digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(digest, 'hex'),
    Buffer.from(signature, 'hex')
  )
}

// Update user to Pro in Supabase
async function setUserPro(supabase, userId, data) {
  const { error } = await supabase
    .from('profiles')
    .update({
      is_pro: true,
      lemon_squeezy_customer_id:    String(data.customerId || ''),
      lemon_squeezy_subscription_id: String(data.subscriptionId || ''),
      pro_expires_at: null, // null = no expiry (active subscription)
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Supabase update error:', error)
    throw new Error('Failed to update user')
  }
  console.log('✅ User upgraded to Pro:', userId)
}

// Remove Pro from user in Supabase
async function setUserFree(supabase, userId) {
  const { error } = await supabase
    .from('profiles')
    .update({
      is_pro: false,
      pro_expires_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Supabase downgrade error:', error)
    throw new Error('Failed to downgrade user')
  }
  console.log('⬇️ User downgraded to Free:', userId)
}

// Find userId from Lemon Squeezy custom data
function extractUserId(eventData) {
  // From checkout custom data we passed: { user_id: userId }
  return (
    eventData?.meta?.custom_data?.user_id ||
    eventData?.data?.attributes?.first_order_item?.meta?.custom?.user_id ||
    null
  )
}

export const config = {
  api: {
    bodyParser: false, // We need raw body for signature verification
  },
}

// Read raw body from request
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => { data += chunk })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const rawBody  = await getRawBody(req)
  const signature = req.headers['x-signature']
  const secret   = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

  // Verify signature
  if (!signature || !secret) {
    console.error('Missing signature or webhook secret')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  let isValid = false
  try {
    isValid = verifySignature(rawBody, signature, secret)
  } catch {
    console.error('Signature verification failed')
    return res.status(401).json({ error: 'Invalid signature' })
  }

  if (!isValid) {
    console.error('Signature mismatch')
    return res.status(401).json({ error: 'Invalid signature' })
  }

  // Parse event
  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const eventName = event?.meta?.event_name
  const supabase  = getSupabase()

  console.log('📩 Webhook received:', eventName)

  try {
    switch (eventName) {
      // ─── SUBSCRIPTION CREATED (first payment) ───────────────────
      case 'subscription_created': {
        const userId = extractUserId(event)
        if (!userId) {
          console.error('No userId in subscription_created event')
          break
        }
        await setUserPro(supabase, userId, {
          customerId:     event.data?.attributes?.customer_id,
          subscriptionId: event.data?.id,
        })
        break
      }

      // ─── ORDER CREATED (one-time, backup) ────────────────────────
      case 'order_created': {
        const userId = extractUserId(event)
        if (!userId) {
          console.error('No userId in order_created event')
          break
        }
        // Only process if it's a subscription order
        const isSubscription = event.data?.attributes?.first_order_item
          ?.is_subscription
        if (isSubscription) {
          await setUserPro(supabase, userId, {
            customerId: event.data?.attributes?.customer_id,
          })
        }
        break
      }

      // ─── SUBSCRIPTION RESUMED (after pause) ─────────────────────
      case 'subscription_resumed':
      case 'subscription_unpaused': {
        // Find user by subscription ID
        const subId = String(event.data?.id || '')
        if (subId) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id')
            .eq('lemon_squeezy_subscription_id', subId)
            .single()

          if (profiles?.id) {
            await setUserPro(supabase, profiles.id, {
              subscriptionId: subId,
            })
          }
        }
        break
      }

      // ─── SUBSCRIPTION CANCELLED / EXPIRED ───────────────────────
      case 'subscription_cancelled':
      case 'subscription_expired': {
        const subId = String(event.data?.id || '')
        if (subId) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id')
            .eq('lemon_squeezy_subscription_id', subId)
            .single()

          if (profiles?.id) {
            await setUserFree(supabase, profiles.id)
          }
        }
        break
      }

      default:
        console.log('Unhandled event:', eventName)
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook processing error:', err)
    // Still return 200 so LemonSqueezy doesn't retry endlessly
    return res.status(200).json({ received: true, error: err.message })
  }
}