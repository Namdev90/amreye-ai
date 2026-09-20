# Final project audit: 20 September 2026

This audit checked the supplied app, project handovers, current repository, recovered source files, documents, Git history and GitHub presentation. It distinguishes actual checks from remaining work. It does not certify clinical performance or an exhaustive archive of every past conversation.

## Requirements and outcomes

| Requirement | Outcome |
| --- | --- |
| Public project repository | `Namdev90/amreye-ai` is public, with the website, native Android source, offline content, project documents, brand assets and historical code. |
| Preserve development history | Existing commits and the original annotated v1.5.5 tag are retained. The dated development history links actual commits and labels later imports. Missing uncommitted editor history has not been fabricated. |
| Preserve documents | The current overview and seven supporting documents match the supplied delivery. The original master remains in the delivery ZIP; the historical 300-page Android PDF is a separate edition. |
| Professional GitHub presentation | Added a project README, content map, build/testing guides, release provenance, roadmap, contribution/issue/PR templates, rights guidance and private vulnerability reporting. |
| Check the app itself | Inspected the APK and source, repaired native routing and offline UI defects, exercised the bundled UI in a browser, and prepared a new debug preview. Physical Android acceptance remains outstanding. |

## Defects corrected

- Clean npm installation originally failed because the lockfile was incomplete. The test command also depended on a manually running preview. Both were corrected.
- Android trust checks used loose string matching. The WebView now restricts internal navigation to the exact permitted HTTPS origins, disables mixed/file/content access, and handles failed live-page loads with the bundled reader.
- Bundled PDF links previously pointed at a retired live download or an app-only URL handed to an external browser. A non-exported, read-only provider now supplies only the packaged compendium through a temporary read grant.
- The offline HTML loaded a website client that required an unavailable server response. It reloaded, failed hydration, and left important controls inert. Standalone handlers now operate the demo, all 150 library topics, chapter/source navigation, all 16 product concepts, comparison, workflow tabs, guide and contact drafts.
- The synthetic demo now shares the canonical fictional model and safeguards: unreadable results remain unavailable, pending corrections block reports, and applied corrections or profile changes invalidate approvals.
- Removed pre-filled clinical-standard and human-verification claims. Reports are generated from the actual demonstration run, carry current timestamps and clearly identify simulated review. Native JSON/CSV export uses the Android document picker.
- Corrected clipped mobile header controls, a hidden and unclickable directory, bundled/live labelling, obsolete navigation destinations and disabled viewport zoom.
- Updated vulnerable dependency versions within the existing framework families and pinned the fixed image-size patch. No forced Drizzle downgrade was applied.

## Verification evidence

The final local clean installation and website build succeeded. All **47 Node tests** passed (37 existing checks plus 10 Android-runtime regressions), and all **96 Java policy assertions** passed. Android `assembleDebug` succeeded with the installed JDK 17 / Gradle 8.7 / API 35 toolchain. The build emitted the existing warning that Android Gradle Plugin 8.5.2 was tested through compile SDK 34, while this project compiles against 35; deprecated Android APIs also remain.

The browser checks served the actual Android assets over loopback. They are evidence about the bundled HTML/JavaScript interface, not a substitute for Android WebView, system picker or physical-device tests.

- Inspected layouts at 320 × 740, 390 × 844, 768 × 1024 and 1440 × 900. Header controls fit the viewport; inspected pages had no document-level horizontal overflow or broken images. Topic tables and filter strips may scroll within their own containers.
- Exercised clean synthetic analysis, disc selection, approval, a correction from 25.4 to 22.1 mm, draft report blocking, approval invalidation and the resulting report.
- Exercised unreadable analysis: all six values/categories were unavailable and review was not applicable; the report did not imply completed verification.
- Exercised library search, maturity filtering, chapter opening, source-page navigation, citation expansion, topic links and reload restoration. Checked product comparison and Reader V1 exploration, guide presets, settings and directory navigation.
- The library's isolated DOM harness covered 150 topics, 121 references, 413 topic/page views, 357 rendered table instances, 257 citation reveals, 25 filter values and pagination. These counts describe test coverage, not unique PDF table counts or browser rendering certification.
- Persistent Android-model regression tests cover parity with the website model, stale runs, pending drafts, invalidation, unreadable data, immutable reports and both export paths.
- Native policy tests cover allowed/rejected URLs, exact read-only document access and bounded JSON/CSV report export. APK build and release details are recorded in [release provenance](releases.md).
- Current CI status and logs are available in the [Verify workflow](https://github.com/Namdev90/amreye-ai/actions/workflows/ci.yml). The workflow builds/tests the website and builds/checks the Android source.

## Security and dependency scope

At this audit, `npm audit --omit=dev` reported **zero** known vulnerabilities. The full audit retained **four moderate dependency entries** in the `drizzle-kit` → `@esbuild-kit` → old `esbuild` development-tool chain. They arise from the [esbuild development-server advisory](https://github.com/advisories/GHSA-67mh-4wv8-2f99). npm proposed a Drizzle downgrade outside the declared version; that was not treated as a safe automatic fix. Keep this optional database tooling out of exposed development-server workflows and resolve it through a separately tested tooling update.

The Next.js update also addresses the affected version range in the [upstream Windows-server advisory](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36). This project normally uses the vinext/Cloudflare build; package findings alone do not establish that every advisory was exploitable in its deployed configuration.

GitHub secret scanning, push protection and private vulnerability reporting are enabled. No open secret-scanning alerts were returned at inspection. Targeted source scans did not identify credentials; neither result constitutes an exhaustive security audit. The directory named `private/` is publicly readable in this public Git repository, although excluded from the public website build.

## Remaining boundaries

1. **Android devices and signing:** test installation/upgrades, startup offline, connection loss/recovery, Back, rotation, PDF viewers, document saving and accessibility on supported Android devices. The APK is debug-signed and debuggable. Production signing and store distribution are not complete.
2. **Content generation:** the offline bundle is an explicit snapshot. Its old generation process is not fully reproducible from the recovered files; website edits do not automatically update it. New regression checks guard the duplicated synthetic model.
3. **History:** early source snapshots and document-tooling scripts are preserved, but absent Antigravity commits, missing intermediary inputs and private conversations have not been reconstructed. See [coverage limits](development-history.md#coverage-limits).
4. **Rights:** the owner has not selected a project-wide reuse license. Public repository visibility does not settle licensing or third-party rights.
5. **Scientific maturity:** the app is a research/prototype demonstration. No clinical validity, regulatory clearance, actual patient-image analysis, authenticated laboratory signature or completed hardware validation is established by this audit.

The audit changes the repository and Android preview. It does not claim a new deployment of the live website or a fresh visual re-pagination of the unchanged Word documents.
