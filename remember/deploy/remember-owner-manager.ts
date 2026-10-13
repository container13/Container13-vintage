import {createClient} from "npm:@supabase/supabase-js@2";
const origin="https://container13.se";
const headers={"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"authorization,apikey,content-type","Access-Control-Allow-Methods":"POST,OPTIONS","Cache-Control":"no-store"};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...headers,"Content-Type":"application/json"}});
const uuid=(s:unknown)=>typeof s==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
Deno.serve(async req=>{
 if(req.headers.get("origin")&&req.headers.get("origin")!==origin)return reply({error:"Forbidden"},403);
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="POST")return reply({error:"Method not allowed"},405);
 const url=Deno.env.get("SUPABASE_URL"),secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!secret)return reply({error:"Unavailable"},503);
 const authorization=req.headers.get("authorization")||"";
 if(!/^Bearer [^ ]+$/.test(authorization))return reply({error:"Login required"},401);
 let input:Record<string,unknown>;
 try{const raw=await req.text();if(raw.length>2048)throw Error();input=JSON.parse(raw);if(!input||typeof input!=="object"||Array.isArray(input))throw Error();}catch{return reply({error:"Invalid request"},400);}
 if(!["list","deletePhoto"].includes(String(input.action)))return reply({error:"Invalid action"},400);
 const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:identity,error:identityError}=await db.auth.getUser(authorization.slice(7));
 if(identityError||!identity.user)return reply({error:"Invalid session"},401);
 const actor=identity.user.id;
 if(input.action==="list"){
  const {data,error}=await db.schema("remember").from("albums").select("id,title,created_at").eq("owner_user_id",actor).order("created_at",{ascending:false}).limit(100);
  return error?reply({error:"Could not load albums"},503):reply({ok:true,albums:data||[]});
 }
 if(!uuid(input.albumId)||!uuid(input.photoId))return reply({error:"Invalid identifiers"},400);
 const {data:album,error:albumError}=await db.schema("remember").from("albums").select("id").eq("id",input.albumId).eq("owner_user_id",actor).maybeSingle();
 if(albumError)return reply({error:"Could not verify album ownership"},503);
 if(!album)return reply({error:"Forbidden"},403);
 const {data:photo,error:photoError}=await db.schema("remember").from("album_photos").select("id,object_key").eq("album_id",album.id).eq("id",input.photoId).eq("state","ready").maybeSingle();
 if(photoError)return reply({error:"Could not load photo"},503);
 if(!photo)return reply({error:"Photo not found"},404);
 const {error:storageError}=await db.storage.from("remember-private-photos").remove([photo.object_key]);
 if(storageError)return reply({error:"Could not delete photo file"},503);
 const {error:deleteError}=await db.schema("remember").from("album_photos").delete().eq("id",photo.id).eq("album_id",album.id);
 if(deleteError)return reply({error:"Photo file deleted but database update failed; contact support"},503);
 return reply({ok:true,deleted:true});
});
