'use client';

import Link from "next/link";
import { motion } from "motion/react";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { RequestStatusTracker } from "@/components/dashboard/RequestStatusTracker";
import { PromoCarousel } from "@/components/dashboard/PromoCarousel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { LiveExchangeRates } from "@/components/dashboard/LiveExchangeRates";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useWalletTransactions } from "@/hooks/useWalletTransactions";
import { Skeleton } from "@/components/ui/skeleton";

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
  
  const displayName = profile?.username || profile?.full_name || user?.email?.split('@')[0] || 'User';

  // Calculate total balance roughly in a primary currency (assuming all are roughly equivalent or just showing the primary one)
  // For a real app, you'd convert all to a base currency. We'll just show the main wallet's balance or USD.
  const mainWallet = accounts.find(a => a.currency_code === 'USD') || accounts[0];

  return (
    <motion.div 
      className="flex-1 flex flex-col gap-6 md:gap-10 pb-10"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      
      {/* Header Section */}
      <motion.header variants={fadeUp} className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b-2 border-foreground pb-4 md:pb-6 relative">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <ShieldCheck className="w-4 h-4 text-emerald-600" />
             <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-600">Verified Account</span>
           </div>
           <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading uppercase leading-[0.9] tracking-tight">{getGreeting()}, <br className="hidden md:block"/>{displayName}</h1>
        </div>
        <div className="flex flex-col md:items-end mt-2 md:mt-0 gap-4">
           
           <div className="flex flex-col md:items-end">
             <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-1 md:mb-2">Total Balance</span>
             <div className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading">
                {isWalletLoading ? (
                  <Skeleton className="w-32 h-10" />
                ) : mainWallet ? (
                  `${mainWallet.available_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${mainWallet.currency_code}`
                ) : (
                  '0.00'
                )}
             </div>
           </div>
        </div>
      </motion.header>

      {/* Live Exchange Rates */}
      <motion.div variants={fadeUp}>
        <LiveExchangeRates />
      </motion.div>

      <motion.div variants={fadeUp}>
        <PromoCarousel />
      </motion.div>

      <motion.div variants={fadeUp}>
        <QuickActions />
      </motion.div>

      {/* Two Column Layout */}
      <motion.section variants={fadeUp} className="grid lg:grid-cols-[1fr_350px] gap-8">
        
        <div className="flex flex-col gap-8">
          <RequestStatusTracker />
        </div>

        <div className="flex flex-col gap-8">
          {/* Recent Activity */}
          <div className="border-2 border-foreground bg-card flex flex-col h-full">
            <div className="p-4 md:p-6 border-b-2 border-foreground flex justify-between items-center bg-secondary">
              <span className="font-bold uppercase text-xs tracking-widest">Recent Activity</span>
              <Link href="/history" className="text-[10px] font-bold uppercase hover:text-primary transition-colors flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex flex-col p-4 md:p-6 gap-4 flex-1">
               {isTxnLoading ? (
                 <div className="space-y-4">
                   <Skeleton className="w-full h-12" />
                   <Skeleton className="w-full h-12" />
                 </div>
               ) : transactions.length === 0 ? (
                 <div className="text-center opacity-50 text-xs font-bold uppercase py-8 tracking-widest">
                   No recent activity
                 </div>
               ) : (
                 transactions.slice(0, 4).map((txn) => (
                   <div key={txn.id} className="flex justify-between items-start pb-4 border-b-2 border-dashed border-muted last:border-0 last:pb-0">
                     <div>
                       <div className="font-bold uppercase text-xs mb-1">{txn.type}</div>
                       <div className="text-[10px] font-bold opacity-60 uppercase">
                         {new Date(txn.created_at).toLocaleDateString()}
                       </div>
                     </div>
                     <div className="text-right">
                       <div className={`font-bold font-heading text-sm ${txn.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                         {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {txn.wallet_account?.currency_code}
                       </div>
                       <div className={`text-[10px] font-bold uppercase mt-1 ${
                         txn.status === 'completed' ? 'text-emerald-600' : 
                         txn.status === 'failed' ? 'text-red-600' : 'text-blue-600'
                       }`}>
                         {txn.status}
                       </div>
                     </div>
                   </div>
                 ))
               )}
            </div>
          </div>
        </div>

      </motion.section>
    </motion.div>
  );
}
