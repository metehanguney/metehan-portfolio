# Semazen Cloudflare D1 / Access deployment guide

The API worker code in `worker.js` is **not active** until Cloudflare bindings and Access are configured. Do not deploy it with missing Access settings.

1. Create a Cloudflare D1 database called `semazen-menu`.
2. Bind the D1 database to the **same Worker** with binding name `SEMAZEN_DB`. Obtain its database_id for the Wrangler config.
3. Run `semazen/db/schema.sql` against that D1 database.
4. Import the existing 99 records from `semazen/data/menu.json` using a controlled migration. Preserve the IDs.
5. Create a Cloudflare Access self-hosted application for the **exact** `/semazen/admin/*` path and for `/api/semazen/admin/*`, allowing only designated restaurant administrators. Access application policies should require authentication. Protect both routes, not just the UI.
6. Set Worker environment variables `ACCESS_TEAM_DOMAIN` (e.g. `myteam.cloudflareaccess.com`) and `ACCESS_AUD` (the Access application AUD tag). If using separate Access apps for UI and API, configure a distinct API AUD and verify it in the worker.
7. Add `main: "./semazen/worker/worker.js"` to Wrangler config, plus D1 binding with the actual database_id. Retain the existing `assets.directory` setting and set `assets.run_worker_first` for `/api/semazen/*` if needed by your Wrangler version.
8. Before merging, verify anonymous API writes return 401, authorized edits persist to D1, and the public menu reads reflect changes.

Never put a static administrator password in client HTML or public source code. For images, store public image URLs initially; use Cloudflare R2 later for uploads.
