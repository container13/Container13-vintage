import { getSiteSettings } from "./site-data.js?v=1.1.0";

const defaultAboutTexts = {
  personal: {
    heading: "Hej! Det är vi som har Container 13.",
    body: `Vi heter Alvin Brisvåg och Cornelia Åström. Container 13 började med att vi sålde second hand-kläder på nätet och via Holma Market, samtidigt som vi åkte runt på loppisar. Efter ett tag ville vi prova att öppna en liten butik här i Hudiksvall.

Vi tycker särskilt mycket om äldre jeans, fotbollströjor, boots och andra plagg som känns lite mer personliga. Ibland lagar eller syr vi om sådant som fortfarande har mycket kvar att ge.

Butiken fylls på efter hand med sådant vi själva gillar och hittar. Det är egentligen inte krångligare än så. Vi försöker bara skapa en butik som vi själva gärna skulle besöka.`
  },
  story: {
    heading: "Från nätförsäljning till en liten butik i Hudiksvall",
    body: `Container 13 drivs av Alvin Brisvåg och Cornelia Åström. Det började med second hand-försäljning på nätet och via Holma Market, men efter många loppisrundor och ett växande klädintresse ville vi prova att skapa något eget.

I butiken samlar vi sådant vi själva tycker om: framför allt äldre jeans, fotbollströjor, boots och accessoarer. Vi gillar plagg som redan har en historia, och försöker laga eller sy om sådant som fortfarande har mycket kvar att ge.

Sortimentet växer fram efter hand beroende på vad vi hittar. Förhoppningen är helt enkelt att Container 13 ska vara ett trevligt ställe att titta in på och kanske hitta något man inte såg någon annanstans.`
  },
  energy: {
    heading: "Nya mål, gamla jeans och mycket nyfikenhet",
    body: `Container 13 har vuxit fram ur flera intressen som fått mötas: fotboll, äldre kläder, sömnad och jakten på bra loppisfynd. Alvin spelar fotboll i Hudiksvalls FF och driver butiken tillsammans med Cornelia.

Det som började med försäljning på nätet och via Holma Market blev till slut en egen butik på Marknadsgatan. Här finns äldre jeans, fotbollströjor, boots och andra saker som vi själva fastnat för.

Vi lär oss fortfarande längs vägen, fyller på när vi hittar något bra och försöker ha roligt under tiden.`
  }
};

const defaults = {
  storeName: "Container 13 Vintage", city: "Hudiksvall", address: "Marknadsgatan 1A",
  postalCity: "824 32 Hudiksvall", phone: "072-527 02 35", email: "alvinbrisvag@outlook.com",
  facebook: "https://www.facebook.com/61590920005705", instagram: "https://www.instagram.com/container.13",
  tiktok: "https://www.tiktok.com/@container.13", copyright: "© 2026 Container 13 Vintage",
  showSpotify: true,
  spotifyPlaylists: [{
    id: "spotify-1NJmcRHooRh6wvHi9F0qlL",
    name: "Container 13 – vår spellista",
    url: "https://open.spotify.com/playlist/1NJmcRHooRh6wvHi9F0qlL"
  }],
  activeSpotifyPlaylistId: "spotify-1NJmcRHooRh6wvHi9F0qlL",
  aboutEnabled: false,
  aboutVariant: "personal",
  aboutTexts: defaultAboutTexts,
  logoMode: "patina", customLogoUrl: "", customLogoStoragePath: "",
  introAnimationMode: "classic", introBackgroundColor: "#000000", introStarColor: "#d4af37",
  introInitialDurationMs: 500, introRevealDurationMs: 1000,
  introImageUrl: "", introImageStoragePath: "", introImageFit: "cover"
};

function text(id, value) { const el = document.getElementById(id); if (el) el.textContent = value || ""; }
function link(id, value) { const el = document.getElementById(id); if (!el) return; if (value) { el.href = value; el.hidden = false; } else el.hidden = true; }

function normalizedAboutTexts(value) {
  const source = value && typeof value === "object" ? value : {};
  return Object.fromEntries(
    Object.entries(defaultAboutTexts).map(([key, fallback]) => {
      const item = source[key] && typeof source[key] === "object" ? source[key] : {};
      return [key, {
        heading: String(item.heading || fallback.heading).slice(0, 140),
        body: String(item.body || fallback.body).slice(0, 5000)
      }];
    })
  );
}

