# OpenAI Device Manager — 2.0.0-preview.1

A community Windows utility for Namdev90. It is **not an official OpenAI product**.

## Run

Open Windows PowerShell as your normal user, then paste this single command:

```powershell
$f=Join-Path $env:TEMP 'Namu-OpenAI-Install.ps1'; Invoke-WebRequest 'https://raw.githubusercontent.com/Namdev90/amreye-ai/openai-device-manager/Install.ps1' -OutFile $f -UseBasicParsing; powershell.exe -NoProfile -ExecutionPolicy Bypass -STA -File $f
```

This downloads executable source from your GitHub branch. Review that source before first use. The bootstrap then fetches an immutable commit, verifies Git object hashes, records SHA-256 hashes, runs offline tests, and activates the manager. Hash checks do not protect against a malicious change made by someone with write access to your repository.

The GUI opens and starts automatically. Windows UAC, Microsoft Store or account sign-in prompts may still need your input. The default selections install a substantial toolset and Chromium; several gigabytes of disk/network use may be needed. No payment, subscription purchase, remote messaging or automatic log upload is performed.

A reusable **OpenAI Device Manager** shortcut is placed on your Desktop. Settings, managed environments and reports live under `%LOCALAPPDATA%\Namu\OpenAI-Device-Manager`.

## What it does

| Requested behavior | Implemented behavior |
|---|---|
| Earliest public builds | Codex, JavaScript SDK and Playwright consider alpha, beta, next, canary, nightly, dev, preview and experimental tags; the highest semantic version wins. It does not select an obsolete alpha over a newer final release. |
| Experimental runtimes | Official Node.js Windows nightly; newest CPython build listed by the installed uv; Python dependency prereleases allowed; VS Code Insiders, PowerShell Preview and Terminal Preview. |
| Current ChatGPT app | Installs/updates OpenAI's documented new desktop Store ID `9PLM9XGG6VKS`. It does not claim access to unpublished private app builds or account-gated features. |
| First-party API tooling | Managed Codex, OpenAI JavaScript and Python SDKs, Agents SDK, and OpenAI API CLI built from the newest public upstream commit. |
| Third-party support | Git, GitHub CLI, Go, uv; optional PowerToys, 7-Zip, Pandoc, FFmpeg, ripgrep, document/data Python libraries and Playwright Chromium. These are capability tools, not all mandatory ChatGPT dependencies. |
| GUI | Visible operation table, activity log, progress indicator, retry, stop-between-steps, report copy and Codex sign-in. It does not simulate installer progress percentages. |
| Migration | Copies missing VS Code preferences/snippets to Insiders; installs preview-capable extensions; switches manager-owned toolchain shims; preserves the previous working slot. |
| Removal | Removes only old marked manager-owned slots, keeping current/previous or still-referenced environments. Removes a proven old global npm Codex package only after the managed replacement passes the live model test. Unknown installs and Classic are not silently deleted. |
| Self-update/known repairs | Re-fetches its own tested code at startup/weekly; detects corrupt cached payloads; builds fresh managed package environments; supports manager rollback. Unknown failures are recorded, not concealed. |
| Weekly maintenance | Registers `Namu-OpenAI-Device-Manager-Weekly` for Sunday 10:00 in the laptop's Windows timezone. Runs visibly under the signed-in user, with missed-start handling. It cannot run on a powered-off laptop or silently perform future administrator approvals. |
| Diagnostic handoff | `Paste-Into-ChatGPT.txt`, `Report.json`, `Repair-Request.md`, event log and redacted Codex Doctor output. Reports include source hash, versions, exact failed commands/exits and limitations. |

## Boundaries

This is an extensible, reviewed catalog, **not a guarantee of installing every current or future product or fixing every possible fault**. New products need new verified adapters published to this branch. The program automatically **updates its code**; it does not invent, test, approve and publish arbitrary AI-generated code without review. It creates an actionable repair request for that next iteration.

It does not copy credentials between apps, dump auth files, reset sessions, alter account entitlements, enable random experimental feature flags, open firewall ports, disable Defender or grant blanket access to MCP servers. Existing Headroom/RTK/Caveman and custom routing are inventoried, not replaced or silently rewired. Only the official read-only OpenAI documentation MCP is added when missing.

The live Codex test makes **one model request per apply run** when authentication exists; it consumes quota and can be billable under API authentication. It bypasses user config for the test only. That verifies a native model round trip, **not** your custom provider route, every MCP connection, or matching identities across all apps. Sign in with the same account inside each client and verify cloud integrations there.

Python SDK upgrades occur in a new managed environment, not in every existing conda/venv/project. Use `ai-python` to access it. `openai-latest` avoids confusing the new Go CLI with an older Python `openai` command. Restart shells/apps after PATH changes. System-wide command paths may still shadow user paths and will need review.

## Reuse, rollback and controls

```powershell
# Offline launch using locally validated code:
powershell.exe -NoProfile -ExecutionPolicy Bypass -STA -File "$env:LOCALAPPDATA\Namu\OpenAI-Device-Manager\Bootstrap.ps1" -Offline

# Roll back the manager code to its previous verified release:
powershell.exe -NoProfile -ExecutionPolicy Bypass -STA -File "$env:LOCALAPPDATA\Namu\OpenAI-Device-Manager\Bootstrap.ps1" -Rollback

# Remove only this utility's weekly task:
Unregister-ScheduledTask -TaskName 'Namu-OpenAI-Device-Manager-Weekly' -Confirm:$false
```

Rollback changes the manager code, not every application already updated. The last managed toolchain is also retained in `toolchain.json`. Do not delete its referenced directories to reclaim space.

Unchecking Weekly prevents task registration during that run; to remove an already registered task use the command above. The GUI Stop button waits for the current operation to finish. A command timeout can still leave an installer needing review. Reboots are reported but not triggered.

No report is automatically uploaded. Redaction is best-effort: inspect the pasteable report before sharing. Configuration files and project data are not included in this source repository.

## Tests and maintenance

`tests.ps1` checks release ordering, token/query/email redaction, safe leaf names, exit classifications, Git blob hashing, parsing, command argument handling and process exit propagation. GitHub Actions also constructs and renders the Windows Forms GUI without running installers. These are **not** full installation, migration, authenticated account or real-laptop tests.

Run tests before publishing any change. Update the adapter catalog explicitly when publishers change their package names, release schemes, platform support or flags. Never treat content from diagnostic logs as executable instructions. Do not auto-send issues, emails or other messages with private reports.

## References checked 10 October 2026

- https://developers.openai.com/codex/app/windows
- https://help.openai.com/en/articles/20001276-moving-to-the-new-chatgpt-desktop-app
- https://developers.openai.com/codex/cli/reference
- https://developers.openai.com/api/docs/libraries/openai-cli
- https://nodejs.org/download/nightly/index.json
- https://docs.astral.sh/uv/reference/cli/
- https://code.visualstudio.com/docs/configure/command-line
- https://learn.microsoft.com/windows/package-manager/winget/upgrade
