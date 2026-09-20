# Development history and source provenance

This record separates dated Git commits from imported project artifacts. A commit records when material entered this repository; it does not prove when the underlying work began or that a proposed scientific or engineering capability was completed.

## Git chronology

At the audit baseline, commit [`c74cbf2`](https://github.com/Namdev90/amreye-ai/commit/c74cbf2) had 33 reachable commits, beginning on 1 September 2026. The following are selected milestones; the [commit history](https://github.com/Namdev90/amreye-ai/commits/main/) retains the individual changes.

| Date | Recorded milestone | Evidence |
| --- | --- | --- |
| 1 September 2026 | Initial interactive pitch platform in this Git history | [`f46f460`](https://github.com/Namdev90/amreye-ai/commit/f46f460) |
| 4 September 2026 | APEX XR documentation explorer, interactive demo review, and hardware visuals | [`8cf2370`](https://github.com/Namdev90/amreye-ai/commit/8cf2370), [`909f58f`](https://github.com/Namdev90/amreye-ai/commit/909f58f) |
| 5 September 2026 | Mobile and hardware presentation changes, followed by the five-screen laboratory workspace | [`721b3c6`](https://github.com/Namdev90/amreye-ai/commit/721b3c6), [`3149cd8`](https://github.com/Namdev90/amreye-ai/commit/3149cd8), [`16ae91c`](https://github.com/Namdev90/amreye-ai/commit/16ae91c) |
| 6–7 September 2026 | Product ecosystem, restored library, 3D views, discovery, and metrology presentation | [`f3ebc9f`](https://github.com/Namdev90/amreye-ai/commit/f3ebc9f), [`6c3b648`](https://github.com/Namdev90/amreye-ai/commit/6c3b648), [`0563fd2`](https://github.com/Namdev90/amreye-ai/commit/0563fd2), [`7e0664e`](https://github.com/Namdev90/amreye-ai/commit/7e0664e) |
| 12 September 2026 | Domain/repository updates and synthetic AMR map and measurement review demonstration | [`b6b9221`](https://github.com/Namdev90/amreye-ai/commit/b6b9221), [`2437016`](https://github.com/Namdev90/amreye-ai/commit/2437016) |
| 13 September 2026 | Connected library and protected administrative review workspace | [`c3d3ba1`](https://github.com/Namdev90/amreye-ai/commit/c3d3ba1) |
| 14 September 2026 | AMReye.AI identity, open compendium presentation, team corrections, and library/navigation refinements | [`8cbbd33`](https://github.com/Namdev90/amreye-ai/commit/8cbbd33), [`630584e`](https://github.com/Namdev90/amreye-ai/commit/630584e), [`79a0c68`](https://github.com/Namdev90/amreye-ai/commit/79a0c68), [`cfe9710`](https://github.com/Namdev90/amreye-ai/commit/cfe9710), [`80fa527`](https://github.com/Namdev90/amreye-ai/commit/80fa527) |
| 15 September 2026 | Landing accessibility and hierarchy refinements | [`65733e3`](https://github.com/Namdev90/amreye-ai/commit/65733e3) |
| 20 September 2026 | Visual redesign, summary-only public library, and responsive layout corrections | [`227ee92`](https://github.com/Namdev90/amreye-ai/commit/227ee92), [`761356c`](https://github.com/Namdev90/amreye-ai/commit/761356c), [`6c4948c`](https://github.com/Namdev90/amreye-ai/commit/6c4948c) |
| 20 September 2026 | Version/statistics reconciliation at the `v1.5.5` tag | [`82ac89b`](https://github.com/Namdev90/amreye-ai/commit/82ac89b) |
| 20 September 2026, after the tag | Android source and offline assets, project documents, and brand assets imported into this repository | [`78b6edb`](https://github.com/Namdev90/amreye-ai/commit/78b6edb) |
| 20 September 2026, after the import | Workspace lockfiles and contributor/history documentation added | [`1744028`](https://github.com/Namdev90/amreye-ai/commit/1744028), [`c74cbf2`](https://github.com/Namdev90/amreye-ai/commit/c74cbf2) |

The `v1.5.5` tag points to `82ac89ba45803bc7003c5d9614464d957cd6bb4c`. It predates the Android/document/brand import. A release attachment and the source tree selected by a tag are separate artifacts; downloading the tagged source does not include files introduced in later commits. This distinction preserves the original tag without rewriting its history.

## Imported artifacts

### Python demonstration

The [barebone zone detector](../historical/barebone-zone-detector/README.md) preserves five original source/setup files from the owner's earlier local demo. Its import is a source snapshot. It does not reconstruct missing intermediate commits or prove a development date for the original demo.

### Android application and offline compendium

The [`android/`](../android/) tree includes the native project and a packaged web runtime. It first entered this Git repository in `78b6edb`; the import date is not the application's original creation date. The bundled [`amreye-compendium.pdf`](../android/app/src/main/assets/documents/amreye-compendium.pdf) is the separate historical 300-page compendium. Bundled web assets represent a packaged snapshot and should not be assumed to match every subsequent website change.

### Current project document set

The [document guide](../project-docs/Start%20here.md) identifies the 19 September 2026 restructuring: a seven-page main overview and seven supporting documents, totaling 203 supporting pages. The current [`AMREYE.AI Super Document.docx`](../project-docs/AMREYE.AI%20Super%20Document.docx) is that overview, not the Android bundle's 300-page historical PDF.

The main overview, seven companion files, guide, and delivery ZIP were compared with the supplied 19 September outputs and matched byte for byte. The unchanged original master is retained inside [`AMREYE AI Main and Supporting Documents.zip`](../project-docs/AMREYE%20AI%20Main%20and%20Supporting%20Documents.zip), under `Source backup/2026-09-19 Original master before restructuring.docx`. Its SHA-256 is `e2234e975af5a36a7f0b26e35a238475df90bdf0ef98ce4a8b54e5a2d0ef3b84`.

The guide records that 7,406 substantive source blocks were assigned to supporting references. That is a document-preservation result, not independent scientific revalidation. Historical specifications, budgets, roadmap statements, and research proposals retain their original evidence limitations.

The [historical document tooling](../historical/document-tooling/README.md) preserves 14 unchanged builder, editorial, rendering, packaging, and verification scripts from the 19 September workflow. Their original local inputs, runtime paths, and intermediate outputs are not all included; the archive documents the development process without claiming that it can reproduce the final documents unchanged.

### Brand assets

The [`brand/`](../brand/) directory preserves logos, icons, identity directions, guidelines, and clean website visuals imported in `78b6edb`. Related deployed visuals also appear under `public/` and in the Android offline snapshot. These files are project presentation assets; concept illustrations do not establish a built or validated instrument.

## Coverage limits

This history covers the reachable Git record and the specifically supplied local Python, Android, document, and brand sources. It does not claim to be a complete archive of every earlier experiment, conversation, local file, or uncommitted change. In particular, earlier work performed in Antigravity or another local editor is not automatically represented in Git. Such work is preserved here only where an identifiable source artifact was imported; absent commits and dates have not been invented or backdated.

Private conversations, credentials, local caches, toolchains, and generated temporary files are outside this development record. The audit of named source locations does not establish that no other historical material exists elsewhere. Future imports should state their origin, distinguish their original date from their import date, and retain relevant prototype and evidence labels.
