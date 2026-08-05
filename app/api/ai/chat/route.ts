import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { BANK_CARDS } from '@/lib/seo/bank-cards';
import {
  CONVERTO_AI_INSTRUCTIONS,
  CONVERTO_AI_MODEL,
  getGuidedResponse,
  getSuggestedActions,
  type AiInsight,
  type AiMessage,
  type ConvertoAiResponse,
} from '@/lib/ai/converto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 3_000;
const COMMON_CURRENCIES = new Set([
  'AED', 'AUD', 'BDT', 'CAD', 'CNY', 'EUR', 'GBP', 'INR', 'JPY', 'SAR', 'SGD', 'THB', 'TRY', 'USD',
]);

interface ChatRequestBody {
  messages?: unknown;
}

interface OpenAiContentPart {
  type?: string;
  text?: string;
}

interface OpenAiOutputItem {
  type?: string;
  content?: OpenAiContentPart[];
}

interface OpenAiResponseBody {
  output?: OpenAiOutputItem[];
  error?: { message?: string };
}

interface RewardRow {
  available_c_points: number | string | null;
  lifetime_c_points: number | string | null;
  tier: string | null;
  current_streak: number | string | null;
}

interface CaseRow {
  id: string;
  case_uid: string;
  title: string;
  status: string;
  currency: string | null;
  total_amount: number | string | null;
  updated_at: string | null;
}

interface CurrencyRateRow {
  base_currency: string;
  target_currency: string;
  market_rate: number | string | null;
  custom_rate: number | string | null;
  updated_at: string | null;
  admin_updated_at: string | null;
}

interface CorridorRow {
  from_currency: string;
  to_currency: string;
  market_rate: number | string | null;
  custom_rate: number | string | null;
  fee_type: string | null;
  fee_flat: number | string | null;
  fee_percentage: number | string | null;
  minimum_amount: number | string | null;
  maximum_amount: number | string | null;
  updated_at: string | null;
}

interface ConvertoContext {
  rewards: RewardRow | null;
  cases: CaseRow[];
  rates: CurrencyRateRow[];
  corridors: CorridorRow[];
}

interface ResolvedRate {
  from: string;
  to: string;
  customRate: number;
  marketRate: number | null;
  updatedAt: string | null;
  corridor: CorridorRow | null;
  source: string;
}

function parseMessages(value: unknown): AiMessage[] | null {
  if (!Array.isArray(value)) return null;

  const messages = value.slice(-MAX_MESSAGES).map((item): AiMessage | null => {
    if (!item || typeof item !== 'object') return null;
    const role = 'role' in item ? item.role : null;
    const content = 'content' in item ? item.content : null;

    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    const cleanContent = content.trim().slice(0, MAX_MESSAGE_LENGTH);
    return cleanContent ? { role, content: cleanContent } : null;
  });

  if (messages.some((message) => message === null)) return null;
  return messages as AiMessage[];
}

function readOutputText(response: OpenAiResponseBody): string | null {
  const text = response.output
    ?.flatMap((item) => item.content ?? [])
    .filter((part) => part.type === 'output_text' && typeof part.text === 'string')
    .map((part) => part.text?.trim())
    .filter((part): part is string => Boolean(part))
    .join('\n');
  return text || null;
}

