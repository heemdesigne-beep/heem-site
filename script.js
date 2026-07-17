const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const progress = document.querySelector(".scroll-progress");
const header = document.querySelector(".site-header");

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  if (progress) progress.style.width = `${Math.min(ratio * 100, 100)}%`;
  if (header) header.classList.toggle("scrolled", window.scrollY > 60);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

const glow = document.querySelector(".cursor-glow");
if (glow && window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
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

document.querySelectorAll(".slider-controls").forEach((controls) => {
  const track = document.getElementById(controls.dataset.controls);
  if (!track) return;

  controls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-direction]");
    if (!button) return;
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
    track.scrollLeft = startScroll - delta * 1.15;
  });

  function stopDragging(event) {
    if (!pointerDown) return;
    pointerDown = false;
    track.classList.remove("is-dragging");
    track.dataset.dragged = moved ? "true" : "false";
    if (event.pointerId !== undefined && track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
    window.setTimeout(() => { track.dataset.dragged = "false"; }, 50);
  }

  track.addEventListener("pointerup", stopDragging);
  track.addEventListener("pointercancel", stopDragging);
  track.addEventListener("dragstart", (event) => event.preventDefault());
});

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

const modal = document.getElementById("media-modal");
const modalImage = modal?.querySelector(".modal-stage img");
const modalIframe = modal?.querySelector(".modal-stage iframe");
const modalTitle = modal?.querySelector(".modal-title");
const modalCategory = modal?.querySelector(".modal-category");
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

function openImageModal(images, title, category = "Selected work") {
  if (!modal || !images.length) return;
  activeImages = images;
  activeIndex = 0;
  modal.classList.remove("video-mode");
  if (modalIframe) modalIframe.src = "";
  if (modalTitle) modalTitle.textContent = title;
  if (modalCategory) modalCategory.textContent = category;
  renderModalImage();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function openVideoModal(videoId, title) {
  if (!modal || !modalIframe || !videoId) return;
  activeImages = [];
  modal.classList.add("video-mode");
  if (modalImage) modalImage.src = "";
  if (modalTitle) modalTitle.textContent = title;
  if (modalCategory) modalCategory.textContent = "Video & Motion";
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
    openImageModal(images, card.dataset.projectTitle || "Visual identity", card.dataset.projectCategory);
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
    openVideoModal(card.dataset.youtubeId, card.dataset.videoTitle || "Video project");
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
