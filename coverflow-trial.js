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

  let pos = 0, target = 0, width = 0, raf = null, drag = null, moved = false;

  section.classList.add("identity-coverflow-reference");
  track.classList.add("heem-coverflow-reference");

  // The reference component is a clean, centered carousel. Remove the old
  // editorial split layout only for this trial section; keep HEEM's blue palette.
  const style = document.createElement("style");
  style.textContent = `
    #identity.identity-coverflow-reference{
      min-height:100svh!important;
      padding:clamp(90px,11vh,130px) 0 70px!important;
      display:flex!important;
      flex-direction:column!important;
      justify-content:center!important;
      overflow:hidden!important;
      background:#091a3b!important;
      isolation:isolate!important;
    }
    #identity.identity-coverflow-reference::before,
    #identity.identity-coverflow-reference::after{display:none!important;content:none!important}
    #identity.identity-coverflow-reference .portfolio-head{
      width:100%!important;
      max-width:none!important;
      margin:0!important;
      padding:0 var(--pad) 22px!important;
      display:block!important;
      text-align:center!important;
      position:relative!important;
      z-index:3!important;
    }
    #identity.identity-coverflow-reference .portfolio-head>div:first-child{display:block!important}
    #identity.identity-coverflow-reference .portfolio-head .section-index{margin:0 0 8px!important;text-align:center!important}
    #identity.identity-coverflow-reference .portfolio-head h2{
      margin:0!important;
      font-family:"Manrope",sans-serif!important;
      font-size:clamp(1.65rem,3vw,2.55rem)!important;
      line-height:1.05!important;
      letter-spacing:-.045em!important;
      text-transform:none!important;
      color:#f5f7fb!important;
    }
    #identity.identity-coverflow-reference .portfolio-head h2 br{display:none!important}
    #identity.identity-coverflow-reference .portfolio-head h2 span{color:#69aeff!important;font-style:normal!important}
    #identity.identity-coverflow-reference .portfolio-sidecopy{display:none!important}
    #identity.identity-coverflow-reference .slider-shell{
      width:100%!important;
      margin:0!important;
      padding:0!important;
      overflow:hidden!important;
      background:transparent!important;
      box-shadow:none!important;
      border:0!important;
      position:relative!important;
      z-index:2!important;
    }
    #identity-track.heem-coverflow-reference{
      --cf-card:clamp(210px,22vw,320px);
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
    #identity-track.heem-coverflow-reference.is-dragging{cursor:grabbing!important}
    #identity-track.heem-coverflow-reference::before,
    #identity-track.heem-coverflow-reference::after{display:none!important;content:none!important}
    #identity-track.heem-coverflow-reference .identity-card{
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
      border-radius:18px!important;
      background:#102956!important;
      box-shadow:none!important;
      filter:none!important;
      transform-origin:center!important;
      transform-style:preserve-3d!important;
      backface-visibility:hidden!important;
      will-change:transform,opacity!important;
      transition:none!important;
      user-select:none!important;
    }
    #identity-track.heem-coverflow-reference .identity-image{
      position:absolute!important;inset:0!important;width:100%!important;height:100%!important;margin:0!important;border:0!important;border-radius:0!important;overflow:hidden!important
    }
    #identity-track.heem-coverflow-reference .identity-image img{
      width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;display:block!important;pointer-events:none!important
    }
    #identity-track.heem-coverflow-reference .identity-copy,
    #identity-track.heem-coverflow-reference .card-number{display:none!important}
    #identity.identity-coverflow-reference .drag-hint{display:none!important}
    #identity.identity-coverflow-reference .cf-caption{
      min-height:52px;margin:2px auto 0;padding:0 20px;text-align:center;position:relative;z-index:3
    }
    #identity.identity-coverflow-reference .cf-caption h3{margin:0;color:#f5f7fb;font-size:15px;font-weight:700;letter-spacing:-.02em}
    #identity.identity-coverflow-reference .cf-caption p{margin:5px 0 0;color:#69aeff;font-size:12px;font-weight:600}
    #identity.identity-coverflow-reference .cf-dots{display:flex;justify-content:center;align-items:center;gap:8px;margin-top:14px;position:relative;z-index:3}
    #identity.identity-coverflow-reference .cf-dot{width:8px;height:8px;padding:0;border:0;border-radius:50%;background:#f5f7fb;opacity:.28;cursor:pointer;transition:opacity .2s ease,transform .2s ease}
    #identity.identity-coverflow-reference .cf-dot.active{opacity:1;transform:scale(1.08)}
    @media(max-width:760px){
      #identity.identity-coverflow-reference{padding-top:90px!important}
      #identity-track.heem-coverflow-reference{--cf-card:clamp(180px,58vw,250px)}
      #identity.identity-coverflow-reference .portfolio-head{padding-bottom:12px!important}
    }
  `;
  document.head.appendChild(style);

  const caption = document.createElement("div");
  caption.className = "cf-caption";
  caption.innerHTML = "<h3></h3><p></p>";
  section.querySelector(".slider-shell")?.after(caption);

  const dots = document.createElement("div");
  dots.className = "cf-dots";
  cards.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cf-dot";
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dots.appendChild(b);
  });
  caption.after(dots);

  const indexAt = (v) => ((Math.round(v) % count) + count) % count;
  const shortest = (index, center) => {
    let offset = index - center;
    offset = ((offset % count) + count) % count;
    if (offset > count / 2) offset -= count;
    return offset;
  };

  function updateCaption(index) {
    const card = cards[index];
    caption.querySelector("h3").textContent = card?.dataset.projectTitle || card?.querySelector("h3")?.textContent || "";
    caption.querySelector("p").textContent = card?.querySelector(".identity-copy p")?.textContent || "";
    Array.from(dots.children).forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  function measure() {
    const cssWidth = parseFloat(getComputedStyle(cards[0]).width);
    width = cssWidth || cards[0].offsetWidth || 260;
    paint();
  }

  function paint() {
    if (!width) return;
    const pitch = width * (1 + gap);
    cards.forEach((card, index) => {
      const offset = shortest(index, pos);
      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
      const edge = Math.min(1, Math.max(0, count / 2 - distance));
      card.style.transform = `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
      card.style.pointerEvents = distance < .48 ? "auto" : "none";
    });
    const active = indexAt(pos);
    track.dataset.activeIndex = String(active);
    updateCaption(active);
  }

  function settle(next) {
    if (raf !== null) cancelAnimationFrame(raf);
    target = next;
    const step = () => {
      const remaining = target - pos;
      if (reduce || Math.abs(remaining) < .0004) {
        pos = target; paint(); raf = null; return;
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
  function nudge(by) { settle(Math.round(target) + by); }

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.stopImmediatePropagation();
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    target = pos; moved = false;
    drag = { id:e.pointerId, x:e.clientX, pos, v:0, t:performance.now(), captured:false };
    track.classList.add("is-dragging");
  }, true);

  track.addEventListener("pointermove", (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    e.stopImmediatePropagation();
    const pitch = width * (1 + gap);
    const dx = e.clientX - drag.x;
    if (!moved && Math.abs(dx) > 8) {
      moved = true;
      try { track.setPointerCapture(e.pointerId); drag.captured = true; } catch {}
    }
    if (!moved || !pitch) return;
    const now = performance.now();
    const previous = pos;
    pos = drag.pos - dx / pitch;
    drag.v = ((pos - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;
    paint();
  }, true);

  const endDrag = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    e.stopImmediatePropagation();
    const didMove = moved, velocity = drag.v;
    if (drag.captured) { try { track.releasePointerCapture(e.pointerId); } catch {} }
    drag = null; track.classList.remove("is-dragging");
    if (didMove) {
      track.dataset.dragged = "true";
      const carried = Math.max(-2, Math.min(2, velocity * .18));
      settle(Math.round(pos + carried));
      setTimeout(() => track.dataset.dragged = "false", 100);
    }
  };
  track.addEventListener("pointerup", endDrag, true);
  track.addEventListener("pointercancel", endDrag, true);
  track.addEventListener("dragstart", (e) => e.preventDefault(), true);

  track.addEventListener("click", (e) => {
    const card = e.target.closest(".identity-card");
    if (!card || track.dataset.dragged === "true") return;
    e.preventDefault(); e.stopImmediatePropagation();
    const i = cards.indexOf(card);
    if (i !== indexAt(pos)) return goTo(i);
    if (typeof window.openDeckPreview === "function") window.openDeckPreview(card);
  }, true);

  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault(); e.stopImmediatePropagation();
      nudge(e.key === "ArrowRight" ? 1 : -1);
    }
  }, true);

  track.setAttribute("tabindex", "0");
  new ResizeObserver(measure).observe(track);
  requestAnimationFrame(measure);
})();