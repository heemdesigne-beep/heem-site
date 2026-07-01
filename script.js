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