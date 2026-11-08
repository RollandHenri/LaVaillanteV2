import TEAMS from "./dataV4.js";

(function () {
  "use strict";

  var CATS = [
    ["bureau", "Bureau"],
    ["coach", "Coach"],
    ["senior", "Seniors"],
    ["u18", "U18"],
    ["u15", "U15"],
    ["u13", "U13"],
    ["u11", "U11"],
    ["u9", "U9"],
    ["baby", "Baby"],
  ];

  function h(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function $(id) {
    return document.getElementById(id);
  }
  /****** Fetch section  *******/
  /*** Boutton ***/
  const btnMatch = document.getElementById("tab-r");
  const btnClass = document.getElementById("tab-c");
  /*** Div classement et match ***/
  const match = document.querySelector(".fetch-match");
  const classement = document.querySelector(".fetch-classement");

  /*** Envent ****/
  btnClass.addEventListener("click", () => {
    classement.classList.add("fetch-active");
    match.classList.add("fetch-hidden");
  });
  btnMatch.addEventListener("click", () => {
    classement.classList.remove("fetch-active");
    match.classList.remove("fetch-hidden");
  });

  /****** fin fetch section  *******/
  function renderTeams(cat) {
    const grid = $("teams");
    if (!grid) return;
    grid.textContent = "";

    let list = cat
      ? TEAMS.filter(function (t) {
          return t.cat === cat;
        })
      : TEAMS.filter(function (t) {
          return t.isDefault;
        });

    list.forEach(function (t) {
      var card = h("article", "card card-team");

      let imgBox = h("div", "card-img");
      let img = document.createElement("img");
      img.src = t.img;
      img.alt = t.name;
      img.loading = "lazy";
      img.addEventListener("click", () => {
        window.open(t.img);
      });
      imgBox.appendChild(img);
      card.appendChild(imgBox);

      let body = h("div", "card-body");
      let tagMatch = CATS.filter(function (x) {
        return x[0] === t.cat;
      })[0];
      if (tagMatch) body.appendChild(h("span", "tag", tagMatch[1]));

      body.appendChild(h("h3", null, t.name));

      if (t.cat === "bureau") {
        body.appendChild(h("p", null, t.coach));
        body.appendChild(h("p", null, t.schedule));
      } else if (t.cat === "coach") {
        body.appendChild(h("p", null, "Statut : " + t.statut));
        body.appendChild(h("p", null, "Equipe : " + t.team));
      } else {
        body.appendChild(h("p", null, "Coach : " + t.coach));
        body.appendChild(h("p", null, "Entrainement : " + t.schedule));
      }

      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  let filtersContainer = $("filters");
  if (filtersContainer) {
    CATS.forEach(function (c) {
      var btn = h("button", null, c[1]);
      btn.type = "button";
      btn.setAttribute("aria-pressed", "false");
      btn.onclick = function () {
        var isPressed = btn.getAttribute("aria-pressed") === "true";
        [].forEach.call(filtersContainer.children, function (x) {
          x.setAttribute("aria-pressed", x === btn && !isPressed);
        });
        renderTeams(isPressed ? "" : c[0]);
      };
      filtersContainer.appendChild(btn);
    });
  }

  renderTeams("");

  let header = $("top");
  let burger = $("burger");
  let nav = $("nav");

  function onScroll() {
    if (header) header.classList.toggle("solid", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (burger && nav) {
    burger.onclick = function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute(
        "aria-label",
        open ? "Fermer le menu" : "Ouvrir le menu",
      );
    };
    [].forEach.call(nav.querySelectorAll("a"), function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  if ($("yr")) $("yr").textContent = new Date().getFullYear();

  let io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                e.target.classList.add("in");
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.12 },
        )
      : null;

  [].forEach.call(
    document.querySelectorAll(".rv:not([data-hero])"),
    function (e) {
      if (io) io.observe(e);
      else e.classList.add("in");
    },
  );

  function showHero() {
    [].forEach.call(document.querySelectorAll("[data-hero]"), function (e) {
      e.classList.add("in");
    });
  }

  var root = document.documentElement;
  var intro = $("intro");
  if (root.classList.contains("intro-on")) {
    var flown = false;
    var landed = false;
    var fly = $("fly");

    var land = function () {
      if (landed) return;
      landed = true;
      try {
        sessionStorage.setItem("vi-intro", "1");
      } catch (e) {}
      root.classList.remove("intro-on");
      root.classList.add("no-intro");
      showHero();
    };

    var go = function () {
      if (flown) return;
      flown = true;
      var brandSvg = document.querySelector(".brand svg");
      if (!brandSvg || !fly) {
        land();
        return;
      }
      var t = brandSvg.getBoundingClientRect();
      var f = fly.getBoundingClientRect();
      fly.style.transform =
        "translate(" +
        (t.left + t.width / 2 - f.left - f.width / 2) +
        "px," +
        (t.top + t.height / 2 - f.top - f.height / 2) +
        "px) scale(" +
        t.width / f.width +
        ")";
      if (intro) intro.classList.add("go");
      setTimeout(land, 900);
    };

    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
      land();
    } else {
      var coin = $("coin");
      if (coin) coin.addEventListener("animationend", go);
      setTimeout(go, 2300);
      setTimeout(land, 3500);
    }
  } else {
    showHero();
  }
})();

/*********************************** */

document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments
  // Note : cible .card-actu. Si rv et in sont des classes d'animation ajoutées plus tard,
  // il vaut mieux cibler uniquement .card-actu pour être sûr que le clic fonctionne tout le temps.
  const cards = document.querySelectorAll(".card-actu");
  const modal = document.getElementById("popup-actu");
  const popupImg = document.getElementById("popup-img");
  const popupDate = document.getElementById("popup-date");
  const popupTitle = document.getElementById("popup-title");
  const popupText = document.getElementById("popup-text");
  const link =
    "https://app.grinta.eu/vaillante-immaculee-basketball/adult/official";
  const closeBtn = document.querySelector(".close-btn");

  // Fonction pour fermer la popup
  const closeModal = () => {
    modal.classList.remove("show");
    cards.forEach((card) => {
      card.style.zIndex = "3";
    });
    setTimeout(() => {
      modal.style.display = "none";
    }, 200); // Attend la fin de la transition CSS
  };

  // 1. Ouvrir la popup au clic sur une carte
  cards.forEach((card) => {
    if (card.id !== "no-open") {
      card.addEventListener("click", () => {
        // Récupérer l'image de la carte cliquée
        const img = card.querySelector("img");
        const date = card.querySelector("span");
        const title = card.querySelector("h3");
        const text = card.querySelector("p");

        // Descendre de niveau des cartes

        card.style.zIndex = "-1";

        if (img) popupImg.src = img.src;
        if (date) popupDate.textContent = date.textContent;
        if (title) popupTitle.textContent = title.textContent;
        if (text) popupText.textContent = text.textContent;

        // Afficher la popup
        modal.style.display = "flex";

        // Un petit délai pour que la transition d'opacité (fade-in) fonctionne
        setTimeout(() => {
          modal.classList.add("show");
        }, 10);
      });
    } else if (card.id == "no-open") {
      card.addEventListener("click", () => {
        window.open(link);
      });
    }
  });

  // Bascule "Voir les autres actualités" sur mobile
  const btnMore = document.getElementById("btn-more-actu");
  const allCards = document.querySelectorAll(".card-actu");
  let expanded = false;

  if (btnMore) {
    btnMore.addEventListener("click", (event) => {
      event.preventDefault();
      expanded = !expanded;
      allCards.forEach((card, index) => {
        if (index >= 3) {
          if (expanded) {
            card.classList.remove("hidden");
            card.style.animationDelay = `${(index - 3) * 0.1}s`;
            card.classList.add("revealing");
          } else {
            card.classList.add("hidden");
            card.classList.remove("revealing");
            card.style.animationDelay = "";
          }
        }
      });
      btnMore.textContent = expanded
        ? "Voir moins"
        : "Voir les autres actualités";

      // Deplacer le bouton après la derniere carte revelée
      if (expanded) {
        allCards[5].after(btnMore);
      } else {
        allCards[2].after(btnMore);
      }
    });
  }

  // 2. Fermer au clic sur la croix
  closeBtn.addEventListener("click", () => {
    closeModal();
  });

  // 3. Fermer au clic sur l'arrière-plan
  modal.addEventListener("click", (event) => {
    // Si l'élément cliqué est strictement l'arrière plan sombre (et non la boite blanche au centre)
    if (event.target === modal) {
      closeModal();
    }
  });

  // 4. Fermer avec la touche Échap
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });
});

