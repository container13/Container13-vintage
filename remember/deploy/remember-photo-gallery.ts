import { createClient } from "npm:@supabase/supabase-js@2";
const ORIGIN=Deno.env.get("REMEMBER_ALLOWED_ORIGIN")||"https://container13.se";
const headers={"Access-Control-Allow-Origin":ORIGIN,"Access-Control-Allow-Headers":"authorization,content-type,apikey","Access-Control-Allow-Methods":"POST,OPTIONS","Cache-Control":"no-store","Vary":"Origin"};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...headers,"Content-Type":"application/json"}});
const uuid=(x:unknown)=>typeof x==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x);
const hex=(bytes:Uint8Array)=>Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
Deno.serve(async req=>{
 if(req.headers.get("origin")!==ORIGIN)return reply({error:"Forbidden"},403);
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="POST")return reply({error:"Method not allowed"},405);
 const url=Deno.env.get("SUPABASE_URL"),key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!key)return reply({error:"Unavailable"},503);
 let input:Record<string,unknown>;
 try{const raw=await req.text();if(raw.length>4096) return reply({error:"Too large"},413);input=JSON.parse(raw);if(!input||Array.isArray(input)||typeof input!=="object")throw Error();}catch{return reply({error:"Invalid JSON"},400);}
 const owner=uuid(input.albumId),guest=typeof input.token==="string"&&/^[A-Za-z0-9_-]{43}$/.test(input.token);
 if(owner===guest)return reply({error:"Invalid authorization"},400);
 const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 let albumId:string;
 if(owner){
  const bearer=req.headers.get("authorization")||"";
  if(!/^Bearer [^ ]+$/.test(bearer))return reply({error:"Login required"},401);
  const {data:user,error:userError}=await db.auth.getUser(bearer.slice(7));
  if(userError||!user.user)return reply({error:"Invalid session"},401);
  const {data:role,error:roleError}=await db.schema("remember").from("webmasters").select("user_id").eq("user_id",user.user.id).maybeSingle();
  if(roleError)return reply({error:"Authorization unavailable"},503);
  if(!role)return reply({error:"Forbidden"},403);
  albumId=input.albumId as string;
 }else{
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(input.token as string));
  const {data:link,error:linkError}=await db.schema("remember").from("guest_links").select("album_id").eq("token_sha256","\\x"+hex(new Uint8Array(digest))).is("revoked_at",null).maybeSingle();
  if(linkError)return reply({error:"Authorization unavailable"},503);
  if(!link)return reply({error:"Invalid link"},403);
  albumId=link.album_id;
 }
 const {data:photos,error:photosError}=await db.schema("remember").from("album_photos").select("id,object_key,created_at").eq("album_id",albumId).eq("state","ready").order("created_at",{ascending:false}).order("id",{ascending:false}).limit(100);
 if(photosError)return reply({error:"Gallery unavailable"},503);
 const paths=(photos||[]).map(p=>p.object_key);
 if(!paths.length)return reply({ok:true,photos:[]});
 const {data:urls,error:urlsError}=await db.storage.from("remember-private-photos").createSignedUrls(paths,120);
 if(urlsError||!urls)return reply({error:"Image access unavailable"},503);
 return reply({ok:true,photos:(photos||[]).map((p,i)=>({id:p.id,createdAt:p.created_at,url:urls[i]?.signedUrl||null})).filter(p=>p.url)});
});
