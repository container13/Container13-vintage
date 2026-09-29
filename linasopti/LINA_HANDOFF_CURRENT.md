# LINA — AKTUELL HANDOFF / STATUS

Aktuell release: V0.3.06
Uppdaterad: 2026-09-29

## Aktuellt säkert läge
- Handel AV.
- Gen7 är immutable och får aldrig rerunnas.
- Gen8-plan `be68328d` är låst.
- Gen8 runnerspec `d26e5499` är låst och Engine verifierad. Gen8 står i `RESEARCH_RUNNING`; minst första familjen är observerad/checkpointad och får aldrig rerunnas.
- Senaste exporterade Engine-state visar Robotmognad 70/100. Gen8 continuation stoppades tekniskt efter att forskning redan börjat; V0.3.04 inför Resume Never Replay och fortsätter endast från första ofärdiga säkra steg.
- G2 och G3 Real Forward fortsätter separat som paper/forward och får inte påverka frysta forskningsregler.

## V0.3.01 — bekvämlighet utan forskningsändring
- Global 📸 Bild-knapp i headern.
- Ett tryck sparar hela den aktuella Lina-vyn som PNG, inte webbläsarens flikar/adressfält.
- Filnamn innehåller vy, Lina-release och tidsstämpel.
- Skärmbild skapas lokalt i webbläsaren; funktionen ändrar inget forskningsstate och startar inte Gen8/Forward/Handel.
- Vid renderingsfel visas explicit felstatus på knappen; inget falskt lyckat läge.

## Permanent incidentlärdom
- App-state ska verifieras end-to-end: frontend write → sync → Worker/API validate → GitHub → GET/restore → hydrate → localStorage → boot → monotont slutstate.
- `lina_generation_engine_v0273` kräver explicit Worker-allowlist utöver `lina_clean_*`.
- Feltext ska spåras till producerande kod före fix. Inga gissnings-hotfixar.
- Releasepåståenden om kod, syntax, ZIP eller deploy måste vara faktiskt verifierade.

## Styrdokument
- `LINA_MASTER_RULES.md` är permanent regelbok.
- `LINA_RELEASE_CHECKLIST.md` är gemensam releasekontroll.
- Denna fil, `LINA_HANDOFF_CURRENT.md`, uppdateras i stället för nya versionsspecifika handoff-filer.


## V0.3.01 – komplett Lina-skärmdump
- 📸 är fortfarande en enda knapp utan meny.
- Ett tryck renderar hela aktuella Lina-vyn från topp till botten, oberoende av scrollposition.
- Samma PNG sparas lokalt och kopieras till bildurklipp när webbläsaren tillåter det, för direkt ⌘V/Ctrl+V i aktuell ChatGPT-chatt.
- Dashboardens Robotmognad hämtas från samma auktoritativa modell som Generation Engine.


## V0.3.04 — Gen8 säker continuation + canonical base
- Byggbas: återfunnen `LINA_CLEAN_CORE_V0301_FLAT_COMPLETE.zip`; ingen gissad/rekonstruerad bas.
- Gen8 Auto Pipeline är state-aware: låst/verifierad runnerspec prepareras inte om.
- Redan observerade familjer valideras och hoppas över; ofullständiga checkpoints stoppar recovery i stället för rerun.
- Den tidigare observerade feltexten `specTrainingResults[0].evidence` finns inte i den återfunna V0.3.01-källbasen. Den behandlas därför som runtime/cache/versionsavvikelse tills den producerande koden kan visas; ingen gissad rotorsak påstås.
- Global `Exportera Generation Engine-status` ligger nu i Engine-toppen.
- Handel AV och Forward AV.


## V0.3.04 — beständig Auto Pipeline-diagnostik
- V0.3.02 inkommande state var intakt men ett faktiskt klick på Gen8 Auto Pipeline gav ingen beständig synlig förändring efteråt.
- Rotorsaken är ännu inte verifierad; V0.3.04 gissar därför inte. I stället checkpointas klickmottagning, pipeline-steg och exakt stoppfel i Engine-state innan/under async-kedjan.
- UI visar senaste pipeline-klick/steg efter rerender/reload. STOPPED-fel bevaras i state/export.
- Resume Never Replay kvarstår: observerad första Gen8-familj får inte rerunnas. Handel/Forward AV.


## V0.3.04 Gen8 continuation repair
Root cause: after a new Gen8 family was checkpointed, asynchronous evidence/GitHub sync could replace Engine state with a snapshot lacking that family. After await, code dereferenced the now-missing family `.evidence`. Repair preserves the exact computed result, restores that checkpoint without recomputation, then attaches evidence; Gen8 evidence reconciliation is included.

## V0.3.05 — 📸 ett klick, ett resultat
Chrome/Windows: urklippsskrivning initieras direkt i klickgesten med asynkron PNG-rendering. Lyckad kopiering visar Kopierad utan filnedladdning. Om urklipp saknas/nekas sparas i stället en PNG och knappen visar Sparad. Renderingsfel ger Fel. Ingen Gen8-körning eller forskningsstate ändras. Faktisk Windows-browserverifiering återstår.

## V0.3.06 — Chrome/Windows uppföljning
V0.3.05 visade Fel vid 📸 på användarens Chrome/Windows. CSS-bakgrundsbilden inbäddas nu och CSS XML-escapas i SVG. Exakt återstående fel visas direkt om renderingen fortfarande misslyckas. Rotorsaken är ännu inte verifierad i faktiskt Chrome. Långsam inloggning observerades efter lösenkod: auth-kontroll och därefter seriell GET/POST/evidensverifiering blockerar Dashboard av integritetsskäl. Ingen osäker genväg förbi state-återställningen infördes.
