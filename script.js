(() => {
  const core = document.createElement("script");
  core.src = "script-core.js";
  core.defer = true;

  core.addEventListener("load", () => {
    const section = document.querySelector("#feedback");
    if (!section || section.querySelector(".visitor-feedback")) return;

    const style = document.createElement("style");
    style.textContent = `
      .visitor-feedback{margin-top:22px;display:grid;grid-template-columns:minmax(0,.86fr) minmax(0,1.14fr);gap:18px;align-items:stretch}
      .visitor-feedback *{box-sizing:border-box}
      .feedback-form-panel,.feedback-wall{position:relative;overflow:hidden;border:1px solid rgba(145,190,255,.2);border-radius:22px;background:linear-gradient(145deg,rgba(18,58,119,.6),rgba(6,24,58,.78));backdrop-filter:blur(16px);box-shadow:0 24px 70px rgba(2,13,34,.28)}
      .feedback-form-panel{padding:clamp(24px,3vw,40px)}
      .feedback-form-panel:before,.feedback-wall:before{content:"";position:absolute;width:240px;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(40,120,255,.23),transparent 68%);pointer-events:none}
      .feedback-form-panel:before{right:-90px;top:-100px}.feedback-wall:before{left:-100px;bottom:-120px}
      .feedback-form-kicker{margin:0 0 12px;color:#69aeff;font-size:.66rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
      .feedback-form-panel h3,.feedback-wall-head h3{margin:0;color:#fff;letter-spacing:-.045em;line-height:1.02}
      .feedback-form-panel h3{max-width:520px;font-size:clamp(2.2rem,4vw,4.8rem)}
      .feedback-form-intro{max-width:560px;margin:16px 0 28px;color:#aabbd5;font-size:.86rem;line-height:1.8}
      .feedback-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .feedback-field{display:flex;flex-direction:column;gap:8px}
      .feedback-field.full{grid-column:1/-1}
      .feedback-field label,.rating-label{color:#9eb2d0;font-size:.64rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
      .feedback-field input,.feedback-field textarea{width:100%;border:1px solid rgba(167,200,255,.16);border-radius:12px;outline:0;background:rgba(5,18,45,.62);color:#fff;font:inherit;transition:border-color .25s ease,box-shadow .25s ease,background .25s ease}
      .feedback-field input{height:52px;padding:0 15px}.feedback-field textarea{min-height:132px;padding:14px 15px;resize:vertical;line-height:1.65}
      .feedback-field input:focus,.feedback-field textarea:focus{border-color:rgba(105,174,255,.72);background:rgba(8,28,64,.78);box-shadow:0 0 0 4px rgba(40,120,255,.09)}
      .feedback-field input::placeholder,.feedback-field textarea::placeholder{color:#657998}
      .feedback-rating{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:15px;padding:12px 14px;border:1px solid rgba(167,200,255,.13);border-radius:12px;background:rgba(5,18,45,.42)}
      .feedback-stars{display:flex;gap:5px}.feedback-stars button{width:34px;height:34px;padding:0;border:0;background:transparent;color:#506786;font-size:1.35rem;cursor:pointer;transition:transform .2s ease,color .2s ease,text-shadow .2s ease}.feedback-stars button.active{color:#78b8ff;text-shadow:0 0 18px rgba(105,174,255,.45)}.feedback-stars button:hover{transform:translateY(-2px)}
      .feedback-submit{width:100%;min-height:54px;margin-top:14px;padding:0 18px;display:flex;align-items:center;justify-content:space-between;border:1px solid rgba(134,192,255,.45);border-radius:12px;background:linear-gradient(120deg,#2878ff,#1358cc);color:#fff;font-weight:800;cursor:pointer;box-shadow:0 14px 34px rgba(19,88,204,.24);transition:transform .25s ease,box-shadow .25s ease}.feedback-submit:hover{transform:translateY(-2px);box-shadow:0 18px 42px rgba(19,88,204,.34)}.feedback-submit:disabled{opacity:.65;cursor:wait;transform:none}
      .feedback-status{min-height:20px;margin:11px 2px 0;color:#86c2ff;font-size:.72rem;line-height:1.5}.feedback-status.error{color:#ff9f9f}
      .feedback-wall{padding:clamp(22px,2.6vw,34px);min-height:100%}
      .feedback-wall-head{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid rgba(167,200,255,.13)}
      .feedback-wall-head h3{font-size:clamp(1.75rem,2.7vw,3.1rem)}
      .feedback-wall-count{color:#69aeff;font-size:.65rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
      .feedback-list{position:relative;z-index:1;display:grid;gap:11px;max-height:600px;overflow:auto;padding-right:5px;scrollbar-width:thin;scrollbar-color:#2878ff transparent}
      .visitor-feedback-card{padding:18px;border:1px solid rgba(167,200,255,.13);border-radius:15px;background:linear-gradient(135deg,rgba(14,47,100,.64),rgba(5,21,51,.68));animation:feedbackIn .45s cubic-bezier(.2,.8,.2,1) both}
      @keyframes feedbackIn{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}
      .visitor-feedback-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.visitor-feedback-person{display:flex;align-items:center;gap:11px;min-width:0}.visitor-feedback-avatar{flex:0 0 auto;width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(105,174,255,.34);border-radius:50%;background:rgba(40,120,255,.13);color:#cce5ff;font-size:.78rem;font-weight:800}.visitor-feedback-name{display:block;overflow:hidden;color:#fff;font-size:.8rem;font-weight:800;text-overflow:ellipsis;white-space:nowrap}.visitor-feedback-role{display:block;margin-top:2px;overflow:hidden;color:#7f96b9;font-size:.62rem;text-overflow:ellipsis;white-space:nowrap}.visitor-feedback-stars{flex:0 0 auto;color:#69aeff;font-size:.72rem;letter-spacing:.08em}.visitor-feedback-card p{margin:15px 0 0;color:#c4d2e7;font-size:.79rem;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere}.visitor-feedback-date{display:block;margin-top:13px;color:#617899;font-size:.57rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
      .feedback-empty{padding:42px 18px;text-align:center;border:1px dashed rgba(167,200,255,.16);border-radius:15px;color:#7f96b9;font-size:.76rem;line-height:1.7}
      @media(max-width:900px){.visitor-feedback{grid-template-columns:1fr}.feedback-list{max-height:none}}
      @media(max-width:560px){.feedback-fields{grid-template-columns:1fr}.feedback-field.full,.feedback-rating{grid-column:auto}.feedback-rating{align-items:flex-start;flex-direction:column}.feedback-form-panel,.feedback-wall{border-radius:18px}.visitor-feedback-top{align-items:flex-start;flex-direction:column}.visitor-feedback-stars{padding-left:49px}}
      @media(prefers-reduced-motion:reduce){.visitor-feedback-card{animation:none}.feedback-submit,.feedback-stars button{transition:none}}
    `;
    document.head.appendChild(style);

    const wrap = document.createElement("div");
    wrap.className = "visitor-feedback";
    wrap.setAttribute("data-reveal", "");
    wrap.innerHTML = `
      <div class="feedback-form-panel">
        <p class="feedback-form-kicker">SHARE YOUR EXPERIENCE</p>
        <h3>Worked with Heem?</h3>
        <p class="feedback-form-intro">Leave a quick note about your experience. Your feedback will appear here instantly after you submit it.</p>
        <form id="heem-feedback-form" novalidate>
          <div class="feedback-fields">
            <div class="feedback-field"><label for="feedback-name">Your name</label><input id="feedback-name" name="name" maxlength="40" autocomplete="name" placeholder="Name" required></div>
            <div class="feedback-field"><label for="feedback-role">Title / company <span aria-hidden="true">·</span> optional</label><input id="feedback-role" name="role" maxlength="55" placeholder="Creative Director, Brand..." autocomplete="organization-title"></div>
            <div class="feedback-rating"><span class="rating-label">Your rating</span><div class="feedback-stars" role="radiogroup" aria-label="Rating"><button type="button" data-rating="1" aria-label="1 star">★</button><button type="button" data-rating="2" aria-label="2 stars">★</button><button type="button" data-rating="3" aria-label="3 stars">★</button><button type="button" data-rating="4" aria-label="4 stars">★</button><button type="button" data-rating="5" aria-label="5 stars">★</button></div></div>
            <div class="feedback-field full"><label for="feedback-message">Your feedback</label><textarea id="feedback-message" name="message" minlength="10" maxlength="400" placeholder="Tell people what it was like working with Heem..." required></textarea></div>
          </div>
          <button class="feedback-submit" type="submit"><span>Publish feedback</span><span aria-hidden="true">↗</span></button>
          <p class="feedback-status" role="status" aria-live="polite"></p>
        </form>
      </div>
      <div class="feedback-wall">
        <div class="feedback-wall-head"><div><p class="feedback-form-kicker">COMMUNITY NOTES</p><h3>Client wall</h3></div><span class="feedback-wall-count">0 feedback</span></div>
        <div class="feedback-list" aria-live="polite"></div>
      </div>`;

    section.querySelector(".feedback-grid")?.insertAdjacentElement("afterend", wrap);

    const STORAGE_KEY = "heem-visitor-feedback-v1";
    const form = wrap.querySelector("#heem-feedback-form");
    const list = wrap.querySelector(".feedback-list");
    const count = wrap.querySelector(".feedback-wall-count");
    const status = wrap.querySelector(".feedback-status");
    const starButtons = [...wrap.querySelectorAll(".feedback-stars button")];
    let rating = 5;

    const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
    const readItems = () => {
      try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
      } catch { return []; }
    };
    const writeItems = (items) => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 30))); return true; }
      catch { return false; }
    };
    const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
    const render = () => {
      const items = readItems();
      count.textContent = `${items.length} feedback${items.length === 1 ? "" : "s"}`;
      if (!items.length) {
        list.innerHTML = '<div class="feedback-empty">Be the first visitor to leave a written note here.</div>';
        return;
      }
      list.innerHTML = items.map((item) => `
        <article class="visitor-feedback-card">
          <div class="visitor-feedback-top">
            <div class="visitor-feedback-person"><span class="visitor-feedback-avatar">${escapeHTML(initials(item.name))}</span><span><strong class="visitor-feedback-name">${escapeHTML(item.name)}</strong>${item.role ? `<small class="visitor-feedback-role">${escapeHTML(item.role)}</small>` : ""}</span></div>
            <span class="visitor-feedback-stars" aria-label="${item.rating} out of 5 stars">${"★".repeat(item.rating)}${"☆".repeat(5-item.rating)}</span>
          </div>
          <p>${escapeHTML(item.message)}</p>
          <time class="visitor-feedback-date" datetime="${escapeHTML(item.date)}">${escapeHTML(new Date(item.date).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}))}</time>
        </article>`).join("");
    };
    const paintStars = () => starButtons.forEach((button) => {
      const active = Number(button.dataset.rating) <= rating;
      button.classList.toggle("active", active);
      button.setAttribute("aria-checked", Number(button.dataset.rating) === rating ? "true" : "false");
      button.setAttribute("role", "radio");
    });

    starButtons.forEach((button) => button.addEventListener("click", () => { rating = Number(button.dataset.rating); paintStars(); }));
    paintStars();
    render();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      status.classList.remove("error");
      const name = form.elements.name.value.trim();
      const role = form.elements.role.value.trim();
      const message = form.elements.message.value.trim();
      if (name.length < 2) { status.textContent = "Please add your name."; status.classList.add("error"); return; }
      if (message.length < 10) { status.textContent = "Please write at least 10 characters."; status.classList.add("error"); return; }
      const items = readItems();
      items.unshift({id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,name:name.slice(0,40),role:role.slice(0,55),message:message.slice(0,400),rating,date:new Date().toISOString()});
      if (!writeItems(items)) { status.textContent = "Your browser blocked local storage. Please try again in a normal browsing window."; status.classList.add("error"); return; }
      form.reset(); rating = 5; paintStars(); render();
      status.textContent = "Thank you — your feedback is now visible in the client wall.";
      list.querySelector(".visitor-feedback-card")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"nearest"});
    });

    if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.querySelectorAll(".feedback-form-panel,.feedback-wall").forEach((panel) => {
        panel.addEventListener("pointermove", (event) => {
          const box = panel.getBoundingClientRect();
          panel.style.setProperty("--fx", `${((event.clientX-box.left)/box.width*100).toFixed(1)}%`);
          panel.style.setProperty("--fy", `${((event.clientY-box.top)/box.height*100).toFixed(1)}%`);
        });
      });
    }
  });

  core.addEventListener("error", () => console.error("HEEM core script failed to load."));
  document.head.appendChild(core);
})();