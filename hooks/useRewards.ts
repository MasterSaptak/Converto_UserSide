import { useQuery } from '@tanstack/react-query'
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

  const {
    data: rewards = null,
    isLoading,
    error
  } = useQuery<UserRewardProfile | null, Error>({
    queryKey: ['user_rewards', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error: fetchError } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return null; // Row not found
        }
        throw fetchError;
      }
      
      return data;
    },
    enabled: !!user,
    refetchInterval: 3000, // Poll every 3 seconds to ensure live points updates
    staleTime: 1000,
  });

  // Compute calculated tier info as a fallback/bonus
  const tierInfo = rewards ? getTierInfo(rewards.available_c_points) : getTierInfo(0);

  return { rewards, tierInfo, isLoading, error: error?.message || null }
}
