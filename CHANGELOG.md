# Changelog

The [development history](docs/development-history.md) links the dated milestones to their commits. Entries below distinguish tagged release contents from later repository assembly.

## [1.5.6] - 2026-09-20

Corrective Android preview and repository audit. This is a debug build for evaluation, not a production or clinically validated release.

- Corrected the dependency lock so clean GitHub installs succeed.
- Made `npm test` manage its own built Worker preview.
- Reworked project navigation, setup/testing instructions, document-edition guidance, security reporting, and contribution templates.
- Preserved the early Python zone detector and documented historical coverage limits.
- Corrected Android navigation and offline-fallback handling for a new preview build.
- Added a read-only provider for opening the bundled PDF without the retired website download.
- Repaired standalone app interactions that previously depended on unavailable server hydration.
- Corrected narrow-screen header controls and bundled-versus-live status; restored viewport zoom.
- Removed pre-filled claims of clinical interpretation and human verification from demonstration reports.
- Preserved document-generation tooling and added Android build/policy checks to CI.
- Updated Next.js, React/RSC and build dependencies for security fixes; the production dependency audit is clear, with the optional Drizzle development-tool advisory documented in the final audit.

## Repository assembly - 2026-09-20

These commits occurred **after** the original `v1.5.5` tag:

- `78b6edb`: imported Android source and offline assets, current project documents, and brand assets.
- `1744028`: preserved pnpm workspace/lock files.
- `c74cbf2`: introduced contributor/history files and the initial GitHub workflow. The workflow's install failure was discovered and corrected in the final audit.
- `032c8fb`: repaired the npm lock and managed test preview; GitHub verification passed.

## [1.5.5] - 2026-09-20

Tag: `82ac89ba45803bc7003c5d9614464d957cd6bb4c`.

- Reconciled catalogue statistics.
- Added explicit versioning and offline-library wording.
- Published the separately built Android APK as a release attachment. It is a debug-signed WebView preview; the original tag's source tree does not include the later Android import.

See [release provenance](docs/releases.md) for the APK checksum and source relationship.

[1.5.5]: https://github.com/Namdev90/amreye-ai/releases/tag/v1.5.5
[1.5.6]: https://github.com/Namdev90/amreye-ai/releases/tag/v1.5.6
