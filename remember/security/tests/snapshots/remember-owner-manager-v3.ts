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
 if(!["list","deletePhoto","create","renameAlbum","deleteAlbum"].includes(String(input.action)))return reply({error:"Invalid action"},400);
 const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:identity,error:identityError}=await db.auth.getUser(authorization.slice(7));
 if(identityError||!identity.user)return reply({error:"Invalid session"},401);
 const actor=identity.user.id;
 if(input.action==="create"){
  const title=typeof input.title==="string"?input.title.trim():"";
  const days=input.days,startsAt=input.startsAt,timezone=input.timezone;
  const start=new Date(String(startsAt)),end=new Date(start.getTime()+Number(days)*86400000);
  if(!uuid(input.requestId)||!title||title.length>100||!Number.isInteger(days)||days<1||days>28||
    typeof startsAt!=="string"||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(startsAt)||
    !Number.isFinite(start.getTime())||!Number.isFinite(end.getTime())||
    typeof timezone!=="string"||timezone.length<1||timezone.length>100||
    Object.keys(input).some(k=>!["action","requestId","title","startsAt","days","timezone"].includes(k)))
    return reply({error:"Invalid album details"},400);
  if(!identity.user.email_confirmed_at)return reply({error:"Email verification required"},403);
  const albums=db.schema("remember").from("albums");
  const {data:existing,error:lookupError}=await albums.select("id,title,default_opens_at,default_closes_at").eq("id",input.requestId).maybeSingle();
  if(lookupError)return reply({error:"Album lookup failed"},503);
  if(existing){
    const {data:owned}=await albums.select("id").eq("id",input.requestId).eq("owner_user_id",actor).maybeSingle();
    return owned?reply({ok:true,album:existing,created:false}):reply({error:"Request conflict"},409);
  }
  const slug="album-"+String(input.requestId).replace(/-/g,"");
  const {data:album,error:insertError}=await albums.insert({
    id:input.requestId,slug,title,owner_user_id:actor,event_timezone:timezone,
    default_opens_at:start.toISOString(),default_closes_at:end.toISOString(),photo_limit:10
  }).select("id,title,default_opens_at,default_closes_at").single();
  if(insertError){
    if(insertError.code==="23505"){
      const {data:retry}=await albums.select("id,title,default_opens_at,default_closes_at").eq("id",input.requestId).eq("owner_user_id",actor).maybeSingle();
      if(retry)return reply({ok:true,album:retry,created:false});
    }
    return reply({error:"Could not create album"},503);
  }
  return reply({ok:true,album,created:true});
 }
 if(input.action==="list"){
  const {data,error}=await db.schema("remember").from("albums").select("id,title,created_at").eq("owner_user_id",actor).order("created_at",{ascending:false}).limit(100);
  return error?reply({error:"Could not load albums"},503):reply({ok:true,albums:data||[]});
 }
 if(input.action==="renameAlbum"||input.action==="deleteAlbum"){
  if(!uuid(input.albumId))return reply({error:"Invalid album ID"},400);
  const albums=db.schema("remember").from("albums");
  const {data:album,error:lookupError}=await albums.select("id,title").eq("id",input.albumId).eq("owner_user_id",actor).maybeSingle();
  if(lookupError)return reply({error:"Could not verify album ownership"},503);
  if(!album)return reply({error:"Forbidden"},403);
  if(input.action==="renameAlbum"){
    const title=typeof input.title==="string"?input.title.trim():"";
    if(!title||title.length>100)return reply({error:"Invalid album name"},400);
    const {error}=await albums.update({title}).eq("id",album.id).eq("owner_user_id",actor);
    return error?reply({error:"Could not rename album"},503):reply({ok:true,title});
  }
  if(input.confirmTitle!==album.title)return reply({error:"Album name confirmation does not match"},400);
  const photos=db.schema("remember").from("album_photos");
  const {data:allPhotos,error:photoLookupError}=await photos.select("id,object_key").eq("album_id",album.id).limit(1000);
  if(photoLookupError)return reply({error:"Could not inspect album photos"},503);
  if((allPhotos||[]).length===1000)return reply({error:"Too many photos for safe deletion; contact support"},409);
  const keys=(allPhotos||[]).map(p=>p.object_key).filter(Boolean);
  for(let i=0;i<keys.length;i+=100){
    const {error}=await db.storage.from("remember-private-photos").remove(keys.slice(i,i+100));
    if(error)return reply({error:"Photo storage cleanup failed; retry deletion"},503);
  }
  for(const table of ["album_photos","schedule_audit","guest_link_vault","guest_links"]){
    const {error}=await db.schema("remember").from(table).delete().eq("album_id",album.id);
    if(error)return reply({error:"Album cleanup incomplete; retry deletion"},503);
  }
  const {data:deleted,error:deleteError}=await albums.delete().eq("id",album.id).eq("owner_user_id",actor).select("id");
  if(deleteError||!deleted?.length)return reply({error:"Album removal incomplete; retry deletion"},503);
  return reply({ok:true,deleted:true});
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
