(function(){
 var intro=document.getElementById('hi-intro');
 var root=document.documentElement;
 function unlock(){root.classList.remove('hi-lock')}
 if(intro&&!root.classList.contains('hi-skip')){
  var P=[].slice.call(intro.querySelectorAll('p')),timers=[],ended=false;
  var finish=function(){if(ended)return;ended=true;timers.forEach(clearTimeout);intro.classList.add('done');unlock();try{localStorage.setItem('heem_intro_t',String(Date.now()))}catch(e){}};
  P.forEach(function(el,i){
   var t=300+i*2100;
   timers.push(setTimeout(function(){el.classList.add('on')},t));
   if(i<P.length-1)timers.push(setTimeout(function(){el.classList.remove('on');el.classList.add('off')},t+1700));
  });
  timers.push(setTimeout(finish,300+(P.length-1)*2100+2300));
  var sk=intro.querySelector('.hi-skip');if(sk)sk.addEventListener('click',finish);
 }else{unlock()}
 var els=[].slice.call(document.querySelectorAll('.hw-rv'));
 if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target;var d=([].indexOf.call(el.parentNode.children,el)%2)*140;setTimeout(function(){el.classList.add('in')},d);io.unobserve(el)}})},{threshold:.18});
 els.forEach(function(e){io.observe(e)});
})();

