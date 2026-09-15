import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import './portfolio.css';

const selections=[
 {id:'urban',number:'01',category:'SYSTEMS & SPACES',title:'边缘行动，网络再生',subtitle:'新联厂社区生态化改造设计',award:'2023 WUPEN 城市设计国际竞赛 · 二等奖',cover:10,pages:[4,5,6,7,8,9,10],captions:['项目总览与场地问题','区位背景、现状调研与问题分析','行动者网络理论与设计策略','规划结构、道路网络与功能分区','生态技术与空间更新策略','行动空间、社区关系与资源链接','行动者网络、共享平台与空间方案'],intro:'将居民、公共服务、工业遗产与生态资源放进同一个系统，探索老社区如何重新建立连接。',insight:'从单一空间改造，转向多主体参与的系统设计。',steps:[['识别问题','梳理道路割裂、设施老化与资源闲置，理解居民和社区服务的实际需求。'],['组织方案','以行动者网络理论连接居民、商户与公共服务，形成分阶段行动与共享平台策略。'],['产品能力迁移','利益相关者分析、复杂系统拆解，以及把抽象策略转化为可讨论的可视化方案。']],tags:['系统思维','利益相关者分析','可视化表达']},
 {id:'research',number:'02',category:'RESEARCH & INSIGHTS',title:'共停车，享安“宁”',subtitle:'南京市共享停车公众认知度及现状调研',cover:13,pages:[11,12,13,14,15,16],captions:['共享停车调研 · 项目封面','研究背景、相关概念与调研框架','服务现状、用户认知与参与意愿','用户特征、服务使用与空间分布','案例分析与服务满意度评价','IPA 分析、主体关系与优化建议'],intro:'为什么有共享车位，用户却不一定使用？从认知、参与渠道到服务体验，用调研理解真实的使用障碍。',insight:'把“用户愿不愿意用”，拆解成可研究、可改进的问题。',steps:[['研究问题','围绕共享停车的认知度、参与意愿和实际使用体验展开问卷与走访调研。'],['形成判断','结合服务现状与 IPA 重要性—表现分析，区分需要重点改进和继续保持的服务要素。'],['产品能力迁移','用户研究、服务路径分析、需求优先级判断，以及基于证据提出优化建议。']],tags:['用户研究','IPA 分析','服务体验']},
 {id:'visual',number:'03',category:'DESIGN & OBSERVATION',title:'在空间里，练习观察',subtitle:'空间设计、手绘与摄影精选',cover:22,pages:[22,23],captions:['居住区与文化创意产业园设计','建筑设计、手绘与摄影'],intro:'从平面组织到立体空间，从手绘到摄影，在不同尺度里练习观察、组织信息与表达想法。',insight:'好的表达，让复杂的想法变得可以被理解。',steps:[['空间组织','通过居住区和文创产业园课程设计，探索功能、流线与空间体验之间的关系。'],['视觉表达','用总平面、分析图、建筑效果图和手绘呈现设计过程，用摄影记录日常观察。'],['产品能力迁移','信息层级、视觉叙事与方案沟通，让团队围绕同一幅画面讨论问题。']],tags:['空间设计','信息组织','视觉叙事']}
];
function PageViewer({selection,onClose}){
 const ref=useRef(null);const [index,setIndex]=useState(0);const [zoom,setZoom]=useState(false);
 useEffect(()=>{const el=ref.current;el.showModal();return()=>el.close();},[]);
 const move=d=>{setIndex(n=>(n+d+selection.pages.length)%selection.pages.length);setZoom(false);};
 return createPortal(<dialog ref={ref} className="page-viewer" aria-labelledby="viewer-title" onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose();}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}}>
  <div className="viewer-header"><div><span className="eyebrow">PORTFOLIO ARCHIVE</span><h2 id="viewer-title">{selection.title}</h2></div><button className="round-button" aria-label="关闭作品预览" onClick={onClose}>×</button></div>
  <div className={'viewer-canvas'+(zoom?' zoomed':'')}><button className="page-image-button" aria-label={zoom?'缩小作品页':'放大作品页'} onClick={()=>setZoom(!zoom)}><img src={`/portfolio/page-${String(selection.pages[index]).padStart(2,'0')}.webp`} alt={`${selection.title}：${selection.captions[index]}`} /></button></div>
  <div className="viewer-page-nav" aria-label="选择作品页">{selection.pages.map((page,i)=><button key={page} aria-label={`第 ${i+1} 页：${selection.captions[i]}`} aria-current={index===i?"page":undefined} onClick={()=>{setIndex(i);setZoom(false);}}>{String(i+1).padStart(2,"0")}</button>)}</div>
  <div className="viewer-controls"><div><strong>{selection.captions[index]}</strong><span>完整图版 · 原作品集第 {selection.pages[index]} 页</span></div><div className="viewer-buttons"><button aria-label="上一页" onClick={()=>move(-1)}>←</button><span>{index+1} / {selection.pages.length}</span><button aria-label="下一页" onClick={()=>move(1)}>→</button><button onClick={()=>setZoom(!zoom)}>{zoom?'适应窗口':'放大查看'}</button><a href={`/portfolio/page-${String(selection.pages[index]).padStart(2,'0')}.webp`} target="_blank" rel="noreferrer">原图 ↗</a></div></div>
 </dialog>,document.body);
}
export function AwardWorks(){
 const [selected,setSelected]=useState(null);
 const works=selections.slice(0,2).map(s=>s.id==='research'?{...s,award:'2022 WUPEN 城市可持续调研报告国际竞赛 · 提名奖'}:s);
 return <section className="award-page"><a className="award-back" href="#work">← 返回 AI 项目</a><div className="award-page-heading"><span className="eyebrow">AWARD-WINNING WORK</span><h1>获奖作品<span>Recognized <em>explorations.</em></span></h1><p>两段关于城市与人的探索。</p></div><div className="award-work-grid">{works.map(s=><article className="award-work-card" key={s.id}><button className="archive-cover" aria-label={'查看'+s.title+'获奖作品'} onClick={()=>setSelected(s)}><img src={'/portfolio/page-'+String(s.cover).padStart(2,'0')+'.webp'} alt={s.subtitle+'作品图版'}/><span className="archive-open">查看作品 <span>↗</span></span></button><div className="award-work-info"><span className="award-chip">✧ {s.award}</span><h2>{s.title}</h2><p className="archive-subtitle">{s.subtitle}</p><p className="archive-description">{s.intro}</p><div className="tags">{s.tags.map(t=><span key={t}>{t}</span>)}</div><button className="text-button" onClick={()=>setSelected(s)}>完整图版 · {s.pages.length} 页 ↗</button></div></article>)}</div>{selected&&<PageViewer key={selected.id} selection={selected} onClose={()=>setSelected(null)}/>}</section>;
}
