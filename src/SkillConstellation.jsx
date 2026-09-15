import React from 'react';
import './skill-constellation.css';

const capabilityGroups = [
  ['01','产品思维','从用户行为与业务流程中识别痛点，拆解场景、需求与目标，形成可落地的产品方案。',['需求分析','方案设计','流程建模']],
  ['02','AI 应用与工作流','理解 LLM 应用架构，能结合 Prompt、RAG、Agent 与本地模型完成方案验证。',['DeepSeek','Prompt','RAG / Agent']],
  ['03','AIGC 与模型应用','熟悉 Stable Diffusion、LoRA 微调与 ComfyUI 工作流，从训练到封装都有实践。',['Stable Diffusion','LoRA','ComfyUI']],
  ['04','数据与业务数字化','用数据清洗、指标构建、自动化规则和可视化看板支撑运营分析与决策。',['Python / MySQL','Excel / SPSS','飞书多维表格']]
];

const skills = [
  ['需求分析','痛点识别'],
  ['PRD','方案表达'],
  ['用户流程','体验拆解'],
  ['Prompt','提示词工程'],
  ['DeepSeek','本地部署'],
  ['RAG','知识增强'],
  ['Agent','工具调用'],
  ['ComfyUI','工作流编排'],
  ['Stable Diffusion','图像生成'],
  ['LoRA','模型微调'],
  ['FLUX','视觉生成'],
  ['Python','数据处理'],
  ['MySQL','数据管理'],
  ['飞书多维表格','业务系统'],
  ['经营看板','指标体系'],
  ['自动化规则','流程提效'],
  ['Excel','数据整理'],
  ['SPSS','统计分析'],
  ['空间分析','城市数据'],
  ['AI Coding','快速原型']
];

export function SkillConstellation(){
  return <section id="skills" className="skills section skill-constellation">
    <div className="section-heading">
      <div><span className="eyebrow">CAPABILITIES & TOOLS</span><h2>Ideas into <em>reality.</em></h2></div>
      <p>以问题为起点，选择合适的工具。</p>
    </div>
    <div className="skill-orbit-wrap" aria-label="技能圆圈">
      {skills.map(([name,note],index)=>{
        const size = 86 + ((index * 29) % 54);
        const floatX = ((index * 37) % 46) - 23;
        const floatY = 12 + ((index * 17) % 32);
        const drift = ((index * 19) % 28) - 14;
        const duration = 5.2 + ((index * 7) % 36) / 10;
        return <div className="skill-orb" key={name} style={{'--i':index,'--size':`${size}px`,'--float-x':`${floatX}px`,'--float-y':`${floatY}px`,'--drift':`${drift}deg`,'--duration':`${duration}s`,'--delay':`${index*-.47}s`}}>
        <strong>{name}</strong><span>{note}</span>
      </div>;
      })}
    </div>
    <div className="capability-strip">
      {capabilityGroups.map(([n,title,desc,tags])=><article key={n}>
        <span>{n}</span>
        <div><h3>{title}</h3><p>{desc}</p><div className="skill-tags">{tags.map(t=><em key={t}>{t}</em>)}</div></div>
      </article>)}
    </div>
  </section>;
}
