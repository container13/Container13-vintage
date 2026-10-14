// Server-confirmed UI visibility only. Protected endpoints still authorize every action.
export async function checkRememberWebmaster(session) {
 if(!session?.access_token)return false;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
 try {
  const response=await fetch('https://wykvztfmfbboxiqvuvwr.supabase.co/functions/v1/remember-webmaster',{
   method:'POST',headers:{'Content-Type':'application/json',apikey:'sb_publishable_qOSBb7U6TGnPQ8ypyYRLGg_GtYrraoG',Authorization:'Bearer '+session.access_token},
   body:JSON.stringify({action:'installation_status'}),cache:'no-store',signal:controller.signal
  });
  if(!response.ok)return false;
  const data=await response.json();return data.authorized===true;
 } catch {return false;} finally {clearTimeout(timer);}
}
