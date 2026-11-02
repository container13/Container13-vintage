import test from "node:test";
import assert from "node:assert/strict";
import {inspectLineageSse as inspect} from "./lineage_sse_reader.mjs";
const ca="ba297542-2592-4ea8-a8a7-96f47f80f4d8";
const cutoff="2026-09-17T00:00:00Z";
const frame=(id,at,action,caId=ca)=>"data: "+JSON.stringify({event_id:id,at,action,ca:{id:caId,rate:"0.0956"}})+"\n\n";
const a="2026-09-15T00:00:00.000001Z",b="2026-09-16T00:01:26.045569Z";
test("targeted insert and update",()=>{const r=inspect([frame("a",a,"insert")+frame("b",b,"update")],{caId:ca,cutoff,upstreamComplete:true});assert.equal(r.matchedEvents,2);assert.equal(r.applied,2);assert.equal(r.pitVerified,false)});
test("unrelated events excluded",()=>{const r=inspect([frame("x",a,"insert","other")+frame("a",a,"insert")],{caId:ca,cutoff});assert.equal(r.events,2);assert.equal(r.matchedEvents,1)});
test("20 event cap fails closed",()=>{const r=inspect([frame("a",a,"insert").repeat(25)],{caId:ca,cutoff,upstreamComplete:true});assert.equal(r.stopReason,"EVENT_LIMIT");assert.equal(r.streamComplete,false)});
test("byte cap fails closed",()=>assert.equal(inspect(["x".repeat(65537)],{caId:ca,cutoff}).stopReason,"BYTE_LIMIT"));
test("partial frame fails closed",()=>assert.equal(inspect([frame("a",a,"insert")+"data: unfinished"],{caId:ca,cutoff}).stopReason,"PARTIAL_FRAME"));
test("malformed json counted",()=>{const r=inspect(["data: {bad}\n\n"],{caId:ca,cutoff,upstreamComplete:true});assert.equal(r.malformed,1);assert.equal(r.streamComplete,false)});
test("update without insert is invalid",()=>assert.equal(inspect([frame("b",b,"update")],{caId:ca,cutoff}).invalidCount,1));
test("deduplicates event IDs",()=>assert.equal(inspect([frame("a",a,"insert").repeat(2)],{caId:ca,cutoff}).duplicateCount,1));
test("chunks split inside frame",()=>{const f=frame("a",a,"insert");const r=inspect([f.slice(0,10),f.slice(10)],{caId:ca,cutoff});assert.equal(r.matchedEvents,1)});
test("no claim of retention from empty complete stream",()=>{const r=inspect([""],{caId:ca,cutoff,upstreamComplete:true});assert.equal(r.pitVerified,false);assert.equal(r.chainComplete,false)});

test("partial stream discards reconstructed state",()=>{const r=inspect([frame("a",a,"insert")+"data: unfinished"],{caId:ca,cutoff,upstreamComplete:true});assert.equal(r.state,null)});
test("unconfirmed upstream EOF discards state",()=>{const r=inspect([frame("a",a,"insert")],{caId:ca,cutoff});assert.equal(r.state,null)});
test("malformed event discards otherwise valid state",()=>{const r=inspect([frame("a",a,"insert")+"data: {broken}\n\n"],{caId:ca,cutoff,upstreamComplete:true});assert.equal(r.state,null)});
test("byte limit discards prior valid state",()=>{const r=inspect([frame("a",a,"insert"),"x".repeat(65537)],{caId:ca,cutoff,upstreamComplete:true});assert.equal(r.state,null)});
test("complete bounded sample remains PIT unverified",()=>{const r=inspect([frame("a",a,"insert")],{caId:ca,cutoff,upstreamComplete:true});assert.equal(r.state.rate,"0.0956");assert.equal(r.pitVerified,false)});

test("offset timestamp ordering remains UTC-normalized",()=>{const earlier="2026-09-16T02:00:00.000001+02:00";const later="2026-09-16T00:00:00.000002Z";const r=inspect([frame("b",later,"update")+frame("a",earlier,"insert")],{caId:ca,cutoff,upstreamComplete:true});assert.equal(r.invalidCount,0);assert.equal(r.applied,2);assert.equal(r.state.rate,"0.0956")});
test("upstreamComplete never proves historical PIT coverage",()=>{const r=inspect([frame("a",a,"insert")],{caId:ca,cutoff,upstreamComplete:true});assert.equal(r.streamComplete,true);assert.equal(r.chainComplete,false);assert.equal(r.pitVerified,false)});
