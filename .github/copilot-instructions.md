# Copilot Instructions for AI Assignment Generator

A Next.js 14 application for therapists to generate, manage, and send AI-powered CBT therapy assignments using OpenAI integration.

## Current Status (November 2025)

**✅ Working:** 
- Mock AI mode (no real OpenAI API key needed)
- Database setup with SQLite
- Assignment generation UI
- Client/Session management

**⚠️ In Progress:**
- Testing assignment fetch & edit workflow
- Auth removed from API routes (per NO_LOGIN_NEEDED.md)

## Architecture Overview

**Core Tech Stack:**
- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Database:** SQLite with Prisma ORM (singleton pattern in `lib/prisma.ts`)
- **Auth:** NextAuth.js (currently disabled per NO_LOGIN_NEEDED.md)
- **Styling:** Tailwind CSS + Lucide icons
- **AI:** OpenAI API with **mock mode fallback** (`lib/ai.ts`)
- **Email:** SendGrid optional integration (`lib/email.ts`)

**Data Model (Prisma):**
- `User` → owns Clients, Sessions, Assignments
- `Client` → has Sessions & Assignments
- `Session` → contains Assignments
- `Assignment` → versioning via `parentAssignmentId`
- `Template` → shared with approval workflow
- `EmailLog` → tracks emails sent

## Key Workflows

### Assignment Generation with Mock Mode
**Files:** `app/api/assignments/generate/route.ts` → `lib/ai.ts`

- If `OPENAI_API_KEY=""` or placeholder, returns mock CBT assignments instantly
- Flow: Select client/session → POST generate → Create DB record → Redirect to edit
- Mock responses include title, taskDescription, learningObjectives, reflectionPrompts

### No Authentication
**Per:** `NO_LOGIN_NEEDED.md`

- All API routes accessible without session
- Removed auth checks from assignment endpoints
- Client/Session endpoints don't require auth

````instructions
# Copilot Instructions — AI Assignment Generator (concise)

This repo is a Next.js 14 (App Router) TypeScript app for therapists to generate, edit, version, and send CBT assignments. Use these pointers to be productive immediately.

Key files & patterns
- `lib/ai.ts` — AI integration. Supports mock mode when `OPENAI_API_KEY` is empty; check this file for prompt shapes and mock outputs.
- `lib/prisma.ts` — Prisma client singleton. Use `prisma` imports in server routes.
- `app/api/assignments` — main assignment REST endpoints. See `generate/route.ts` (POST) and `[id]/route.ts` (GET, PUT, DELETE). Edits create new version records (not in-place updates).
- `app/dashboard/assignments/page.tsx` — assignments table rendering `AssignmentActions` component.
- `components/assignments/AssignmentActions.tsx` — View/Delete UI; delete calls `DELETE /api/assignments/[id]`.
- `lib/email.ts` — send email integration (SendGrid placeholder). Email sending logs to `EmailLog` table.

Project-specific conventions
- "No login" mode: `NO_LOGIN_NEEDED.md` documents that many API routes are intentionally open for local/dev. Several routes may check auth; remove or align checks to match this file when working locally.
- Editing/versioning: PUT edits usually create a new `assignment` record with `parentAssignmentId` and increment `version` — look at `app/api/assignments/[id]/route.ts` for the pattern.
- Mock AI mode: set `OPENAI_API_KEY=""` in `.env` to avoid real API calls during development.

Developer workflows
- Setup & run (dev):
```pwsh
npm install
npm run db:generate
npm run db:push
npm run dev
```
- Debugging database records: `app/api/debug/assignments/route.ts` returns DB contents for quick checks.

Common gotchas & troubleshooting
- If delete doesn't work: check `app/api/assignments/[id]/route.ts` for auth gating (project often uses open routes). You may need to remove server-side session checks to match `NO_LOGIN_NEEDED.md`.
- If mock generation returns unexpected shapes: inspect `lib/ai.ts` for mocked object keys (`title`, `taskDescription`, `learningObjectives`, `reflectionPrompts`).
- If migrations or Prisma client issues occur: ensure `DATABASE_URL` points to `file:./dev.db` in `.env`, re-run `npm run db:generate` and `npm run db:push`.

Quick examples
- Create assignment via API (dev/mock): `POST /api/assignments/generate` with `{ clientId, sessionId, tone }` — response redirects to edit flow.
- Delete from client UI: `fetch('/api/assignments/${id}', { method: 'DELETE' })` — ensure server route doesn't return 401.

When editing code
- Keep edits minimal and consistent with existing patterns (e.g., version-on-edit). Update API handlers in `app/api/assignments` and keep debug routes intact.

Where to look next
- `prisma/schema.prisma` — canonical data model.
- `app/dashboard/assignments` and `components/assignments` — primary UX flows.
- `lib/ai.ts`, `lib/email.ts`, `lib/prisma.ts` — integration points.

If anything is unclear or you'd like more examples (e.g., how to add confirmation dialogs, toasts, or change delete behavior), tell me what to add and I will update this file.

````
