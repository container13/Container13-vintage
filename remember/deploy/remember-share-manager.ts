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
 const {data:existing,error:readError}=await db.rpc("remember_guest_link_vault_read",{p_actor:actor,p_album:album});
 if(readError)return reply({error:"Link storage unavailable"},503);
 // A null vault entry does not prove authorization. Check ownership and webmaster role server-side.
 const {data:authorization,error:authorizationError}=await db.rpc("remember_photo_gallery_read",{p_actor:actor,p_album_id:album,p_token_hash:null});
 if(authorizationError||!authorization?.authorized)return reply({error:"Forbidden"},403);
 const encryptionKey=await keyFromSecret(secret);
 if(input.action==="get"){
  if(!existing)return reply({ok:true,available:false,needsReplacement:true});
  try{
   const token=await unseal(encryptionKey,existing,album);
   const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));
   const {data:link}=await db.rpc("remember_guest_link_matches",{p_album:album,p_token_hash:"\\x"+hex(new Uint8Array(digest))});
   if(link!==true)return reply({ok:true,available:false,needsReplacement:true});
   return reply({ok:true,available:true,token});
  }catch{return reply({ok:true,available:false,needsReplacement:true});}
 }
 const token=b64(crypto.getRandomValues(new Uint8Array(32)));
 const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));
 const {data:written,error:writeError}=await db.rpc("remember_webmaster_guest_link_write",{p_actor:actor,p_album:album,p_action:"rotate",p_token_hash:"\\x"+hex(new Uint8Array(digest))});
 if(writeError||!written?.success)return reply({error:"Could not replace link"},409);
 const cipher=await seal(encryptionKey,token,album);
 const {data:saved,error:saveError}=await db.rpc("remember_guest_link_vault_save",{p_actor:actor,p_album:album,p_ciphertext:cipher});
 if(saveError||saved!==true)return reply({error:"New link created but could not be stored; contact webmaster",token},503);
 return reply({ok:true,available:true,token,replaced:true});
});
