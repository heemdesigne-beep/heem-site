function cgViewerInit(){if(document.querySelector('#cg-viewer'))return;const viewer=document.createElement('dialog');viewer.id='cg-viewer';viewer.className='cg-viewer';viewer.setAttribute('aria-label',document.documentElement.lang==='en'?'Artwork image viewer':'عرض التصميم بالحجم الكامل');viewer.innerHTML='<div class="cg-viewer-head"><span class="cg-viewer-title"></span><button type="button" aria-label="Close image">×</button></div><img class="cg-viewer-image" alt=""><div class="cg-viewer-controls"><button type="button" aria-label="Previous image">←</button><span class="cg-count"></span><button type="button" aria-label="Next image">→</button></div>';document.body.append(viewer);let items=[],index=0,returnFocus=null;function show(){const b=items[index];viewer.querySelector('img').src=b.dataset.cgSrc;viewer.querySelector('img').alt=b.dataset.cgAlt;viewer.querySelector('.cg-viewer-title').textContent=b.dataset.cgAlt;viewer.querySelector('.cg-count').textContent=(index+1)+' / '+items.length}function step(n){index=(index+n+items.length)%items.length;show()}viewer.querySelector('[aria-label="Close image"]').onclick=()=>viewer.close();viewer.querySelector('[aria-label="Previous image"]').onclick=()=>step(-1);viewer.querySelector('[aria-label="Next image"]').onclick=()=>step(1);viewer.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}if(e.key==='ArrowRight'){e.preventDefault();step(1)}});viewer.addEventListener('close',()=>returnFocus?.focus());document.addEventListener('click',e=>{const b=e.target.closest('[data-cg-src]');if(!b)return;items=[...b.closest('.cg-editorial,.gallery').querySelectorAll('[data-cg-src]')];index=items.indexOf(b);returnFocus=b;show();viewer.showModal()})}

cgViewerInit();

function enhancePortfolioImages(){const scope=document.querySelector('.project-document>.gallery')||document.querySelector('dialog[open]:not(.cg-viewer)>.gallery');if(!scope)return;const page=scope.closest('.project-document');const simple=page&&!scope.querySelector('article,section,figure,.cg-editorial');if(simple){page.classList.add('portfolio-page');scope.classList.add('portfolio-static-grid')}scope.querySelectorAll('img').forEach((im,i)=>{if(im.closest('[data-cg-src]'))return;const button=document.createElement('button');button.type='button';button.className='portfolio-image-button cg-image';button.dataset.cgSrc=im.getAttribute('src');button.dataset.cgAlt=im.alt;button.setAttribute('aria-label',(document.documentElement.lang==='en'?'Enlarge artwork ':'تكبير التصميم ')+(i+1));im.replaceWith(button);button.append(im);const size=()=>{if(im.naturalWidth/im.naturalHeight>1.8)button.classList.add('portfolio-wide');else if(im.naturalWidth/im.naturalHeight>1.2)button.classList.add('portfolio-landscape')};im.addEventListener('load',size,{once:true});if(im.complete)size()})}

enhancePortfolioImages();new MutationObserver(enhancePortfolioImages).observe(document.querySelector('.project-document')||document.querySelector('dialog:not(.cg-viewer)'),{childList:true,subtree:true});
(function initPackedGalleries(){
 const selector='.portfolio-art-grid,.portfolio-static-grid';
 const watched=new WeakSet();let queued=false;
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;layout()})}
 const observer=new ResizeObserver(schedule);
 function layout(){document.querySelectorAll(selector).forEach(grid=>{
 if(!grid.getBoundingClientRect().width)return;
 grid.classList.add('portfolio-packed');
 const gap=parseFloat(getComputedStyle(grid).rowGap)||0;
 [...grid.children].forEach(item=>{
 if(!watched.has(item)){watched.add(item);observer.observe(item);item.querySelectorAll('img').forEach(im=>im.addEventListener('load',schedule))}
 const image=item.querySelector('img');
 let height=image?.naturalWidth?item.getBoundingClientRect().width*image.naturalHeight/image.naturalWidth:item.getBoundingClientRect().height;
 if(!height)height=item.getBoundingClientRect().width;
 const span=Math.max(1,Math.ceil((height+gap)/(1+gap)));
 const value='span '+span;if(item.style.gridRowEnd!==value)item.style.gridRowEnd=value;
 });
 if(!watched.has(grid)){watched.add(grid);observer.observe(grid)}
 })}
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('resize',schedule);schedule();
})();
