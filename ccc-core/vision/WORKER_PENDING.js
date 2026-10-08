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
    if (body?.action === "translate_listing" || body?.action === "rewrite_listing") {
      const rewrite=body.action==="rewrite_listing";
      const title = typeof body.title === "string" ? body.title.slice(0, 300) : "";
      const description = typeof body.description === "string" ? body.description.slice(0, 3000) : "";
      const details = typeof body.details === "string" ? body.details.slice(0, 1800) : "";
      if (!title && !description) return json({ error: "Annonstext saknas." }, 400, origin);
      const schema = { type: "object", additionalProperties: false, required: ["title","description","details"], properties: { title:{type:"string"},description:{type:"string"},details:{type:"string"} } };
      const tone=["neutral","selling","max"].includes(body.style)?body.style:"selling";
      const recent=Array.isArray(body.recent)?body.recent.slice(-8).map(x=>String(x).slice(0,160)):[];
      const styleGuide={
        neutral:"Neutral is a concise, matter-of-fact classified ad. Exactly 1-3 factual sentences, no hooks, styling advice or sales pitch.",
        selling:"SELLING must feel like a sharp independent vintage seller wrote it, not a catalogue. Write 3-5 compact sentences (roughly 45-70 words). Lead with the garment's strongest REAL distinguishing visual characteristic, make the actual cut/wash/details desirable through precise language, and finish confidently. Conversational, specific, stylish and natural; no generic 'easy to match' claims or bland outfit suggestions.",
        max:"MAX is a distinct, bolder editorial streetwear voice, NOT a padded SELLING text. Write 4-6 punchy sentences (roughly 60-90 words). Open with a confident, memorable line rooted in the garment's actual look; use stronger rhythm, contrasting sentence lengths and sharper vocabulary. Convey aesthetic attitude without pretending the garment is rare, vintage, premium or in any particular condition. No obligatory styling tip, no fake hype, no exclamation-mark overload."
      };
      const instruction=rewrite?(
        "Create ONE ready-to-copy Vinted listing in "+(body.language==="en"?"idiomatic English":"idiomatic contemporary Swedish")+". Tone: "+tone+". "+
        styleGuide[tone]+" "+
        "TITLE: concise and searchable: brand + item type + color + one verified distinctive detail when available. "+
        "DESCRIPTION: write about THIS garment, not generic fashion. Prioritize concrete verified visual details. Distinct styles must differ strongly in voice, opening, rhythm and ambition. "+
        "BAN ALL CLICHES AND FILLER, including: lättmatchad, vardagens alla planer, fina tillsammans med, klassisk och tidlös, fungerar till allt, ett självklart val, den där känslan, garderoben, rena linjer, tydlig detalj, karaktär i varje söm, avslappnad känsla, streetlook, redo att ta plats, lättburen, ger outfiten, håller looken skarp, perfekt till, ett par med attityd, den här gör jobbet. "+
        "No repetitive feature lists in prose, no duplicated opening formulas. No forced styling advice. Avoid generic adjectives unless backed by a visible feature. "+
        "FACT SAFETY: use ONLY facts supported by supplied title, description and details. Do not invent wear, age, condition, measurements, fit, fabric, rarity, authenticity, construction or styling features. Distinguish a washed appearance from actual wear. "+
        "DETAILS: preserve only provided key-value facts; never add new fields. "+
        "Avoid these recent openings: "+JSON.stringify(recent)+". Return JSON only."
      ):"Translate this reviewed Swedish clothing listing into fluent natural English. Preserve every fact exactly, do not invent condition, era, material or measurements. Keep details as translated key-value lines. Return JSON only.";
      const generate=async(extra="")=>{
        const response=await fetch("https://api.openai.com/v1/responses",{
          method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},
          body:JSON.stringify({model:env.OPENAI_MODEL||"gpt-5.6-terra",store:false,reasoning:{effort:"low"},
            input:[{role:"user",content:[{type:"input_text",text:instruction+"\\n"+JSON.stringify({title,description,details})+(extra?"\\nREVISION REQUIRED: "+extra:"")}]}],
            text:{format:{type:"json_schema",name:"listing_translation",strict:true,schema}}})
        });
        const data=await response.json().catch(()=>({}));
        if(!response.ok)throw Error("AI kunde inte skriva annonstexten.");
        const output=data.output_text||(data.output||[]).flatMap(item=>item?.content||[]).find(part=>part?.type==="output_text")?.text;
        return JSON.parse(output);
      };
      const validate=(item)=>{
        if(!rewrite)return "";
        const d=String(item?.description||""),t=String(item?.title||"");
        if(!d.trim()||!t.trim())return "Title and description must be present.";
        const source=(title+" "+description+" "+JSON.stringify(details)).toLowerCase();
        const output=(t+" "+d).toLowerCase();
        for(const term of ["knappgylf","kontrastsöm","nyskick","oanvänd"])if(output.includes(term)&&!source.includes(term))return "Unverified product detail: "+term;
        return "";
      };
      try{
        const first=await generate();
        const issue=validate(first);
        if(!issue)return json(rewrite?{listing:first}:{translation:first},200,origin);
        let improved;
        try{improved=await generate(issue+" Remove unsupported facts and write naturally.");}catch{}
        if(improved&&!validate(improved))return json(rewrite?{listing:improved}:{translation:improved},200,origin);
        return json({error:"AI-texten innehåller en osäker uppgift. Försök igen."},422,origin);
      }catch{return json({error:"AI kunde inte skapa annonstexten. Försök igen."},502,origin);}

    }
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
