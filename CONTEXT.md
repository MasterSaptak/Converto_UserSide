# CONTEXT.md - Converto UserSide (Customer Portal)

# 1. Project Overview
- **Purpose**: A seamless customer-facing portal for the Converto platform.
- **Business goal**: Empower customers to track orders, perform financial transactions, and get instant live support.
- **Problem being solved**: Providing a frictionless, highly responsive, and premium user experience for clients to manage their Converto services.
- **Target users**: Customers and clients of Converto.
- **Current development status**: Active development. Real-time live chat modal, system status event badges, PWA installation (`@ducanh2912/next-pwa`), atomic RPC messaging, and notifications are fully implemented. Deployed on Vercel.

# 2. Architecture
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS. Focus on premium glassmorphism aesthetics with resilient Dark/Light mode support via CSS variables (`bg-background`, `text-foreground`).
- **Backend**: Next.js Server Actions handle core logic securely using Supabase RPCs.
- **Database**: Supabase PostgreSQL.
- **Authentication**: Supabase Auth with SSR cookies.
- **PWA**: Powered by `@ducanh2912/next-pwa` with `192x192` and `512x512` maskable icons in `manifest.json`.
- **Deployment**: Vercel.
- **Data Flow**: User sends a message -> `sendCustomerChatMessage` calls Postgres RPC `fn_customer_send_chat_message` -> Message & participant inserted atomically -> Supabase realtime pushes updates to UI & staff.

# 3. Folder Structure
- `/app`: Next.js App Router root. Contains `/support`, `/dashboard`, `/track`, etc.
- `/components`: Granular React components (`/layout`, `/auth`, `/dashboard`, `/providers`).
- `/lib`: Helper functions, Supabase clients (`client.ts`, `server.ts`, `middleware.ts`), notification hooks (`useNotifications.ts`).
- `/hooks`: Custom hooks.
- `/public`: Public assets and PWA `manifest.json`.

# 4. Technologies
- **Next.js (15.x)**: Framework.
- **React (19.x)**: UI Library.
- **TypeScript**: Strict type checking.
- **Tailwind CSS**: Styling.
- **@ducanh2912/next-pwa**: PWA service worker wrapper.
- **Supabase JS / SSR**: Backend-as-a-service.
- **Framer Motion**: Animations.
- **Sonner**: Toast Notifications.

# 5. Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase API URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anonymous key.
- `SUPABASE_SERVICE_ROLE_KEY`: Secret Admin key. Used on the server to execute admin queries securely.

# 6. Database
- **profiles**: Customer profiles.
- **communication_conversations**: Chat threads (`is_deleted`, `status`, `channel`, `priority`).
- **communication_messages**: Individual lines of dialogue (`sender_type`: `customer`, `staff`, `system`).
- **communication_participants**: Links users to conversations (`user_type = 'customer'`).
- **notifications**: Stores system and chat notifications (`target_role = 'customer'`).
- **service_cases** & **service_requests** (v18): Core request architecture grouping requests into cases.
- **quotes** (v21): Per-service quotes. Immutable prices enforced by triggers (v22). Customers can only approve or reject.
- **payments** (v21): Case-level payments (wallet or offline). `payment_allocations` links payments to the quotes they settle.
- **RLS**: Row Level Security restricts `SELECT` queries to authorized participants and strictly guards write operations.

# 7. Authentication Flow
- Handled via Supabase SSR cookies.
- **⚠️ Server-side redirect is currently disabled**: `lib/supabase/middleware.ts` only calls `supabase.auth.getUser()` to refresh the session cookie — the redirect block (unauthenticated → `/login`, authenticated → `/`) is commented out with the note "auth is fully handled client-side via AppShell." This means `/dashboard` and `/support` are reachable at the HTTP level by anyone (no-JS clients, bots, direct fetches); protection currently depends entirely on `AppShell` blocking render client-side. Found during a 2026-07 security review, not yet fixed.
- Sessions are maintained in secure HTTP-only cookies.

# 8. API Documentation
- **Server Actions**:
  - `sendCustomerChatMessage(text)`: Calls Postgres RPC `fn_customer_send_chat_message` to insert messages atomically. **Then patches the staff notification's deep link**: the RPC writes `action_url = '/support'` with empty `metadata`, so the notification does not record which conversation it belongs to. This action rewrites it to `/support?id=<conversation_id>` (and sets `metadata.conversation_id`), scoped to rows created after a timestamp captured just before the RPC call and filtered on `action_url = '/support'` so it is idempotent. Best-effort — wrapped in its own try/catch because the message is already committed and a failed patch must never surface as a send error. **Proper long-term fix is `action_url := '/support?id=' || v_conversation_id` inside the RPC**; remove this patch once that lands.
  - `getActiveConversation()`: Retrieves active non-deleted conversation ID (matching statuses: `open`, `waiting_on_customer`, `resolved`).
  - `getMessages(convId)`: Retrieves message history for non-deleted conversations.
  - `fetchUserAvatars(userIds)`: Fetches profile avatars.

