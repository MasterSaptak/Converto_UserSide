import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useWallet } from './useWallet'
import { useQuery, useQueryClient } from '@tanstack/react-query'

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
  const { accounts } = useWallet()
  const queryClient = useQueryClient()

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['wallet_transactions', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error: fetchError } = await supabase
        .from('wallet_transactions')
        .select(`
          *,
          wallet_account:wallet_accounts(currency_code)
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      return (data || []) as WalletTransaction[]
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (!user || accounts.length === 0) return

    const channelName = `wallet-transactions-${user.id}`
    let channel = supabase.channel(channelName)

    // Add a listener for each wallet account the user owns
    accounts.forEach(account => {
      channel = channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_transactions',
          filter: `wallet_account_id=eq.${account.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['wallet_transactions', user.id] })
        }
      )
    })

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, accounts, queryClient])

  return { 
    transactions, 
    isLoading, 
    error: error instanceof Error ? error.message : error ? String(error) : null 
  }
}
