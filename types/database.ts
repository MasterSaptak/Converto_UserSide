// =====================================================
// CONVERTO PLATFORM — Shared Database Types
// =====================================================
// This file maps exactly to the schema_v3.sql tables.
// Used by both UserSide and ServerSide applications.
// =====================================================

// ── Profiles ──────────────────────────────────────────
export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  timezone: string | null;
  preferred_currency: string;
  avatar_url: string | null;
  is_staff: boolean;
  created_at: string;
  updated_at: string;
}

// ── Service Registry ──────────────────────────────────
export interface Service {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  is_active: boolean;
  requires_quote: boolean;
  supports_wallet: boolean;
  config: Record<string, unknown>;
  created_at: string;
}

export type ServiceSlug =
  | 'exchange'
  | 'buy_for_me'
  | 'ticket'
  | 'education'
  | 'global_payments';

// ── Service Requests (Hybrid) ─────────────────────────
export type RequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'Quote Sent'
  | 'Waiting Payment'
  | 'Payment Confirmed'
  | 'Assigned'
  | 'Accepted'
  | 'Processing'
  | 'Waiting Customer'
  | 'Waiting Vendor'
  | 'Purchased'
  | 'Booked'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected'
  | 'Refund Requested'
  | 'Refunded'
  | 'Expired';

export type RequestPriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export interface ServiceRequest {
  id: string;
  /** Nullable since v18: a staff-created case may have no customer account yet. */
  profile_id: string | null;
  service_id: string;
  /** v18 — every request now belongs to a case. */
  service_case_id: string | null;
  status: RequestStatus;
  priority: RequestPriority;
  amount: number | null;
  currency: string | null;
  assigned_staff_id: string | null;
  quote_id: string | null;
  metadata: Record<string, unknown>;
  notes: string | null;
  /** v18 — partial progress saved before a request is submitted. */
  draft_data: Record<string, unknown>;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
  // Joined relations
  profile?: Profile;
  service?: Service;
  quote?: Quote;
  service_case?: ServiceCase;
}

export type CaseStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type CaseHandlingMode = 'SELF_SERVICE' | 'CONCIERGE' | 'STAFF_CREATED' | 'IMPORTED' | 'API';

/**
 * The top-level unit of work (v18). Groups one or more `service_requests` —
 * e.g. "Medical Trip to India" holds the medical request, the visa, and the flights.
 */
export interface ServiceCase {
  id: string;
  case_uid: string | null;
  title: string;
  description: string | null;
  customer_id: string | null;
  status: CaseStatus;
  handling_mode: CaseHandlingMode;
  priority: RequestPriority;
  currency: string;
  /** Maintained by a DB trigger from request_line_items — never write directly. */
  total_amount: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  // Joined relations
  service_requests?: ServiceRequest[];
}

export type LineItemKind = 'fee' | 'service' | 'discount' | 'tax' | 'refund' | 'adjustment';

export interface RequestLineItem {
  id: string;
  service_case_id: string;
  service_request_id: string | null;
  kind: LineItemKind;
  label: string;
  description: string | null;
  quantity: number;
  /** Negative for discounts and refunds — enforced by a DB CHECK. */
  unit_amount: number;
  amount: number;
  currency: string;
  created_at: string;
}

export type RequiredDocumentStatus = 'pending' | 'requested' | 'received' | 'verified' | 'rejected';

/**
 * Models the requirement AND its fulfilment — a row exists at 'pending' before
 * anything is uploaded, so `file_url` is nullable.
 */
export interface RequiredDocument {
  id: string;
  service_case_id: string;
  service_request_id: string | null;
  name: string;
  category: string | null;
  is_mandatory: boolean;
  status: RequiredDocumentStatus;
  file_url: string | null;
  file_name: string | null;
  rejection_reason: string | null;
  due_date: string | null;
  created_at: string;
}

// ── Service-Specific Metadata Shapes ──────────────────
export interface ExchangeMetadata {
  from_currency: string;
  to_currency: string;
  exchange_rate?: number;
  recipient_name?: string;
  recipient_account?: string;
}

export interface BuyForMeMetadata {
  store: string;
  product_name: string;
  product_url?: string;
  product_details?: string;
  quantity: number;
}

export interface TicketMetadata {
  event_name?: string;
  origin?: string;
  destination?: string;
  travel_date?: string;
  return_date?: string;
  ticket_type?: string;
  passengers?: number;
}

export interface EducationMetadata {
  institution: string;
  student_name: string;
  student_id?: string;
  program?: string;
  semester?: string;
}

export interface GlobalPaymentMetadata {
  recipient_name: string;
  recipient_country: string;
  recipient_bank?: string;
  recipient_account?: string;
  purpose?: string;
}

