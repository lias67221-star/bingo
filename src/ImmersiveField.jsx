import React,{useEffect,useRef} from 'react';
import './immersion.css';

export function ImmersiveField({host,enabled}){
 const canvas=useRef(null);
 useEffect(()=>{
  if(!enabled)return;
  const section=host.current,el=canvas.current,ctx=el.getContext('2d');if(!ctx)return;
  let width=1,height=1,frame=0,last=0,visible=true,clock=0;
  let aim={x:0,y:0},position={x:0,y:0};
  let seed=913;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  let dots=[];
  const resize=()=>{width=section.clientWidth;height=section.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.5);el.width=Math.round(width*dpr);el.height=Math.round(height*dpr);el.style.width=width+'px';el.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);dots=Array.from({length:width<700?150:340},()=>({x:(random()-.5)*width*2.7,y:(random()-.5)*height*2.1,z:random()*1300+150,r:random()*1.3+.4,phase:random()*Math.PI*2}));};
  const move=e=>{if(e.pointerType==='touch')return;const rect=section.getBoundingClientRect();aim={x:Math.max(-1,Math.min(1,(e.clientX-rect.left)/rect.width*2-1)),y:Math.max(-1,Math.min(1,(e.clientY-rect.top)/rect.height*2-1))};};
  const reset=()=>aim={x:0,y:0};
  const tick=now=>{
   if(!visible||document.hidden){frame=0;return;}
   const dt=Math.min(now-last||16,40);last=now;clock+=dt;
   const lerp=1-Math.exp(-dt/180);position.x+=(aim.x-position.x)*lerp;position.y+=(aim.y-position.y)*lerp;
   const progress=Math.max(0,Math.min(1,-section.getBoundingClientRect().top/height));
   section.style.setProperty('--camera-x',position.x.toFixed(4));section.style.setProperty('--camera-y',position.y.toFixed(4));section.style.setProperty('--hero-progress',progress.toFixed(4));
   ctx.clearRect(0,0,width,height);
   const cx=width*.5+position.x*38,cy=height*.32+position.y*24;
   for(const dot of dots){dot.z-=dt*.19;if(dot.z<65){dot.z=1450;dot.x=(random()-.5)*width*2.7;dot.y=(random()-.5)*height*2.1;}
    const depth=440/dot.z,x=cx+dot.x*depth,y=cy+dot.y*depth;
    if(x<-15||x>width+15||y<-15||y>height+15)continue;
    const center=(x<width*.43&&y>height*.18&&y<height*.82)?.4:1;
    const alpha=Math.min(.95,.38+(1-dot.z/1450)*.7)*center*(.8+.2*Math.sin(clock*.0015+dot.phase));
    const radius=Math.max(.4,Math.min(2.8,dot.r*depth));
    ctx.fillStyle=`rgba(189,215,255,${alpha})`;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
    if(dot.z<950){const prior=440/(dot.z+65);const tx=cx+dot.x*prior,ty=cy+dot.y*prior;const glow=ctx.createLinearGradient(tx,ty,x,y);glow.addColorStop(0,"rgba(120,177,255,0)");glow.addColorStop(1,`rgba(175,215,255,${alpha*.9})`);ctx.strokeStyle=glow;ctx.lineCap="round";ctx.lineWidth=radius*2.8;ctx.globalAlpha=.22;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(x,y);ctx.stroke();ctx.globalAlpha=1;ctx.lineWidth=Math.max(.8,radius*.65);ctx.stroke();if(dot.r>1.4&&dot.z<650){ctx.strokeStyle=`rgba(210,235,255,${alpha*.65})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x-radius*4,y);ctx.lineTo(x+radius*4,y);ctx.moveTo(x,y-radius*4);ctx.lineTo(x,y+radius*4);ctx.stroke();}}
   }
   el.dataset.frame=String(Math.floor(clock/100));frame=requestAnimationFrame(tick);
  };
  const resume=()=>{if(visible&&!document.hidden&&!frame){last=performance.now();frame=requestAnimationFrame(tick);}};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;section.dataset.inView=String(visible);if(!visible){cancelAnimationFrame(frame);frame=0;}else resume();},{threshold:0});observer.observe(section);
  const ro=new ResizeObserver(resize);ro.observe(section);resize();section.addEventListener('pointermove',move,{passive:true});section.addEventListener('mousemove',move,{passive:true});section.addEventListener('pointerleave',reset);document.addEventListener('visibilitychange',resume);resume();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();ro.disconnect();section.removeEventListener('pointermove',move);section.removeEventListener('mousemove',move);section.removeEventListener('pointerleave',reset);document.removeEventListener('visibilitychange',resume);for(const name of ['--camera-x','--camera-y','--hero-progress'])section.style.removeProperty(name);ctx.clearRect(0,0,width,height);};
 },[enabled,host]);
 return <><div className="nebula-light nebula-one" aria-hidden="true"/><div className="nebula-light nebula-two" aria-hidden="true"/><canvas className="depth-particles" ref={canvas} aria-hidden="true"/><div className="hero-vignette" aria-hidden="true"/></>;
}
