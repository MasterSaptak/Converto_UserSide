'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BadgePercent,
  CircleAlert,
  Copy,
  CreditCard,
  GraduationCap,
  HeartPulse,
  MessageCircleMore,
  Plane,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ConvertoOrb } from '@/components/ai/ConvertoOrb';
import { useAuth } from '@/hooks/useAuth';
import { useCases } from '@/hooks/useCases';
import type { AiAction, AiInsight, AiMessage, ConvertoAiMode, ConvertoAiResponse } from '@/lib/ai/converto';

interface ChatMessage extends AiMessage {
  id: string;
  actions?: AiAction[];
  category?: string;
  insight?: AiInsight;
}

interface StarterAction {
  label: string;
  description: string;
  prompt: string;
  icon: LucideIcon;
  tone: string;
}

const STARTERS: StarterAction[] = [
  {
    label: 'Cheapest payment',
    description: 'Compare the best way to pay',
    prompt: 'Find the cheapest way to send money',
    icon: CreditCard,
    tone: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
  },
  {
    label: 'Exchange currency',
    description: 'Understand rates and options',
    prompt: 'Help me exchange currency at the best available rate',
    icon: RefreshCcw,
    tone: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
  },
  {
    label: 'Medical assistance',
    description: 'Plan care and travel support',
    prompt: 'Help me plan a medical trip',
    icon: HeartPulse,
    tone: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
  {
    label: 'Study abroad',
    description: 'Navigate education payments',
    prompt: 'Help me with an international education payment',
    icon: GraduationCap,
    tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  {
    label: 'Buy For Me',
    description: 'Shop globally with local payment',
    prompt: 'How does Buy For Me work?',
    icon: ShoppingBag,
    tone: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  },
  {
    label: 'Plan a trip',
    description: 'Flights, hotels, visa and more',
    prompt: 'Help me plan a trip with Converto',
    icon: Plane,
    tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "I'm Converto AI, your intelligent guide across Converto services.",
};

function createMessage(
  role: AiMessage['role'],
  content: string,
  actions?: AiAction[],
  category?: string,
  insight?: AiInsight
): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    actions,
    category,
    insight,
  };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { eyebrow: 'Good morning', line: 'Ready to make today simpler?' };
  if (hour < 18) return { eyebrow: 'Good afternoon', line: 'What can I take care of for you?' };
  return { eyebrow: 'Good evening', line: 'Need help with something before you switch off?' };
}

function getCategory(message: string) {
  const normalized = message.toLowerCase();
  if (/exchange|currency|rate|convert|\b[a-z]{3}\s+(?:to|in)\s+[a-z]{3}\b/.test(normalized)) return 'Exchange insight';
  if (/medical|hospital|doctor|treatment/.test(normalized)) return 'Medical guidance';
  if (/student|education|tuition|university/.test(normalized)) return 'Education support';
  if (/offer|discount|cashback|card|bank/.test(normalized)) return 'Offer finder';
  if (/track|order|case|request/.test(normalized)) return 'Request update';
  if (/flight|hotel|visa|travel|ticket/.test(normalized)) return 'Travel planning';
  if (/buy|shopping|amazon|product/.test(normalized)) return 'Shopping assistant';
  if (/payment|transfer|send money/.test(normalized)) return 'Payment guidance';
  return 'Converto insight';
}

function getCategoryIcon(category?: string): LucideIcon {
  if (category?.includes('Exchange')) return RefreshCcw;
  if (category?.includes('Medical')) return HeartPulse;
  if (category?.includes('Education')) return GraduationCap;
  if (category?.includes('Offer')) return BadgePercent;
  if (category?.includes('Travel')) return Plane;
  if (category?.includes('Shopping')) return ShoppingBag;
  return Sparkles;
}

function getThinkingSteps(message: string) {
  const normalized = message.toLowerCase();
  if (/exchange|currency|rate|payment|transfer|card|offer/.test(normalized)) {
    return ['Understanding your request', 'Checking Converto context', 'Comparing the useful options'];
  }
  if (/track|order|case|request/.test(normalized)) {
    return ['Reading your request', 'Checking recent activity', 'Preparing a clear update'];
  }
  if (/medical|hospital|doctor/.test(normalized)) {
    return ['Understanding your needs', 'Reviewing the safest next steps', 'Preparing your options'];
  }
  return ['Understanding your goal', 'Checking your Converto context', 'Preparing the next best step'];
}

function getFollowUps(category?: string) {
  if (category?.includes('Exchange')) return ['Compare options', 'Explain the fees'];
  if (category?.includes('Payment')) return ['Compare options', 'Show current offers'];
  if (category?.includes('Medical')) return ['What documents do I need?', 'Talk to support'];
  if (category?.includes('Travel')) return ['Help me plan the next step', 'Show travel services'];
  if (category?.includes('Request')) return ['What happens next?', 'Talk to support'];
  return ['Tell me more', 'What should I do next?'];
}

export default function ConvertoAiPage() {
  const { user, profile } = useAuth();
  const { cases } = useCases({ limit: 12 });
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [mode, setMode] = useState<ConvertoAiMode | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [greeting, setGreeting] = useState({ eyebrow: 'Welcome back', line: 'How can I help today?' });
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [activeQuery, setActiveQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const storageKey = useMemo(
    () => user?.id ? `converto-ai-chat:${user.id}` : null,
    [user?.id]
  );
  const hasConversation = messages.some((message) => message.id !== 'welcome');
  const activeCases = cases.filter((item) => !['completed', 'cancelled'].includes(item.status)).length;
  const firstName = profile?.full_name?.trim().split(/\s+/)[0]
    || profile?.username
    || user?.email?.split('@')[0]
    || 'there';
  const thinkingSteps = useMemo(() => getThinkingSteps(activeQuery), [activeQuery]);
  const latestAssistantId = [...messages].reverse().find((message) => message.role === 'assistant' && message.id !== 'welcome')?.id;

  useEffect(() => setGreeting(getGreeting()), []);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHasLoaded(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || !hasLoaded) return;
    window.localStorage.setItem(storageKey, JSON.stringify(messages.slice(-40)));
  }, [hasLoaded, messages, storageKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending, thinkingIndex]);

  useEffect(() => {
    const prompt = new URLSearchParams(window.location.search).get('prompt');
    if (prompt) setInput(prompt.slice(0, 3_000));
  }, []);

  useEffect(() => {
    if (!isSending) {
      setThinkingIndex(0);
      return;
    }
    const interval = window.setInterval(() => {
      setThinkingIndex((current) => (current + 1) % thinkingSteps.length);
    }, 1_350);
    return () => window.clearInterval(interval);
  }, [isSending, thinkingSteps.length]);

  const sendMessage = async (preset?: string) => {
    const content = (preset ?? input).trim();
    if (!content || isSending) return;

    const category = getCategory(content);
    const userMessage = createMessage('user', content);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setActiveQuery(content);
    setIsSending(true);
    if (inputRef.current) inputRef.current.style.height = 'auto';

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.id !== 'welcome')
            .slice(-12)
            .map(({ role, content: messageContent }) => ({ role, content: messageContent })),
        }),
      });

      const data = await response.json() as ConvertoAiResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || 'Converto AI could not respond.');

      setMode(data.mode);
      setMessages((current) => [
        ...current,
        createMessage('assistant', data.message, data.actions, category, data.insight),
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Converto AI could not respond.';
      toast.error(message);
      setMessages((current) => [
        ...current,
        createMessage(
          'assistant',
          "I couldn't complete that request right now. Try again, or open Converto Support if the issue continues.",
          [{ label: 'Talk to support', href: '/support?chat=open' }],
          'Connection update'
        ),
      ]);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const clearConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setMode(null);
    setInput('');
    if (storageKey) window.localStorage.removeItem(storageKey);
    inputRef.current?.focus();
  };

  const copyMessage = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-4 pb-4">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            aria-label="Back to dashboard"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-card/80 shadow-sm backdrop-blur-xl transition-all hover:-translate-x-0.5 hover:border-indigo-500/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <ConvertoOrb state={isSending ? 'thinking' : hasConversation ? 'speaking' : 'idle'} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-heading text-2xl font-black uppercase leading-none tracking-tight">Converto AI</h1>
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">
                Beta
              </span>
            </div>
            <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Converto intelligence
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearConversation}
          className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-foreground/15 bg-card/80 px-3 py-2 text-[9px] font-black uppercase tracking-widest shadow-sm backdrop-blur-xl transition-colors hover:border-indigo-500/40 hover:text-indigo-600"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New conversation</span>
        </button>
      </header>

      <div className="grid min-h-[72vh] flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="nova-chat-shell relative flex min-h-[72vh] min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/50 bg-card/75 shadow-[0_24px_80px_rgba(44,42,84,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-card/65">
          <div className="nova-ambient pointer-events-none absolute inset-0" />

          <div className="relative z-10 flex items-center justify-between border-b border-foreground/8 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {mode === 'ai' ? 'AI + live data' : mode === 'data' ? 'Live Converto data' : 'Converto data connected'}
            </div>
            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-emerald-600" /> Private by design
            </div>
          </div>

          <div className="hide-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto">
            {!hasConversation ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="mx-auto flex min-h-full w-full max-w-4xl flex-col items-center justify-center px-4 py-8 text-center sm:px-8 sm:py-12"
              >
                <ConvertoOrb state="idle" size="lg" />
                <p className="mt-7 text-[10px] font-black uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">
                  {greeting.eyebrow}, {firstName}
                </p>
                <h2 className="mt-2 max-w-2xl font-heading text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl">
                  {greeting.line}
                </h2>
                <p className="mt-4 max-w-xl text-xs font-bold leading-6 text-muted-foreground sm:text-sm">
                  Payments, travel, education, shopping and support—understood in one conversation.
                </p>

                {activeCases > 0 && (
                  <Link
                    href="/user/cases"
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/8 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-indigo-700 hover:bg-indigo-500/15 dark:text-indigo-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {activeCases} active {activeCases === 1 ? 'request' : 'requests'}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}

                <div className="mt-8 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {STARTERS.map((starter, index) => (
                    <motion.button
                      key={starter.label}
                      type="button"
                      onClick={() => void sendMessage(starter.prompt)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + index * 0.035 }}
                      className="group flex min-h-[82px] items-center gap-3 rounded-2xl border border-foreground/10 bg-card/70 p-3 text-left shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-indigo-500/35 hover:shadow-[0_12px_30px_rgba(79,70,229,0.1)]"
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${starter.tone}`}>
                        <starter.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-black uppercase tracking-wide">{starter.label}</span>
                        <span className="mt-1 block text-[9px] font-bold leading-4 text-muted-foreground">{starter.description}</span>
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-7 sm:py-8">
                {messages.filter((message) => message.id !== 'welcome').map((message) => {
                  const CategoryIcon = getCategoryIcon(message.category);
                  const isLatestAssistant = message.id === latestAssistantId;
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {message.role === 'assistant' ? (
                        <ConvertoOrb state={isLatestAssistant ? 'speaking' : 'idle'} size="sm" className="mt-1" />
                      ) : (
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                          <UserRound className="h-4 w-4" />
                        </div>
                      )}

                      <div className={`group flex min-w-0 max-w-[88%] flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {message.role === 'user' ? (
                          <div className="rounded-[20px] rounded-tr-md bg-foreground px-4 py-3 text-sm leading-6 text-background shadow-sm">
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                        ) : (
                          <div className="w-full overflow-hidden rounded-[22px] rounded-tl-md border border-foreground/10 bg-card/85 shadow-[0_12px_35px_rgba(44,42,84,0.08)] backdrop-blur-xl">
                            <div className="flex items-center justify-between border-b border-foreground/8 bg-gradient-to-r from-indigo-500/8 to-rose-500/5 px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                                  <CategoryIcon className="h-3.5 w-3.5" />
                                </span>
                                <div>
                                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-700 dark:text-indigo-300">{message.insight?.eyebrow || message.category || 'Converto insight'}</p>
                                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">Personalized for Converto</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => void copyMessage(message.content)}
                                aria-label="Copy Converto AI response"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            {message.insight && (
                              <div className="border-b border-foreground/8 bg-gradient-to-br from-indigo-500/[0.06] to-cyan-500/[0.04] px-4 py-4 sm:px-5">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="font-heading text-xl font-black uppercase tracking-tight">{message.insight.title}</p>
                                    {message.insight.valueLabel && (
                                      <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">{message.insight.valueLabel}</p>
                                    )}
                                  </div>
                                  {message.insight.value && (
                                    <p className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-300">{message.insight.value}</p>
                                  )}
                                </div>
                                {message.insight.details.length > 0 && (
                                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                    {message.insight.details.map((detail) => (
                                      <div key={`${message.id}-${detail.label}`} className="rounded-xl border border-foreground/8 bg-background/65 px-3 py-2.5">
                                        <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">{detail.label}</p>
                                        <p className="mt-1 text-xs font-black">{detail.value}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{message.insight.source}</span>
                                  {message.insight.asOf && <span>Updated {new Date(message.insight.asOf).toLocaleString()}</span>}
                                </div>
                              </div>
                            )}
                            <div className="px-4 py-4 text-sm font-medium leading-6 text-foreground/85 sm:px-5">
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                            {message.actions && message.actions.length > 0 && (
                              <div className="flex flex-wrap gap-2 border-t border-foreground/8 px-4 py-3 sm:px-5">
                                {message.actions.map((action, index) => (
                                  <Link
                                    key={`${message.id}-${action.href}`}
                                    href={action.href}
                                    className={index === 0
                                      ? 'inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-2 text-[9px] font-black uppercase tracking-wider text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-500'
                                      : 'inline-flex items-center gap-1.5 rounded-full border border-foreground/12 bg-background/60 px-3 py-2 text-[9px] font-black uppercase tracking-wider transition-colors hover:border-indigo-500/30 hover:text-indigo-600'}
                                  >
                                    {action.label} <ArrowRight className="h-3 w-3" />
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {message.role === 'assistant' && isLatestAssistant && !isSending && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {getFollowUps(message.category).map((followUp) => (
                              <button
                                key={followUp}
                                type="button"
                                onClick={() => void sendMessage(followUp)}
                                className="rounded-full border border-foreground/10 bg-card/60 px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-muted-foreground transition-colors hover:border-indigo-500/30 hover:text-indigo-600"
                              >
                                {followUp}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                <AnimatePresence mode="wait">
                  {isSending && (
                    <motion.div
                      key={thinkingSteps[thinkingIndex]}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-3"
                    >
                      <ConvertoOrb state="thinking" size="sm" />
                      <div className="rounded-full border border-indigo-500/15 bg-indigo-500/8 px-4 py-2.5 text-[10px] font-bold text-indigo-800 shadow-sm backdrop-blur-xl dark:text-indigo-200">
                        <span className="mr-2 inline-flex gap-1 align-middle">
                          <span className="nova-thinking-dot h-1 w-1 rounded-full bg-indigo-500" />
                          <span className="nova-thinking-dot h-1 w-1 rounded-full bg-indigo-500 [animation-delay:160ms]" />
                          <span className="nova-thinking-dot h-1 w-1 rounded-full bg-indigo-500 [animation-delay:320ms]" />
                        </span>
                        {thinkingSteps[thinkingIndex]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <div className="relative z-20 px-3 pb-3 sm:px-5 sm:pb-5">
            <div className="nova-composer flex items-end gap-2 rounded-[22px] border border-foreground/12 bg-background/80 p-2.5 shadow-[0_16px_45px_rgba(44,42,84,0.14)] backdrop-blur-2xl transition-all focus-within:border-indigo-500/35 focus-within:shadow-[0_18px_50px_rgba(79,70,229,0.16)]">
              <span className="mb-2 ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value.slice(0, 3_000));
                  event.currentTarget.style.height = 'auto';
                  event.currentTarget.style.height = `${Math.min(event.currentTarget.scrollHeight, 128)}px`;
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                rows={1}
                placeholder="Ask Converto AI about rates, requests, rewards or services..."
                className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-1 py-3 text-sm font-medium outline-none placeholder:text-muted-foreground/70"
                disabled={isSending}
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={!input.trim() || isSending}
                aria-label="Send message to Converto AI"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-700 text-white shadow-[0_8px_22px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(79,70,229,0.4)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[8px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Converto AI can make mistakes. Confirm important prices and actions.
            </p>
          </div>
        </section>

        <aside className="hidden flex-col gap-4 lg:flex">
          <div className="relative overflow-hidden rounded-[24px] border border-white/50 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-5 text-white shadow-[0_18px_55px_rgba(49,46,129,0.22)] dark:border-white/10">
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="relative">
              <ConvertoOrb state={isSending ? 'thinking' : 'idle'} size="md" />
              <p className="mt-5 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-200">Your Converto world</p>
              <h2 className="mt-2 font-heading text-2xl font-black leading-tight">One assistant.<br />Every service.</h2>
              <p className="mt-3 text-[10px] font-bold leading-5 text-indigo-100/70">
                Converto AI understands your rewards, recent requests and published rates when they matter.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/8 p-3 backdrop-blur-sm">
                  <p className="text-xl font-black">{activeCases}</p>
                  <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-indigo-200">Active requests</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/8 p-3 backdrop-blur-sm">
                  <p className="text-xl font-black">24/7</p>
                  <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-indigo-200">Guidance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-foreground/10 bg-card/75 p-4 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h3 className="font-heading text-sm font-black uppercase">Safe by design</h3>
            </div>
            <p className="mt-3 text-[9px] font-bold leading-5 text-muted-foreground">
              Payments, bookings and account changes always need a separate confirmation step.
            </p>
          </div>

          <Link
            href="/support?chat=open"
            className="group flex items-center justify-between rounded-[22px] border border-foreground/10 bg-card/75 p-4 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-indigo-500/30"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background">
                <MessageCircleMore className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[9px] font-black uppercase tracking-wider">Human support</span>
                <span className="mt-1 block text-[8px] font-bold text-muted-foreground">Talk to a Converto agent</span>
              </span>
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex gap-2 rounded-[18px] border border-amber-500/20 bg-amber-500/8 p-3 text-amber-900 dark:text-amber-200">
            <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p className="text-[8px] font-bold leading-4">
              Medical guidance is informational and not a diagnosis or emergency service.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
