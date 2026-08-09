(() => {
  const load = (src, onload) => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    if (onload) script.addEventListener("load", onload, { once: true });
    script.addEventListener("error", () => console.error(`HEEM script failed to load: ${src}`));
    document.head.appendChild(script);
  };

  load("script-core.js", () => {
    load("coverflow-trial.js");
    load("feedback-wall.js");
  });
})();