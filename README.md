# Modular SaaS Platform — Developer Guide

A production-ready Vite + React + TypeScript app with Tailwind + ShadCN UI. This guide maps every page and component so you can edit or debug fast. It also explains auth, routing, styling, database models, and how we’ll add payments.

## Table of Contents
- Project Overview
- Folder Structure & Key Files
- Routes & Pages (what renders where)
- Components Map (by feature)
- Auth (Email/Password — no Blink gateway)
- Styling & Theming
- Database Models (Blink DB)
- Payments (Stripe) — info we need from you
- Troubleshooting & Common Fixes

---

## Project Overview
- Stack: Vite + React 19 + TS, Tailwind, ShadCN, Lucide Icons.
- UI Style: Modern dark glassmorphism with premium animations.
- Auth: Local email/password using users_new table with session persisted in localStorage.
- Routing: react-router-dom v7.

## Folder Structure & Key Files

- index.html — App shell. Blink auto script removed.
- src/main.tsx — App root render + global Toaster.
- src/App.tsx — Router + protected routes + redirects.
- src/index.css — Global theme tokens, premium animations, utilities.
- public/_redirects — SPA routing for Netlify-style hosts.

Feature folders/files:
- src/hooks/useAuth.tsx — Auth context (loginWithEmail, logout, role helpers). Local session persisted.
- src/blink/client.ts — Blink client for DB only (no auth redirects).
- src/components/
  - LandingPage.tsx — Marketing site. Pricing CTAs go to /payments.
  - LoginSelection.tsx — Choose role then email login.
  - EmailPasswordLogin.tsx — Email/password sign-in.
  - CustomerDashboard.tsx — Customer area.
  - AdminWorkspace.tsx — Admin/developer area.
  - SuperAdminPortal.tsx — Super admin tools.
  - PaymentsSetup.tsx — Payments configuration UI (collects keys; secure backend in next step).
  - WebsiteBuilder.tsx, ToolBuilder.tsx, WorkflowBuilder.tsx, AgentBuilder.tsx, BlogManager.tsx, AdminTutorials.tsx — Admin tools.
  - ui/* — ShadCN components.

## Routes & Pages
- / — LandingPage
- /login — LoginSelection (choose role, then email login)
- /customer-dashboard — Protected (customer, superadmin)
- /admin-dashboard — Protected (admin, superadmin)
- /super-admin — Protected (superadmin only)
- /website-builder — Protected (any logged-in)
- /payments — PaymentsSetup (public screen guiding setup)

Redirect rules:
- We only auto-redirect from /login after successful auth. The landing page never auto-jumps to admin now.

## Components Map (by feature)
- Auth: useAuth.tsx, LoginSelection.tsx, EmailPasswordLogin.tsx
- Admin: AdminWorkspace.tsx, ToolBuilder.tsx, WorkflowBuilder.tsx, AgentBuilder.tsx, BlogManager.tsx, AdminTutorials.tsx, SuperAdminPortal.tsx
- Customer: CustomerDashboard.tsx
- UI Base: components/ui/* (buttons, inputs, cards, etc.)

## Auth (Email/Password)
- Stored in Blink DB table users_new with fields: id, email, password_hash, role, etc.
- Login: useAuth.loginWithEmail(email, password) → verifies users_new.password_hash. On success, stores user in localStorage (modular_saas_user).
- Logout: useAuth.logout('/') clears session and redirects.
- Roles: customer | admin | superadmin; company emails auto-promoted in-memory to superadmin.
- Where to customize: src/hooks/useAuth.tsx (COMPANY_ADMIN_EMAILS, STORAGE_KEY, role rules).

## Styling & Theming
- Tokens: src/index.css (HSL variables). Avoid RGB; use HEX/HSL.
- Components use ShadCN variants + Tailwind classes.
- Animations: Glass effects, gradient text, shimmer, floating particles.
- Change look: adjust --primary, --accent, gradients, shadows in index.css.

## Database Models (Blink DB)
Key tables used today: users, users_new, projects, blog_posts, tools, user_tools, workflows, ai_agents.
- When reading booleans, cast via Number(field) > 0 (SQLite string booleans).
- Always use camelCase in TS; SDK converts to snake_case internally.

## Payments (Stripe) — Information Needed
We scaffolded PaymentsSetup at /payments and wired "Start Pro Trial" → /payments. To fully enable Stripe:
Please provide:
1) Stripe mode: Test or Live
2) Stripe Publishable Key (pk_...)
3) Stripe Secret Key (sk_...)
4) Webhook Signing Secret (whsec_..., once webhook is created)
5) Products/Prices: name, price, currency, interval (monthly/yearly/one-time)
6) Success URL & Cancel URL
7) Do you need promo codes/coupons? Trials?

Next steps (once keys provided):
- Create secure backend endpoints for Checkout Session creation.
- Add webhook handler for subscription lifecycle.
- Update pricing cards to call the backend and open Checkout in a new tab.

## Troubleshooting & Common Fixes
- Redirected to admin automatically? Fixed: we no longer redirect from landing — only from /login after auth.
- Can’t log in? Ensure users_new has your email with password_hash set (temporary plain string for dev).
- Styling looks off? Variables are in src/index.css. Ensure you’re not using rgb(...); switch to HEX/HSL.
- SPA routing 404 on refresh? public/_redirects handles it.

## How to Edit Anything
- Pages: src/components/*.tsx
- Routes: src/App.tsx
- Auth rules: src/hooks/useAuth.tsx
- Theme: src/index.css
- UI primitives: src/components/ui/*

If you get stuck, tell the AI: the exact route, component name, and what you want changed. It’s all mapped above.