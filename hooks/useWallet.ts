import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useQuery, useQueryClient } from '@tanstack/react-query'

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
  const queryClient = useQueryClient()

  const { data: accounts = [], isLoading, error } = useQuery({
    queryKey: ['wallet_accounts', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error: fetchError } = await supabase
        .from('wallet_accounts')
        .select('*')
        .order('currency_code', { ascending: true })

      if (fetchError) throw fetchError
      return data as WalletAccount[]
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (!user || accounts.length === 0) return

    // Since RLS restricts wallet_accounts to our wallet, 
    // we can filter the realtime events by our wallet_id
    const walletId = accounts[0]?.wallet_id
    if (!walletId) return

    const channelName = `wallet-changes-${user.id}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_accounts',
          filter: `wallet_id=eq.${walletId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['wallet_accounts', user.id] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, accounts.length > 0 ? accounts[0].wallet_id : null, queryClient])

  return { 
    accounts, 
    isLoading, 
    error: error instanceof Error ? error.message : error ? String(error) : null 
  }
}
