# Lina – rensningsförslag

Dokumentrevision 1.0 • 2026-10-03

Status: FÖRSLAG – inga filer har flyttats eller raderats.
Repository: container13/Container13-vintage, branch ccc-demo-public-test.
Inventerad commit: f9195d108dfd34a43a277dc6bcd3d939dd9fbcf2.

## Föreslagen åtgärd

Arkivera 129 historiska handoff-filer och sju äldre Worker-filer i `linasopti/history/legacy/`, med oförändrat innehåll och samma filnamn. De innehåller projekthistorik och ska bevaras.

Ta bort två filer från branchens aktuella filuppsättning: det äldre COMPLETE-paketet och .gitkeep. Git-historiken skrivs inte om.

Inga GitHub Release-poster hittades vid inventeringen.

## Avgränsning och kontroll före verkställande

Nuvarande frontend V0.3.15, CURRENT-handoff, MASTER RULES, checklistan, README-filer, projekthistorik, kandidatdata, app-state och all fryst evidence behålls. Gen7/Gen8 körs aldrig om. Gen9 förblir NOT APPROVED, Handel/Forward avstängda.

Äldre linasopti.js/css, worker.js, root-filer och abc lämnas utanför: legacy-sidan abc/index.html använder sina egna JS/CSS. Ålder eller identiska blobbar är inte tillräcklig grund för radering.

Nuvarande Lina-index har inga direkta länkar till de föreslagna äldre Worker-filerna eller ZIP-paketet. Historiska handoff-filer nämner äldre Worker-filer. Detta är ingen fullständig analys av samtliga transitiva referenser. Före flytt ska referenser i aktuell dokumentation och körbar kod kontrolleras; berörda länkar uppdateras, och varje flytt verifieras mot nedanstående blob-SHA. Stoppa en åtgärd om en aktiv referens eller ändrad fil upptäcks. Git-historik, andra brancher och deployad Cloudflare Worker ändras inte.

Arkivering städar mappen men minskar inte repo-historikens storlek. ZIP-radering tar bort 331198 byte ur aktuell filuppsättning; .gitkeep är 1 byte. Dokumentuppdateringen ändrar inte appversionen.

## Exakt filförteckning

136 arkiveringar och två borttagningar, totalt 138 filer.

