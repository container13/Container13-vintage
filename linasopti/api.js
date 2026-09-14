(function(){
  window.LinaAPI={
    workerBase:'https://linas-opti-api.mangaj73.workers.dev',
    async health(){const r=await fetch(this.workerBase+'/health',{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}
  };
})();
