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

  section.classList.add("cf-demo-section");
  track.classList.add("cf-demo-track");

  const style = document.createElement("style");
  style.textContent = `
    #identity.cf-demo-section{
      min-height:100svh!important;
      padding:70px 0 80px!important;
      display:block!important;
      overflow:hidden!important;
      background:#091a3b!important;
    }
    #identity.cf-demo-section::before,#identity.cf-demo-section::after{display:none!important;content:none!important}
    #identity.cf-demo-section .portfolio-head,
    #identity.cf-demo-section .portfolio-sidecopy,
    #identity.cf-demo-section .slider-controls,
    #identity.cf-demo-section .drag-hint,
    #identity.cf-demo-section .slider-progress{display:none!important}
    #identity.cf-demo-section .slider-shell{
      position:relative!important;
      width:100%!important;
      max-width:none!important;
      margin:0!important;
      padding:0!important;
      overflow:hidden!important;
      background:transparent!important;
      border:0!important;
      box-shadow:none!important;
    }
    #identity-track.cf-demo-track{
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
    #identity-track.cf-demo-track.is-dragging{cursor:grabbing!important}
    #identity-track.cf-demo-track::before,#identity-track.cf-demo-track::after{display:none!important;content:none!important}
    #identity-track.cf-demo-track .identity-card{
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
      box-shadow:0 20px 45px rgba(0,0,0,.24)!important;
      filter:none!important;
      transform-origin:center!important;
      backface-visibility:hidden!important;
      will-change:transform,opacity!important;
      transition:none!important;
      user-select:none!important;
    }
    #identity-track.cf-demo-track .identity-image{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;margin:0!important;border:0!important;border-radius:0!important;overflow:hidden!important}
    #identity-track.cf-demo-track .identity-image img{width:100%!important;height:100%!important;display:block!important;object-fit:cover!important;object-position:center!important;pointer-events:none!important;user-select:none!important}
    #identity-track.cf-demo-track .identity-copy,#identity-track.cf-demo-track .card-number{display:none!important}
    #identity.cf-demo-section .cf-demo-caption{
      width:100%!important;
      margin:2px auto 0!important;
      padding:0 24px!important;
      display:flex!important;
      flex-direction:column!important;
      align-items:center!important;
      text-align:center!important;
    }
    #identity.cf-demo-section .cf-demo-caption h3{margin:0!important;color:#f5f7fb!important;font-size:15px!important;font-weight:700!important;letter-spacing:-.02em!important;line-height:1.25!important}
    #identity.cf-demo-section .cf-demo-caption .cf-subtitle{margin:6px 0 0!important;color:#aabbd5!important;font-size:13px!important;line-height:1.4!important}
    #identity.cf-demo-section .cf-demo-meta{width:100%!important;max-width:230px!important;margin:38px auto 0!important;font-size:12px!important}
    #identity.cf-demo-section .cf-demo-meta div{display:flex!important;justify-content:space-between!important;gap:24px!important;padding:5px 0!important}
    #identity.cf-demo-section .cf-demo-meta dt{color:#8fa1bc!important;font-weight:500!important}
    #identity.cf-demo-section .cf-demo-meta dd{margin:0!important;color:#f5f7fb!important;font-weight:700!important;text-align:right!important}
    @media(max-width:700px){#identity.cf-demo-section{padding-top:56px!important}#identity-track.cf-demo-track{--cf-card:clamp(148px,58vw,230px)}}
  `;
  document.head.appendChild(style);

  const caption = document.createElement("div");
  caption.className = "cf-demo-caption";
  caption.innerHTML = `
    <h3></h3>
    <p class="cf-subtitle"></p>
    <dl class="cf-demo-meta">
      <div><dt>Type</dt><dd data-meta="type"></dd></div>
      <div><dt>Gallery</dt><dd data-meta="gallery"></dd></div>
      <div><dt>Project</dt><dd data-meta="project"></dd></div>
    </dl>`;
  section.querySelector(".slider-shell")?.after(caption);

  const indexAt = (v) => ((Math.round(v) % count) + count) % count;
  const shortest = (index, center) => {
    let offset = index - center;
    offset = ((offset % count) + count) % count;
    if (offset > count / 2) offset -= count;
    return offset;
  };

  function updateCaption(index) {
    const card = cards[index];
    const title = card?.dataset.projectTitle || card?.querySelector("h3")?.textContent || "";
    const subtitle = card?.querySelector(".identity-copy p")?.textContent || card?.dataset.projectCategory || "";
    const galleryCount = card?.querySelectorAll(".gallery-source img").length || 1;
    const projectNo = card?.querySelector(".card-number")?.textContent?.trim() || String(index + 1).padStart(2,"0");
    caption.querySelector("h3").textContent = title;
    caption.querySelector(".cf-subtitle").textContent = subtitle;
    caption.querySelector('[data-meta="type"]').textContent = subtitle;
    caption.querySelector('[data-meta="gallery"]').textContent = `${galleryCount} slides`;
    caption.querySelector('[data-meta="project"]').textContent = projectNo;
  }

  function measure() {
    width = parseFloat(getComputedStyle(cards[0]).width) || cards[0].offsetWidth || 260;
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
      card.style.pointerEvents = distance < .5 ? "auto" : "none";
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

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.stopImmediatePropagation();
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    target = pos;
    moved = false;
    drag = { id:e.pointerId, x:e.clientX, pos, v:0, t:performance.now(), captured:false };
    track.classList.add("is-dragging");
  }, true);

  track.addEventListener("pointermove", (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    e.stopImmediatePropagation();
    const pitch = width * (1 + gap);
    if (!pitch) return;
    const dx = e.clientX - drag.x;
    if (!moved && Math.abs(dx) > 8) {
      moved = true;
      try { track.setPointerCapture(e.pointerId); drag.captured = true; } catch {}
    }
    if (!moved) return;
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
    const didMove = moved;
    const velocity = drag.v;
    if (drag.captured) { try { track.releasePointerCapture(e.pointerId); } catch {} }
    drag = null;
    track.classList.remove("is-dragging");
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
  track.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    e.stopImmediatePropagation();
    settle(Math.round(target) + (e.key === "ArrowRight" ? 1 : -1));
  }, true);

  track.addEventListener("click", (e) => {
    const card = e.target.closest(".identity-card");
    if (!card || track.dataset.dragged === "true") return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const index = cards.indexOf(card);
    if (index !== indexAt(pos)) return goTo(index);
    if (typeof window.openDeckPreview === "function") window.openDeckPreview(card);
  }, true);

  track.setAttribute("tabindex", "0");
  new ResizeObserver(measure).observe(track);
  requestAnimationFrame(measure);
})();