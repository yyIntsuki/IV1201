# Architectural Decisions

This document records the significant architectural and tooling decisions made during the development of the IV1201 recruitment application. It is intended to help future developers understand not just *what* was built, but *why* specific choices were made, so they can make informed decisions when extending or modifying the system.

Decisions are grouped by area. Each entry describes the choice made and the reasoning behind it.

---

## Process

### How decisions are made

Decisions are made jointly by the team through open discussion. Any significant change to architecture, tooling, or conventions should be discussed and agreed upon before implementation, and this document should be updated to reflect the outcome.

### Separation of responsibilities

The two team members are responsible separately for the frontend and backend. This separation is reflected in the project structure — each side has its own directory, its own README, and its own conventions. Shared concerns such as API contracts and data field naming are coordinated between both members to ensure consistency across the boundary.

---

## Tools

### Version control

Git is used for version control, hosted on GitHub. All significant work is done in branches and merged via pull requests.

### Build tool — frontend

The frontend uses **Vite** as its build tool and development server. Vite was chosen for its fast cold starts, near-instant Hot Module Replacement (HMR), and minimal configuration overhead compared to alternatives such as Webpack or Create React App.

The **React SWC plugin** is used in place of the default Babel-based plugin. SWC is a Rust-based compiler that is significantly faster than Babel, improving rebuild times during development. While the application does not require this level of performance currently, the integration cost is negligible and the benefit scales as the codebase grows.

### Build tool — backend

The backend is written in Python using FastAPI. Python does not require a compilation or bundling step, so no build tool is used. The application is run directly via `uvicorn`.

### IDE

Both team members use **Visual Studio Code**. No IDE-specific configuration is committed to the repository beyond the `.prettierrc` formatting file, so other editors remain fully compatible.

### Deployment

The application is intended for deployment on **Render**. The frontend is built into a set of static files which are served independently. The backend exposes a REST API, and CORS must be configured to allow the frontend's origin. See the backend README for CORS configuration details.

---

## Code Style

### Frontend

TypeScript strict mode is enabled. Component and type names use **PascalCase**. All other files — services, hooks, utilities, constants — use **kebab-case**. These conventions follow standard React and TypeScript community practices and are applied consistently throughout the codebase.

Code formatting is handled by **Prettier**, configured in `.prettierrc`. Formatting is not enforced automatically on commit, but all code should be formatted before being merged. ESLint is configured separately and enforces React-specific rules including hook dependency linting.

### Backend

Python code follows **PEP 8** conventions. Naming follows Python community standards: `snake_case` for variables, functions, and file names; `PascalCase` for class names.

### Shared naming across the boundary

Where variable names appear on both sides of the API boundary — such as field names in request and response bodies — the same name is used on both sides wherever possible. This reduces the cognitive overhead of mapping between frontend and backend representations and makes API contracts easier to trace through the codebase.

---

## Frontend

### Language

The frontend is written in **TypeScript**. TypeScript was chosen over plain JavaScript to catch type errors at compile time, make refactoring safer, and serve as a lightweight form of documentation — type definitions communicate the shape of data at API boundaries and between components without requiring separate documentation.

Strict mode (`"strict": true`) is enabled in `tsconfig`, which activates the full set of TypeScript checks including null safety and implicit any detection.

### Architecture

All frontend source code resides in the `src/` directory and is organised by responsibility rather than by technical type. Each directory has a single, well-defined purpose:

| Directory | Purpose |
| --- | --- |
| `api/` | Raw HTTP calls — one file per backend endpoint |
| `auth/` | Authentication context and provider |
| `components/` | Reusable UI components, organised by feature |
| `constants/` | App-wide constants (routes, storage keys, roles, role IDs) |
| `errors/` | Error context, provider, and toast component |
| `hooks/` | Custom React hooks |
| `layout/` | Shared page layout (header, main area, footer) |
| `loading/` | Loading context and provider |
| `locales/` | i18next translation JSON files |
| `pages/` | Top-level page components |
| `routes/` | Route guard components |
| `services/` | Business logic layer between pages and the API |
| `types/` | Shared TypeScript type definitions |
| `utils/` | Pure utility functions |

The separation between `api/`, `services/`, and `pages/` is intentional and enforced by convention:

- **`api/`** only makes HTTP requests and returns typed data. It has no knowledge of application logic.
- **`services/`** transforms data, enforces business rules, and calls API modules. It has no knowledge of the UI.
- **`pages/`** orchestrates user interaction and delegates all logic to services and hooks. It does not call API modules directly.

This layering means that UI changes do not require changes to data access logic, and vice versa. It also makes service and API logic independently testable without rendering any components.

### Path aliases

All source directories are mapped to `@/`-prefixed path aliases via `vite.config.ts` (e.g. `@/services`, `@/hooks`, `@/types`). This eliminates fragile relative import paths such as `../../../services` and ensures imports remain stable when files are moved. The aliases are mirrored in `tsconfig.app.json` so TypeScript resolves them correctly during type-checking and in tests.

### UI component library