function toNumber(value: number | string | null | undefined): number | null {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

function formatMoney(value: number | string | null, currency: string | null): string {
  const amount = toNumber(value);
  if (amount === null) return 'Not quoted';
  return `${formatNumber(amount)} ${currency || ''}`.trim();
}

function getCurrencyPair(message: string, context: ConvertoContext): [string, string] | null {
  const knownCurrencies = new Set(COMMON_CURRENCIES);
  context.rates.forEach((rate) => {
    knownCurrencies.add(rate.base_currency.toUpperCase());
    knownCurrencies.add(rate.target_currency.toUpperCase());
  });
  context.corridors.forEach((corridor) => {
    knownCurrencies.add(corridor.from_currency.toUpperCase());
    knownCurrencies.add(corridor.to_currency.toUpperCase());
  });

  const currencies = [...message.toUpperCase().matchAll(/\b[A-Z]{3}\b/g)]
    .map((match) => match[0])
    .filter((currency) => knownCurrencies.has(currency));
  return currencies.length >= 2 ? [currencies[0], currencies[1]] : null;
}

function getRequestedAmount(message: string): number | null {
  const match = message.match(/(?:^|\s)(\d[\d,]*(?:\.\d+)?)(?=\s|$)/);
  if (!match) return null;
  const amount = Number(match[1].replaceAll(',', ''));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function resolveRate(from: string, to: string, context: ConvertoContext): ResolvedRate | null {
  const directRate = context.rates.find((rate) =>
    rate.base_currency.toUpperCase() === from && rate.target_currency.toUpperCase() === to
  );
  const directCorridor = context.corridors.find((corridor) =>
    corridor.from_currency.toUpperCase() === from && corridor.to_currency.toUpperCase() === to
  ) ?? null;

  const directCustom = toNumber(directRate?.custom_rate) ?? toNumber(directCorridor?.custom_rate);
  if (directCustom && directCustom > 0) {
    return {
      from,
      to,
      customRate: directCustom,
      marketRate: toNumber(directRate?.market_rate) ?? toNumber(directCorridor?.market_rate),
      updatedAt: directRate?.admin_updated_at || directRate?.updated_at || directCorridor?.updated_at || null,
      corridor: directCorridor,
      source: directRate ? 'Converto treasury rate' : 'Converto transfer corridor',
    };
  }

  const reverseRate = context.rates.find((rate) =>
    rate.base_currency.toUpperCase() === to && rate.target_currency.toUpperCase() === from
  );
  const reverseCorridor = context.corridors.find((corridor) =>
    corridor.from_currency.toUpperCase() === to && corridor.to_currency.toUpperCase() === from
  );
  const reverseCustom = toNumber(reverseRate?.custom_rate) ?? toNumber(reverseCorridor?.custom_rate);
  if (reverseCustom && reverseCustom > 0) {
    const reverseMarket = toNumber(reverseRate?.market_rate) ?? toNumber(reverseCorridor?.market_rate);
    return {
      from,
      to,
      customRate: 1 / reverseCustom,
      marketRate: reverseMarket && reverseMarket > 0 ? 1 / reverseMarket : null,
      updatedAt: reverseRate?.admin_updated_at || reverseRate?.updated_at || reverseCorridor?.updated_at || null,
      corridor: directCorridor,
      source: 'Converto treasury rate (reverse pair)',
    };
  }

  return null;
}

function getFeeDetail(amount: number | null, corridor: CorridorRow | null): string | null {
  if (!corridor?.fee_type) return null;
  const flat = toNumber(corridor.fee_flat) ?? 0;
  const percentage = toNumber(corridor.fee_percentage) ?? 0;

  if (corridor.fee_type === 'flat') return `${formatNumber(flat)} ${corridor.from_currency} flat`;
  if (corridor.fee_type === 'percentage') {
    return amount ? `${formatNumber(amount * percentage / 100)} ${corridor.from_currency} (${formatNumber(percentage)}%)` : `${formatNumber(percentage)}%`;
  }
  if (corridor.fee_type === 'hybrid') {
    const total = amount ? flat + amount * percentage / 100 : null;
    return total
      ? `${formatNumber(total)} ${corridor.from_currency} (${formatNumber(flat)} + ${formatNumber(percentage)}%)`
      : `${formatNumber(flat)} ${corridor.from_currency} + ${formatNumber(percentage)}%`;
  }
  return null;
}

function buildExchangeAnswer(message: string, context: ConvertoContext): ConvertoAiResponse | null {
  const pair = getCurrencyPair(message, context);
  if (!pair) return null;
  const [from, to] = pair;
  const rate = resolveRate(from, to, context);

  if (!rate) {
    return {
      mode: 'data',
      message: `I checked Converto's current published rates, but ${from} to ${to} is not available right now. Try another currency pair or ask Support to confirm whether this corridor can be arranged.`,
      actions: [
        { label: 'Check exchange', href: '/services/exchange' },
        { label: 'Talk to support', href: '/support?chat=open' },
      ],
    };
  }

  const requestedAmount = getRequestedAmount(message);
  const displayAmount = requestedAmount ?? 1_000;
  const convertedAmount = displayAmount * rate.customRate;
  const fee = getFeeDetail(requestedAmount, rate.corridor);
  const rateText = formatNumber(rate.customRate, 6);
  const details = [
    {
      label: requestedAmount ? `${formatNumber(requestedAmount)} ${from}` : `Example: 1,000 ${from}`,
      value: `${formatNumber(convertedAmount, 2)} ${to}`,
    },
  ];

  if (rate.marketRate && rate.marketRate > 0) {
    details.push({ label: 'Reference market rate', value: formatNumber(rate.marketRate, 6) });
  }
  if (fee) details.push({ label: 'Published fee', value: fee });

  const amountLine = requestedAmount
    ? `At that rate, ${formatNumber(requestedAmount)} ${from} is approximately ${formatNumber(convertedAmount, 2)} ${to}.`
    : `For reference, 1,000 ${from} is approximately ${formatNumber(convertedAmount, 2)} ${to}.`;
  const feeLine = fee ? ` The published corridor fee is ${fee}.` : '';

  const insight: AiInsight = {
    kind: 'exchange',
    eyebrow: 'Live Converto rate',
    title: `${from} → ${to}`,
    value: rateText,
    valueLabel: `${to} per ${from}`,
    details,
    source: rate.source,
    asOf: rate.updatedAt || undefined,
  };

  return {
    mode: 'data',
    message: `The current published Converto rate is 1 ${from} = ${rateText} ${to}. ${amountLine}${feeLine} Rates can change until your transaction is confirmed.`,
    actions: [
      { label: 'Start exchange', href: `/services/exchange/request?from=${from}&to=${to}${requestedAmount ? `&amount=${requestedAmount}` : ''}` },
      { label: 'Talk to support', href: '/support?chat=open' },
    ],
    insight,
  };
}

function buildRewardsAnswer(message: string, context: ConvertoContext): ConvertoAiResponse | null {
  if (!/\b(reward|rewards|points|c-points|tier|streak)\b/i.test(message)) return null;
  if (!context.rewards) return null;

  const available = toNumber(context.rewards.available_c_points) ?? 0;
  const lifetime = toNumber(context.rewards.lifetime_c_points) ?? 0;
  const streak = toNumber(context.rewards.current_streak) ?? 0;
  const tier = context.rewards.tier || 'Wood';

  return {
    mode: 'data',
    message: `You currently have ${formatNumber(available)} available C-Points and you are in the ${tier} tier. Your lifetime total is ${formatNumber(lifetime)} C-Points, with a ${formatNumber(streak)}-day streak.`,
    actions: [{ label: 'View rewards', href: '/profile' }],
    insight: {
      kind: 'rewards',
      eyebrow: 'Your live rewards',
      title: `${tier} tier`,
      value: formatNumber(available),
      valueLabel: 'Available C-Points',
      details: [
        { label: 'Lifetime earned', value: formatNumber(lifetime) },
        { label: 'Current streak', value: `${formatNumber(streak)} days` },
      ],
      source: 'Your Converto rewards account',
    },
  };
}

function buildRequestAnswer(message: string, context: ConvertoContext): ConvertoAiResponse | null {
  if (!/(latest request|my requests?|request status|track.*(?:case|request)|case\s*#|order status)/i.test(message)) return null;
  const requestedUid = context.cases.find((item) => message.toUpperCase().includes(item.case_uid.toUpperCase()));
  const serviceCase = requestedUid || context.cases[0];

  if (!serviceCase) {
    return {
      mode: 'data',
      message: "I checked your Converto account and couldn't find a recent service request.",
      actions: [{ label: 'Explore services', href: '/services' }],
    };
  }

  return {
    mode: 'data',
    message: `Your latest request is ${serviceCase.case_uid}: ${serviceCase.title}. Its current status is ${serviceCase.status}.`,
    actions: [
      { label: 'Open request', href: `/user/cases/${serviceCase.id}` },
      { label: 'Talk to support', href: '/support?chat=open' },
    ],
    insight: {
      kind: 'request',
      eyebrow: 'Live request status',
      title: serviceCase.case_uid,
      value: serviceCase.status,
      valueLabel: serviceCase.title,
      details: [
        { label: 'Quoted total', value: formatMoney(serviceCase.total_amount, serviceCase.currency) },
        { label: 'Last activity', value: serviceCase.updated_at ? new Date(serviceCase.updated_at).toLocaleDateString('en-GB') : 'Unavailable' },
      ],
      source: 'Your Converto service case',
      asOf: serviceCase.updated_at || undefined,
    },
  };
}

function buildOffersAnswer(message: string): ConvertoAiResponse | null {
  if (!/\b(offer|offers|cashback|bank card|credit card|supported card)\b/i.test(message)) return null;
  const normalized = message.toLowerCase();
  const exactMatches = BANK_CARDS.filter((card) =>
    normalized.includes(card.bankName.toLowerCase()) || normalized.includes(card.cardName.toLowerCase())
  );
  const cards = (exactMatches.length ? exactMatches : BANK_CARDS.filter((card) => card.supported)).slice(0, 3);

  return {
    mode: 'data',
    message: `I checked the current Converto card catalog. ${cards.map((card) => card.cardName).join(', ')} ${cards.length === 1 ? 'is' : 'are'} supported. Open the offer page to verify the latest eligibility, limits and cashback terms before paying.`,
    actions: cards.map((card) => ({ label: card.cardName, href: `/offers/${card.slug}` })).slice(0, 2),
    insight: {
      kind: 'offers',
      eyebrow: 'Converto offer catalog',
      title: exactMatches.length ? 'Matching card' : 'Supported cards',
      details: cards.map((card) => ({ label: card.bankName, value: card.cardName })),
      source: 'Current Converto card catalog',
    },
  };
}

function buildDataAnswer(message: string, context: ConvertoContext): ConvertoAiResponse | null {
  return buildExchangeAnswer(message, context)
    || buildRewardsAnswer(message, context)
    || buildRequestAnswer(message, context)
    || buildOffersAnswer(message);
}

async function getConvertoContext(userId: string): Promise<ConvertoContext> {
  const supabase = await createClient();
  const [rewardsResult, casesResult, ratesResult, corridorsResult] = await Promise.all([
    supabase
      .from('user_rewards')
      .select('available_c_points,lifetime_c_points,tier,current_streak')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('service_cases')
      .select('id,case_uid,title,status,currency,total_amount,updated_at')
      .eq('customer_id', userId)
      .order('updated_at', { ascending: false })
      .limit(8),
    supabase
      .from('currency_rates')
      .select('base_currency,target_currency,market_rate,custom_rate,updated_at,admin_updated_at')
      .limit(100),
    supabase
      .from('transfer_corridors')
      .select('from_currency,to_currency,market_rate,custom_rate,fee_type,fee_flat,fee_percentage,minimum_amount,maximum_amount,updated_at')
      .eq('is_active', true)
      .limit(100),
  ]);

  return {
    rewards: (rewardsResult.data as RewardRow | null) ?? null,
    cases: (casesResult.data as CaseRow[] | null) ?? [],
    rates: (ratesResult.data as CurrencyRateRow[] | null) ?? [],
    corridors: (corridorsResult.data as CorridorRow[] | null) ?? [],
  };
}

function getContextText(context: ConvertoContext) {
  const rewards = context.rewards
    ? `${context.rewards.available_c_points ?? 0} available C-Points; tier ${context.rewards.tier ?? 'unknown'}; ${context.rewards.current_streak ?? 0}-day streak`
    : 'not available';
  const cases = context.cases.length
    ? context.cases.map((item) => `${item.case_uid}: ${item.title} (${item.status}, ${formatMoney(item.total_amount, item.currency)})`).join('; ')
    : 'none';
  const rates = context.rates.length
    ? context.rates.slice(0, 30).map((item) => `${item.base_currency}/${item.target_currency}: market ${item.market_rate}, Converto ${item.custom_rate}`).join('; ')
    : 'none available';

  return [
    'Authenticated, read-only Converto context:',
    `Rewards: ${rewards}`,
    `Recent requests: ${cases}`,
    `Current published rates: ${rates}`,
    'Never claim a payment, booking, cancellation, or request was completed.',
  ].join('\n');
}

function json(payload: ConvertoAiResponse | { error: string }, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: 'Please sign in to use Converto AI.' }, 401);

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const messages = parseMessages(body.messages);
  const latestUserMessage = messages?.filter((message) => message.role === 'user').at(-1)?.content;
  if (!messages?.length || !latestUserMessage) return json({ error: 'Enter a message to continue.' }, 400);

  const context = await getConvertoContext(user.id).catch((): ConvertoContext => ({
    rewards: null,
    cases: [],
    rates: [],
    corridors: [],
  }));
  const dataAnswer = buildDataAnswer(latestUserMessage, context);
  if (dataAnswer) return json(dataAnswer);

  const contextText = getContextText(context);
  const actions = getSuggestedActions(latestUserMessage);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({
      message: getGuidedResponse(latestUserMessage, contextText),
      mode: 'guided',
      actions,
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CONVERTO_AI_MODEL,
        instructions: `${CONVERTO_AI_INSTRUCTIONS}\n\n${contextText}`,
        input: messages,
        reasoning: { effort: 'low' },
        text: { verbosity: 'medium' },
        safety_identifier: createHash('sha256').update(`converto:${user.id}`).digest('hex'),
        store: false,
      }),
      signal: controller.signal,
    });

    const openAiBody = (await openAiResponse.json()) as OpenAiResponseBody;
    const assistantMessage = openAiResponse.ok ? readOutputText(openAiBody) : null;
    if (!assistantMessage) {
      console.error('Converto AI provider error:', openAiResponse.status, openAiBody.error?.message);
      return json({
        message: getGuidedResponse(latestUserMessage, contextText),
        mode: 'guided',
        actions,
      });
    }

    return json({ message: assistantMessage, mode: 'ai', actions });
  } catch (error) {
    console.error('Converto AI request failed:', error);
    return json({
      message: getGuidedResponse(latestUserMessage, contextText),
      mode: 'guided',
      actions,
    });
  } finally {
    clearTimeout(timeout);
  }
}
