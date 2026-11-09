import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true },
});

after(async () => {
  await vite.close();
});

async function readCssTree(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const contents = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return readCssTree(entryPath);
      }
      return entry.name.endsWith(".css") ? readFile(entryPath, "utf8") : "";
    }),
  );
  return contents.join("\n");
}

test("emits motion preferences and touch-safe positioning styles", async () => {
  const css = await readCssTree(path.join(root, "dist"));

  assert.match(css, /--tw-enter-opacity/);
  assert.match(css, /touch-action:\s*pan-y/);
  assert.match(css, /translate:\s*0(?:px)?(?:\s+0(?:px)?)?!important/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("forwards progress semantics to the primitive", async () => {
  const { Progress } = await vite.ssrLoadModule("/components/ui/progress.tsx");
  const html = renderToStaticMarkup(React.createElement(Progress, { value: 37 }));

  assert.match(html, /aria-valuenow="37"/);
  assert.match(html, /aria-valuetext="37%"/);
  assert.match(html, /data-state="loading"/);
});

test("emits chart themes for the starter's media dark mode", async () => {
  const { ChartStyle } = await vite.ssrLoadModule("/components/ui/chart.tsx");
  const html = renderToStaticMarkup(
    React.createElement(ChartStyle, {
      id: "contract",
      config: {
        latency: { theme: { light: "#ffffff", dark: "#000000" } },
      },
    }),
  );

  assert.match(html, /\[data-chart=contract\]/);
  assert.match(html, /@media \(prefers-color-scheme: dark\)/);
  assert.doesNotMatch(html, /\.dark/);
});

test("renders sidebar skeletons deterministically", async () => {
  const { SidebarMenuSkeleton } = await vite.ssrLoadModule(
    "/components/ui/sidebar.tsx",
  );
  const first = renderToStaticMarkup(React.createElement(SidebarMenuSkeleton));
  const second = renderToStaticMarkup(React.createElement(SidebarMenuSkeleton));

  assert.equal(first, second);
  assert.match(first, /--skeleton-width:70%/);
});

test("hardware preview renders its safe loading state without starting a browser scene", async () => {
  const { default: Hardware3D } = await vite.ssrLoadModule("/app/hardware-3d.tsx");
  const html = renderToStaticMarkup(React.createElement(Hardware3D, { active: 0, onSelect() {} }));
  assert.match(html, /Opening the 3D assembly/);
  assert.match(html, /SCHEMATIC · NOT PRODUCTION CAD/);
  assert.match(html, /tabindex="-1"/);
  assert.doesNotMatch(html, /Retry 3D/);
});

test("product concept keeps its loading and nonproduction labels during server rendering", async () => {
  const { default: Product3D } = await vite.ssrLoadModule("/app/product-3d.tsx");
  const html = renderToStaticMarkup(React.createElement(Product3D, { productId: "lite", name: "Reader concept", label: "Proposed hardware" }));
  assert.match(html, /Loading 3D model/);
  assert.match(html, /INTERACTIVE CONCEPT MODEL/);
  assert.match(html, /Proposed hardware/);
});

test("synthetic workbench starts idle and does not imply completed measurements", async () => {
  const { default: AnalysisWorkbench } = await vite.ssrLoadModule("/app/analysis-workbench.tsx");
  const html = renderToStaticMarkup(React.createElement(AnalysisWorkbench));
  assert.match(html, /Ready · run analysis to begin/);
  assert.match(html, /Run synthetic analysis/);
  assert.match(html, /No patient-image processing/);
  assert.match(html, /<progress value="0" max="7"/);
});
