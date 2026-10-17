// Remember: isolated owner review module, not yet activated in production.
export async function loadOwnerReview({albumId, request}) {
  const data = await request("remember-photo-approval-queue", {albumId});
  if (data.ok !== true) throw Error("Bildgranskningen kunde inte hämtas");
  return {
    readOnly: Boolean(data.readOnly),
    featureEnabled: Boolean(data.featureEnabled),
    pending: (data.photos || []).filter(photo => photo.decision !== "rejected"),
    quarantine: (data.photos || []).filter(photo => photo.decision === "rejected")
  };
}
export function quarantineTimeLeft(expiresAt, now = Date.now()) {
  const remaining = Date.parse(expiresAt) - now;
  if (!Number.isFinite(remaining)) return "Okänd tid";
  if (remaining <= 0) return "Tiden har gått ut";
  const hours = Math.ceil(remaining / 3600000);
  return hours > 24 ? Math.ceil(hours / 24) + " dygn kvar" : hours + " timmar kvar";
}

export function mountOwnerReview({host,albumId,request}) {
  if (!host || !albumId || typeof request !== "function") throw Error("Review configuration missing");
  const css=document.createElement("style");
  css.textContent=".review-panel{margin:18px 0;padding:16px;border:1px solid #527b69;border-radius:18px;background:#142d27}.review-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.review-tile{border:0;background:transparent;color:inherit;padding:0;text-align:left}.review-tile img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px}.review-dialog{box-sizing:border-box;border:0;max-width:100vw;max-height:100dvh;width:100vw;height:100dvh;margin:0;padding:20px 12px;background:#0a1715;color:#fff}.review-dialog::backdrop{background:#000}.review-dialog img{width:100%;height:calc(100dvh - 190px);object-fit:contain}.review-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.review-actions button{min-height:44px}.review-count{text-align:center}";
  host.append(css);
  const pending=document.createElement("section"),quarantine=document.createElement("section"),status=document.createElement("p");
  for (const [node,title] of [[pending,"Bilder att godkänna"],[quarantine,"Nekade bilder – karantän"]]) {
    node.className="review-panel";
    const heading=document.createElement("h2");heading.textContent=title;
    const grid=document.createElement("div");grid.className="review-grid";
    node.append(heading,grid);
  }
  status.setAttribute("role","status");host.append(pending,quarantine,status);
  const dialog=document.createElement("dialog");dialog.className="review-dialog";
  const picture=document.createElement("img");picture.alt="Bild för granskning";
  const counter=document.createElement("p");counter.className="review-count";
  const actions=document.createElement("div");actions.className="review-actions";
  dialog.append(picture,counter,actions);host.append(dialog);
  let current=[],index=0,readOnly=true,enabled=false,busy=false;
  function addAction(label,callback,disabled=false){const button=document.createElement("button");button.type="button";button.textContent=label;button.disabled=busy||disabled;button.onclick=callback;actions.append(button);}
  function show(){const p=current[index];if(!p)return;picture.src=p.url||"";counter.textContent=(index+1)+" av "+current.length+(p.decision==="rejected"?" · "+quarantineTimeLeft(p.expiresAt):"");actions.replaceChildren();addAction("←",()=>move(-1),index===0);addAction("→",()=>move(1),index===current.length-1);
    if(!readOnly&&enabled){if(p.decision==="rejected")addAction("Återställ",()=>decide(p,"restore"));else {addAction("Godkänn",()=>decide(p,"approved"));addAction("Neka",()=>decide(p,"rejected"));}}
    addAction("Stäng ✕",()=>dialog.close());
  }
  function move(direction){index=Math.max(0,Math.min(current.length-1,index+direction));show();}
  async function decide(photo,decision){if(busy)return;if(decision==="rejected"&&!confirm("Neka bilden? Den tas bort efter 72 timmar om den inte återställs."))return;busy=true;show();
    try {await request(decision==="restore"?"remember-photo-quarantine-restore":"remember-photo-approval-decision",{albumId,photoId:photo.photoId,...(decision==="restore"?{}:{decision})});dialog.close();await refresh();}
    catch(e){status.textContent=e?.message||"Åtgärden misslyckades.";}finally{busy=false;if(dialog.open)show();}
  }
  function draw(node,items){const grid=node.querySelector(".review-grid");grid.replaceChildren();if(!items.length){const empty=document.createElement("p");empty.textContent="Inga bilder just nu.";grid.append(empty);}
    items.forEach((photo,i)=>{const tile=document.createElement("button");tile.type="button";tile.className="review-tile";const image=document.createElement("img");image.src=photo.url||"";image.alt="Visa bild";image.loading="lazy";tile.append(image);if(photo.decision==="rejected"){const note=document.createElement("span");note.textContent=quarantineTimeLeft(photo.expiresAt);tile.append(note);}tile.onclick=()=>{current=items;index=i;show();dialog.showModal();};grid.append(tile);});
  }
  async function refresh(){status.textContent="Hämtar bilder…";try{const data=await loadOwnerReview({albumId,request});readOnly=data.readOnly;enabled=data.featureEnabled;draw(pending,data.pending);draw(quarantine,data.quarantine);status.textContent=readOnly?"Bildgranskningen är skrivskyddad.":"";}catch(e){status.textContent=e?.message||"Kunde inte hämta bildgranskningen."}}
  let startX=null;dialog.addEventListener("touchstart",e=>{if(e.touches.length===1)startX=e.touches[0].clientX},{passive:true});dialog.addEventListener("touchend",e=>{if(startX===null||!e.changedTouches.length)return;const delta=e.changedTouches[0].clientX-startX;startX=null;if(Math.abs(delta)>70)move(delta<0?1:-1)},{passive:true});
  dialog.addEventListener("keydown",e=>{if(e.key==="ArrowRight")move(1);if(e.key==="ArrowLeft")move(-1)});
  return {refresh};
}
