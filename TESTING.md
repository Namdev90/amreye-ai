# Verification

Start the Vite preview before running `node --test tests/*.test.mjs`.
Runtime tests use `http://127.0.0.1:5173` by default, or `TEST_SITE_URL`.
They exercise the actual Cloudflare-compatible runtime because importing the built Worker directly in plain Node cannot resolve `cloudflare:workers`.

Use an ignored `.dev.vars` with a test admin email for local authorized-path checks. Never add a client-side bypass. Generate and apply the Drizzle migration to the local D1 database before checking review persistence.

Before publication, build the site and verify that `dist/client` contains no private library, intake, or engineering-reference payloads. The public and protected libraries intentionally have different topic counts. All legacy topic IDs remain in the protected library.

Browser checks cover directory navigation, visitor perspective, pitch opening and closing, restored query state, topic dialogs, related links, synthetic unreadable handling, narrow-screen overflow and normal focus behavior. Browser viewport checks do not imply physical-device testing.
