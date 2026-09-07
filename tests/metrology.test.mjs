import test from "node:test";
import assert from "node:assert/strict";
import {classify,demoDiscs,threshold} from "../app/demo-rules.mjs";
test("six-disc example includes the paper-disc baseline",()=>{
 assert.equal(new Set(demoDiscs.map(d=>d.code)).size,6);
 assert.equal(demoDiscs.find(d=>d.code==="AMP").mm,6);
 for(const mm of [NaN,0,5.9,40.1]) assert.equal(classify(mm,"CIP","A"),null);
});
test("fictional profiles respond at both interpretation boundaries",()=>{
 for(const profile of ["A","B"])for(const {code} of demoDiscs){
  const {s,r}=threshold(code,profile);
  assert.equal(classify(s,code,profile),"S");
  assert.equal(classify(s-.1,code,profile),"I");
  assert.equal(classify(r,code,profile),"I");
  assert.equal(classify(r-.1,code,profile),"R");
 }
 assert.notEqual(classify(25.4,"CIP","A"),classify(25.4,"CIP","B"));
});
