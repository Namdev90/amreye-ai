import assert from "node:assert/strict";
import test from "node:test";



test("renders the AMR-Eye entry page with accessible navigation and concept labelling", async () => {
  // Runtime headers and Cloudflare bindings must be tested in the actual worker runtime.
  const response = await fetch(process.env.TEST_SITE_URL||'http://127.0.0.1:5179/',{headers:{accept:'text/html'}});

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html=await response.text();
  for(const text of ["main-content","AI for antimicrobial","Open site directory","Startup project under incubation","Microbes, huge impact."]) assert.ok(html.includes(text), text);
  assert.equal((html.match(/id="main-content"/g)||[]).length,1,"Skip link must have one destination");
  assert.match(html,/<link[^>]*rel="canonical"[^>]*href="https:\/\/amreye\.in\/"/);
});

