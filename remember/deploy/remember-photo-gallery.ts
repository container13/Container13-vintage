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
 let actorId:string|null=null,tokenHash:string|null=null;
 if(owner){
  const bearer=req.headers.get("authorization")||"";
  if(!/^Bearer [^ ]+$/.test(bearer))return reply({error:"Login required"},401);
  const {data:user,error:userError}=await db.auth.getUser(bearer.slice(7));
  if(userError||!user.user)return reply({error:"Invalid session"},401);
  actorId=user.user.id;
 }else{
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(input.token as string));
  tokenHash="\\x"+hex(new Uint8Array(digest));
 }
 const {data:result,error:galleryError}=await db.rpc("remember_photo_gallery_read",{p_actor:actorId,p_album_id:owner?input.albumId:null,p_token_hash:tokenHash});
 if(galleryError)return reply({error:"Gallery unavailable"},503);
 if(!result?.authorized)return reply({error:"Forbidden"},403);
 const photos=result.photos||[];
 const paths=photos.map((p:{objectKey:string})=>p.objectKey);
 if(!paths.length)return reply({ok:true,photos:[]});
 const {data:urls,error:urlsError}=await db.storage.from("remember-private-photos").createSignedUrls(paths,120);
 if(urlsError||!urls)return reply({error:"Image access unavailable"},503);
 return reply({ok:true,photos:photos.map((p:{id:string,createdAt:string},i:number)=>({id:p.id,createdAt:p.createdAt,url:urls[i]?.signedUrl||null})).filter(p=>p.url)});
});
