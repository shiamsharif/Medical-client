# MediCare Connect

## Overview

MediCare Connect is a production-oriented healthcare management client for patients, doctors, and administrators. It is a standalone Next.js application that communicates with a separate Express/MongoDB backend; it does not contain backend route handlers or persistence.

## Features

- Public healthcare landing experience with API-backed featured doctors, statistics, and patient stories
- Doctor discovery by name, specialty, hospital, availability, and fee, with backend sorting and pagination
- Shareable URL search state plus a persisted card/table presentation preference
- Detailed verified doctor profiles, reviews, favorites, and current availability
- Multi-step appointment workflow and backend-authoritative Stripe checkout
- Patient appointment, payment, review, favorite, profile, and prescription experiences
- Doctor appointment queue, schedule, professional profile, and dynamic prescription management
- Admin user, doctor verification, appointment, payment, and responsive analytics experiences
- Responsive public and role-based dashboard navigation, semantic loading/empty/error states, and custom 404
- Deliberate light, dark, and system themes with reduced-motion support

## User Roles

- **Patient:** discovers doctors and manages personal care activity.
- **Doctor:** manages availability, consultation requests, professional information, and prescriptions.
- **Admin:** oversees users, doctor verification, appointments, payments, and analytics.

Admin is intentionally absent from public registration. Role data shown by the client improves navigation UX only; the backend remains responsible for authorization.

## Technologies

Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, shadcn-style Radix primitives, Better Auth, TanStack Query, React Hook Form, Zod, Motion, Recharts, Stripe.js, next-themes, Lucide React, and Sonner.

## Architecture

The application uses a feature-oriented structure:

```text
src/
├── app/                  # App Router pages, layouts, and route states
├── components/           # Shared UI, common, and layout components
├── constants/            # Role navigation and stable product constants
├── features/             # Auth, doctors, appointments, dashboard, home
├── lib/                  # Better Auth, API client, and utilities
├── providers/            # Query, theme, and toast providers
├── schemas/              # Shared Zod validation
├── services/             # Typed backend service functions
└── types/                # Domain models
```

Components call TanStack Query hooks, which call focused services, which use the centralized API client. The API client owns the base URL, credentials, typed errors, query serialization, cancellation, and optional bearer authorization.

## Better Auth Authentication

`src/lib/auth-client.ts` configures Better Auth against the separate Express backend. Email/password registration and login, Google OAuth, sign-out, session retrieval, and cookie-based persistence use Better Auth’s client API. Cross-origin calls include credentials so deployments can use the backend’s secure cookie and CORS policy. Successful password and Google flows pass through `/auth/complete`, which verifies or creates the separate MediCare application profile before entering the dashboard.

## JWT Architecture

The client never creates or trusts a decoded JWT. If protected REST endpoints require a Better Auth JWT/JWKS token, it should be obtained through the backend’s supported Better Auth flow and passed to the centralized `apiRequest` `accessToken` option. The API client alone adds `Authorization: Bearer …`.

## Role-Based Access

Dashboard navigation is selected from the authenticated user’s server-provided role. Client guards reduce confusion and restore sessions on direct navigation. They are not a security boundary: every protected endpoint and state transition must be authorized by the Express backend.

## Stripe Payment Flow

1. The client collects doctor, date, time, and visit reason.
2. The backend rechecks slot availability and the doctor’s authoritative fee.
3. The backend creates the appointment/payment intent and returns a client secret.
4. Stripe Elements securely collects payment details.
5. The client displays processing feedback but does not mark the payment paid.
6. The backend Stripe webhook confirms the final status.

Only `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is exposed to the client. Stripe secret and webhook keys belong exclusively in the server repository.

## Doctor Search, Sorting, and Pagination

Search state is encoded in query parameters such as `search`, `specialization`, `hospital`, `availability`, `sort`, and `page`. Every change requests a paginated backend result; the browser does not download the full directory for local pagination.

## Optional Features

1. Light, dark, and system themes through next-themes
2. Seven-day doctor availability calendar with live slot queries
3. Appointment reminder indicators ready for backend-provided reminder status (emails are never sent from the browser)
4. Persistent card/table doctor directory view (the only localStorage value is this non-sensitive preference)

## Installation

```bash
npm install
cp .env.sample .env
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Every `NEXT_PUBLIC_*` value is visible in the browser. Never add database credentials, Better Auth secrets, OAuth client secrets, Stripe secret/webhook keys, email credentials, admin passwords, or cron secrets.

## Local Development

```bash
npm run dev
```

The Express backend must allow the client origin and support credentialed requests when cookie sessions are used.

## Production Build

```bash
npm run lint
npm run build
npm start
```

## Screenshots

Add production screenshots here after deployment.

## Live Site

Deployment URL: _To be added_

## Server Repository

Express backend repository: _To be added_

## Admin Credentials

Assessment credentials: _Provide through a secure channel; never commit passwords._
