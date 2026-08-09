(() => {
  const track = document.getElementById("identity-track");
  if (!track) return;

  const cards = () => Array.from(track.children).filter((el) => el.matches(".identity-card"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  track.classList.add("heem-coverflow");

  const style = document.createElement("style");
  style.textContent = `
    #identity-track.heem-coverflow{perspective:1100px;transform-style:preserve-3d;touch-action:pan-y;overflow:visible!important;isolation:isolate}
    #identity-track.heem-coverflow .identity-card{transform-origin:center center;backface-visibility:hidden;will-change:transform,opacity,filter;transition:${reduce ? "none" : "transform .62s cubic-bezier(.2,.78,.2,1),opacity .46s ease,filter .46s ease"}!important}
    #identity-track.heem-coverflow .identity-card.deck-active{filter:saturate(1.06) brightness(1.04);box-shadow:0 34px 90px rgba(2,12,34,.48),0 0 0 1px rgba(105,174,255,.22),0 0 55px rgba(40,120,255,.13)}
    #identity-track.heem-coverflow .identity-card:not(.deck-active){filter:saturate(.78) brightness(.72)}
    #identity-track.heem-coverflow::before{content:"";position:absolute;z-index:0;left:50%;top:50%;width:min(52vw,680px);height:72%;transform:translate(-50%,-50%);background:radial-gradient(ellipse,rgba(40,120,255,.2),transparent 68%);filter:blur(20px);pointer-events:none}
    @media(max-width:760px){#identity-track.heem-coverflow{perspective:850px}#identity-track.heem-coverflow .identity-card:not(.deck-active){filter:saturate(.86) brightness(.78)}}
  `;
  document.head.appendChild(style);

  function paint() {
    const list = cards();
    if (!list.length) return;
    const active = Number(track.dataset.activeIndex || 0);
    const width = list[active]?.getBoundingClientRect().width || Math.min(innerWidth * .58, 420);
    const pitch = Math.min(width * (innerWidth < 760 ? .58 : .72), innerWidth < 760 ? 185 : 300);

    list.forEach((card, index) => {
      let offset = index - active;
      if (offset > list.length / 2) offset -= list.length;
      if (offset < -list.length / 2) offset += list.length;
      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, .62);
      const visible = distance <= (innerWidth < 760 ? 1 : 2);
      const tilt = Math.min(27 * ramp, 68) * Math.sign(offset);
      const depth = -width * .40 * ramp;
      const x = offset * pitch;
      const y = Math.min(distance * 10, 22);
      const scale = Math.max(.76, 1 - distance * .055);

      card.style.transform = `translate3d(calc(-50% + ${x}px),${y}px,${depth}px) rotateY(${-tilt}deg) scale(${scale})`;
      card.style.opacity = visible ? String(Math.max(.18, 1 - distance * .18)) : "0";
      card.style.zIndex = String(100 - Math.round(distance * 10));
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