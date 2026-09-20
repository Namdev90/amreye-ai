# Android app

This is a native Android **WebView application**, not a Trusted Web Activity. It opens `https://amreye.in/#home` and includes a bundled reader at `https://appassets.androidplatform.net/index.html#hub`. The bundled snapshot and the live website can evolve independently.

The app requires Android 8.0 (API 26) or later and targets API 35. Its only declared permissions are internet access and network-state access. The native bridge is intended for trusted first-party content; do not embed untrusted frames in pages served by the live origin.

## Build

Use JDK 17, Android SDK Platform 35 and Build Tools 35.0.0. Set `JAVA_HOME` to the JDK and `ANDROID_HOME` to the SDK. The committed Gradle wrapper selects Gradle 8.7; its first run needs network access to download that distribution. No signing key is committed.

From the repository root on Windows:

```text
.\android\gradlew.bat -p android :app:assembleDebug
```

On Linux or macOS, use `./android/gradlew -p android :app:assembleDebug`. The installable development APK is `android/app/build/outputs/apk/debug/app-debug.apk`. The current Android version is 1.5.6, version code 13. Debug builds are previews: they are debuggable and use an Android debug certificate. The published v1.5.5 APK was verified as a debug build, not a production-signed release.

```text
.\android\gradlew.bat -p android :app:assembleRelease
```

The release task produces an unsigned APK because release signing is not configured. A production release requires an owner-controlled signing key, a secure signing process and a version code greater than the previously distributed version. A different signing certificate cannot update an existing installation in place. Never commit signing keys or passwords.

## Offline behavior

The app starts the packaged snapshot when no network is reported. A main-page network error or HTTP error while browsing the live site switches to the packaged snapshot. The bundled `documents/amreye-compendium.pdf` opens offline in an installed PDF viewer through a temporary read grant. Its non-exported content provider exposes only that exact document, copies it into private cache, and rejects other paths and every write mode. If no PDF viewer is installed, the app shows a message directing the user to the offline research library. External PDFs and websites still need network access; email links need an installed email application. The packaged reader does not make external services available offline.

The native navigation policy allows only the exact HTTPS origins `amreye.in` and `appassets.androidplatform.net` inside the WebView. Other HTTP(S) navigation links open externally; untrusted main-frame requests, including form posts, are blocked. File/content access and mixed HTTP content are disabled.

Synthetic demonstration reports can be saved as JSON or CSV through Android's system document picker. Each UTF-8 export is limited to 1 MiB and uses a generated filename. The app writes only after the user chooses a destination; cancellation writes nothing. No storage permission is required. A report interrupted by process recreation must be exported again. These are synthetic teaching records, not clinical results.

## Validation

The pure Java URL-policy checks can run without Android or Gradle. From the repository root, create a temporary output directory and run:

```text
javac -d <temporary-directory> android/app/src/main/java/ai/amreye/app/AppUrlPolicy.java android/tests/ai/amreye/app/AppUrlPolicyTest.java
java -cp <temporary-directory> ai.amreye.app.AppUrlPolicyTest
javac -d <temporary-directory> android/app/src/main/java/ai/amreye/app/SyntheticReportPolicy.java android/tests/ai/amreye/app/SyntheticReportPolicyTest.java
java -cp <temporary-directory> ai.amreye.app.SyntheticReportPolicyTest
```

These checks do not replace emulator or physical-device tests. Before distribution, verify startup with and without internet, server failure and reconnection, Android Back, menu and search, library reading, document/email links, rotation, and supported Android versions. No device test is implied by a successful build or source audit.
