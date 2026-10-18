// Shared Supabase authentication for Remember. Never log or expose credentials.
const PROD={url:'https://wykvztfmfbboxiqvuvwr.supabase.co',key:'sb_publishable_qOSBb7U6TGnPQ8ypyYRLGg_GtYrraoG',storageKey:'container13-remember-auth-v2'};
const TEST={url:'https://kauxrvshxgpbvptdwhog.supabase.co',key:'sb_publishable_iLKTdBYdh2w5ALhEyFtW8A_V8Gujyam',storageKey:'container13-remember-TEST-auth-v1'};
export async function createRememberAuth({test=false,detectSessionInUrl=false}={}){
 const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
 const config=test?TEST:PROD;
 const client=createClient(config.url,config.key,{auth:{storage:localStorage,storageKey:config.storageKey,persistSession:true,autoRefreshToken:true,detectSessionInUrl,flowType:'implicit'}});
 return client;
}
export async function restoreRememberSession(client,{retries=2}={}){
 let result,storagePresent=false,storageAvailable=true;
 try{storagePresent=!!localStorage.getItem(client.auth.storageKey||PROD.storageKey)}catch{storageAvailable=false}
 for(let i=0;i<=retries;i++){
  try{result=await client.auth.getSession();if(result.data?.session)return {session:result.data.session,state:'authenticated'};if(!result.error)return {session:null,state:storageAvailable?'missing':'storage-unavailable'};}
  catch(e){result={error:e};}
  if(i<retries)await new Promise(resolve=>setTimeout(resolve,350*(i+1)));
 }
 return {session:null,state:storageAvailable?(storagePresent?'restore-failed':'missing'):'storage-unavailable'};
}
