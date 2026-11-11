/* HEEM — engagement additions (preview build) */
(function(){
'use strict';
var PROJECTS=[["petra","identity","PETRA — خبرة هندسية تتحول إلى علامة بصرية","PETRA — Engineering expertise, expressed visually"],["kollagena","identity","كولاجينا — من بداية الهوية إلى كل نقطة تواصل","Kollagena — From identity to every touchpoint"],["muloha","identity","ملوحة","Muloha"],["rakayez-advanced-solutions","identity","ركائز","Rakayez"],["nawa-visual-identity","identity","نوى","Nawa"],["pulse-visual-identity","identity","Pulse","Pulse"],["sanad-visual-identity","identity","سند","Sanad"],["moladon-menu","print","مولادون — تصميم المنيو","Moladon — Menu design"],["green-garden-die-cut-stickers","print","جرين جاردن — استيكرات داي كت","Green Garden — Die-cut stickers"],["combo-kaizer-menu","print","كومبو & كيزر — منيو الإطعام","Combo & Kaizer — Meal menu"],["bahri-printed-stands","print","بحري — استاندات العروض والمنتجات","Bahri — Printed promotional stands"],["nawa-roll-up-banner","print","نوى — بنر رول أب","Nawa — Roll-up banner"],["bahri-gift-voucher","print","بحري — قسيمة شرائية","Bahri — Gift voucher"],["bahri-die-cut-stickers","print","بحري — استيكرات داي كات","Bahri — Die-cut stickers"],["lifting-more-die-cut-stickers","print","ليفتينج مور — استيكرات داي كات","Lifting More — Die-cut stickers"],["bealah-tea-die-cut-stickers","print","بيالة شاهي — استيكرات داي كات","Bealah Tea — Die-cut stickers"],["kale-die-cut-stickers","print","كيل — استيكرات داي كات","Kalé — Die-cut stickers"],["eid-die-cut-stickers","print","استيكرات العيد","Eid sticker designs"],["rakayez-company-profile","print","ركائز — بروفايل الشركة","Rakayez — Company profile"],["alalwi-car-care-company-profile","print","العلوي لخدمة السيارات — بروفايل الشركة","Alalwi Car Care — Company profile"],["petra-machine-branding-and-print-preparation","print","بيترا — هوية الماكينات وتجهيز الطباعة","PETRA — Machine branding and print preparation"],["taalil-tea-menu-design","print","شاهي تعاليل — تصميم المنيو","Taalil Tea — Menu design"],["airon-company-profile","print","Airon — الملف التعريفي للشركة","Airon — Company profile"],["bahri-team-uniforms","print","بحري — ملابس الفريق","Bahri — Team uniforms"],["print-collection","print","مجموعة مطبوعات","Print Collection"],["qr-hanger","print","بطاقة تعليق QR","QR Hanger"],["packaging-dieline","print","مخطط تغليف","Packaging Dieline"],["meal-box","print","علبة وجبة","Meal Box"],["meal-box-blue","print","علبة وجبة — أزرق","Meal Box / Blue"],["sandwich-box","print","علبة ساندويتش","Sandwich Box"],["label-system","print","نظام ملصقات","Label System"],["menu-board","print","لوحة قائمة الطعام","Menu Board"],["gift-set","print","مجموعة هدايا","Gift Set"],["wall-poster","print","ملصق جداري","Wall Poster"],["business-card","print","بطاقة أعمال","Business Card"],["display-stand","print","ستاند عرض","Display Stand"],["island-seafood-social-and-3d","social","أيلاند سيفود","Island Seafood"],["shawarma-hatab-social-media","social","شاورما حطب","Shawarma Hatab"],["hawawshi-art-social-media","social","حواوشي آرت","Hawawshi Art"],["green-garden-social-media","social","جرين جاردن","Green Garden"],["nawa-national-day-social-media","social","نوى — تصميمات اليوم الوطني","Nawa — National Day social media"],["jaddathi","social","عصائر جدتي — من المنيو إلى مشهد يشهي","Jaddati — From menu to an appetising visual scene"],["bahri-social-media","social","بحري","Bahri"],["petra-social-media","social","بيترا","PETRA"],["kollagena-social-media","social","كولاجينا","Kollagena"],["heem-create-the-difference","video","هيم — أصنع الاختلاف","HEEM — Create the Difference"],["vertex-platform-video-enhancement","video","Vertex — تطوير فيديو المنصة","Vertex Platform Video Enhancement"],["vertex","video","Vertex — تصوير واحد، مشهد جديد بالكامل","Vertex — One shoot, an entirely new scene"],["vertex-rspi-course-video-transformation","video","Vertex — دورة RSPI","Vertex RSPI Course Video"],["ai-ad-transformation-reel","video","من صورة إلى إعلان","AI Ad Reel"],["vertex-logo-animation-intro","video","Vertex — تحريك الشعار","Vertex Logo Animation Intro"],["ajdabiya-jalu-road","video","مشروع تطوير وتوسعة طريق أجدابيا–جالو","Ajdabiya–Jalu Road Upgrade and Expansion"],["bahri-social-campaigns","social","بحري — حملات وعروض السوشيال ميديا","Bahri — Social media campaigns"],["collagiena-social-content","social","كولاجينا — محتوى وحملات السوشيال ميديا","Collagiena — Social media content"],["dental-clinic-promo","video","إعلان عيادة أسنان — خدمات وعروض","Dental Clinic Promotional Ad"],["kollagena-product-ad","video","إعلان منتجات — كولاجينا","Kollagena Product Ad"],["medical-center-promo","video","فيديو تعريفي — مركز طبي","Medical Center Promo"],["medical-lab-promo","video","إعلان معمل تحاليل — خدمات متكاملة","Medical Laboratory Promotional Ad"],["muloha-social-media","social","ملوحة","Muloha"],["pharmacy-offers-ad","video","إعلان صيدلية — عروض ومنتجات","Pharmacy Offers Ad"],["real-estate-design-preview","video","فيديو عقاري — من الإنشاء للتصور النهائي","Real Estate Design Preview"],["real-estate-floor-plan-video","video","فيديو عقاري — شرح المخطط","Real Estate Floor Plan Video"],["real-estate-project-showcase","video","مونتاج عقاري — عرض مشروع","Real Estate Project Showcase"],["real-estate-video-editing","video","مونتاج عقاري","Real Estate Video Editing"],["real-estate-villa-plans","video","مونتاج عقاري — فيلا ومخططاتها","Villa and Floor Plans Showcase"],["real-estate-villa-showcase","video","مونتاج عقاري — استعراض فيلا","Real Estate Villa Showcase"],["real-estate-villa-tour","video","فيديو عقاري — جولة في فيلا","Real Estate Villa Tour"],["shaam-dubai-branch-ad","video","شام — إعلان فرع دبي","Shaam — Dubai Branch Ad"],["social-engagement-motion","video","موشن جرافيك — محتوى تفاعلي","Social Engagement Motion Graphics"]];
var WA='201013528544';
var isEn=(document.documentElement.lang||'ar').toLowerCase().indexOf('en')===0;
var t=function(ar,en){return isEn?en:ar};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var wa=function(msg){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(msg)};
var el=function(html){var d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var waIcon='<span aria-hidden="true" class="action-icon whatsapp-icon"><svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 2a14 14 0 0 0-12.1 21L2 30l7.2-1.9A14 14 0 1 0 16 2Zm0 25.5a11.5 11.5 0 0 1-5.9-1.6l-.4-.2-4.3 1.1 1.1-4.2-.3-.5A11.5 11.5 0 1 1 16 27.5Z" fill="currentColor"></path><path d="M10 9c-.5 0-1 .2-1.3.7-.5.6-.9 1.4-.9 2.5 0 2.5 2 5.2 4.5 7.2 2.5 2 5.7 3.2 7.6 2.4 1.2-.5 2-1.7 2.1-2.5 0-.3-.1-.5-.4-.7l-3-1.4c-.3-.2-.6-.2-.8.2l-1.1 1.3c-.2.2-.4.3-.7.1-1.8-.7-3.7-2.1-4.6-3.9-.2-.3-.1-.5.1-.7l.8-1c.2-.3.3-.5.1-.8l-1.2-2.9C11 9 10.5 9 10 9Z" fill="currentColor"></path></svg></span>';
var CAT={identity:['الهويات','Visual identity'],print:['المطبوعات','Print'],social:['السوشيال ميديا','Social media'],video:['المونتاج','Video']};

/* ---------- Project pages ---------- */
function projectPage(){
  var m=location.pathname.match(/projects\/([^\/]+)/);if(!m)return;
  var main=document.querySelector('main.project-document'),plain=false;
  if(!main){main=document.querySelector('main');plain=true}
  if(!main)return;
  var slug=decodeURIComponent(m[1]);
  var idx=-1;for(var i=0;i<PROJECTS.length;i++)if(PROJECTS[i][0]===slug){idx=i;break}
  var me=idx>-1?PROJECTS[idx]:null;
  var title=me?(isEn?me[3]:me[2]):(document.querySelector('h1')||{}).textContent||'';
  var prefix=isEn?'/en/projects/':'/projects/';
  var host=plain?main:(main.querySelector('.gallery article')||main.querySelector('.gallery')||main);

  if(!main.querySelector('.case-contact a[href*="wa.me"]')){
    var msg=t('مرحبًا محمد، شاهدت مشروع «'+title+'» في موقعك، وأرغب في مناقشة مشروع مشابه.','Hi Mohamed, I saw the “'+title+'” project on your website and I would like to discuss a similar project.');
    host.appendChild(el('<section class="case-contact eg-project-cta'+(plain?' eg-in-card':'')+'"><p>'+t('هل لديك مشروع مشابه؟ أخبرني عن نشاطك وما تحتاجه، لنحدد الخطوة التالية.','Have a similar project in mind? Tell me about your business and what you need, and we will plan the next step.')+'</p><a class="button whatsapp-cta" target="_blank" rel="noopener noreferrer" href="'+esc(wa(msg))+'">'+waIcon+'<span>'+t('أريد مشروعًا مشابهًا','I want a similar project')+'</span></a></section>'));
  }
  if(!me)return;
  var same=PROJECTS.filter(function(p){return p[1]===me[1]});
  var pos=same.indexOf(me);
  if(same.length<2)return;
  var prev=same[(pos-1+same.length)%same.length],next=same[(pos+1)%same.length];
  var card=function(p,cls,label){return '<a class="'+cls+'" href="'+prefix+encodeURIComponent(p[0])+'/"><small>'+label+'</small><strong>'+esc(isEn?p[3]:p[2])+'</strong></a>'};
  var nav=el('<nav class="eg-pnav" aria-label="'+t('المزيد من الأعمال','More work')+'"><h2>'+t('المزيد من ','More from ')+CAT[me[1]][isEn?1:0]+'</h2><div class="eg-pnav-grid">'+card(prev,'eg-prev',t('→ المشروع السابق','← Previous project'))+card(next,'eg-next',t('المشروع التالي ←','Next project →'))+'</div><a class="eg-pnav-all" href="'+(isEn?'/en/':'/')+'#work">'+t('كل الأعمال','All work')+'</a></nav>');
  if(plain)main.after(nav);else main.appendChild(nav);
}

/* ---------- Home: stats ---------- */
function stats(){
  var about=document.getElementById('about');if(!about||document.querySelector('.eg-stats'))return;
  var partners=document.getElementById('partners'),brands=0;
  if(partners){var seen={};partners.querySelectorAll('img[alt]').forEach(function(im){var a=im.getAttribute('alt').trim();if(a&&!seen[a]){seen[a]=1;brands++}})}
  var items=[[15,'+',t('سنة من الخبرة في التصميم والمونتاج','years of design and video experience')],[PROJECTS.length,'',t('مشروعًا منشورًا في المعرض','projects published in the portfolio')],[brands||34,'',t('علامة وجهة تعاملت معها','brands and organizations served')],[4,'',t('دول: مصر، السعودية، الإمارات، ليبيا','countries: Egypt, Saudi Arabia, UAE, Libya')]];
  var html='<section class="eg-stats" aria-label="'+t('أرقام سريعة','At a glance')+'"><div class="eg-wrap"><ul>';
  items.forEach(function(it){html+='<li><strong data-count="'+it[0]+'" data-prefix="'+it[1]+'">'+it[1]+it[0]+'</strong><span>'+it[2]+'</span></li>'});
  html+='</ul></div></section>';
  var node=el(html);about.after(node);
  if(reduce||!('IntersectionObserver' in window))return;
  var nums=node.querySelectorAll('[data-count]');nums.forEach(function(n){n.textContent=n.dataset.prefix+'0'});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.disconnect();nums.forEach(function(n){var end=+n.dataset.count,s=performance.now(),d=1300;(function step(now){var k=Math.min(1,(now-s)/d),v=Math.round(end*(1-Math.pow(1-k,3)));n.textContent=n.dataset.prefix+v;if(k<1)requestAnimationFrame(step)})(s)})})},{threshold:.35});
  io.observe(node);
}

