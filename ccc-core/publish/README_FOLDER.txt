CCC Publish-modul.
Mobil först. Normalflöde: Välj kanal → Välj plagg → sista kontrollvy → Förhandsvisa/Publicera.
v2.9.65: sista kontrollvyn har mindre centrerade miniatyrer, kompakt horisontell kanalrad samt lägre åtgärdsknappar med bättre luft mot Core-footern.

v2.9.66: Förhandsvisa använder fortsatt den isolerade Container13-sajtkopian; previewn får tydlig återgång till CCC och touch-swipe i bildvisningen.

v2.9.67: Förhandsvisningens produktkort hålls visuellt lika höga även när textmängden skiljer sig mellan plaggen.

v2.9.70: Container13-preview läser kanalens publika visningsval (titel/beskrivning) utan att ändra intern plaggdata.

v2.9.74: Förbered för publicering behandlas som publiceringsläge när utkasten är klara: tydlig primär Fortsätt-knapp går vidare med alla förberedda plagg till kanalval. Radering/urval ligger kvar som sekundärt Hantera/Välj-läge och Fortsätt döljs under detta läge.

v2.9.75: Hjälpen i Förbered för publicering förtydligar att bilderna kan öppnas och fortfarande anpassas före publicering samt beskriver Fortsätt och Välj.

v2.9.76: Förbered-vyns Fortsätt går nu korrekt till Välj kanal och bär med alla aktuella plagg. Grön bock behåller betydelsen sparad bildanpassning. I Välj/Ta bort-läget används röd bock/ram för markerade utkast och Hjälp förklarar båda statusarna.

v2.9.77: Förbered för publicering visar alltid ? Hjälp i Core-footern samtidigt som Välj och den permanenta Tillbaka-knappen. Publiceras hjälp är modulens egen och styrs inte av Dashboardens hjälpinställning. Fortsätt ligger kvar som tydlig huvudåtgärd i arbetsytan.

v2.9.78: Footer-init görs robust mot laddningsordning. Om Core ännu inte är redo väntar Publicera in ccc:core-ready och konfigurerar därefter om aktuell footer. Core-ready återställer nu både Publicera-header och footer, så ? Hjälp + Välj + Tillbaka kan renderas korrekt i Förbered-vyn.

v2.9.80: Publiceras kanalrad får Neon Glöd enligt valt alternativ 2: enhetligare rund ikonform, diskret kanalidentifierande glöd och tydligare aktiv kanal. Befintliga lås och statusbockar behålls. Ingen publiceringslogik ändras.

v2.9.81: v2.9.80 träffade fel vy. Neon Glöd flyttas nu till de faktiska kanalbrickorna i slutkontrollen (`.confirm-channel-chip`) och samma visuella språk används även i Välj kanal. Ikonerna är runda, kanalidentifierande och låsta kanaler behåller färg/glöd medan låset visar status.

v2.9.82: Publicera-knappen kopplas till lokal Container13 staging/site-preview, inte skarpa sajten. Valda plagg får stagingPublishedAt lokalt, staging-metadata sparas persistent på enheten och site-preview öppnas i cccStage-läge. Externa kanaler ligger fortsatt låsta.

v2.9.83: Staging-fix. Lokala stagingplagg får inte längre rensas ur gridden av den efterföljande "Hämtar bilder..."-statusen när vanlig gallericache saknas. Preview/staging-metadata tar även med originalFileKey som reservkälla till vision-files.

v2.9.84: Staging återanvänder nu exakt samma sessionStorage-metadataflöde som fungerande Förhandsvisa. Staging skriver inte längre om plaggposter i IndexedDB; staging-status sparas separat som metadata. Detta skyddar original/publishBlob/originalFileKey från oavsiktlig overwrite.

v2.9.85: Förhandsvisa och staging får en gemensam robust lokal bildtransport via Cache Storage. Publicera lägger de redan laddade valda bildblobbarna i lokal cache före navigation; site-preview läser dem direkt och använder IndexedDB endast som reserv. Ingen Firebase/live-data berörs.

