// CCC Vision AI – klientkonfiguration.
// Lägg ALDRIG en OpenAI API-nyckel här. Nyckeln hör hemma i server/Worker-miljön.
window.CCC_VISION_AI_CONFIG = {
  // När endpoint är tom fortsätter Vision i säkert demoläge.
  // Exempel efter att Cloudflare Worker har publicerats:
  // endpoint: "https://ccc-vision.<ditt-konto>.workers.dev",
  endpoint: "https://ccc-vision-api.mangaj73.workers.dev",
  timeoutMs: 45000,
  maxImageEdge: 1600,
  jpegQuality: 0.84
};