/* ---------- Home: before / after ---------- */
function compare(){
  var sel=document.getElementById('selected');if(!sel||document.querySelector('.eg-compare'))return;
  var node=el('<section class="eg-compare" id="before-after"><div class="eg-wrap"><div class="eg-kicker">'+t('قبل وبعد','Before & after')+'</div><h2 class="eg-title">'+t('اسحب لترى الفرق','Drag to see the difference')+'</h2><p class="eg-lead">'+t('إعادة تصميم شعار PETRA: من شعار عام إلى رمز يحكي تخصص الشركة في فحص الخرسانة وقصّها وإصلاحها.','PETRA logo redesign: from a generic mark to a symbol that tells the company’s story of scanning, cutting and repairing concrete.')+'</p>'+
    '<div class="eg-ba" style="--pos:50%"><img class="eg-ba-after" src="/assets/projects/petra-compare/after.webp" alt="'+t('شعار بيترا الجديد','New PETRA logo')+'" loading="lazy"><img class="eg-ba-before" src="/assets/projects/petra-compare/before.webp" alt="'+t('شعار بيترا السابق','Previous PETRA logo')+'" loading="lazy"><span class="eg-ba-tag b">'+t('قبل','Before')+'</span><span class="eg-ba-tag a">'+t('بعد','After')+'</span><span class="eg-ba-line"></span><span class="eg-ba-handle" aria-hidden="true">⇆</span><input type="range" min="0" max="100" value="50" aria-label="'+t('مقارنة الشعار قبل وبعد','Compare logo before and after')+'"></div>'+
    '<div class="eg-compare-foot"><span>'+t('هل تحتاج علامتك إلى تطوير مماثل؟','Does your brand need a similar upgrade?')+'</span><a href="'+(isEn?'/en/projects/petra/':'/projects/petra/')+'">'+t('اقرأ قصة المشروع كاملة','Read the full case study')+'</a></div></div></section>');
  sel.after(node);
  var box=node.querySelector('.eg-ba'),range=box.querySelector('input');
  var set=function(v){v=Math.max(0,Math.min(100,v));box.style.setProperty('--pos',v+'%');range.value=v};
  range.addEventListener('input',function(){set(+range.value)});
  var drag=false;
  var fromEvent=function(e){var r=box.getBoundingClientRect();set((e.clientX-r.left)/r.width*100)};
  box.addEventListener('pointerdown',function(e){drag=true;box.setPointerCapture&&box.setPointerCapture(e.pointerId);fromEvent(e)});
  box.addEventListener('pointermove',function(e){if(drag)fromEvent(e)});
  ['pointerup','pointercancel'].forEach(function(n){box.addEventListener(n,function(){drag=false})});
  if(!reduce&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;io.disconnect();var s=performance.now();(function hint(now){if(drag)return;var k=(now-s)/1600;if(k>=1){set(50);return}set(50+Math.sin(k*Math.PI*2)*18);requestAnimationFrame(hint)})(s)},{threshold:.6});io.observe(box)}
}

