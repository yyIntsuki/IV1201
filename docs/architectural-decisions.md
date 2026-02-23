# Architectural decisions

This is a documentation of some of the architectural decisions made in the team, and may be updated with time as the project grows.

## Decisions regarding the process

<details>

<summary>Collapsed section</summary>

### How to take decisions

The team decides to take decisions together through communication in various means as long as a valid discussion can be held, currently over Discord.

### Requirements

Frontend, backend, database.

</details>

## Decisions regarding tools

<details>

<summary>Collapsed section</summary>

### Build tool

For frontend, the build tool that will be used is Vite.

For backend, we're developing in Python using FastAPI, and there's no need for a build tool.

### Version control

Version control is done using Git on GitHub.

### Deployment

One consideration for deployment is on Heroku. The frontend will use API calls that'll require a proper setup of CORS to communicate with backend.

### IDE

Visual Studio Code will be used by both members in the team.

</details>

## Decisions regarding servers and frameworks

<details>

<summary>Collapsed section</summary>

The backend server will be built with FastAPI, in Python.

The database that is used for this project is a relational database, with PostgreSQL.

</details>

## Decisions regarding code style

<details>

<summary>Collapsed section</summary>

Since each of the two team members are responsible separately for frontend and backend, the code styles are mainly up to each individual. Stick to the common coding styles that are used in each language. For variable names that are used on both ends, like when it comes to API calls, and data structure, if possible it should use the same variable names to avoid confusion.

</details>

## Frontend

<details>

<summary>Collapsed section</summary>

### Build tool and language

The frontend is built using **Vite**, which provides a fast development server with **Hot Module Replacement** (HMR) for immediate feedback during development. Vite offers a modern, minimal configuration and significantly improves startup and rebuild times compared to traditional bundlers.

The project uses the **React SWC plugin**, a Rust-based compiler that replaces Babel. While the application itself is not large enough to strictly require this optimization, SWC is included due to its ease of integration and improved compilation performance, which benefits long-term maintainability and scalability.

### Architecture

All frontend source code resides in the `/src` directory and is organized by responsibility. This structure enforces separation of concerns by grouping logic into folders based on functionality rather than technical type alone.

The architecture encourages clear ownership of responsibilities; reduced coupling between UI, logic, and data access; easier navigation and long-term maintainability.

This structure minimizes the risk of a monolithic or unstructured codebase as the application evolves.

### Naming conventions

Component and type definitions use **PascalCase**, following common React and TypeScript conventions. Other files, such as services, hooks, and utilities, use **kebab-case**.

While file naming rules are not strictly enforced, consistent conventions are followed to improve readability and developer experience.

### Routing

Client-side routing is implemented using **React Router**. Routes are centrally defined and include support for protected routes.

Protected routing is used to prevent users from accessing views that are not valid for their authentication state, such as preventing authenticated users from navigating to the login page or unauthenticated users from accessing restricted pages.

### Path aliases

All source directories are mapped to `@/`-prefixed path aliases via the Vite configuration (e.g. `@/components`, `@/services`, `@/hooks`). This eliminates fragile relative import paths such as `../../../services` and ensures that imports remain stable when files are moved. It also makes the origin of an import immediately clear from the path prefix alone.

### Authentication

Authentication is handled through a dedicated authentication layer built around a React context (`AuthContext`) and accessed via a `useAuth` hook.

When a user logs in, credentials are sent to the backend API. Upon successful authentication, a **JSON Web Token** (JWT) is returned and stored securely in the browser’s local storage. This token represents the authenticated session and is used for authorization in subsequent API requests.

The authentication logic is abstracted behind a service layer, allowing the application to support multiple authentication strategies in the future if required. This separation also improves testability and reduces coupling between authentication logic and UI components.

JWTs are validated server-side, meaning users cannot escalate privileges by modifying client-side data. For example, an applicant cannot authorize themselves as a recruiter by tampering with the token.

### Views and components

Application views are located in the `/pages` directory. Each page is responsible for rendering user-facing UI, handling interaction flow, and delegating business logic to services or hooks.

To improve maintainability and readability, pages are composed of smaller, reusable components. While this introduces a slightly higher initial setup cost, it significantly improves clarity, testability, and reuse as the application grows.

### UI component library

The application uses **Material UI** (MUI) as its primary component library. MUI provides a comprehensive set of accessible, themeable React components that are used throughout the application for inputs, buttons, cards, typography, and layout primitives. Using a component library reduces the need for custom CSS, ensures visual consistency, and speeds up development without sacrificing quality.

### Layout

The application follows a shared layout structure consisting of a header, main content area, and footer. These elements are implemented once and reused across all pages.

Although the header and footer are visually minimal and transparent due to the application requirements, the layout abstraction eliminates duplication and ensures consistent structure across views.

### API client

