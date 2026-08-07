'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, MonitorPlay } from 'lucide-react'
import {
  getActiveSubscription,
  submitSubscriptionRequest,
  type ActiveSubscription,
} from './actions'

function safeAccent(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#333333'
}

export function SubscriptionRequestForm({ appId }: { appId: string }) {
  const router = useRouter()
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [accountEmail, setAccountEmail] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError(null)

    void getActiveSubscription(appId).then((result) => {
      if (cancelled) return
      if (result.error) setLoadError(result.error)
      else setSubscription(result.data)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [appId])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!subscription || submitting) return

    setSubmitting(true)
    setSubmitError(null)
    const result = await submitSubscriptionRequest({ appId: subscription.id, accountEmail, notes })

    if (!result.success) {
      setSubmitError(result.error)
      setSubmitting(false)
      return
    }

    router.push('/track')
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
        <p className="font-black uppercase tracking-widest text-sm">Loading subscription...</p>
      </div>
    )
  }

  if (loadError || !subscription) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="border-2 border-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl p-6 shadow-brutal">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <h1 className="text-xl font-black uppercase">Subscription unavailable</h1>
          <p className="mt-2 text-sm font-medium text-muted-foreground">{loadError}</p>
          <Link href="/services/subscriptions" className="mt-5 inline-flex items-center gap-2 border-2 border-foreground bg-card px-4 py-3 font-black uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to catalog
          </Link>
        </div>
      </div>
    )
  }

  const accent = safeAccent(subscription.accent_color)

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      <Link href="/services/subscriptions" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> App catalog
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex w-16 h-16 border-2 border-foreground items-center justify-center mb-5 shadow-[4px_4px_0px_var(--color-foreground)] rounded-xl text-white" style={{ backgroundColor: accent }}>
          <MonitorPlay className="w-8 h-8" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">One-tap subscription request</p>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-2">{subscription.name}</h1>
        <p className="text-sm text-muted-foreground font-medium mt-3 max-w-lg mx-auto">
          {subscription.description || 'Tell us which account should receive the subscription. Our team will confirm plan details and price before purchase.'}
        </p>
      </div>

      <form onSubmit={submit} className="brutal-card bg-card p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-300 p-4 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>The catalog item is verified as active. No shipping address is needed for this digital request.</p>
        </div>

        {submitError && (
          <div className="flex gap-3 border-2 border-red-500 bg-red-50 dark:bg-red-950/30 p-4 text-sm font-bold text-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0" /> {submitError}
          </div>
        )}

        <label className="block space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Account email (optional)</span>
          <input
            type="email"
            value={accountEmail}
            onChange={(event) => setAccountEmail(event.target.value)}
            placeholder="name@example.com"
            className="w-full p-4 border-2 border-foreground bg-background font-bold focus:ring-2 ring-primary outline-none"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Plan or billing notes (optional)</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="For example: annual plan, family plan, preferred billing region..."
            className="w-full p-4 border-2 border-foreground bg-background font-bold focus:ring-2 ring-primary outline-none resize-y"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full min-h-14 border-2 border-foreground text-white font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_var(--color-foreground)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: accent }}
        >
          {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Submit subscription request'}
        </button>
      </form>
    </div>
  )
}
