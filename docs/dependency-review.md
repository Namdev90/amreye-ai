# Dependency review: remaining moderate advisories

This review starts from main commit `5851f070d2316e1573324e2592842ca86773f9c7` and its unchanged npm lockfile. The audit reports **15 moderate, zero high and zero critical** findings. These are dependency-chain counts, not 15 independent root vulnerabilities. This report is not a claim that the public deployment uses this tree.

## Remaining paths

- `drizzle-kit@0.31.11` → `@esbuild-kit/esm-loader` → `@esbuild-kit/core-utils` → `esbuild@0.18.x`. [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) affects esbuild through 0.24.2. The parent requires `~0.18.20`; replacing it with 0.25+ is outside that range. The current stable drizzle-kit remains 0.31.11. npm proposes a downgrade to 0.18.1, which is not a safe automatic repair. Avoid exposing development servers to untrusted browsers/networks; a compatible upstream dependency migration must be tested against schema generation before adoption.
- `eslint-config-next@16.4.6` → `typescript-eslint` → `@typescript-eslint/typescript-estree` → `minimatch@10.x`. [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) affects versions 7.0.0 through 11.0.0. Even typescript-estree 8.72.2 still requires `^10.2.2`. The fixed 11.0.1 line is outside that range. npm's suggested Next ESLint configuration downgrade to 15.5.29 does not match the application's Next major. Follow the upstream parser dependency update; validate lint behavior and supported Node versions before changing the major transitive dependency.
- `vinext@0.0.50` → `@vercel/og@0.8.6` → `satori@0.16.0`. [GHSA-wx4j-mvgx-mqwp](https://github.com/advisories/GHSA-wx4j-mvgx-mqwp) concerns improper escaping of generated SVG through Satori 0.33.4. `@vercel/og@1.0.3` uses fixed Satori 0.33.5, but is outside Vinext's `^0.8.6` range. An independently reviewed Vinext/OG migration needs build, rendering, worker and page-method regression coverage. Do not force a transitive override simply to make the audit count disappear.

## Checks and decision

A normal `npm audit fix --dry-run` proposed compatible TypeScript ESLint updates but still reported all 15 moderate findings. No dependency or lockfile changes were made: neither forced upgrades, framework downgrades, blanket overrides nor dependency removal are part of the lint remediation.

The existing high/critical audit gate is unchanged. Run `npm audit --json` on the reviewed tree for current findings because advisory ranges and upstream releases can change. Remaining image lint warnings and historical/generated-source warnings are separate from dependency vulnerabilities.