/* ---------- Home: FAQ ---------- */
function faq(){
  var how=document.getElementById('how-we-work');if(!how||document.querySelector('.eg-faq'))return;
  var qa=[
    ['كيف أبدأ العمل معك؟','اختر الخدمة التي تحتاجها من قسم التواصل، وأضف نبذة قصيرة عن مشروعك، ثم أرسل الرسالة على واتساب. سأرد عليك لنحدد معًا نقطة البداية.','How do we get started?','Choose the service you need in the contact section, add a short note about your project, and send it on WhatsApp. I will reply so we can define the starting point together.'],
    ['كم تستغرق مدة تنفيذ المشروع؟','تختلف المدة حسب نوع العمل وحجمه. نحدد الجدول الزمني بوضوح قبل البدء، ضمن الاتفاق على التفاصيل.','How long does a project take?','It depends on the type and size of the work. We set a clear timeline before we start, as part of agreeing on the details.'],
    ['كيف تُحدَّد تكلفة المشروع؟','تُحدَّد التكلفة حسب نطاق العمل والمخرجات المطلوبة، وتصلك واضحة قبل بدء التنفيذ.','How is the cost determined?','Pricing depends on the scope and the deliverables, and you receive it clearly before any work begins.'],
    ['كم عدد المراجعات المتاحة؟','نتفق على عدد المراجعات قبل البدء، ونراجع العمل معًا في كل مرحلة حتى التسليم وفق الاتفاق.','How many revisions are included?','We agree on the number of revisions before we start, and review the work together at each stage until delivery.'],
    ['هل تعمل مع عملاء خارج مصر؟','نعم، أعمل عن بُعد مع عملاء في السعودية والإمارات وليبيا، ويتم التواصل والتسليم إلكترونيًا.','Do you work with clients outside Egypt?','Yes. I work remotely with clients in Saudi Arabia, the UAE and Libya, with communication and delivery handled online.'],
    ['ما الملفات التي أستلمها في النهاية؟','تستلم الملفات النهائية بالصيغ التي نتفق عليها حسب طبيعة العمل واستخدامه، سواء للطباعة أو للنشر الرقمي.','What files do I receive?','You receive the final files in the formats we agree on, depending on how the work will be used, whether for print or digital.']
  ];
  var html='<section class="eg-faq" id="faq"><div class="eg-wrap"><div class="eg-kicker">'+t('أسئلة شائعة','FAQ')+'</div><h2 class="eg-title">'+t('قبل أن نبدأ','Before we start')+'</h2><div class="eg-faq-list">';
  qa.forEach(function(q,i){html+='<details'+(i===0?' open':'')+'><summary>'+(isEn?q[2]:q[0])+'</summary><p>'+(isEn?q[3]:q[1])+'</p></details>'});
  html+='</div></div></section>';
  how.after(el(html));
}

