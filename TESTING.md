# Verification

## Website

Requirements: Node.js 22.13 or newer, npm, and the locked dependencies.

```sh
npm ci
npm test
```

`npm test` builds the website, starts the built Cloudflare-compatible Vite preview on an available loopback port, runs every `tests/*.test.mjs` file, and closes the preview. A failed install, build, preview startup, or assertion must fail CI. The [Verify workflow](https://github.com/Namdev90/amreye-ai/actions/workflows/ci.yml) runs the same command on Linux for pushes and pull requests.

For a built checkout, run `npm run test:runtime`. Set `TEST_SITE_URL` only when you intentionally want to test an already-running preview. That server is then your responsibility. The individual runtime test files default to port 5179; the managed runner always supplies its actual port.

## What the current suite checks

- Summary coverage and links for 150 public topics, plus project source counts.
- Synthetic measurement bounds, unknown identifiers, unreadable/abstained values, review invalidation, correction provenance, and JSON/CSV agreement.
- Deterministic example maps and missing-data behavior.
- Library routing, canonical metadata, legacy bookmarks, and retired administrative endpoints.
- Website build exclusion of raw chapter data and hosted document files.
- Offline website cache refresh/removal and selected component accessibility contracts.

The website has 150 topic summaries and 107 public HTTPS references. The internal catalogue and historical Android bundle have 150 topics and 121 source records. Their scopes differ; counts should name the dataset being counted.

The website's raw documents and chapter endpoints remain retired (404/410). GitHub project documentation and Android's explicitly bundled offline compendium are separate distribution surfaces. Historical database scaffolding does not require a real account or patient data to run these tests.

## Android and visual checks

`npm test` also runs `tests/android-offline-runtime.test.mjs`, which executes the actual embedded Android demonstration model and verifies that its fictional rules still match the canonical website model. It checks invalidation, unreadable results, report snapshots and native/browser export contracts. The Android CI job compiles and runs the Java URL/document/export policy checks and builds the debug APK with the committed Gradle wrapper.

See [Android build instructions](android/README.md) and [release provenance](docs/releases.md). Website tests do not prove that the APK installs or behaves correctly on a physical phone.

Browser checks should cover navigation, library search, topic dialogs, pitch opening/closing, focus behavior, synthetic unreadable handling, export, and narrow-screen overflow. Name tested viewport sizes and distinguish browser simulation from actual Android testing. Do not interpret build success as all-device validation.

The [final audit](docs/final-audit-2026-09-20.md) records checks actually performed and remaining limits.
