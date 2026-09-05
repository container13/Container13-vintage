// ==UserScript==
// @name         Competence Tool – mobilvy ver2
// @namespace    container13.mobile.ver2
// @version      2.0.1
// @description  Gör Holmens bemanningsschema användbart på iPhone.
// @match        https://competencetool.se/*
// @match        https://*.competencetool.se/*
// @include      /^https:\/\/[^/]*competencetool\.se\/.*$/
// @run-at       document-end
// @grant        none
// ==/UserScript==

/*
  README – UPPDATERA DET INBYGGDA ORGANISATIONSTRÄDET
  ==================================================

  Varför finns listan i skriptet?
  --------------------------------
  Competence Tools organisationsträd ligger normalt i vänster-iframe:n
  /LeftContent/Show. På iPhone bygger den äldre trädkontrollen inte sitt
  #orgTree när vänsterpanelen är dold. Direkthämtning av samma adress ger
  inte heller ett färdigbyggt träd. Därför innehåller skriptet en lokal
  reservkopia i konstanten `embeddedOrganisationTree`.

  Nuvarande reservkopia
  ---------------------
  Källa: den kompletta Competence Tool-sidan sparad på dator 2026-09-02.
  Antal valbara huvudområden: 7.
  Varje post innehåller:
    id     = numret i /Manning/ShowManning/ID
    depth  = nivån i trädet, beräknad från td-id:t orgTree__...
    label  = texten som visas i organisationsträdet

  Så uppdateras trädet senare
  ---------------------------
  1. Öppna Competence Tool på en dator där den vita vänsterspalten visas.
  2. Kontrollera att organisationsträdet har laddats. Expandera gärna de
     grenar som nyligen har ändrats.
  3. Spara hela webbsidan med tillhörande filer. Den relevanta filen brukar
     heta Show.html och motsvarar adressen /LeftContent/Show.
  4. Ersätt INTE listan för hand. Läs alla direkta länkar med denna struktur:
       #orgTree td[id^="orgTree__"] > a.pointer
  5. Hämta ID från länkens onclick:
       /Manning/ShowManning/(siffror)
  6. Beräkna depth från antalet delar i td-id:t minus ett. Exempel:
       orgTree__2182_2183_7664  => depth 2
  7. Normalisera label genom att slå ihop upprepade blanksteg.
  8. Ta bort dubbla ID:n men behåll ordningen från trädet.
  9. Behåll endast de avtalade huvudområdena. Enskilda skiftlag A–F ska inte
     läggas här eftersom de väljs med de fasta A–F-knapparna i mobilvyn.
  10. Ersätt endast värdet i `embeddedOrganisationTree`, uppdatera datum och
      antal val i denna README och höj userskriptets versionsnummer.

  Kontroll efter uppdatering
  --------------------------
  - Bekräfta att Fiber (Bemanning), ID 7664, finns med.
  - Bekräfta att Ved 3/7, ID 2196, finns med i stället för överordnade Ved.
  - Bekräfta att indrag/hierarki ser rimliga ut i rullgardinsmenyn.
  - Prova att byta till minst två andra avdelningar och tillbaka till Fiber.
  - Kontrollera därefter A–F-flervalet samt vågrät och lodrät scrollning.
  - Ändra inte tabellens scroll-, sticky-, höjd- eller A–F-kod när endast
    organisationsträdet ska uppdateras.
*/

