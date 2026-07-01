document.getElementById('year').textContent = new Date().getFullYear();
// Work category tabs
document.addEventListener("DOMContentLoaded", () => {
  const workTabs = document.querySelectorAll("[data-work-tab]");
  const workPanels = document.querySelectorAll("[data-work-panel]");

  workTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.workTab;

      workTabs.forEach((item) => item.classList.remove("is-active"));
      workPanels.forEach((panel) => panel.classList.remove("is-active"));

      tab.classList.add("is-active");

      const activePanel = document.querySelector(`[data-work-panel="${target}"]`);
      if (activePanel) {
        activePanel.classList.add("is-active");
      }
    });
  });
});
// Video project modal
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".video-modal")) return;

  const videoModal = document.createElement("div");
  videoModal.className = "video-modal";
  videoModal.innerHTML = `
    <button class="video-modal-close" type="button" aria-label="Close video">×</button>
    <div class="video-modal-frame">
    <iframe
  src=""
  title="Portfolio video player"
  referrerpolicy="strict-origin-when-cross-origin"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen>
</iframe>
    </div>
  `;

  document.body.appendChild(videoModal);

  const iframe = videoModal.querySelector("iframe");
  const closeButton = videoModal.querySelector(".video-modal-close");

  document.addEventListener("click", (event) => {
    const videoCard = event.target.closest("[data-video-src]");

    if (!videoCard) return;

    const videoSrc = videoCard.dataset.videoSrc;

    if (!videoSrc) return;

    iframe.src = videoSrc;
    videoModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  });

  function closeVideoModal() {
    videoModal.classList.remove("is-open");
    iframe.src = "";
    document.body.style.overflow = "";
  }

  closeButton.addEventListener("click", closeVideoModal);

  videoModal.addEventListener("click", (event) => {
    if (event.target === videoModal) {
      closeVideoModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && videoModal.classList.contains("is-open")) {
      closeVideoModal();
    }
  });
});