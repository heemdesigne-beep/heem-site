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
// Branding cards project gallery
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".branding-gallery-modal")) return;

  const galleryModal = document.createElement("div");
  galleryModal.className = "branding-gallery-modal";
  galleryModal.innerHTML = `
    <div class="branding-gallery-box">
      <div class="branding-gallery-head">
        <div>
          <h4 class="branding-gallery-title">Project Gallery</h4>
          <span class="branding-gallery-count">1 / 1</span>
        </div>
        <button class="branding-gallery-close" type="button" aria-label="Close gallery">×</button>
      </div>

      <div class="branding-gallery-stage">
        <button class="branding-gallery-prev" type="button" aria-label="Previous image">‹</button>
        <img src="" alt="Project image">
        <button class="branding-gallery-next" type="button" aria-label="Next image">›</button>
      </div>
    </div>
  `;

  document.body.appendChild(galleryModal);

  const galleryImage = galleryModal.querySelector(".branding-gallery-stage img");
  const galleryTitle = galleryModal.querySelector(".branding-gallery-title");
  const galleryCount = galleryModal.querySelector(".branding-gallery-count");
  const closeButton = galleryModal.querySelector(".branding-gallery-close");
  const prevButton = galleryModal.querySelector(".branding-gallery-prev");
  const nextButton = galleryModal.querySelector(".branding-gallery-next");

  let galleryImages = [];
  let currentImageIndex = 0;

  function renderGalleryImage() {
    const currentImage = galleryImages[currentImageIndex];

    if (!currentImage) return;

    galleryImage.src = currentImage.src;
    galleryImage.alt = currentImage.alt || "Project image";
    galleryCount.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;

    prevButton.style.display = galleryImages.length > 1 ? "" : "none";
    nextButton.style.display = galleryImages.length > 1 ? "" : "none";
  }

  function openProjectGallery(projectCard) {
    const projectTitle = projectCard.querySelector("h3")?.textContent || "Project Gallery";

    const images = Array.from(projectCard.querySelectorAll("img"))
      .map((image) => ({
        src: image.getAttribute("src"),
        alt: image.getAttribute("alt") || projectTitle,
      }))
      .filter((image) => image.src);

    const uniqueImages = [];
    const usedSources = new Set();

    images.forEach((image) => {
      if (!usedSources.has(image.src)) {
        usedSources.add(image.src);
        uniqueImages.push(image);
      }
    });

    if (!uniqueImages.length) return;

    galleryImages = uniqueImages;
    currentImageIndex = 0;
    galleryTitle.textContent = projectTitle;

    renderGalleryImage();

    galleryModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeProjectGallery() {
    galleryModal.classList.remove("is-open");
    galleryImage.src = "";
    document.body.style.overflow = "";
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    renderGalleryImage();
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    renderGalleryImage();
  }

  document.addEventListener(
    "click",
    (event) => {
      const projectCard = event.target.closest(
        '.work-panel[data-work-panel="branding"] .project-showcase'
      );

      if (!projectCard) return;

      event.preventDefault();
      event.stopPropagation();

      openProjectGallery(projectCard);
    },
    true
  );

  closeButton.addEventListener("click", closeProjectGallery);
  nextButton.addEventListener("click", showNextImage);
  prevButton.addEventListener("click", showPrevImage);

  galleryModal.addEventListener("click", (event) => {
    if (event.target === galleryModal) {
      closeProjectGallery();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!galleryModal.classList.contains("is-open")) return;

    if (event.key === "Escape") closeProjectGallery();
    if (event.key === "ArrowRight") showNextImage();
    if (event.key === "ArrowLeft") showPrevImage();
  });
});
// Simple branding project gallery - reliable version
(function () {
  const brandingCards = document.querySelectorAll(
    '.work-panel[data-work-panel="branding"] .project-showcase'
  );

  if (!brandingCards.length) return;

  let modal = document.getElementById("brandingSimpleGallery");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "brandingSimpleGallery";
    modal.innerHTML = `
      <div class="branding-simple-box">
        <button class="branding-simple-close" type="button">×</button>
        <h3 class="branding-simple-title">Project Gallery</h3>
        <img class="branding-simple-img" src="" alt="">
        <div class="branding-simple-controls">
          <button class="branding-simple-prev" type="button">Prev</button>
          <span class="branding-simple-count">1 / 1</span>
          <button class="branding-simple-next" type="button">Next</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const title = modal.querySelector(".branding-simple-title");
  const img = modal.querySelector(".branding-simple-img");
  const count = modal.querySelector(".branding-simple-count");
  const closeBtn = modal.querySelector(".branding-simple-close");
  const prevBtn = modal.querySelector(".branding-simple-prev");
  const nextBtn = modal.querySelector(".branding-simple-next");

  let images = [];
  let index = 0;

  function showImage() {
    img.src = images[index].src;
    img.alt = images[index].alt;
    count.textContent = `${index + 1} / ${images.length}`;
  }

  function openGallery(card) {
    const projectTitle = card.querySelector("h3")?.textContent || "Project Gallery";

    images = Array.from(card.querySelectorAll("img")).map((image) => ({
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt") || projectTitle,
    }));

    if (!images.length) return;

    title.textContent = projectTitle;
    index = 0;
    showImage();

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeGallery() {
    modal.classList.remove("open");
    img.src = "";
    document.body.style.overflow = "";
  }

  brandingCards.forEach((card) => {
    card.addEventListener("click", function () {
      openGallery(card);
    });
  });

  nextBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    index = (index + 1) % images.length;
    showImage();
  });

  prevBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    index = (index - 1 + images.length) % images.length;
    showImage();
  });

  closeBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    closeGallery();
  });

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeGallery();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (!modal.classList.contains("open")) return;

    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowRight") {
      index = (index + 1) % images.length;
      showImage();
    }
    if (event.key === "ArrowLeft") {
      index = (index - 1 + images.length) % images.length;
      showImage();
    }
  });
})();