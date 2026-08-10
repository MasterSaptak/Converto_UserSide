'use client';

import { supabase } from '@/lib/supabase';
import { useSharedNotifications } from '@/lib/notifications/useNotifications';
import type { UseNotificationsReturn } from '@/lib/notifications/types';

export function useNotifications(): UseNotificationsReturn {
  return useSharedNotifications(supabase, {
    mode: 'user',
    limit: 50
  });
}
