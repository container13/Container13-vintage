const {PGlite}=require('@electric-sql/pglite');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {randomUUID:id}=require('node:crypto');
const root=path.join(__dirname,'../guest-modes-candidate');
(async()=>{
const db=new PGlite();
await db.exec(`
 CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
 CREATE SCHEMA auth; CREATE SCHEMA remember;
 CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,email_confirmed_at timestamptz,deleted_at timestamptz,banned_until timestamptz);
 CREATE TABLE remember.albums(id uuid PRIMARY KEY,slug text UNIQUE,title text,owner_user_id uuid,event_timezone text,
 default_opens_at timestamptz,default_closes_at timestamptz,photo_limit int,is_active boolean DEFAULT true,override_opens_at timestamptz,override_closes_at timestamptz,forced_closed boolean DEFAULT false);
 CREATE TABLE remember.pending_album_registrations(id uuid PRIMARY KEY,email text,title text,starts_at timestamptz,
 days int,timezone text,created_at timestamptz DEFAULT now(),consumed_at timestamptz,album_id uuid);
 CREATE TABLE remember.album_photos(id uuid PRIMARY KEY,album_id uuid REFERENCES remember.albums,object_key text,state text,created_at timestamptz DEFAULT now(),idempotency_key uuid);
 CREATE TABLE remember.photo_approval_queue(photo_id uuid PRIMARY KEY REFERENCES remember.album_photos,album_id uuid,
 decision text DEFAULT 'pending',created_at timestamptz DEFAULT now(),decided_at timestamptz,decided_by uuid);
 CREATE TABLE remember.webmasters(user_id uuid);
 CREATE TABLE remember.guest_links(album_id uuid,token_sha256 bytea,revoked_at timestamptz,created_by uuid);
 CREATE TABLE remember.security_feature_flags(feature_key text,mode text);
 CREATE TABLE remember.security_test_eligibility(feature_key text,album_id uuid);
 CREATE TABLE remember.security_album_settings(album_id uuid,require_verified_email boolean,require_photo_approval boolean,
 allow_reports boolean,notify_reports boolean,pause_new_slideshow_photos boolean);
`);
// Actual installed legacy function bodies captured read-only; no cloud connection.
await db.exec(fs.readFileSync(path.join(root,'before/functions.sql'),'utf8'));
await db.exec(`CREATE TRIGGER remember_queue_photo_on_ready AFTER UPDATE OF state ON remember.album_photos
FOR EACH ROW EXECUTE FUNCTION remember.queue_photo_for_approval();`);
const owner=id(),other=id(),unverified=id(),banned=id(),deleted=id(),oldAlbum=id();
for(const [uid,email,confirmed,until,del]of [[owner,'owner@example.invalid',true,null,null],[other,'other@example.invalid',true,null,null],[unverified,'unverified@example.invalid',false,null,null],[banned,'banned@example.invalid',true,'2099-01-01',null],[deleted,'deleted@example.invalid',true,null,'2026-01-01']])
 await db.query('INSERT INTO auth.users VALUES($1,$2,$3,$4,$5)',[uid,email,confirmed?'2026-01-01':null,del,until]);
await db.query('INSERT INTO remember.albums(id,slug,title,owner_user_id) VALUES($1::uuid,($1::uuid)::text,$2,$3)',[oldAlbum,'Existing fixture',owner]);
await db.exec("INSERT INTO remember.security_feature_flags VALUES('photo_approval','OFF')");
await db.exec(fs.readFileSync(path.join(root,'INSTALL_REVIEW_FIRST.sql'),'utf8'));
const one=async(sql,args=[])=>(await db.query(sql,args)).rows[0];
const complete=async(actor,rid)=>(await one('SELECT public.remember_complete_album_registration($1,$2) result',[actor,rid])).result;
const feature=async(a)=>(await one("SELECT public.remember_security_effective_feature_read($1,'photo_approval') enabled",[a])).enabled;
const denied=async(fn,code)=>{await assert.rejects(fn,e=>e.code===code);};
assert.equal((await one('SELECT guest_mode FROM remember.albums WHERE id=$1',[oldAlbum])).guest_mode,'open');
assert.equal(await feature(oldAlbum),false);
assert.equal((await one("SELECT mode FROM remember.security_feature_flags WHERE feature_key='photo_approval'")).mode,'OFF');
console.log('PASS legacy album/flag unchanged');
const albums={};
for(const mode of ['open','reviewed']){
 const rid=id();await db.query(`INSERT INTO remember.pending_album_registrations(id,email,title,starts_at,days,timezone,guest_mode)
 VALUES($1,'owner@example.invalid',$2,now(),1,'Europe/Stockholm',$2)`,[rid,mode]);
 await denied(()=>complete(other,rid),'22023');
 const r=await complete(owner,rid);assert.equal(r.albumId,rid);assert.equal(r.guestMode,mode);
 assert.deepEqual(await complete(owner,rid),r);
 assert.equal((await one('SELECT count(*)::int n FROM remember.albums WHERE id=$1',[rid])).n,1);
 assert.equal((await one('SELECT guest_mode FROM remember.albums WHERE id=$1',[rid])).guest_mode,mode);
 assert.equal(await feature(rid),mode==='reviewed');albums[mode]=rid;
}
console.log('PASS atomic creation, mode persistence, lost-response replay and other-account denial');
const failed=id();await db.query(`INSERT INTO remember.pending_album_registrations(id,email,title,starts_at,days,timezone,guest_mode)
 VALUES($1,'owner@example.invalid','FORCED AUDIT FAILURE',now(),1,'Europe/Stockholm','reviewed')`,[failed]);
await db.exec(`CREATE FUNCTION remember.fail_consumption() RETURNS trigger LANGUAGE plpgsql AS $$
 BEGIN IF NEW.title='FORCED AUDIT FAILURE' THEN RAISE EXCEPTION 'forced consumption failure'; END IF; RETURN NEW; END $$;
 CREATE TRIGGER fail_consumption BEFORE UPDATE ON remember.pending_album_registrations FOR EACH ROW EXECUTE FUNCTION remember.fail_consumption();`);
await denied(()=>complete(owner,failed),'P0001');
assert.equal((await one('SELECT count(*)::int n FROM remember.albums WHERE id=$1',[failed])).n,0);
assert.equal((await one('SELECT consumed_at FROM remember.pending_album_registrations WHERE id=$1',[failed])).consumed_at,null);
await db.exec('DROP TRIGGER fail_consumption ON remember.pending_album_registrations; DROP FUNCTION remember.fail_consumption();');
console.log('PASS forced consumption failure rolls back album insert and mode atomically');
for(const actor of [unverified,banned,deleted,null])await denied(()=>complete(actor,null),'42501');
await denied(()=>db.query("UPDATE remember.albums SET guest_mode='identified' WHERE id=$1",[oldAlbum]),'23514');
await denied(()=>db.query("UPDATE remember.pending_album_registrations SET guest_mode='typo'"),'23514');
for(const role of ['anon','authenticated']){
 assert.equal((await one("SELECT has_function_privilege($1,'public.remember_complete_album_registration(uuid,uuid)','EXECUTE') allowed",[role])).allowed,false);
}
assert.equal((await one("SELECT has_function_privilege('service_role','public.remember_complete_album_registration(uuid,uuid)','EXECUTE') allowed")).allowed,true);
console.log('PASS unverified/banned/deleted/null identities, invalid modes and RPC grants');
for(const [mode,aid]of Object.entries(albums)){
 const pid=id(),token=Buffer.alloc(32,mode==='open'?1:2);
 await db.query('INSERT INTO remember.guest_links(album_id,token_sha256,revoked_at) VALUES($1,$2,NULL)',[aid,token]);
 await db.query("INSERT INTO remember.album_photos(id,album_id,object_key,state,created_at) VALUES($1::uuid,$2,($1::uuid)::text,'uploading',now())",[pid,aid]);
 await db.query("UPDATE remember.album_photos SET state='ready' WHERE id=$1",[pid]);
 const metadata=(await one('SELECT public.remember_guest_metadata_read($1) result',[token])).result;
 assert.equal(metadata.photoApproval,mode==='reviewed');
 const gallery=async()=>(await one('SELECT public.remember_photo_gallery_read(NULL,NULL,$1) result',[token])).result;
 assert.equal((await gallery()).photos.length,mode==='open'?1:0);
 const queue=(await one('SELECT public.remember_photo_approval_owner_queue_read($1,$2) result',[owner,aid])).result;
 assert.equal(queue.featureEnabled,mode==='reviewed');assert.equal(queue.photos.length,mode==='reviewed'?1:0);
 if(mode==='reviewed'){
  await denied(()=>db.query("SELECT public.remember_photo_approval_owner_decide($1,$2,$3,'approved')",[other,aid,pid]),'42501');
  await db.query("SELECT public.remember_photo_approval_owner_decide($1,$2,$3,'approved')",[owner,aid,pid]);
  assert.equal((await gallery()).photos[0].id,pid);
  const rogue=id();await db.query("INSERT INTO remember.album_photos(id,album_id,object_key,state,created_at) VALUES($1::uuid,$2,($1::uuid)::text,'ready',now())",[rogue,aid]);
  assert.equal((await gallery()).photos.length,1,'untracked ready photo must fail closed');
  const rejected=id();await db.query("INSERT INTO remember.album_photos(id,album_id,object_key,state,created_at) VALUES($1::uuid,$2,($1::uuid)::text,'uploading',now())",[rejected,aid]);
  await db.query("UPDATE remember.album_photos SET state='ready' WHERE id=$1",[rejected]);
  await db.query("SELECT public.remember_photo_approval_owner_decide($1,$2,$3,'rejected')",[owner,aid,rejected]);
  assert.equal((await gallery()).photos.length,1,'rejected photo hidden');
  await db.query("UPDATE remember.album_photos SET state='deleted' WHERE id=$1",[pid]);
  assert.equal((await gallery()).photos.length,0,'deleted approved photo hidden');
 }
 await db.query('UPDATE remember.albums SET is_active=false WHERE id=$1',[aid]);
 assert.equal((await gallery()).authorized,false);
}
console.log('PASS open visibility; reviewed pending/approved/rejected/missing queue/deleted visibility; inactive album denial');
// Preserve old test-gated behavior for albums not using the new reviewed mode.
await db.exec("UPDATE remember.security_feature_flags SET mode='TEST'");
await db.query("INSERT INTO remember.security_test_eligibility VALUES('photo_approval',$1)",[oldAlbum]);
await db.query('INSERT INTO remember.security_album_settings(album_id,require_photo_approval) VALUES($1,true)',[oldAlbum]);
assert.equal(await feature(oldAlbum),true);
console.log('PASS legacy TEST eligibility retained');
await db.exec(fs.readFileSync(path.join(root,'ROLLBACK_TEST.sql'),'utf8'));console.log('PASS prospective cloud ROLLBACK script in isolated engine');
await db.close();console.log('Guest-mode database tests PASS (isolated PGlite; no Supabase writes).');
})().catch(e=>{console.error(e);process.exitCode=1;});
