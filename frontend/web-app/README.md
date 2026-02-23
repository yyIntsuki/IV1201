# Frontend — Web App

This is the React frontend for the IV1201 recruitment application. It communicates with the FastAPI backend over a REST API and supports two user roles: **applicants** and **recruiters**.

## Table of Contents

- [Frontend — Web App](#frontend--web-app)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Available Scripts](#available-scripts)
  - [Project Structure](#project-structure)
  - [Architecture Overview](#architecture-overview)
  - [Environment Variables](#environment-variables)
  - [Routing \& Access Control](#routing--access-control)
  - [Authentication](#authentication)
  - [Error \& Loading Handling](#error--loading-handling)
  - [Localization](#localization)
  - [Styling](#styling)
  - [How To: Common Development Tasks](#how-to-common-development-tasks)
    - [Add a new page](#add-a-new-page)
    - [Add a new API call](#add-a-new-api-call)
    - [Add a new language](#add-a-new-language)
    - [Add a new role](#add-a-new-role)
  - [Testing](#testing)
  - [Building for Production](#building-for-production)
  - [Deployment](#deployment)

---

## Prerequisites

- **Node.js** 18 or higher
- The backend server must be running and accessible (see backend README)

---

## Getting Started

```bash
# Navigate to this directory
cd frontend/web-app

# Install dependencies (first time, or after pulling changes that update package.json)
npm install

# Copy the environment file and configure the backend URL
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL

# Start the development server
npm run dev
```

The app will be available at **[http://localhost:5173](http://localhost:5173)** with Hot Module Replacement (HMR) enabled — changes to source files reflect immediately in the browser without a full reload.

---

## Available Scripts

| Command           | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Start the development server with HMR                 |
| `npm run build`   | Type-check and compile a production build into`dist/` |
| `npm run preview` | Serve the production build locally for verification   |
| `npm run test`    | Run all tests once using Vitest                       |
| `npm run lint`    | Run ESLint across all source files                    |

---

## Project Structure

```txt
src/
├── api/            # Raw HTTP calls — one file per backend endpoint
├── auth/           # AuthContext and AuthProvider (authentication state)
├── components/     # Reusable UI components, organised by feature
├── constants/      # App-wide constants (routes, storage keys, roles, role IDs)
├── errors/         # ErrorContext, ErrorProvider, and ErrorToast
├── hooks/          # Custom hooks (useAuth, useError, useLoading, useForm)
├── layout/         # Shared page layout (header, main area, footer)
├── loading/        # LoadingContext and LoadingProvider
├── locales/        # i18next translation files (en/, sv/)
├── pages/          # Top-level page components (Login, Register, Applicant, Recruiter, etc.)
├── routes/         # ProtectedRoute and PublicRoute guards
├── services/       # Business logic layer between pages and API
├── types/          # Shared TypeScript type definitions
├── utils/          # Pure utility functions (JWT decoding, form validation, role parsing, etc.)
├── i18n.ts         # i18next initialisation
├── main.tsx        # App entry point — mounts providers and the router
└── Router.tsx      # Central route definitions
```

The separation between `api/`, `services/`, and `pages/` is intentional:

- **`api/`** only knows how to make an HTTP request and return typed data.
- **`services/`** transforms that data and encapsulates business logic.
- **`pages/`** orchestrate user interaction and delegate to services and hooks.

---

## Architecture Overview

```txt
Page (UI + interaction)
  └── Service (business logic, data transformation)
        └── API module (HTTP request via shared client)
              └── api/client.ts (Axios, JWT injection, error normalisation)
```

Shared cross-cutting concerns (authentication state, error display, loading overlay) are provided by React contexts that wrap the entire app in `main.tsx`:

```txt
AuthProvider
  └── ErrorProvider
        └── LoadingProvider
              └── Router (pages)
```

---

## Environment Variables

Configuration is done via a `.env` file in this directory. See `.env.example` for the required variables.

| Variable            | Description                 | Example                 |
| ------------------- | --------------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://127.0.0.1:8000` |

> All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser bundle. They are read at build time, not runtime.

---

## Routing & Access Control

Routes are defined centrally in `Router.tsx`. URL paths are kept in `src/constants/routes.ts` to avoid scattered hardcoded strings.

Two route guard components control access:

- **`PublicRoute`** — redirects authenticated users away from pages like Login and Register, sending them to their role-specific page instead.
- **`ProtectedRoute`** — redirects unauthenticated users to Login. Also enforces role-based access, preventing e.g. an applicant from visiting the recruiter page.

To add a new route, see [Add a new page](#add-a-new-page).

---

## Authentication

Authentication state is managed by `AuthProvider` (`src/auth/`). On login, the backend returns a JWT which is stored in `localStorage` under the key defined in `src/constants/storage-keys.ts`. The token is decoded client-side using `src/utils/jwt-decoder.ts` to derive `isLoggedIn` and `role` — these are never stored separately in state.

A `setTimeout` is set to automatically log the user out when the JWT expires, using the token's `exp` claim.

All API requests that require authentication have the token injected automatically by `src/api/client.ts` via the `Authorization: Bearer <token>` header.

---

## Error & Loading Handling

**Errors** are surfaced to users via a toast notification at the bottom of the screen. Any component or page can trigger one by calling `useError()` from `src/hooks/use-error.ts`:

```ts
const { showError, showApiError } = useError();

// Show a plain message:
showError("Something went wrong.");

// Show a message derived from an API error response:
showApiError(error, "login"); // scope is optional, used to tailor the message
```

**Loading state** works the same way. Call `useLoading()` around async operations to display the full-screen loading overlay:

```ts
const { startLoading, stopLoading } = useLoading();

try {
    startLoading();
    await someService.doSomething();
} finally {
    stopLoading();
}
```

---

## Localization

Translation strings are stored in `src/locales/en/translation.json` and `src/locales/sv/translation.json`. The active language is saved to `localStorage` and persisted across sessions.

To use a translation string in a component:

```tsx
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
return <p>{t("some.key")}</p>;
```

To add a new language, see [Add a new language](#add-a-new-language).

---

## Styling

The app uses **Material UI (MUI)** as its component library. Components such as `Button`, `TextField`, `Card`, `Typography`, and `Stack` are imported directly from `@mui/material`. Inline `sx` props are used for layout and spacing adjustments — there are no global CSS files.

---

## How To: Common Development Tasks

### Add a new page

1. Create a new component in `src/pages/`, e.g. `src/pages/Dashboard.tsx`.
2. Add the route path to `src/constants/routes.ts`:

   ```ts
   const ROUTES = {
       // ...existing routes
       DASHBOARD: "/dashboard",
   } as const;
   ```

3. Register the route in `Router.tsx`, wrapping it in the appropriate guard:

   ```tsx
   // Authenticated users only:
   <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
       <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
   </Route>

   // Public (unauthenticated) only:
   <Route element={<PublicRoute />}>
       <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
   </Route>

   // No restriction:
   <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
   ```

---

### Add a new API call

1. Create a new file in `src/api/`, e.g. `src/api/fetch-something-api.ts`:

   ```ts
   import apiRequest from "./client";

   export interface SomethingResponse {
       id: number;
       name: string;
   }

   const fetchSomethingApi = async (): Promise<SomethingResponse[]> => {
       return apiRequest<SomethingResponse[]>("/api/v1/something");
   };

   export default fetchSomethingApi;
   ```

2. Create or extend a service in `src/services/` that calls the API module and transforms the data as needed.
3. Call the service from a page or hook.

---

### Add a new language

1. Create a new directory under `src/locales/`, e.g. `src/locales/de/`.
2. Copy `src/locales/en/translation.json` into it and translate all values.
3. Register the new language in `src/i18n.ts`:

   ```ts
   import de from "./locales/de/translation.json";

   i18n.init({
       resources: {
           en: { translation: en },
           sv: { translation: sv },
           de: { translation: de }, // add this
       },
       // ...
   });
   ```

4. Add the language to the language toggle component in the header so users can select it.

---

### Add a new role

Roles are defined in a single file — `src/constants/roles.ts`:

```ts
const ROLES = {
    recruiter: 1,
    applicant: 2,
    admin: 3, // add new roles here
} as const;
```

The `Role` type (`src/types/role.ts`) and the role parser (`src/utils/role-parser.ts`) are both derived from this constant automatically — no other changes are needed for the role itself to be recognised. You will still need to:

- Add routing logic in `Router.tsx` for the new role's page.
- Add the role's route to `src/utils/route-navigator.ts` if the role should have a dedicated landing page after login.
- Add any required translation keys for the new role's UI.

---

## Testing

Tests live in the `tests/` directory at the project root and mirror the structure of `src/`. The project uses **Vitest** with **React Testing Library**.

```bash
# Run all tests
npm run test

# Run in watch mode
npx vitest
```

The testing strategy prioritises:

- **Service tests** — verify data transformation and API integration in isolation.
- **Page tests** — verify orchestration (that hooks and services are called correctly), with minimal UI assertions.
- **Hook tests** — verify custom hook logic independently of any component.

When writing a new test, mock external dependencies (API modules, context hooks) using `vi.mock()` so tests remain fast and independent of the backend.

---

## Building for Production

```bash
npm run build
```

This runs TypeScript type-checking and then bundles the app into `dist/`. The output is a set of static HTML, JS, and CSS files that can be served by any static file host or web server.

To verify the production build locally before deploying:

```bash
npm run preview
```

This serves `dist/` at **[http://localhost:4173](http://localhost:4173)**.

> **Important:** The `VITE_API_BASE_URL` in your `.env` must point to the production backend URL before building. Environment variables are baked into the bundle at build time.

---

## Deployment

The frontend is a static site after building. The general steps for deployment are:

1. Set `VITE_API_BASE_URL` in `.env` to the production backend URL.
2. Run `npm run build` to produce the `dist/` folder.
3. Upload or deploy the contents of `dist/` to your hosting platform (e.g. Heroku static buildpack, Netlify, Vercel, or a server running Nginx/Apache).

**CORS:** The backend must have the production frontend URL added to its CORS allowed origins. See the backend README for how to configure this.

**Routing:** Because the app uses client-side routing (React Router), the server must be configured to serve `index.html` for all routes, not just `/`. On Nginx, this is done with a `try_files $uri /index.html;` directive. On Heroku, this is handled automatically by the static buildpack.
