function cgViewerInit(){if(document.querySelector('#cg-viewer'))return;const viewer=document.createElement('dialog');viewer.id='cg-viewer';viewer.className='cg-viewer';viewer.setAttribute('aria-label',document.documentElement.lang==='en'?'Artwork image viewer':'عرض التصميم بالحجم الكامل');viewer.innerHTML='<div class="cg-viewer-head"><span class="cg-viewer-title"></span><button type="button" aria-label="Close image">×</button></div><img class="cg-viewer-image" alt=""><div class="cg-viewer-controls"><button type="button" aria-label="Previous image">←</button><span class="cg-count"></span><button type="button" aria-label="Next image">→</button></div>';document.body.append(viewer);let items=[],index=0,returnFocus=null;function show(){const b=items[index];viewer.querySelector('img').src=b.dataset.cgSrc;viewer.querySelector('img').alt=b.dataset.cgAlt;viewer.querySelector('.cg-viewer-title').textContent=b.dataset.cgAlt;viewer.querySelector('.cg-count').textContent=(index+1)+' / '+items.length}function step(n){index=(index+n+items.length)%items.length;show()}viewer.querySelector('[aria-label="Close image"]').onclick=()=>viewer.close();viewer.querySelector('[aria-label="Previous image"]').onclick=()=>step(-1);viewer.querySelector('[aria-label="Next image"]').onclick=()=>step(1);viewer.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}if(e.key==='ArrowRight'){e.preventDefault();step(1)}});viewer.addEventListener('close',()=>returnFocus?.focus());document.addEventListener('click',e=>{const b=e.target.closest('[data-cg-src]');if(!b)return;items=[...b.closest('.cg-editorial,.gallery').querySelectorAll('[data-cg-src]')];index=items.indexOf(b);returnFocus=b;show();viewer.showModal()})}

cgViewerInit();

function enhancePortfolioImages(){const scope=document.querySelector('.project-document>.gallery')||document.querySelector('dialog[open]:not(.cg-viewer)>.gallery');if(!scope)return;const page=scope.closest('.project-document');const simple=page&&!scope.querySelector('article,section,figure,.cg-editorial');if(simple){page.classList.add('portfolio-page');scope.classList.add('portfolio-static-grid')}scope.querySelectorAll('img').forEach((im,i)=>{if(im.closest('[data-cg-src]'))return;const button=document.createElement('button');button.type='button';button.className='portfolio-image-button cg-image';button.dataset.cgSrc=im.getAttribute('src');button.dataset.cgAlt=im.alt;button.setAttribute('aria-label',(document.documentElement.lang==='en'?'Enlarge artwork ':'تكبير التصميم ')+(i+1));im.replaceWith(button);button.append(im);const size=()=>{if(im.naturalWidth/im.naturalHeight>1.8)button.classList.add('portfolio-wide');else if(im.naturalWidth/im.naturalHeight>1.2)button.classList.add('portfolio-landscape')};im.addEventListener('load',size,{once:true});if(im.complete)size()})}

enhancePortfolioImages();new MutationObserver(enhancePortfolioImages).observe(document.querySelector('.project-document')||document.querySelector('dialog:not(.cg-viewer)'),{childList:true,subtree:true});


