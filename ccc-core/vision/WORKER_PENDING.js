// PENDING candidate snapshot; not yet promoted to verified CURRENT.
// CCC Vision deploy trigger: 2026-10-08; no runtime logic changed.
// CCC Vision – Cloudflare Worker (serverdel)
// Lägg OPENAI_API_KEY som en Worker Secret. Lägg aldrig nyckeln i webbsidan/GitHub-koden.
// Valfritt: OPENAI_MODEL (standard gpt-5.6-terra) och ALLOWED_ORIGINS kommaseparerat.

const PRODUCT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["label", "summaryTitle", "summaryBrand", "summarySeason", "confidence", "priceSuggestion", "fact", "fields", "fieldEvidence"],
  properties: {
    label: { type: "string" },
    summaryTitle: { type: "string" },
    summaryBrand: { type: "string" },
    summarySeason: { type: "string" },
    confidence: { type: "string", enum: ["Säker", "Ganska säker", "Lite osäker"] },
    priceSuggestion: { type: "integer", minimum: 0, maximum: 50000 },
    fact: { type: "string" },
    fieldEvidence: { type: "object", additionalProperties: false, required: ["title","description","category","brand","size","color","season","manufacturer"], properties: Object.fromEntries(["title","description","category","brand","size","color","season","manufacturer"].map(key => [key, { type:"object", additionalProperties:false, required:["confidence","evidence","nextPhoto"], properties:{ confidence:{type:"string",enum:["high","medium","low","unknown"]}, evidence:{type:"string"}, nextPhoto:{type:"string"} } }])) },
    fields: {
      type: "object",
      additionalProperties: false,
      required: ["title", "category", "brand", "season", "price", "manufacturer", "size", "color", "description"],
      properties: {
        title: { type: "string" },
        category: { type: "string" },
        brand: { type: "string" },
        season: { type: "string" },
        price: { type: "string" },
        manufacturer: { type: "string" },
        size: { type: "string" },
        color: { type: "string" },
        description: { type: "string" }
      }
    }
  }
};

const PROMPT = `Du är CCC Vision för en svensk vintage-/secondhandbutik.
Analysera endast det som rimligen kan utläsas ur 1–3 bilder av SAMMA plagg.
Målet är ett kort, användbart produktförslag – inte en lång expertutredning.

Regler:
- Ange år eller säsong endast när det finns konkret bildstöd, exempelvis en läsbar produktetikett eller tydlig identifierbar säsongsdetalj. Annars ska fields.season och summarySeason vara tomma. Skriv aldrig "Troligen året runt" eller generella säsongsantaganden.
- Hitta aldrig på storlek, årtal, spelarnamn eller modellbeteckning. Lämna tomt eller skriv att det behöver kontrolleras.
- Om ett lag, märke, sponsor eller tillverkare syns tydligt: använd det.
- För fotbollströjor: identifiera klubb/landslag, tillverkare, sponsor och möjlig säsong när bildbeviset räcker.
- "fact" får vara en enda kort relevant "Visste du?"-uppgift, endast när den är rimligt säker. Annars tom sträng.
- Skriv en informativ, attraktiv och sökbar svensk annonstitel: tydligt avläst märke om säkerhetsnivån är high/medium, plaggtyp, synlig färg och särskiljande detaljer. Använd etablerade modeord (t.ex. trucker, denim, sherpa) endast när modellen/materialet faktiskt kan styrkas av bilden. Inga osäkra märken eller modellnamn i titeln.\n- Beskrivningen ska vara på svenska, säljbar och saklig med observerbara detaljer som snitt, krage, materialstruktur, knäppning, fickor och färg. Upprepa inte samma mening flera gånger. Ingen gissning om skick, slitage, äkthet eller material som inte syns. "Nyskick" läggs endast till manuellt av användaren senare.\n- Skick ska inte AI-bedömas eller uppges utan manuell kontroll; prisförslag förblir avstängt tills separat verifierad prislogik finns.
- priceSuggestion ska vara 0 tills CCC har en separat prislogik med tillräckligt underlag.
- fields.price ska alltid vara tom sträng.
- fieldEvidence: bedöm varje fält separat. high endast vid tydligt synligt bildbevis, medium för rimlig tolkning, low vid svagt stöd och unknown om det saknas stöd. evidence beskriver kort vad i bilden som stöder uppgiften, aldrig påhittade detaljer. nextPhoto föreslår en specifik kompletterande detaljbild endast om den kan minska osäkerheten, annars tom sträng.
- Vid low eller unknown: lämna det motsvarande fields-värdet tomt. Ange aldrig en osäker gissning som faktum.
- Svara endast enligt JSON-schemat.`;

function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  const configured = (env.ALLOWED_ORIGINS || "https://container13.se")
    .split(",").map(v => v.trim()).filter(Boolean);
  if (!origin) return configured[0] || "https://container13.se";
  return configured.includes(origin) ? origin : "";
}

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors(origin) }
  });
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env);
    if (!origin) return new Response("Forbidden", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);
    if (!env.OPENAI_API_KEY) return json({ error: "OPENAI_API_KEY saknas i Worker-miljön." }, 500, origin);

    let body;
    try { body = await request.json(); } catch { return json({ error: "Ogiltig förfrågan." }, 400, origin); }
    const images = Array.isArray(body?.images) ? body.images.slice(0, 3) : [];
    if (!images.length || images.some(v => typeof v !== "string" || !v.startsWith("data:image/"))) {
      return json({ error: "En till tre bilder krävs." }, 400, origin);
    }

    const content = [{ type: "input_text", text: PROMPT }];
    for (const image of images) content.push({ type: "input_image", image_url: image, detail: "auto" });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-5.6-terra",
        store: false,
        reasoning: { effort: "low" },
        input: [{ role: "user", content }],
        text: {
          format: {
            type: "json_schema",
            name: "ccc_vision_product",
            strict: true,
            schema: PRODUCT_SCHEMA
          }
        }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("OpenAI error", response.status, data);
      return json({ error: "AI-analysen misslyckades. Försök igen." }, 502, origin);
    }

    const outputText = data.output_text || (data.output || [])
      .flatMap(item => item?.content || [])
      .find(part => part?.type === "output_text")?.text;
    if (!outputText) return json({ error: "AI:n gav inget analyssvar." }, 502, origin);

    try {
      const result = JSON.parse(outputText);
      // Fail closed: uncertain field suggestions must never reach the UI as facts.
      for (const key of ["title","description","category","brand","size","color","season","manufacturer"]) {
        const confidence = result?.fieldEvidence?.[key]?.confidence;
        if (!["high","medium"].includes(confidence)) result.fields[key] = "";
      }
      if (!["high","medium"].includes(result?.fieldEvidence?.season?.confidence)) result.summarySeason = "";
      result.priceSuggestion = 0;
      result.fields.price = "";
      return json({ result, usage: data.usage || null, model: data.model || env.OPENAI_MODEL || "" }, 200, origin);
    } catch {
      return json({ error: "AI-svaret kunde inte läsas." }, 502, origin);
    }
  }
};
