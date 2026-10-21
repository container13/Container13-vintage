import {createClient} from "npm:@supabase/supabase-js@2";
const origin="https://container13.se";
const headers={"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"authorization,apikey,content-type","Access-Control-Allow-Methods":"POST,OPTIONS","Cache-Control":"no-store","Vary":"Origin"};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...headers,"Content-Type":"application/json"}});
const hex=(b:Uint8Array)=>Array.from(b,x=>x.toString(16).padStart(2,"0")).join("");
const b64=(b:Uint8Array)=>btoa(String.fromCharCode(...b)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
const unb64=(s:string)=>Uint8Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0));
const validId=(v:unknown)=>typeof v==="string"&&/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(v);
async function keyFromSecret(secret:string){const raw=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),"HKDF",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"HKDF",hash:"SHA-256",salt:new TextEncoder().encode("container13-remember-link-vault-v1"),info:new TextEncoder().encode("aes-gcm-token")},raw,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);}
async function seal(key:CryptoKey,token:string,album:string){const iv=crypto.getRandomValues(new Uint8Array(12));const data=new TextEncoder().encode(token);const encrypted=await crypto.subtle.encrypt({name:"AES-GCM",iv,additionalData:new TextEncoder().encode(album)},key,data);return b64(iv)+"."+b64(new Uint8Array(encrypted));}
async function unseal(key:CryptoKey,cipher:string,album:string){const [a,b]=cipher.split(".");if(!a||!b)throw Error("Invalid ciphertext");const decoded=await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(a),additionalData:new TextEncoder().encode(album)},key,unb64(b));return new TextDecoder().decode(decoded);}
Deno.serve(async req=>{
 if(req.headers.get("origin")&&req.headers.get("origin")!==origin)return reply({error:"Forbidden"},403);
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="POST")return reply({error:"Method not allowed"},405);
 const url=Deno.env.get("SUPABASE_URL"),secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!secret)return reply({error:"Unavailable"},503);
 const bearer=req.headers.get("authorization")||"";
 if(!/^Bearer [^ ]+$/.test(bearer))return reply({error:"Login required"},401);
 let input:Record<string,unknown>;
 try{const raw=await req.text();if(raw.length>2048)throw Error();input=JSON.parse(raw);if(!input||typeof input!=="object"||Array.isArray(input))throw Error();}catch{return reply({error:"Invalid request"},400);}
 if(!validId(input.albumId)||!["get","replace"].includes(String(input.action)))return reply({error:"Invalid request"},400);
 const album=input.albumId as string,db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:identity,error:identityError}=await db.auth.getUser(bearer.slice(7));
 if(identityError||!identity.user)return reply({error:"Invalid login"},401);
 const actor=identity.user.id;
 const {data:owned,error:ownerError}=await db.schema("remember").from("albums").select("id").eq("id",album).eq("owner_user_id",actor).maybeSingle();
 if(ownerError)return reply({error:"Could not verify ownership"},503);
 if(!owned)return reply({error:"Forbidden"},403);
 const {data:vault,error:readError}=await db.schema("remember").from("guest_link_vault").select("ciphertext").eq("album_id",album).maybeSingle();
 if(readError)return reply({error:"Link storage unavailable"},503);
 const existing=vault?.ciphertext||null;
 const encryptionKey=await keyFromSecret(secret);
 if(input.action==="get"){
  if(!existing)return reply({ok:true,available:false,needsReplacement:true});
  try{
   const token=await unseal(encryptionKey,existing,album);
   const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));
   const {data:link,error:linkError}=await db.schema("remember").from("guest_links").select("album_id").eq("album_id",album).eq("token_sha256","\\x"+hex(new Uint8Array(digest))).is("revoked_at",null).maybeSingle();
   if(linkError||!link)return reply({ok:true,available:false,needsReplacement:true});
   return reply({ok:true,available:true,token});
  }catch{return reply({ok:true,available:false,needsReplacement:true});}
 }
 const token=b64(crypto.getRandomValues(new Uint8Array(32)));
 const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));
 const {data:oldLink,error:oldError}=await db.schema("remember").from("guest_links").select("album_id").eq("album_id",album).maybeSingle();
 if(oldError)return reply({error:"Link lookup failed"},503);
 const {error:writeError}=oldLink?await db.schema("remember").from("guest_links").update({token_sha256:"\\x"+hex(new Uint8Array(digest)),created_by:actor,created_at:new Date().toISOString(),rotated_at:new Date().toISOString(),revoked_at:null}).eq("album_id",album):await db.schema("remember").from("guest_links").insert({album_id:album,token_sha256:"\\x"+hex(new Uint8Array(digest)),created_by:actor});
 if(writeError)return reply({error:"Could not replace link"},503);
 const cipher=await seal(encryptionKey,token,album);
 const {error:saveError}=await db.schema("remember").from("guest_link_vault").upsert({album_id:album,ciphertext:cipher},{onConflict:"album_id"});
 if(saveError)return reply({error:"New link created but could not be stored; contact support",token},503);
 return reply({ok:true,available:true,token,replaced:true});
});
