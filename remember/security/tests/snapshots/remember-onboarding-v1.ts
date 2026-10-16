import {createClient} from "npm:@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"https://container13.se","Access-Control-Allow-Headers":"authorization,apikey,content-type","Access-Control-Allow-Methods":"POST,OPTIONS"};
const send=(obj:unknown,status=200)=>new Response(JSON.stringify(obj),{status,headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store"}});
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
 if(req.method!=="POST"||req.headers.get("origin")!=="https://container13.se")return send({error:"Forbidden"},403);
 const url=Deno.env.get("SUPABASE_URL"),secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");if(!url||!secret)return send({error:"Unavailable"},503);
 let input:Record<string,unknown>;try{const raw=await req.text();if(raw.length>1800)throw Error();input=JSON.parse(raw)}catch{return send({error:"Invalid input"},400)}
 const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 const pending=db.schema("remember").from("pending_album_registrations");
 if(input.action==="stage"){
  const email=String(input.email||"").trim().toLowerCase(),title=String(input.title||"").trim(),days=Number(input.days),start=new Date(String(input.startsAt)),timezone=String(input.timezone||"Europe/Stockholm");
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||email.length>254||title.length<1||title.length>100||!Number.isInteger(days)||days<1||days>28||!Number.isFinite(start.getTime())||timezone.length>100||!/^\d{4}-\d\d-\d\dT/.test(String(input.startsAt)))return send({error:"Invalid album"},400);
  const {count,error:countError}=await pending.select("id",{count:"exact",head:true}).eq("email",email).gte("created_at",new Date(Date.now()-3600000).toISOString());
  if(countError)return send({error:"Unavailable"},503);
  if((count||0)>=5)return send({error:"Try again later"},429);
  const id=crypto.randomUUID();
  const {error}=await pending.insert({id,email,title,starts_at:start.toISOString(),days,timezone});
  return error?send({error:"Could not save request"},503):send({ok:true,id});
 }
 if(input.action==="complete"){
  const token=(req.headers.get("authorization")||"").replace(/^Bearer /,"");
  const {data:identity,error:authError}=await db.auth.getUser(token);
  if(authError||!identity.user||!identity.user.email_confirmed_at)return send({error:"Verified login required"},401);
  const email=String(identity.user.email||"").toLowerCase();
  const {data:rows,error:lookupError}=await pending.select("*").eq("email",email).is("consumed_at",null).gte("created_at",new Date(Date.now()-86400000).toISOString()).order("created_at",{ascending:false}).limit(1);
  if(lookupError)return send({error:"Unavailable"},503);
  if(!rows?.length)return send({ok:true,created:false});
  const draft=rows[0],id=draft.id,albums=db.schema("remember").from("albums");
  const {data:existing}=await albums.select("id").eq("id",id).eq("owner_user_id",identity.user.id).maybeSingle();
  if(!existing){
   const end=new Date(new Date(draft.starts_at).getTime()+draft.days*86400000);
   const {error}=await albums.insert({id,slug:"album-"+id.replace(/-/g,""),title:draft.title,owner_user_id:identity.user.id,event_timezone:draft.timezone,default_opens_at:draft.starts_at,default_closes_at:end.toISOString(),photo_limit:10});
   if(error){const {data:retry}=await albums.select("id").eq("id",id).eq("owner_user_id",identity.user.id).maybeSingle();if(!retry)return send({error:"Album creation failed"},503)}
  }
  await pending.update({consumed_at:new Date().toISOString(),album_id:id}).eq("id",id).is("consumed_at",null);
  return send({ok:true,created:true,albumId:id});
 }
 return send({error:"Invalid action"},400);
});