/* ---------- Home: project brief ---------- */
function brief(){
  var card=document.querySelector('.contact-card'),btn=document.getElementById('service-contact');
  if(!card||!btn||card.querySelector('.eg-brief'))return;
  var times=[['week','خلال أسبوع','Within a week'],['month','خلال شهر','Within a month'],['flex','الموعد مرن','Flexible']];
  var html='<div class="eg-brief"><h4>'+t('متى تحتاج التسليم؟','When do you need it?')+'</h4><fieldset class="eg-chips"><legend class="contact-sr">'+t('موعد التسليم','Timeline')+'</legend>';
  times.forEach(function(x){html+='<label><input type="radio" name="eg-timeline" value="'+x[0]+'" data-ar="'+x[1]+'" data-en="'+x[2]+'"><span>'+(isEn?x[2]:x[1])+'</span></label>'});
  html+='</fieldset><h4><label for="eg-brief-text">'+t('نبذة عن مشروعك (اختياري)','About your project (optional)')+'</label></h4><textarea id="eg-brief-text" maxlength="600" placeholder="'+t('مثال: مطعم جديد في الرياض يحتاج هوية كاملة ومنيو.','Example: a new restaurant in Riyadh that needs a full identity and a menu.')+'"></textarea><p class="eg-brief-note">'+t('ستُضاف اختياراتك إلى رسالة واتساب تلقائيًا، ويمكنك تعديلها قبل الإرسال.','Your choices are added to the WhatsApp message automatically, and you can edit it before sending.')+'</p></div>';
  btn.before(el(html));
  var build=function(){
    var s=card.querySelector('input[name="project-service"]:checked');
    var lab=s?s.closest('label').querySelector('[data-ar]'):null;
    var unsure=s&&s.value==='unsure';
    var tm=card.querySelector('input[name="eg-timeline"]:checked');
    var txt=(card.querySelector('#eg-brief-text').value||'').trim();
    var msg=unsure?t('مرحبًا محمد، أرغب في تطوير مشروعي، لكنني لم أحدد ما أحتاجه بعد.','Hi Mohamed, I would like to develop my project, but I’m not sure what I need yet.'):t('مرحبًا محمد، أرغب في مناقشة مشروع معك.\nالخدمة: '+(lab?lab.dataset.ar:''),'Hi Mohamed, I would like to discuss a project with you.\nService: '+(lab?lab.dataset.en:''));
    if(tm)msg+='\n'+t('موعد التسليم: ','Timeline: ')+(isEn?tm.dataset.en:tm.dataset.ar);
    if(txt)msg+='\n'+t('عن المشروع: ','About the project: ')+txt;
    btn.href=wa(msg);
  };
  card.addEventListener('change',function(){setTimeout(build,0)});
  card.addEventListener('input',build);
  btn.addEventListener('click',build,true);
  setTimeout(build,0);
}

