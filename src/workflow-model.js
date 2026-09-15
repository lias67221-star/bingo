const text=(value,max=160)=>String(value??'').slice(0,max);
const coordinate=value=>Number.isFinite(Number(value))?Math.max(-100000,Math.min(100000,Number(value))):0;
export function normalizeWorkflow(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('请选择 ComfyUI 导出的工作流 JSON。');
 let nodes=[],links=[];
 if(Array.isArray(raw.nodes)){
  if(raw.nodes.length>400)throw new Error('暂时支持不超过 400 个节点的工作流。');
  nodes=raw.nodes.map((n,i)=>{if(!n||n.id===undefined||typeof n.type!=='string')throw new Error('工作流节点缺少 id 或 type。');const pos=n.pos;return{id:text(n.id,80),type:text(n.type),label:text(n.title||n.type),x:pos?coordinate(pos[0]):(i%4)*270,y:pos?coordinate(pos[1]):Math.floor(i/4)*140,inputs:Array.isArray(n.inputs)?n.inputs.map(x=>text(x?.name,60)).slice(0,30):[],outputs:Array.isArray(n.outputs)?n.outputs.map(x=>text(x?.name||x?.type,60)).slice(0,30):[]};});
  if(raw.links!==undefined&&!Array.isArray(raw.links))throw new Error('工作流连线格式无效。');
  links=(raw.links||[]).slice(0,4000).map(l=>Array.isArray(l)?{from:text(l[1],80),to:text(l[3],80)}:{from:text(l?.origin_id,80),to:text(l?.target_id,80)});
 }else{
  const source=raw.prompt&&typeof raw.prompt==='object'&&!Array.isArray(raw.prompt)?raw.prompt:raw;
  const entries=Object.entries(source).filter(([,n])=>n&&typeof n==='object'&&typeof n.class_type==='string');
  if(entries.length>400)throw new Error('暂时支持不超过 400 个节点的工作流。');
  nodes=entries.map(([id,n],i)=>({id:text(id,80),type:text(n.class_type),label:text(n._meta?.title||n.class_type),x:(i%4)*270,y:Math.floor(i/4)*150,inputs:Object.keys(n.inputs||{}).slice(0,30),outputs:[]}));
  const ids=new Set(nodes.map(n=>n.id));
  for(const [id,n] of entries)for(const value of Object.values(n.inputs||{}))if(Array.isArray(value)&&value.length===2&&ids.has(String(value[0])))links.push({from:String(value[0]),to:id});
 }
 if(!nodes.length)throw new Error('没有找到工作流节点。请使用 ComfyUI 的工作流导出或 API 格式导出。');
 if(new Set(nodes.map(n=>n.id)).size!==nodes.length)throw new Error('工作流包含重复节点 ID。');
 const ids=new Set(nodes.map(n=>n.id));links=links.filter(l=>ids.has(l.from)&&ids.has(l.to)).slice(0,4000);
 return{nodes,links,nodeCount:nodes.length,linkCount:links.length,format:Array.isArray(raw.nodes)?'ComfyUI Workflow':'ComfyUI API'};
}