function aboutPreviewSettings() {
  if (new URLSearchParams(window.location.search).get("about-preview") !== "1") {
    return null;
  }

  try {
    const value = JSON.parse(localStorage.getItem("c13AboutPreview") || "null");
    return value && typeof value === "object" ? value : null;
  } catch (_) {
    return null;
  }
}

function applyAboutSettings(data, isPreview = false) {
  const aboutLink = document.getElementById("site-about-link");
  const enabled = isPreview || data.aboutEnabled === true;
  if (aboutLink) aboutLink.hidden = !enabled;

  const page = document.getElementById("about-page-content");
  if (!page) return;

  if (!enabled) {
    window.location.replace("index.html");
    return;
  }

  const variants = normalizedAboutTexts(data.aboutTexts);
  const variant = ["personal", "story", "energy"].includes(data.aboutVariant)
    ? data.aboutVariant
    : "personal";
  const selected = variants[variant];
  const heading = document.getElementById("about-content-heading");
  const body = document.getElementById("about-content-body");

  if (heading) heading.textContent = selected.heading;
  if (body) {
    body.innerHTML = "";
    selected.body
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .forEach((paragraph) => {
        const element = document.createElement("p");
        element.textContent = paragraph;
        body.append(element);
      });
  }
}

const builtInLogoSources = {
  patina: "bilder/logotyp/logo-patina.webp",
  clean: "bilder/logotyp/logo-tryckeri-ren.png",
  legacy: "bilder/logotyp/logo.png"
};

function siteLogoSource(data) {
  if (data.logoMode === "custom" && (data.customLogoUrl || data.logoUrl)) {
    return data.customLogoUrl || data.logoUrl;
  }

  return builtInLogoSources[data.logoMode] || builtInLogoSources.patina;
}

export async function applySiteSettings() {
  try {
    const previewData = aboutPreviewSettings();
    const savedData = previewData || await getSiteSettings();
    const data = { ...defaults, ...savedData };
    if (
      !["patina", "clean", "legacy", "custom"].includes(savedData.logoMode)
      && typeof savedData.logoUrl === "string"
      && savedData.logoUrl
    ) {
      data.logoMode = "custom";
      data.customLogoUrl = savedData.logoUrl;
    }
    text("site-store-name", data.storeName); text("site-city", data.city); text("site-address", data.address);
    text("site-postal-city", data.postalCity); text("site-phone", data.phone); text("site-email", data.email);
    text("site-copyright", data.copyright);
    applyAboutSettings(data, Boolean(previewData));
    document.querySelectorAll("[data-site-logo]").forEach((image) => {
      image.src = siteLogoSource(data);
    });
    const phone = document.getElementById("site-phone-link"); if (phone) phone.href = `tel:${String(data.phone || "").replace(/[^+\d]/g, "")}`;
    const email = document.getElementById("site-email-link"); if (email) email.href = `mailto:${data.email || ""}`;
    link("site-facebook", data.facebook); link("site-instagram", data.instagram); link("site-tiktok", data.tiktok);
    const spotify = document.getElementById("site-spotify");
    if (spotify) {
      const playlists = Array.isArray(data.spotifyPlaylists) ? data.spotifyPlaylists : [];
      const activePlaylist = playlists.find((playlist) =>
        playlist?.id === data.activeSpotifyPlaylistId && playlist?.url
      ) || playlists.find((playlist) => playlist?.url) || defaults.spotifyPlaylists[0];
      if (data.showSpotify !== false && activePlaylist?.url) {
        spotify.href = activePlaylist.url;
        spotify.hidden = false;
        spotify.title = `Lyssna på ${activePlaylist.name || "vår Spotify-spellista"}`;
        spotify.setAttribute("aria-label", `Lyssna på ${activePlaylist.name || "vår Spotify-spellista"} på Spotify`);
      } else {
        spotify.hidden = true;
      }
    }
    const map = document.getElementById("site-map"); if (map) map.src = `https://www.google.com/maps?q=${encodeURIComponent(`${data.address} ${data.city}`)}&output=embed`;
    const directions = document.getElementById("site-directions"); if (directions) directions.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${data.address} ${data.city}`)}`;
  } catch (error) { console.warn("Kunde inte hämta webbplatsens inställningar:", error); }
}