# 9. Components
- **SupportPage**: Renders live support options and interactive `LiveChatModal`. Subscribes to realtime message (`msgChannel`) and conversation status (`convChannel`) updates.
- **NotificationBell**: Subscribes to user-targeted notifications via `useSharedNotifications`.
- **LiveChatModal**: AnimatePresence modal handling live chat UI. Differentiates user messages, staff agent messages, and centered system event badges (`sender === 'system'`).

# 10. Pages
- `/support`: The customer support hub. Takes `?chat=open` as a URL parameter to auto-expand the live chat modal (used by notifications).
- `/dashboard`: Customer overview.

# 11. State Management
- **Local State**: UI state (`isChatOpen`, `messages`, `conversationId`).
- **Optimistic State**: UI updates immediately when user sends a message.
- **Global Notifs**: Managed via `useSharedNotifications` hook and `sonner` provider.

# 12. Business Logic
- **Centered System Event Badges**: System state changes (e.g. `"Conversation marked as waiting on customer."`, `"Conversation marked as open."`, `"Conversation marked as resolved."`) render as centered status badges with a Bot icon instead of left-aligned user bubbles.
- **URL Parameter Auto-Open**: If a notification navigates the user to `/support?chat=open`, `SupportPage` detects this and automatically opens the chat modal (`setIsChatOpen(true)`).
- **Realtime Soft-Delete Sync**: When an admin soft-deletes a conversation (`is_deleted = true`), the customer's realtime listener immediately clears out messages and resets chat state.
- **Role-Targeted Notifications**: `useSharedNotifications` filters notifications so customers only receive customer-targeted items (`target_role IN ('customer', 'all')`).

# 13. Important Algorithms
- **Async Avatar Loading**: Message text renders instantly on WebSocket payloads; user avatars are fetched asynchronously in the background.
- **Atomic RPC Execution**: Conversation creation, participant linking, message insertion, pointer updating, and notification creation execute inside a single Postgres transaction (`fn_customer_send_chat_message`).

# 14. Configuration Files
- `next.config.mjs`: Configured with `@ducanh2912/next-pwa`.
- `public/manifest.json`: PWA manifest with `192x192` and `512x512` maskable icons.
- `tailwind.config.ts`: Defines design system.

# 15. Build Process
- Standard Next.js `npm run build`.
- Enforces strict TypeScript (no `any`, default `SupabaseClient` generics).
- Deployed on Vercel.

# 16. Third-party Services
- Supabase (Backend/DB/Realtime).
- Vercel (Hosting).

# 17. Error Handling
- Server Actions catch Postgres errors and return `{ error: string }`.
- Frontend displays errors via toasts.