**Material UI (MUI)** is used as the primary component library. MUI provides accessible, themeable React components covering inputs, buttons, layout primitives, dialogs, tables, and more. Using a component library reduces the need for custom CSS, ensures visual consistency across pages, and avoids re-implementing common interaction patterns such as form validation states, loading indicators, and pagination.

### Routing

Client-side routing is implemented using **React Router**. All route paths are defined as constants in `src/constants/routes.ts` to avoid scattered hardcoded strings.

Two route guard components enforce access control:

- **`PublicRoute`** — redirects authenticated users away from public pages (e.g. Login, Register), sending them to their role-specific page instead.
- **`ProtectedRoute`** — redirects unauthenticated users to Login. Also enforces role-based access, ensuring that e.g. an applicant cannot navigate to the recruiter page.

This approach means that access control is declared at the route level and is always enforced, regardless of how a user reaches a URL.

### Authentication

Authentication state is managed by `AuthProvider` in `src/auth/`. On login, the backend returns a JWT which is stored in `localStorage` under the key defined in `src/constants/storage-keys.ts`. The token is decoded client-side using `src/utils/jwt-decoder.ts` to derive `isLoggedIn` and `role` — these are never stored separately, they are always derived from the token on each render.

A `setTimeout` is registered when a valid token is present, triggering automatic logout at the exact moment the JWT `exp` claim is reached.

All API requests that require authentication have the token injected automatically by `src/api/client.ts` via the `Authorization: Bearer <token>` header, meaning individual API modules do not need to handle authentication themselves.

JWTs are validated server-side. A user cannot escalate privileges by modifying client-side data — for example, an applicant cannot grant themselves recruiter access by tampering with the token or local storage.

### API client

All HTTP communication goes through a centralised Axios-based client in `src/api/client.ts`. This client provides a generic `apiRequest` helper that:

- Reads the backend base URL from the `VITE_API_BASE_URL` environment variable
- Automatically attaches the JWT `Authorization` header if a token is present
- Normalises Axios errors into structured `ApiError` objects with a consistent `status`, `message`, and `isNetworkError` shape

Individual API modules call `apiRequest` directly and remain focused on their specific endpoint. This means changes to the token mechanism, error format, or base URL only require changes in one place.

### Error handling

Non-UI errors (service logic, async operations) are handled with standard `try/catch` blocks.

User-facing errors are surfaced through a centralised `ErrorContext`. Any component or page calls `useError()` to obtain a `showError` or `showApiError` function, which triggers a toast notification at the bottom of the screen. The `showApiError` function accepts an optional scope string (e.g. `"login"`, `"register"`) that allows the error message to be tailored to the context — for example, a 401 on login shows a different message than a 401 on a protected page fetch.

Centralising UI error handling ensures a consistent user experience and prevents duplicated error display logic across pages.

### Loading state

Global loading state is managed through `LoadingContext`, which works analogously to the error context. The `useLoading` hook exposes `startLoading` and `stopLoading` functions. Pages call these around async operations to show a full-screen loading overlay, which also includes a delayed "taking longer than expected" message for slow network responses. Centralising loading state avoids scattered local boolean flags across pages.

### Views and components

Pages are located in `src/pages/` and are responsible for rendering UI and handling interaction flow. Pages delegate business logic to services and hooks — they do not contain transformation logic or API calls directly.

Pages are composed of smaller reusable components located in `src/components/`, organised by feature (e.g. `components/applicant/`, `components/recruiter/`, `components/login/`). This keeps individual files focused and makes components independently testable.

### Layout

The application uses a shared layout (`src/layout/MainLayout`) consisting of a header, main content area, and footer. This layout is rendered once and all pages are rendered as children via React Router's `<Outlet>`. This eliminates duplicated layout code across pages and ensures structural consistency.

### Types

TypeScript types for shared data models are defined in `src/types/`. These types serve as the single source of truth for data structures that cross boundaries — between API modules and services, between services and pages, and between parent and child components.

Using centralised types means that when an API response shape changes, the TypeScript compiler identifies every affected callsite in the application.

### Constants

Magic strings are avoided by centralising values in `src/constants/`:

- **`routes.ts`** — all application URL paths as a typed `const` object
- **`storage-keys.ts`** — localStorage key names
- **`roles.ts`** — role names mapped to their numeric backend IDs (single source of truth for role definitions)

Using `as const` ensures TypeScript infers the narrowest possible types (literal strings and numbers rather than `string` and `number`), which allows exhaustive checks and prevents invalid values at compile time.

### Roles

Role definitions are centralised in `src/constants/roles.ts` as a single object mapping role name to numeric database ID:

```ts
const ROLES = { recruiter: 1, applicant: 2 } as const;
```

The `Role` type (`src/types/role.ts`) is derived from the keys of this object. The role parser (`src/utils/role-parser.ts`) builds its ID-to-string lookup map from the same constant dynamically. This means adding a new role requires editing only `constants/roles.ts` — the type and parser update automatically.

### Form validation

