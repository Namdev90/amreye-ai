import assert from "node:assert/strict";
import test from "node:test";



test("renders the AMR-Eye entry page with accessible navigation and concept labelling", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html=await response.text();
  for(const text of ["main-content","Measure the plate.","Open site directory","Prototype project","Connect the record."]) assert.ok(html.includes(text), text);
  assert.equal((html.match(/id="main-content"/g)||[]).length,1,"Skip link must have one destination");
  assert.match(html,/<link[^>]*rel="canonical"[^>]*href="https:\/\/amreye\.in\/"/);
});

