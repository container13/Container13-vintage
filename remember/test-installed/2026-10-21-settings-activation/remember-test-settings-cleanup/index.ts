// Retired test-fixture cleanup endpoint. No credentials, storage access or mutations.
Deno.serve(()=>new Response("Retired",{status:410,headers:{"Cache-Control":"no-store"}}));
