# Architectural decisions

This is a documentation of some of the architectural decisions made in the team, and may be updated with time as the project grows.

## Decisions regarding the process

### How to take decisions

The team decides to take decisions together through communication in various means as long as a valid discussion can be held, currently over Discord.

### Requirements

Frontend, backend, database.

## Decisions regarding tools

### Build tool

For frontend, the build tool that will be used is Vite.

For backend, we're developing in Python using FastAPI, and there's no need for a build tool.

### Version control

Version control is done using Git on GitHub.

### Deployment

One consideration for deployment is on Heroku. The frontend will use API calls that'll require a proper setup of CORS to communicate with backend.

### IDE

Visual Studio Code will be used by both members in the team.

## Decisions regarding servers and frameworks

The backend server will be built with FastAPI, in Python.

The database that is used for this project is a relational database, with PostgreSQL.

## Decisions regarding code style

Since each of the two team members are responsible separately for frontend and backend, the code styles are mainly up to each individual. Stick to the common coding styles that are used in each language. For variable names that are used on both ends, like when it comes to API calls, and data structure, if possible it should use the same variable names to avoid confusion.

In frontend, prettier is used to ensure consistent formatting is used throughout the main source code.
