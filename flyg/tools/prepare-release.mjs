// Prepare a consistent candidate PWA release. Run from repository root:
// node flyg/tools/prepare-release.mjs 0.1.24
// No provider calls, credentials or deployment.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
const release=process.argv[2];
if(!/^\d+\.\d+\.\d+$/.test(release||''))throw Error('Expected numeric version, e.g. 0.1.24');
const root=resolve('flyg');
const get=async p=>readFile(resolve(root,p),'utf8');
const put=async(p,s)=>writeFile(resolve(root,p),s);
const oldVersion=await get('version.js');
if(!/const RELEASE='[^']+';/.test(oldVersion))throw Error('version.js format changed');
await put('version.js',oldVersion.replace(/const RELEASE='[^']+';/,`const RELEASE='${release}';`));
const oldHtml=await get('index.html');
if(!/Flyg · kör version \d+\.\d+\.\d+/.test(oldHtml))throw Error('footer version missing');
await put('index.html',oldHtml.replace(/Flyg · kör version \d+\.\d+\.\d+/,`Flyg · kör version ${release}`));
const manifest=JSON.parse(await get('release.json'));manifest.release=release;manifest.updated=new Date().toISOString().slice(0,10);
await put('release.json',JSON.stringify(manifest,null,2)+'\n');
let sw=await get('sw.js');
if(!/const CACHE='flyg-shell-[^']+';/.test(sw))throw Error('SW cache version missing');
sw=sw.replace(/const CACHE='flyg-shell-[^']+';/,`const CACHE='flyg-shell-${release}';`);
const shellMatch=sw.match(/const SHELL=(\[[^;]+\]);/);
if(!shellMatch)throw Error('SW shell declaration missing');
const shell=JSON.parse(shellMatch[1].replaceAll("'",'"'));
const integrity={};
for(const asset of shell){
 const disk=resolve(root,asset);
 const bytes=await readFile(disk);
 integrity[asset]=createHash('sha256').update(bytes).digest('hex');
}
integrity['./']=integrity['./index.html'];
if(!/const INTEGRITY=\{[^;]+\};/.test(sw))throw Error('SW integrity declaration missing');
sw=sw.replace(/const INTEGRITY=\{[^;]+\};/,`const INTEGRITY=${JSON.stringify(integrity)};`);
await put('sw.js',sw);
for(const asset of shell){
 const actual=createHash('sha256').update(await readFile(resolve(root,asset))).digest('hex');
 if(actual!==integrity[asset])throw Error('Mismatch '+asset);
}
console.log(`Prepared ${release}: ${shell.length} SHA256 assets verified; no network calls`);
