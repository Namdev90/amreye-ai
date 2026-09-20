# Releases and artifact provenance

Installable APKs are attached to [GitHub releases](https://github.com/Namdev90/amreye-ai/releases). Download the APK and its `SHA256SUMS.txt` from the same release. The source archive is a separate artifact.

## v1.5.6 preview

The corrective preview contains the assembled project source, current documents, historical source snapshots, and the Android fixes described in the [changelog](../CHANGELOG.md). Its Git tag selects that complete source tree. Android package: `ai.amreye.app`; version name `1.5.6`; version code `13`; minimum API 26; target API 35.

This is a **debug-signed, debuggable evaluation build**. Production signing is not configured. Its publication does not establish Play Store readiness, successful installation on every device, clinical validation, or diagnostic suitability. The [final audit](final-audit-2026-09-20.md) distinguishes build, browser, source and device checks.

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