v2.9.86: Publicera kopplas till skarpa Container13 via samma fungerande Firebase-väg som adminpanelen: Storage `nyinkommet/` -> downloadURL -> Firestore `gallery` med category `nyinkommet`. CCC lagrar cccItemId/source och kanalens showTitle/showDescription per post. Storage-filen rullas tillbaka om Firestore-skrivningen misslyckas. Efter lyckad publicering öppnas riktiga Nyinkommet för direkt kontroll.

v2.9.87: Publicera bevarar permanent `cccItemId`, backfillar äldre lokala utkast en gång och använder ID:t i Storage-filnamn, Firebase Storage customMetadata och Firestore. Bildbytes lämnas orörda; metadata följer bildobjektet separat genom CCC-pipelinen.

v2.9.88: Slutsteget visar vad Container13 kommer visa och kan tillfälligt ändras för just publiceringen. Standard utökad till titel/beskrivning/märke/storlek/pris. All data sparas även när den döljs.

v2.9.89: Anpassa bild får Bildinställningar (kugghjul) med Demobild/vattenstämpel. Vattenstämpeln ritas endast på genererad WebP-publiceringskopia, aldrig originalet, följer plaggets status och markeras i grid/slutkontroll. 3×3-griden får kvadratiska cover-miniatyrer och bättre luft.

v2.9.90: Demovattenstämpel flyttas från lokalt crop-kugghjul till Publiceras ordinarie modulinställningar. Detaljvyns gula knapp heter Fortsätt till kanalval och öppnar kanalval, inte publicering. Förbered med 5–9 plagg använder 2 kolumner på mobil för större bilder. Vattenstämpel kan skapas även utan manuell crop.

v2.9.91: Förbered-gridens faktiska runtime-regel ändras till 2 kolumner på mobil. Slutkontrollen låses till viewport med intern bildgrid. Demovattenstämpel flyttas från modulinställningar till kontextuell Inställningar-knapp i Core-footern endast i Anpassa bild.

v2.9.92: Core-footer får native Inställningar. Anpassa bild använder den för DEMO. 3×3 per sida återställs; fler än nio fortsätter via befintlig sidpager.

v2.9.94: Anpassa bild visar footerverktyget Demobild (⚙) utan Hjälp för att få plats. Förhandsvisa tas bort från slutkontrollen. Slutkontrollens kanalrad/sammanfattning komprimeras något men 9-per-sida-principen behålls.

v2.9.95: Förbered och Välj plagg delar nu samma kanoniska 3×3-geometri. Båda får fingerföljande sid-swipe med samma easing/tröskel som detaljvyn; nästa/föregående 9-grid visas samtidigt under swipen och pager uppdateras efter snap.

v2.9.96: Navigationsknappen efter valda plagg heter Gå vidare. 3×3-miniatyrerna får kompakt fast geometri i Förbered/Välj plagg/slutkontroll. Horisontell swipe avbryter pending long-press preview så kort inte zoomas under swipe; swipe-easing lämnas orörd.

v2.9.97: Publicera läser rätt Vision-session, Anpassa bild kan visa/spara hela originalet, dubbeltryck tas bort och swipe avbryter verklig long-press-state. Publicerade på Container13 hämtar Firebase, visar aktuella Nyinkommet och tillåter borttagning. Lyckade plagg lämnar redo-kön och CCC verkställer max 16 Nyinkommet efter publicering.

v2.9.98: Demobild/vattenstämpel tas bort helt ur Publicera, inklusive footerverktyg, dialog, badges, slutkontroll, metadata och bildgenerering. Äldre lokala demomärkta utkast kastar sin genererade publiceringskopia och återgår till originalet; redan publicerade livebilder ändras inte automatiskt.

v2.9.99: Förbered/Välj-gridden får konsekventa rad- och kolumnmellanrum. Swipe-sidorna är ogenomskinliga, exakt lika stora och åtskilda av en liten spalt även mitt i fingerdraget. Snapen blir snabbare och accepterar även en tydlig kort flick.