# 18. Security
- `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to `use server` files.
- Client components only use public anon key.
- **⚠️ `app/support/actions.ts` reads bypass RLS**: `getClient()` prefers the service-role client whenever `SUPABASE_SERVICE_ROLE_KEY` is set (true in production), so `getActiveConversation`/`getMessages` run with RLS fully bypassed — correctness relies solely on manual `user_id`/participant checks in the action code rather than a database-level backstop. Prefer the anon/SSR client for reads; reserve service-role for privileged writes only. Found during a 2026-07 security review, not yet fixed.
- See § 7 for the disabled middleware redirect — same review.

# 19. Performance
- **PWA Service Worker**: Instant loading & offline support.
- **Zero-latency Chat UI**: Message sending uses atomic RPC + optimistic UI updates.

# 20. Reusable Utilities
- `useSharedNotifications`: Shared hook for real-time toast notifications across User and Server apps. Accepts default `SupabaseClient` type for strict build compatibility.

# 21. Constants
- N/A

# 22. Types
- `ChatMessage` (`sender`: `'user' | 'agent' | 'system'`), `Notification`.

# 23. Development Workflow
- Local: `npm run dev`.

# 24. Known Issues
- **Middleware auth redirect disabled** (§7) — server-side route protection is weaker than documented elsewhere; relies on client-side gating.
- **Service-role client used for chat reads** (§18) — bypasses RLS as the authorization backstop for `getActiveConversation`/`getMessages`.
- `app/services/exchange/page.tsx`: `notifyMe` state is set but its setter is never wired to a checkbox — `notify_me` in submitted request metadata is always `false`. Minor, dead-ish code; feature likely half-removed.
- **`app/user/requests/page.tsx` renders `MOCK_REQUESTS`** — a hardcoded array, not the database. It has never shown a real request. The DB-backed equivalent is `/user/cases` (§31); this page should be retired or rewritten against `useCases`.
- **`activity_logs` never existed — FIXED 2026-07.** `submitServiceRequest` wrote every submission to a table with no row in the database and discarded the error, so the customer-side audit trail silently did nothing. Repointed onto `activity_feed`. Requires `schema_v19_case_notes_fix.sql` §B2 for the customer INSERT policy.

# 25. Future Roadmap
- WhatsApp integration.
- Email support ticketing.

## Exchange-rates customer workflow

- The dashboard widget lives at `components/dashboard/LiveExchangeRates.tsx` and reads published pricing from `transfer_corridors` and `currency_rates` under customer RLS. It is display-only; staff manage rates in ServerSide `/exchange-rates`.
- The exchange request flow lives at `app/services/exchange/page.tsx`. It uses the corridor's published rate and fee configuration to initialize a customer exchange request; keep its Supabase field names aligned with ServerSide schema and actions.
- The admin UI intentionally hides fee, limit, audit-reason, and active-state controls for compact rate maintenance, but those values remain persisted and continue to affect customer-facing calculations. Do not treat their absence from the admin form as removal from the data model.
- When changing exchange-rate presentation or query shape, verify both the dashboard widget and the service form. A customer-visible rate must come from the published corridor/custom-rate path, not a client-only fallback.

# 31. Cases (v18 case-centric model)
Every request now belongs to a `service_case` — the unit of work that groups the services in one journey ("Medical Trip to India" = medical + visa + flights).

- `submitServiceRequest` (`hooks/useServiceRequests.ts`) opens a case **and** its primary request. Pass `caseId` to attach a service to an existing journey instead; pass `caseTitle` to override the default (the service name). It returns `{ data, caseId, error }` — the added `caseId` is backward compatible with every existing caller.
- **There is no transaction over PostgREST.** The case is inserted first, so if the request insert fails the client deletes the case it just created — otherwise the customer is left with an empty journey in their list. The rollback only ever fires for a case *we* created in that call, never one the customer was already using.
- `hooks/useCases.ts` — `useCases()` for the list, `useCase(id)` for one case with its line items and documents.
- `/user/cases` and `/user/cases/[id]` are the customer-facing views. **A single-service case renders as a plain request**: the word "case" only surfaces once a journey actually holds more than one service, so the model change is invisible to simple flows.
- The realtime subscription **invalidates rather than merging the payload**, because a `service_cases` realtime row carries no joined `service_requests` — merging it would blank out the services already on screen.

## 31.1 What customers may and may not do (verified under real RLS)
`verify_userside_cases.mjs` creates a throwaway auth user, signs in with the **anon key**, exercises the flow, and deletes the user. This matters: the app talks to Supabase as a customer session, so a service-role test would pass while the real app fails.

Confirmed enforced by RLS — a customer **cannot** create a case for another customer, see another customer's cases, add their own line items, self-verify their own documents, or delete a case that has requests. They **can** open their own case, create a request in it, read its charges and documents, and delete an *empty* case (the rollback above).

Run it after any change to case RLS or the submission path.

## 31.2 Quotes and Payments (v21/v22)
- **Quotes are per-service:** A customer approves or rejects quotes at the individual request level.
- **Payments are per-case:** A single payment settles multiple approved-but-unpaid quotes on the case. Customers can pay from their Wallet balance (instant atomic deduction) or via offline methods (bKash/Bank/Cash) requiring proof upload and staff confirmation.
- **Price Lockdown (v22):** RLS and triggers strictly prevent a customer from altering the price or currency of a quote. Customers can only change quote status from `sent` to `approved` or `rejected`.

# 26. Developer Decisions
- **Unified System Message Design**: Matched the Admin portal's centered system status badges in UserSide live chat for design consistency.
- **Atomic RPC Migration**: Switched from manual client-side inserts to `fn_customer_send_chat_message` to guarantee 100% data consistency and prevent orphaned conversation rows.

# 27. Coding Conventions
- Strict TypeScript.
- Tailwind CSS utility classes.

# 28. Dependencies Between Modules
- The Support system relies entirely on `actions.ts` Server Actions and `useSharedNotifications`.

# 29. Critical Files
- `app/support/actions.ts`: Server Actions for support chat.
- `app/support/page.tsx`: Live chat page, system event renderer & Realtime listeners.
- `lib/notifications/useNotifications.ts`: Shared notification hook.

# 30. AI Continuation Notes
- **TypeScript Compliance**: Never use `any` types or strict generics on `SupabaseClient` that trigger `never` table inference in Vercel builds.
- **Realtime Listeners**: Ensure unmount cleanups are always handled (`supabase.removeChannel`).
