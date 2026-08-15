# AGENTS.md

## Tooling & Workflow
- **Syncing**: Uses `clasp` to manage Google Apps Script. Use `clasp push` to upload local changes.
- **Deployment**: Use `clasp deploy` to create new versions of the web app.

## Architecture
- **Backend**: Server-side logic is in `Code.js`. The `doGet()` function is the web app entrypoint.
- **Frontend**: `index.html` is the main UI.
- **Communication**: Client-side code must use `google.script.run` to invoke server-side functions.
- **File Extensions**: Files with `.js` or `.gs` extensions are treated as server-side code. `.html` files are used for client-side templates.
