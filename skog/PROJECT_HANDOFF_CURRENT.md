# PROJECT_HANDOFF_CURRENT – Skog / JonJons

Version 0.1.4, 2026-11-19. Branch: ccc-demo-public-test. /skog/ includes all general property, forestry plan, financing and tax calculation facts EXCEPT information obtained from John/Holmen and the historical purchase amounts of the seller's shares (grandfather half 50,000 SEK, mother quarter 100,000 SEK). Those excluded details are JonJons-only. /jonjons/ contains the complete property project. No login; pages are public.

## Verified project facts from user discussions
Price 2,000,000 SEK; bank loan 1,400,000 SEK; prospective down payment 600,000 SEK; tax assessment 1,710,000 SEK (forest 1,388,000, farmland 183,000, economic buildings 40,000, smallhouse plot 99,000). Forest 22.4 ha, plan standing volume 4,208 m3sk. Holmen John: 12 compartments 12,13,15,16,18,20,21,35,40,42,46,50, 11.4 ha, approx 2,480 m3fub, estimated net 1,580,000 SEK after harvest cost before regeneration 171,000 SEK and tax; 4 harvest events. Tax allowance ~811,696 SEK is preliminary for standard purchase and subject to restrictions. Rundvirke comparable numbers NOT YET VERIFIED: do not invent. Tax and sale/gift treatment requires professional verification.

## Non-negotiable separation
/skog/ MAY contain property facts, tax assessment, plan metrics, price, financing, and generic calculators. It MUST NOT contain John/Holmen-sourced figures or the seller's historical family share purchase amounts. /jonjons/ may contain those facts. Do not publish original sensitive contracts or identifying details.

## Next steps
Retrieve and compare original Holmen and Rundvirke source documents before publishing additional figures. Improve offline/PWA only after validation. Keep /skog/ and /jonjons/ separate; preserve no-login requirement. If user requests cloud synchronization of private data, explain authentication/security tradeoffs before implementation. Update version, handoff and provide complete/changed ZIP in subsequent releases per existing project workflow.

## v0.1.2
Prefilled JonJons with verified conversation-known property values, tax assessment breakdown, forest plan metrics, financial scenario and Holmen compartments. Rundvirke amounts remain unfilled pending source verification. /skog/ remains strictly generic and without any property/vendor data. No login, public site: do not commit original sensitive documents.

## v0.1.4
User clarified /skog/ should be prefilled with everything except John/Holmen information and the seller's historical share purchases. Updated /skog/ accordingly, left Holmen-dependent net/replanting inputs empty. /jonjons/ unchanged.

## v0.1.4
Verified against Prospekt v13.pdf: Västtjär 1:3 has three existing mortgage deeds totaling SEK 300,000; seller clears any associated loans by completion. Added mortgage deed and estimated new deed cost (SEK 1.1m additional, SEK 22k stamp duty at 2%, excluding fees) to /skog/. Important: existing mortgage deeds are NOT debt. Continue audit of prospect for other missing material items.

## v0.1.5
JonJons: John email parentheses define four separate groups: (12,13,15,16,18), (20,21), (35,40), (42,46,50). Rendered as compact expandable groups with totals only. No unsupported per-group volumes, revenues, dates or areas. /skog/ unchanged: John/Holmen figures remain excluded.

## v0.1.6
Mapped John's four parenthesized harvest groups to named skiften using the compartment descriptions in Prospekt v13.pdf: groups 1 (12,13,15,16,18) and 2 (20,21) = Römyran; groups 3 (35,40) and 4 (42,46,50) = Hemskiftet. This is sourced from the prospect, not inferred from John email. /skog/ unchanged.

## v0.1.7
Added independently editable, local-only assumptions for each of four John harvest groups: area, volume, access, terrain, stand, undergrowth, reforestation, timing, vendor net and notes. Blank until verified; no invented group figures. Export text file. /skog/ unchanged.
