# Gen17 – ny enkel forskningsidé (DRAFT_ONLY, ej godkänd)

Datum: 2026-10-29. Ingen backtest, runnerlåsning, deploy, handel eller Forward.

## Hypotes
Kan en på förhand definierad **volatilitetskontraktion i den enskilda aktien** före en befintlig Gen16-breakout minska falska utbrott, jämfört med oförändrad fryst Gen16-kontroll? Mekanism: en lugnare konsolidering före breakout kan vara skild från generell marknadstrend. Detta är en testbar hypotes, inte ett belagt utfall.

## En förändring
Endast ett ytterligare villkor vid nya inträden baserat på aktiens egna redan avslutade OHLC-sessioner. Oförändrat: 16-symbolsuniversum, breakout, sizing, exits, kostnader, exekvering, foldgränser och övriga gates. Ingen SPY, VIX, analytikerkonsensus eller nya externa datakällor krävs för indikatorn. Använd minst en fullbordad sessions fördröjning; fastställ exakt informationsklocka och datamisspolicy före planlås.

## Obligatoriska kontroller före exakt regel
1. Kontrollera Gen2–Gen16 och tidigare lokala strategier för redan testad volatilitetssammandragning / ATR-/range-baserad entry-gate; nyheten är ännu INTE verifierad.
2. Säkerställ att Gen16 OHLC-rådata verkligen är återläsbar, inte bara manifest, och att den frysta kontrollen kan jämföras utan omkörning av frysta experiment.
3. Definiera EN indikator, EN tröskel och EN tidsfördröjning före någon Gen17-resultatvisning; inga tröskelgrids, ingen 2022-optimering.
4. Förregistrera samma robusthets-/koncentrations- och handelsantalgrindar som jämförelsen kräver, daglig equity, affärslogg, kostnader, point-in-time-kontroll och separat verkligt framtida validering. Åren 2021–2024 är observerade, inte osedd holdout.
5. Begär mänskligt godkännande av komplett exakt plan före PLAN_LOCKED och engine-körning.

## Beslut
Föreslagen kandidat att först förhandsgranska, INTE en låst Gen17-hypotes. Earnings-surprise-spåret pausat p.g.a. obekräftad tidskorrekt konsensusdata. SPY SMA100/200 och marknadsbredd uteslutna som tidigare testade. Gen17 DRAFT_ONLY. Trade OFF, Forward OFF.
