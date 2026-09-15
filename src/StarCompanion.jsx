import React, {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import './star-companion.css';

export function StarCompanion(){
 const ref=useRef(null),image=useRef(null),beam=useRef(null),beamEcho=useRef(null),beamGlow=useRef(null),beamEnd=useRef(null);
 const [enabled,setEnabled]=useState(()=>{try{return localStorage.getItem('star-companion-v2')!=='off';}catch{return true;}});
 useEffect(()=>{
  if(!enabled)return;
  const element=ref.current;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,lastTouch=-Infinity,current=null,target=null,previous=0,lastDialog=null,linked=null,mouse=null,pulseTimer=0;
  const candidates='.project, .award-work-card, .award-mini-badge, .graph-shell, .workflow-concept, .page-image-button, .chart-card, .base-table-card, .skill-orb, .capability-strip article, a.button, button.button';
  const clearLink=()=>{if(linked){linked.classList.remove('star-linked','star-pulse');linked.style.setProperty('--star-energy','0');}linked=null;element.dataset.linked='false';element.dataset.fused='false';};
  const proximity=()=>{
   if(!mouse)return clearLink();
   const modal=document.querySelector('dialog[open]');
   const scope=modal||document;let best=null,nearest=105;
   for(const candidate of scope.querySelectorAll(candidates)){
    if(candidate.matches(':disabled')||candidate.getAttribute('aria-disabled')==='true')continue;
    const b=candidate.getBoundingClientRect();if(b.width<1||b.height<1||b.bottom<0||b.top>innerHeight||b.right<0||b.left>innerWidth)continue;
    const distance=Math.hypot(Math.max(b.left-mouse.x,0,mouse.x-b.right),Math.max(b.top-mouse.y,0,mouse.y-b.bottom));
    if(distance<nearest){nearest=distance;best=candidate;}
   }
   if(best!==linked){clearLink();linked=best;if(linked)linked.classList.add('star-reactive','star-linked');}
   if(!linked)return;
   const strength=String(Math.max(.1,1-nearest/105));linked.style.setProperty('--star-energy',strength);element.style.setProperty('--link-strength',strength);
   element.dataset.linked='true';element.dataset.fused=String(nearest===0);
  };
  const topLayer=()=>{const modal=document.querySelector('dialog[open]');if(element.showPopover){try{if(!element.matches(':popover-open')||modal!==lastDialog){if(element.matches(':popover-open'))element.hidePopover();element.showPopover();}}catch{}}lastDialog=modal;};
  const paint=()=>{
   element.style.transform=`translate3d(${current.x}px,${current.y}px,0)`;
   if(image.current)image.current.style.rotate=reduced.matches?'0deg':`${Math.max(-12,Math.min(12,(target.x-current.x)*.24))}deg`;
   if(!linked)return;
   if(!linked.isConnected){clearLink();return;}
   const b=linked.getBoundingClientRect();let ax=Math.max(b.left,Math.min(mouse.x,b.right)),ay=Math.max(b.top,Math.min(mouse.y,b.bottom));
   if(mouse.x>=b.left&&mouse.x<=b.right&&mouse.y>=b.top&&mouse.y<=b.bottom){
    const sides=[{d:mouse.x-b.left,x:b.left,y:mouse.y},{d:b.right-mouse.x,x:b.right,y:mouse.y},{d:mouse.y-b.top,x:mouse.x,y:b.top},{d:b.bottom-mouse.y,x:mouse.x,y:b.bottom}];
    const edge=sides.reduce((a,c)=>c.d<a.d?c:a);ax=edge.x;ay=edge.y;
   }
   const dx=ax-current.x-36,dy=ay-current.y-36,bend=Math.min(32,Math.hypot(dx,dy)*.18);
   const curve=`M 0 0 Q ${dx*.5-bend} ${dy*.5+bend} ${dx} ${dy}`;
   beam.current?.setAttribute('d',curve);beamGlow.current?.setAttribute('d',curve);
   beamEcho.current?.setAttribute('d',`M 0 0 Q ${dx*.5+bend} ${dy*.5-bend} ${dx} ${dy}`);
   beamEnd.current?.setAttribute('transform',`translate(${dx} ${dy})`);
   linked.style.setProperty('--star-x',`${ax-b.left}px`);linked.style.setProperty('--star-y',`${ay-b.top}px`);
  };
  const animate=now=>{const delta=Math.min(now-previous||16,40);previous=now;const k=1-Math.exp(-delta/28);current.x+=(target.x-current.x)*k;current.y+=(target.y-current.y)*k;paint();if(Math.abs(target.x-current.x)+Math.abs(target.y-current.y)>.15)frame=requestAnimationFrame(animate);else{current={...target};paint();frame=0;}};
  const move=event=>{
   if(event.pointerType==='touch'||event.sourceCapabilities?.firesTouchEvents){lastTouch=performance.now();element.dataset.visible='false';clearLink();return;}
   if(performance.now()-lastTouch<700)return;
   mouse={x:event.clientX,y:event.clientY};proximity();
   target={x:Math.max(0,Math.min(event.clientX+10,innerWidth-76)),y:Math.max(0,Math.min(event.clientY+10,innerHeight-76))};
   topLayer();element.dataset.visible='true';element.dataset.hover=String(!!event.target.closest?.('a,button,input,textarea,select,[role="button"]'));
   if(!current||reduced.matches){current={...target};cancelAnimationFrame(frame);frame=0;paint();}
   else if(!frame){previous=performance.now();frame=requestAnimationFrame(animate);}
  };
  const hide=()=>{element.dataset.visible='false';element.dataset.press='false';current=null;mouse=null;clearLink();cancelAnimationFrame(frame);frame=0;};
  const down=event=>{if(event.pointerType==='touch'){lastTouch=performance.now();hide();return;}element.dataset.press='true';if(linked&&linked.contains(event.target)){const card=linked;clearTimeout(pulseTimer);card.classList.add('star-pulse');pulseTimer=setTimeout(()=>card.classList.remove('star-pulse'),650);}};
  const up=()=>element.dataset.press='false';
  const reposition=()=>{if(current&&mouse){proximity();paint();}};
  const observer=new MutationObserver(()=>{const modal=document.querySelector('dialog[open]');if(linked&&(!linked.isConnected||(modal&&!modal.contains(linked))))clearLink();});observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});
  document.addEventListener('pointermove',move,{passive:true});
  document.addEventListener('mousemove',move,{passive:true});
  document.addEventListener('pointerdown',down,{passive:true});
  document.addEventListener('pointerup',up,{passive:true});
  document.documentElement.addEventListener('pointerleave',hide);
  document.documentElement.addEventListener('mouseleave',hide);
  window.addEventListener('blur',hide);
  window.addEventListener('scroll',reposition,{capture:true,passive:true});window.addEventListener('resize',reposition,{passive:true});
  return()=>{cancelAnimationFrame(frame);clearTimeout(pulseTimer);clearLink();observer.disconnect();document.querySelectorAll('.star-reactive').forEach(node=>{node.classList.remove('star-reactive','star-linked','star-pulse');for(const name of ['--star-energy','--star-x','--star-y'])node.style.removeProperty(name);});document.removeEventListener('pointermove',move);document.removeEventListener('mousemove',move);document.removeEventListener('pointerdown',down);document.removeEventListener('pointerup',up);document.documentElement.removeEventListener('pointerleave',hide);document.documentElement.removeEventListener('mouseleave',hide);window.removeEventListener('blur',hide);window.removeEventListener('scroll',reposition,true);window.removeEventListener('resize',reposition);try{if(element.matches(':popover-open'))element.hidePopover();}catch{}};
 },[enabled]);
 const toggle=()=>setEnabled(value=>{try{localStorage.setItem('star-companion-v2',value?'off':'on');}catch{}return !value;});
 return <>{enabled&&createPortal(<div ref={ref} popover="manual" className="star-companion" aria-hidden="true"><svg className="star-rays" width="1" height="1"><path ref={beamGlow} className="star-ray-glow"/><path ref={beam} className="star-ray"/><path ref={beamEcho} className="star-ray-echo"/><g ref={beamEnd} className="star-ray-end"><circle className="star-contact-core" r="3"/><circle className="star-contact-ring" r="9"/><circle className="star-contact-ring delayed" r="9"/></g></svg><span className="star-aura"/><img ref={image} src="/star-companion.png" alt="" draggable="false"/><span className="star-spark">✧</span></div>,document.body)}<button className="companion-toggle" onClick={toggle} aria-pressed={enabled} title={enabled?'让小星灵休息':'唤醒小星灵'}><img src="/star-companion.png" alt=""/>小星灵 {enabled?'ON':'OFF'}</button></>;
}
