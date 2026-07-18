import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { getTierInfo } from '@/lib/currencies'

export interface UserRewardProfile {
  lifetime_c_points: number;
  available_c_points: number;
  spent_c_points: number;
  tier: string;
  current_streak: number;
  total_transactions: number;
}

export function useRewards() {
  const { user } = useAuth()
  
  const [rewards, setRewards] = useState<UserRewardProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setRewards(null)
      setIsLoading(false)
      return
    }

    const fetchRewards = async () => {
      try {
        setIsLoading(true)
        
        const { data, error: fetchError } = await supabase
          .from('user_rewards')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
             // Row not found (maybe trigger hasn't run yet or table is missing)
             setRewards(null)
          } else {
             throw fetchError
          }
        } else {
          setRewards(data)
        }
      } catch (err: any) {
        console.error('Error fetching rewards:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRewards()

    const channelName = `rewards-changes-${Math.random().toString(36).substring(7)}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_rewards',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchRewards()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // Compute calculated tier info as a fallback/bonus (in case backend tier text is outdated or just for progress UI)
  const tierInfo = rewards ? getTierInfo(rewards.lifetime_c_points) : getTierInfo(0);

  return { rewards, tierInfo, isLoading, error }
}
