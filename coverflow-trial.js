(() => {
  const section = document.getElementById("identity");
  const track = document.getElementById("identity-track");
  if (!section || !track) return;

  const cards = Array.from(track.children).filter((el) => el.matches(".identity-card"));
  if (!cards.length) return;

  const count = cards.length;
  const rotate = 44;
  const depth = 0.6;
  const perspective = 3;
  const falloff = 0.56;
  const fade = 0.1;
  const gap = 0.05;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let pos = 0;
  let target = 0;
  let width = 0;
  let raf = null;
  let drag = null;
  let moved = false;

  section.classList.add("identity-coverflow-original");
  track.classList.add("heem-coverflow-original");

  const style = document.createElement("style");
  style.textContent = `
    #identity.identity-coverflow-original{
      min-height:100svh!important;
      padding:clamp(92px,11vh,125px) 0 64px!important;
      display:flex!important;
      flex-direction:column!important;
      justify-content:center!important;
      overflow:hidden!important;
      background:#091a3b!important;
      isolation:isolate!important;
    }
    #identity.identity-coverflow-original::before,
    #identity.identity-coverflow-original::after{display:none!important;content:none!important}
    #identity.identity-coverflow-original .portfolio-head{
      width:100%!important;
      margin:0!important;
      padding:0 var(--pad) 18px!important;
      display:block!important;
      text-align:center!important;
    }
    #identity.identity-coverflow-original .portfolio-head .section-index{
      margin:0 0 9px!important;
      text-align:center!important;
    }
    #identity.identity-coverflow-original .portfolio-head h2{
      margin:0!important;
      font-family:"Manrope",sans-serif!important;
      font-size:clamp(1.4rem,2.35vw,2rem)!important;
      line-height:1.1!important;
      letter-spacing:-.035em!important;
      text-transform:none!important;
      color:#f5f7fb!important;
    }
    #identity.identity-coverflow-original .portfolio-head h2 br{display:none!important}
    #identity.identity-coverflow-original .portfolio-head h2 span{color:#69aeff!important;font-style:normal!important}
    #identity.identity-coverflow-original .portfolio-sidecopy{display:none!important}
    #identity.identity-coverflow-original .slider-shell{
      position:relative!important;
      width:100%!important;
      margin:0!important;
      padding:0!important;
      overflow:hidden!important;
      background:transparent!important;
      border:0!important;
      box-shadow:none!important;
    }
    #identity-track.heem-coverflow-original{
      --cf-card:clamp(148px,22vw,260px);
      position:relative!important;
      width:100%!important;
      height:calc(var(--cf-card) + 80px)!important;
      margin:0!important;
      padding:40px 0!important;
      overflow:hidden!important;
      perspective:calc(var(--cf-card) * ${perspective})!important;
      transform-style:preserve-3d!important;
      touch-action:pan-y!important;
      cursor:grab!important;
      outline:none!important;
      background:transparent!important;
      box-shadow:none!important;
      filter:none!important;
    }
    #identity-track.heem-coverflow-original.is-dragging{cursor:grabbing!important}
    #identity-track.heem-coverflow-original::before,
    #identity-track.heem-coverflow-original::after{display:none!important;content:none!important}
    #identity-track.heem-coverflow-original .identity-card{
      position:absolute!important;
      left:50%!important;
      top:40px!important;
      width:var(--cf-card)!important;
      height:var(--cf-card)!important;
      aspect-ratio:1!important;
      margin:0!important;
      padding:0!important;
      overflow:hidden!important;
      border:0!important;
      border-radius:16px!important;
      background:#102956!important;
      box-shadow:0 14px 28px rgba(0,0,0,.24)!important;
      filter:none!important;
      transform-origin:center!important;
      backface-visibility:hidden!important;
      will-change:transform,opacity!important;
      transition:none!important;
      user-select:none!important;
    }
    #identity-track.heem-coverflow-original .identity-image{
      position:absolute!important;
      inset:0!important;
      width:100%!important;
      height:100%!important;
      margin:0!important;
      border:0!important;
      border-radius:0!important;
      overflow:hidden!important;
    }
    #identity-track.heem-coverflow-original .identity-image img{
      width:100%!important;
      height:100%!important;
      object-fit:cover!important;
      object-position:center!important;
      display:block!important;
      pointer-events:none!important;
      user-select:none!important;
    }
    #identity-track.heem-coverflow-original .identity-copy,
    #identity-track.heem-coverflow-original .card-number{display:none!important}
    #identity.identity-coverflow-original .drag-hint,
    #identity.identity-coverflow-original .slider-progress{display:none!important}
    #identity.identity-coverflow-original .cf-info{
      width:min(100%,330px);
      margin:0 auto;
      padding:0 22px;
      text-align:center;
      position:relative;
      z-index:3;
    }
    #identity.identity-coverflow-original .cf-info h3{
      margin:0;
      color:#f5f7fb;
      font-size:15px;
      font-weight:700;
      letter-spacing:-.02em;
      line-height:1.25;
    }
    #identity.identity-coverflow-original .cf-info .cf-subtitle{
      margin:5px 0 0;
      color:#aabbd5;
      font-size:13px;
      line-height:1.4;
    }
    #identity.identity-coverflow-original .cf-meta{
      width:230px;
      margin:38px auto 0;
      display:grid;
      gap:0;
      font-size:12px;
      text-align:left;
    }
    #identity.identity-coverflow-original .cf-meta div{
      display:flex;
      justify-content:space-between;
      gap:22px;
      padding:5px 0;
    }
    #identity.identity-coverflow-original .cf-meta dt{color:#aabbd5}
    #identity.identity-coverflow-original .cf-meta dd{
      margin:0;
      max-width:140px;
      color:#f5f7fb;
      font-weight:700;
      text-align:right;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
    @media(max-width:760px){
      #identity.identity-coverflow-original{padding-top:86px!important}
      #identity-track.heem-coverflow-original{--cf-card:clamp(148px,56vw,235px)}
      #identity.identity-coverflow-original .cf-meta{margin-top:28px}
    }
  `;
  document.head.appendChild(style);

  const info = document.createElement("div");
  info.className = "cf-info";
  info.innerHTML = `
    <h3></h3>
    <p class="cf-subtitle"></p>
    <dl class="cf-meta">
      <div><dt>Type</dt><dd data-meta="type"></dd></div>
      <div><dt>Gallery</dt><dd data-meta="gallery"></dd></div>
      <div><dt>Project</dt><dd data-meta="project"></dd></div>
    </dl>
  `;
  section.querySelector(".slider-shell")?.after(info);

  const indexAt = (value) => ((Math.round(value) % count) + count) % count;

  function shortestOffset(index, center) {
    let offset = index - center;
    offset = ((offset % count) + count) % count;
    if (offset > count / 2) offset -= count;
    return offset;
  }

  function updateInfo(index) {
    const card = cards[index];
    const title = card?.dataset.projectTitle || card?.querySelector("h3")?.textContent || "";
    const category = card?.dataset.projectCategory || card?.querySelector(".identity-copy p")?.textContent || "Visual Identity";
    const shortType = category.split("/")[0].trim();
    const galleryCount = card?.querySelectorAll(".gallery-source img").length || 1;

    info.querySelector("h3").textContent = title;
    info.querySelector(".cf-subtitle").textContent = shortType;
    info.querySelector('[data-meta="type"]').textContent = shortType;
    info.querySelector('[data-meta="gallery"]').textContent = `${galleryCount} slides`;
    info.querySelector('[data-meta="project"]').textContent = String(index + 1).padStart(2,"0");
  }

  function measure() {
    width = parseFloat(getComputedStyle(cards[0]).width) || cards[0].offsetWidth || 260;
    paint();
  }

  function paint() {
    if (!width) return;
    const pitch = width * (1 + gap);

    cards.forEach((card, index) => {
      const offset = shortestOffset(index, pos);
      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
      const edge = Math.min(1, Math.max(0, count / 2 - distance));

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
      card.style.pointerEvents = distance < .48 ? "auto" : "none";
    });

    const active = indexAt(pos);
    track.dataset.activeIndex = String(active);
    updateInfo(active);
  }

  function settle(nextTarget) {
    if (raf !== null) cancelAnimationFrame(raf);
    target = nextTarget;

    const step = () => {
      const remaining = target - pos;
      if (reduce || Math.abs(remaining) < .0004) {
        pos = target;
        paint();
        raf = null;
        return;
      }
      pos += remaining * .16;
      paint();
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
  }

  function goTo(index) {
    settle(index + Math.round((target - index) / count) * count);
  }

  function nudge(by) {
    settle(Math.round(target) + by);
  }

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.stopImmediatePropagation();
    if (raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    target = pos;
    moved = false;
    drag = {
      id: event.pointerId,
      x: event.clientX,
      pos,
      v: 0,
      t: performance.now(),
      captured: false
    };
    track.classList.add("is-dragging");
  }, true);

  track.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    event.stopImmediatePropagation();
    const pitch = width * (1 + gap);
    if (!pitch) return;

    const dx = event.clientX - drag.x;
    if (!moved && Math.abs(dx) > 8) {
      moved = true;
      try {
        track.setPointerCapture(event.pointerId);
        drag.captured = true;
      } catch {}
    }
    if (!moved) return;

    const now = performance.now();
    const previous = pos;
    pos = drag.pos - dx / pitch;
    drag.v = ((pos - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;
    paint();
  }, true);

  const endDrag = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    event.stopImmediatePropagation();
    const didMove = moved;
    const velocity = drag.v;

    if (drag.captured) {
      try { track.releasePointerCapture(event.pointerId); } catch {}
    }

    drag = null;
    track.classList.remove("is-dragging");

    if (didMove) {
      track.dataset.dragged = "true";
      const carried = Math.max(-2, Math.min(2, velocity * .18));
      settle(Math.round(pos + carried));
      setTimeout(() => { track.dataset.dragged = "false"; }, 90);
    }
  };

  track.addEventListener("pointerup", endDrag, true);
  track.addEventListener("pointercancel", endDrag, true);
  track.addEventListener("dragstart", (event) => event.preventDefault(), true);

  track.addEventListener("click", (event) => {
    const card = event.target.closest(".identity-card");
    if (!card || card.parentElement !== track || track.dataset.dragged === "true") return;
    const index = cards.indexOf(card);

    if (index !== indexAt(pos)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      goTo(index);
    }
    // Active-card clicks intentionally continue to the site's existing
    // preview handler, preserving the approved modal behavior.
  }, true);

  track.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    nudge(event.key === "ArrowRight" ? 1 : -1);
  }, true);

  track.setAttribute("tabindex", "0");
  new ResizeObserver(measure).observe(track);
  requestAnimationFrame(measure);
})();