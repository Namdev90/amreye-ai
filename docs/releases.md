# Releases and artifact provenance

Installable APKs are attached to [GitHub releases](https://github.com/Namdev90/amreye-ai/releases). Download the APK and the checksum asset named on that same release. The source archive is a separate artifact. Checksum filenames differ between releases.

## Release/source map

| Release | Tagged source commit | Android version / code | Distribution |
| --- | --- | --- | --- |
| [v1.5.7](https://github.com/Namdev90/amreye-ai/releases/tag/v1.5.7) | [`6e9b0ab`](https://github.com/Namdev90/amreye-ai/commit/6e9b0ab6b7d60e3721340ab63dc66b3b84240ece) | 1.5.7 / 14 | Published signed release |
| [v1.5.6](https://github.com/Namdev90/amreye-ai/releases/tag/v1.5.6) | [`084ad93`](https://github.com/Namdev90/amreye-ai/commit/084ad93d89fb842f291c952e4139aa1dff5c4158) | 1.5.6 / 13 | Debug preview |
| [v1.5.5](https://github.com/Namdev90/amreye-ai/releases/tag/v1.5.5) | [`82ac89b`](https://github.com/Namdev90/amreye-ai/commit/82ac89ba45803bc7003c5d9614464d957cd6bb4c) | 1.5.5 / 12 | Historical debug APK; tagged source predates Android import |

These are annotated Git tags; the table records their dereferenced **commit** targets. An APK signature and a Git tag/commit signature are different things. Signing and release publication do not establish medical-device clearance or clinical validation.

## v1.5.7 signed Android release

Published on **20 September 2026** for package `ai.amreye.app`, version code **14**, minimum Android 8.0/API 26 and target API 35. The [release notes](https://github.com/Namdev90/amreye-ai/releases/tag/v1.5.7) report a 4,096-bit RSA signing key and APK Signature Scheme v2 verification. That is published release evidence, not a new local signature inspection in this documentation update.

| Asset | Metadata reported by GitHub |
| --- | --- |
| `AMReye-AI-v1.5.7.apk` | 6,449,348 bytes |
| `AMReye-AI-v1.5.7-SHA256SUMS.txt` | Companion checksum file |

GitHub's APK asset metadata records SHA-256:

```text
f0c1b22a989984e643a46275ff1ceada9ebf555063e0a40540f15a17e252da17
```

Download both assets from the release page, compare the APK hash with the companion file, and inspect signing with the Android build tools when evaluating an artifact. Metadata alone does not prove a downloaded file is intact.

The source adds external signing support in [android/app/build.gradle](../android/app/build.gradle). `AMREYE_SIGNING_PROPERTIES` must point to an owner-controlled properties file with the required keystore settings. Without that configuration, the release task is not evidence of a signed build. Do not commit passwords or a signing key.

A release signed with a different certificate cannot update a debug-signed preview in place. Installation, upgrade, system-picker/PDF behavior and supported-device acceptance still need device testing. The signed app remains a **research/prototype demonstration, not for clinical use**.

The website `package.json` remains version **1.5.6**. Android and website versions are independently recorded; this release does not claim to redeploy `amreye.in`.

## v1.5.6 preview

The corrective preview contains the assembled project source, current documents, historical source snapshots, and the Android fixes described in the [changelog](../CHANGELOG.md). Its Git tag selects that complete source tree. Android package: `ai.amreye.app`; version name `1.5.6`; version code `13`; minimum API 26; target API 35.

This is a **debug-signed, debuggable evaluation build**. Production signing was not configured for that preview; it was added subsequently for v1.5.7. Its publication does not establish Play Store readiness, successful installation on every device, clinical validation, or diagnostic suitability. The [final audit](final-audit-2026-09-20.md) distinguishes build, browser, source and device checks.

The Android shell opens the live website when available and carries a separately versioned offline library. It is a WebView app, not a Trusted Web Activity. This release does not itself deploy new website content to `amreye.in`.

Build the APK with the committed Gradle wrapper and the requirements in [android/README.md](../android/README.md). Local and CI debug builds can have different debug certificates; an upgrade requires the same signing certificate. Preserve app data before considering any uninstall, and do not assume that every debug APK can update an existing installation.

Published preview: `AMReye-AI-v1.5.6-preview.apk`, **6,789,504 bytes**. SHA-256:

```text
74640c3d255b79dc5e9ace72828f3bd44715f8eeba18c7d1b01685aeea9d008d
```

The local preview's APK v2 signature was verified and its debug certificate matches the original v1.5.5 APK. All 215 packaged assets matched the final local source assets byte for byte. This supports artifact integrity and signing continuity; an actual device upgrade was not performed.

## Original v1.5.5

The original annotated tag remains unchanged at `82ac89ba45803bc7003c5d9614464d957cd6bb4c`. That commit contains the web release. Android source, documents and brand assets were imported afterwards in `78b6edb`; they are not present in the original tagged source archive.

The separately attached `AMReye-AI-v1.5.5.apk` is 6,996,809 bytes. Its SHA-256 is:

```text
a8c675bc6a814b78c65b342a1836add7eda083fe8d56f02b9a47429afbf41718
```

Inspection identified package `ai.amreye.app`, version name `1.5.5`, version code `12`, API 26 minimum, API 35 target, and an Android debug signature. All 213 packaged asset files matched the original imported Android assets. The six images previously reported as missing were present; that earlier result was a path-separator comparison error.

Matching assets does not reconstruct the exact historical native build environment. The initial APK contains defects corrected in v1.5.6, including trust matching, offline PDF routing and inert controls in the bundled UI. It remains available as a historical artifact.

## Documents are separate editions

The APK contains the historical 300-page compendium. The current editable repository documents contain a seven-page overview and seven supporting references, with 203 supporting pages recorded in the delivery guide. The [document guide](../project-docs/README.md) identifies the files, edition boundaries and original-master backup.
