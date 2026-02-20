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

Vite is used as the build tool for the frontend. It provides a dev server that includes enhancements for development such as the Hot Module Replacement (HMR). The React SWC plugin, a Rust-based compiler that replaces Babel in React project, offering greater compilation and build times. It may not be necessary since the project isn't large but it is used as it is easy to include in the project.

### Architecture

All relevant source files are in /src, which then is divided into folders that handle different kinds of functionalities in the frontend. It is a great way to separate concerns and organize functionality individually to avoid messy code structure.

### Router

The router uses the 'react-router' module which allows route definitions and protected routes, which allows preventing users to access pages they do not have access in the application state, such as a logged in user accessing the /login page.

### Authentication

The user authorizes by logging in, which fetches a login response from the API. If user successfully log in, the session is stored in form of a AuthContext, which is accessible by a useAuth hook. The AuthProvider decides which authorization service it uses, currently there is only one such service. By separating it into a service gives the opportunity to test multiple methods of authentication, if needed.

The app uses JWT (JSON Web Token) as a secure way to store authentication session. This token is provided by the backend. It is encrypted and then stored in the frontend client's local storage. Due to its encrypted nature, the user cannot get access to pages they aren't allowed to. For instance an applicant cannot modify the JWT to authorize themselves as recruiter.

### Views

The views of the frontend are put in /pages, which handles UI that is presented to the user, and interaction logic. The interactions should call functions from other parts of the code to return relevant data, and not directly from the code in /pages.

To make componnets easier to work with, the views splits out components that it uses to separate concerns. This helps the architectural abstraction and maintenance. Despite being a bit more complex to set up.

### Layout

The app uses a Header, MainLayout, Footer format. It may not look like it first but due to how little information that is required to be shown on the screen by specifications. The header and footer elements are transparent, but fixed at the page top respectively bottom. By having a layout, we eliminate the need of rewriting same components on each page.

### Types

Types are used as definitions to data structures. They are used to define data that is used in various places in the app, which may be used elsewhere than just that one page. This can help with data consistency across the app.

### Naming conventions

The actual syntax namings should follow the most regular conventions. However, there are no such strict rules for file namings. In this regard, the frontend uses PascalCase for everything that are used like components and types, then kebab-case for everything else.

### Error handling

Currently, the logic (non-UI) error handling are done by catching errors in try-catch blocks. This should be the recommended approach, especially for logic errors.

The UI errors (such as login fail, registration fail) are handled in the form as an error context, which provides a hook to display an error toast at the bottom of the screen showing the error message. By using the hook, we eliminate the need to implement the error logic in each view that needs it.

### Localization

Currently, the app uses i18next for internationalization. The implemented languages are English and Swedish. This can be toggled in the top right corner using a button group.

The i18next framework helps setting up a simple translation module that can be easily maintained, and all the language texts are put in one place, i.e. /locales.

### Hooks

Hooks are used to provide a concentrated functionality of certain modules. They are great for reducing redundant and duplicated code, whether it is rendering or logic. For instance, use-auth and use-error are used globally in the frontend, which benefits from a hook that can be called anywhere within the app with their respective contexts that wraps the entire app. Then use-form is one that helps with redundant form creation which would be redundant as they would've been using the same code in Login and Register pages.


### Browser compatibility

At each major implementation or change of a page, or component of pages. A check is done to ensure the frontend application is shown consistently between different browsers. Currently the tested browsers are Brave and Microsoft Edge.

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
