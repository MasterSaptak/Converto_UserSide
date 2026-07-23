# CONTEXT.md - Converto UserSide (Customer Portal)

# 1. Project Overview
- **Purpose**: A seamless customer-facing portal for the Converto platform.
- **Business goal**: Empower customers to track orders, perform financial transactions, and get instant live support.
- **Problem being solved**: Providing a frictionless, highly responsive, and premium user experience for clients to manage their Converto services.
- **Target users**: Customers and clients of Converto.
- **Current development status**: Active development. Real-time live chat modal, system status event badges, PWA installation (`@ducanh2912/next-pwa`), atomic RPC messaging, and notifications are fully implemented. Deployed on Vercel.

# 2. Architecture
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS. Focus on premium glassmorphism aesthetics.
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
- **RLS**: Row Level Security restricts `SELECT` queries to authorized participants.

# 7. Authentication Flow
- Handled securely via Supabase SSR.
- Middleware intercepts requests to `/dashboard` and `/support` and redirects unauthenticated users to `/login`.
- Sessions are maintained in secure HTTP-only cookies.

# 8. API Documentation
- **Server Actions**:
  - `sendCustomerChatMessage(text)`: Calls Postgres RPC `fn_customer_send_chat_message` to insert messages atomically.
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
- None currently active.

# 25. Future Roadmap
- WhatsApp integration.
- Email support ticketing.

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