All HTTP communication with the backend is handled through a centralized API client built on **Axios** (`src/api/client.ts`). This client provides a generic `apiRequest` helper that automatically attaches the JWT `Authorization` header from local storage, parses responses, and maps Axios errors into structured `ApiError` objects with a consistent shape.

Individual API modules (e.g. `login-api`, `register-api`) call this shared client, keeping the lower-level HTTP logic in one place and allowing API modules to remain focused on their specific endpoint. This separation also makes it straightforward to adapt the client in the future, for example to change token storage or add request retries, without touching individual API files.

### Types

TypeScript types are used extensively to define shared data structures across the application. These types act as a single source of truth for data models exchanged between components, services, and API layers.

This approach improves data consistency, reduces runtime errors, and makes refactoring safer and more predictable.

### Constants

Magic strings for routes and local storage keys are avoided by centralizing them in `src/constants/`. `ROUTES` defines all application URL paths as a typed `const` object, and `STORAGE_KEYS` defines local storage key names. This ensures that references to these values are consistent across the codebase and that typos are caught at compile time via TypeScript's `as const` typing.

### Hooks

Custom hooks are used to encapsulate reusable logic and shared behavior. Examples include authentication, error handling, loading state management, and form handling.

Hooks reduce code duplication and improve composability. For example, form logic shared between the Login and Register pages is extracted into a reusable hook instead of being reimplemented in each view.

### Form validation

Form validation logic is extracted into a dedicated `form-validator` utility rather than inlined into individual form hooks or components. Validators are functions that accept a field value and return either an error string or `null`. The `useForm` hook accepts these validators as configuration, meaning the same validation infrastructure is reused across all forms in the application. This separation keeps validation logic testable in isolation and prevents duplication between the Login and Register flows.

### Loading state

Global loading state is managed through a dedicated `LoadingContext`, analogous to the error context. A `useLoading` hook exposes `startLoading` and `stopLoading` functions, as well as the current `loading` boolean. Pages call these around async operations to control UI feedback such as disabling submit buttons during in-flight requests. Centralizing loading state avoids duplicated local boolean flags across pages and ensures consistent behavior.

### Error handling

Non-UI logic errors are handled using standard **try–catch** blocks, which is the recommended approach for asynchronous operations and service-level logic.

User-facing errors (e.g. login or registration failures) are handled through a centralized error context. This context exposes a hook that allows any view to trigger an error toast notification.

By centralizing UI error handling, the application avoids duplicated error logic and ensures a consistent user experience across all views.

### Localization

The application uses **i18next** for internationalization. Currently supported languages are English and Swedish, which can be toggled via a button group in the top-right corner of the UI.

All translation strings are stored centrally in the `/locales` directory, making the system easy to maintain and extend with additional languages.

### Testing

The frontend follows a layered testing strategy focused primarily on logic and orchestration rather than UI rendering.

Service-level tests are prioritized to verify data transformation correctness, API integration behavior, and error propagation.

By testing services independently of React components, the test suite avoids unnecessary complexity related to multi-step UI flows and component composition. This approach ensures that core business logic is reliable without tightly coupling tests to implementation details of the UI.

Where appropriate, page-level tests are used to verify orchestration behavior (e.g. interaction between hooks and services), while component rendering is kept minimal in tests to reduce brittleness and maintenance overhead.

### Browser compatibility

After major feature implementations or UI changes, the application is manually verified across multiple browsers to ensure consistent behavior and appearance. Currently tested browsers include **Brave** and **Microsoft Edge**.

This helps identify browser-specific issues early and ensures a consistent user experience across supported platforms.

</details>

## Backend

<details>

<summary>Collapsed section</summary>

### Architecture

The backend is built with FastAPI and follows a layered architecture:

- **Presentation Layer**: API routes (`app/api/routes`) handle HTTP requests and responses.
- **Business Logic Layer**: Services (`app/services`) enforce validation and orchestrate workflows.
- **Data Layer**: Repositories (`app/database/repositories`) execute SQL queries against PostgreSQL.

### Authentication

Authentication uses JWT. The login endpoint returns a JWT which the frontend stores in local storage and sends in the `Authorization: Bearer <token>` header. Protected endpoints require a valid token.

### Database

PostgreSQL is used as the relational database. The core tables are:

- `person`
- `role`
- `competence`
- `competence_profile`
- `availability`

### API design

The API uses JSON for request/response bodies and consistent error handling. Validation is performed both at the schema level (Pydantic) and in the service layer for business rules.

### CORS and HTTP methods

The backend restricts CORS to only the HTTP methods and headers required by the implemented API endpoints. Allowed methods include GET, POST, PUT, and DELETE, corresponding to the defined routes, while OPTIONS is permitted for browser preflight requests. Allowed headers are limited to Authorization, Content-Type, and Accept to support JWT-based authentication and JSON request bodies. This reduces the attack surface by preventing unnecessary methods and headers.

</details>