const restoredPortfolioAssets={"label-system":["/assets/projects/bahri-print/bahri-label-broast.png","/assets/projects/bahri-print/bahri-label-dynamite.png","/assets/projects/bahri-print/bahri-label-grilled-fish.png","/assets/projects/bahri-print/bahri-label-qalbi.png","/assets/projects/bahri-print/bahri-label-tahina.png","/assets/projects/bahri-print/bahri-plate-label.jpg","/assets/projects/bahri-print/kollagena-qr-sticker.png"],"meal-box":["/assets/projects/bahri-print/bahri-meal-box-02.jpg","/assets/projects/bahri-print/bahri-meal-box-03.jpg","/assets/projects/bahri-print/bahri-meal-box-04.jpg"],"menu-board":["/assets/projects/bahri-print/bahri-menu-board-02.jpg"],"sandwich-box":["/assets/projects/bahri-print/bahri-sandwich-box-black-01.jpg"],"business-card":["/assets/projects/bahri-print/kollagena-business-card-back.jpg"],"kollagena":["/assets/projects/kollagena-identity/kollagena-cover-card.jpg","/assets/projects/kollagena-identity/kollagena-logo-main.jpg"],"nawa-visual-identity":["/assets/projects/nawa-identity/nawa-logo-black.png","/assets/projects/nawa-identity/nawa-logo-white.png"],"petra":["/assets/projects/petra-logo/petra-logo.png"],"pulse-visual-identity":["/assets/projects/pulse-identity/pulse-brand-board.png"],"rakayez-advanced-solutions":["/assets/projects/rakayez-identity/rakayez-logo.png"],"kollagena-social-media":["/assets/projects/social-media/kollagena-social-cooked-72h-product-banner.jpg","/assets/projects/social-media/kollagena-social-cow-ghee-banner.jpg","/assets/projects/social-media/kollagena-social-health-and-beauty-course.jpg"]};
function restorePortfolioImages(){
 const slug=location.pathname.match(/\/projects\/([^/]+)\//)?.[1];
 const sources=restoredPortfolioAssets[slug];if(!sources)return;
 const scope=document.querySelector('dialog[open]:not(.cg-viewer)>.gallery')||document.querySelector('.project-document>.gallery')||document.querySelector('.project-document .cg-editorial');
 if(!scope)return;
 const label=(document.querySelector('dialog[open]:not(.cg-viewer) #modal-title')||document.querySelector('.project-document h1'))?.textContent?.trim()||slug;
 sources.forEach((src,i)=>{scope.querySelectorAll('img').forEach(im=>{if(im.getAttribute('src')!==src)return;im.alt=label+' — '+(i+1);const b=im.closest('[data-cg-src]');if(b)b.dataset.cgAlt=im.alt})});
 const present=new Set([...scope.querySelectorAll('img')].map(im=>im.getAttribute('src')));
 const missing=sources.filter(src=>!present.has(src));if(!missing.length)return;
 const target=scope.querySelector('.portfolio-art-grid')||scope.querySelector('.cg-editorial')||scope.querySelector('article')||scope;
 const grid=document.createElement('div');grid.className='cg-grid cg-wide portfolio-restored-assets';
 missing.forEach((src,i)=>{const b=document.createElement('button');b.type='button';b.className='cg-image';b.dataset.cgSrc=src;b.dataset.cgAlt=label+' — '+(i+1);b.setAttribute('aria-label',(document.documentElement.lang==='en'?'Enlarge restored artwork ':'تكبير تصميم إضافي ')+(i+1));const im=document.createElement('img');im.src=src;im.alt=b.dataset.cgAlt;im.loading='lazy';b.append(im);grid.append(b)});
 target.append(grid);
}

(function initPortfolioRows(){
 const selector='.portfolio-art-grid,.portfolio-static-grid,.cg-grid,.case-image-grid';
 const observed=new WeakSet();let queued=false;
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;layout()})}
 const sizes=new ResizeObserver(schedule);
 function layout(){restorePortfolioImages();document.querySelectorAll(selector).forEach(grid=>{
 if(!grid.getBoundingClientRect().width||grid.classList.contains('portfolio-formats'))return;
 const items=[...grid.children].filter(b=>b.querySelector('img'));
 if(!items.length)return;
 items.forEach(b=>{const im=b.querySelector('img');im.loading='eager';if(!observed.has(im)){observed.add(im);im.addEventListener('load',schedule);im.addEventListener('error',schedule)}});
 if(!items.every(b=>b.querySelector('img').complete))return;
 grid.classList.remove('portfolio-packed','portfolio-five');grid.classList.add('portfolio-formats');
 const narrative=grid.matches('.cg-grid,.case-image-grid');
 const groups=narrative?[items]:[[],[],[]];
 if(!narrative)items.forEach(b=>{const im=b.querySelector('img'),r=im.naturalWidth/im.naturalHeight;groups[r<.7?0:r>1.8?2:1].push(b)});
 groups.forEach((list,i)=>{
 if(!list.length)return;
 const section=document.createElement('section');section.className='portfolio-format-section';
 const row=document.createElement('div');row.className='portfolio-format-row format-'+(narrative?'case':i);
 let start=0;
 while(start<list.length){
 const first=list[start].querySelector('img'),ratio=first.naturalWidth/first.naturalHeight;
 let count=narrative?(grid.classList.contains('cg-wide')||ratio>1.8?1:grid.classList.contains('cg-pair')?2:3):i===0?5:i===1?3:1;
 if(narrative&&count>1){for(let n=1;n<count&&start+n<list.length;n++){const im=list[start+n].querySelector('img');if(im.naturalWidth/im.naturalHeight>1.8){count=n;break}}}
 const line=document.createElement('div');line.className='portfolio-format-line';
 list.slice(start,start+count).forEach(b=>{const im=b.querySelector('img');b.style.gridRowEnd='';b.style.flexGrow=String((im.naturalWidth/im.naturalHeight||1)*100);b.classList.add('portfolio-row-item');line.append(b)});
 row.append(line);start+=count;
 }
 section.append(row);grid.append(section);
 });
 if(!observed.has(grid)){observed.add(grid);sizes.observe(grid)}
 })}
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('resize',schedule);schedule();
})();