v2.10.0: Samlad rättning efter verkligt arbetsprov. Förbered, Välj plagg och Slutkontroll delar samma dubbelriktade paginerade 3×3-komponent med stabil yta även på sista sidan, identisk swipe-geometri utan genomlysning/slutsprång och mjuka ändlägen utan rundgång. Dubbeltryck tas faktiskt bort så enkeltryck/långtryck/swipe inte väntar på eller inkräktar på varandra. Detalj/anpassning återgår till Förbered i stället för kanalval. Publicerat delas i verkligt liveinnehåll och lokal batchhistorik; varje livebild visar kanal/tid och har tydlig Ta bort från hemsidan-knapp. Demobild är fortsatt helt borttagen.

v2.10.1: Publicering arkiverar lokalt original, WebP och metadata i stället för att radera dem. Hantera publicerade bilder får fliken Sparade bilder med live/offline-status. Liveborttagning använder gråmarkerat flerval, gemensam bekräftelse, bevarad scroll och flytande kvitto; endast Firebase-posten tas bort medan lokalt arkiv ligger kvar. Gridernas kolumnmellanrum ökas och swipe-kopian försvinner innan den riktiga gridden återställs för att undvika blinkande kanter.

v2.10.66: stöd för `?view=prepare` och `?view=prepare&item=<id>`; specifikt Vision-objekt öppnas direkt.

v2.10.69: orört Vision-original hydreras före detalj/crop; Förbered är 3×3 via enbart dynamisk CSS; kanal-/Nästa-logik orörd.

v2.10.73: Förbered och Välj objekt delar gridklass/geometri; draftGrid är inte längre flex-squeezed; channel-pager ovanför Fortsätt; swipe-ghost rensas före async render.

v2.10.74: iPhone longpress cleanup, exact swipe ghost geometry, crop quick-publish.

v2.10.75: mobile Prepare 2x3/6 per page; normal workflow scroll containment; crop footer Publicera direct-to-confirm with origin-aware back.

v2.10.76: Prepare corrected to 3x2; crop footer quick-publish reinforced after view activation with Core-footer fallback.

v2.10.77: ghost-free shared page swipe; crop footer uses exact Vision Core footer pattern with crop-only guard.

v2.10.78: mobile grid standard fixed to 3x2/6 per page in Prepare and Channel item selection.

v2.10.79: Vision-like swipe; fresh preview source in channel/confirm; confirm grid 3x2/6.

v2.10.80: Publishs sid-swipe använder Visions synliga tvåsidesprincip med samma tröskel och kantmotstånd, så ingen svart tomyta visas mellan sidor. Anpassa bild använder Visions direkta Core-footer-mönster för Hjälp + Publicera; Publicera sparar anpassningen och öppnar sista kontrollvyn med aktuellt objekt valt.

v2.10.81: Den gamla gridden döljs vid avslutad swipe innan asynkron rendering, vilket tar bort den kvarhängande efterskuggan. Anpassa återapplicerar kort Visions Core-footer-konfiguration så Publicera-knappen inte tappas i laddningsordningen.

