# Security policy

Report suspected vulnerabilities using [GitHub private vulnerability reporting](https://github.com/Namdev90/amreye-ai/security/advisories/new). Include the affected commit or APK version, reproducible steps, impact, and a safe mitigation if known. Do not open a public issue containing credentials, exploit details, or patient/laboratory identifiers.

Private reporting, secret scanning, and push protection are enabled for this public repository. These controls complement review; they do not certify that the application is secure. See [GitHub's reporting guidance](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately).

## Supported scope

This repository is actively maintained as a prototype. Security corrections target the current main branch and latest preview. Older APKs are preserved for provenance and may contain known limitations. No long-term support or clinical deployment guarantee is offered.

## Data and runtime boundaries

- The demonstration uses synthetic data. Do not enter real patient records or confidential laboratory data.
- Android online pages and the bundled offline library have distinct content/version lifecycles.
- Debug APKs are explicitly labeled development previews, not production-signed releases.
- The historically named `private/` directory is public in this repository. Its name is not an access-control mechanism; its files are excluded from website delivery.
- Keep keys, signing stores, local environment files, and real user data out of source control.

See the [release record](docs/releases.md) and [verification scope](TESTING.md) for known limits.
