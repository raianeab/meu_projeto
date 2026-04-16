# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Development server with nodemon (auto-restart)
npm start         # Production server
npm run migrate   # Run database migrations (src/migrations/migration.js)
```

No test runner is configured.

## Architecture

Metavis is a multi-tenant SaaS for people analytics / organizational intelligence. The stack is Node.js + Express 5, EJS templates, Supabase (PostgreSQL), and Power BI Embedded.

### Request flow

```
Request → server.js middleware → Route → Controller → Service → Supabase client
```

Routes are registered in `server.js` directly (not via `src/routes/index.js`, which is mostly unused). Each route module applies `authMiddleware.isAuthenticated` where needed.

### Multi-tenancy

Every user row has a `company_id`. All data queries must be scoped to `req.session.user.company_id`. The `dados` table is the main org data table, upserted with `onConflict: 'company_id,EmployeeID'`.

### Session / auth

- `req.session.user` holds the logged-in user (password field stripped).
- `src/middlewares/authMiddleware.js` exports `isAuthenticated`, `isAdmin`, `isOrganizer`.
- After login/register the user is redirected to `/dashboard`.
- Route `/` serves the landing page for unauthenticated users and redirects to `/home` for authenticated users.

### Key modules

| Path | Purpose |
|---|---|
| `src/config/db.js` | Supabase client (singleton) |
| `src/services/powerBIService.js` | Azure OAuth2 + Power BI embed token/URL — **uses ES6 `export` syntax but is `require()`d as CommonJS (active bug)** |
| `src/services/dataService.js` | Parses uploaded `.xlsx`/`.csv` files; skips first 2 rows; maps to `TECH_COLUMNS`; converts Excel date serials and number formats |
| `src/middlewares/uploadMiddleware.js` | Multer config — saves to `src/uploads/`, accepts `.xlsx`/`.xls`/`.csv`, 10 MB limit |
| `src/services/inviteService.js` | Invite and password-reset token flows via `user_invites` table; sends email via `emailService.js` |
| `src/services/emailService.js` | Nodemailer (currently using test account, not production) |

### Data upload flow

1. User POSTs a spreadsheet to `/dados/upload`.
2. `dataService.processUploadFile` parses the file (rows 3+), maps columns by position to `TECH_COLUMNS`, normalizes dates and numbers.
3. Records are batched (100/batch) and upserted into the `dados` table with `company_id` injected.
4. Temp file is deleted after processing regardless of success/failure.

### Invite flow

1. Admin POSTs email to `/usuarios/convidar` → `inviteService.createInvite` stores a 1-hour token in `user_invites`.
2. Email is sent with a link to `/convite/:token`.
3. User sets password → `inviteService.createUserFromInvite` creates the `usuarios` row.
4. Token is marked `used = true` (never deleted, for audit).

### Known active bugs

- `powerBIService.js` uses ES6 `export` syntax but the project is CommonJS. Fix by converting to `module.exports`.
- `company_id` is hardcoded in `src/views/pages/register.ejs`.
- Invite email links are hardcoded to `http://localhost:3000`.

## Environment variables

```
SUPABASE_URL
SUPABASE_ANON_KEY
SESSION_SECRET
NODE_ENV
PORT
AZURE_TENANT_ID
AZURE_CLIENT_ID
AZURE_CLIENT_SECRET
POWER_BI_AUTH_URL
POWER_BI_API_URL
POWER_BI_SCOPE
```

## Design system

- Colors: `#01192B` (petroleum blue, primary), `#EE6D07` (orange, accent)
- Font: Aeonik Pro — loaded via `@font-face` from `/public/fonts/aeonik/`; must be declared inline in standalone pages that don't load `base.css`
- Landing page uses TailwindCSS CDN (not Bootstrap)
- Other pages use Bootstrap 5
- Logo: `/public/images/logos/Metavis%20-%20Logotipo%20-%20Branco.png`
- Avoid the terms "BI" or "dashboard" in UI copy — use "inteligência" or "inteligência organizacional"

## Database

Supabase RLS is currently disabled (test mode only). The active tables are `usuarios`, `companies`, `user_invites`, and `dados`. Tables like `eventos`, `inscricoes`, `categorias`, etc. exist in `src/scripts/init.sql` but are legacy and not used by the current application.