v2.10.82: Detalj-swipe prioriterar inkommande bildlager över utgående under snapen för att ta bort efterskuggan. Publicera ligger i detaljvyns footer och går med aktuellt objekt direkt till sista kontrollvyn; Tillbaka återgår till detaljvyn.
v2.10.83: Publicera-starten får centrerad rubrik, guld/grön modulidentitet och tydligare grafiska SVG-ikoner. Övriga Publicera-vyer och publiceringslogiken är oförändrade.
v2.10.84: De gemensamma välkomstbrickorna får snabbare, tydligare tryckfeedback via Core. Publiceras funktioner och layout är i övrigt oförändrade.
v2.10.85: Publicera-starten använder samma kompaktare rubrikrad som Dashboard/Vision så korten börjar högre. Funktionerna är oförändrade.
v2.10.86: Sid-snapen använder hela avståndet inklusive gutter, så inkommande bildserie når exakt slutläge innan den gamla sidan rensas. Animationen kortas till 240 ms.
v2.10.87: Publiceras paginerade grids använder Core:s gemensamma swipeprofil utan att ändra den skuggfria lagerhanteringen. Vision-direktvägen hoppar över startvyn och skyddas mot ett sent bakåt-event.
v2.10.88: Aktuell och inkommande gridsida klipps inom samma Core-swipeviewport i stället för att använda ett fast helskärmslager. Vision-direktvägen öppnar sista kontrollvyn direkt.
v2.10.89: Core-landningen efter släpp är lugnare. Slutkontrollen visar 1–6 objekt adaptivt utan tomma platshållare; 7+ använder stabil 3×2-paging med Core-swipe.
v2.10.90: Core-landningen är 480 ms. Slutkontrollen får mer luft ovanför och under bilden utan att införa normal mobilscroll; korta skärmar använder mindre mellanrum.
v2.10.91: Swipe landar på 580 ms och detalj-swipen använder Core fullt ut. Enkelbildens slutkontroll får en symmetrisk 14 px ram. Startkorten får Core-styrd tryckkänsla och 140 ms vyfördröjning.
v2.10.107: Lägg till objekt öppnar Visions befintliga CCC-kamera i publish-add-läge. Klar sparar kameraomgångens nya objekt och återställer Publiceras tidigare grupp/kanal; X återgår utan staged-fotot. Publiceras gamla parallella filinput/importkod är borttagen.
v2.10.106: Publiceras interna vyer börjar dolda och en gemensam uppstartsgrind visar först den färdigrenderade route-vyn. Dashboard-ingången blinkar därför inte längre förbi den gamla välkomstvyn; Vision/Express och legacy-fallback använder samma princip.
v2.10.105: Slutkontrollen är Publiceras nya standardstart. Tomläget har Lägg till objekt/Välj utkast, huvudknappen kräver objekt, Historik är sekundär och gamla välkomstvyn finns kvar via `?legacyStart=1`.
v2.10.104: Slutkontrollen kan lägga till nya objekt från mobilens kamera/bildval. Varje bild blir ett Vision-kompatibelt lokalt objekt och inkluderas direkt i aktuell publicering; terminologin styrs från Core.
v2.10.103: Verktygskorten linjerar med huvudknappen. Objekt centreras när de ryms och använder fri Core-swipe vid overflow; kanalradens båda ändar har säker visningsyta.
v2.10.102: Granska i slutkontrollen öppnar markerat objekt i Visions Granska & komplettera och återvänder till samma expressgrupp. Objektkort och kanaler är något större; kanalraden har säker sidluft.
v2.10.101: Objektverktygen i slutkontrollen har grafiska SVG-ikoner, tydliga funktionsaccenter, aktivt statuspill och nedtryckt respons. Logik och publiceringsurval är oförändrade.
v2.10.100: Sista kontrollen visar objekten i en Core-styrd fri swipe-rad. Ett separat enkelval med gul ram aktiverar Granska, Anpassa bild och Ta bort utan att påverka publiceringsurvalet.
v2.10.99: Direktstarten accepterar flera explicita objekt-ID:n från Vision-kamerans Expresspublicera och väljer endast dem i slutkontrollen. Kanal är fortsatt aktivt val.
v2.10.95: Publicera-starten kan tonas upp av Core när navigationen kommer från Dashboardens markerade dimmerpilot.
v2.10.94: Slutkontrollens kanalrad använder Core `bindFree()`: fri touch-/mus-swipe med momentum, ingen sid-snap och automatisk centrering när raden ryms.
v2.10.93: Kanalvalets visuella state, aria-state och huvudknapp synkas centralt. Vald kanal visas med grön ytterring utan bock. Pinterest/Etsy är låsta testkanaler för swipe över sex kanaler.
v2.10.92: Ordinarie flöde bevarar C13-valet. Snabbvägar öppnar slutkontrollen utan kanal och visar Välj kanal tills användaren aktivt väljer C13.