| Källa | Åtgärd / mål | Git blob-SHA |
|---|---|---|
| `linasopti/.gitkeep` | Ta bort | `8b137891791fe96927ad78e64b0aad7bded08bdc` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V001.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V001.md` | `e85e3f03b3cd73a913a99b0ee73f7a01807dc65d` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0011.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0011.md` | `c7b708abd127ff925f949c398984bebfcddf60b0` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0012.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0012.md` | `a00c6b13b3f2836c1fa9e1c55efa8da7b6144182` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0014.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0014.md` | `0f3e84d39ade0bc1da51cbea3c816045ff169a9c` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0015.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0015.md` | `9cd57c9454e5f49651ad05bd266cf593f7284e46` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0016.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0016.md` | `514b11cee82aa61335fed8e4c1195a0fcee885bf` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0200.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0200.md` | `73a08a05b121f0aaeb296b004b2f058795016070` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0201.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0201.md` | `60d57b639072fd7c8e89a05332c23623e48f8efd` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0202.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0202.md` | `aeb1037d1b2e9fe5db98c694a58c5156c5280b2d` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0203.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0203.md` | `19d6c228b297fed964da5d1309318395d3e3b66f` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0204.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0204.md` | `2290039af6e4eda1273b65f30c3ebbc2d4e1c74c` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0205.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0205.md` | `53e22fd4e1bc2abc1ba5e29c1491b9ab0ac1d539` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0206.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0206.md` | `dd549db18ea3755e3a436a3e2b529623ca49b770` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0207.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0207.md` | `c02d0688835aced0deb6c8a9284902fae7190074` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0208.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0208.md` | `a84d0b1251aeef324a67324693caec899e0a62cf` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0209.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0209.md` | `e28329babef0e17aada64acd0c3c7baaa76a0159` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0210.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0210.md` | `75168551dc8e28aca5c2fbe469ef4487e77d4ffd` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0211.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0211.md` | `9750c40c6de46be86163c3ff0ec846ccf6321c50` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0212.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0212.md` | `6a4bac7a04825346968bdf5c145ac5ac607a7934` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0213.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0213.md` | `37874dca039f9f5199652acb9e23871d9ecfc9a4` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0214.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0214.md` | `97859d35c2ed5f4e6771b4bc35e8dcf324e3a342` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0215.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0215.md` | `488d290a85cb8cfc77184859fbda0ec9ce3b4b58` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0216.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0216.md` | `d3454600a1bf33e52511be7f995bfd9ef5b2dd0a` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0217.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0217.md` | `bf9408497cbfa30ecf687ff9916c42e03d29ea88` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0218.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0218.md` | `3297edf4ee1a30a9b3f693ba6b4c9a6378bb6c9c` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0219.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0219.md` | `3b6073284f0b23ef892a35e962eb90901d688781` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0220.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0220.md` | `355aff8123e81f72a7d0dd4c4ec980358d54715f` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0221.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0221.md` | `ab2bef380ca298c21a7c8a75c81b142dcb0f0325` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0222.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0222.md` | `c70364b4da0b96e378b59f4d551dded0d30471a1` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0223.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0223.md` | `edfabe51c3b059e44933ac402ae5f3415a4dd6de` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0224.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0224.md` | `6c2ab8775be9652734900be1ff3d021fb82d9dd9` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0225.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0225.md` | `74abc610d2f3a0e30c310deb5998b1693cfc1b6d` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0226.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0226.md` | `d61d321df5103ad0c6a16ab9c8af52ba1c56b3b1` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0227.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0227.md` | `ea8959ac31a82d3cfa357ca696188e28842fd301` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0228.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0228.md` | `625f155b15790596ffaeed840c551952ee6b2142` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0229.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0229.md` | `6688274cb74a115b11d77dc103062e87e13c3382` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0230.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0230.md` | `18a4b927962b0c83f5835a36722c8b22e603d1ff` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0231.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0231.md` | `df0f09ee9b2f6a83dee315a484224cfde201f849` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0232.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0232.md` | `6caac7383b6acab079805e15ac83847b919cfae6` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0233.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0233.md` | `f63ba3932a2aa4fef09b1971b6e0a618dd8eb904` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0234.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0234.md` | `17bc556da71383cb1eeaa288fb8ae0b509478223` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0235.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0235.md` | `aa412ad833bd1040f055c76f14c874a7c065749f` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0236.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0236.md` | `6cdfad2d6cec8eb2869ff71cb159f31c46ebcf66` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0237.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0237.md` | `b468ef3eb3c91277ced63815690adfc8e3b89622` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0238.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0238.md` | `09367792988bbf81d536a235cbdab66dcb17c4dd` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0239.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0239.md` | `df84dab72339ab7d3651d7257678eeddc16c7bd9` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0240.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0240.md` | `39dd05437d02198a1ba9466d333c550849e0ba81` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0241.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0241.md` | `a36ac01b877f4850b1a344306a29f9c57fade801` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0242.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0242.md` | `122aac2bc30a2956bbc42970903fa5621a854b56` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0243.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0243.md` | `1be842f027e75689b0aad035c27d30b533f44b1b` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0244.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0244.md` | `d4ef20cee9ea1e4172ba89f7c98158bb4a2b97ac` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0245.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0245.md` | `1560fa06630f0c9157f6efa7ac7acab9e4d2a84a` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0246.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0246.md` | `99db7bf9b7c86aa29a4ed575504722f8e185d2db` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0247.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0247.md` | `c1a9e3a47350dad68566ec9a99e2df2ee7c617cd` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0248.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0248.md` | `db30cc8428cbbb8ae58418121aa98056723bc6f2` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0249.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0249.md` | `fda84c14c966ba937b7d6f544f5b4efa208275bc` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0251.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0251.md` | `4457ffdcc9695d84bb9289b344b918f1de80a487` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0252.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0252.md` | `33bfe1368890b610afab5708029cdbbf9d7c31c6` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0253.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0253.md` | `63071e0b75a75e24fc80f932b1db9e2a1ee63d58` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0254.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0254.md` | `00a5d7f907f6e88fa1003431610d71c3e27a3216` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0255.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0255.md` | `f9fe81ad6cddf82f594abd93e9a5483e0d06a4ca` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0256.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0256.md` | `8bcc059efb304db79cb5efd89304e54e4f97f774` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0257.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0257.md` | `38b4d58b44a96db1544b7fd417831991ce0bf23a` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0258.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0258.md` | `a920f6c4778c340cb948935513965b650ea11e44` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0259.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0259.md` | `14445f0a4159e9627549cf187847bbadf2b98c3f` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0260.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0260.md` | `938f1cdc3fda57ee517e57916c7889c522c69f60` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0261.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0261.md` | `b58f1c87c3e8070b7920238e851bc1b19e8f8d10` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0262.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0262.md` | `fe33c3a7c9cf90fd2caed2e1b7938213abd004a5` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0263.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0263.md` | `e63c757f7ad3c32e8a8191618be59da622a145fa` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0264.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0264.md` | `51cdb6c803b1004e438f13ada23250db5c4e0d8d` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0265.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0265.md` | `38e5b26e2edeb8560da12f9e14adbd67eae19e25` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0266.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0266.md` | `6468d5012324f89b512db71c3125088375bed301` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0267.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0267.md` | `160d13de089960078304b128a732c13b332e2670` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0268.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0268.md` | `06954fecb5de559bb7a084b9ae34dd66ffab78b4` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0269.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0269.md` | `e90fe2b38a9c441fa23364898f94b3c7422ba554` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0270.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0270.md` | `825862afc68997516bc92b02e013933958ee929b` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0271.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0271.md` | `3c2f767c351dbcd7c415fde525a9cde65ba8a06e` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0272.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0272.md` | `72e89d46ce293c3ae253f39fb52652aaea2491b9` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0273.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0273.md` | `371da3ba205d7f0a72a3d505839f534f552c9830` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0274.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0274.md` | `4aaaf521187f8b9efdfb26b408334aa831b3c86f` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0275.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0275.md` | `f3dc70f0f2f4ddcede7efdbb0a65e7419f1c47fb` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0276.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0276.md` | `d00640ed7356c8bc359d3ff9a8d6009d059a16c2` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0277.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0277.md` | `0767c08ea4ddd604d2769f726f75f866032a6229` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0278.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0278.md` | `3fd97b5a8e8141bdcb85e52718d39716e329171f` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0279.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0279.md` | `a4203fca3e592a3f6d6cc78d72ffbf42149ee407` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0280.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0280.md` | `e205fba79e46b5610b1a8dfd473e179d4469988b` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0281.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0281.md` | `c29a9841ca28aea6e73f935e31ad487ed1138fce` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0282.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0282.md` | `24ed02b3564a4b32ef4d7f3396484954eadce000` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0284.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0284.md` | `21faaf652cb5b2c0e06b3fe3bc2ceb8c9ad088c5` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0285.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0285.md` | `2d922078f27a1e6ab338e530e6e14ce679bdb831` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0286.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0286.md` | `c8709931dc52452e6aca2156958cc796ec260975` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0287.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0287.md` | `2ae2c1ad914863274a2055f43e55dab1d2fd8aaa` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0288.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0288.md` | `77d2c937c767236bed7bc2872efe06f907615999` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0289.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0289.md` | `67cd40cd541faaf2b94c0385279701cf498aac4d` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0290.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0290.md` | `b93c50ff3bc1f8477f88f0d9937e4a6a20194546` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0291.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0291.md` | `38e4bc3a1b63c9980d2ede7dac4a459dee9f2176` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0292.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0292.md` | `9794a0412040b2aa2e332ccbf6f3dd1232c6b2e6` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0293.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0293.md` | `37e4e5997992215a2846f3f6ac45ae5efc7da854` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0294.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0294.md` | `f2d89a177deed59cbfcbb916bf11e44209c85139` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0295.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0295.md` | `441c5a26e3b92d3aa0fa67d407c6b5aeae0ff120` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0296.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0296.md` | `459ef2e5e9277509393b517c1817104935ab36bc` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0297.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0297.md` | `91fa4a225767d90e2537bf4378bba04dd8959f93` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0298.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0298.md` | `dacac26bdc39a3f524cf70b8c976721d02b2934f` |
| `linasopti/LINA_HANDOFF_CLEAN_CORE_V0299.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_CLEAN_CORE_V0299.md` | `9566fec9b3088e37b5db7db68fdbf1101be17bce` |
| `linasopti/LINA_HANDOFF_V0540.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0540.md` | `c344d4e8e8f6409ab32140107d3396e0e4d25740` |
| `linasopti/LINA_HANDOFF_V0550.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0550.md` | `06ba47aaf3ecb8a590f7a2947c2d12540e23f9a6` |
| `linasopti/LINA_HANDOFF_V0551.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0551.md` | `8b8b8adb0911a996f9fe465bfe70b1adeb1a4050` |
| `linasopti/LINA_HANDOFF_V0560.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0560.md` | `7de7e6545ab90791eabbbb2cbf08d0ace923f8f7` |
| `linasopti/LINA_HANDOFF_V0561.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0561.md` | `446c4a5883326e91245d71cd5a997b2485b12f11` |
| `linasopti/LINA_HANDOFF_V0562.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0562.md` | `4696be57a60e1c01d5bb2f1c5f4eedf1ec50ddc1` |
| `linasopti/LINA_HANDOFF_V0563.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0563.md` | `da26b676a3e940ec23f78ea3bef90fa86375a46d` |
| `linasopti/LINA_HANDOFF_V0564.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0564.md` | `f51e2a41bc95343067628da6c7f2b65f382eec6b` |
| `linasopti/LINA_HANDOFF_V0570.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0570.md` | `4dd21840bbcdb4f43d711e0230fe5b3e1ddde2c6` |
| `linasopti/LINA_HANDOFF_V0571.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0571.md` | `fd38566c98bd05d4f93d637d1002a721d744d4fc` |
| `linasopti/LINA_HANDOFF_V0572.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0572.md` | `383c6aa5f591fde0bb128f25f24001d5789767ad` |
| `linasopti/LINA_HANDOFF_V0573.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0573.md` | `646700bb2392df3c4526e6252edd94f235bfc8fe` |
| `linasopti/LINA_HANDOFF_V0574.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0574.md` | `7dc4b2e879720aeb85c715529f9e479f2d492569` |
| `linasopti/LINA_HANDOFF_V0575.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0575.md` | `628412ba746f206d7fc5617a47bb1a407d05c7f1` |
| `linasopti/LINA_HANDOFF_V0576.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0576.md` | `6cf0d8195c859863a8b41555c5139d6c26ee331e` |
| `linasopti/LINA_HANDOFF_V0577.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0577.md` | `7bd6bbae63ea957c20f07e4d54cdbed5fad9525d` |
| `linasopti/LINA_HANDOFF_V0578.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0578.md` | `8d511f60b0017a7d6d4b8a8bbeb42f3a12176e40` |
| `linasopti/LINA_HANDOFF_V0580.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0580.md` | `26d5638ec994f381e9d25e48a40b2a72d4a5ea7a` |
| `linasopti/LINA_HANDOFF_V0581.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0581.md` | `8620664dd57a5c12f9a0662cde5c4ed710f2ddff` |
| `linasopti/LINA_HANDOFF_V0582.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0582.md` | `bc870238173833e78cca3811a02b3c0d71f93ac7` |
| `linasopti/LINA_HANDOFF_V0583.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0583.md` | `995890c5f98d3b3fc30400639c442bb547d9f43f` |
| `linasopti/LINA_HANDOFF_V0584.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0584.md` | `05cc064c29f917810e48500c2ed2810991a1684b` |
| `linasopti/LINA_HANDOFF_V0585.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0585.md` | `96e8ac5e306c9ba4676739c1bf1a690d05b06a29` |
| `linasopti/LINA_HANDOFF_V0586.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0586.md` | `46e62cbfa337424f20c39a1ca13b5b4aedb27c7e` |
| `linasopti/LINA_HANDOFF_V0587.md` | Arkivera till `linasopti/history/legacy/LINA_HANDOFF_V0587.md` | `a9e880a6234c85ec5383fe578531b59f7af2e626` |
| `linasopti/cloudflare-worker-v0231.js` | Arkivera till `linasopti/history/legacy/cloudflare-worker-v0231.js` | `60057dd0efd7373b6719707171f727414c2a821a` |
| `linasopti/cloudflare-worker-v0232.js` | Arkivera till `linasopti/history/legacy/cloudflare-worker-v0232.js` | `30bf644a962d6afba79e9e641fa5a8a3949dd7a5` |
| `linasopti/cloudflare-worker-v0233.js` | Arkivera till `linasopti/history/legacy/cloudflare-worker-v0233.js` | `9d94d93828bbf437bb7f3dc1b6c9df1043d2a590` |
| `linasopti/cloudflare-worker-v0235.js` | Arkivera till `linasopti/history/legacy/cloudflare-worker-v0235.js` | `709b6cc292193c256b9bca1053d2935bb7e5dd04` |
| `linasopti/cloudflare-worker-v0238.js` | Arkivera till `linasopti/history/legacy/cloudflare-worker-v0238.js` | `6401cc1b1c15d14387b88e3b25741a8f335706fe` |
| `linasopti/cloudflare-worker-v0243.js` | Arkivera till `linasopti/history/legacy/cloudflare-worker-v0243.js` | `719fa4a718e6fba0cc24e12cf5d6284fc5b89ae0` |
| `linasopti/linasopti_v0588_worker_nav_fix_COMPLETE.zip` | Ta bort | `77fd5714325830decfff2a9b53b2c2deff0a4617` |
| `linasopti/worker_eodhd_patch_v031.js` | Arkivera till `linasopti/history/legacy/worker_eodhd_patch_v031.js` | `31df9c5e36bcc2c68d43e1e399a071aca532b4ea` |
