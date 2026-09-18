# LINA MASTER RULES — auktoritativ projektregelbok

Status: AKTIV från Clean Core V0.2.64. Denna fil är överordnad äldre handoffs när arbetsmetod eller permanenta regler skiljer sig. Historiska evidensfiler får aldrig skrivas om av denna fil.

## 1. Arbetsprincip
- Automatisera allt fram till ett verkligt mänskligt beslut. Användaren ska inte behöva klicka igenom säkra, deterministiska delsteg ett och ett.
- Standard för flerstegskedjor: EN startknapp, synlig progress, spara varje avslutat delsteg innan nästa, återuppta från nästa osparade steg efter avbrott, aldrig köra om ett redan observerat/sparat resultat.
- "Spara allt först, fortsätt sedan."
- Färre men större säkra releaser föredras framför många små releaser och repetitiva skärmbildskontroller.
- Stoppa endast vid genuina beslut, irreversibla lås/frysningar eller fel som kräver mänsklig bedömning.

## 2. Start av varje ny Lina-sittning/release
Innan kod ändras ska ChatGPT läsa:
1. `LINA_MASTER_RULES.md`.
2. Senaste `LINA_HANDOFF_CLEAN_CORE_*.md`.
3. Den faktiska kod som berörs i basversionen.
Det krävs inte att hela historiska Linasopti läses om. Äldre material används när den aktuella ändringen kräver det.

## 3. Release-gate
Före ZIP ska `LINA_RELEASE_CHECKLIST.md` gås igenom. Ny handoff ska ange att MASTER RULES och checklistan kontrollerats. En MASTER RULE får inte medvetet ändras utan uttryckligt beslut från användaren.

## 4. Clean Core
- En boot, en router, central state/localStorage och separat API-lager.
- Ingen cloneNode-navigation/rebind, inga konkurrerande DOMContentLoaded/boot-kedjor och inga exakta patchversionsguards för init.
- Strategilogik ska inte bäddas in i UI.
- Migrerad modul jämförs/godkänns innan gammal auktoritativ funktion ersätts.

## 5. Forskningsdisciplin
- Handel AV under forskning. Robotmognad ändras endast genom formellt beslut.
- Plan/runnerspec/gates låses före observerade resultat som de ska bedöma.
- Ingen efterhandsändring av regler, gates eller ranking för att rädda ett resultat.
- Alla varianter och negativa resultat bevaras. Ingen rerun/rescue efter observerat/sparat resultat.
- Observerad historik får inte presenteras som ny unseen holdout. Forward får endast använda data som verkligen blev framtida efter relevant kandidatfrysning; aldrig retroaktiv start.
- Kandidatval ska vara deterministiskt enligt regler låsta före resultat. Assistenten ska inte manuellt välja "bäst" efter facit.
- Gen4 rankingimplementation före första Gen4-run: score = PF*100 + positiveFolds*20 - abs(DD)*150 - concentration*25 + min(trades,250)/25. Endast varianter som klarar samtliga gates kan kvalificera sig; P/L är inte primärt. Formel/tie-break får inte ändras efter första observerade Gen4-resultat.

## 6. Evidens, GitHub och state
- GitHub-first för permanent forskningsstate/evidens. Lokal rå marknadsdata/cache får stanna lokal.
- Evidens fryses och synkas; befintlig evidens skrivs aldrig över.
- Unika lokala fynd får markeras men får inte retroaktivt ändra fryst forskning.
- Vid konflikt vinner verifierad kanonisk GitHub-state för forskningsprogression.

## 7. Export och diagnostik
- `📥 Exportera Lina-status` ska alltid vara lätt åtkomlig globalt.
- Moduler ska kunna exportera exakt diagnostik/resultat när det behövs.
- När ChatGPT behöver exakt Lina-state ska exportfil begäras före många skärmbilder, konsolkopior eller manuell avskrift.

## 8. Generationer
- Ny generation är ett nytt preregistrerat experiment, aldrig en rescue av föregående generation.
- Kopiera maskinen, inte experimentet: återanvänd säker infrastruktur/UI men aldrig tidigare generations resultat/state som nya resultat.
- Varje generation har egen identitet/state/evidens och lämnar tidigare frysta generationer orörda.

## 9. Gen4 fasta ankare
- Planhash `8d51311d`.
- Runnerspechash `d1daab90`.
- Research hard-stop `2024-12-31`.
- 2025-01-01–2026-09-10 är observerad och får inte användas som ny holdout.
- Gates: OOS trades >=100, PF >=1.20, DD <=12%, positiv OOS, max 40% single-symbol gross-profit share, minst 3/4 positiva folds.
- Fyra familjer: Breddbalanserad trend; Relativ styrka med symboltak; Equal-risk pullback; Koncentrationsmedveten ensemble.
- Gen4 ska köras som en säker automatkedja med `▶ Kör hela Gen4`; varje familj sparas före nästa och redan sparad familj hoppas över vid återupptagning.
- Efter 4/4 stoppas kedjan för granskning/frysning. Ingen kandidat eller Forward öppnas automatiskt.

## 10. Cloudflare Worker
- Worker ändras inte om en release inte faktiskt kräver det och behovet har verifierats.

## Irreversibelt state och synk
- Irreversibelt research-state får aldrig backas av GitHub/app-state-synk. FamilyResults, fryst evidens och frysbeslut mergeas monotont: redan observerade/sparade resultat bevaras.
- Under pågående automatiserad researchkedja pausas app-state-autosynk. Evidens får frysas/synkas separat.
- Recovery får endast återläsa exakt redan sparad/fryst evidens; den får aldrig köra om research eller rekonstruera saknade resultat.