// ── Quotes ────────────────────────────────────────────
// v21 replaced the old pending/accepted wording with a real lifecycle. A quote
// covers ONE service; a case with three services has three quotes, each
// approved on its own timeline.
export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'superseded';

export interface Quote {
  id: string;
  quote_uid: string | null;
  request_id: string | null;
  service_case_id: string | null;
  amount: number;
  currency_code: string | null;
  margin: number | null;
  /** Line items frozen at send time so later edits can't change what was agreed. */
  breakdown: Record<string, unknown> | null;
  valid_until: string | null;
  notes: string | null;
  status: QuoteStatus;
  sent_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  superseded_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// ── Payments ──────────────────────────────────────────
// One payment settles EVERY approved, unpaid quote on a case — the customer
// approves per service but pays once. `payment_allocations` maps it back.
export type PaymentStatus =
  | 'pending' | 'awaiting_confirmation' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type PaymentMethodKind = 'wallet' | 'manual' | 'gateway';

export interface PaymentMethod {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  config: Record<string, unknown> | null;
  created_at: string;
}

export interface Payment {
  id: string;
  payment_uid: string | null;
  request_id: string | null;
  quote_id: string | null;
  service_case_id: string | null;
  profile_id: string;
  amount: number;
  currency: string | null;
  status: PaymentStatus;
  method: PaymentMethodKind;
  reference: string | null;
  proof_url: string | null;
  proof_uploaded_at: string | null;
  confirmed_by: string | null;
  confirmed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentAllocation {
  id: string;
  payment_id: string;
  quote_id: string;
  amount: number;
  created_at: string;
}

// ── Wallet & Ledger ───────────────────────────────────
export interface Wallet {
  id: string;
  profile_id: string;
  created_at: string;
  accounts?: WalletAccount[];
}

export interface WalletAccount {
  id: string;
  wallet_id: string;
  currency_code: string;
  available_balance: number;
  locked_balance: number;
  reserved_balance: number;
  created_at: string;
  updated_at: string;
}

export type WalletTransactionType = 'credit' | 'debit' | 'lock' | 'unlock' | 'reserve' | 'release';
export type WalletTransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface WalletTransaction {
  id: string;
  wallet_account_id: string;
  amount: number;
  type: WalletTransactionType;
  status: WalletTransactionStatus;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

// ── Exchange Rates ────────────────────────────────────
export interface ExchangeRate {
  id: string;
  base_currency: string;
  target_currency: string;
  market_rate: number;
  buy_rate: number;
  sell_rate: number;
  margin: number;
  provider: string;
  is_active: boolean;
  updated_at: string;
}

// ── Conversations & Messages ──────────────────────────
export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'closed';

export interface Conversation {
  id: string;
  context_type: string;
  context_id: string | null;
  profile_id: string | null;
  assigned_staff_id: string | null;
  status: ConversationStatus;
  subject: string | null;
  last_message_at: string;
  created_at: string;
  messages?: Message[];
}

export type SenderType = 'user' | 'staff' | 'system' | 'ai';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: SenderType;
  message: string;
  attachments: MessageAttachment[];
  is_internal: boolean;
  is_read: boolean;
  created_at: string;
}

export interface MessageAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

// ── Notifications ─────────────────────────────────────
export type NotificationCategory = 'system' | 'request' | 'promo' | 'security' | 'payment' | 'chat';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  profile_id: string | null;
  category: NotificationCategory;
  priority: NotificationPriority;
  channel: string[];
  title: string;
  message: string;
  action_url: string | null;
  entity_type: string | null;
  entity_id: string | null;
  icon: string | null;
  metadata: Record<string, unknown>;
  is_read: boolean;
  created_by: string | null;
  created_at: string;
}

// ── Campaigns ─────────────────────────────────────────
export type CampaignType = 'promo' | 'ad' | 'announcement' | 'seasonal' | 'maintenance' | 'referral';

export interface Campaign {
  id: string;
  type: CampaignType;
  title: string;
  description: string | null;
  content: Record<string, unknown>;
  icon: string | null;
  color: string | null;
  href: string | null;
  tag: string | null;
  is_active: boolean;
  priority: number;
  starts_at: string;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// ── Settings ──────────────────────────────────────────
export interface Setting {
  key: string;
  value: unknown;
  description: string | null;
  category: string;
  updated_at: string;
  updated_by: string | null;
}

// ── Activity Logs ─────────────────────────────────────
export interface ActivityLog {
  id: string;
  profile_id: string | null;
  entity_type: string;
  entity_id: string | null;
  action: string;
  details: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
