(function () {
  var header = document.querySelector("[data-header]");
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-nav]");
  var navLinks = document.querySelectorAll('a[href^="#"]');
  var revealItems = document.querySelectorAll(".reveal");
  var fallbackImages = document.querySelectorAll("[data-fallback-image]");
  var heroSliders = document.querySelectorAll("[data-hero-slider]");

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  function closeMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.classList.remove("is-active");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menüyü aç");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-active", isOpen);
      document.body.classList.toggle("menu-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Menüyü kapat" : "Menüyü aç");
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      var target = targetId && targetId.length > 1 ? document.querySelector(targetId) : null;
      if (!target) return;

      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", targetId);
    });
  });

  fallbackImages.forEach(function (image) {
    function markMissing() {
      var shell = image.closest(".image-shell");
      if (shell) shell.classList.add("is-missing");
    }

    if (image.complete && image.naturalWidth === 0) {
      markMissing();
    } else {
      image.addEventListener("error", markMissing, { once: true });
    }
  });

  heroSliders.forEach(function (slider) {
    var track = slider.querySelector("[data-slider-track]");
    var prev = slider.querySelector("[data-slider-prev]");
    var next = slider.querySelector("[data-slider-next]");
    if (!track) return;

    function slide(direction) {
      var item = track.querySelector(".hero-photo");
      var gap = parseFloat(window.getComputedStyle(track).gap) || 0;
      var distance = item ? item.getBoundingClientRect().width + gap : track.clientWidth;
      track.scrollBy({ left: direction * distance, behavior: "smooth" });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        slide(-1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        slide(1);
      });
    }
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });
})();
