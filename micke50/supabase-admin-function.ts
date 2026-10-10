// Supabase Edge Function: micke50-admin
// Secrets: MICKE50_ADMIN_PIN (exakt 10 siffror), SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Deploy with JWT verification disabled; function validates PIN server-side.
// Keep service role key and PIN out of GitHub and browser code.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const origin='https://container13.se';
const cors={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'content-type','Content-Type':'application/json','Cache-Control':'no-store'};
const respond=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:cors});
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 if(req.method!=='POST')return respond({error:'Method not allowed'},405);
 if(req.headers.get('origin')!==origin)return respond({error:'Forbidden origin'},403);
 try{
 const {pin,action,names}=await req.json();
 const expected=Deno.env.get('MICKE50_ADMIN_PIN')||'';
 if(!/^\d{10}$/.test(expected))return respond({error:'Admin är inte konfigurerad'},503);
 const enc=new TextEncoder(),a=enc.encode(String(pin||'')),b=enc.encode(expected);
 let diff=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)diff|=(a[i]||0)^(b[i]||0);
 if(diff!==0)return respond({error:'Fel kod'},401);
 if(action==='check')return respond({ok:true});
 const supabase=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
 const bucket=supabase.storage.from('Micke50bilder');
 if(action==='list'){const {data,error}=await bucket.list('',{limit:1000,sortBy:{column:'created_at',order:'desc'}});if(error)throw error;return respond({files:(data||[]).filter(f=>f.name&&!f.name.startsWith('.')).map(f=>({name:f.name,url:bucket.getPublicUrl(f.name).data.publicUrl}))})}
 if(action==='delete'){if(!Array.isArray(names)||names.length>100||!names.length||names.some(n=>typeof n!=='string'||n.includes('/')||n==='.'||n==='..'))return respond({error:'Ogiltigt urval'},400);const {data,error}=await bucket.remove(names);if(error)throw error;return respond({deleted:data?.length||0})}
 return respond({error:'Okänd åtgärd'},400)
 }catch(e){return respond({error:'Serverfel: '+String(e?.message||e)},500)}
});