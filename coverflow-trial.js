(() => {
  const section = document.getElementById("identity");
  const originalTrack = document.getElementById("identity-track");
  if (!section || !originalTrack) return;

  // script-core has already wired the old deck/drag system. Clone the track so
  // Visual Identity gets a clean event surface and cannot be pulled around by it.
  const track = originalTrack.cloneNode(true);
  originalTrack.replaceWith(track);
  track.classList.remove("deck-track", "is-dragging");
  track.removeAttribute("style");
  track.dataset.activeIndex = "0";

  const cards = Array.from(track.children).filter((el) => el.matches(".identity-card"));
  if (!cards.length) return;

  cards.forEach((card) => {
    card.removeAttribute("style");
    card.classList.remove("deck-active");
    card.querySelectorAll(".identity-image,.identity-image img").forEach((node) => node.removeAttribute("style"));
  });

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

  section.classList.add("cf-exact-demo");
  track.classList.add("cf-exact-track");

  const stage = section.querySelector(":scope > .portfolio-stage") || section;
  const shell = track.closest(".slider-shell");
  if (!shell) return;

  // Remove extras previously injected by older coverflow trials.
  stage.querySelectorAll(":scope > .cf-demo-caption,:scope > .cf-caption,:scope > .cf-dots,:scope > .cf-exact-caption").forEach((el) => el.remove());

  const style = document.createElement("style");
  style.textContent = `
    #identity.cf-exact-demo{
      height:auto!important;
      min-height:100svh!important;
      padding:0!important;
      overflow:hidden!important;
      background:#091a3b!important;
      border:0!important;
      isolation:isolate!important;
    }
    #identity.cf-exact-demo::before,#identity.cf-exact-demo::after{display:none!important;content:none!important}
    #identity.cf-exact-demo>.portfolio-stage{
      position:relative!important;
      top:auto!important;
      width:100%!important;
      height:auto!important;
      min-height:100svh!important;
      padding:clamp(70px,9vh,105px) 0 70px!important;
      margin:0!important;
      display:flex!important;
      flex-direction:column!important;
      align-items:stretch!important;
      justify-content:center!important;
      overflow:hidden!important;
      transform:none!important;
      grid-template-columns:none!important;
      background:transparent!important;
    }
    #identity.cf-exact-demo>.portfolio-stage::before,#identity.cf-exact-demo>.portfolio-stage::after{display:none!important;content:none!important}
    #identity.cf-exact-demo .portfolio-head,
    #identity.cf-exact-demo .portfolio-sidecopy,
    #identity.cf-exact-demo .slider-controls,
    #identity.cf-exact-demo .drag-hint,
    #identity.cf-exact-demo .slider-progress{display:none!important}
    #identity.cf-exact-demo .slider-shell{
      position:relative!important;
      width:100%!important;
      max-width:none!important;
      height:auto!important;
      margin:0!important;
      padding:0!important;
      overflow:hidden!important;
      background:transparent!important;
      border:0!important;
      box-shadow:none!important;
      transform:none!important;
    }
    #identity.cf-exact-demo .slider-shell::before,#identity.cf-exact-demo .slider-shell::after{display:none!important;content:none!important}
    #identity-track.cf-exact-track{
      --cf-card:clamp(148px,22vw,260px);
      position:relative!important;
      left:auto!important;
      top:auto!important;
      width:100%!important;
      max-width:none!important;
      height:calc(var(--cf-card) + 80px)!important;
      min-height:0!important;
      margin:0!important;
      padding:40px 0!important;
      display:block!important;
      overflow:hidden!important;
      perspective:calc(var(--cf-card) * ${perspective})!important;
      transform-style:preserve-3d!important;
      transform:none!important;
      touch-action:pan-y!important;
      cursor:grab!important;
      outline:none!important;
      background:transparent!important;
      box-shadow:none!important;
      filter:none!important;
      scroll-snap-type:none!important;
    }
    #identity-track.cf-exact-track.is-dragging{cursor:grabbing!important}
    #identity-track.cf-exact-track::before,#identity-track.cf-exact-track::after{display:none!important;content:none!important}
    #identity-track.cf-exact-track>.identity-card{
      position:absolute!important;
      left:50%!important;
      top:40px!important;
      width:var(--cf-card)!important;
      height:var(--cf-card)!important;
      min-width:0!important;
      max-width:none!important;
      aspect-ratio:1!important;
      margin:0!important;
      padding:0!important;
      display:block!important;
      overflow:hidden!important;
      border:0!important;
      border-radius:16px!important;
      background:#102956!important;
      box-shadow:0 20px 40px rgba(0,0,0,.22)!important;
      filter:none!important;
      transform-origin:center!important;
      transform-style:preserve-3d!important;
      backface-visibility:hidden!important;
      will-change:transform,opacity!important;
      transition:none!important;
      user-select:none!important;
      scroll-snap-align:none!important;
    }
    #identity-track.cf-exact-track>.identity-card .identity-image{
      position:absolute!important;
      inset:0!important;
      width:100%!important;
      height:100%!important;
      min-height:0!important;
      margin:0!important;
      border:0!important;
      border-radius:0!important;
      overflow:hidden!important;
    }
    #identity-track.cf-exact-track>.identity-card .identity-image img{
      width:100%!important;
      height:100%!important;
      max-width:none!important;
      display:block!important;
      object-fit:cover!important;
      object-position:center!important;
      pointer-events:none!important;
      user-select:none!important;
    }
    #identity-track.cf-exact-track>.identity-card .identity-copy,
    #identity-track.cf-exact-track>.identity-card .card-number{display:none!important}
    #identity.cf-exact-demo .cf-exact-caption{
      width:100%!important;
      margin:2px auto 0!important;
      padding:0 24px!important;
      display:flex!important;
      flex-direction:column!important;
      align-items:center!important;
      text-align:center!important;
      position:relative!important;
      z-index:5!important;
    }
    #identity.cf-exact-demo .cf-exact-caption h3{
      margin:0!important;
      color:#f5f7fb!important;
      font:700 15px/1.25 "Manrope",sans-serif!important;
      letter-spacing:-.02em!important;
    }
    #identity.cf-exact-demo .cf-exact-subtitle{
      margin:6px 0 0!important;
      color:#aabbd5!important;
      font:500 13px/1.4 "Manrope",sans-serif!important;
    }
    #identity.cf-exact-demo .cf-exact-meta{
      width:100%!important;
      max-width:230px!important;
      margin:38px auto 0!important;
      padding:0!important;
      font:500 12px/1.45 "Manrope",sans-serif!important;
    }
    #identity.cf-exact-demo .cf-exact-meta>div{
      display:flex!important;
      align-items:center!important;
      justify-content:space-between!important;
      gap:28px!important;
      padding:5px 0!important;
    }
    #identity.cf-exact-demo .cf-exact-meta dt{color:#8fa1bc!important;font-weight:500!important}
    #identity.cf-exact-demo .cf-exact-meta dd{margin:0!important;color:#f5f7fb!important;font-weight:700!important;text-align:right!important}
    @media(max-width:700px){
      #identity.cf-exact-demo>.portfolio-stage{padding:58px 0!important}
      #identity-track.cf-exact-track{--cf-card:clamp(148px,58vw,230px)}
    }
  `;
  document.head.appendChild(style);

  const caption = document.createElement("div");
  caption.className = "cf-exact-caption";
  caption.innerHTML = `
    <h3></h3>
    <p class="cf-exact-subtitle"></p>
    <dl class="cf-exact-meta">
      <div><dt>Type</dt><dd data-meta="type"></dd></div>
      <div><dt>Gallery</dt><dd data-meta="gallery"></dd></div>
      <div><dt>Project</dt><dd data-meta="project"></dd></div>
    </dl>`;
  shell.insertAdjacentElement("afterend", caption);

  const indexAt = (value) => ((Math.round(value) % count) + count) % count;
  const foldedOffset = (index, center) => {
    let offset = index - center;
    offset = ((offset % count) + count) % count;
    if (offset > count / 2) offset -= count;
    return offset;
  };

  function updateCaption(index) {
    const card = cards[index];
    const subtitle = card.querySelector(".identity-copy p")?.textContent?.trim() || card.dataset.projectCategory || "";
    const galleryCount = card.querySelectorAll(".gallery-source img").length || 1;
    const projectNo = card.querySelector(".card-number")?.textContent?.trim() || String(index + 1).padStart(2, "0");
    caption.querySelector("h3").textContent = card.dataset.projectTitle || card.querySelector("h3")?.textContent || "";
    caption.querySelector(".cf-exact-subtitle").textContent = subtitle;
    caption.querySelector('[data-meta="type"]').textContent = subtitle;
    caption.querySelector('[data-meta="gallery"]').textContent = `${galleryCount} slides`;
    caption.querySelector('[data-meta="project"]').textContent = projectNo;
  }

  function measure() {
    width = cards[0].offsetWidth || parseFloat(getComputedStyle(cards[0]).width) || 260;
    paint();
  }

  function paint() {
    if (!width) return;
    const pitch = width * (1 + gap);

    cards.forEach((card, index) => {
      const offset = foldedOffset(index, pos);
      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
      const edge = Math.min(1, Math.max(0, count / 2 - distance));

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
      card.style.pointerEvents = distance < 0.5 ? "auto" : "none";
    });

    const active = indexAt(pos);
    track.dataset.activeIndex = String(active);
    updateCaption(active);
  }

  function settle(nextTarget) {
    if (raf !== null) cancelAnimationFrame(raf);
    target = nextTarget;
    const step = () => {
      const remaining = target - pos;
      if (reduce || Math.abs(remaining) < 0.0004) {
        pos = target;
        paint();
        raf = null;
        return;
      }
      pos += remaining * 0.16;
      paint();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  function goTo(index) {
    const next = index + Math.round((target - index) / count) * count;
    settle(next);
  }

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    target = pos;
    moved = false;
    drag = { id:event.pointerId, x:event.clientX, pos, v:0, t:performance.now(), captured:false };
    track.classList.add("is-dragging");
  });

  track.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const pitch = width * (1 + gap);
    if (!pitch) return;
    const dx = event.clientX - drag.x;
    if (!moved && Math.abs(dx) > 8) {
      moved = true;
      try { track.setPointerCapture(event.pointerId); drag.captured = true; } catch {}
    }
    if (!moved) return;
    const now = performance.now();
    const previous = pos;
    pos = drag.pos - dx / pitch;
    drag.v = ((pos - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;
    paint();
  });

  const endDrag = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const didMove = moved;
    const velocity = drag.v;
    if (drag.captured) {
      try { track.releasePointerCapture(event.pointerId); } catch {}
    }
    drag = null;
    track.classList.remove("is-dragging");
    if (didMove) {
      track.dataset.dragged = "true";
      const carried = Math.max(-2, Math.min(2, velocity * 0.18));
      settle(Math.round(pos + carried));
      setTimeout(() => { track.dataset.dragged = "false"; }, 90);
    }
  };

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("dragstart", (event) => event.preventDefault());

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      settle(Math.round(target) - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      settle(Math.round(target) + 1);
    }
  });

  track.addEventListener("click", (event) => {
    if (track.dataset.dragged === "true") return;
    const card = event.target.closest(".identity-card");
    if (!card || card.parentElement !== track) return;
    const index = cards.indexOf(card);
    if (index !== indexAt(pos)) {
      event.preventDefault();
      return goTo(index);
    }
    const images = Array.from(card.querySelectorAll(".gallery-source img")).map((image) => ({
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt")
    }));
    if (typeof window.openImageModal === "function") {
      window.openImageModal(images, card.dataset.projectTitle || "Visual identity", card.dataset.projectCategory, card.dataset.projectDescription || "");
    }
  });

  track.setAttribute("tabindex", "0");
  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(track);
  requestAnimationFrame(measure);
})();