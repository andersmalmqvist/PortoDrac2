/* Porto Drac – galleri: filter och lightbox. */
(function () {
  "use strict";

  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  if (!items.length) return;

  var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));

  /* ---------------------------------------------------------------------
     Filter
     --------------------------------------------------------------------- */

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");

      filterButtons.forEach(function (other) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
        other.classList.toggle("is-active", other === button);
      });

      items.forEach(function (item) {
        var category = item.getAttribute("data-category");
        var show = filter === "all" || filter === category;
        item.hidden = !show;
        var cell = item.closest("li");
        if (cell) cell.hidden = !show;
      });

      if (lightbox && lightbox.classList.contains("is-open")) closeLightbox();
    });
  });

  /* ---------------------------------------------------------------------
     Lightbox
     --------------------------------------------------------------------- */

  var lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;

  var imageEl = lightbox.querySelector(".lightbox__img");
  var captionEl = lightbox.querySelector(".lightbox__caption");
  var countEl = lightbox.querySelector(".lightbox__count");
  var closeBtn = lightbox.querySelector(".lightbox__close");
  var prevBtn = lightbox.querySelector(".lightbox__nav--prev");
  var nextBtn = lightbox.querySelector(".lightbox__nav--next");

  var visibleItems = [];
  var currentIndex = 0;
  var lastFocused = null;
  var touchStartX = null;

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "sv";
  }

  function captionFor(item) {
    return item.getAttribute("data-caption-" + lang()) || "";
  }

  function render() {
    var item = visibleItems[currentIndex];
    if (!item) return;

    var img = item.querySelector("img");
    var src = item.getAttribute("data-full") || (img ? img.getAttribute("src") : "");
    var alt = img ? img.getAttribute("alt") : "";

    imageEl.setAttribute("src", src);
    imageEl.setAttribute("alt", alt);
    captionEl.textContent = captionFor(item);
    countEl.textContent = (currentIndex + 1) + " / " + visibleItems.length;

    var hasMultiple = visibleItems.length > 1;
    prevBtn.hidden = !hasMultiple;
    nextBtn.hidden = !hasMultiple;

    preload(currentIndex + 1);
    preload(currentIndex - 1);
  }

  function preload(offset) {
    var item = visibleItems[(offset + visibleItems.length) % visibleItems.length];
    if (!item || !visibleItems.length) return;
    var img = item.querySelector("img");
    var src = item.getAttribute("data-full") || (img ? img.getAttribute("src") : "");
    if (!src) return;
    var pre = new Image();
    pre.src = src;
  }

  function openLightbox(item) {
    lastFocused = document.activeElement;
    visibleItems = items.filter(function (candidate) {
      return !candidate.hidden;
    });
    currentIndex = Math.max(0, visibleItems.indexOf(item));

    render();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    imageEl.removeAttribute("src");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function step(direction) {
    if (visibleItems.length < 2) return;
    currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
    render();
  }

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      openLightbox(item);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", function () {
    step(-1);
  });
  nextBtn.addEventListener("click", function () {
    step(1);
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
      return;
    }

    if (event.key === "Tab") {
      var focusable = [closeBtn, prevBtn, nextBtn].filter(function (el) {
        return !el.hidden;
      });
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  lightbox.addEventListener("touchstart", function (event) {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener("touchend", function (event) {
    if (touchStartX === null) return;
    var delta = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 50) return;
    step(delta < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener("languagechange", function () {
    if (lightbox.classList.contains("is-open")) render();
  });
})();
