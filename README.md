# Lead Manager — Frontend

React + Vite client for the Lead Manager application. Communicates with the backend API over `httpOnly` cookies for authentication.

---

## Table of Contents

- [Running locally](#running-locally)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [How it works](#how-it-works)
- [Assumptions](#assumptions)
- [What I'd improve with more time](#what-id-improve-with-more-time)

---

## Running locally

### Prerequisites

- Node.js 18+
- The backend server running (see `../server/README.md`)

### Steps

```bash
# from the repo root
cd client

# install dependencies
npm install

# start the dev server
npm run dev
```

The app opens at **http://localhost:5173**.

### Environment variables

Create a `.env` file in the `client/` directory (one already exists in the repo):

```env
VITE_API_URL=http://localhost:5000/api
```

Change the URL if your backend runs on a different port.

### Other scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Project structure

```
src/
├── api/
│   └── axios.js          # Axios instance with baseURL + withCredentials
├── components/
│   ├── ConfirmDialog.jsx  # Delete confirmation modal
│   ├── LeadForm.jsx       # Create lead form
│   ├── LeadTable.jsx      # Leads table with inline status dropdown
│   ├── Navbar.jsx         # Top navigation bar with logout
│   └── ProtectedRoute.jsx # Redirects unauthenticated users to /login
├── context/
│   └── AuthContext.jsx    # Auth state, login/signup/logout helpers
├── pages/
│   ├── Dashboard.jsx      # Main leads view
│   ├── Login.jsx          # Login page
│   └── Signup.jsx         # Signup page
├── App.jsx                # Route definitions
├── index.css              # Global base styles (Tailwind import)
└── main.jsx               # React root mount
```

---

## Tech stack

| Tool | Version | Why |
|---|---|---|
| **React** | 19 | Component model is a natural fit for a data-driven dashboard; hooks keep all state local without a global store |
| **Vite** | 8 | Instant dev server startup and HMR; `@tailwindcss/vite` plugin wires Tailwind with zero extra config |
| **Tailwind CSS** | 4 | Utility-first keeps styles co-located with markup; purges unused classes automatically in production |
| **React Router** | 7 | Declarative routes; `<ProtectedRoute>` wraps the dashboard to redirect unauthenticated users |
| **Axios** | 1 | `withCredentials: true` sends the auth cookie on every request automatically; easier than raw `fetch` for credential handling |
| **Lucide React** | latest | Consistent, tree-shakeable icon set; icons are imported individually so no unused SVGs ship |

---

## How it works

### Authentication

- On app load, `AuthContext` calls `GET /api/auth/me`. If the httpOnly cookie is valid the server returns the user; otherwise the user is treated as unauthenticated.
- Login and signup store no token in the client — the server sets the cookie. The client only stores the user object in React state.
- On logout, `POST /api/auth/logout` clears the server-side cookie, then local state is wiped.

### Protected routing

`ProtectedRoute` reads `user` from `AuthContext`. If `loading` is true it renders nothing (prevents flash). If `user` is null it redirects to `/login`.

### Lead management

- All CRUD calls go through the shared Axios instance (`src/api/axios.js`).
- **Search** is debounced 300 ms before firing to avoid a request on every keystroke.
- **Status change** fires immediately inline from the table dropdown — no save button.
- **Delete** requires a confirmation dialog before the API call is made.

---

## Assumptions

1. **Status is the only editable field after creation** — the table only exposes a status dropdown. Full editing was considered out of scope.
2. **Search filters by name only** — simple and fast; email/company search would need a MongoDB text index.
3. **No pagination** — all leads matching the current filter are fetched at once. Fine for small datasets.
4. **Single user = single dataset** — each account sees only its own leads; no sharing or team view exists.
5. **300 ms debounce is sufficient** — a small delay before the search API call; not configurable.
6. **`withCredentials` requires the backend CORS to match exactly** — the backend must echo back the exact `CLIENT_URL` origin, not a wildcard.

---

## What I'd improve with more time

### UX / Features

- **Inline full editing** — click any row to edit all lead fields in a slide-over or modal, not just status.
- **Optimistic status updates** — apply the status change to local state immediately, then rollback on API error, so the UI feels instant.
- **Pagination or infinite scroll** — cursor-based pagination to handle large datasets without fetching everything.
- **Multi-field search** — search across name, email, and company in one input.
- **Bulk actions** — checkboxes to delete or change status on multiple leads at once.
- **CSV export** — download the current filtered view as a `.csv` file.
- **Toast notifications** — replace silent success (no feedback) with a brief toast after create / status change / delete.

### Code quality

- **Error boundary** — wrap the app in a React `ErrorBoundary` so unexpected crashes show a friendly message instead of a blank screen.
- **Axios interceptor for 401s** — centrally redirect to `/login` when any request returns `401`, instead of handling it per-component.
- **End-to-end tests** — Playwright tests covering the full create → update → delete lead flow.
- **Form validation library** — replace manual `Object.values(form).some(v => !v.trim())` checks with React Hook Form + Zod for consistent, type-safe validation.
- **Loading skeletons** — replace the plain "Loading leads..." text with skeleton rows that match the table layout.
