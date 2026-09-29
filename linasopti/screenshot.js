(function(){
  'use strict';

  const XHTML='http://www.w3.org/1999/xhtml';

  function safeName(value){
    return String(value||'vy')
      .replace(/^#+/,'')
      .replace(/[^a-zA-Z0-9åäöÅÄÖ_-]+/g,'-')
      .replace(/^-+|-+$/g,'') || 'vy';
  }

  function stamp(){
    const d=new Date();
    const p=n=>String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  }

  async function blobToDataURL(blob){
    return await new Promise((resolve,reject)=>{
      const r=new FileReader();
      r.onload=()=>resolve(r.result);
      r.onerror=()=>reject(r.error||new Error('Kunde inte läsa bildresurs'));
      r.readAsDataURL(blob);
    });
  }

  async function inlineImages(root){
    const images=[...root.querySelectorAll('img')];
    await Promise.all(images.map(async img=>{
      const src=img.getAttribute('src');
      if(!src || src.startsWith('data:'))return;
      try{
        const u=new URL(src,location.href);
        if(u.origin!==location.origin)throw new Error('extern bild');
        const r=await fetch(u.href,{cache:'no-store'});
        if(!r.ok)throw new Error(`HTTP ${r.status}`);
        img.setAttribute('src',await blobToDataURL(await r.blob()));
      }catch(e){
        img.removeAttribute('src');
        img.setAttribute('alt',img.getAttribute('alt')||'');
      }
    }));
  }

  async function collectCss(){
    const parts=[];
    for(const node of [...document.querySelectorAll('style,link[rel="stylesheet"]')]){
      if(node.tagName==='STYLE'){
        parts.push(node.textContent||'');
        continue;
      }
      const href=node.getAttribute('href');
      if(!href)continue;
      const u=new URL(href,location.href);
      if(u.origin!==location.origin)continue;
      const r=await fetch(u.href,{cache:'no-store'});
      if(r.ok)parts.push(await r.text());
    }
    parts.push(`
      html,body{margin:0!important;padding:0!important;background:#f4f7fb!important;overflow:visible!important}
      #app{display:block!important;width:100%!important;min-height:100%!important}
      .header{position:relative!important;top:auto!important}
      .screenshot-exclude{display:none!important}
    `);
    return parts.join('\n');
  }

  function downloadBlob(blob,name){
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  }

  async function renderPng(){
    const source=document.getElementById('app');
    if(!source || source.hidden)throw new Error('Lina-vyn är inte öppen');

    // Width follows the actual Lina viewport; height includes the complete current view.
    const width=Math.max(document.documentElement.clientWidth,source.scrollWidth,document.body.scrollWidth);
    const view=document.getElementById('view');
    const height=Math.max(
      source.scrollHeight,
      view?.scrollHeight||0,
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    if(width<1 || height<1)throw new Error('Kunde inte mäta aktuell Lina-vy');
    if(width*height>120000000)throw new Error('Vyn är för stor för en säker PNG. Minska webbläsarens zoom och försök igen.');

    const clone=source.cloneNode(true);
    clone.hidden=false;
    clone.removeAttribute('hidden');
    clone.setAttribute('xmlns',XHTML);
    clone.querySelectorAll('.screenshot-exclude').forEach(x=>x.remove());
    clone.querySelectorAll('input,textarea,select').forEach((el,i)=>{
      const original=source.querySelectorAll('input,textarea,select')[i];
      if(!original)return;
      if(el.tagName==='TEXTAREA')el.textContent=original.value;
      else if(el.tagName==='SELECT'){
        [...el.options].forEach((o,n)=>o.selected=original.options[n]?.selected||false);
      }else el.setAttribute('value',original.value||'');
    });
    await inlineImages(clone);
    const css=await collectCss();
    const html=new XMLSerializer().serializeToString(clone);
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject x="0" y="0" width="100%" height="100%"><div xmlns="${XHTML}" style="width:${width}px;min-height:${height}px;background:#f4f7fb"><style>${css.replace(/<\/style/gi,'<\\/style')}</style>${html}</div></foreignObject></svg>`;
    const svgBlob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(svgBlob);
    try{
      const img=new Image();
      img.decoding='sync';
      await new Promise((resolve,reject)=>{
        img.onload=resolve;
        img.onerror=()=>reject(new Error('Webbläsaren kunde inte rendera Lina-vyn till bild'));
        img.src=url;
      });
      const canvas=document.createElement('canvas');
      canvas.width=width; canvas.height=height;
      const ctx=canvas.getContext('2d',{alpha:false});
      if(!ctx)throw new Error('Canvas saknas i webbläsaren');
      ctx.fillStyle='#f4f7fb'; ctx.fillRect(0,0,width,height); ctx.drawImage(img,0,0);
      const png=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('PNG kunde inte skapas')),'image/png'));
      const route=safeName(location.hash||'dashboard');
      const version=safeName(window.LinaVersion?.release||'Lina');
      const name=`LINA_${route}_${version}_${stamp()}.png`;
      return {png,name,width,height,bytes:png.size};
    }finally{
      URL.revokeObjectURL(url);
    }
  }

  async function capture(){
    // Chrome requires the clipboard request during the original click gesture.
    // ClipboardItem accepts a promise, so rendering may finish asynchronously.
    const result=renderPng();
    if(navigator.clipboard?.write && typeof ClipboardItem!=='undefined'){
      try{
        await navigator.clipboard.write([new ClipboardItem({'image/png':result.then(r=>r.png)})]);
        const {png,...meta}=await result;
        return {...meta,clipboard:true};
      }catch(e){
        // A rendering error is not a clipboard permission failure.
        const rendered=await result;
        downloadBlob(rendered.png,rendered.name);
        const {png,...meta}=rendered;
        return {...meta,clipboard:false,clipboardError:String(e?.message||e)};
      }
    }
    const rendered=await result;
    downloadBlob(rendered.png,rendered.name);
    const {png,...meta}=rendered;
    return {...meta,clipboard:false,clipboardError:'Bildurklipp stöds inte av webbläsaren'};
  }

  window.LinaScreenshot=Object.freeze({capture});
})();