/* ===== gallery overlay + reel + rows ===== */
(function(){
 var root=document.documentElement,en=root.lang==='en',rtl=root.dir==='rtl';
 var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 var AR='٠١٢٣٤٥٦٧٨٩';
 function num(n){return (n<10?'0':'')+n}
 /* gallery overlay */
 var work=document.getElementById('work');
 if(work){
  var close=document.createElement('button');close.type='button';close.className='hw-close';close.setAttribute('aria-label',en?'Close':'إغلاق');close.textContent='×';
  document.body.appendChild(close);
  var lastFocus=null;
  var openGal=function(cat,from){var tab=work.querySelector('[data-work-tab="'+cat+'"]');if(tab)tab.click();lastFocus=from||null;root.classList.add('hw-gal');work.scrollTop=0;close.focus({preventScroll:true})};
  var closeGal=function(){root.classList.remove('hw-gal');if(lastFocus)try{lastFocus.focus({preventScroll:true})}catch(e){}};
  document.addEventListener('click',function(e){
   var a=e.target.closest('[data-gal]');if(a){e.preventDefault();openGal(a.getAttribute('data-gal'),a)}
  });
  close.addEventListener('click',closeGal);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&root.classList.contains('hw-gal'))closeGal()});
 }
 /* selected work reel */
 var sec=document.getElementById('selected'),grid=document.getElementById('featured-projects');
 if(sec&&grid){
  var cards=[].slice.call(grid.children).filter(function(el){return el.matches&&el.matches('a.project')});
  if(cards.length>1){
   var head=sec.querySelector('.sectionhead'),n=cards.length;
   var wrap=document.createElement('div');wrap.className='sr-wrap';
   wrap.innerHTML='<div class="sr-sticky"><div class="sr-side"></div><div class="sr-viewport"><div class="sr-track"></div></div><div class="sr-foot"><span class="sr-count"><b>'+num(1)+'</b> / '+num(n)+'</span><span class="sr-line"><i></i></span></div></div>';
   var side=wrap.querySelector('.sr-side'),track=wrap.querySelector('.sr-track'),cnt=wrap.querySelector('.sr-count b'),line=wrap.querySelector('.sr-line'),sticky=wrap.querySelector('.sr-sticky');
   if(head)side.appendChild(head);
   cards.forEach(function(c){track.appendChild(c)});
   grid.hidden=true;grid.style.display='none';sec.appendChild(wrap);
   var mode='',step=0,vis=0;
   var sign=rtl?1:-1;
   function layout(){
    var pin=innerHeight>=420;
    wrap.classList.toggle('sr-row',!pin);
    if(pin){
     var c0=cards[0],gap=parseFloat(getComputedStyle(track).columnGap)||0;
     step=c0.getBoundingClientRect().width+gap;
     var view=wrap.querySelector('.sr-viewport').getBoundingClientRect().width;
     var travel=Math.max(0,(n-1)*step);
     wrap.style.height=(innerHeight+travel*1.15)+'px';
     mode='pin';
    }else{wrap.style.height='';track.style.transform='';mode='row'}
    update();
   }
   function update(){
    if(mode!=='pin')return;
    var r=wrap.getBoundingClientRect(),total=wrap.offsetHeight-innerHeight;
    var p=Math.max(0,Math.min(1,-r.top/total));
    track.style.transform='translate3d('+(sign*p*(n-1)*step)+'px,0,0)';
    var idx=Math.round(p*(n-1));
    cards.forEach(function(c,i){c.classList.toggle('on',i===idx)});
    cnt.textContent=num(idx+1);
    line.style.setProperty('--sr-p',(idx+1)/n);
    line.style.setProperty('--sr-p',Math.max(.02,p));
   }
   var t=false;
   addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(function(){t=false;update()})}},{passive:true});
   addEventListener('resize',layout);
   layout();
   cards[0].classList.add('on');
  }
 }
 /* videos & reels rows: scroll drift + pointer-side steering + drag; touch swipes natively */
 var rows=[].slice.call(document.querySelectorAll('.rr-row,#feedback .feedback'));
 if(rows.length){
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var base=[],off=[],cur=[],vel=[],hov=[],dragging=[],lastW=[],userT=[];
  rows.forEach(function(){base.push(0);off.push(0);cur.push(0);vel.push(0);hov.push(false);dragging.push(false);lastW.push(0);userT.push(0)});
  var running=false,dirs=rows.map(function(r){return getComputedStyle(r).direction==='rtl'?-1:1});
  function maxOf(r){return Math.max(0,r.scrollWidth-r.clientWidth)}
  function clamp(v,m){return Math.max(0,Math.min(m,v))}
  function calc(){
   rows.forEach(function(row,i){var r=row.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));base[i]=(i%2?1-p:p)*maxOf(row)});
   kick();
  }
  function kick(){if(!running){running=true;requestAnimationFrame(tick)}}
  function tick(){
   var busy=false,now=performance.now();
   rows.forEach(function(row,i){
    var m=maxOf(row);
    if(now-userT[i]<350){busy=true;return}
    if(hov[i]&&!dragging[i])off[i]+=vel[i];
    var tg=clamp(base[i]+off[i],m);
    off[i]=tg-base[i];
    cur[i]+=(tg-cur[i])*(dragging[i]?.5:.12);
    if(Math.abs(tg-cur[i])>.4||(hov[i]&&Math.abs(vel[i])>.05))busy=true;
    lastW[i]=now;row.scrollLeft=dirs[i]*cur[i];
   });
   if(busy)requestAnimationFrame(tick);else running=false;
  }
  rows.forEach(function(row,i){
   row.style.scrollSnapType='none';
   if(fine){row.style.overflowX='hidden';row.style.cursor='grab'}
   row.addEventListener('scroll',function(){
    if(performance.now()-lastW[i]<60)return;
    userT[i]=performance.now();var L=clamp(dirs[i]*row.scrollLeft,maxOf(row));cur[i]=L;off[i]=L-base[i];kick();
   },{passive:true});
   row.addEventListener('pointermove',function(e){
    if(e.pointerType!=='mouse')return;
    if(dragging[i]){var dx=e.clientX-row._x;row._x=e.clientX;row._moved+=Math.abs(dx);off[i]-=dirs[i]*dx;kick();return}
    var r=row.getBoundingClientRect(),k=((e.clientX-r.left)/r.width-.5)*2;
    var z=Math.abs(k)<.18?0:(k-Math.sign(k)*.18)/.82;
    vel[i]=dirs[i]*z*18;hov[i]=true;kick();
   });
   row.addEventListener('pointerleave',function(){hov[i]=false;vel[i]=0});
   row.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;dragging[i]=true;row._x=e.clientX;row._moved=0;row.style.cursor='grabbing'});
   addEventListener('pointerup',function(){if(dragging[i]){dragging[i]=false;row.style.cursor='grab'}});
   row.addEventListener('click',function(e){if(row._moved>6){e.preventDefault();e.stopPropagation()}row._moved=0},true);
   row.addEventListener('dragstart',function(e){e.preventDefault()});
  });
  addEventListener('scroll',calc,{passive:true});addEventListener('resize',calc);calc();
 }
})();
