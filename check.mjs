import fs from 'node:fs';
import path from 'node:path';
const root=path.join(import.meta.dirname,'public');
let count=0;
for(const file of ['index.html','menu/index.html','company/index.html','recruit/index.html']){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(ids.length!==new Set(ids).size)throw Error('Duplicate ids: '+file);
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=m[1];if(/^https?:/.test(url))throw Error('Unexpected external request: '+url);
  const [relative,hash]=url.split('#');
  let target=relative?path.resolve(path.dirname(path.join(root,file)),relative):path.join(root,file);
  if(!target.startsWith(root+path.sep)&&target!==root)throw Error('Out of public path');
  if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  if(!fs.existsSync(target))throw Error('Missing asset: '+target);
  if(hash&&!fs.readFileSync(target,'utf8').includes(`id="${hash}"`))throw Error('Missing fragment: '+url);
  count++;
 }
 if(/mitsui|みつい|0112819321|tabelog|facebook\.com|instagram\.com/.test(html))throw Error('Reference identity remains');
 console.log('OK',file);
}
console.log(`Validated ${count} references and page IDs.`);
