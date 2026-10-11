(function () {
  "use strict";

  /* ===================== À REMPLIR ===================== */

  /* Boutons de tri : ["identifiant", "Texte du bouton"] */
  var THEMES = [
    ["theme1", "Toutes"],
    ["theme2", "Thème 2"],
    ["theme3", "Thème 3"],
    ["theme4", "Thème 4"],
  ];

  /* Vidéos. Chaque vidéo :
     - theme   : identifiant d'un thème ci-dessus
     - title   : titre affiché
     - date    : texte libre (ex : "Octobre 2026")
     - youtube : identifiant YouTube (la partie après "v=" dans l'adresse)
       OU src  : lien d'un fichier vidéo (ex : "/public/videos/match.mp4")
     - thumb   : (facultatif) image de couverture. Pour un fichier vidéo,
                 utiliser "poster" ou "thumb".
     Sans youtube ni src, la carte s'affiche « Bientôt disponible ». */
  var VIDEOS = [
    {
      theme: "theme1",
      title: "Titre de la vidéo 1",
      date: "Octobre 2026",
      youtube: "",
    },
    {
      theme: "theme1",
      title: "Titre de la vidéo 2",
      date: "Octobre 2026",
      youtube: "",
    },
    {
      theme: "theme2",
      title: "Titre de la vidéo 3",
      date: "Septembre 2026",
      youtube: "",
    },
    {
      theme: "theme2",
      title: "Titre de la vidéo 4",
      date: "Septembre 2026",
      youtube: "",
    },
    {
      theme: "theme3",
      title: "Titre de la vidéo 5",
      date: "Juin 2026",
      youtube: "",
    },
    {
      theme: "theme4",
      title: "Titre de la vidéo 6",
      date: "Mai 2026",
      youtube: "",
    },
  ];

  /* ===================== CODE ===================== */

  function h(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function $(id) {
    return document.getElementById(id);
  }

  var grid = $("vgrid");
  var filters = $("vfilters");
  var count = $("vcount");
  var dlg = $("player");
  var stage = $("pstage");
  if (!grid || !filters) return;

  function themeLabel(id) {
    var t = THEMES.filter(function (x) {
      return x[0] === id;
    })[0];
    return t ? t[1] : "";
  }

  function openVideo(v) {
    stage.textContent = "";
    var el;
    if (v.youtube) {
      el = document.createElement("iframe");
      el.src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(v.youtube) +
        "?autoplay=1&rel=0";
      el.title = v.title;
      el.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      el.allowFullscreen = true;
      el.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    } else {
      el = document.createElement("video");
      el.src = v.src;
      el.controls = true;
      el.autoplay = true;
      el.playsInline = true;
      if (v.poster || v.thumb) el.poster = v.poster || v.thumb;
    }
    stage.appendChild(el);
    $("ptitle").textContent = v.title;
    dlg.showModal();
  }

  function card(v, i) {
    var c = h("article", "card card-video");
    c.style.animationDelay = Math.min(i, 8) * 40 + "ms";

    var box = h("div", "card-img");
    var btn = h("button", "vbtn");
    btn.type = "button";
    var ready = !!(v.youtube || v.src);
    var thumb =
      v.thumb ||
      v.poster ||
      (v.youtube
        ? "https://i.ytimg.com/vi/" +
          encodeURIComponent(v.youtube) +
          "/hqdefault.jpg"
        : "");
    if (thumb) {
      var img = document.createElement("img");
      img.src = thumb;
      img.alt = "";
      img.width = 480;
      img.height = 270;
      img.loading = "lazy";
      img.decoding = "async";
      btn.appendChild(img);
    }
    btn.appendChild(h("span", "play"));
    if (ready) {
      btn.setAttribute("aria-label", "Lire la vidéo : " + v.title);
      btn.onclick = function () {
        openVideo(v);
      };
    } else {
      btn.disabled = true;
      btn.setAttribute("aria-label", v.title + " (bientôt disponible)");
      box.appendChild(h("span", "soon", "Bientôt disponible"));
    }
    box.insertBefore(btn, box.firstChild);
    c.appendChild(box);

    var body = h("div", "card-body");
    var label = themeLabel(v.theme);
    if (label) body.appendChild(h("span", "tag", label));
    body.appendChild(h("h3", null, v.title));
    if (v.date) body.appendChild(h("p", "date", v.date));
    c.appendChild(body);
    return c;
  }

  /* Sans bouton actif : toutes les vidéos. Un clic sur le bouton actif le désactive. */
  function render(theme) {
    grid.textContent = "";
    var list = theme
      ? VIDEOS.filter(function (v) {
          return v.theme === theme;
        })
      : VIDEOS;
    if (!list.length) {
      grid.appendChild(
        h("p", "empty", "Aucune vidéo dans cette catégorie pour le moment."),
      );
    }
    list.forEach(function (v, i) {
      grid.appendChild(card(v, i));
    });
    if (count) {
      count.textContent =
        list.length + (list.length > 1 ? " vidéos" : " vidéo");
    }
  }

  THEMES.forEach(function (t) {
    var b = h("button", null, t[1]);
    b.type = "button";
    b.setAttribute("aria-pressed", "false");
    b.onclick = function () {
      var on = b.getAttribute("aria-pressed") === "true";
      [].forEach.call(filters.children, function (x) {
        x.setAttribute("aria-pressed", x === b && !on);
      });
      render(on ? "" : t[0]);
    };
    filters.appendChild(b);
  });

  render("");

  /* Lecteur : fermeture (bouton, clic hors lecteur, Échap) et arrêt de la lecture */
  if (dlg) {
    $("pclose").onclick = function () {
      dlg.close();
    };
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener("close", function () {
      stage.textContent = "";
    });
  }
})();

////////////////// HambMenu //////////////

(function () {
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  if (!burger || !nav) return;
  function setMenu(open) {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute(
      "aria-label",
      open ? "Fermer le menu" : "Ouvrir le menu",
    );
  }
  burger.onclick = function () {
    setMenu(!nav.classList.contains("open"));
  };
  [].forEach.call(nav.querySelectorAll("a"), function (a) {
    a.addEventListener("click", function () {
      setMenu(false);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1080) setMenu(false);
  });
});

/////////////// Scroll ///////////////

const navbar = document.getElementById("top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    console.log(navbar);
    navbar.classList.add("solid");
  } else {
    navbar.classList.remove("solid");
  }
});
