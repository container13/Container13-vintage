# Remember – säkert byte till gated GitHub Pages
Status: FÖRBERETT, INTE AKTIVERAT.

Nuvarande GitHub Pages publicerar från branch och påverkas inte av `remember-gated-pages.yml`.
Det nya arbetsflödet är avsiktligt endast manuellt startbart tills byte är klart.

1. Kontrollera att Remember release safety är grön och att Pages nuvarande webbplats fungerar.
2. Öppna GitHub → Settings → Pages → Build and deployment → Source → **GitHub Actions**.
   Detta kräver administratörsbehörighet och måste göras av repoägaren.
3. Starta **Remember gated Pages deployment** manuellt under Actions. Kontrollera
   att hela container13.se inklusive CCC, Remember och Lina fungerar.
4. Först efter godkänt test: ändra workflow från `workflow_dispatch` till
   `workflow_run` för `Remember release safety`, filtrera
   `conclusion == success`, `head_branch == ccc-demo-public-test`,
   och checka ut exakt `head_sha` för att undvika race conditions.
5. Kontrollera att en avsiktligt misslyckad säkerhetskontroll INTE deployar.

VARNING: Branch Pages är idag frikopplad från release safety; denna förberedelse
är inte en aktiv publiceringsspärr. Inga Pages-inställningar har ändrats.
