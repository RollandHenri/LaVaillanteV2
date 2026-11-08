(function () {
  "use strict";

  /* ===================== À REMPLIR ===================== */

  /* Boutons de tri : ["identifiant", "Texte du bouton"] */
  var THEMES = [
    ["Toutes", "Toutes"],
    ["Dribble", "Dribble"],
    ["Shoot", "Shoot"],
    ["theme4", "Thème 4"],
  ];

  /* Vidéos. Chaque vidéo :
   * - theme   : identifiant d'un thème ci-dessus
   * - title   : titre affiché
   * - date    : texte libre (ex : "Octobre 2026")
   * - youtube : identifiant YouTube (la partie après "v=" dans l'adresse)
   *   OU src  : lien d'un fichier vidéo (ex : "/public/vid/match.mp4")
   * - thumb   : (facultatif) image de couverture. Pour un fichier vidéo,
   *             utiliser "poster" ou "thumb".
   * Sans youtube ni src, la carte s'affiche « Bientôt disponible ». */
  var VIDEOS = [
    {
      theme: "Dribble",
      title: "Exercice de Dribble",
      date: "Novembre 2026",
      src: "/public/vid/Training_dribble.mp4",
    },
    {
      theme: "Shoot",
      title: "Analyse de Shoot",
      date: "Novembre 2026",
      src: "/public/vid/Analyse_shoot.mp4",
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
    var c = document.createElement("article");
    c.className = "card card-video";
    c.style.animationDelay = Math.min(i, 8) * 40 + "ms";

    var box = document.createElement("div");
    box.className = "card-img";
    var btn = document.createElement("button");
    btn.className = "vbtn";
    btn.type = "button";
    var ready = !!(v.youtube || v.src);
    var thumbSrc = v.thumb || v.poster;
    var img = null;

    if (!thumbSrc && v.src) {
      var key = "thumb_" + v.src.replace(/[^a-z0-9_-]/gi, "_");
      thumbSrc = localStorage.getItem(key);
    }
    if (!thumbSrc && v.youtube) {
      thumbSrc =
        "https://i.ytimg.com/vi/" +
        encodeURIComponent(v.youtube) +
        "/hqdefault.jpg";
    }
    if (thumbSrc) {
      img = document.createElement("img");
      img.src = thumbSrc;
      img.alt = "";
      img.width = 480;
      img.height = 270;
      img.loading = "lazy";
      img.decoding = "async";
      btn.appendChild(img);
    }
    btn.appendChild(document.createElement("span"));
    btn.lastChild.className = "play";
    if (ready) {
      btn.setAttribute("aria-label", "Lire la vidéo : " + v.title);
      btn.onclick = function () {
        openVideo(v);
      };
    } else {
      btn.disabled = true;
      btn.setAttribute("aria-label", v.title + " (bientôt disponible)");
      var soon = document.createElement("span");
      soon.className = "soon";
      soon.textContent = "Bientôt disponible";
      box.appendChild(soon);
    }
    box.insertBefore(btn, box.firstChild);
    c.appendChild(box);

    var body = document.createElement("div");
    body.className = "card-body";
    var label = themeLabel(v.theme);
    if (label) {
      var tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = label;
      body.appendChild(tag);
    }
    var h3 = document.createElement("h3");
    h3.textContent = v.title;
    body.appendChild(h3);
    if (v.date) {
      var p = document.createElement("p");
      p.className = "date";
      p.textContent = v.date;
      body.appendChild(p);
    }
    c.appendChild(body);
    return c;
  }

  function render(theme) {
    grid.textContent = "";
    var list = theme
      ? VIDEOS.filter(function (v) {
          return v.theme === theme;
        })
      : VIDEOS;
    if (!list.length) {
      grid.appendChild(
        (function () {
          var p = document.createElement("p");
          p.className = "empty";
          p.textContent = "Aucune vidéo dans cette catégorie pour le moment.";
          return p;
        })(),
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
    var b = document.createElement("button");
    b.textContent = t[1];
    b.type = "button";
    b.setAttribute("aria-pressed", "false");
    b.onclick = function () {
      var isAll = t[0] === "Toutes";
      if (isAll) {
        [].forEach.call(filters.children, function (x) {
          x.setAttribute("aria-pressed", "false");
        });
        render("");
      } else {
        var on = b.getAttribute("aria-pressed") === "true";
        [].forEach.call(filters.children, function (x) {
          x.setAttribute("aria-pressed", x === b && !on);
        });
        render(on ? "" : t[0]);
      }
    };
    filters.appendChild(b);
  });

  render("");

  /* Ouvre automatiquement la vidéo ciblée par l'URL ?video=<fichier> */
  (function () {
    const params = new URLSearchParams(location.search);
    const file = params.get("video");
    if (!file) return;
    const target = VIDEOS.find(function (v) {
      return v.src && v.src.split("/").pop() === file;
    });
    if (target) {
      openVideo(target);
    }
  })();

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
