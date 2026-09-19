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
  const visible=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
  for(const text of ["Informed by","national AMR priorities","AMRST Platform Concept","AI-assisted AST measurement","Concept illustration","project topics","Quick pitch"]) assert.ok(visible.includes(text), text);
  assert.match(html, /class="amr-hero"/);
  assert.ok(!visible.includes('4-minute pitch'));
  assert.ok(!html.includes('class="motion-toggle"'));
  assert.equal((html.match(/id="main-content"/g)||[]).length,1,"Skip link must have one destination");
  assert.match(html,/<link[^>]*rel="canonical"[^>]*href="https:\/\/amreye\.in\/"/);
});

