# Architecture and data boundaries

Scope: AMReye default-branch source at [`6e9b0ab`](https://github.com/Namdev90/amreye-ai/commit/6e9b0ab6b7d60e3721340ab63dc66b3b84240ece). This describes implemented software. Hardware, clinical workflows and research concepts shown in the UI remain proposals unless separate evidence establishes otherwise.

## Website request path

1. [Vite configuration](../vite.config.ts) combines Vinext, the project Sites plugin and the Cloudflare Vite plugin.
2. [Worker entry point](../worker/index.ts) applies retired-document routing, legacy redirects and selected response headers before/after delegating to the Vinext app router.
3. [Home page](../app/page.tsx) and [Library page](../app/library/page.tsx) render [the public site shell](../app/public-site.tsx).
4. The client shell selects sections and lazily loads the library, synthetic workbench, map, products, workflow and other UI. [Route helpers](../app/site-routes.mjs) normalize library bookmarks and preserve query parameters.

The stack uses React 19, TypeScript, Vinext/Vite, Tailwind and Cloudflare tooling; exact dependency versions and scripts are in [package.json](../package.json). The retained Next.js configuration/API conventions do not mean this is deployed as a conventional Node-only Next.js server.

## Public routes and retired services

| Surface | Implemented behavior |
| --- | --- |
| `/`, `/#home` and section hashes | Public project navigation |
| `/library?topic=...` | Canonical public summary library |
| Older `#apex` / `#library` bookmarks | Normalized to `/library` by route helpers |
| `/admin` and descendants | Worker redirects to `/library`, preserving the topic query |
| `GET /api/private/library` | HTTP 410: raw document endpoint retired |
| `GET` / `POST /api/private/reviews` | HTTP 410: administrative review workspace removed |
| `GET /api/private/assets?name=...` | Redirect for one of five explicitly allowed image paths; otherwise 404 |
| Hosted document/download/private paths and selected file extensions | Worker returns 410, with the `robots.txt` exception shown in source |
| `/_vinext/image` | Image-optimization handling through Worker asset/image bindings |

Sources: [Worker](../worker/index.ts), [library endpoint](../app/api/private/library/route.ts), [reviews endpoint](../app/api/private/reviews/route.ts), [assets endpoint](../app/api/private/assets/route.ts).

This route table is not a supported clinical or laboratory API. Retained authentication helpers, review schema and database examples do not restore the removed admin service.

## Content and storage

| Material | Role and boundary |
| --- | --- |
| [public-knowledge.json](../app/public-knowledge.json) | Public summaries and references consumed by the live library and project guide |
| [dossier.json](../app/dossier.json), [repository statistics](../app/repository-stats.json) | Broader catalogue and its recorded counts; not the same dataset as public summaries |
| `private/` | Legacy input/reference material, publicly readable in GitHub despite the name; not an access-control boundary |
| [project-docs](../project-docs/README.md) | Published editable document snapshot; edition authority remains as described by its guide |
| [Android assets](../android/app/src/main/assets/) | Versioned bundled web runtime and older compendium; not regenerated automatically by a website build |
| [db](../db/), [drizzle](../drizzle/), [D1 example](../examples/d1/) | Retained optional database scaffolding, not a requirement for anonymous public pages |

The public summary dataset has 150 topics and 107 references at this baseline. The broader catalogue and historical Android content have different reference counts; the [testing guide](../TESTING.md) names their scopes. Do not infer synchronization from equal topic counts.

The website [service worker](../public/sw.js) caches an offline fallback page and icon. It does **not** provide the Android app's complete offline reader.

## Synthetic measurement workbench

[demo-rules.mjs](../app/demo-rules.mjs) supplies six fixed demonstration discs and fictional profiles A/B. These are not CLSI/EUCAST clinical breakpoints.

[measurement-model.mjs](../app/measurement-model.mjs) implements the review state:
- A new run receives a generation and run ID; stale completions are ignored.
- Unreadable scenarios retain unavailable measurements and interpretations.
- Corrections require a finite 6–40 mm demonstration value and a reason; original and corrected values remain distinct.
- Profile changes clear approvals. Applied corrections clear the affected disc's approval and boundary verification.
- Pending correction drafts block report creation. Simulated review is not an authenticated clinical signature.
- Reports capture an immutable snapshot with synthetic labels, timestamps, fictional rule version, comparison fixtures, correction events and audit entries. JSON and CSV describe the same snapshot.

The UI does not turn uploaded patient images into validated AST results. [Measurement tests](../tests/measurement-review.test.mjs) and [Android-runtime tests](../tests/android-offline-runtime.test.mjs) exercise software invariants, not clinical accuracy.

## Project guide and map

[ProjectAssistant](../app/project-assistant.tsx) calls [projectGuideReply](../app/project-guide-core.mjs) over public summaries using [search helpers](../app/search-core.mjs). It labels itself “Source-linked search · Not generative AI.” Conversation state stays in the tab; a provider API key is not needed for this implemented guide.

[network-data.mjs](../app/network-data.mjs) holds deterministic synthetic map examples. Missing/zero-denominator values remain unavailable. It is not a live surveillance feed.

## Android shell

[MainActivity](../android/app/src/main/java/ai/amreye/app/MainActivity.java) hosts the website or packaged reader. [AppUrlPolicy](../android/app/src/main/java/ai/amreye/app/AppUrlPolicy.java) limits internal browsing to the exact HTTPS origins `amreye.in` and `appassets.androidplatform.net`. Other web links are handled externally.

The [compendium provider](../android/app/src/main/java/ai/amreye/app/CompendiumProvider.java) exposes the bundled PDF through a temporary read grant. [SyntheticReportPolicy](../android/app/src/main/java/ai/amreye/app/SyntheticReportPolicy.java) bounds report export; Android's system document picker chooses the destination. The [manifest](../android/app/src/main/AndroidManifest.xml) declares internet/network-state permissions and disables application backup.

The offline model is duplicated in [offline-runtime.js](../android/app/src/main/assets/offline-runtime.js); parity tests are important when either copy changes. Existing recovery notes do not establish a fully reproducible generator for the bundled snapshot.

See [Android operations](../android/README.md), [release provenance](releases.md) and [verification boundaries](../TESTING.md). No physical-device, security or clinical certification follows from this source map.
