// Container13 shared camera session core. No storage or album dependency.
export class CameraSession {
  constructor(video) { this.video=video; this.stream=null; this.facing='environment'; this.zoom=1; this.shots=[]; }
  get active() { return Boolean(this.stream); }
  async start() {
    this.stop();
    const stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:this.facing},width:{ideal:1600},height:{ideal:1200}}});
    this.stream=stream;
    try { this.video.srcObject=stream; await this.video.play(); }
    catch(e) { this.stop(); throw e; }
    const caps=this.capabilities();
    this.zoom=caps?.zoom?.min ?? 1;
    if(caps?.zoom && caps.zoom.min<=1 && caps.zoom.max>=1) this.zoom=1;
    return this;
  }
  stop() { this.stream?.getTracks().forEach(track=>track.stop()); this.stream=null; this.video.srcObject=null; }
  async flip() { this.facing=this.facing==='environment'?'user':'environment'; return this.start(); }
  capabilities() { return this.stream?.getVideoTracks()[0]?.getCapabilities?.() ?? null; }
  async setZoom(value) {
    const track=this.stream?.getVideoTracks()[0], range=this.capabilities()?.zoom;
    if(!track||!range) return false;
    const target=Math.max(range.min,Math.min(range.max,value));
    await track.applyConstraints({advanced:[{zoom:target}]});
    this.zoom=target; return true;
  }
  async capture() {
    if(!this.stream||!this.video.videoWidth) return null;
    const canvas=document.createElement('canvas');
    canvas.width=this.video.videoWidth; canvas.height=this.video.videoHeight;
    canvas.getContext('2d').drawImage(this.video,0,0);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.86));
    if(!blob) return null;
    const shot={blob,url:URL.createObjectURL(blob),selected:true};
    this.shots.push(shot); return shot;
  }
  removeLast() { const shot=this.shots.pop(); if(shot) URL.revokeObjectURL(shot.url); return shot; }
  clear() { while(this.shots.length) this.removeLast(); }
  selected() { return this.shots.filter(shot=>shot.selected); }
  dispose() { this.stop(); this.clear(); }
}