/****** Carrousel vidéo  ******/
(() => {
  /* Données vidéo (mêmes thèmes/titres/src que pages/videosv2.js) */
  const CAROUSEL_VIDEOS = [
    {
      theme: "Dribble",
      title: "Exercice de Dribble",
      src: "/public/vid/Training_dribble.mp4",
    },
    {
      theme: "Shoot",
      title: "Analyse de Shoot",
      src: "/public/vid/Analyse_shoot.mp4",
    },
    { theme: "theme2", title: "Titre de la vidéo 3", src: null },
    { theme: "theme2", title: "Titre de la vidéo 4", src: null },
    { theme: "theme3", title: "Titre de la vidéo 5", src: null },
    { theme: "theme4", title: "Titre de la vidéo 6", src: null },
  ];

  const VIDEO_BG_COLORS = [
    "#ff8787",
    "#ffa94d",
    "#fcc419",
    "#8ce99a",
    "#38d9a9",
    "#3bc9db",
    "#4dabf7",
    "#748ffc",
    "#b197fc",
    "#f783ac",
  ];

  function h(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  /* Génère une miniature depuis la première frame de la vidéo, stockée en localStorage */
  function generateThumb(src, cb) {
    const key = "thumb_" + src.replace(/[^a-z0-9_-]/gi, "_");
    const cached = localStorage.getItem(key);
    if (cached) {
      cb(cached);
      return;
    }
    const video = document.createElement("video");
    video.playsInline = true;
    video.muted = true;
    video.preload = "auto";
    video.src = src;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let done = false;
    function draw() {
      if (done) return;
      done = true;
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 270;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
      try {
        localStorage.setItem(key, dataUrl);
      } catch (e) {}
      cb(dataUrl);
      video.remove();
    }
    video.addEventListener("loadedmetadata", () => {
      try {
        video.currentTime = 0;
      } catch (e) {}
    });
    video.addEventListener("seeked", () => {
      if (!done) draw();
    });
    video.addEventListener("canplay", () => {
      if (!done && video.readyState >= 2) draw();
    });
    video.addEventListener("error", () => {
      if (!done) {
        done = true;
        cb("");
        video.remove();
      }
    });
  }

  /* Crée les cartes vidéo et les insère dans .vc-track avant que le carrousel les clone */
  function buildVideoCards() {
    const track = document.querySelector(".vc-track");
    if (!track) return;

    CAROUSEL_VIDEOS.forEach((vid, i) => {
      const a = h("a", "vc-card", "");
      a.href = "./pages/videos.html";
      if (vid.src) {
        const base = vid.src.split("/").pop();
        a.href += "?video=" + encodeURIComponent(base);
      }
      a.style.setProperty("--c1", VIDEO_BG_COLORS[i % VIDEO_BG_COLORS.length]);
      a.style.setProperty(
        "--c2",
        VIDEO_BG_COLORS[(i + 1) % VIDEO_BG_COLORS.length],
      );

      const play = h("span", "vc-play", "");
      const title = h("span", "vc-title", vid.title);
      a.appendChild(play);
      a.appendChild(title);

      if (vid.src) {
        generateThumb(vid.src, (dataUrl) => {
          if (dataUrl) {
            const img = document.createElement("img");
            img.src = dataUrl;
            img.alt = vid.title;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.display = "block";
            a.insertBefore(img, play);
          }
        });
      } else {
        const soon = h("span", "vc-soon", "Bientôt disponible");
        soon.style.position = "absolute";
        soon.style.inset = "0";
        soon.style.display = "flex";
        soon.style.alignItems = "center";
        soon.style.justifyContent = "center";
        soon.style.background = "rgba(0,0,0,0.4)";
        soon.style.color = "#fff";
        soon.style.fontSize = "0.9rem";
        soon.style.fontWeight = "600";
        a.appendChild(soon);
      }

      track.appendChild(a);
    });
  }

  buildVideoCards();
})();

/****** Carrousel vidéo  ******/
(() => {
  const root = document.querySelector("[data-video-carousel]");
  if (!root) return;

  const track = root.querySelector(".vc-track");
  const originals = Array.from(track.children);
  const SPEED = 40; // pixels par seconde

  // Mouvement réduit : on désactive l'animation, la liste reste scrollable
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) {
    root.classList.add("is-static");
    return;
  }

  let setWidth = 0; // largeur d'une série complète de vignettes
  let offset = 0; // décalage courant en px
  let speed = SPEED; // vitesse courante (lissée)
  let paused = false;
  let last = 0;

  // Clone la série d'origine autant de fois que nécessaire pour remplir l'écran
  function build() {
    track.querySelectorAll("[data-clone]").forEach((el) => el.remove());

    setWidth = originals.reduce((sum, card) => {
      const style = getComputedStyle(card);
      return sum + card.offsetWidth + parseFloat(style.marginRight);
    }, 0);

    const copies = Math.ceil(root.offsetWidth / setWidth) + 1;
    for (let i = 0; i < copies; i++) {
      originals.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("data-clone", "");
        clone.setAttribute("aria-hidden", "true");
        clone.tabIndex = -1; // les doublons ne doivent pas être focusables
        track.appendChild(clone);
      });
    }
    offset = offset % setWidth;
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05); // évite les sauts après un onglet inactif
    last = now;

    // Ralentit / reprend en douceur au lieu de s'arrêter net
    const target = paused ? 0 : SPEED;
    speed += (target - speed) * Math.min(dt * 8, 1);

    offset += speed * dt;
    if (offset >= setWidth) offset -= setWidth;
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;

    requestAnimationFrame(frame);
  }

  // Pause au survol et au focus clavier
  root.addEventListener("pointerenter", () => (paused = true));
  root.addEventListener("pointerleave", () => (paused = false));
  root.addEventListener("focusin", () => (paused = true));
  root.addEventListener("focusout", () => (paused = false));

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 150);
  });

  build();
  requestAnimationFrame((t) => {
    last = t;
    frame(t);
  });
})();

/******  fin *******/
