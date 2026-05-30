import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export function useSubscription() {
  const { user } = useAuth()
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setIsPro(false)
      setLoading(false)
      return
    }

    async function checkProStatus() {
      setLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('is_pro, pro_expires_at')
        .eq('id', user.id)
        .single()

      if (error || !data) {
        setIsPro(false)
        setLoading(false)
        return
      }

      const { is_pro, pro_expires_at } = data
      const isActive =
        is_pro &&
        (pro_expires_at === null || new Date(pro_expires_at) > new Date())

      setIsPro(isActive)
      setLoading(false)
    }

    checkProStatus()
  }, [user])

  return { isPro, loading }
}
