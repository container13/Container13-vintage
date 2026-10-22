// Guest modes candidate 0.1.162. Requires reviewed SQL installation before deployment.
import {createClient} from "npm:@supabase/supabase-js@2.118.0";
const cors={"Access-Control-Allow-Origin":"https://container13.se","Access-Control-Allow-Headers":"authorization,apikey,content-type","Access-Control-Allow-Methods":"POST,OPTIONS"};
const send=(obj:unknown,status=200)=>new Response(JSON.stringify(obj),{status,headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store","X-Remember-Version":"0.1.162"}});
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
 if(req.method!=="POST"||req.headers.get("origin")!=="https://container13.se")return send({error:"Forbidden"},403);
 const url=Deno.env.get("SUPABASE_URL"),secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");if(!url||!secret)return send({error:"Unavailable"},503);
 let input:Record<string,unknown>;try{const raw=await req.text();if(raw.length>1800)throw Error();input=JSON.parse(raw);if(!input||typeof input!=="object"||Array.isArray(input))throw Error();}catch{return send({error:"Invalid input"},400)}
 const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 const pending=db.schema("remember").from("pending_album_registrations");
 if(input.action==="stage"){
  const email=String(input.email||"").trim().toLowerCase(),title=String(input.title||"").trim(),days=Number(input.days),start=new Date(String(input.startsAt)),timezone=String(input.timezone||"Europe/Stockholm");
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||email.length>254||title.length<1||title.length>100||!Number.isInteger(days)||days<1||days>28||!Number.isFinite(start.getTime())||timezone.length>100||!/^\d{4}-\d\d-\d\dT/.test(String(input.startsAt)))return send({error:"Invalid album"},400);
  const {count,error:countError}=await pending.select("id",{count:"exact",head:true}).eq("email",email).gte("created_at",new Date(Date.now()-3600000).toISOString());
  if(countError)return send({error:"Unavailable"},503);
  if((count||0)>=5)return send({error:"Try again later"},429);
  const mode=input.guestMode===undefined?"open":input.guestMode;
  if(mode!=="open"&&mode!=="reviewed")return send({error:"Invalid guest mode"},400);
  const id=crypto.randomUUID();
  const {error}=await pending.insert({id,email,title,starts_at:start.toISOString(),days,timezone,guest_mode:mode});
  return error?send({error:"Could not save request"},503):send({ok:true,id});
 }
 if(input.action==="complete"){
  const token=(req.headers.get("authorization")||"").replace(/^Bearer /,"");
  const {data:identity,error:authError}=await db.auth.getUser(token);
  if(authError||!identity.user||!identity.user.email_confirmed_at)return send({error:"Verified login required"},401);
  if(input.requestId!==undefined&&!(typeof input.requestId==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)))return send({error:"Invalid request ID"},400);
  const {data:result,error}=await db.rpc("remember_complete_album_registration",{p_actor:identity.user.id,p_request_id:input.requestId??null});
  if(error)return send({error:"Album completion unavailable"},error.code==="42501"?403:error.code==="22023"||error.code==="23505"?409:503);
  return send(result);
 }
 return send({error:"Invalid action"},400);
});