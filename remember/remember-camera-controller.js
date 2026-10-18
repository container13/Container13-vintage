// Shared embedded-camera lifecycle for owner and guest album views.
export function mountRememberCamera({host,frame,openButton,closeButton,canOpen=()=>true,onApproved=()=>{}}){
 const close=()=>{frame.src='about:blank';host.hidden=true;openButton.hidden=false;};
 const open=()=>{if(!canOpen())return;host.hidden=false;openButton.hidden=true;frame.src='./camera-session-test.html?embedded=1&v=0.1.82';};
 openButton.addEventListener('click',open);
 closeButton.addEventListener('click',close);
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==frame.contentWindow||!event.data)return;
  if(event.data.type==='remember-camera-permission-denied'){close();return;}
  if(event.data.type==='remember-camera-approved'&&Array.isArray(event.data.files)){
   const files=event.data.files.filter(file=>file instanceof Blob).map((blob,index)=>new File([blob],'remember-foto-'+(index+1)+'.jpg',{type:'image/jpeg'}));
   close();onApproved(files);
  }
 });
 return {open,close};
}
