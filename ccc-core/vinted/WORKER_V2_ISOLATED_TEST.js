// CCC Vinted V2 — ISOLATED test Worker, not deployed by current wrangler.
// Deploy as a separate Worker with OPENAI_API_KEY and VINTED_TEST_TOKEN secrets.
// Never add either secret to GitHub, browser code or logs.
const styles={
  neutral:"Write a neutral, clear Swedish secondhand listing, 1-2 factual sentences. No sales pitch.",
  selling:"Write a genuinely appealing Swedish Vinted listing like a good human seller. Warm, conversational, confident, with concrete verified details. Do not sound like a catalogue. 2-3 natural sentences. Vary sentence openings and adjectives between garments; avoid stock phrases such as snygg, fin, enkel, lättmatchad, passar till mycket unless unusually apt. Prefer a specific observed detail over generic styling claims.",
  max:"Write a bold, lively Swedish vintage/streetwear listing with more personality and energy than selling. Strong opening, punchy rhythm, confident positive wording. 2-3 natural sentences. Sound like an actual secondhand seller, not a fashion brand or AI. Avoid abstract fashion jargon, poetic metaphors and stock phrases such as självsäker energi, streetig look, avskalad känsla, streetwear-känsla, clean, vibe. Make the item interesting through its real details, not invented benefits. Do not repeat selling style wording. Use ordinary Swedish capitalization, never ALL-CAPS headings or shouty openings. Avoid exclamation marks unless truly natural (prefer none). No slogan-like first sentence. Keep the voice lively through specific, grounded observations and varied sentence rhythm, without claiming unverified comfort, quality, fit, condition or versatility."
};
const schema={type:"object",additionalProperties:false,required:["title","description","details"],properties:{title:{type:"string"},description:{type:"string"},details:{type:"string"}}};
const fixtures=[
{id:"lee",title:"Lee jeans",description:"Ljusblå tvättad denim, raka ben, fem fickor och uppvikta benslut.",details:"Märke: Lee\nTyp: Jeans\nFärg: Ljusblå"},
{id:"jacket",title:"Svart jacka",description:"Svart jacka med dragkedja framtill och två synliga sidofickor.",details:"Typ: Jacka\nFärg: Svart"},
{id:"knit",title:"Grön stickad tröja",description:"Grön stickad tröja med rund hals och ribbade muddar.",details:"Typ: Tröja\nFärg: Grön"},
{id:"sneakers",title:"Vita sneakers",description:"Vita sneakers med snörning och ljus yttersula.",details:"Typ: Sneakers\nFärg: Vit"}
];
export default {
async fetch(request,env){
  const origin=request.headers.get("Origin")||"";
  const allowed=["https://container13.se","https://www.container13.se"].includes(origin);
  const cors=allowed?{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"Authorization, Content-Type","Access-Control-Allow-Methods":"POST, OPTIONS","Vary":"Origin"}:{};
  if(request.method==="OPTIONS")return new Response(null,{status:allowed?204:403,headers:cors});
  if(request.method!=="POST")return new Response("Not found",{status:404});
  const token=request.headers.get("Authorization")||"";
  if(!env.VINTED_TEST_TOKEN||token!=="Bearer "+env.VINTED_TEST_TOKEN)return new Response("Unauthorized",{status:401});
  if(!env.OPENAI_API_KEY)return new Response("AI secret missing",{status:503});
  // Optional manual garment facts for editorial review, isolated from production.
  let items = fixtures;
  const body = await request.text();
  if (body.trim()) {
    let payload;
    try { payload = JSON.parse(body); }
    catch { return new Response("Invalid JSON", {status:400}); }
    if (!payload || !Array.isArray(payload.items) || payload.items.length < 1 || payload.items.length > 4)
      return new Response("Expected 1 to 4 items", {status:400});
    items = [];
    for (const item of payload.items) {
      if (!item || ["title","description","details"].some(k => typeof item[k] !== "string" || !item[k].trim() || item[k].length > 1500))
        return new Response("Invalid item fields", {status:400});
      items.push({id:"real-" + (items.length+1),title:item.title,description:item.description,details:item.details});
    }
  }
  const output=[];
  for(const item of items){
    const samples={};
    for(const [style,guide] of Object.entries(styles)){
      try{
        const instruction=guide+" Use ONLY the supplied garment facts. No invented age, condition, fabric, measurements, authenticity, fit, rarity or provenance. Subjective positive words are allowed. Short searchable title; preserve details. Return JSON.";
        const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:env.OPENAI_MODEL||"gpt-5.6-terra",store:false,reasoning:{effort:"low"},input:[{role:"user",content:[{type:"input_text",text:instruction+"\n"+JSON.stringify(item)}]}],text:{format:{type:"json_schema",name:"vinted_v2",strict:true,schema}}})});
        const data=await response.json();
        if(!response.ok)throw Error("AI status "+response.status);
        const raw=data.output_text||(data.output||[]).flatMap(x=>x.content||[]).find(x=>x.type==="output_text")?.text;
        samples[style]=JSON.parse(raw);
      }catch(e){samples[style]={error:String(e)};}
    }
    output.push({fixture:item.id,styles:samples});
  }
  return new Response(JSON.stringify({status:"review_required",results:output}),{headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...cors}});
}
};
