# Gen17 canonical specification hash candidate

Status: DRAFT_ONLY; NOT_LOCKED; NO_BACKTEST.

Canonicalization: recursively sort object keys lexicographically, preserve array order, JSON without whitespace, SHA-256 UTF-8. Source: frozen Gen16 specification with only these structural updates: schema LINA-GEN17-RUNNERSPEC-DRAFT-1, status DRAFT_ONLY, sourceGeneration 16, sourceGen16SpecSha256 a065ce8ad2285010493f8491c86116f01025ed3554be18744471de394dbdeafa, remove sourceGen15SpecSha256, add gen17SingleChange object.

Gen17 change object (exact fields): kind VOLATILITY_CONTRACTION_FILTER; rangeFormula (high-low)/close; signalIndex s; recentInclusive [-20,-1]; previousInclusive [-40,-21]; strictLessThan true; signalBarExcluded true; invalidBar SKIP; appliesTo PRICE_CHANNEL_BREAKOUT_ONLY; stage BEFORE_RANKING_AND_CAPACITY; execution NEXT_OPEN_S_PLUS_1; newTunableParameters 0.

Calculated candidate SHA256: `017813662600d2488db246d5b468b9c68f26c6921b103dfa99d1c2eaebb29d83` (Python json.dumps sort_keys=True separators=(',',':'), sha256). This hash identifies the described draft spec; it is NOT yet embedded and independently verified by the Gen17 runner. The existing engine retains Gen16 spec and an invalid placeholder hash, so engine verification is NOT PASS. No historical tests, no lock, no trading, no Forward.

Code review: Gen17 draft adds one candidate-level gate before ranking and retains Gen16 simulate mechanics. Potential issue: standalone gate and inline gate duplicate implementation; need single authoritative function to prevent drift. Existing draft's `verifySynthetic()` assumes unfiltered candidate count and may fail when contraction is absent; it must be rewritten for Gen17 before claiming engine-level verification. Existing `verify()` deliberately fails SHA and uses Gen16 identifiers; update before engine release. Original Gen16 unchanged.