Form validation logic is extracted into a `form-validator` utility (`src/utils/form-validator.ts`) rather than being inlined into individual components or hooks. Each validator is a pure function accepting a field value and returning either an error string or `null`. The `useForm` hook accepts these validators as configuration, applying the same validation infrastructure consistently across all forms. This keeps validation logic independently testable and prevents duplication between forms such as Login and Register.

### Naming conventions

Component and type definitions use **PascalCase**. All other source files — services, hooks, utilities, constants, API modules — use **kebab-case**. These conventions follow standard React and TypeScript community practice.

### Localization

The application uses **i18next** for internationalisation. Currently supported languages are English (`en`) and Swedish (`sv`), selectable via a toggle in the header. The active language is persisted in `localStorage`.

All translation strings are stored in `src/locales/` as JSON files. No translatable string is hardcoded directly in a component — all text is referenced via translation keys. This ensures that adding a new language requires only adding a new JSON file and registering it in `src/i18n.ts`, without touching any component code.

### Hooks

Custom hooks in `src/hooks/` encapsulate reusable logic that would otherwise be duplicated across components. Examples include:

- **`useAuth`** — access authentication state and login/logout actions
- **`useError`** — trigger user-facing error notifications
- **`useLoading`** — control the global loading overlay
- **`useForm`** — manage form state, validation, touched tracking, and submission

Each hook is a thin interface over a context or a self-contained piece of stateful logic. Pages use hooks rather than accessing contexts directly, which keeps the dependency surface narrow and makes pages easier to test by mocking at the hook level.

### Testing

The frontend uses **Vitest** with **React Testing Library**. The testing strategy prioritises logic over UI rendering:

- **Service tests** verify data transformation, API call arguments, and error propagation in isolation from any component.
- **Page tests** verify orchestration — that the correct hooks and services are called in the right order with the right arguments. UI assertions are kept minimal to avoid brittleness.
- **Hook tests** verify hook behaviour independently of any component, using `renderHook`.
- **Utility tests** verify pure functions directly, with no mocking except for external libraries.

External dependencies (API modules, context hooks, third-party libraries) are mocked using `vi.mock()`. This keeps tests fast, deterministic, and independent of network or browser state.

---

## Backend

### Architecture

The backend is built with **FastAPI** and follows a three-layer architecture:

- **Presentation Layer** (`app/api/routes/`) — HTTP route handlers. Responsible for request/response serialisation, HTTP status codes, and delegating to services. Contains no business logic.
- **Business Logic Layer** (`app/services/`) — Enforces validation rules, orchestrates multi-step operations, and coordinates between the presentation and data layers.
- **Data Layer** (`app/database/repositories/`) — Executes SQL queries against PostgreSQL. Contains no business logic; returns raw data to services.

This separation ensures that changing the database schema only requires changes in the repository layer, and changing an API response shape only requires changes in the routes layer.

### Authentication

Authentication uses **JWT** (JSON Web Tokens). The login endpoint issues a signed JWT containing the user's `user_id` and `role_id` as claims. The token is signed with a secret key configured via the `JWT_SECRET_KEY` environment variable.

Protected endpoints require the JWT to be sent in the `Authorization: Bearer <token>` header. A FastAPI dependency (`get_current_user` in `app/security/dependencies.py`) validates the token and makes the decoded payload available to the route handler. If the token is missing, malformed, or expired, the dependency returns a 401 response before the route handler executes.

Because the role is encoded in a signed token, users cannot escalate privileges by modifying client-side data.

### Database

**PostgreSQL** is used as the relational database. Connection and query execution use the `databases` async library, allowing non-blocking query execution compatible with FastAPI's async request handlers.

The core tables are:

| Table | Purpose |
| --- | --- |
| `person` | User accounts |
| `role` | Role definitions (applicant, recruiter) |
| `competence` | Available competence categories |
| `competence_profile` | Competences submitted by an applicant |
| `availability` | Availability periods submitted by an applicant; also stores application status |

### API design

All request and response bodies use **JSON**. Request schemas are defined as Pydantic models in `app/api/schemas/`, which provides automatic validation and clear documentation of expected input shapes.

Errors are returned as JSON with a `detail` field. Business logic errors (e.g. duplicate username) are surfaced as 400 responses. Authentication errors return 401. Server-side failures return 500 with a generic message to avoid leaking implementation details.

### Validation

Validation is performed at two levels. Pydantic schemas enforce structural constraints (required fields, field types, length limits) at the presentation layer before the request reaches the service. The service layer enforces business rules (e.g. uniqueness checks, format validation) that require database access or domain knowledge. This two-layer approach catches malformed input early while keeping complex business rules in the appropriate layer.

### CORS

The backend restricts CORS to only the HTTP methods and headers required by the implemented API endpoints. Allowed methods are `GET`, `POST`, `PUT`, `DELETE`, and `OPTIONS` (for preflight). Allowed headers are limited to `Authorization`, `Content-Type`, and `Accept`. This reduces the attack surface by preventing browsers from making requests with unexpected methods or headers. The list of allowed origins must be updated when deploying to a new environment.
