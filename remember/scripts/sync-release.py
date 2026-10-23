#!/usr/bin/env python3
"""Synchronize or verify Remember release identity. No external dependencies."""
import argparse,json,pathlib,re,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
HTML=('index','login','register','activate','dashboard','owner','album','album-admin','webmaster')
def replacements(text,version):
    text=re.sub(r'(name="remember-release" content="remember-)\d+\.\d+\.\d+(")',lambda m:m[1]+version+m[2],text)
    text=re.sub(r'(\./(?:remember-version|auto-update)\.js\?v=)\d+\.\d+\.\d+',lambda m:m[1]+version,text)
    return text
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--write',action='store_true',help='Update derived release identities from release.json')
    parser.add_argument('--bump',action='store_true',help='Increment patch version and synchronize all release identities before commit')
    args=parser.parse_args()
    manifest=json.loads((ROOT/'release.json').read_text())
    version=manifest['version']
    if args.bump:
        parts=list(map(int,version.split('.')))
        parts[-1]+=1
        version='.'.join(map(str,parts))
        manifest['version']=version
        manifest['release']='remember-'+version
        (ROOT/'release.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
        args.write=True
    if not re.fullmatch(r'\d+\.\d+\.\d+',version): raise SystemExit('Invalid version')
    errors=[]
    if manifest.get('release')!='remember-'+version: errors.append('release.json identity mismatch')
    state=json.loads((ROOT/'PROJECT_CURRENT_STATE.json').read_text())
    if args.write:
        state['release']['candidate']=version
        state.setdefault('workCheckpoint',{})['targetRelease']=version
        (ROOT/'PROJECT_CURRENT_STATE.json').write_text(json.dumps(state,ensure_ascii=False,indent=2)+'\n')
    if state['release'].get('candidate')!=version: errors.append('PROJECT_CURRENT_STATE.json release.candidate mismatch')
    if state.get('workCheckpoint',{}).get('targetRelease')!=version: errors.append('PROJECT_CURRENT_STATE.json workCheckpoint.targetRelease mismatch')
    for name in HTML:
        path=ROOT/(name+'.html')
        old=path.read_text()
        new=replacements(old,version)
        if args.write and old!=new: path.write_text(new)
        if old!=new and not args.write: errors.append(name+'.html: version drift')
        for token in ('name="remember-release" content="remember-'+version+'"','./remember-version.js?v='+version,'./auto-update.js?v='+version):
            if token not in (new if args.write else old): errors.append(name+'.html: missing '+token)
    path=ROOT/'remember-version.js'
    old=path.read_text()
    new=re.sub(r"(const fallback=')\d+\.\d+\.\d+(')",lambda m:m[1]+version+m[2],old)
    if args.write and old!=new: path.write_text(new)
    if old!=new and not args.write: errors.append('remember-version.js: fallback drift')
    if "const fallback='"+version+"'" not in (new if args.write else old): errors.append('remember-version.js: fallback missing')
    if 'remember-'+version not in (ROOT/'index.html').read_text(): errors.append('index.html: release identity missing')
    if errors:
        print('RELEASE SYNC FAILED:\n'+'\n'.join(errors),file=sys.stderr)
        raise SystemExit(1)
    print('RELEASE SYNC PASS '+version+' ('+('write' if args.write else 'check')+')')
if __name__=='__main__': main()
