/* Service links retain real project URLs and use the existing project viewer. */
document.querySelectorAll('[data-service-project]').forEach(link=>{
  link.addEventListener('click',event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const project=Object.values(datasets).flat().find(p=>p.slug===link.dataset.serviceProject);
    if(!project)return;
    event.preventDefault();openProject(project);
  });
});

/* One frame per pointer update, with no animation loop when the mouse is idle. */
(function initPointerMotion(){
  const enabled=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  const desktop=matchMedia('(min-width:1000px)');
  const hero=document.querySelector('.hero');
  const light=document.createElement('span');
  light.className='hero-motion-light';light.setAttribute('aria-hidden','true');hero?.append(light);
  hero?.classList.add('motion-ready');
  let frame=0,latest=null,card=null,button=null;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const set=(el,values)=>Object.entries(values).forEach(([key,value])=>el.style.setProperty(key,value));
  function clearCard(){if(!card)return;card.classList.remove('motion-active');set(card,{'--card-rx':'0deg','--card-ry':'0deg'});card=null;}
  function clearButton(){if(!button)return;set(button,{'--button-x':'0px','--button-y':'0px'});button=null;}
  function clearHero(){if(hero)set(hero,{'--hero-x':'0px','--hero-y':'0px','--name-x':'0px','--name-y':'0px','--hero-light':'0'});}
  function reset(){cancelAnimationFrame(frame);frame=0;latest=null;clearCard();clearButton();clearHero();}
  function draw(){
    frame=0;if(!latest||!enabled.matches)return;
    const {target,x,y}=latest;
    const nextCard=target.closest('.project');
    if(nextCard!==card){clearCard();card=nextCard;}
    if(card){
      const cover=card.querySelector('.polished-cover');
      if(cover){const r=cover.getBoundingClientRect();
        const dx=clamp((x-r.left)/r.width,0,1),dy=clamp((y-r.top)/r.height,0,1);
        card.classList.add('motion-active');
        set(card,{'--card-rx':((.5-dy)*6).toFixed(2)+'deg','--card-ry':((dx-.5)*8).toFixed(2)+'deg','--spot-x':(dx*100).toFixed(1)+'%','--spot-y':(dy*100).toFixed(1)+'%'});
      }
    }
    const nextButton=target.closest('.hero .actions a,.contact-card .button,.service-example');
    if(nextButton!==button){clearButton();button=nextButton;}
    if(button){const r=button.getBoundingClientRect();button.classList.add('motion-button');
      set(button,{'--button-x':(clamp((x-r.left)/r.width-.5,-.5,.5)*7).toFixed(2)+'px','--button-y':(clamp((y-r.top)/r.height-.5,-.5,.5)*5).toFixed(2)+'px'});
    }
    if(hero&&desktop.matches&&target.closest('.hero')){
      const r=hero.getBoundingClientRect(),dx=clamp((x-r.left)/r.width,0,1)-.5,dy=clamp((y-r.top)/r.height,0,1)-.5;
      set(hero,{'--hero-x':(dx*18).toFixed(2)+'px','--hero-y':(dy*12).toFixed(2)+'px','--name-x':(-dx*10).toFixed(2)+'px','--name-y':(-dy*6).toFixed(2)+'px','--hero-spot-x':((dx+.5)*100).toFixed(1)+'%','--hero-spot-y':((dy+.5)*100).toFixed(1)+'%','--hero-light':'1'});
    }else clearHero();
  }
  document.addEventListener('pointermove',event=>{
    if(!enabled.matches||event.pointerType==='touch'||document.querySelector('dialog[open]')){reset();return;}
    latest={target:event.target,x:event.clientX,y:event.clientY};
    if(!frame)frame=requestAnimationFrame(draw);
  },{passive:true});
  document.addEventListener('pointerout',event=>{if(!event.relatedTarget)reset();},{passive:true});
  document.addEventListener('scroll',reset,{passive:true,capture:true});
  window.addEventListener('blur',reset);
  window.addEventListener('resize',reset,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
  enabled.addEventListener('change',reset);desktop.addEventListener('change',reset);
})();

(function siteWidePointer(){
 const media=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
 const halo=document.createElement('span');halo.className='site-pointer-light';halo.setAttribute('aria-hidden','true');document.body.append(halo);
 let frame=0,point=null;
 const hide=()=>{cancelAnimationFrame(frame);frame=0;halo.style.setProperty('--pointer-visible','0');};
 document.addEventListener('pointermove',e=>{if(!media.matches||e.pointerType==='touch'){hide();return;}point={x:e.clientX,y:e.clientY};if(!frame)frame=requestAnimationFrame(()=>{frame=0;halo.style.setProperty('--pointer-x',point.x+'px');halo.style.setProperty('--pointer-y',point.y+'px');halo.style.setProperty('--pointer-visible','1');});},{passive:true});
 document.addEventListener('pointerout',e=>{if(!e.relatedTarget)hide();},{passive:true});window.addEventListener('blur',hide);media.addEventListener('change',hide);
})();
(function flashlightCursor(){
 const media=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
 const sync=()=>document.documentElement.classList.toggle('flashlight-mode',media.matches);
 media.addEventListener('change',sync);sync();
})();
(function lightBrush(){
 const media=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
 const canvas=document.createElement('canvas');canvas.className='pointer-brush';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let points=[],frame=0,ratio=1;
 function resize(){ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*ratio);canvas.height=Math.round(innerHeight*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);clear();}
 function clear(){cancelAnimationFrame(frame);frame=0;points=[];ctx.clearRect(0,0,innerWidth,innerHeight);}
 function draw(now){
  frame=0;ctx.clearRect(0,0,innerWidth,innerHeight);
  points=points.filter(p=>now-p.t<580);if(!points.length)return;
  const raw=points.filter((p,i)=>!i||Math.hypot(p.x-points[i-1].x,p.y-points[i-1].y)>.5);
  const head=raw[raw.length-1];
  // Resample a smooth centreline, then fill ONE tapered silhouette.
  const curve=[];
  for(let i=0;i<raw.length-1;i++){
   const a=raw[Math.max(0,i-1)],b=raw[i],c=raw[i+1],d=raw[Math.min(raw.length-1,i+2)];
   const steps=Math.max(2,Math.ceil(Math.hypot(c.x-b.x,c.y-b.y)/5));
   for(let j=0;j<steps;j++){const t=j/steps,t2=t*t,t3=t2*t;
    const v=k=>.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3);
    curve.push({x:v('x'),y:v('y')});
   }
  }
  curve.push(head);
  const lengths=[0];for(let i=1;i<curve.length;i++)lengths[i]=lengths[i-1]+Math.hypot(curve[i].x-curve[i-1].x,curve[i].y-curve[i-1].y);
  const total=lengths[lengths.length-1]||1,fade=Math.max(0,1-(now-head.t)/580);
  ctx.globalCompositeOperation='source-over';
  for(const [size,color,blur] of [[1.6,'rgba(73,120,255,.18)',16],[1,'rgba(100,172,255,.5)',5],[.40,'rgba(202,232,255,.8)',1]]){
   const left=[],right=[];
   for(let i=0;i<curve.length;i++){
    const p=curve[i],prev=curve[Math.max(0,i-1)],next=curve[Math.min(curve.length-1,i+1)];
    const dx=next.x-prev.x,dy=next.y-prev.y,n=Math.hypot(dx,dy)||1;
    const progress=lengths[i]/total,width=22*size*Math.pow(progress,1.45)*fade;
    left.push({x:p.x-dy/n*width,y:p.y+dx/n*width});right.push({x:p.x+dy/n*width,y:p.y-dx/n*width});
   }
   ctx.globalAlpha=fade;ctx.filter='blur('+blur+'px)';ctx.fillStyle=color;
   ctx.beginPath();left.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));right.reverse().forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.fill();
  }
  ctx.filter='none';ctx.globalAlpha=fade;
  const glow=ctx.createRadialGradient(head.x,head.y,0,head.x,head.y,32*fade+.01);
  glow.addColorStop(0,'rgba(229,246,255,.9)');glow.addColorStop(.24,'rgba(140,204,255,.65)');glow.addColorStop(.6,'rgba(78,132,255,.20)');glow.addColorStop(1,'rgba(78,132,255,0)');
  ctx.fillStyle=glow;ctx.beginPath();ctx.arc(head.x,head.y,32*fade+.01,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  frame=requestAnimationFrame(draw);
 }
 document.addEventListener('pointermove',e=>{
  if(!media.matches||e.pointerType==='touch')return;
  const samples=e.getCoalescedEvents?.()||[];const now=performance.now();
  for(const p of samples.length?samples:[e])points.push({x:p.clientX,y:p.clientY,t:now});
  if(points.length>360)points.splice(0,points.length-360);
  if(!frame)frame=requestAnimationFrame(draw);
 },{passive:true});
 document.addEventListener('pointerout',e=>{if(!e.relatedTarget)clear();},{passive:true});window.addEventListener('blur',clear);window.addEventListener('resize',resize,{passive:true});document.addEventListener('scroll',clear,{passive:true,capture:true});media.addEventListener('change',clear);resize();
})();
