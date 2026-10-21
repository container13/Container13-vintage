// Isolated TEST frontend. No production configuration or user-selectable backend.
import {createWebmasterAlbumActivation} from './webmaster-album-activation.js?v=0.1.152';
import {mountWebmasterAlbumSettings,uploadStatus} from './webmaster-album-settings.js?v=0.1.152';

export const TEST_URL='https://kauxrvshxgpbvptdwhog.supabase.co';
export const TEST_STORAGE_KEY='container13-remember-test-admin-auth-v1';
const TEST_PUBLIC_KEY='sb_publishable_iLKTdBYdh2w5ALhEyFtW8A_V8Gujyam';
const ACTIONS=new Set(['list','album_activation','save_album_activation','album_settings','save_album_settings']);

export async function mountTestAdmin({createClient,document:doc=document,fetch:send=globalThis.fetch,confirm:ask=message=>globalThis.confirm(message)}){
 const $=id=>doc.getElementById(id);
 const client=createClient(TEST_URL,TEST_PUBLIC_KEY,{auth:{storage:doc.defaultView.localStorage,storageKey:TEST_STORAGE_KEY,persistSession:true,autoRefreshToken:true,detectSessionInUrl:false},global:{fetch:(input,init={})=>send(input,{...init,signal:init.signal||AbortSignal.timeout(20000)})}});
 let actor=null,albums=[],capabilities={},epoch=0,loading=false,saves=0,dirty=false,detailId=null;
 const feedback=message=>{$('testFeedback').textContent=message;};
 const activation=createWebmasterAlbumActivation({document:doc,request,onChanged:current=>{
  albums=albums.map(a=>a.id===current.id?{...a,...current}:a);renderAlbums();
 },canUse:()=>!!actor&&capabilities.albumActivation===true,focusFallback:()=>$('testReload')});
 function busy(){return saves>0||activation.isBusy();}
 function controls(){for(const id of ['testReload','testLogout','testBack'])$(id).disabled=loading||saves>0;}
 function leaveDraft(){if(busy())return false;if(dirty&&!ask('Du har osparade tidsändringar. Vill du lämna dem?'))return false;dirty=false;return true;}
 function clearDetails(){detailId=null;dirty=false;$('testSettings').replaceChildren();$('testDetails').hidden=true;}
 function lockedAccount(message){actor=null;albums=[];capabilities={};epoch++;loading=false;activation.reset();clearDetails();$('testAlbumList').replaceChildren();$('webmasterTools').hidden=true;$('testAccount').hidden=true;$('testLogin').hidden=false;$('testIdentity').textContent='';feedback(message);controls();}
 async function request(payload){
  if(!ACTIONS.has(payload.action))throw Error('Åtgärden stöds inte i denna testvy.');
  const owner=actor,stamp=epoch,writing=payload.action.startsWith('save_');
  if(!owner)throw Error('Logga in i testmiljön igen.');
  const {data,error}=await client.auth.getSession();
  if(error||!data?.session||data.session.user.id!==owner)throw Error('Testsessionen har ändrats. Logga in på nytt.');
  if(writing){saves++;controls();}
  try{
   const response=await send(TEST_URL+'/functions/v1/remember-webmaster',{method:'POST',headers:{'Content-Type':'application/json',apikey:TEST_PUBLIC_KEY,Authorization:'Bearer '+data.session.access_token},body:JSON.stringify(payload),cache:'no-store',signal:AbortSignal.timeout(15000)});
   let result;try{result=await response.json();}catch{throw Error('Testtjänstens svar kunde inte läsas. Försök igen.');}
   if(stamp!==epoch||actor!==owner)throw Error('Testsessionen har ändrats. Uppdatera albumen.');
   if(!response.ok){
    const messages={401:'Testsessionen har gått ut. Logga ut och logga in igen.',403:'Testkontot saknar webmasterbehörighet för åtgärden.',409:'Albumet har ändrats. Aktuella uppgifter behöver hämtas på nytt.',400:'Kontrollera de valda uppgifterna.'};
    throw Error(messages[response.status]||'Testtjänsten kunde inte slutföra anropet. Försök igen.');
   }
   if(result.authorized!==true)throw Error('Testkontots behörighet kunde inte bekräftas.');
   if(payload.action==='album_settings'&&result.album?.id===detailId)dirty=false;
   if(payload.action==='save_album_settings'&&result.album){
    dirty=false;albums=albums.map(a=>a.id===result.album.id?{...a,...result.album}:a);renderAlbums();
   }
   return result;
  }catch(error){if(error.name==='TimeoutError'||error.name==='AbortError')throw Error('Anropet tog för lång tid. Kontrollera aktuell status före nytt försök.');throw error;}
  finally{if(writing){saves--;controls();}}
 }
 function renderAlbums(){
  $('testAlbumList').replaceChildren();
  if(!albums.length){const p=doc.createElement('p');p.textContent='Det finns inga album i testmiljön ännu.';$('testAlbumList').append(p);return;}
  for(const album of albums){
   const card=doc.createElement('article');card.className='test-album';
   const open=doc.createElement('button');open.type='button';open.className='test-open';
   const title=doc.createElement('strong');title.textContent=album.title||'Album';
   const detail=doc.createElement('span');detail.textContent=(album.owner_email||'')+' · '+uploadStatus(album);
   open.append(title,detail);open.addEventListener('click',()=>openAlbum(album.id));
   const toggle=doc.createElement('div');toggle.className='test-switch';
   activation.mountSwitch({host:toggle,album,enabled:capabilities.albumActivation===true});
   card.append(open,toggle);$('testAlbumList').append(card);
  }
  if(albums.length>=100){const p=doc.createElement('p');p.textContent='Testlistan visar högst 100 album.';$('testAlbumList').append(p);}
 }
 function openAlbum(id){
  if(!leaveDraft())return;
  const album=albums.find(a=>a.id===id);if(!album)return;
  clearDetails();detailId=id;$('webmasterTools').hidden=true;$('testDetails').hidden=false;$('testAlbumTitle').textContent=album.title||'Album';
  const host=doc.createElement('div');$('testSettings').append(host);
  mountWebmasterAlbumSettings({host,album,enabled:capabilities.albumSettings===true,request});
  // Keep the draft untouched until the shared controller's initial fresh read completes.
  host.querySelector('fieldset').disabled=true;
  host.addEventListener('input',()=>{dirty=true;});host.addEventListener('change',()=>{dirty=true;});
  host.addEventListener('click',event=>{if(event.target.closest('[data-hours]'))dirty=true;});
  feedback('Ändra ett testalbum. Förlängningsknappen ändrar ett utkast; välj sedan Spara ändringar.');
  $('testBack').focus({preventScroll:true});
 }
 async function loadAlbums(){
  if(loading||!actor)return;const stamp=epoch;loading=true;controls();feedback('Hämtar testalbum…');
  try{
   const result=await request({action:'list'});if(stamp!==epoch)return;
   if(!Array.isArray(result.albums))throw Error('Testalbumen kunde inte läsas.');
   albums=result.albums;capabilities=result.capabilities||{};clearDetails();renderAlbums();$('webmasterTools').hidden=false;
   feedback(capabilities.albumSettings===true&&capabilities.albumActivation===true?'Redo. Albumreglage och tider är aktiverade i testmiljön.':'Serverstödet i testmiljön kunde inte bekräftas. Kontroller utan stöd är avstängda.');
  }catch(error){if(stamp===epoch){albums=[];capabilities={};clearDetails();$('testAlbumList').replaceChildren();$('webmasterTools').hidden=true;feedback(error.message);}}
  finally{if(stamp===epoch){loading=false;controls();}}
 }
 async function showSession(session){
  const id=session?.user?.id||null;if(id===actor)return;
  lockedAccount('');actor=id;if(!id){feedback('Logga in med ditt befintliga testkonto.');return;}
  $('testLogin').hidden=true;$('testAccount').hidden=false;$('testIdentity').textContent=session.user.email||'Testkonto';await loadAlbums();
 }
 $('testLoginForm').addEventListener('submit',async event=>{
  event.preventDefault();const fieldset=$('testLoginForm').querySelector('fieldset');if(fieldset.disabled)return;
  fieldset.disabled=true;feedback('Loggar in i testmiljön…');
  try{const {data,error}=await client.auth.signInWithPassword({email:$('testEmail').value.trim(),password:$('testPassword').value});$('testPassword').value='';if(error||!data?.session)throw Error('Kunde inte logga in. Kontrollera e-post och lösenord för remember-test.');await showSession(data.session);}
  catch(error){feedback(error.message||'Inloggningen misslyckades. Försök igen.');}
  finally{fieldset.disabled=false;}
 });
 $('testReload').onclick=()=>{if(leaveDraft())void loadAlbums();};
 $('testBack').onclick=()=>{if(!leaveDraft())return;clearDetails();$('webmasterTools').hidden=false;feedback('Välj ett testalbum.');$('testReload').focus({preventScroll:true});};
 $('testLogout').onclick=async()=>{
  if(!leaveDraft())return;loading=true;controls();
  try{const {error}=await client.auth.signOut({scope:'local'});if(error)throw error;lockedAccount('Du är utloggad från testmiljön.');}
  catch{feedback('Utloggningen misslyckades. Försök igen.');}finally{loading=false;controls();}
 };
 doc.defaultView.addEventListener('beforeunload',event=>{if(dirty||saves>0){event.preventDefault();event.returnValue='';}});
 client.auth.onAuthStateChange((_event,session)=>{if((session?.user?.id||null)!==actor)setTimeout(()=>{void showSession(session);},0);});
 try{const {data,error}=await client.auth.getSession();if(error)throw error;if(data?.session)await showSession(data.session);else feedback('Logga in med ditt befintliga testkonto.');}
 catch{lockedAccount('Testsessionen kunde inte hämtas. Försök logga in igen.');}
 finally{$('testLoginForm').querySelector('fieldset').disabled=false;}
 return {request,client};
}
