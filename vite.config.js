import {localMessages} from './message-server.js';
import {defineConfig} from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {normalizeWorkflow} from './src/workflow-model.js';

const root=path.resolve('public/workflows');
const manifest=path.join(root,'index.json');
let mutation=Promise.resolve();
const list=async()=>{try{return JSON.parse(await fs.readFile(manifest,'utf8'));}catch(e){if(e.code==='ENOENT')return[];throw e;}};
const saveList=async items=>{const temporary=path.join(root,`${randomUUID()}.tmp`);await fs.writeFile(temporary,JSON.stringify(items,null,2));await fs.rename(temporary,manifest);};
function localWorkflowLibrary(){return{name:'local-workflow-library',configureServer(server){server.middlewares.use('/__portfolio/workflows',async(req,res)=>{
 const respond=(status,data)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));};
 const host=req.headers.host||'';if(!/^(localhost|127\.0\.0\.1):3000$/.test(host))return respond(403,{error:'工作流管理仅供本机访问。'});
 try{
  if(req.method==='GET')return respond(200,await list());
  if(req.method!=='POST')return respond(405,{error:'不支持的请求。'});
  if(req.headers.origin!==`http://${host}`)return respond(403,{error:'请在当前网站中导入工作流。'});
  if(!String(req.headers['content-type']).startsWith('application/json'))return respond(415,{error:'请选择 JSON 文件。'});
  let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>16*1024*1024)return respond(413,{error:'文件过大，请选择小于 5 MB 的工作流和小于 6 MB 的预览图。'});chunks.push(chunk);}
  let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{return respond(400,{error:'文件不是有效 JSON。'});}
  const title=String(body.title||'').trim().slice(0,100);if(!title)return respond(400,{error:'请填写工作流名称。'});
  const serialized=JSON.stringify(body.workflow);if(!serialized||Buffer.byteLength(serialized)>5*1024*1024)return respond(400,{error:'工作流文件不能超过 5 MB。'});
  let graph;try{graph=normalizeWorkflow(body.workflow);}catch(e){return respond(400,{error:e.message});}
  let preview=null;if(body.preview){const match=/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(body.preview);if(!match)return respond(400,{error:'预览图仅支持 PNG、JPEG 或 WebP。'});const buffer=Buffer.from(match[2],'base64');if(buffer.length>6*1024*1024)return respond(400,{error:'预览图不能超过 6 MB。'});const valid=(match[1]==='png'&&buffer.subarray(0,8).toString('hex')==='89504e470d0a1a0a')||(match[1]==='jpeg'&&buffer[0]===255&&buffer[1]===216)||(match[1]==='webp'&&buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WEBP');if(!valid)return respond(400,{error:'预览图格式与文件内容不符。'});preview={buffer,extension:match[1]};}
  const id=randomUUID();const item={id,title,description:String(body.description||'').trim().slice(0,1500),createdAt:new Date().toISOString(),file:`/workflows/${id}.json`,preview:preview?`/workflows/${id}.${preview.extension}`:null,...graph};
  const write=mutation.catch(()=>{}).then(async()=>{await fs.mkdir(root,{recursive:true});await fs.writeFile(path.join(root,`${id}.json`),serialized);if(preview)await fs.writeFile(path.join(root,`${id}.${preview.extension}`),preview.buffer);await saveList([item,...await list()]);});mutation=write;await write;respond(201,item);
 }catch(e){server.config.logger.error(`Workflow library: ${e.message}`);if(!res.writableEnded)respond(500,{error:'保存失败，请稍后重试；当前文件尚未确认保存。'});}
 });}};}
export default defineConfig({plugins:[localWorkflowLibrary(),localMessages()],server:{host:'127.0.0.1',port:3000,strictPort:true},build:{rollupOptions:{output:{manualChunks:{'hls-player':['hls.js']}}}}});
