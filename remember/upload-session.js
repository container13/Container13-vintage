// One in-memory upload identity per file and album for bounded safe retries.
import { prepareRememberUpload } from './upload-prepare.js';
const ENDPOINT='https://wykvztfmfbboxiqvuvwr.supabase.co/functions/v1/remember-photo-upload';
const messages={duplicate:'Den här bilden finns redan i albumet.',limit:'Albumet har nått sin bildgräns.',closed:'Uppladdningen är stängd för albumet.',album_inactive:'Albumet är tillfälligt avstängt.',content_conflict:'Bilden stämmer inte med det tidigare uppladdningsförsöket.'};
export function createRememberUploader({prepare=prepareRememberUpload,fetchUpload=fetch,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),timeoutMs=45000}={}){
 const files=new WeakMap();
 return function upload(file,{token,albumId,accessToken}={}){
  if(!!token===!!albumId)return Promise.reject(new Error('Ogiltig albumåtkomst.'));
  const scope=token?'guest:'+token:'owner:'+albumId;
  let scopes=files.get(file);if(!scopes){scopes=new Map();files.set(file,scopes);}
  let entry=scopes.get(scope);if(!entry){entry={requestId:crypto.randomUUID(),prepared:null,running:null};scopes.set(scope,entry);}
  if(entry.running)return entry.running;
  entry.running=(async()=>{
   if(!entry.prepared)entry.prepared=await prepare(file);
   for(let attempt=0;attempt<3;attempt++){
    let transient=false,message='Anslutningen avbröts. Försök ladda upp igen.';
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
    try{
     const form=new FormData();form.set(token?'token':'albumId',token||albumId);form.set('requestId',entry.requestId);form.set('file',entry.prepared.file);
     const response=await fetchUpload(ENDPOINT,{method:'POST',body:form,cache:'no-store',headers:albumId?{Authorization:'Bearer '+accessToken}:{},signal:controller.signal});
     const data=await response.json().catch(()=>null);
     if(response.ok&&data?.ok===true)return data;
     transient=[408,429,500,502,503,504].includes(response.status)||(response.ok&&!data);
     message=messages[data?.reason]||data?.error||'Uppladdningen misslyckades (HTTP '+response.status+').';
    }catch(error){if(error?.name!=='AbortError'&&!(error instanceof TypeError))throw error;transient=true;}
    finally{clearTimeout(timer);}
    if(!transient||attempt===2)throw new Error(message);
    await wait(1000*(attempt+1));
   }
  })().finally(()=>{entry.running=null;});return entry.running;
 };
}
