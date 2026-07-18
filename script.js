const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const progress = document.querySelector(".scroll-progress");
const header = document.querySelector(".site-header");
const scrollRail = document.querySelector(".scroll-rail");
let scrollTicking = false;

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  if (progress) progress.style.width = `${Math.min(ratio * 100, 100)}%`;
  if (scrollRail) scrollRail.style.setProperty("--rail-progress", `${Math.min(ratio * 100, 100)}%`);
  if (header) header.classList.toggle("scrolled", window.scrollY > 60);
  document.documentElement.style.setProperty("--page-scroll", `${window.scrollY}px`);
  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(updateScrollUI);
}, { passive: true });
updateScrollUI();

const railLinks = document.querySelectorAll(".scroll-rail a");
if (railLinks.length && "IntersectionObserver" in window) {
  const railObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    railLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
  }, { rootMargin: "-28% 0px -58%", threshold: [0, .05, .25] });

  document.querySelectorAll("#home,#about,#identity,#services,#contact").forEach((section) => railObserver.observe(section));
}

const glow = document.querySelector(".cursor-glow");
if (glow && window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });

  document.querySelectorAll(".identity-card,.social-card,.print-card,.video-card,.feedback-card").forEach((item) => {
    item.addEventListener("pointerenter", () => glow.classList.add("is-viewing"));
    item.addEventListener("pointerleave", () => glow.classList.remove("is-viewing"));
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("revealed"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: "0px 0px -7%" });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min((index % 4) * 55, 165)}ms`;
    revealObserver.observe(item);
  });
}

const statRow = document.querySelector(".stat-row");
if (statRow && !reducedMotion && "IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;

    statRow.querySelectorAll("[data-count]").forEach((item) => {
      const target = Number(item.dataset.count || 0);
      const start = performance.now();
      const duration = 900;

      function tick(now) {
        const elapsed = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        item.textContent = Math.round(target * eased);
        if (elapsed < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });

    observer.disconnect();
  }, { threshold: .45 });

  countObserver.observe(statRow);
}

function deckCards(track) {
  return Array.from(track?.children || []).filter((item) => item.matches(".identity-card,.social-card,.video-card,.print-card"));
}

function renderDeck(track) {
  const cards = deckCards(track);
  if (!cards.length) return;
  const active = Number(track.dataset.activeIndex || 0);
  const step = Math.min(window.innerWidth * .105, 155);

  cards.forEach((card, index) => {
    let offset = index - active;
    if (offset > cards.length / 2) offset -= cards.length;
    if (offset < -cards.length / 2) offset += cards.length;
    const distance = Math.abs(offset);
    const visible = distance <= 2;
    const scale = Math.max(.72, 1 - distance * .105);
    const x = offset * step;
    const y = distance * 16;
    const rotate = offset * -6;

    card.style.transform = `translate3d(calc(-50% + ${x}px), ${y}px, ${distance * -85}px) rotateY(${rotate}deg) scale(${scale})`;
    card.style.zIndex = String(20 - distance);
    card.style.opacity = visible ? String(1 - distance * .2) : "0";
    card.style.pointerEvents = visible ? "auto" : "none";
    card.classList.toggle("deck-active", index === active);
    card.setAttribute("aria-hidden", index === active ? "false" : "true");
  });

  const meter = track.closest(".slider-shell")?.querySelector(".slider-progress");
  meter?.style.setProperty("--slider-progress", `${((active + 1) / cards.length) * 100}%`);
}

function moveDeck(track, direction) {
  const cards = deckCards(track);
  if (!cards.length) return;
  const active = Number(track.dataset.activeIndex || 0);
  track.dataset.activeIndex = String((active + direction + cards.length) % cards.length);
  renderDeck(track);
}

function activateDeckCard(track, index) {
  track.dataset.activeIndex = String(index);
  renderDeck(track);
}

document.querySelectorAll(".slider-controls").forEach((controls) => {
  const track = document.getElementById(controls.dataset.controls);
  if (!track) return;

  controls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-direction]");
    if (!button) return;
    if (track.classList.contains("deck-track")) {
      moveDeck(track, button.dataset.direction === "next" ? 1 : -1);
      return;
    }
    const card = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth * .8;
    track.scrollBy({ left: button.dataset.direction === "next" ? distance : -distance, behavior: reducedMotion ? "auto" : "smooth" });
  });
});

document.querySelectorAll(".drag-track").forEach((track) => {
  let pointerDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerDown = true;
    moved = false;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!pointerDown) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 7) moved = true;
    if (track.classList.contains("deck-track")) return;
    track.scrollLeft = startScroll - delta * 1.15;
  });

  function stopDragging(event) {
    if (!pointerDown) return;
    pointerDown = false;
    track.classList.remove("is-dragging");
    track.dataset.dragged = moved ? "true" : "false";
    if (moved && track.classList.contains("deck-track") && event.type === "pointerup") {
      moveDeck(track, event.clientX < startX ? 1 : -1);
    }
    if (event.pointerId !== undefined && track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
    window.setTimeout(() => { track.dataset.dragged = "false"; }, 50);
  }

  track.addEventListener("pointerup", stopDragging);
  track.addEventListener("pointercancel", stopDragging);
  track.addEventListener("dragstart", (event) => event.preventDefault());

  const shell = track.closest(".slider-shell");
  const meter = document.createElement("div");
  meter.className = "slider-progress";
  meter.setAttribute("aria-hidden", "true");
  meter.innerHTML = "<i></i>";
  shell?.appendChild(meter);

  function updateSliderProgress() {
    const max = track.scrollWidth - track.clientWidth;
    const ratio = max > 0 ? track.scrollLeft / max : 1;
    meter.style.setProperty("--slider-progress", `${Math.max(12, Math.min(100, ratio * 88 + 12))}%`);
  }

  track.addEventListener("scroll", updateSliderProgress, { passive: true });
  track.setAttribute("tabindex", "0");
  track.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    if (track.classList.contains("deck-track")) {
      moveDeck(track, direction);
      return;
    }
    track.scrollBy({ left: direction * track.clientWidth * .65, behavior: reducedMotion ? "auto" : "smooth" });
  });
  requestAnimationFrame(updateSliderProgress);
});

document.querySelectorAll("#identity-track,#social-track,#video-track,#print-track").forEach((track) => {
  track.classList.add("deck-track");
  track.dataset.activeIndex = "0";
  track.addEventListener("click", (event) => {
    if (track.dataset.dragged === "true") return;
    const card = event.target.closest(".identity-card,.social-card,.video-card,.print-card");
    if (!card || card.parentElement !== track) return;
    const cards = deckCards(track);
    const index = cards.indexOf(card);
    if (index === Number(track.dataset.activeIndex || 0)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    activateDeckCard(track, index);
  }, true);
  requestAnimationFrame(() => renderDeck(track));
});

window.addEventListener("resize", () => {
  document.querySelectorAll(".deck-track").forEach(renderDeck);
}, { passive: true });

const portraitWrap = document.querySelector(".hero-portrait-wrap");
const portrait = document.querySelector(".hero-portrait");
if (portraitWrap && portrait && window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
  portraitWrap.addEventListener("pointermove", (event) => {
    const box = portraitWrap.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    portrait.style.transform = `translate(${x * 10}px, ${y * 7}px) rotateY(${x * 3}deg)`;
  });
  portraitWrap.addEventListener("pointerleave", () => { portrait.style.transform = ""; });
}

const cinematicScene = document.querySelector(".hero-cinematic-scene");
if (cinematicScene && window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
  cinematicScene.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - .5) * -16;
    const y = (event.clientY / window.innerHeight - .5) * -10;
    cinematicScene.style.setProperty("--hero-x", x.toFixed(2));
    cinematicScene.style.setProperty("--hero-y", y.toFixed(2));
  });
  cinematicScene.addEventListener("pointerleave", () => {
    cinematicScene.style.setProperty("--hero-x", "0");
    cinematicScene.style.setProperty("--hero-y", "0");
  });
}

if (window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
  document.querySelectorAll(".header-cta,.button,.text-link,.contact-content > a,.slider-controls button").forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const box = item.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      item.style.transform = `translate(${x * .12}px, ${y * .18}px)`;
    });
    item.addEventListener("pointerleave", () => { item.style.transform = ""; });
  });

  document.querySelectorAll(".identity-card,.social-card,.print-card,.video-card,.service-list article,.feedback-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (card.closest(".is-dragging")) return;
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      card.style.transform = `perspective(900px) rotateX(${-y * 3.2}deg) rotateY(${x * 4.5}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

const modal = document.getElementById("media-modal");
const modalImage = modal?.querySelector(".modal-stage img");
const modalIframe = modal?.querySelector(".modal-stage iframe");
const modalTitle = modal?.querySelector(".modal-title");
const modalCategory = modal?.querySelector(".modal-category");
const modalDescription = modal?.querySelector(".modal-description");
const modalCount = modal?.querySelector(".modal-count");
const modalNav = modal?.querySelector(".modal-nav");
let activeImages = [];
let activeIndex = 0;

function renderModalImage() {
  if (!modalImage || !activeImages.length) return;
  const current = activeImages[activeIndex];
  modalImage.src = current.src;
  modalImage.alt = current.alt || "Portfolio project";
  if (modalCount) modalCount.textContent = `${activeIndex + 1} / ${activeImages.length}`;
  if (modalNav) modalNav.hidden = activeImages.length < 2;
}

function openImageModal(images, title, category = "Selected work", description = "") {
  if (!modal || !images.length) return;
  activeImages = images;
  activeIndex = 0;
  modal.classList.remove("video-mode");
  if (modalIframe) modalIframe.src = "";
  if (modalTitle) modalTitle.textContent = title;
  if (modalCategory) modalCategory.textContent = category;
  if (modalDescription) modalDescription.textContent = description;
  renderModalImage();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function openVideoModal(videoId, title, description = "") {
  if (!modal || !modalIframe || !videoId) return;
  activeImages = [];
  modal.classList.add("video-mode");
  if (modalImage) modalImage.src = "";
  if (modalTitle) modalTitle.textContent = title;
  if (modalCategory) modalCategory.textContent = "Video & Motion";
  if (modalDescription) modalDescription.textContent = description;
  if (modalNav) modalNav.hidden = true;
  const origin = location.protocol.startsWith("http") ? `&origin=${encodeURIComponent(location.origin)}` : "";
  modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1${origin}`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open", "video-mode");
  modal.setAttribute("aria-hidden", "true");
  if (modalIframe) modalIframe.src = "";
  if (modalImage) modalImage.src = "";
  document.body.classList.remove("modal-open");
}

function changeModalImage(direction) {
  if (activeImages.length < 2) return;
  activeIndex = (activeIndex + direction + activeImages.length) % activeImages.length;
  renderModalImage();
}

document.querySelectorAll(".identity-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (card.closest(".drag-track")?.dataset.dragged === "true") return;
    const images = Array.from(card.querySelectorAll(".gallery-source img")).map((image) => ({ src: image.getAttribute("src"), alt: image.getAttribute("alt") }));
    openImageModal(images, card.dataset.projectTitle || "Visual identity", card.dataset.projectCategory, card.dataset.projectDescription || "");
  });
});

document.querySelectorAll(".social-card, .print-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (card.closest(".drag-track")?.dataset.dragged === "true") return;
    const image = card.querySelector("img");
    if (!image) return;
    openImageModal([{ src: image.getAttribute("src"), alt: image.getAttribute("alt") }], card.querySelector("span")?.textContent || "Selected work");
  });
});

document.querySelectorAll(".video-card[data-youtube-id]").forEach((card) => {
  card.addEventListener("click", () => {
    if (card.closest(".drag-track")?.dataset.dragged === "true") return;
    openVideoModal(card.dataset.youtubeId, card.dataset.videoTitle || "Video project", card.dataset.videoDescription || "");
  });
});

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    openImageModal([{ src: button.dataset.lightbox, alt: image?.alt || "Client feedback" }], "Client feedback", "Real WhatsApp message");
  });
});

modal?.querySelector(".modal-close")?.addEventListener("click", closeModal);
modal?.querySelector("[data-modal-next]")?.addEventListener("click", () => changeModalImage(1));
modal?.querySelector("[data-modal-prev]")?.addEventListener("click", () => changeModalImage(-1));
modal?.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });

document.addEventListener("keydown", (event) => {
  if (!modal?.classList.contains("open")) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowRight") changeModalImage(1);
  if (event.key === "ArrowLeft") changeModalImage(-1);
});
