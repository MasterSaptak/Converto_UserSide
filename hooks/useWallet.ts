import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface WalletAccount {
  id: string
  wallet_id: string
  currency_code: string
  available_balance: number
  locked_balance: number
  reserved_balance: number
}

export function useWallet() {
  const { user } = useAuth()
  
  const [accounts, setAccounts] = useState<WalletAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setAccounts([])
      setIsLoading(false)
      return
    }

    const fetchWallet = async () => {
      try {
        setIsLoading(true)
        
        // Fetch wallet accounts for the user (RLS will automatically restrict this to their wallet)
        const { data, error: fetchError } = await supabase
          .from('wallet_accounts')
          .select('*')
          .order('currency_code', { ascending: true })

        if (fetchError) throw fetchError

        setAccounts(data || [])
      } catch (err: any) {
        console.error('Error fetching wallet:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWallet()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('wallet-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_accounts',
        },
        () => {
          fetchWallet()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  return { accounts, isLoading, error }
}
