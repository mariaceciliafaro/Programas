(function () {
  const printButton = document.querySelector("#print");
  printButton?.addEventListener("click", () => window.print());

  const portrait = document.querySelector("#portrait");
  portrait?.addEventListener("error", () => {
    portrait.remove();
  });

  const header = document.querySelector(".lp-header");
  const nav = document.querySelector("#menu-principal");
  const toggle = document.querySelector("#menu-toggle");
  const navLinks = [...document.querySelectorAll(".lp-nav a")];
  const sections = [...document.querySelectorAll("main section[id]")];

  function setMenu(open) {
    document.body.classList.toggle("nav-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    const label = toggle?.querySelector(".sr-only");
    if (label) label.textContent = open ? "Fechar menu" : "Abrir menu";
  }

  toggle?.addEventListener("click", () => {
    setMenu(!document.body.classList.contains("nav-open"));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  if ("IntersectionObserver" in window) {
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        const active = sections.find((section) => visible.has(section));
        navLinks.forEach((link) => {
          const match = active && link.hash === `#${active.id}`;
          if (match) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-90px 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  const progress = document.querySelector(".scroll-progress");
  let pending = false;
  function updateProgress() {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const value = available > 0 ? Math.max(0, Math.min(1, window.scrollY / available)) : 0;
    if (progress) progress.style.transform = `scaleX(${value})`;
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    pending = false;
  }
  window.addEventListener("scroll", () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  window.addEventListener("resize", updateProgress);
  window.addEventListener("load", updateProgress);
  updateProgress();

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if ("IntersectionObserver" in window) {
    const entrance = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!motionPreference.matches) entry.target.classList.add("reveal-in");
        entrance.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(
      ".section-heading, .contact-card, .value-card, .education-card, .qualifications, .career-entry, .stats__item, .cta"
    ).forEach((element) => entrance.observe(element));
  }
})();
