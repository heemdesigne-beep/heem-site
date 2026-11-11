/* HEEM — scroll storytelling (preview) */
(function(){
'use strict';
var root=document.documentElement;
var isEn=(root.lang||'ar').toLowerCase().indexOf('en')===0;
var t=function(ar,en){return isEn?en:ar};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};
var el=function(h){var d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild};
var rtl=function(){return getComputedStyle(document.body).direction==='rtl'};

var bar,crowds=[],pin=null,ticking=false;

/* ---------- reveals ---------- */
function reveals(){
  if(reduce||!('IntersectionObserver' in window))return;
  var sets=[
    '#about .aboutlayout>*','#selected .sectionhead>*','#work .sectionhead>*','#work .work-tabs',
    '#partners>.index','#partners>h2','#partners>p','#services>.index','#services>h2','#services article',
    '#feedback>.index','#feedback>h2','#feedback>p','#how-we-work>h2','.collaboration-steps>li',
    '.eg-stats li','.eg-compare .eg-wrap>*','.eg-faq .eg-wrap>.eg-kicker','.eg-faq .eg-wrap>h2','.eg-faq details',
    '.contact-copy>*','.contact-card'
  ];
  var seen=new Set(),list=[];
  sets.forEach(function(s){document.querySelectorAll(s).forEach(function(n){if(!seen.has(n)){seen.add(n);list.push(n)}})});
  var vh=innerHeight;
  var map=new Map();
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(map.get(e.target)||[]).forEach(function(x){x.classList.add('st-in')});map.delete(e.target);io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
  list.forEach(function(n){
    var r=n.getBoundingClientRect();
    if(r.top<vh*.92&&r.bottom>0)return;
    var idx=Array.prototype.indexOf.call(n.parentNode.children,n);
    n.style.setProperty('--d',(idx%6)*90+'ms');
    if(n.tagName!=='H2'&&innerWidth>=1000){var dir=rtl()?-1:1;n.style.setProperty('--sx',(idx%2?1:-1)*dir*22+'px')}
    n.classList.add('st-rv');
    var trg=n.tagName==='H2'?n.parentNode:n;
    if(!map.has(trg)){map.set(trg,[]);io.observe(trg)}
    map.get(trg).push(n);
  });
}

/* ---------- crowd -> difference dividers ---------- */
function crowd(beforeEl,l1,l2){
  if(!beforeEl)return;
  var n=innerWidth<760?11:19,mid=Math.floor(n/2),heads='';
  for(var i=0;i<n;i++)heads+='<span class="st-head'+(i===mid?' st-one':'')+'" style="--i:'+i+'"></span>';
  var node=el('<div class="st-crowd" style="--s:clamp(24px,3vw,42px)"><div class="st-heads" aria-hidden="true">'+heads+'</div><p class="st-cap"><span class="l1">'+l1+'</span><span class="l2">'+l2+'</span></p></div>');
  beforeEl.parentNode.insertBefore(node,beforeEl);
  crowds.push(node);
  if(reduce)node.style.setProperty('--p',1);
}
function updateCrowd(n){
  var r=n.getBoundingClientRect(),vh=innerHeight;
  var c=r.top+r.height/2;
  var p=clamp(1-(c-vh*.35)/(vh*.45),0,1);
  p=p*p*(3-2*p);
  n.style.setProperty('--p',p.toFixed(3));
}

/* ---------- selected projects: pin + horizontal ---------- */
function canPin(node){
  for(var e=node.parentElement;e&&e!==document.documentElement;e=e.parentElement){
    var c=getComputedStyle(e);
    if(c.overflowX!=='visible'&&c.overflowX!=='clip')return false;
    if(c.overflowY!=='visible'&&c.overflowY!=='clip')return false;
  }
  return true;
}
function buildPin(){
  var sec=document.getElementById('selected'),grid=document.getElementById('featured-projects'),head=sec&&sec.querySelector('.sectionhead');
  if(!sec||!grid||!head)return;
  var cards=grid.querySelectorAll('.project');if(cards.length<2)return;
  var wrap=el('<div class="st-pin-wrap"><div class="st-sticky"><div class="st-viewport"></div></div></div>');
  var sticky=wrap.firstChild,vp=sticky.firstChild;
  sec.insertBefore(wrap,head);
  sticky.insertBefore(head,vp);
  vp.appendChild(grid);
  var hint=el('<div class="st-hint"><span class="st-hint-text"></span><span class="st-hbar"><i></i></span><span class="st-count" dir="ltr"></span></div>');
  sticky.appendChild(hint);
  pin={sec:sec,wrap:wrap,sticky:sticky,vp:vp,grid:grid,hint:hint,text:hint.querySelector('.st-hint-text'),fill:hint.querySelector('.st-hbar i'),count:hint.querySelector('.st-count'),n:cards.length,start:0,dist:0,mode:''};
  grid.addEventListener('focusin',function(e){
    if(pin.mode!=='pin')return;
    var card=e.target.closest&&e.target.closest('.project');if(!card)return;
    var tw=grid.scrollWidth,pos=rtl()?tw-(card.offsetLeft+card.offsetWidth):card.offsetLeft;
    var target=clamp(pos-110,0,pin.dist);
    scrollTo({top:pin.start+target,behavior:reduce?'auto':'smooth'});
  });
  grid.addEventListener('scroll',function(){if(pin.mode==='row')rowProgress()},{passive:true});
  layout();
}
function rowProgress(){
  var g=pin.grid,max=g.scrollWidth-g.clientWidth;if(max<=0)return;
  var p=Math.abs(g.scrollLeft)/max;
  pin.fill.parentNode.style.setProperty('--hp',p);pin.hint.style.setProperty('--hp',p);
  var idx=Math.round(p*(pin.n-1))+1;pin.count.textContent=String(idx).padStart(2,'0')+' / '+String(pin.n).padStart(2,'0');
}
function layout(){
  crowds.forEach(function(c){});
  if(!pin)return;
  var want=innerWidth>=901&&innerHeight>=640&&!reduce&&canPin(pin.wrap);
  var mode=want?'pin':'row';
  root.classList.toggle('st-pin',mode==='pin');
  root.classList.toggle('st-row',mode==='row');
  pin.mode=mode;
  pin.text.textContent=mode==='pin'?t('تابع النزول لاستعراض المشاريع','Keep scrolling to browse the projects'):t('اسحب لاستعراض المشاريع','Swipe to browse the projects');
  if(mode==='pin'){
    pin.grid.style.transform='';pin.grid.scrollLeft=0;
    var vpW=pin.vp.clientWidth;
    pin.dist=Math.max(0,pin.grid.scrollWidth-vpW);
    pin.wrap.style.height=(pin.dist+innerHeight)+'px';
    pin.start=pin.wrap.getBoundingClientRect().top+scrollY;
  }else{
    pin.wrap.style.height='';pin.grid.style.transform='';pin.dist=0;
    rowProgress();
  }
  update();
}
function updatePin(){
  if(!pin||pin.mode!=='pin'||pin.dist<=0)return;
  var p=clamp((scrollY-pin.start)/pin.dist,0,1);
  var d=rtl()?1:-1;
  pin.grid.style.transform='translate3d('+(d*p*pin.dist).toFixed(1)+'px,0,0)';
  pin.hint.style.setProperty('--hp',p.toFixed(3));
  var idx=Math.round(p*(pin.n-1))+1;
  pin.count.textContent=String(idx).padStart(2,'0')+' / '+String(pin.n).padStart(2,'0');
}

/* ---------- loop ---------- */
function update(){
  ticking=false;
  var h=document.documentElement.scrollHeight-innerHeight;
  if(bar)bar.style.setProperty('--sp',h>0?clamp(scrollY/h,0,1).toFixed(4):0);
  if(!reduce)crowds.forEach(updateCrowd);
  updatePin();
}
function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update)}}

function init(){
  if(!document.getElementById('home'))return;
  root.classList.add('st-on');
  bar=el('<div class="st-bar" aria-hidden="true"></div>');document.body.appendChild(bar);
  crowd(document.querySelector('.ribbon'),t('وسط كل التشابه','Amid all the similarity'),t('أصنع الاختلاف','I create the difference'));
  crowd(document.getElementById('partners'),t('في كل مشروع','In every project'),t('أبحث عمّا يجعل علامتك مختلفة','I look for what makes your brand different'));
  crowd(document.getElementById('contact'),t('هل علامتك وسط الحشد؟','Is your brand lost in the crowd?'),t('لنجعلها الأوضح','Let’s make it the one that stands out'));
  buildPin();
  reveals();
  addEventListener('scroll',onScroll,{passive:true});
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(layout,150)});
  addEventListener('load',function(){layout()});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){layout()});
  if(pin&&'ResizeObserver' in window){var ro=new ResizeObserver(function(){clearTimeout(rt);rt=setTimeout(layout,100)});ro.observe(pin.grid)}
  update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
