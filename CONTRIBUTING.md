# Contributing

AMReye.AI is a research and prototype project. Keep current behavior, proposed products, and future research distinct.

## Development

1. Read the [README](README.md) and [testing guide](TESTING.md).
2. Create a focused branch from `main` and install with `npm ci`.
3. Make the smallest coherent change, preserving existing source records and unrelated edits.
4. Run the relevant checks. Before submitting a broad web change, run `npm test`.
5. Open a pull request describing the user-facing result, checks actually run, and remaining limits.

The main branch accepts reviewed project updates. Automated verification is present; branch protection and mandatory reviews have not been configured.

## Evidence and assets

Scientific claims need primary sources or explicit internal/proposed labels. Do not promote illustrations, synthetic outputs, or software completion into evidence of clinical or hardware validation. Include visual evidence for UI changes and identify browser viewport checks separately from physical-device checks.

Update document provenance when importing a new edition. The website, Android offline bundle, and published document set have separate content lifecycles; verify each affected surface.

## Releases

Preserve existing tags and release binaries. Correct source in a new commit and give a changed APK a new version. Record its package metadata, source commit, signing/build type, checksum, and actual validation. APKs belong in GitHub Releases; source belongs in Git.

Do not commit credentials, confidential records, signing keys, local toolchains, or build caches. Use the [security policy](SECURITY.md) for vulnerabilities.

## Reuse

A project-wide license is awaiting an owner decision. Do not introduce a license or claim unrestricted reuse on the owner's behalf. Preserve third-party notices and attribution; see [rights and attribution](docs/rights-and-attribution.md).
