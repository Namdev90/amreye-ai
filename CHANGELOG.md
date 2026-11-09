# Changelog

The [development history](docs/development-history.md) links the dated milestones to their commits. Entries below distinguish tagged release contents from later repository assembly.

## [1.5.7] - 2026-09-20

Source: [`6e9b0ab`](https://github.com/Namdev90/amreye-ai/commit/6e9b0ab6b7d60e3721340ab63dc66b3b84240ece).

- Advanced Android to version 1.5.7, code 14, and updated bundled/native version labels.
- Added release signing from an external properties file selected by `AMREYE_SIGNING_PROPERTIES`; signing secrets are not part of the repository.
- Published the signed Android APK and its checksum file. The release notes report RSA-4096 signing and APK Signature Scheme v2 verification.
- Added the existing MIT license for original software and documented exclusions for assets, documents and third-party material.
- Retained website package version 1.5.6. This Android release does not establish a new website deployment, physical-device acceptance or clinical suitability.

See [release provenance](docs/releases.md) for tag targets, exact asset names and the distinction between reported signing evidence and fresh verification.

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
[1.5.7]: https://github.com/Namdev90/amreye-ai/releases/tag/v1.5.7
