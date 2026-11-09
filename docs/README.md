# Documentation guide

AMReye.AI is a research/prototype project. Use synthetic examples only. Nothing in these guides establishes clinical validity, regulatory clearance, qualified laboratory review, or a finished hardware product.

## Choose a starting point

| Need | Guide |
| --- | --- |
| Run the website | [Repository README](../README.md), [operations and troubleshooting](operations.md) |
| Understand the implementation | [Architecture and data boundaries](architecture.md) |
| Verify a change | [Testing](../TESTING.md), [contributing](../CONTRIBUTING.md) |
| Build or evaluate Android | [Android guide](../android/README.md), [release provenance](releases.md) |
| Find every recorded commit at the documented baseline | [Commit index](commit-index.md) |
| Understand the project's development and imported material | [Development history](development-history.md) |
| Read the current editable research documents | [Document guide](../project-docs/README.md) |
| Inspect the earlier detector or document pipeline | [Python detector](../historical/barebone-zone-detector/README.md), [document tooling](../historical/document-tooling/README.md) |
| Understand remaining work | [Roadmap](roadmap.md) |
| Check historical verification evidence | [20 September 2026 audit](final-audit-2026-09-20.md) |
| Report a security issue | [Security policy](../SECURITY.md) |
| Reuse software or assets | [License](../LICENSE), [rights and attribution](rights-and-attribution.md) |
| Work with the brand | [Brand language](brand-language.md), [brand guidelines](../brand/brand-guidelines.md), [policy artwork provenance](policy-logo-provenance.md) |
| Understand the existing hosting integration | [Hosting notes](hosting.md) |

## What is current?

These technical guides describe default-branch source at [`6e9b0ab`](https://github.com/Namdev90/amreye-ai/commit/6e9b0ab6b7d60e3721340ab63dc66b3b84240ece). The website package is version **1.5.6**; the Android configuration and published Android release are **1.5.7**, version code **14**. These are separate version fields, not a claim that a website deployment changed.

The older audit describes the corrective **1.5.6 preview**. Its signing and licensing conclusions predate the later signed-release/MIT commit. Preserve that audit as a dated record and use [releases](releases.md) and [rights](rights-and-attribution.md) for the subsequent changes.

The independent `openai-device-manager` branch contains a different Windows project. Its README says not to merge it into `main`; see the [branch boundary](development-history.md#independent-device-manager-branch). It is not part of the AMReye runtime.

## Keep editions and evidence separate

- Website: public topic summaries and synthetic demonstrations.
- Android: native WebView shell plus a separately packaged offline snapshot.
- Project documents: eight editable Word files from the documented restructuring.
- Historical compendium: an older PDF bundled in Android.
- Git commits and release metadata: evidence of publication and source changes, not proof of scientific validation.
- Audit results: checks reported for their original source/artifact and date; they are not a fresh test run.

When updating documentation, link the implementing source or immutable commit, identify the relevant edition, and state whether behavior was inspected, executed, or only reported in earlier evidence.
