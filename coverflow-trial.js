(() => {
  const track = document.getElementById("identity-track");
  if (!track) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = Array.from(track.children).filter((el) => el.matches(".identity-card"));
  if (!cards.length) return;

  const rotate = 44;
  const depth = 0.6;
  const perspective = 3;
  const falloff = 0.56;
  const fade = 0.1;
  const gap = 0.05;
  const count = cards.length;

  let pos = Number(track.dataset.activeIndex || 0);
  let target = pos;
  let raf = null;
  let width = 0;
  let drag = null;
  let dragged = false;

  track.classList.add("heem-coverflow-exact");

  const style = document.createElement("style");
  style.textContent = `
    #identity .slider-shell{overflow:hidden!important;background:transparent!important;box-shadow:none!important}
    #identity-track.heem-coverflow-exact{position:relative!important;overflow:hidden!important;touch-action:pan-y;outline:none!important;box-shadow:none!important;filter:none!important;perspective:calc(var(--cf-card,420px) * ${perspective});transform-style:preserve-3d}
    #identity-track.heem-coverflow-exact::before,#identity-track.heem-coverflow-exact::after{display:none!important;content:none!important}
    #identity-track.heem-coverflow-exact .identity-card{position:absolute!important;left:50%!important;top:50%!important;margin:0!important;transform-origin:center center!important;backface-visibility:hidden!important;box-shadow:none!important;filter:none!important;will-change:transform,opacity!important;transition:none!important}
    #identity-track.heem-coverflow-exact .identity-card.deck-active{box-shadow:none!important;filter:none!important;outline:none!important}
    #identity-track.heem-coverflow-exact .identity-card:not(.deck-active){box-shadow:none!important;filter:none!important}
    #identity-track.heem-coverflow-exact.is-dragging{cursor:grabbing!important}
    #identity-track.heem-coverflow-exact{cursor:grab!important}
    #identity .slider-progress{display:none!important}
  `;
  document.head.appendChild(style);

  const indexAt = (value) => ((Math.round(value) % count) + count) % count;

  function shortestOffset(index, center) {
    let offset = index - center;
    offset = ((offset % count) + count) % count;
    if (offset > count / 2) offset -= count;
    return offset;
  }

  function measure() {
    const sample = cards[0];
    if (!sample) return;
    const rect = sample.getBoundingClientRect();
    width = rect.width || sample.offsetWidth || 320;
    track.style.setProperty("--cf-card", `${width}px`);
    const height = Math.max(...cards.map((card) => card.offsetHeight || card.getBoundingClientRect().height || width));
    track.style.height = `${height + 80}px`;
    paint();
  }

  function paint() {
    if (!width) return;
    const pitch = width * (1 + gap);
    const activeIndex = indexAt(pos);

    cards.forEach((card, index) => {
      const offset = shortestOffset(index, pos);
      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
      const edge = Math.min(1, Math.max(0, count / 2 - distance));
      const opacity = Math.max(0, 1 - fade * distance) * edge;

      card.style.transform = `translate3d(calc(-50% + ${offset * pitch}px),-50%,${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(100 - Math.round(distance));
      card.style.pointerEvents = opacity > 0.05 ? "auto" : "none";
      card.classList.toggle("deck-active", index === activeIndex);
      card.setAttribute("aria-hidden", index === activeIndex ? "false" : "true");
    });

    track.dataset.activeIndex = String(activeIndex);
  }

  function settle(nextTarget) {
    if (raf !== null) cancelAnimationFrame(raf);
    target = nextTarget;
    const step = () => {
      const remaining = target - pos;
      if (Math.abs(remaining) < 0.0004 || reduce) {
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
    dragged = false;
    target = pos;
    drag = { id:event.pointerId, x:event.clientX, pos, v:0, t:performance.now(), captured:false };
    track.classList.add("is-dragging");
  }, true);

  track.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    event.stopImmediatePropagation();
    const pitch = width * (1 + gap);
    if (!pitch) return;
    const dx = event.clientX - drag.x;
    if (!dragged && Math.abs(dx) > 8) {
      dragged = true;
      if (!drag.captured) {
        try { track.setPointerCapture(event.pointerId); drag.captured = true; } catch {}
      }
    }
    if (!dragged) return;
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
    const wasDragged = dragged;
    const velocity = drag.v;
    if (drag.captured) {
      try { track.releasePointerCapture(event.pointerId); } catch {}
    }
    drag = null;
    track.classList.remove("is-dragging");
    track.dataset.dragged = wasDragged ? "true" : "false";
    if (wasDragged) {
      const carried = Math.max(-2, Math.min(2, velocity * 0.18));
      settle(Math.round(pos + carried));
    }
    setTimeout(() => { track.dataset.dragged = "false"; }, 80);
  };

  track.addEventListener("pointerup", endDrag, true);
  track.addEventListener("pointercancel", endDrag, true);
  track.addEventListener("dragstart", (event) => event.preventDefault(), true);

  track.addEventListener("click", (event) => {
    const card = event.target.closest(".identity-card");
    if (!card || card.parentElement !== track) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (track.dataset.dragged === "true") return;
    const index = cards.indexOf(card);
    if (index === indexAt(pos)) {
      if (typeof window.openDeckPreview === "function") window.openDeckPreview(card);
      else card.dispatchEvent(new MouseEvent("click", { bubbles:true }));
      return;
    }
    goTo(index);
  }, true);

  track.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    nudge(event.key === "ArrowRight" ? 1 : -1);
  }, true);

  const controls = document.querySelector(`.slider-controls[data-controls="${track.id}"]`);
  controls?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-direction]");
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    nudge(button.dataset.direction === "next" ? 1 : -1);
  }, true);

  const observer = new ResizeObserver(measure);
  observer.observe(track);
  window.addEventListener("resize", measure, { passive:true });

  track.setAttribute("tabindex", "0");
  requestAnimationFrame(measure);
})();