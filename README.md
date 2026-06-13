# Orion Auth

A production-ready Next.js App Router authentication system with Supabase Auth, protected routes, session persistence, animated auth flows, dark mode, and a polished launcher-style interface.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Supabase project, then copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. In Supabase Auth settings, enable Email provider. For password reset and email verification redirects, add:

```text
http://localhost:3000/auth
https://your-production-domain.com/auth
```

4. Run locally:

```bash
npm run dev
```

## Routes

- `/auth` - sign in, sign up, forgot password, verification/reset feedback
- `/dashboard` - protected user profile/dashboard
- `/` - redirects users based on auth state

## Deployment

Deploy to Vercel or any Next.js host. Add the same environment variables in the hosting dashboard and add your production URL to Supabase Auth redirect URLs.
