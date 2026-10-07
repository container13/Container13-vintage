# Release State Machine

Status: VERIFIED
Tags: release current previous pending promotion rollback integrity
Proven in: CCC release discipline

## Problem
A commit/deploy can be mistaken for a verified release, and a failed candidate can accidentally destroy the known-good rollback point.

## Verified solution
Keep separate candidate, currentVerified and previousVerified states. Candidate remains PENDING until required gates pass. Promotion is atomic in meaning: old CURRENT -> PREVIOUS, verified candidate -> CURRENT, candidate -> null/closed. A failed or merely deployed candidate never moves CURRENT/PREVIOUS.

## Reuse checklist
Use one version source. Record verification evidence. Match gates to risk. Never promote from deployment status alone.

## Traps / failed approaches
Do not treat commit success, workflow success or cache propagation as proof of client behavior.

## Evidence
CCC v2.10.170 was kept pending until observed live on a real iPhone, then promoted while v2.10.169 became previous.
