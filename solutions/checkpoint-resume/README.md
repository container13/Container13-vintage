# Checkpoint and Resume

Status: VERIFIED
Tags: checkpoint resume crash recovery handoff state continuation
Proven in: CCC and Lina

## Problem
Long work or chat changes can cause already-completed steps to be repeated or unverified work to be forgotten.

## Verified solution
Persist a compact machine-readable checkpoint with status IDLE / IN_PROGRESS / UNVERIFIED, target release, goal, ordered plan and last safe release. On restart, inspect reality and continue from the first unfinished verified step instead of rerunning completed work.

## Reuse checklist
Write critical completion state before moving on. Keep chat as convenience, not the only source of truth. Never rerun expensive/destructive research just to reconstruct context.

## Traps / failed approaches
A prose handoff alone is too easy to become stale or ambiguous.
