/* Porto Drac – gemensam logik: språk, meny, animationer, formulär. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var STORAGE_KEY = "portodrac-lang";
  var supported = ["sv", "en"];

  /* ---------------------------------------------------------------------
     Språk
     --------------------------------------------------------------------- */

  function storedLang() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      if (supported.indexOf(value) !== -1) return value;
    } catch (err) {
      /* localStorage kan vara blockerat */
    }
    return null;
  }

  function initialLang() {
    var params = new URLSearchParams(window.location.search);
    var fromUrl = params.get("lang");
    if (supported.indexOf(fromUrl) !== -1) return fromUrl;
    return storedLang() || "sv";
  }

  function applyLang(lang) {
    if (supported.indexOf(lang) === -1) lang = "sv";

    document.documentElement.lang = lang;

    var nodes = document.querySelectorAll("[data-sv], [data-en]");
    Array.prototype.forEach.call(nodes, function (el) {
      var value = el.getAttribute("data-" + lang);
      if (value === null) return;

      if (el.tagName === "TITLE") {
        document.title = value;
      } else if (el.tagName === "OPTION") {
        el.textContent = value;
      } else {
        el.textContent = value;
      }
    });

    var meta = document.getElementById("meta-description");
    if (meta) {
      var description = meta.getAttribute("data-" + lang);
      if (description) meta.setAttribute("content", description);
    }

    var ogTitle = document.getElementById("og-title");
    if (ogTitle) {
      var ogValue = ogTitle.getAttribute("data-" + lang);
      if (ogValue) ogTitle.setAttribute("content", ogValue);
    }

    var ogDescription = document.getElementById("og-description");
    if (ogDescription) {
      var ogDesc = ogDescription.getAttribute("data-" + lang);
      if (ogDesc) ogDescription.setAttribute("content", ogDesc);
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-sv-alt], [data-en-alt]"), function (img) {
      var alt = img.getAttribute("data-" + lang + "-alt");
      if (alt !== null) img.setAttribute("alt", alt);
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-sv-aria], [data-en-aria]"), function (el) {
      var label = el.getAttribute("data-" + lang + "-aria");
      if (label !== null) el.setAttribute("aria-label", label);
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-sv-placeholder], [data-en-placeholder]"), function (el) {
      var placeholder = el.getAttribute("data-" + lang + "-placeholder");
      if (placeholder !== null) el.setAttribute("placeholder", placeholder);
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (button) {
      var isActive = button.getAttribute("data-lang") === lang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* ignorera */
    }

    document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: lang } }));
  }

  var currentLang = initialLang();
  applyLang(currentLang);

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-lang]");
    if (!button) return;
    var lang = button.getAttribute("data-lang");
    if (lang === currentLang) return;
    currentLang = lang;
    applyLang(lang);
  });

  /* ---------------------------------------------------------------------
     Mobilmeny
     --------------------------------------------------------------------- */

  var header = document.querySelector(".site-header");
  var navToggle = header ? header.querySelector(".nav-toggle") : null;
  var nav = header ? header.querySelector("#site-nav") : null;
  var pageMain = document.querySelector("main");
  var pageFooter = document.querySelector(".site-footer");

  function setBackgroundInert(isInert) {
    [pageMain, pageFooter].forEach(function (element) {
      if (element) element.toggleAttribute("inert", isInert);
    });
  }

  function closeNav(returnFocus) {
    if (!header || !navToggle) return;
    var wasOpen = header.classList.contains("nav-open");
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    setBackgroundInert(false);
    if (wasOpen && returnFocus) navToggle.focus();
  }

  if (header && navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("no-scroll", isOpen);
      setBackgroundInert(isOpen);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav(true);
    });

    if (window.matchMedia) {
      var desktop = window.matchMedia("(min-width: 901px)");
      var handleDesktop = function (event) {
        if (event.matches) closeNav(false);
      };
      if (desktop.addEventListener) desktop.addEventListener("change", handleDesktop);
      else if (desktop.addListener) desktop.addListener(handleDesktop);
    }
  }

  /* ---------------------------------------------------------------------
     Header vid scroll
     --------------------------------------------------------------------- */

  if (header) {
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Scroll-animationer
     --------------------------------------------------------------------- */

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

      Array.prototype.forEach.call(revealItems, function (el) {
        observer.observe(el);
      });
    } else {
      Array.prototype.forEach.call(revealItems, function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  /* ---------------------------------------------------------------------
     Formulär som öppnar e-postprogrammet
     --------------------------------------------------------------------- */

  Array.prototype.forEach.call(document.querySelectorAll("form[data-mailto]"), function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var recipient = form.getAttribute("data-mailto");
      var data = new FormData(form);
      var lang = document.documentElement.lang === "en" ? "en" : "sv";
      var subject = form.getAttribute("data-subject-" + lang) || "Porto Drac";
      var lines = [];

      data.forEach(function (value, key) {
        if (!value) return;
        var label = form.querySelector('[name="' + key + '"]');
        var fieldName = label && label.getAttribute("data-label-" + lang) ? label.getAttribute("data-label-" + lang) : key;
        lines.push(fieldName + ": " + value);
      });

      var mailto = "mailto:" + recipient +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      var status = form.querySelector(".form__status");
      if (status) {
        status.classList.add("is-visible");
        status.classList.remove("form__status--error");
      }

      window.setTimeout(function () {
        window.location.href = mailto;
      }, 350);
    });
  });

  /* ---------------------------------------------------------------------
     Småsaker
     --------------------------------------------------------------------- */

  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-print]"), function (button) {
    button.addEventListener("click", function () {
      window.print();
    });
  });
})();
