# To-do CLI

A tiny command-line to-do app. Tasks are saved to `todos.json` next to the script
(set the `TODO_FILE` env var to use another file).

```
node todo.js add Buy milk     # Added #1: Buy milk
node todo.js list             # [ ] 1  Buy milk
node todo.js done 1           # Done #1: Buy milk
node todo.js help
```

Tests: `npm test` from the repo root.
