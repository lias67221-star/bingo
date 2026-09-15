import React from 'react';
import './feishu-dashboard.css';

const acquisitionRows = [
  ['官网表单', '156', '42', '26.9%'],
  ['小红书私信', '132', '31', '23.5%'],
  ['转介绍', '94', '38', '40.4%'],
  ['社群活动', '78', '19', '24.4%']
];

const channels = [
  ['转介绍', 40],
  ['官网表单', 27],
  ['社群活动', 24],
  ['小红书', 23]
];

const trend = [28, 36, 44, 39, 52, 61, 70];
const funnel = [
  ['获客', 800],
  ['有效线索', 432],
  ['方案沟通', 214],
  ['成交', 86]
];
const status = [
  ['待跟进', 34, '#9bbcff'],
  ['跟进中', 28, '#c2a8ff'],
  ['已成交', 22, '#a8ead0'],
  ['流失', 16, '#7b8798']
];

export function FeishuDashboard(){
  const maxTrend = Math.max(...trend);
  return <section className="feishu-dashboard" aria-label="飞书多维表格经营看板示例">
    <div className="feishu-dashboard-head">
      <div>
        <span className="eyebrow">FEISHU BASE DASHBOARD</span>
        <h3>获客表格 × 转化成交表格</h3>
        <p>通过客户 ID、渠道来源、跟进状态与成交结果字段进行跨表关联，同步后自动生成经营看板，用来追踪销售漏斗、渠道质量和每周转化变化。</p>
      </div>
      <div className="sync-badge"><span/> 自动同步 · 示例看板</div>
    </div>

    <div className="base-flow">
      <div className="base-table-card">
        <small>TABLE 01</small>
        <strong>获客来源表</strong>
        <ul>
          <li>客户 ID</li>
          <li>来源渠道</li>
          <li>负责人</li>
          <li>首次触达时间</li>
        </ul>
      </div>
      <div className="sync-line"><span>字段关联</span><i/></div>
      <div className="base-table-card">
        <small>TABLE 02</small>
        <strong>转化成交表</strong>
        <ul>
          <li>跟进状态</li>
          <li>转化阶段</li>
          <li>成交金额</li>
          <li>流失原因</li>
        </ul>
      </div>
      <div className="sync-line"><span>实时聚合</span><i/></div>
      <div className="base-table-card dashboard-card">
        <small>DASHBOARD</small>
        <strong>经营看板</strong>
        <p>渠道转化、销售漏斗、成交趋势、异常提醒</p>
      </div>
    </div>

    <div className="dashboard-grid">
      <article className="chart-card kpi-card">
        <span>本月有效客户</span>
        <strong>432</strong>
        <small>较上月 +18.6%</small>
      </article>
      <article className="chart-card kpi-card">
        <span>成交转化率</span>
        <strong>19.9%</strong>
        <small>转介绍渠道表现最佳</small>
      </article>
      <article className="chart-card channel-chart">
        <div className="chart-title"><strong>渠道转化率</strong><span>按来源聚合</span></div>
        {channels.map(([name,value])=><div className="bar-row" key={name}><span>{name}</span><i style={{width:`${value*2}%`}}/><em>{value}%</em></div>)}
      </article>
      <article className="chart-card funnel-chart">
        <div className="chart-title"><strong>销售漏斗</strong><span>获客 → 成交</span></div>
        {funnel.map(([name,value],index)=><div className="funnel-bar" key={name} style={{width:`${100-index*16}%`}}><span>{name}</span><em>{value}</em></div>)}
      </article>
      <article className="chart-card line-chart">
        <div className="chart-title"><strong>周成交趋势</strong><span>自动周报字段</span></div>
        <svg viewBox="0 0 320 135" role="img" aria-label="周成交趋势折线图">
          <defs><linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b8d5ff" stopOpacity=".5"/><stop offset="100%" stopColor="#b8d5ff" stopOpacity="0"/></linearGradient></defs>
          {[0,1,2,3].map(n=><line key={n} x1="0" x2="320" y1={22+n*28} y2={22+n*28}/>)}
          <path className="trend-area" d={`M 0 128 ${trend.map((v,i)=>`L ${i*(320/(trend.length-1))} ${122-(v/maxTrend)*92}`).join(' ')} L 320 128 Z`}/>
          <path className="trend-line" d={`M ${trend.map((v,i)=>`${i*(320/(trend.length-1))} ${122-(v/maxTrend)*92}`).join(' L ')}`}/>
          {trend.map((v,i)=><circle key={i} cx={i*(320/(trend.length-1))} cy={122-(v/maxTrend)*92} r="4"/>)}
        </svg>
      </article>
      <article className="chart-card status-chart">
        <div className="chart-title"><strong>客户状态占比</strong><span>跟进状态字段</span></div>
        <div className="donut" aria-hidden="true"/>
        <div className="status-list">{status.map(([name,value,color])=><span key={name}><i style={{background:color}}/> {name} · {value}%</span>)}</div>
      </article>
      <article className="chart-card table-preview">
        <div className="chart-title"><strong>同步后的渠道表</strong><span>示例数据</span></div>
        <table>
          <thead><tr><th>来源</th><th>线索</th><th>成交</th><th>转化</th></tr></thead>
          <tbody>{acquisitionRows.map(row=><tr key={row[0]}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </article>
      <article className="chart-card insight-card">
        <div className="chart-title"><strong>运营洞察</strong><span>自动提醒</span></div>
        <p>转介绍渠道线索量不是最高，但成交率最高；小红书线索多、转化偏低，适合继续拆分内容来源与跟进话术，定位低转化环节。</p>
      </article>
    </div>
  </section>;
}
