import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './cosmic.css';
import { CosmicHero, CosmicNav, CosmicVideo, useReveal } from './Cosmic';
import { AwardWorks } from './Portfolio';
import { StarCompanion } from './StarCompanion';
import { WorkflowLab } from './WorkflowLab';
import { ProjectOneGallery } from './ProjectOneGallery';
import { FeishuDashboard } from './FeishuDashboard';
import { SkillConstellation } from './SkillConstellation';
import { OrbitRibbon, useScrollStory } from './ScrollStory';
import './project-expansion.css';
import { MessageCompanion } from './MessageCompanion';
import './portfolio-polish.css';

const projects = [
  {id:'01',kind:'AI PRODUCT · AIGC',title:'让每个人，都能参与城市设计。',name:'基于 LLM + AIGC 的城市空间设计智能辅助系统',date:'2024.09 — 至今',role:'项目负责人',tags:['DeepSeek','ComfyUI','LoRA','Prompt Engineering'],desc:'把居民的自然语言需求，转化为可视化的街道更新方案。连接专业设计与公众表达，降低参与城市设计的沟通成本。',problem:'城市更新过程中，居民缺乏专业设计表达能力，真实需求难以直接转化为规划方案。',solution:'本地部署 DeepSeek，完成口语需求的语义理解、要素提取与专业化改写；基于苏州古城街巷数据训练 LoRA，通过 ComfyUI 串联文本理解、Prompt 转换、模型调用和图像生成。',result:'将模型能力封装至小程序，支持输入街道改造需求并获得实时生成方案，完成从需求输入到前端反馈的端到端应用验证。'},
  {id:'02',kind:'PRODUCT OPERATIONS · DATA',title:'让业务全链路，成为可追踪的数据。',name:'飞书多维表格业务全链路数字化项目',date:'2025.06 — 2025.09',role:'独立负责 · 实习',tags:['飞书多维表格','流程自动化','数据建模','经营看板'],desc:'从分散的客户线索，到贯穿获客、跟进、转化与成交的数字化系统，让经营决策有据可依。',problem:'客户线索分散，跟进依赖人工记录，获客来源难以与最终成交结果关联。',solution:'梳理客户生命周期，设计客户、渠道、跟进记录、成交结果等核心数据表；配置状态流转、自动提醒、跨表关联与统计规则，构建销售漏斗和渠道转化看板。',result:'覆盖 5 个业务部门、8 名销售人员与 800+ 客户；通过自动化周报和月报，将经营数据整理效率提升约 70%，并识别高投入、低转化的渠道风险。'},
  {id:'03',kind:'SPATIAL INTELLIGENCE · ML',title:'用多源数据，理解城市出行。',name:'基于多源数据与深度重力模型的机场服务范围预测系统',date:'2025.09 — 至今',role:'项目负责人',tags:['Python','MySQL','Deep Gravity Model','空间分析'],desc:'融合手机信令、POI 与城市空间数据，探索机场服务范围与居民出行需求之间的关系。',problem:'机场布局与交通规划需要理解不同区域的出行需求，以及机场实际服务覆盖范围。',solution:'使用 MySQL 管理多源数据，结合 Python 进行数据清洗、字段标准化与特征提取；基于深度重力模型，将人口规模、交通条件与城市功能纳入预测分析。',result:'开展服务范围预测、空间分布模拟与可视化分析，评估不同区域覆盖能力和影响因素，为机场选址与交通资源配置提供量化依据。'}
];
function Arrow({diagonal=false}) { return <span aria-hidden="true">{diagonal?'↗':'↗'}</span> }
function Diagram({type}) {
 if(type===0) return <div className="diagram ai"><div className="diagram-top"><span>URBAN CO-CREATION</span><span>WORKFLOW / 01</span></div><div className="prompt"><span className="tiny-label">居民的想法</span><p>“希望街道多一些绿化，<br/>有可以坐下来休息的地方。”</p><span className="prompt-dot">↵</span></div><div className="connector"/><div className="workflow"><div>LLM<span>理解需求</span></div><b>→</b><div>Prompt<span>专业转译</span></div><b>→</b><div>AIGC<span>生成方案</span></div></div><div className="diagram-bottom"><span>自然语言 → 可视化方案</span><span className="orange">人本设计 × 生成式 AI</span></div></div>;
 if(type===1) return <div className="diagram data"><div className="diagram-top"><span>BUSINESS INTELLIGENCE</span><span>WORKFLOW / 02</span></div><div className="data-heading">从线索到成交<span>全链路数据关联</span></div><div className="funnel">{['获客','跟进','转化','成交'].map((x,i)=><div key={x} style={{width:`${100-i*15}%`,opacity:1-i*.15}}>{x}<span>0{i+1}</span></div>)}</div><div className="data-metrics"><div><b>800+</b><span>客户数据</span></div><div><b>70%<small> ↑</small></b><span>数据整理效率提升约</span></div><div><b>5</b><span>业务部门</span></div></div></div>;
 return <div className="diagram spatial"><div className="diagram-top"><span>SPATIAL INTELLIGENCE</span><span>MODEL / 03</span></div><div className="model-input"><span>手机信令</span><span>POI 数据</span><span>城市空间属性</span></div><div className="model-lines">↓<span>↓</span>↓</div><div className="gravity"><span>多源数据融合</span><strong>Deep Gravity</strong><span>机场服务范围预测模型</span></div><div className="model-output">服务范围预测 <span>·</span> 空间分布模拟 <span>·</span> 规划决策</div></div>;
}
function ProjectCard({p,i,onOpen}){
 const [hover,setHover]=useState(false),[pinned,setPinned]=useState(false),[focused,setFocused]=useState(false);
 const expanded=hover||pinned||focused;
 return <article className={'project project-'+i} data-expanded={expanded} tabIndex={0} onClick={e=>{if(!expanded&&!e.target.closest('button,a'))setPinned(true);}} onDoubleClick={e=>{if(!e.target.closest('button,a'))onOpen(p);}} onPointerEnter={e=>{if(e.pointerType==='mouse')setHover(true);}} onPointerLeave={()=>setHover(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}}>
 <div className="project-collapsed" aria-hidden={expanded}><span className="collapsed-number">{p.id}</span><div><small>{p.kind}</small><strong>{p.name}</strong></div><em>{p.role}</em><span className="collapsed-hint">靠近展开 ↗</span></div>
 <Diagram type={i}/><div className="project-info"><div className="project-meta"><span>{p.kind}</span><span>{p.id} / 03</span></div><h3>{p.title}</h3><h4>{p.name}</h4><p>{p.desc}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className="project-bottom"><span>{p.role}<br/><small>{p.date}</small></span><button onClick={()=>onOpen(p)} className="project-link">{i===0?'项目详情与工作流':'了解项目'} <Arrow/></button></div><button className="expand-project" aria-expanded={expanded} aria-controls={'project-extra-'+p.id} onClick={e=>{e.stopPropagation();setPinned(v=>!v);setFocused(false);setHover(false);e.currentTarget.blur();}}>{expanded?'收起项目速览 −':'展开项目速览 ＋'}</button></div>
 <div className="project-expansion" id={'project-extra-'+p.id} aria-hidden={!expanded}><div><div className="expansion-heading"><span>PROJECT INSIGHTS / {p.id}</span><span>{i===0?'从需求到生成，打通完整链路':i===1?'从分散线索到可追溯经营':'从多源信息到空间决策'}</span></div><div className="insight-grid">{[['01','问题与场景',p.problem],['02','实现与方法',p.solution],['03','成果与价值',p.result]].map(([n,title,body])=><div className="project-insight" key={n}><span>{n}</span><h4>{title}</h4><p>{body}</p></div>)}</div>{i===0&&<p className="workflow-preview-note">两套实际工作流 · 图生图 / 文生图 · DeepSeek × FLUX × LoRA<span>点击「项目详情与工作流」查看节点画布 ↗</span></p>}</div></div>
 </article>;
}
function App(){
 useEffect(()=>{if(location.hash==='#workflow'){history.replaceState(null,'','#work');document.getElementById('work')?.scrollIntoView({behavior:'instant'});}},[]);
 const [awardPage,setAwardPage]=useState(location.hash==='#awards');
 useEffect(()=>{const update=()=>setAwardPage(location.hash==='#awards');window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update);},[]);
 useReveal(awardPage);
 useScrollStory(awardPage);
 useEffect(()=>{if(awardPage){window.scrollTo({top:0,behavior:'instant'});return;}const anchor=location.hash.slice(1);if(!anchor)return;let active=true;let frame;const align=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(active&&location.hash.slice(1)===anchor)document.getElementById(anchor)?.scrollIntoView({behavior:'instant',block:'start'});});};const stop=()=>active=false;align();document.fonts?.ready.then(align);window.addEventListener('portfolio-content-ready',align);for(const name of ['wheel','pointerdown','touchstart','keydown'])window.addEventListener(name,stop,{once:true,passive:true});return()=>{active=false;cancelAnimationFrame(frame);window.removeEventListener('portfolio-content-ready',align);for(const name of ['wheel','pointerdown','touchstart','keydown'])window.removeEventListener(name,stop);};},[awardPage]);
 const [selected,setSelected]=useState(null); const [copied,setCopied]=useState(false); const dialog=useRef(null);
 useEffect(()=>{if(selected)dialog.current?.showModal();else dialog.current?.close();},[selected]);
 async function copy(){try{await navigator.clipboard.writeText('lias67221@gmail.com');setCopied(true);setTimeout(()=>setCopied(false),2500);}catch{window.location.href='mailto:lias67221@gmail.com';}}
 return <><CosmicNav/><StarCompanion/><MessageCompanion/><main>{awardPage?<AwardWorks/>:<><CosmicHero/><OrbitRibbon/>
 <section id="work" className="work section"><div className="section-heading"><div><span className="eyebrow">SELECTED WORK</span><h2>Featured <em>projects.</em></h2></div><p>从真实问题出发，<br/>探索技术与业务之间的连接。</p></div><div className="project-grid">{projects.map((p,i)=><ProjectCard p={p} i={i} key={p.id} onOpen={setSelected}/>)}</div></section>
 <section id="about" className="about section"><div><span className="eyebrow">A LITTLE ABOUT ME</span><h2>不止于技术，<br/>更关心它如何<br/><span className="orange">为人所用。</span></h2><p>城市规划让我习惯从人的需求与真实场景出发，理解复杂系统中的关系。如今，我把这份思考带到 AI 产品中，关注技术如何转化为可理解、可使用的体验。</p><p>我喜欢亲手验证想法：从需求分析、数据处理，到模型工作流搭建与应用封装，让产品方案在实践中迭代。</p></div><div className="education"><span className="eyebrow">EDUCATION / 学习经历</span><article><span className="education-date">2024.09 — 至今</span><h3>苏州科技大学 <span>硕士</span></h3><h4>城市规划科学与技术</h4><p>人工智能辅助城市空间设计、AIGC 应用、空间智能</p></article><article><span className="education-date">2019.09 — 2024.06</span><h3>南京林业大学 <span>本科</span></h3><h4>城乡规划</h4><p>毕业论文：基于 AI 生成模型 Stable Diffusion 的城市空间图像生成研究</p></article><div className="education-note">从理解城市，到理解产品。<span>持续探索中 ↗</span></div></div></section>
 <SkillConstellation/>
 <section id="contact" className="contact"><CosmicVideo footer/><div className="contact-main"><span className="eyebrow">HAVE SOMETHING IN MIND?</span><h2>Let’s build<br/><em>something meaningful.</em></h2><p>欢迎交流 AI 产品、AIGC 应用与新的工作机会。</p></div><div className="contact-links"><a href="mailto:lias67221@gmail.com">lias67221@gmail.com <Arrow/></a><div><a href="tel:+8613512519182">(+86) 135 1251 9182</a><button onClick={copy}>{copied?'已复制 ✓':'复制邮箱'}</button></div><span role="status" className="sr-only">{copied?'邮箱已复制到剪贴板':''}</span></div></section></>}</main>
 <footer><a className="footer-name" href="#">樊冰冰 <span>/ AI PRODUCT PORTFOLIO</span></a><span>保持好奇，持续构建。</span><a href="#">回到顶部 ↑</a></footer>
 <dialog className={`project-dialog ${selected?.id==='01'?'with-workflow':''} ${selected?.id==='02'?'with-dashboard':''}`} ref={dialog} onCancel={()=>setSelected(null)} onClick={e=>{if(e.target===dialog.current)setSelected(null)}} aria-labelledby="dialog-title"><button className="dialog-close" aria-label="关闭项目详情" onClick={()=>setSelected(null)}>×</button>{selected&&<><span className="eyebrow">PROJECT {selected.id} / {selected.role}</span><h2 id="dialog-title">{selected.name}</h2><p className="dialog-date">{selected.date}</p>{[['问题与场景',selected.problem],['我的解决方案',selected.solution],['成果与价值',selected.result]].map(([title,body])=><section key={title}><h3>{title}</h3><p>{body}</p></section>)}<div className="tags">{selected.tags.map(t=><span key={t}>{t}</span>)}</div>{selected.id==='01'&&<><ProjectOneGallery/><WorkflowLab/></>}{selected.id==='02'&&<FeishuDashboard/>}</>}</dialog></>;
}
createRoot(document.getElementById('root')).render(<App/>);
