/* RiadKit landing page interactions.
   No dependencies. Progressive enhancement: everything works without JS
   except the interactive demo tabs and the demo-request form feedback. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------
   * 1. Navbar: translucent surface on scroll + active link
   * ----------------------------------------------- */
  var nav = document.getElementById("site-nav");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link]"));

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 24) {
      nav.classList.add("nav-scrolled");
    } else {
      nav.classList.remove("nav-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Highlight the section currently in view.
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ------------------------------------------------
   * 2. Mobile menu
   * ----------------------------------------------- */
  var menuButton = document.getElementById("menu-button");
  var mobileMenu = document.getElementById("mobile-menu");

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", String(open));
    mobileMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    mobileMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) setMenu(false);
    });
  }

  /* ------------------------------------------------
   * 3. Reveal on scroll
   * ----------------------------------------------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------
   * 4. FAQ accordion
   * ----------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll(".faq-item"), function (item) {
    var button = item.querySelector(".faq-trigger");
    if (!button) return;
    button.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      // Close the others so the FAQ stays compact.
      Array.prototype.forEach.call(
        document.querySelectorAll(".faq-item.is-open"),
        function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove("is-open");
            var trigger = openItem.querySelector(".faq-trigger");
            if (trigger) trigger.setAttribute("aria-expanded", "false");
          }
        }
      );
      item.classList.toggle("is-open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ------------------------------------------------
   * 5. Interactive guest-portal demo tabs
   * ----------------------------------------------- */
  var tablist = document.getElementById("demo-tabs");
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (tab) {
      return document.getElementById(tab.getAttribute("aria-controls"));
    });

    function selectTab(tab, focus) {
      tabs.forEach(function (t, i) {
        var selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
        if (panels[i]) panels[i].hidden = !selected;
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        selectTab(tab, false);
      });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          next = tabs[(index + 1) % tabs.length];
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          next = tabs[(index - 1 + tabs.length) % tabs.length];
        } else if (event.key === "Home") {
          next = tabs[0];
        } else if (event.key === "End") {
          next = tabs[tabs.length - 1];
        }
        if (next) {
          event.preventDefault();
          selectTab(next, true);
        }
      });
    });

    var initial = tabs.filter(function (t) {
      return t.getAttribute("aria-selected") === "true";
    })[0];
    selectTab(initial || tabs[0], false);
  }

  /* ------------------------------------------------
   * 6. Demo request form (client-side only preview)
   * ----------------------------------------------- */
  var form = document.getElementById("demo-form");
  if (form) {
    var status = document.getElementById("form-status");
    var submitButton = form.querySelector('button[type="submit"]');

    function setError(field, message) {
      var errorEl = form.querySelector('[data-error-for="' + field.name + '"]');
      if (errorEl) errorEl.textContent = message || "";
      field.setAttribute("aria-invalid", message ? "true" : "false");
      field.classList.toggle("border-primary", Boolean(message));
      return !message;
    }

    function validate(field) {
      var value = field.value.trim();
      if (field.name === "name") return setError(field, value ? "" : "Please tell us your name.");
      if (field.name === "riad")
        return setError(field, value ? "" : "Please add your riad's name.");
      if (field.name === "email") {
        if (!value) return setError(field, "We need an email to reach you.");
        return setError(
          field,
          /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? "" : "That email doesn't look right."
        );
      }
      return true;
    }

    Array.prototype.forEach.call(form.querySelectorAll("input[required]"), function (field) {
      field.addEventListener("blur", function () {
        validate(field);
      });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validate(field);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var fields = Array.prototype.slice.call(form.querySelectorAll("input[required]"));
      var valid = fields.map(validate).every(Boolean);

      if (!valid) {
        if (status) {
          status.textContent = "Please check the highlighted fields.";
          status.className = "text-sm font-semibold text-primary";
        }
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.label = submitButton.textContent;
        submitButton.textContent = "Sending…";
      }
      if (status) {
        status.textContent = "";
        status.className = "text-sm font-semibold";
      }

      // Front-end preview: no backend is connected in this build, so nothing is
      // sent and nothing is stored. Keep this message honest about that.
      window.setTimeout(function () {
        form.reset();
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.label || "Request my demo";
        }
        if (status) {
          status.textContent =
            "Thank you! This preview form isn't connected yet — no request was sent. We'll wire it up soon.";
          status.className = "text-sm font-semibold text-primary-dark";
        }
      }, 900);
    });
  }

  /* ------------------------------------------------
   * 7. Current year in the footer
   * ----------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
