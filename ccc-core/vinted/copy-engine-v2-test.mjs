// Isolated Vinted copy engine V2 evaluation. Never imported by the live app.
// Run: OPENAI_API_KEY=... node ccc-core/vinted/copy-engine-v2-test.mjs
// No release, deploy or production worker changes.
const styles = {
  neutral: "Write a factual Vinted listing. One or two short sentences. No sales language.",
  selling: "Write like a skilled human Vinted seller: warm, naturally appealing, specific. Pick the two most attractive VERIFIED details. Two or three varied sentences; avoid catalogue voice.",
  max: "Write like a confident streetwear/vintage seller: punchy, vivid and distinctive, with a compelling opening and concise follow-through. More energy than selling, but no invented hype or padded text."
};
const fixtures = [
  {id:"lee-jeans",title:"Lee jeans",description:"Ljusblå tvättad denim, raka ben, fem fickor, uppvikta benslut.",details:"Märke: Lee\nKategori: Jeans\nFärg: Ljusblå"},
  {id:"jacket",title:"Svart jacka",description:"Svart jacka med dragkedja fram och två synliga sidofickor.",details:"Kategori: Jacka\nFärg: Svart"},
  {id:"knit",title:"Grön stickad tröja",description:"Grön stickad tröja med rund hals och ribbade muddar.",details:"Kategori: Tröja\nFärg: Grön"},
  {id:"shoes",title:"Vita sneakers",description:"Vita sneakers med snörning och ljus yttersula.",details:"Kategori: Sneakers\nFärg: Vit"}
];
const schema={type:"object",additionalProperties:false,required:["title","description","details"],properties:{title:{type:"string"},description:{type:"string"},details:{type:"string"}}};
const apiKey=process.env.OPENAI_API_KEY;
if(!apiKey){console.error("OPENAI_API_KEY missing; no test performed.");process.exit(2);}
const results=[];
for(const item of fixtures){
  const byStyle={};
  for(const [style,guide] of Object.entries(styles)){
    const instruction="Write one ready-to-copy Swedish Vinted listing. "+guide+
      " Use only the supplied facts; never invent condition, material, age, measurements, authenticity, provenance, fit or rarity. Subjective positive language is allowed, but no unsupported factual claims. Preserve provided details. Title searchable and concise. Return JSON.";
    try{
      const res=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5.6-terra",store:false,reasoning:{effort:"low"},input:[{role:"user",content:[{type:"input_text",text:instruction+"\n"+JSON.stringify(item)}]}],text:{format:{type:"json_schema",name:"vinted_v2_listing",strict:true,schema}}})});
      const data=await res.json();if(!res.ok)throw Error(JSON.stringify(data).slice(0,300));
      const output=data.output_text||(data.output||[]).flatMap(x=>x.content||[]).find(x=>x.type==="output_text")?.text;
      byStyle[style]=JSON.parse(output);
    }catch(e){byStyle[style]={error:String(e)};}
  }
  const descriptions=Object.values(byStyle).map(x=>x.description||"");
  const unique=new Set(descriptions.map(x=>x.toLowerCase().trim())).size===3;
  const present=descriptions.every(Boolean);
  const result={fixture:item.id,distinct:unique,allPresent:present,styles:byStyle};
  results.push(result);
  console.log(JSON.stringify(result,null,2));
}
const passed=results.every(x=>x.distinct&&x.allPresent);
console.log("AUTOMATED SMOKE CHECK: "+(passed?"PASS":"FAIL")+". Human editorial and factual review still required.");
process.exit(passed?0:1);
