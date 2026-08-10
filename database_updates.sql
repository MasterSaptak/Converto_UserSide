-- 1. Create the user_rewards table
CREATE TABLE IF NOT EXISTS public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  lifetime_c_points INTEGER NOT NULL DEFAULT 0,
  available_c_points INTEGER NOT NULL DEFAULT 0,
  spent_c_points INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'Bronze',
  total_transactions INTEGER NOT NULL DEFAULT 0,
  total_volume_usd DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  last_rewarded_at TIMESTAMP WITH TIME ZONE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the reward_transactions table (the ledger)
CREATE TABLE IF NOT EXISTS public.reward_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earn', 'bonus', 'admin_bonus', 'redeem', 'refund', 'adjustment', 'penalty')),
  transaction_id UUID, -- Optional link to wallet_transactions
  points INTEGER NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id), -- Admin who did it, or null if system
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for user_rewards
CREATE POLICY "Users can view their own rewards profile."
  ON public.user_rewards FOR SELECT
  USING (auth.uid() = user_id);

-- System/Service role needs ALL access to update this table, but users shouldn't update directly from client
CREATE POLICY "Service role can manage user_rewards"
  ON public.user_rewards FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policies for reward_transactions
CREATE POLICY "Users can view their own reward transactions."
  ON public.reward_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage reward_transactions"
  ON public.reward_transactions FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Create trigger to update 'updated_at' on user_rewards
CREATE OR REPLACE FUNCTION update_user_rewards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_rewards_updated_at
BEFORE UPDATE ON public.user_rewards
FOR EACH ROW
EXECUTE FUNCTION update_user_rewards_updated_at();

-- 5. Create a trigger to automatically insert a user_rewards row when a new user is created
CREATE OR REPLACE FUNCTION public.handle_new_user_rewards()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_rewards (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Bind the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_rewards ON auth.users;
CREATE TRIGGER on_auth_user_created_rewards
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_rewards();
