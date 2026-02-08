# Architectural decisions

This is a documentation of some of the architectural decisions made in the team, and may be updated with time as the project grows.

## Decisions regarding the process

<details>

<summary>Collapsed Section</summary>

### How to take decisions

The team decides to take decisions together through communication in various means as long as a valid discussion can be held, currently over Discord.

### Requirements

Frontend, backend, database.

</details>

## Decisions regarding tools

<details>

<summary>Collapsed Section</summary>

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

<summary>Collapsed Section</summary>

The backend server will be built with FastAPI, in Python.

The database that is used for this project is a relational database, with PostgreSQL.

</details>

## Decisions regarding code style

<details>

<summary>Collapsed Section</summary>

Since each of the two team members are responsible separately for frontend and backend, the code styles are mainly up to each individual. Stick to the common coding styles that are used in each language. For variable names that are used on both ends, like when it comes to API calls, and data structure, if possible it should use the same variable names to avoid confusion.

</details>

## Frontend

<details>

<summary>Collapsed Section</summary>

### Build tool and language

Vite is used as the build tool for the frontend. It provides a dev server that includes enhancements for development such as the Hot Module Replacement (HMR). The React SWC plugin, a Rust-based compiler that replaces Babel in React project, offering greater compilation and build times. It may not be necessary since the project isn't large but it is used as it is easy to include in the project.

### Architecture

All relevant source files are in /src, which then is divided into folders that handle different kinds of functionalities in the frontend. It is a great way to separate concerns and organize functionality individually to avoid messy code structure.

### Router

The router uses the 'react-router' module which allows route definitions and protected routes, which allows preventing users to access pages they do not have access in the application state, such as a logged in user accessing the /login page.

### Authentication

The user authorizes by logging in, which fetches a login response from the API. If user successfully log in, the session is stored in form of a AuthContext, which is accessible by a useAuth hook. The AuthProvider decides which authorization service it uses, currently there is only one such service. By separating it into a service gives the opportunity to test multiple methods of authentication, if needed.

### Views

The views of the frontend are put in /pages, which handles UI that is presented to the user, and interaction logic. The interactions should call functions from other parts of the code to return relevant data, and not directly from the code in /pages.

### Types

Types are used as definitions to data structures.

### Naming conventions

The actual syntax namings should follow the most regular conventions. However, there are no such strict rules for file namings. In this regard, the frontend uses PascalCase for everything that are used like components and types, then kebab-case for everything else.

</details>