(() => {
  'use strict';

  // Skriptet installeras uttryckligen på iPhone. Competence Tool kan få Safari
  // att rapportera desktopmått/desktop-UA, så ingen enhetskontroll görs här.

  const addViewport = (targetDocument = document) => {
    let viewport = targetDocument.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = targetDocument.createElement('meta');
      viewport.name = 'viewport';
      (targetDocument.head || targetDocument.documentElement).appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
  };

  const lockPageZoom = (targetDocument = document) => {
    if (targetDocument.documentElement.dataset.ctmZoomLocked === '1') return;
    targetDocument.documentElement.dataset.ctmZoomLocked = '1';

    // Safari kan fortfarande nypzooma inuti iframe:ar trots viewport-regeln.
    // Stoppa bara flerfingers-/zoomgester; enfingersscrollningen lämnas orörd.
    const stopGesture = (event) => event.preventDefault();
    targetDocument.addEventListener('gesturestart', stopGesture, { passive: false });
    targetDocument.addEventListener('gesturechange', stopGesture, { passive: false });
    targetDocument.addEventListener('gestureend', stopGesture, { passive: false });
    targetDocument.addEventListener('touchmove', (event) => {
      if (event.touches.length > 1) event.preventDefault();
    }, { passive: false });
  };

  const addStyle = (id, css, targetDocument = document) => {
    if (targetDocument.getElementById(id)) return;
    const style = targetDocument.createElement('style');
    style.id = id;
    style.textContent = css;
    (targetDocument.head || targetDocument.documentElement).appendChild(style);
  };

  const styleShell = () => {
    let shellDocument = document;
    try { shellDocument = window.top.document; } catch (_) {}
    shellDocument.documentElement.classList.add('ctm-shell');
    addStyle('ctm-shell-style', `
      html.ctm-shell, html.ctm-shell body {
        width: 100% !important;
        min-width: 0 !important;
        overflow: hidden !important;
      }
      #mainBtnDiv { display: none !important; }
      #Splitter1,
      #Splitter1 > table,
      #Splitter1 > table > tbody,
      #Splitter1 > table > tbody > tr {
        width: 100vw !important;
        max-width: 100vw !important;
      }
      #__Splitter1L, #__Splitter1Mid,
      td:has(> .ob_spl_leftpanel),
      .ob_spl_dividervertical,
      .ob_spl_leftpanel,
      #Splitter1_LeftP_Header, #Splitter1_LeftP_Content,
      #Splitter1_LeftP_Footer {
        display: none !important;
        width: 0 !important;
      }
      #__Splitter1R, #__Splitter1RD,
      td:has(> .ob_spl_rightpanel),
      .ob_spl_rightpanel,
      #Splitter1_RightP_Header, #Splitter1_RightP_Content,
      #Splitter1_RightP_Footer {
        left: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
      }
      #Splitter1_RightP_Content {
        height: calc(100dvh - 48px) !important;
        overflow: hidden !important;
      }
      #Splitter1_RightP_Header {
        height: 48px !important;
        background: #0d537b !important;
      }
      #mainContentHeaderBg {
        position: relative !important;
        height: 48px !important;
        padding: 0 14px !important;
        background: #0d537b !important;
      }
      #mainContentHeaderBg > .col-md-12 {
        padding: 0 !important;
      }
      #mainContentHeaderBg .pull-left {
        float: none !important;
        margin: 0 !important;
      }
      #Splitter1_RightP_Content iframe {
        width: 100vw !important;
        max-width: 100vw !important;
        height: 100% !important;
      }
      #mainContentHeaderNameHolder {
        max-width: calc(100vw - 24px) !important;
        height: 48px !important;
        line-height: 48px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      #mainContentHeaderNameHolder, #mainContentHeaderNameHolder * {
        font-size: 17px !important;
        font-weight: 700 !important;
        color: #fff !important;
      }
      #mainContentHeaderNameHolder.ctm-department-holder {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        overflow: visible !important;
      }
      #mainContentHeaderNameHolder .ctm-department-label {
        flex: 0 0 auto !important;
        line-height: 48px !important;
        white-space: nowrap !important;
      }
      #mainContentHeaderNameHolder #ctm-department-select {
        display: block !important;
        flex: 1 1 auto !important;
        min-width: 0 !important;
        max-width: 250px !important;
        height: 34px !important;
        margin: 0 !important;
        padding: 3px 28px 3px 8px !important;
        border: 1px solid #9fc4d8 !important;
        border-radius: 7px !important;
        background: #fff !important;
        color: #164f70 !important;
        font-size: 15px !important;
        font-weight: 700 !important;
      }
    `, shellDocument);
    return true;
  };

  const styleManning = () => {
    if (!document.querySelector('.TimeViewTable, .topContent')) return false;
    document.documentElement.classList.add('ctm-manning');
    addStyle('ctm-manning-style', `
      html.ctm-manning, html.ctm-manning body {
        width: 100% !important;
        min-width: 0 !important;
        height: 100% !important;
        overflow: hidden !important;
        -webkit-overflow-scrolling: touch;
        background: #f5f7f9 !important;
      }
      #headercontent {
        display: none !important;
      }
      .bgImageShiftPlanner { display: none !important; }
      div:has(> .bgImageShiftPlanner) { display: none !important; }
      div:has(> .bgImageShiftPlanner) + .col-md-12 {
        width: 100% !important;
        min-width: 100% !important;
        max-width: 100% !important;
        height: 100dvh !important;
        margin: 0 !important;
        padding: 12px 0 !important;
        overflow: hidden !important;
      }
      .nav-tabs {
        display: none !important;
      }
      .nav-tabs > li { float: none !important; flex: 0 0 auto !important; }
      .nav-tabs > li > a {
        min-height: 44px !important;
        padding: 12px 14px !important;
        font-size: 15px !important;
      }
      .topContent {
        height: auto !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 4px 8px 5px !important;
        display: block !important;
        background: #f7f9fb !important;
        border-bottom: 1px solid #dbe6ed !important;
        box-shadow: 0 1px 3px rgba(20,69,96,.05) !important;
      }
      .topContent > .row {
        display: flex !important;
        flex-wrap: nowrap !important;
        gap: 6px !important;
        margin: 0 !important;
      }
      .topContent > .row > [class*="col-"] {
        float: none !important;
        width: auto !important;
        height: auto !important;
        padding: 0 !important;
        flex: 1 1 0 !important;
        min-width: 0 !important;
      }
      .topContent > .row > [class*="col-"]:first-child,
      .topContent > .row > [class*="col-"]:nth-child(2),
      .topContent > .row > [class*="col-"]:nth-child(n+5) { display: none !important; }
      .topContent > .row > [class*="col-"]:nth-child(4) > a {
        display: none !important;
      }
      .topContent .form-group {
        position: relative !important;
        margin: 0 !important;
      }
      .topContent .ellipsis { overflow: visible !important; }
      .topContent label, .topContent .controltext {
        margin-bottom: 2px !important;
        color: #344f5f !important;
        font-size: 12px !important;
        font-weight: 600 !important;
      }
      .topContent .form-control, .topContent .btn {
        min-height: 34px !important;
        height: 34px !important;
        font-size: 13px !important;
      }
      .ctm-date-line {
        display: flex !important;
        align-items: stretch !important;
        gap: 4px !important;
        width: 100% !important;
      }
      .ctm-date-line .bootstrapDateTimePicker {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        width: auto !important;
      }
      .ctm-date-step {
        position: static !important;
        z-index: 12 !important;
        flex: 0 0 30px !important;
        width: 30px !important;
        min-width: 30px !important;
        height: 34px !important;
        min-height: 34px !important;
        padding: 0 !important;
        border: 1px solid #8fb4cb !important;
        border-radius: 7px !important;
        background: #0d537b !important;
        color: #fff !important;
        box-shadow: 0 1px 2px rgba(13,83,123,.18) !important;
        font: 800 18px/32px -apple-system, BlinkMacSystemFont, sans-serif !important;
        text-align: center !important;
        touch-action: manipulation !important;
      }
      .ctm-date-step:active { background: #083c59 !important; }
      .dataTables_wrapper, .dataTables_scroll,
      .dataTables_scrollHead, .dataTables_scrollBody {
        width: 100% !important;
        max-width: 100vw !important;
      }
      #shiftScheduleTable_wrapper {
        overflow: auto !important;
        max-width: 100vw !important;
        height: calc(100dvh - 50px) !important;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: none;
      }
      #ctm-shift-filter {
        display: flex !important;
        justify-content: center !important;
        gap: 4px !important;
        width: 100% !important;
        padding: 4px 8px !important;
        overflow: hidden !important;
        background: #fff !important;
        border-bottom: 1px solid #c8d9e5 !important;
        -webkit-overflow-scrolling: touch;
        position: relative !important;
        top: auto !important;
        z-index: 80 !important;
      }
      #ctm-shift-filter button {
        flex: 0 0 auto !important;
        box-sizing: border-box !important;
        min-width: 0 !important;
        width: 39px !important;
        min-height: 34px !important;
        padding: 4px 0 !important;
        border: 1px solid #9bb9cc !important;
        border-radius: 999px !important;
        background: #f3f7fa !important;
        color: #164f70 !important;
        box-shadow: 0 1px 1px rgba(13,83,123,.06) !important;
        font: 700 15px -apple-system, BlinkMacSystemFont, sans-serif !important;
        transition: background-color .15s ease, border-color .15s ease, box-shadow .15s ease !important;
      }
      #ctm-shift-filter button:first-child { width: 56px !important; }
      #ctm-shift-filter button[aria-pressed="true"] {
        border-color: #0d537b !important;
        background: #0d537b !important;
        color: #fff !important;
        box-shadow: 0 2px 5px rgba(13,83,123,.24) !important;
      }
      #ctm-view-options {
        display: grid !important;
        grid-template-columns: minmax(0, 1.35fr) minmax(0, .72fr) minmax(0, 1fr) 26px !important;
        align-items: center !important;
        gap: 6px !important;
        box-sizing: border-box !important;
        height: 32px !important;
        padding: 3px 9px !important;
        background: #fff !important;
        color: #173f57 !important;
        font: 650 13px -apple-system, BlinkMacSystemFont, sans-serif !important;
        position: relative !important;
        top: auto !important;
        z-index: 81 !important;
      }
      #ctm-view-options label {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        margin: 0 !important;
        white-space: nowrap !important;
      }
      #ctm-view-options input {
        width: 19px !important;
        height: 19px !important;
        margin: 0 !important;
        accent-color: #0d537b;
      }
      #ctm-help-button {
        flex: 0 0 26px !important;
        width: 26px !important;
        min-width: 26px !important;
        height: 26px !important;
        min-height: 26px !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 1px solid #0d537b !important;
        border-radius: 50% !important;
        background: #0d537b !important;
        color: #fff !important;
        box-shadow: 0 1px 2px rgba(13,83,123,.18) !important;
        font: 800 16px/24px -apple-system, BlinkMacSystemFont, sans-serif !important;
        text-align: center !important;
        touch-action: manipulation !important;
      }
      #ctm-help-button:active { background: #083c59 !important; }
      #ctm-help-overlay[hidden] { display: none !important; }
      #ctm-help-overlay {
        position: fixed !important;
        inset: 0 !important;
        z-index: 100000 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 12px !important;
        background: rgba(5, 31, 46, .58) !important;
        box-sizing: border-box !important;
      }
      #ctm-help-dialog {
        position: relative !important;
        width: min(420px, 100%) !important;
        max-height: calc(100dvh - 24px) !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch;
        padding: 17px 16px 18px !important;
        border: 1px solid #b8cfdd !important;
        border-radius: 16px !important;
        background: #fff !important;
        color: #183746 !important;
        box-shadow: 0 12px 35px rgba(0,0,0,.3) !important;
        box-sizing: border-box !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        touch-action: pan-y !important;
      }
      #ctm-help-dialog h2 {
        margin: 0 44px 13px 0 !important;
        color: #0d537b !important;
        font-size: 20px !important;
        line-height: 1.2 !important;
      }
      #ctm-help-close {
        position: absolute !important;
        top: 10px !important;
        right: 10px !important;
        width: 34px !important;
        height: 34px !important;
        min-height: 34px !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 9px !important;
        background: #e7eef3 !important;
        color: #173f57 !important;
        font: 800 23px/32px -apple-system, BlinkMacSystemFont, sans-serif !important;
      }
      #ctm-help-dialog dl { margin: 0 !important; }
      #ctm-help-dialog dt {
        margin: 10px 0 2px !important;
        color: #0d537b !important;
        font-size: 15px !important;
        font-weight: 800 !important;
      }
      #ctm-help-dialog dd {
        margin: 0 !important;
        color: #405d6c !important;
        font-size: 14px !important;
        line-height: 1.35 !important;
      }
      #shiftScheduleTable tbody tr.ctm-hidden-non-person {
        display: none !important;
      }
      html.ctm-first-names #shiftScheduleTable th:first-child,
      html.ctm-first-names #shiftScheduleTable td:first-child {
        min-width: 100px !important;
        width: 100px !important;
        max-width: 100px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      html.ctm-first-names #shiftScheduleTable th:nth-child(2),
      html.ctm-first-names #shiftScheduleTable td:nth-child(2) {
        min-width: 36px !important;
        width: 36px !important;
        max-width: 36px !important;
      }
      html.ctm-first-names #shiftScheduleTable th:nth-child(n+3),
      html.ctm-first-names #shiftScheduleTable td:nth-child(n+3) {
        min-width: 50px !important;
        width: 50px !important;
        max-width: 50px !important;
        padding-left: 5px !important;
        padding-right: 5px !important;
        white-space: nowrap !important;
      }
      .dataTables_scrollBody {
        height: calc(100dvh - 50px) !important;
        overflow: auto !important;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: none !important;
      }
      .TimeViewTable, #shiftScheduleTable {
        width: max-content !important;
        min-width: 100% !important;
        font-size: 14px !important;
      }
      .TimeViewTable th, .TimeViewTable td,
      #shiftScheduleTable th, #shiftScheduleTable td {
        min-width: 58px !important;
        height: 38px !important;
        padding: 4px 5px !important;
        font-size: 14px !important;
      }
      .TimeViewTable .TH_Name,
      .TimeViewTable th:first-child,
      .TimeViewTable td:first-child,
      #shiftScheduleTable .TH_Name,
      #shiftScheduleTable th:first-child,
      #shiftScheduleTable td:first-child {
        position: sticky !important;
        left: 0 !important;
        z-index: 20 !important;
        min-width: 180px !important;
        max-width: 180px !important;
        background: #fff !important;
        box-shadow: 2px 0 4px rgba(0,0,0,.12);
      }
      .TimeViewTable thead th, #shiftScheduleTable thead th {
        position: sticky !important;
        z-index: 15 !important;
      }
      #shiftScheduleTable thead tr:nth-child(1) th { top: 0 !important; }
      #shiftScheduleTable thead tr:nth-child(2) th { top: 38px !important; }
      #shiftScheduleTable thead tr:nth-child(3) th { top: 76px !important; }
      .TimeViewTable thead th:first-child, #shiftScheduleTable thead th:first-child { z-index: 30 !important; }
      #shiftScheduleTable th:nth-child(2),
      #shiftScheduleTable td:nth-child(2) {
        position: sticky !important;
        left: 180px !important;
        z-index: 21 !important;
        background: #fff !important;
        box-shadow: 2px 0 4px rgba(0,0,0,.08);
      }
      html.ctm-first-names #shiftScheduleTable th:nth-child(2),
      html.ctm-first-names #shiftScheduleTable td:nth-child(2) {
        left: 100px !important;
      }
      #shiftScheduleTable thead th:first-child,
      #shiftScheduleTable thead th:nth-child(2) { z-index: 40 !important; }
      #shiftScheduleTable thead tr:first-child th.ctm-signature-anchor {
        z-index: 55 !important;
        overflow: visible !important;
      }
      .ctm-mobile-signature {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 210px !important;
        height: 76px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 1px !important;
        color: #51758b !important;
        background: linear-gradient(145deg, #fff 10%, #f1f7fa 100%) !important;
        border-right: 1px solid #c7dce8 !important;
        border-bottom: 1px solid #c7dce8 !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        line-height: 1.15 !important;
        letter-spacing: .1px !important;
        white-space: nowrap !important;
        pointer-events: none !important;
        box-sizing: border-box !important;
      }
      .ctm-mobile-signature span {
        display: block !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        font-style: normal !important;
        line-height: 1.05 !important;
      }
      .ctm-mobile-signature .ctm-signature-title {
        color: #55798d !important;
        font-size: 9.5px !important;
        font-weight: 650 !important;
        letter-spacing: 0 !important;
      }
      .ctm-mobile-signature .ctm-signature-product {
        color: #315f78 !important;
        font-size: 10px !important;
        font-weight: 750 !important;
        letter-spacing: -.15px !important;
      }
      .ctm-mobile-signature .ctm-signature-product sup {
        position: relative !important;
        top: -.25em !important;
        margin-left: 1px !important;
        font-size: 55% !important;
        line-height: 0 !important;
        vertical-align: baseline !important;
      }
      .ctm-mobile-signature strong {
        color: #0d537b !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        font-size: 12px !important;
        font-style: normal !important;
        font-weight: 800 !important;
        line-height: 1 !important;
        background: linear-gradient(100deg, #0d537b 10%, #2f91c7 38%, #8ee8ff 50%, #2f91c7 62%, #0d537b 90%) !important;
        background-size: 220% 100% !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        filter: drop-shadow(0 1px 1px rgba(13,83,123,.2)) !important;
        animation: ctm-signature-shimmer 3.8s ease-in-out infinite !important;
      }
      .ctm-mobile-signature strong::before,
      .ctm-mobile-signature strong::after {
        content: '✦' !important;
        display: inline-block !important;
        padding: 0 2px !important;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: 8px !important;
        -webkit-text-fill-color: #63c7e8 !important;
        animation: ctm-signature-sparkle 2.2s ease-in-out infinite !important;
      }
      .ctm-mobile-signature strong::after {
        animation-delay: 1.1s !important;
      }
      @keyframes ctm-signature-shimmer {
        0%, 100% { background-position: 100% 50%; }
        50% { background-position: 0% 50%; }
      }
      @keyframes ctm-signature-sparkle {
        0%, 100% { opacity: .3; transform: scale(.75) rotate(0deg); }
        50% { opacity: 1; transform: scale(1.25) rotate(25deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        .ctm-mobile-signature strong,
        .ctm-mobile-signature strong::before,
        .ctm-mobile-signature strong::after {
          animation: none !important;
        }
      }
      html.ctm-first-names .ctm-mobile-signature {
        width: 135px !important;
      }
      .customTooltipText {
        position: fixed !important;
        left: 12px !important;
        right: 12px !important;
        bottom: calc(12px + env(safe-area-inset-bottom)) !important;
        top: auto !important;
        width: auto !important;
        max-width: none !important;
        z-index: 99999 !important;
        font-size: 14px !important;
        padding: 14px !important;
      }
      .modal-dialog, .ui-dialog {
        left: 8px !important;
        right: 8px !important;
        width: auto !important;
        max-width: calc(100vw - 16px) !important;
        margin: 8px auto !important;
      }
      #manningModal.modal {
        position: fixed !important;
        inset: 0 !important;
        box-sizing: border-box !important;
        width: 100vw !important;
        height: 100dvh !important;
        padding: 10px !important;
        overflow: hidden !important;
      }
      #manningModal .modal-dialog {
        position: relative !important;
        inset: auto !important;
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 430px !important;
        height: calc(100dvh - 20px) !important;
        max-height: calc(100dvh - 20px) !important;
        margin: 0 auto !important;
      }
      #manningModal .modal-content {
        position: relative !important;
        box-sizing: border-box !important;
        width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
        overflow: hidden !important;
        border: 1px solid #b9cfdb !important;
        border-radius: 14px !important;
        background: #fff !important;
        box-shadow: 0 14px 38px rgba(0,0,0,.3) !important;
      }
      #manningModalBody.modal-body {
        position: relative !important;
        box-sizing: border-box !important;
        width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
        padding: 46px 10px 12px !important;
        overflow: auto !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: contain !important;
        touch-action: pan-x pan-y !important;
      }
      #manningModalBody #placementWrapper {
        width: max-content !important;
        min-width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
      }
      #ctm-manning-modal-close {
        position: absolute !important;
        top: 8px !important;
        right: 8px !important;
        z-index: 10010 !important;
        width: 34px !important;
        min-width: 34px !important;
        height: 34px !important;
        min-height: 34px !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 9px !important;
        background: #e5edf2 !important;
        color: #173f57 !important;
        box-shadow: 0 1px 3px rgba(0,0,0,.16) !important;
        font: 800 23px/32px -apple-system, BlinkMacSystemFont, sans-serif !important;
        text-align: center !important;
        touch-action: manipulation !important;
      }
    `);
    return true;
  };

  const installManningModalClose = () => {
    const modal = document.querySelector('#manningModal');
    const content = modal?.querySelector('.modal-content');
    if (!modal || !content || document.getElementById('ctm-manning-modal-close')) return Boolean(content);
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'ctm-manning-modal-close';
    button.setAttribute('aria-label', 'Stäng');
    button.textContent = '×';
    button.addEventListener('click', () => {
      const nativeClose = modal.querySelector('.close, [data-dismiss="modal"]');
      if (nativeClose && nativeClose !== button) {
        nativeClose.click();
      } else if (window.jQuery?.fn?.modal) {
        window.jQuery(modal).modal('hide');
      } else {
        modal.classList.remove('in');
        modal.style.display = 'none';
        document.querySelectorAll('.modal-backdrop').forEach((backdrop) => backdrop.remove());
      }
    });
    content.prepend(button);
    return true;
  };

  const embeddedOrganisationTree = [
    { id: '7664', depth: 0, label: 'Fiber' },
    { id: '2187', depth: 0, label: 'TM4' },
    { id: '2196', depth: 0, label: 'Ved 3/7' },
    { id: '7707', depth: 0, label: 'Återvinning/Energi' },
    { id: '2190', depth: 0, label: 'KM1' },
    { id: '2191', depth: 0, label: 'KM2' },
    { id: '7678', depth: 0, label: 'Driftledare' }
  ];

  const installDepartmentSelect = () => {
    const table = document.querySelector('#shiftScheduleTable');
    if (!table) return false;

    let topDocument;
    try {
      topDocument = window.top.document;
    } catch (_) {
      return false;
    }
    const header = topDocument.querySelector('#mainContentHeaderNameHolder');
    if (!header) return false;

    let select = header.querySelector('#ctm-department-select');
    if (!select) {
      const label = topDocument.createElement('span');
      label.className = 'ctm-department-label';
      label.textContent = 'Arbetsgrupp:';
      select = topDocument.createElement('select');
      select.id = 'ctm-department-select';
      select.setAttribute('aria-label', 'Välj avdelning');
      select.disabled = true;
      select.appendChild(new Option('Laddar avdelningar…', ''));
      header.classList.add('ctm-department-holder');
      header.replaceChildren(label, select);
    }

    const entries = embeddedOrganisationTree;

    if (!select.disabled && select.options.length === entries.length) return true;

    let currentId = '';
    let savedId = '';
    try {
      currentId = window.top.location.href.match(/\/Manning\/ShowManning\/(\d+)/i)?.[1] || '';
      savedId = window.top.sessionStorage.getItem('ctm-department-id') || '';
    } catch (_) {
      currentId = '';
      savedId = '';
    }
    const selectedId = entries.some((entry) => entry.id === savedId)
      ? savedId
      : entries.some((entry) => entry.id === currentId) ? currentId : entries[0].id;

    select.replaceChildren();
    select.disabled = false;
    entries.forEach((entry) => {
      const option = document.createElement('option');
      option.value = entry.id;
      option.textContent = `${'\u00a0\u00a0'.repeat(entry.depth)}${entry.label}`;
      option.selected = entry.id === selectedId;
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      const id = select.value;
      try {
        window.top.sessionStorage.setItem('ctm-department-id', id);
      } catch (_) {}
      select.disabled = true;
      try {
        if (typeof window.top.LoadMainPanel === 'function') {
          window.top.LoadMainPanel(`/Manning/ShowManning/${id}`);
        } else {
          window.top.location.hash = `/Manning/ShowManning/${id}`;
        }
      } catch (_) {
        select.disabled = false;
      }
      window.setTimeout(() => { select.disabled = false; }, 1500);
    });

    return true;
  };

  const installMobileSignature = () => {
    const anchor = document.querySelector('#shiftScheduleTable thead tr:first-child th:first-child');
    if (!anchor) return false;
    anchor.classList.add('ctm-signature-anchor');
    if (anchor.querySelector('.ctm-mobile-signature')) return true;

    const signature = document.createElement('span');
    signature.className = 'ctm-mobile-signature';
    const product = Object.assign(document.createElement('span'), { className: 'ctm-signature-product' });
    product.append(document.createTextNode('CompetenceTool'), Object.assign(document.createElement('sup'), { textContent: 'TM' }));
    signature.append(
      Object.assign(document.createElement('span'), { className: 'ctm-signature-title', textContent: 'Iphone-anpassad' }),
      product,
      Object.assign(document.createElement('strong'), { textContent: '@bulan73' })
    );
    anchor.appendChild(signature);
    return true;
  };

  const applyPersonRowVisibility = () => {
    const table = document.querySelector('#shiftScheduleTable');
    if (!table) return false;
    const showAll = sessionStorage.getItem('ctm-show-all-rows-v064') === 'true';
    table.querySelectorAll('tbody tr').forEach((row) => {
      const firstCell = row.querySelector('th:first-child, td:first-child');
      const hasPersonIcon = firstCell?.querySelector(
        'img[title="Medarbetare"], img[alt="Medarbetare"]'
      );
      row.classList.toggle('ctm-hidden-non-person', !showAll && !hasPersonIcon);
    });
    return true;
  };

  const installShiftFilter = () => {
    const table = document.querySelector('#shiftScheduleTable');
    if (!table) return false;

    const existingFilter = document.getElementById('ctm-shift-filter');
    if (existingFilter) {
      let saved = [];
      try {
        saved = JSON.parse(sessionStorage.getItem('ctm-shifts') || '[]')
          .filter((shift) => ['A', 'B', 'C', 'D', 'E', 'F'].includes(shift));
      } catch (_) {}
      const marker = JSON.stringify(saved);
      const search = saved.length ? `^\\s*(?:${saved.join('|')})\\s*$` : '';
      const jq = window.jQuery;
      const dataTables = jq?.fn?.dataTable;
      if (dataTables?.fnIsDataTable?.(table)) {
        const legacyTable = jq(table).dataTable();
        const settings = legacyTable.fnSettings();
        const activeSearch = settings.aoPreSearchCols?.[1]?.sSearch || '';
        const hasUnexpectedShift = saved.length > 0 && Array.from(table.querySelectorAll('tbody tr')).some((row) => {
          if (getComputedStyle(row).display === 'none') return false;
          const shift = row.querySelector('th:nth-child(2), td:nth-child(2)')?.textContent.trim();
          return /^[A-F]$/.test(shift || '') && !saved.includes(shift);
        });
        if (activeSearch !== search || hasUnexpectedShift) {
          settings.oFeatures.bFilter = true;
          if (activeSearch === search && hasUnexpectedShift && settings.aoPreSearchCols?.[1]) {
            settings.aoPreSearchCols[1].sSearch = '';
          }
          legacyTable.fnFilter(search, 1, true, false);
          table.dataset.ctmAppliedShifts = marker;
          applyPersonRowVisibility();
          requestAnimationFrame(fitScheduleHeight);
        }
      }
      return true;
    }

    const filter = document.createElement('div');
    filter.id = 'ctm-shift-filter';
    filter.setAttribute('aria-label', 'Välj skiftlag');
    const choices = ['Alla', 'A', 'B', 'C', 'D', 'E', 'F'];
    const selected = new Set();
    try {
      const saved = JSON.parse(sessionStorage.getItem('ctm-shifts') || '[]');
      saved.filter((shift) => choices.includes(shift) && shift !== 'Alla').forEach((shift) => selected.add(shift));
    } catch (_) {
      selected.clear();
    }

    const applyShift = () => {
      filter.querySelectorAll('button').forEach((button) => {
        const shift = button.dataset.shift;
        const pressed = shift === 'Alla' ? selected.size === 0 : selected.has(shift);
        button.setAttribute('aria-pressed', String(pressed));
      });

      const currentTable = document.querySelector('#shiftScheduleTable');
      if (!currentTable) return;
      const jq = window.jQuery;
      const dataTables = jq?.fn?.dataTable;
      if (!dataTables?.fnIsDataTable?.(currentTable)) return;

      const legacyTable = jq(currentTable).dataTable();
      const settings = legacyTable.fnSettings();
      settings.oFeatures.bFilter = true;
      const search = selected.size ? `^\\s*(?:${Array.from(selected).join('|')})\\s*$` : '';
      legacyTable.fnFilter(search, 1, true, false);
      currentTable.dataset.ctmAppliedShifts = JSON.stringify(Array.from(selected));
      applyPersonRowVisibility();

      const scheduleContainer = document.querySelector('#shiftScheduleContainer');
      if (scheduleContainer) scheduleContainer.scrollTop = 0;
      sessionStorage.setItem('ctm-shifts', JSON.stringify(Array.from(selected)));
      requestAnimationFrame(fitScheduleHeight);
    };

    choices.forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.shift = choice;
      button.textContent = choice;
      button.addEventListener('click', () => {
        if (choice === 'Alla') {
          selected.clear();
        } else if (selected.has(choice)) {
          selected.delete(choice);
        } else {
          selected.add(choice);
        }
        applyShift();
      });
      filter.appendChild(button);
    });

    const wrapper = document.querySelector('#shiftScheduleTable_wrapper') || table.parentElement;
    wrapper.parentElement.insertBefore(filter, wrapper);
    applyShift();
    return true;
  };

  const installNameOption = () => {
    const table = document.querySelector('#shiftScheduleTable');
    const filter = document.getElementById('ctm-shift-filter');
    if (!table || !filter || document.getElementById('ctm-view-options')) return false;

    const options = document.createElement('div');
    options.id = 'ctm-view-options';
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = sessionStorage.getItem('ctm-first-names-v064') !== 'false';
    label.append(checkbox, document.createTextNode('Visa bara förnamn'));
    const showAllLabel = document.createElement('label');
    const showAllCheckbox = document.createElement('input');
    showAllCheckbox.type = 'checkbox';
    showAllCheckbox.checked = sessionStorage.getItem('ctm-show-all-rows-v064') === 'true';
    showAllLabel.append(showAllCheckbox, document.createTextNode('Visa allt'));
    const popupLabel = document.createElement('label');
    const popupCheckbox = document.createElement('input');
    popupCheckbox.type = 'checkbox';
    popupCheckbox.checked = sessionStorage.getItem('ctm-allow-popups-v201') === 'true';
    popupLabel.append(popupCheckbox, document.createTextNode('Tillåt popup'));
    options.append(label, showAllLabel, popupLabel);
    filter.parentElement.insertBefore(options, filter);

    // Stoppa bara det avslutande klicket som öppnar Competence Tools popup.
    // Pekstart, drag och touchmove lämnas helt orörda så tabellen kan scrollas.
    if (document.documentElement.dataset.ctmPopupGuard !== '1') {
      document.documentElement.dataset.ctmPopupGuard = '1';
      document.addEventListener('click', (event) => {
        if (sessionStorage.getItem('ctm-allow-popups-v201') === 'true') return;
        if (!event.target.closest('#shiftScheduleTable, #shiftScheduleTable_wrapper table')) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      }, true);
    }

    const updateNames = () => {
      document.documentElement.classList.toggle('ctm-first-names', checkbox.checked);
      table.querySelectorAll('a.TimeViewName').forEach((link) => {
        const personIcon = link.querySelector('img[title="Medarbetare"], img[alt="Medarbetare"]');
        if (!personIcon) return;
        const fullName = link.dataset.ctmFullName || link.textContent.trim();
        link.dataset.ctmFullName = fullName;
        const shownName = checkbox.checked ? fullName.split(/\s+/)[0] : fullName;
        Array.from(link.childNodes).forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            node.textContent = `\u00a0${shownName}`;
          }
        });
      });
      sessionStorage.setItem('ctm-first-names-v064', String(checkbox.checked));
    };

    checkbox.addEventListener('change', updateNames);
    showAllCheckbox.addEventListener('change', () => {
      sessionStorage.setItem('ctm-show-all-rows-v064', String(showAllCheckbox.checked));
      applyPersonRowVisibility();
      requestAnimationFrame(fitScheduleHeight);
    });
    popupCheckbox.addEventListener('change', () => {
      sessionStorage.setItem('ctm-allow-popups-v201', String(popupCheckbox.checked));
    });
    updateNames();
    applyPersonRowVisibility();
    return true;
  };

  const installDateRangeControls = () => {
    const fromInput = document.querySelector('#ctl00_MainContent_txtStartDate');
    const toInput = document.querySelector('#ctl00_MainContent_txtEndDate');
    const table = document.querySelector('#shiftScheduleTable');
    const wrapper = document.querySelector('#shiftScheduleTable_wrapper');
    if (!fromInput || !toInput || !table || !wrapper || typeof window.__doPostBack !== 'function') return false;

    const iso = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const addDays = (date, days) => {
      const next = new Date(date);
      next.setDate(next.getDate() + days);
      return next;
    };
    const addMonths = (date, months) => {
      const next = new Date(date);
      const wantedDay = next.getDate();
      next.setDate(1);
      next.setMonth(next.getMonth() + months);
      const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      next.setDate(Math.min(wantedDay, lastDay));
      return next;
    };
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const unitId = document.querySelector('#shiftScheduleTable a[onclick*="unit="]')
      ?.getAttribute('onclick')?.match(/unit=(\d+)/i)?.[1]
      || sessionStorage.getItem('ctm-department-id')
      || 'current';
    const backKey = `ctm-date-back-months-v062-${unitId}`;
    const forwardKey = `ctm-date-forward-months-v062-${unitId}`;
    const attemptKey = `ctm-date-attempt-v062-${unitId}`;
    const restoreKey = `ctm-date-position-v062-${unitId}`;

    const dateCells = () => Array.from(table.querySelectorAll('thead tr:first-child th[title]'));
    const fixedWidth = () => Array.from(table.querySelectorAll('thead tr:first-child th')).slice(0, 2)
      .reduce((sum, cell) => sum + cell.getBoundingClientRect().width, 0);
    const saveVisibleDate = () => {
      const cells = dateCells();
      if (!cells.length) return;
      const anchor = wrapper.scrollLeft + fixedWidth();
      let visible = cells[0];
      cells.forEach((cell) => {
        if (cell.offsetLeft <= anchor + 2) visible = cell;
      });
      sessionStorage.setItem(restoreKey, JSON.stringify({
        date: visible.getAttribute('title'),
        delta: Math.max(0, anchor - visible.offsetLeft)
      }));
    };
    const restoreVisibleDate = () => {
      if (wrapper.dataset.ctmDatePositioned === '1') return;
      wrapper.dataset.ctmDatePositioned = '1';
      let target = { date: iso(today), delta: 0 };
      try {
        target = JSON.parse(sessionStorage.getItem(restoreKey) || '') || target;
      } catch (_) {}
      sessionStorage.removeItem(restoreKey);
      const place = () => {
        const cell = dateCells().find((candidate) => candidate.getAttribute('title') === target.date);
        if (!cell) return;
        wrapper.scrollLeft = Math.max(0, cell.offsetLeft + (Number(target.delta) || 0) - fixedWidth());
      };
      [0, 100, 300, 700].forEach((delay) => window.setTimeout(place, delay));
    };

    const desiredRange = () => {
      const start = addMonths(addDays(today, -5), -Math.max(0, Number(sessionStorage.getItem(backKey)) || 0));
      const end = addMonths(today, 1 + Math.max(0, Number(sessionStorage.getItem(forwardKey)) || 0));
      return { start: iso(start), end: iso(end) };
    };
    const applyRange = () => {
      const desired = desiredRange();
      const marker = `${desired.start}|${desired.end}`;
      if (fromInput.value === desired.start && toInput.value === desired.end) {
        sessionStorage.removeItem(attemptKey);
        restoreVisibleDate();
        return true;
      }
      if (sessionStorage.getItem(attemptKey) === marker || window.__ctmDateRangeLoading) return false;
      if (!sessionStorage.getItem(restoreKey)) {
        sessionStorage.setItem(restoreKey, JSON.stringify({ date: iso(today), delta: 0 }));
      }
      sessionStorage.setItem(attemptKey, marker);
      fromInput.value = desired.start;
      toInput.value = desired.end;
      window.__ctmDateRangeLoading = true;
      if (typeof window.setWaitCursor === 'function') window.setWaitCursor();
      window.__doPostBack('ctl00$MainContent$calEndDate', desired.end);
      return true;
    };

    const addButton = (pickerId, id, text, title, beforePicker, action) => {
      if (document.getElementById(id)) return;
      const picker = document.querySelector(pickerId);
      const group = picker?.closest('.form-group');
      if (!picker || !group) return;
      let line = group.querySelector('.ctm-date-line');
      if (!line) {
        line = document.createElement('div');
        line.className = 'ctm-date-line';
        picker.parentElement.insertBefore(line, picker);
        line.appendChild(picker);
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.id = id;
      button.className = 'ctm-date-step';
      button.textContent = text;
      button.title = title;
      button.setAttribute('aria-label', title);
      button.addEventListener('click', () => {
        saveVisibleDate();
        action();
        sessionStorage.removeItem(attemptKey);
        applyRange();
      });
      if (beforePicker) line.insertBefore(button, picker);
      else line.appendChild(button);
    };

    addButton('#dateTimePickerFrom', 'ctm-date-back', '−', 'Ladda en månad bakåt', true, () => {
      sessionStorage.setItem(backKey, String(Math.max(0, Number(sessionStorage.getItem(backKey)) || 0) + 1));
    });
    addButton('#dateTimePickerTo', 'ctm-date-forward', '+', 'Ladda en månad framåt', false, () => {
      sessionStorage.setItem(forwardKey, String(Math.max(0, Number(sessionStorage.getItem(forwardKey)) || 0) + 1));
    });
    applyRange();
    return true;
  };

  const installMobileHelp = () => {
    const options = document.getElementById('ctm-view-options');
    if (!options || document.getElementById('ctm-help-button')) return false;

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'ctm-help-button';
    button.textContent = '?';
    button.title = 'Hjälp för mobilvyn';
    button.setAttribute('aria-label', 'Öppna hjälp för mobilvyn');

    const overlay = document.createElement('div');
    overlay.id = 'ctm-help-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <section id="ctm-help-dialog" role="dialog" aria-modal="true" aria-labelledby="ctm-help-title">
        <button type="button" id="ctm-help-close" aria-label="Stäng hjälpen">×</button>
        <h2 id="ctm-help-title">Så fungerar mobilvyn</h2>
        <dl>
          <dt>Arbetsgrupp</dt>
          <dd>Välj vilken avdelning eller bemanningsgrupp som ska visas.</dd>
          <dt>− En månad bakåt</dt>
          <dd>Lägger till ytterligare en månad före startdatumet utan att flytta den dag du tittar på.</dd>
          <dt>+ En månad framåt</dt>
          <dd>Lägger till ytterligare en månad efter slutdatumet utan att flytta den dag du tittar på.</dd>
          <dt>Kalenderfälten</dt>
          <dd>Tryck på kalendern för att själv välja start- eller slutdatum.</dd>
          <dt>Visa bara förnamn</dt>
          <dd>Visar personernas förnamn för att ge schemat mer plats. Avmarkera för att visa fullständiga namn.</dd>
          <dt>Visa allt</dt>
          <dd>Visar även avdelningsinformation, grupprubriker och andra rader utan människosymbol.</dd>
          <dt>Tillåt popup</dt>
          <dd>Är normalt avstängd så att drag i schemat inte råkar öppna en ruta. Slå på den tillfälligt när du vill öppna datum, namn eller skiftinformation.</dd>
          <dt>Alla och A–F</dt>
          <dd>Alla visar samtliga skiftlag. Tryck på ett eller flera av A–F för att kombinera skiftlag.</dd>
          <dt>Scrollning</dt>
          <dd>Dra åt sidan för fler datum och uppåt eller nedåt för fler personer. Namn, skift och datumrubriker hålls kvar.</dd>
          <dt>Dagens datum</dt>
          <dd>Grundintervallet börjar fem dagar bakåt, men dagens datum placeras först synligt.</dd>
        </dl>
      </section>`;

    const close = () => {
      overlay.hidden = true;
      button.focus({ preventScroll: true });
    };
    button.addEventListener('click', () => {
      overlay.hidden = false;
      overlay.querySelector('#ctm-help-close')?.focus({ preventScroll: true });
    });
    overlay.querySelector('#ctm-help-close')?.addEventListener('click', close);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) close();
    });
    options.appendChild(button);
    document.body.appendChild(overlay);
    return true;
  };

  const fitScheduleHeight = () => {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const bottomGap = 6;
    const scheduleContainer = document.querySelector('#shiftScheduleContainer');
    if (scheduleContainer) {
      const containerTop = scheduleContainer.getBoundingClientRect().top;
      const containerHeight = Math.max(260, Math.floor(viewportHeight - containerTop - bottomGap));
      scheduleContainer.style.setProperty('height', `${containerHeight}px`, 'important');
      scheduleContainer.style.setProperty('max-height', `${containerHeight}px`, 'important');
    }

    const wrapper = document.querySelector('#shiftScheduleTable_wrapper');
    const scrollBody = wrapper?.querySelector('.dataTables_scrollBody');
    if (!wrapper) return Boolean(scheduleContainer);

    const wrapperTop = wrapper.getBoundingClientRect().top;
    const wrapperHeight = Math.max(260, Math.floor(viewportHeight - wrapperTop - bottomGap));
    wrapper.style.setProperty('height', `${wrapperHeight}px`, 'important');
    wrapper.style.setProperty('max-height', `${wrapperHeight}px`, 'important');
    if (!scrollBody) return true;

    requestAnimationFrame(() => {
      const bodyTop = scrollBody.getBoundingClientRect().top;
      const bodyHeight = Math.max(180, Math.floor(viewportHeight - bodyTop - bottomGap));
      scrollBody.style.setProperty('height', `${bodyHeight}px`, 'important');
      scrollBody.style.setProperty('max-height', `${bodyHeight}px`, 'important');
    });
    return true;
  };

  // Safari räknar iframe-vyn och toppsidans visuella viewport var för sig.
  // Därför måste höjden först föras vidare genom splittern och själva iframe:n.
  const fitOuterFrameHeight = () => {
    try {
      const topWindow = window.top;
      const topDocument = topWindow.document;
      const viewportHeight = topWindow.visualViewport?.height || topWindow.innerHeight;
      const content = topDocument.querySelector('#Splitter1_RightP_Content');
      if (!content || !viewportHeight) return false;

      const setRemainingHeight = (element, minimum = 320) => {
        if (!element) return;
        const top = Math.max(0, element.getBoundingClientRect().top);
        const height = Math.max(minimum, Math.floor(viewportHeight - top - 4));
        element.style.setProperty('height', `${height}px`, 'important');
        element.style.setProperty('min-height', `${height}px`, 'important');
        element.style.setProperty('max-height', `${height}px`, 'important');
      };

      [
        topDocument.querySelector('#Splitter1'),
        topDocument.querySelector('#Splitter1 > table'),
        topDocument.querySelector('#Splitter1 > table > tbody'),
        topDocument.querySelector('#Splitter1 > table > tbody > tr'),
        topDocument.querySelector('#__Splitter1R'),
        topDocument.querySelector('#__Splitter1RD'),
        topDocument.querySelector('.ob_spl_rightpanel'),
        content
      ].forEach((element) => setRemainingHeight(element));

      const contentHeight = Math.max(320, Math.floor(viewportHeight - Math.max(0, content.getBoundingClientRect().top) - 4));
      content.querySelectorAll('iframe').forEach((frame) => {
        frame.style.setProperty('height', `${contentHeight}px`, 'important');
        frame.style.setProperty('min-height', `${contentHeight}px`, 'important');
        frame.style.setProperty('max-height', `${contentHeight}px`, 'important');
      });
      return true;
    } catch (_) {
      return false;
    }
  };

  const apply = () => {
    addViewport();
    lockPageZoom();
    try {
      if (window.top.document !== document) {
        addViewport(window.top.document);
        lockPageZoom(window.top.document);
      }
    } catch (_) {}
    styleShell();
    styleManning();
    installShiftFilter();
    installNameOption();
    applyPersonRowVisibility();
    installDateRangeControls();
    installMobileHelp();
    installManningModalClose();
    installDepartmentSelect();
    installMobileSignature();
    fitOuterFrameHeight();
    requestAnimationFrame(fitScheduleHeight);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
  if (document.documentElement) {
    new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });
  }
  window.addEventListener('hashchange', apply);
  window.addEventListener('load', apply);
  window.addEventListener('resize', fitScheduleHeight);
  window.addEventListener('resize', fitOuterFrameHeight);
  window.visualViewport?.addEventListener('resize', fitScheduleHeight);
  window.visualViewport?.addEventListener('resize', fitOuterFrameHeight);
  window.visualViewport?.addEventListener('scroll', fitScheduleHeight);
  window.visualViewport?.addEventListener('scroll', fitOuterFrameHeight);
})();
