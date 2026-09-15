# Lina V0.2.31 – GitHub Shared Forward State

## Syfte
G2/G3 Real Forward ska ha en gemensam kompakt master oavsett dator. GitHub lagrar `forward-state.json`; Cloudflare Worker är enda skrivvägen. Browserns localStorage är fortsatt lokal runtime/cache och README/handoff/evidence är permanent forskningshistorik.

## Säkerhet
GitHub-token finns endast som Cloudflare Worker secret `GITHUB_TOKEN`. Skrivning kräver dessutom Worker-secret `LINA_SYNC_KEY`; användaren anger samma synknyckel i Lina vid första skrivningen per browsersession. Nyckeln lagras endast i sessionStorage och finns inte i repo/HTML/JS.

## Worker-konfiguration
Secrets:
- `GITHUB_TOKEN` – fine-grained GitHub token med Contents: Read and write för endast Lina-repot.
- `LINA_SYNC_KEY` – egen lång slumpmässig synknyckel.

Variables:
- `GITHUB_OWNER` – GitHub-ägaren.
- `GITHUB_REPO` – repots namn.
- `GITHUB_BRANCH` – den branch där masterfilen ska versionshanteras.
- `GITHUB_FORWARD_STATE_PATH` – valfri; default `linasopti/data/forward-state.json`.

## API
- `GET /forward-state` läser master-state från GitHub. Ingen skrivnyckel krävs.
- `POST /forward-state` kräver header `X-Lina-Sync-Key`, validerar schema/anchor/kandidat/plan, merge:ar mot aktuell GitHub-version och skriver ny commit.
- Handel måste vara AV. Anchor `2026-09-11`, G2 `15efd75a`, G3-plan `75838ed5` är blockerande invariants.
- Om två snapshots för samma marknadsdag motsäger varandra stoppas synken. En senare marknadsdag är auktoritativ snapshot; refreshhistorik och milstolpar bevaras.

## UI
Forward Evidence Center läser GitHub-master när vyn öppnas. `Uppdatera G2 + G3` sparar därefter automatiskt master via Worker. Knappen `Synka GitHub` finns för manuell kontroll/initialisering. Lokal backup/import finns kvar som nödfunktion.

Robotmognad 48/100. Handel AV. Ingen strategi-, parameter-, gate- eller forwardregel ändrad.
