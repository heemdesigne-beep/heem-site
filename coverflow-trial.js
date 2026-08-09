(() => {
  const track = document.getElementById("identity-track");
  if (!track) return;

  const cards = () => Array.from(track.children).filter((el) => el.matches(".identity-card"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  track.classList.add("heem-coverflow");

  const style = document.createElement("style");
  style.textContent = `
    #identity .slider-shell{overflow:hidden!important;background:transparent!important;box-shadow:none!important}
    #identity-track.heem-coverflow{perspective:1450px;transform-style:preserve-3d;touch-action:pan-y;overflow:visible!important;isolation:isolate}
    #identity-track.heem-coverflow::before,#identity-track.heem-coverflow::after{display:none!important;content:none!important}
    #identity-track.heem-coverflow .identity-card{transform-origin:center center;backface-visibility:hidden;will-change:transform,opacity;filter:none!important;box-shadow:none!important;transition:${reduce ? "none" : "transform .58s cubic-bezier(.22,.72,.2,1),opacity .38s ease"}!important}
    #identity-track.heem-coverflow .identity-card.deck-active{filter:none!important;box-shadow:none!important;outline:1px solid rgba(105,174,255,.38);outline-offset:0}
    #identity-track.heem-coverflow .identity-card:not(.deck-active){filter:none!important;box-shadow:none!important}
    @media(max-width:760px){#identity-track.heem-coverflow{perspective:1050px}}
  `;
  document.head.appendChild(style);

  function paint() {
    const list = cards();
    if (!list.length) return;
    const active = Number(track.dataset.activeIndex || 0);
    const activeCard = list[active];
    const width = activeCard?.getBoundingClientRect().width || Math.min(innerWidth * .58, 420);
    const mobile = innerWidth < 760;
    const pitch = mobile ? width * .62 : width * .78;

    list.forEach((card, index) => {
      let offset = index - active;
      if (offset > list.length / 2) offset -= list.length;
      if (offset < -list.length / 2) offset += list.length;
      const distance = Math.abs(offset);
      const visible = distance <= (mobile ? 1 : 2);
      const side = Math.sign(offset);
      const x = offset * pitch;
      const z = distance === 0 ? 0 : -Math.min(155 + (distance - 1) * 95, 280);
      const rotate = distance === 0 ? 0 : -side * Math.min(34 + (distance - 1) * 8, 44);
      const scale = distance === 0 ? 1 : Math.max(.82, 1 - distance * .07);

      card.style.transform = `translate3d(calc(-50% + ${x}px),0,${z}px) rotateY(${rotate}deg) scale(${scale})`;
      card.style.opacity = visible ? String(distance === 0 ? 1 : Math.max(.52, 1 - distance * .2)) : "0";
      card.style.zIndex = String(100 - distance * 10);
      card.style.pointerEvents = visible ? "auto" : "none";
      card.classList.toggle("deck-active", index === active);
    });
  }

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.attributeName === "data-active-index")) requestAnimationFrame(paint);
  });
  observer.observe(track, { attributes: true, attributeFilter: ["data-active-index"] });

  track.addEventListener("click", () => requestAnimationFrame(paint));
  track.addEventListener("pointerup", () => requestAnimationFrame(paint));
  window.addEventListener("resize", () => requestAnimationFrame(paint), { passive: true });

  const boot = () => {
    if (!track.classList.contains("deck-track")) return requestAnimationFrame(boot);
    paint();
  };
  requestAnimationFrame(boot);
})();