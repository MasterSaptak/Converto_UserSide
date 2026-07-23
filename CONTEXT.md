# CONTEXT.md - Converto UserSide (Customer Portal)

# 1. Project Overview
- **Purpose**: A seamless customer-facing portal for the Converto platform.
- **Business goal**: Empower customers to track orders, perform financial transactions, and get instant live support.
- **Problem being solved**: Providing a frictionless, highly responsive, and premium user experience for clients to manage their Converto services.
- **Target users**: Customers and clients of Converto.
- **Current development status**: Active development. Realtime live chat and notifications are fully implemented. Deployed on Vercel.

# 2. Architecture
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS. Focus on premium glassmorphism aesthetics.
- **Backend**: Next.js Server Actions handle core logic securely.
- **Database**: Supabase PostgreSQL.
- **Authentication**: Supabase Auth with SSR cookies.
- **Deployment**: Vercel.
- **Data Flow**: User sends a message -> Action inserts into Supabase -> Supabase realtime pushes updates to UI. Optimistic updates mask network latency.

# 3. Folder Structure
- `/app`: Next.js App Router root. Contains `/support`, `/dashboard`, etc.
- `/components`: Granular React components. Broken down into `/layout`, `/auth`, `/dashboard`, etc.
- `/lib`: Helper functions, Supabase clients (`client.ts`, `server.ts`, `middleware.ts`).
- `/hooks`: Custom hooks like `useNotifications`.
- `/public`: Public assets.

# 4. Technologies
- **Next.js (15.x)**: Framework.
- **React (19.x)**: UI Library.
- **TypeScript**: Strict type checking.
- **Tailwind CSS**: Styling.
- **Supabase JS / SSR**: Backend-as-a-service.
- **Framer Motion**: Animations.
- **Sonner**: Notifications.

# 5. Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase API URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anonymous key.
- `SUPABASE_SERVICE_ROLE_KEY`: Secret Admin key. Used on the server only to bypass strict RLS policies (e.g., when initially fetching or creating a conversation where the user is not yet authorized by the standard select policies).

# 6. Database
- **profiles**: Customer profiles.
- **communication_conversations**: The overarching chat threads.
- **communication_messages**: The individual lines of dialogue.
- **communication_participants**: The link table authorizing a user to read a specific conversation.
- **notifications**: Stores system notifications. Read by the `NotificationBell`.
- **RLS**: Row Level Security heavily restricts `SELECT` queries to only rows where the user's ID matches the `profile_id` or `user_id`.

# 7. Authentication Flow
- Handled securely via Supabase SSR.
- Middleware intercepts requests to `/dashboard` and `/support` and redirects unauthenticated users to the `/login` page.
- Sessions are maintained in secure HTTP-only cookies.

# 8. API Documentation
- **Server Actions** used instead of REST endpoints:
  - `sendCustomerChatMessage`: Creates conversation (if new), adds participant, and inserts message. Uses `SUPABASE_SERVICE_ROLE_KEY` to securely bypass RLS chicken-and-egg selection bugs.
  - `getActiveConversation`: Uses service role to reliably fetch the user's active conversation ID.
  - `getMessages`: Safely retrieves message history after verifying participation.

# 9. Components
- **SupportPage**: Renders the support options and houses the `LiveChatModal`.
- **NotificationBell**: Uses `useSharedNotifications` to subscribe to the database and render `sonner` toasts on new inserts.
- **LiveChatModal**: AnimatePresence modal handling the chat UI.

# 10. Pages
- `/support`: The customer support hub. Can take `?chat=open` as a URL parameter to auto-expand the live chat modal (used by notifications).
- `/dashboard`: Customer overview.

# 11. State Management
- **Local State**: Contextual toggles (e.g., `isChatOpen`).
- **Optimistic State**: `setMessages(prev => [...prev, newMsg])` handles instant feedback.
- **Global Notifs**: Managed via `useSharedNotifications` hook and `sonner` provider.

# 12. Business Logic
- **URL Parameter Routing**: If a notification navigates the user to `/support?chat=open`, the `SupportPage` detects this and automatically triggers `setIsChatOpen(true)`.
- **Admin Bypasses**: Supabase Admin client is strictly required when a user initiates their *very first* chat message. The system must create the conversation and link the user to it simultaneously, which RLS normally prevents.

# 13. Important Algorithms
- **Async Avatar Loading**: To prevent the UI from "hanging" when a new WebSocket message arrives, the message is inserted into React state instantly. A promise is fired to `fetchUserAvatars()`, which updates the specific message's avatar in the background once resolved.

# 14. Configuration Files
- `next.config.ts`
- `tailwind.config.ts`
- `.eslintrc.json`: Configured to heavily penalize `any` types.

# 15. Build Process
- Standard Next.js `npm run build`.
- Fails strictly if ESLint detects `any` type overrides.

# 16. Third-party Services
- Supabase (Backend/DB).
- Vercel (Hosting).

# 17. Error Handling
- Server Actions catch Postgres errors and return `{ error: string }`.
- Frontend maps these strings into `sonner` toasts so the user understands the failure.

# 18. Security
- Client components only ever use `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to `use server` files.

# 19. Performance
- **Optimistic UI**: Interactions feel zero-latency.
- **WebSocket offloading**: Complex data fetching (like avatars) is decoupled from the critical websocket rendering path.

# 20. Reusable Utilities
- `useSharedNotifications`: A powerful hook that abstracts Supabase Realtime subscriptions and toast rendering.

# 21. Constants
- N/A

# 22. Types
- Strict TypeScript enforcement across all database schemas.

# 23. Development Workflow
- Local: `npm run dev`.
- Strict Mode causes double-mounting, which tested our WebSocket unmount cleanup heavily.

# 24. Known Issues
- Relying on `window.location.href` for notification navigation forces a full page reload. In the future, Next.js `<Link>` or `useRouter()` could be injected into the toast action, but `sonner` runs outside the router context.

# 25. Future Roadmap
- WhatsApp integration using Twilio or Meta Graph API.
- Email support ticketing.

# 26. Developer Decisions
- **Toast Deduplication**: `id: newNotif.id` is explicitly passed to `sonner` to prevent React Strict Mode from double-rendering toasts during development hot-reloads.

# 27. Coding Conventions
- Strict TypeScript. Explicit types over `any`.
- Tailwind classes sorted logically.

# 28. Dependencies Between Modules
- The Support system relies entirely on `actions.ts` Server Actions rather than direct client-side Supabase queries to guarantee reliability.

# 29. Critical Files
- `app/support/actions.ts`: Handles secure conversation initialization.
- `app/support/page.tsx`: Contains the core Realtime chat logic.

# 30. AI Continuation Notes
- **Vercel Builds**: The UserSide project will completely fail to compile on Vercel if you use `any`. Use `unknown`, `Record<string, string>`, or specific interfaces.
- **Realtime UI**: Always opt for optimistic updates. Do not block state updates behind `await` calls when receiving websocket payloads.
- **URL States**: Be mindful of URL parameters (like `?chat=open`). They are an effective way to communicate state across full-page reloads (like when a toast action is clicked).
