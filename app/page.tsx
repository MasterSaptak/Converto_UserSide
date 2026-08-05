'use client';

import { motion } from "motion/react";
import { staggerContainer } from "@/lib/animations";
import { HeroDashboard } from "@/components/dashboard/HeroDashboard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { LiveExchangeRates } from "@/components/dashboard/LiveExchangeRates";
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
