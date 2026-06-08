// api/create-checkout.js
// Creates a Lemon Squeezy checkout session for the user

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST') return res.status(405).end()
  
    const { userId, userEmail } = req.body || {}
  
    if (!userId || !userEmail) {
      return res.status(400).json({ error: 'userId and userEmail required' })
    }
  
    const STORE_ID   = process.env.LEMONSQUEEZY_STORE_ID
    const VARIANT_ID = process.env.LEMONSQUEEZY_VARIANT_ID
    const API_KEY    = process.env.LEMONSQUEEZY_API_KEY
  
    if (!STORE_ID || !VARIANT_ID || !API_KEY) {
      console.error('Missing Lemon Squeezy env vars')
      return res.status(500).json({ error: 'Payment not configured' })
    }
  
    try {
      const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
          Accept:        'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              // Pre-fill user email in checkout
              checkout_data: {
                email: userEmail,
                custom: {
                  user_id: userId,  // We'll use this in webhook
                },
              },
              // Redirect after payment
              product_options: {
                redirect_url: 'https://hafyn-x.vercel.app/pro-success',
              },
              // Checkout UI options
              checkout_options: {
                embed: false,
                media: true,
                logo: true,
              },
            },
            relationships: {
              store: {
                data: { type: 'stores', id: String(STORE_ID) },
              },
              variant: {
                data: { type: 'variants', id: String(VARIANT_ID) },
              },
            },
          },
        }),
      })
  
      if (!response.ok) {
        const err = await response.text()
        console.error('LemonSqueezy checkout error:', err)
        return res.status(500).json({ error: 'Failed to create checkout' })
      }
  
      const data = await response.json()
      const checkoutUrl = data?.data?.attributes?.url
  
      if (!checkoutUrl) {
        return res.status(500).json({ error: 'No checkout URL returned' })
      }
  
      return res.status(200).json({ url: checkoutUrl })
    } catch (err) {
      console.error('Checkout handler error:', err)
      return res.status(500).json({ error: err.message })
    }
  }