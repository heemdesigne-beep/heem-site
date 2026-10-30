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
