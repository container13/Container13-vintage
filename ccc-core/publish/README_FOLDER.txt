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
