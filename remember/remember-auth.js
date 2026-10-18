// Shared Supabase authentication for Remember. Never log or expose credentials.
const PROD={url:'https://wykvztfmfbboxiqvuvwr.supabase.co',key:'sb_publishable_qOSBb7U6TGnPQ8ypyYRLGg_GtYrraoG',storageKey:'container13-remember-auth-v2'};
const TEST={url:'https://kauxrvshxgpbvptdwhog.supabase.co',key:'sb_publishable_iLKTdBYdh2w5ALhEyFtW8A_V8Gujyam',storageKey:'container13-remember-TEST-auth-v1'};
export async function createRememberAuth({test=false,detectSessionInUrl=false}={}){
 const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
 const config=test?TEST:PROD;
 const client=createClient(config.url,config.key,{auth:{storage:localStorage,storageKey:config.storageKey,persistSession:true,autoRefreshToken:true,detectSessionInUrl,flowType:'implicit'}});
 return client;
}
// Diagnostic markers contain no personal data or tokens. They help distinguish
// Safari storage loss from a Supabase session that was not restored.
const markerKey='remember-auth-diagnostic-v1';
export function rememberAuthDiagnostic({test=false}={}){
 const key=(test?TEST:PROD).storageKey;
 let marker='unavailable',authRecord='unavailable',tabMarker='unavailable';
 try{marker=localStorage.getItem(markerKey)?'present':'absent';authRecord=localStorage.getItem(key)?'present':'absent';}catch{}
 try{tabMarker=sessionStorage.getItem(markerKey)?'present':'absent';}catch{}
 return {marker,authRecord,tabMarker};
}
export function markRememberAuthDiagnostic(){
 try{localStorage.setItem(markerKey,'1');}catch{}
 try{sessionStorage.setItem(markerKey,'1');}catch{}
}
export async function restoreRememberSession(client,{retries=2,test=false}={}){
 const before=rememberAuthDiagnostic({test});
 let result;
 for(let i=0;i<=retries;i++){
  try{
   result=await client.auth.getSession();
   if(result.data?.session){markRememberAuthDiagnostic();return {session:result.data.session,state:'authenticated',before};}
   if(!result.error)return {session:null,state:before.authRecord==='absent'?'missing':'invalid-or-cleared',before};
  }catch(e){result={error:e};}
  if(i<retries)await new Promise(resolve=>setTimeout(resolve,350*(i+1)));
 }
 return {session:null,state:'restore-failed',before};
}
