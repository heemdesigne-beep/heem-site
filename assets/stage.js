(function(){
 var intro=document.getElementById('hi-intro');
 var root=document.documentElement;
 function unlock(){root.classList.remove('hi-lock')}
 if(intro&&!root.classList.contains('hi-skip')){
  var P=[].slice.call(intro.querySelectorAll('p')),timers=[],ended=false;
  var finish=function(){if(ended)return;ended=true;timers.forEach(clearTimeout);intro.classList.add('done');unlock();try{sessionStorage.setItem('heem_intro','1')}catch(e){}};
  P.forEach(function(el,i){
   var t=400+i*2700;
   timers.push(setTimeout(function(){el.classList.add('on')},t));
   if(i<P.length-1)timers.push(setTimeout(function(){el.classList.remove('on');el.classList.add('off')},t+2100));
  });
  timers.push(setTimeout(finish,400+(P.length-1)*2700+2600));
  var sk=intro.querySelector('.hi-skip');if(sk)sk.addEventListener('click',finish);
 }else{unlock()}
 var els=[].slice.call(document.querySelectorAll('.hw-rv'));
 if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target;var d=([].indexOf.call(el.parentNode.children,el)%2)*140;setTimeout(function(){el.classList.add('in')},d);io.unobserve(el)}})},{threshold:.18});
 els.forEach(function(e){io.observe(e)});
})();
