import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface WalletTransaction {
  id: string
  wallet_account_id: string
  amount: number
  type: string
  status: string
  description: string
  created_at: string
  wallet_account: {
    currency_code: string
  }
}

export function useWalletTransactions() {
  const { user } = useAuth()
  
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setTransactions([])
      setIsLoading(false)
      return
    }

    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        
        // Fetch wallet transactions for the user's wallet accounts
        const { data, error: fetchError } = await supabase
          .from('wallet_transactions')
          .select(`
            *,
            wallet_account:wallet_accounts(currency_code)
          `)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setTransactions(data || [])
      } catch (err: any) {
        console.error('Error fetching transactions:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('wallet-transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_transactions',
        },
        () => {
          fetchTransactions()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  return { transactions, isLoading, error }
}
