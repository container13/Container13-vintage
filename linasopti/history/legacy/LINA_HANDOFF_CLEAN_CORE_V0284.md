# Lina Clean Core V0.2.84 — Version Source Integrity Hotfix

- Infrastructure-only release. No Gen6 research, runnerspec, candidate or Forward execution.
- Gen6 plan remains locked with planhash `206c11d7`; existing state is preserved.
- Robotmognad model/hash and score logic unchanged.
- Current release identity now comes from `version.js` at runtime for login/header/Generation Engine.
- Hardcoded current-version fallbacks removed from `app.js` and `generation-engine.js`.
- Login/header version spans use neutral placeholders until `version.js` populates them.
- All active cache-busting asset tokens are generated/verified as `0.2.84` for this package.
- Permanent version-source gate added to master rules and release checklist.
- Historical version strings in frozen evidence/research remain untouched.
- Handel AV.
