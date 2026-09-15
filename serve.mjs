import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.join(import.meta.dirname,'public');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp'};
http.createServer(async(req,res)=>{try{let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/sample_food2\//,'/');let file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end();}if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404);res.end('Not found');}}).listen(4182,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4182/'));
