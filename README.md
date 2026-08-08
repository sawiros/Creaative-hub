# ChargeShare — Smart EV Charging Reservation & Queue Platform

A complete, working product demo for Ethiopia: discover chargers, reserve a slot, pay via a Telebirr-style demo flow, join a smart queue, and track a live charging session. Includes a **driver app** and a separate **operator dashboard**, plus **user sign-up / log-in / log-out** and a **60+ member shared database**.

Built with **React + TypeScript + Vite + Tailwind CSS + Lucide icons**. Runs fully locally with no API keys, and deploys to **Vercel**.

---

## Quick start (local, no keys)

```bash
npm install
npm run dev
```

Open **http://localhost:5173**. Without Supabase keys the app runs in **demo mode** with an in-browser database — you can still sign up, log in, and reserve.

> To test the shared database across devices, connect Supabase (next section).

---

## Connect the shared Supabase database (optional, recommended)

The app stores registrations and lets anyone sign up and reserve. For a **shared** database visible to all users:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the entire contents of [`supabase/seed.sql`](supabase/seed.sql), and **Run**. This creates the `members` + `reservations` tables, row-level security, a trigger that auto-registers new signups, and **seeds the 60+ member database**.
3. In Supabase: **Project Settings → API**, copy your **Project URL** and **anon public key**.
4. Put them in `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Restart the dev server.

> **Recommended:** In Supabase → Authentication → Settings, turn **off** "Confirm email" so signups log straight in for a smooth demo. (Leave it on if you want email verification.)

---

## Deploy to Vercel

1. Push this folder to a Git repo (the project is already configured for Vercel via `vercel.json`).
2. Import the repo in [vercel.com](https://vercel.com) — framework **Vite** is auto-detected.
3. Add these **Environment Variables** in Project → Settings → Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Each visitor shares the same Supabase database.

---

## What's implemented

**Auth & database**
- Sign up (collects name, phone, email, password, **EV model + starting battery**), log in, log out
- Whole app gated: users must be signed in to reserve
- 60+ member database (seeded) + live signups, visible in the **Members** page
- Supabase-backed with automatic in-browser fallback when no keys are present

**Driver app**
- Dashboard (EV, battery ring, upcoming reservation, queue status, quick actions)
- Find chargers (search, area + power filters, list/map views)
- Station detail (chargers, live queue, pricing, amenities)
- Multi-step reservation → **Telebirr demo payment** (processing/success/error) → QR confirmation
- Smart queue (live position, estimated wait, leave-queue)
- Active charging session (live battery/energy/time progress)
- History, Profile, Settings, Members, Map
- **ChargeShare Copilot** mock AI assistant
- Toast notifications throughout

**Operator dashboard**
- Overview metrics + charger status cards
- Live chargers (start/end/disable)
- Reservations table (check in / cancel)
- Queue management (start session, end, skip no-show, move position, cancel, view)
- Station management (add/edit/remove charger, set power, price, fee)
- Analytics (reservations/day, revenue chart, utilization)

---

## Project structure

```
src/
  lib/            supabase client + auth + seed database
  data/           mock stations, chargers, reservations, notifications
  store.tsx       global app state (navigation, reservations, charging, queue)
  components/     UI primitives, QR, toasts, copilot, shell, map, station card
  pages/
    auth/         sign up / log in
    driver/       dashboard, find, station, reserve, reservations, queue, charging, history, profile, settings, map, members
    operator/     overview, live, reservations, queue, stations, analytics
  types.ts        shared TypeScript types
  App.tsx         auth gate + route rendering
  main.tsx        entry point
supabase/seed.sql   schema + RLS + 60+ member seed
```

## Architecture

- **State:** React Context (`store.tsx`) holds navigation, reservations, queue, charging session, and notifications. All mock data is centralized in `src/data/`.
- **Auth/DB:** `src/lib/auth.tsx` + `src/lib/supabase.ts` abstract a backend. If `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` are set, it uses Supabase (shared across users); otherwise it transparently falls back to `localStorage` so the demo always runs.
- **Reservations:** a logged-in user picks a station → charger → time slot → pays via the mock Telebirr modal → gets a confirmed reservation + QR → can join the queue and start a charging session.

All data is clearly labelled demo data. Nothing is connected to the real Telebirr API or any real charging network.
