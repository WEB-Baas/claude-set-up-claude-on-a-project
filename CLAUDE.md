# CLAUDE.md

Small Express REST API (users + health check) with an in-memory data store, used as the starter project for the Claude Code course.

## Commands

- `npm run dev` — start the API with auto-reload on http://localhost:3000 (`PORT` overrides)
- `npm test` — run the tests (Node's built-in `node:test` runner)
- `npm run lint` — ESLint; CI runs lint and then tests on every push and PR, so both must pass

## Conventions

- Use CommonJS (`require` / `module.exports`), not ES modules (`import` / `export`) — ESLint is configured with `sourceType: "script"`.
- Write tests with `node:test` + `node:assert` and `supertest` against the exported `app`, not Jest/Mocha, and never by starting a real server. Put them in `tests/<resource>.test.js`.
- Return errors as JSON `{ "error": "<message>" }` with the matching status code (400 for invalid input, 404 for not found); successful creates return 201.
- Route handlers never touch data directly — add a function to `db/store.js` and call that.
- Put a one-line `// METHOD /path — what it does` comment above each route handler.
- Do not add dependencies without asking first.

## Architecture

- `server.js` — builds the Express app, mounts each router under its path, and exports `app`. It only calls `listen()` when run directly, so tests can import it.
- `routes/` — one file per resource (`users.js`, `health.js`), each exporting an `express.Router()`. A new resource gets a new file here plus an `app.use()` line in `server.js`.
- `db/store.js` — the only data access layer. Data lives in memory and resets on every restart.
- Config comes from environment variables; `.env.example` lists them. Never read or commit `.env`.
