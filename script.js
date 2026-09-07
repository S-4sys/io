document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const menuBtn = document.querySelector("#menuBtn");
  const menu = document.querySelector("#menu");
  const closeMenu = () => {
    body.classList.remove("menu-open");
    menu?.classList.remove("open");
    menu?.setAttribute("aria-hidden", "true");
    menuBtn?.setAttribute("aria-expanded", "false");
    menuBtn?.setAttribute("aria-label", "Open navigation");
  };
  const toggleMenu = () => {
    const isOpen = !body.classList.contains("menu-open");
    body.classList.toggle("menu-open", isOpen);
    menu?.classList.toggle("open", isOpen);
    menu?.setAttribute("aria-hidden", String(!isOpen));
    menuBtn?.setAttribute("aria-expanded", String(isOpen));
    menuBtn?.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  };

  menuBtn?.addEventListener("click", toggleMenu);
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  const playerVideo = document.querySelector("#playerVideo");
  const playButton = document.querySelector("#minimalPlayBtn");
  const playIcon = playButton?.querySelector(".icon-play");
  const pauseIcon = playButton?.querySelector(".icon-pause");

  const updateVideoUI = () => {
    if (!playerVideo || !playButton) return;
    const isPlaying = !playerVideo.paused && !playerVideo.ended;
    playIcon?.classList.toggle("hidden", isPlaying);
    pauseIcon?.classList.toggle("hidden", !isPlaying);
    playButton.setAttribute("aria-pressed", String(isPlaying));
    playButton.setAttribute("aria-label", isPlaying ? "Pause reel" : "Play reel");
  };

  playButton?.addEventListener("click", async () => {
    if (!playerVideo) return;
    try {
      if (playerVideo.paused || playerVideo.ended) {
        await playerVideo.play();
      } else {
        playerVideo.pause();
      }
    } catch {
      updateVideoUI();
    }
  });
  playerVideo?.addEventListener("play", updateVideoUI);
  playerVideo?.addEventListener("pause", updateVideoUI);
  playerVideo?.addEventListener("ended", updateVideoUI);
  playerVideo?.addEventListener("loadedmetadata", updateVideoUI);

  const filters = [...document.querySelectorAll(".filter")];
  const projects = [...document.querySelectorAll(".project")];
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const selected = filter.dataset.filter;
      filters.forEach((button) => {
        const active = button === filter;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });
      projects.forEach((project) => {
        const visible = selected === "all" || project.dataset.category === selected;
        project.classList.toggle("hidden", !visible);
        project.setAttribute("aria-hidden", String(!visible));
      });
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("in"));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${(index % 3) * 70}ms`;
      observer.observe(item);
    });
  }

  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImg");
  const lightboxCaption = document.querySelector("#lightboxCaption");
  const closeLightboxButton = document.querySelector("#closeLightbox");
  let lastFocusedElement = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    body.classList.remove("lightbox-open");
    if (lightboxImage) lightboxImage.src = "";
    lastFocusedElement?.focus();
  };
  const openLightbox = (trigger) => {
    if (!lightbox || !lightboxImage) return;
    lastFocusedElement = trigger;
    lightboxImage.src = trigger.dataset.lightbox || "";
    lightboxImage.alt = trigger.querySelector("img")?.alt || "";
    if (lightboxCaption) lightboxCaption.textContent = trigger.dataset.caption || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("lightbox-open");
    closeLightboxButton?.focus();
  };

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", () => openLightbox(trigger));
  });
  closeLightboxButton?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  const audio = document.querySelector("#bgAudio");
  const audioButton = document.querySelector("#audioToggle");
  const audioLabel = audioButton?.querySelector(".audio-label");
  const updateAudioUI = (isPlaying) => {
    audioButton?.classList.toggle("is-playing", isPlaying);
    audioButton?.setAttribute("aria-pressed", String(isPlaying));
    audioButton?.setAttribute("aria-label", isPlaying ? "Turn background audio off" : "Turn background audio on");
    if (audioLabel) audioLabel.textContent = isPlaying ? "SOUND ON" : "SOUND OFF";
  };
  audioButton?.addEventListener("click", async () => {
    if (!audio) return;
    try {
      if (audio.paused) {
        await audio.play();
        updateAudioUI(true);
      } else {
        audio.pause();
        updateAudioUI(false);
      }
    } catch {
      updateAudioUI(false);
    }
  });
  audio?.addEventListener("pause", () => updateAudioUI(false));
  audio?.addEventListener("ended", () => updateAudioUI(false));

  const hero = document.querySelector(".hero");
  const heroVideo = document.querySelector("#heroVideo");
  let scrollFrame = 0;
  const updateBackdrop = () => {
    scrollFrame = 0;
    if (!hero || !heroVideo || reduceMotion) return;
    const progress = Math.min(Math.max(-hero.getBoundingClientRect().top / Math.max(hero.offsetHeight, 1), 0), 1);
    heroVideo.style.opacity = String(.34 - progress * .25);
    heroVideo.style.filter = `saturate(${(.7 - progress * .2).toFixed(2)}) contrast(1.05) blur(${(progress * 4).toFixed(1)}px)`;
    heroVideo.style.transform = `scale(${(1.02 + progress * .04).toFixed(3)})`;
  };
  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateBackdrop);
  }, { passive: true });

  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor-dot");
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (finePointer && cursor && cursorDot) {
    window.addEventListener("pointermove", (event) => {
      const position = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      cursor.style.transform = position;
      cursorDot.style.transform = position;
    }, { passive: true });
    document.querySelectorAll("a, button").forEach((element) => {
      element.addEventListener("mouseenter", () => cursor.classList.add("active"));
      element.addEventListener("mouseleave", () => cursor.classList.remove("active"));
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (body.classList.contains("menu-open")) closeMenu();
    if (body.classList.contains("lightbox-open")) closeLightbox();
  });

  updateVideoUI();
  updateBackdrop();
});