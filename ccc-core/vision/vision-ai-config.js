// CCC Vision AI – klientkonfiguration.
// Lägg ALDRIG en OpenAI API-nyckel här. Nyckeln hör hemma i server/Worker-miljön.
window.CCC_VISION_AI_CONFIG = {
  // När endpoint är tom fortsätter Vision i säkert demoläge.
  // Exempel efter att Cloudflare Worker har publicerats:
  // endpoint: "https://ccc-vision.<ditt-konto>.workers.dev",
  endpoint: "https://ccc-vision-api.mangaj73.workers.dev",
  timeoutMs: 90000,
  maxImageEdge: 1600,
  jpegQuality: 0.84,
  diagnostics: true,
  pricing: {
    updated: "2026-08-08",
    usdToSek: 10.5,
    models: {
      "gpt-5.6-sol": { inputPerMTokUsd: 5, outputPerMTokUsd: 30 },
      "gpt-5.6": { inputPerMTokUsd: 5, outputPerMTokUsd: 30 },
      "gpt-5.6-terra": { inputPerMTokUsd: 2, outputPerMTokUsd: 12 },
      "gpt-5.6-luna": { inputPerMTokUsd: 0.2, outputPerMTokUsd: 1.2 }
    }
  }
};
