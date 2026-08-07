'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DigitalContentIllustration } from '@/components/illustrations/DigitalContent'

interface AppSubscription {
  id: string
  name: string
  category: string
  description: string | null
  accent_color: string
  logo_url: string | null
}

function safeAccent(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#333333'
}

export default function SubscriptionsCatalog() {
  const [subscriptions, setSubscriptions] = useState<AppSubscription[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchSubscriptions() {
    setLoading(true)
    setError(null)

    const { data, error: queryError } = await supabase
      .from('app_subscriptions')
      .select('id, name, category, description, accent_color, logo_url')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (queryError) {
      setSubscriptions([])
      setError('The subscriptions catalog is temporarily unavailable. Please try again.')
    } else {
      setSubscriptions((data ?? []) as AppSubscription[])
    }
    setLoading(false)
  }

  useEffect(() => {
    void fetchSubscriptions()
  }, [])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(subscriptions.map((item) => item.category))).sort()],
    [subscriptions],
  )

  const visibleSubscriptions = useMemo(
    () => selectedCategory === 'All'
      ? subscriptions
      : subscriptions.filter((item) => item.category === selectedCategory),
    [selectedCategory, subscriptions],
  )

  return (
    <div className="w-full min-w-0 bg-background">
      <header className="bg-card border-b-2 border-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="w-full max-w-7xl mx-auto py-8 sm:py-10 xl:py-12 relative z-10">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 xl:gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-foreground text-background px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                Digital subscriptions
              </div>
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black uppercase tracking-tight text-foreground leading-none">
                App Catalog
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg font-medium max-w-xl leading-relaxed">
                Choose an active subscription and send a one-tap purchase request. Our team will confirm the plan and final price with you.
              </p>
            </div>

            <div className="hidden xl:block w-28 h-28 2xl:w-32 2xl:h-32 opacity-80 shrink-0">
              <DigitalContentIllustration size={128} accent="#EC4899" animated className="w-full h-full" />
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto py-8 sm:py-10">
        {!loading && !error && subscriptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8" aria-label="Subscription categories">
            {categories.map((category) => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`border-2 border-foreground rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                    active
                      ? 'bg-foreground text-background shadow-none translate-x-0.5 translate-y-0.5'
                      : 'bg-card shadow-[2px_2px_0px_var(--color-foreground)] hover:-translate-y-0.5'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6" aria-label="Loading subscriptions">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse bg-card border-2 border-foreground/10 rounded-xl h-64 shadow-brutal" />
            ))}
          </div>
        ) : error ? (
          <div className="w-full max-w-xl mx-auto border-2 border-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl p-5 sm:p-6 text-center shadow-brutal">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <p className="font-bold">{error}</p>
            <button type="button" onClick={() => void fetchSubscriptions()} className="mt-4 inline-flex items-center gap-2 border-2 border-foreground bg-card px-4 py-2 font-black uppercase text-xs tracking-widest">
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
          </div>
        ) : visibleSubscriptions.length === 0 ? (
          <div className="border-2 border-dashed border-foreground/30 rounded-xl p-10 text-center text-muted-foreground font-bold">
            No active subscriptions are available in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {visibleSubscriptions.map((subscription) => {
              const accent = safeAccent(subscription.accent_color)
              return (
                <article
                  key={subscription.id}
                  className="group relative bg-card border-2 border-foreground rounded-2xl p-6 shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-[8px_8px_0px_var(--color-foreground)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
                >
                  <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150" style={{ backgroundColor: accent }} />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-background border-2 border-foreground shadow-[2px_2px_0px_var(--color-foreground)] flex items-center justify-center shrink-0 overflow-hidden">
                        {subscription.logo_url ? (
                          <img src={subscription.logo_url} alt={`${subscription.name} logo`} className="w-full h-full object-contain p-2 bg-white" />
                        ) : (
                          <span className="font-black text-2xl" style={{ color: accent }}>{subscription.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="bg-secondary px-2.5 py-1 rounded-md border border-foreground/10 text-[9px] font-bold uppercase tracking-widest">
                        {subscription.category}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <h2 className="text-lg font-black uppercase tracking-wide leading-tight">{subscription.name}</h2>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3">
                        {subscription.description || 'Request this subscription and our team will confirm the available plan details.'}
                      </p>
                    </div>

                    <Link
                      href={`/services/buy-for-me/request?type=subscription&app=${encodeURIComponent(subscription.id)}`}
                      className="mt-6 min-h-12 flex items-center justify-center gap-2 border-2 border-foreground rounded-lg px-4 py-3 text-white font-black uppercase tracking-widest text-xs transition-transform hover:-translate-y-0.5"
                      style={{ backgroundColor: accent }}
                    >
                      Request subscription <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
