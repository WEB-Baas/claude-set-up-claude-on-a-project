# Notes: setting up Claude Code

## What's in `CLAUDE.md`, and what I left out

I kept four short sections: a one-line description, the three commands (dev, test and lint, noting that CI runs lint and then tests), the conventions and the architecture. Every convention is a rule Claude would otherwise have to guess or ask about. It covers CommonJS rather than ES modules, `node:test` + `supertest` against the exported `app` rather than another test framework, the `{ error }` JSON shape and status codes, data access only through `db/store.js`, and no new dependencies without asking. The architecture section explains why `server.js` only calls `listen()` when it's run directly, and what adding a new resource involves.

I deliberately left out the endpoint list, the seed users and the Express/ESLint versions. Claude can read those from the code in seconds, and they would go stale. I also left out course instructions and one-off tasks, because they don't help in later sessions. Secrets stay out too: the file only points to `.env.example` and says never to read `.env`. Everything in `CLAUDE.md` is loaded into every session, so each line has to be worth its cost.

## Permission rules

- **allow:** `npm test`, `npm run lint` and the read-only git commands `status`, `diff` and `log`. They're safe, I run them constantly, and approving them every time slows things down.
- **ask:** `git push`, `git commit` and `npm install`. These change shared history or the dependency tree, so I want to see each one before it runs.
- **deny:** reading or editing `.env` (including `cat .env`), `git push --force` / `-f`, `git reset --hard` and `rm -rf`.

Without the deny rules, Claude could read `.env` while debugging config. The real secrets would then end up in the conversation and could be repeated in output or a commit. A force-push could overwrite teammates' work on the remote, and `reset --hard` or `rm -rf` could throw away uncommitted work that can't be recovered. `.env.example` stays readable on purpose so Claude can still see which config variables exist.

## Verification

- `/memory` shows the project `CLAUDE.md` as loaded.
- `/permissions` lists the allow, ask and deny rules from `.claude/settings.json`.
- In a fresh session, "How do I run the tests here?" was answered with `npm test` straight from `CLAUDE.md`.
