# Development, operations and troubleshooting

Start with [README](../README.md), [architecture](architecture.md) and [testing](../TESTING.md). Commands below are for a trusted checkout of the AMReye `main` tree, not the independent Windows device-manager branch.

## Website setup

Use Node.js **22.13 or newer**, npm and the committed `package-lock.json`. CI uses Node 22 on Linux. The imported pnpm lock/workspace files are historical inputs; do not mix package managers.

```sh
git clone https://github.com/Namdev90/amreye-ai.git
cd amreye-ai
npm ci
npm run dev
```

Open the address Vite prints. Anonymous public pages require neither a real database nor a secret. Use only synthetic examples; do not enter patient or confidential laboratory records.

## Commands and their scope

| Command | What it does |
| --- | --- |
| `npm ci` | Installs the npm lockfile exactly |
| `npm run dev` | Starts the Vite/Vinext development server |
| `npm run build` | Runs the Node build wrapper and Vinext build; the wrapper has a three-minute timer |
| `npm test` | Builds, then runs every Node test through the managed Worker-compatible preview |
| `npm run test:runtime` | Tests an existing build; does not rebuild stale output |
| `npm run start` | Starts the built Vinext application with a local Wrangler log path |
| `npm run lint` | Runs ESLint through the Bash environment helper |
| `npm run db:generate` | Generates optional Drizzle migrations; not needed for public-page setup |
| `npm run install:ci` | Uses the bounded platform install helper; normal repository CI uses `npm ci` |

Sources: [scripts](../package.json), [build wrapper](../scripts/build-verified.mjs), [test runner](../scripts/test-runtime.mjs), [environment helper](../scripts/sites-env.sh). Bash is required for scripts that explicitly invoke it.

For a deliberate test against an already-running preview, set `TEST_SITE_URL` to its URL. Otherwise the runner starts a loopback preview on an available port and closes it. An externally supplied preview remains your responsibility. The full suite requires the Worker-compatible runtime; importing the generated server into plain Node is not equivalent.

## Configuration inventory

| Name | Purpose / handling |
| --- | --- |
| `ADMIN_EMAILS` | Retained server allowlist helper. Setting it does not recreate the removed admin routes. |
| `AI_API_BASE_URL`, `AI_API_KEY`, `AI_MODEL` | Optional placeholders in `.env.example`; the current source-linked project guide does not require a generative provider. Never commit a real API key. |
| `TEST_SITE_URL` | Optional external preview used by the test runner |
| `WRANGLER_WRITE_LOGS`, `WRANGLER_LOG_PATH`, `MINIFLARE_REGISTRY_PATH` | Tooling state/log locations configured by Vite and build helpers |
| `SITES_RUNTIME_ROOT` | Optional runtime directory for the Bash environment helper |
| `JAVA_HOME`, `ANDROID_HOME` | Android JDK and SDK locations |
| `AMREYE_SIGNING_PROPERTIES` | Path to an external Android signing-properties file; keep the file, passwords and keystore outside Git |

The existing [hosting guide](hosting.md) describes platform-specific D1/R2 bindings, authentication helpers and bounded shell tooling. Some material is retained integration scaffolding, not a claim that those capabilities are active in the current public app. The timeout variables described there control their shell helpers; the current `npm run build` uses the Node wrapper's fixed timer.

## Common problems

| Symptom | Check / next step |
| --- | --- |
| Dependency installation fails | Check Node/npm versions, registry access and lockfile consistency. Preserve the failure output. Do not “repair” a documentation change by rewriting lockfiles or switching package managers. |
| Tests cannot connect to port 5179 | Run `npm test` for the managed preview. Individual test files have a fallback URL; that fallback does not start a server. |
| Runtime tests exercise old behavior | Rebuild, or use `npm test` rather than `test:runtime`. |
| Worker imports fail in plain Node | Use the Vite/Cloudflare preview expected by the test runner. |
| D1 binding unavailable | Only database-dependent work needs a real binding. Do not add credentials just to view anonymous pages. Consult hosting guidance for a deliberate database feature. |
| Document URL returns 410 | This is intentional retirement. Use `/library` summaries, the GitHub document set, or the Android bundled edition. |
| Browser offline mode shows a fallback rather than the full library | The web service worker and Android offline bundle have different scope. |
| Android release task yields an unsigned APK | Signing is optional unless an external properties file is supplied. Verify the resulting artifact before calling it signed. |
| APK will not upgrade an older preview | Compare signing certificates and version codes. A production certificate cannot update a different debug certificate in place. Preserve data; do not assume uninstall is harmless. |
| Bundled PDF will not open | Test with an installed PDF viewer on an actual device; the app has a fallback message. Browser testing cannot validate Android intent handling. |

## Change and release checklist

1. Record the source commit and the affected surface: website, Android snapshot, project documents or historical tooling.
2. Run relevant tests, plus the full checks required by [CONTRIBUTING](../CONTRIBUTING.md). Report exact commands and failures rather than reusing old test counts.
3. For UI changes, check navigation, keyboard/focus, overflow, interrupted interactions and several viewport sizes. Name browser checks separately from device checks.
4. For Android, follow [the build guide](../android/README.md), verify package/version/signature/checksum, and test installation, upgrade and system-picker/PDF flows on supported devices.
5. Preserve existing tags/APKs. Publish changed binaries as a new explicitly versioned release and record their source relationship.
6. Update [changelog](../CHANGELOG.md), [release provenance](releases.md) and relevant edition/history guides.
7. Do not assume a Git push, documentation PR or APK release deploys `amreye.in`. Deployment and release publication are separate operations.

Do not commit signing material, local environment files, patient records, private conversations or build caches. Use [private vulnerability reporting](../SECURITY.md) for sensitive issues.
