// Container13 shared camera core — framework-free, no storage or upload coupling.
// Pilot: Remember. Browser support for hardware zoom varies (especially iOS).
export class CameraSession {
  constructor({ onChange = () => {} } = {}) {
    this.onChange = onChange;
    this.stream = null;
    this.facingMode = 'environment';
    this.photos = [];
    this.zoom = 1;
  }
  get count() { return this.photos.length; }
  get selected() { return this.photos.filter(p => p.selected); }
  async start(video, facingMode = this.facingMode) {
    this.stop();
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera API unavailable');
    this.facingMode = facingMode;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false, video: { facingMode: { ideal: facingMode }, width: { ideal: 1600 }, height: { ideal: 1200 } }
    });
    this.stream = stream;
    try {
      video.srcObject = stream;
      await video.play();
    } catch (error) {
      this.stop();
      throw error;
    }
    this.zoom = 1;
    this.onChange(this);
  }
  stop() {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
    this.onChange(this);
  }
  async switchCamera(video) {
    return this.start(video, this.facingMode === 'environment' ? 'user' : 'environment');
  }
  zoomRange() {
    const track = this.stream?.getVideoTracks()[0];
    const range = track?.getCapabilities?.().zoom;
    return range ? { min: range.min, max: range.max, step: range.step || 0.1 } : null;
  }
  async setZoom(value) {
    const range = this.zoomRange();
    const track = this.stream?.getVideoTracks()[0];
    if (!range || !track) return false;
    const zoom = Math.min(range.max, Math.max(range.min, value));
    await track.applyConstraints({ advanced: [{ zoom }] });
    this.zoom = zoom;
    return true;
  }
  async capture(video, { quality = 0.86 } = {}) {
    if (!this.stream || !video.videoWidth || !video.videoHeight) throw new Error('Camera not ready');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) throw new Error('Photo encoding failed');
    const photo = { id: crypto.randomUUID(), blob, url: URL.createObjectURL(blob), selected: true };
    this.photos.push(photo);
    this.onChange(this);
    return photo;
  }
  toggle(id) {
    const photo = this.photos.find(p => p.id === id);
    if (!photo) return false;
    photo.selected = !photo.selected;
    this.onChange(this);
    return true;
  }
  remove(id) {
    const index = this.photos.findIndex(p => p.id === id);
    if (index < 0) return false;
    const [photo] = this.photos.splice(index, 1);
    URL.revokeObjectURL(photo.url);
    this.onChange(this);
    return true;
  }
  clear() {
    for (const photo of this.photos) URL.revokeObjectURL(photo.url);
    this.photos.length = 0;
    this.onChange(this);
  }
  dispose() { this.stop(); this.clear(); }
}
