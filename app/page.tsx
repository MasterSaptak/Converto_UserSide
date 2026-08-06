'use client';

import { motion } from "motion/react";
import { staggerContainer } from "@/lib/animations";
import { HeroDashboard } from "@/components/dashboard/HeroDashboard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { LiveExchangeRates } from "@/components/dashboard/LiveExchangeRates";

import { ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useWalletTransactions } from "@/hooks/useWalletTransactions";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { accounts, isLoading: isWalletLoading } = useWallet();
  const { transactions, isLoading: isTxnLoading } = useWalletTransactions();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Show success toast when redirected from a service request submission
  useEffect(() => {
    if (searchParams.get('status') === 'success') {
      toast.success('Your request has been submitted successfully! Our team will get back to you shortly.', { duration: 5000 });
      // Clean up the URL to prevent the toast from showing again on refresh
      router.replace('/', { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const displayName = profile?.username || profile?.full_name || user?.email?.split('@')[0] || 'User';

  // Calculate total balance roughly in a primary currency (assuming all are roughly equivalent or just showing the primary one)
  // For a real app, you'd convert all to a base currency. We'll just show the main wallet's balance or USD.
  const mainWallet = accounts.find(a => a.currency_code === 'USD') || accounts[0];


import { ContentCarousel } from "@/components/content/ContentCarousel";
import { RequestStatusTracker } from "@/components/dashboard/RequestStatusTracker";
import { RecommendedServices } from "@/components/dashboard/RecommendedServices";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

export default function DashboardPage() {

  return (
    <motion.div 
      className="flex-1 flex flex-col gap-0 pb-4"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <HeroDashboard />
      <LiveExchangeRates />
      <ContentCarousel placement="dashboard_carousel" />
      <QuickActions />
      
      <div className="flex flex-col gap-6">
        <RequestStatusTracker />
        <RecommendedServices />
        <RecentTransactions />
      </div>
    </motion.div>
  );
}