/* ---------- Home: leave feedback (preview only) ---------- */
function leave(){
  var fb=document.getElementById('feedback');if(!fb||fb.querySelector('.eg-leave'))return;
  var node=el('<div class="eg-leave"><h3>'+t('عملنا معًا من قبل؟','Have we worked together?')+'</h3><p>'+t('يسعدني أن أعرف رأيك في التجربة. يُراجع كل رأي قبل نشره في الموقع.','I would love to hear about your experience. Every review is checked before it appears on the site.')+'</p><button type="button" class="eg-leave-toggle" aria-expanded="false">'+t('شاركني رأيك','Share your feedback')+'</button>'+
    '<form hidden novalidate><label>'+t('الاسم (اختياري)','Name (optional)')+'<input name="name" maxlength="40" autocomplete="name"></label><label>'+t('الجهة أو النشاط (اختياري)','Company or business (optional)')+'<input name="role" maxlength="60" autocomplete="organization"></label><label class="full">'+t('رأيك','Your feedback')+'<textarea name="message" maxlength="800" required></textarea></label><button class="button" type="submit">'+t('إرسال الرأي','Send feedback')+'</button><p class="eg-leave-status" role="status" aria-live="polite"></p></form></div>');
  fb.appendChild(node);
  var tg=node.querySelector('.eg-leave-toggle'),f=node.querySelector('form'),st=node.querySelector('.eg-leave-status');
  tg.addEventListener('click',function(){var o=f.hidden;f.hidden=!o;tg.setAttribute('aria-expanded',String(o));if(o)f.querySelector('textarea').focus()});
  f.addEventListener('submit',function(e){e.preventDefault();if(!f.message.value.trim()){st.textContent=t('اكتب رأيك أولًا.','Please write your feedback first.');f.message.focus();return}st.textContent=t('هذه نسخة معاينة: لن يُرسل الرأي قبل تفعيل الخدمة.','Preview only: feedback is not sent until the service is activated.')});
}

/* ---------- Footer socials (placeholders in preview) ---------- */
function socials(){
  var box=document.querySelector('footer.foot>div');if(!box||box.querySelector('.eg-pending'))return;
  ['Instagram','Behance','LinkedIn'].forEach(function(n){var a=el('<a class="eg-pending" href="#" title="'+t('رابط مؤقت للمعاينة','Placeholder link for preview')+'">'+n+'</a>');a.addEventListener('click',function(e){e.preventDefault()});box.appendChild(a)});
}

function init(){
  try{projectPage()}catch(e){}
  if(document.getElementById('home')){[stats,compare,faq,brief].forEach(function(f){try{f()}catch(e){console.warn('[HEEM]',e)}})}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
