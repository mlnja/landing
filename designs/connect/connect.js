/*
 * connect.js — MLOps.Ninja personal "fast-connect" pages
 * --------------------------------------------------------
 * Each page defines a window.PERSON config, then includes:
 *   <link rel="stylesheet" href="../styles/tokens.css" />
 *   <div id="connect"></div>
 *   <script src="qrcode.min.js"></script>
 *   <script>window.PERSON = { ... }</script>
 *   <script src="connect.js"></script>
 *
 * Renders: a branded QR (with the person's photo in the centre) that
 * encodes PERSON.url, monochrome network buttons (brand-coloured icons),
 * and a "Save to contacts" vCard download. Designed to fit one screen.
 */
(function () {
  "use strict";

  // ---- Network icons (simple-icons paths, MIT/CC0) + brand colours ----
  // Per the brief: buttons stay on-brand monochrome; colour lives in the icon.
  var NET = {
    x: {
      label: "X",
      color: "#000000",
      fill: true,
      path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
    },
    threads: {
      label: "Threads",
      color: "#000000",
      fill: true,
      path: "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.358-.218-3.255-.801-1.06-.69-1.68-1.74-1.746-2.964-.068-1.19.4-2.286 1.32-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.583-1.308-.881-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.066 2.818-.543 3.086-3.71a10.276 10.276 0 0 0-2.215-.221z",
    },
    linkedin: {
      label: "LinkedIn",
      color: "#0A66C2",
      fill: true,
      path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
    },
    telegram: {
      label: "Telegram",
      color: "#229ED9",
      fill: true,
      path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
    },
    email: {
      label: "Email",
      color: "#0ea5e9",
      fill: false,
      // simple envelope (stroke)
      path: "M3 6.5h18v11H3zM3.5 7l8.5 6 8.5-6",
    },
  };

  var ORDER = ["x", "threads", "linkedin", "telegram", "email"];

  function svgFor(net, key) {
    var n = NET[net];
    if (!n) return "";
    if (n.fill) {
      return (
        '<svg viewBox="0 0 24 24" aria-hidden="true" style="fill:' + n.color + '">' +
        '<path d="' + n.path + '"/></svg>'
      );
    }
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="' + n.color +
      '" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="' + n.path + '"/></svg>'
    );
  }

  // ---- Styles (injected once, shared by every connect page) ----
  function injectCSS() {
    if (document.getElementById("connect-styles")) return;
    var s = document.createElement("style");
    s.id = "connect-styles";
    s.textContent = [
      "body{background:var(--surface-container-lowest);}",
      ".cnct{min-height:calc(100svh - 69px);display:flex;align-items:center;justify-content:center;",
      "margin:0 auto;padding:clamp(28px,5vh,56px) 20px;}",
      ".cnct__inner{display:grid;grid-template-columns:auto minmax(280px,360px);gap:clamp(32px,5vw,64px);",
      "align-items:center;width:100%;max-width:880px;}",
      ".cnct__panel{display:flex;flex-direction:column;gap:12px;min-width:0;}",
      ".cnct__card{display:flex;flex-direction:column;align-items:center;gap:16px;}",
      ".cnct__qrwrap{padding:12px;background:#fff;border:1px solid var(--hairline);border-radius:var(--radius-lg);",
      "box-shadow:var(--shadow-float);line-height:0;}",
      ".cnct__qr{display:block;width:min(300px,72vw);height:min(300px,72vw);}",
      ".cnct__id{text-align:center;width:300px;max-width:100%;}",
      ".cnct__name{font-family:var(--font-display);font-weight:700;font-size:clamp(22px,6vw,26px);letter-spacing:-0.02em;",
      "margin:0;line-height:1.1;color:var(--on-surface);text-wrap:balance;}",
      ".cnct__role{font-family:var(--font-mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;",
      "color:var(--on-surface-muted);margin-top:9px;}",
      ".cnct__role b{color:var(--on-surface-variant);font-weight:500;}",
      ".cnct__scan{font-family:var(--font-mono);font-size:10px;letter-spacing:0.16em;text-transform:uppercase;white-space:nowrap;",
      "color:var(--on-surface-muted);display:flex;align-items:center;gap:7px;}",
      ".cnct__scan::before{content:'';width:5px;height:5px;background:var(--secondary-container);}",
      ".cnct__links{display:grid;grid-template-columns:1fr;gap:10px;width:100%;}",
      ".cnct__link{display:flex;align-items:center;gap:11px;padding:12px 14px;background:var(--surface-container-lowest);",
      "border:1px solid var(--outline-variant);border-radius:var(--radius-sm);color:var(--on-surface);",
      "transition:border-color 150ms ease,transform 150ms ease;min-height:52px;}",
      ".cnct__link:hover{border-color:var(--on-surface);transform:translateY(-1px);}",
      ".cnct__link svg{width:21px;height:21px;flex-shrink:0;}",
      ".cnct__link .net{display:flex;flex-direction:column;line-height:1.2;min-width:0;}",
      ".cnct__link .net b{font-family:var(--font-display);font-weight:700;font-size:14.5px;}",
      ".cnct__link .net span{font-family:var(--font-mono);font-size:10px;color:var(--on-surface-muted);",
      "font-weight:400;letter-spacing:.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
      ".cnct__link--wide{grid-column:1 / -1;}",
      ".cnct__vcard{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:16px;",
      "background:var(--on-surface);color:var(--surface-container-lowest);border:0;border-radius:var(--radius-sm);",
      "font-family:var(--font-display);font-weight:700;font-size:15px;transition:background 150ms ease;}",
      ".cnct__vcard:hover{background:#000;}",
      ".cnct__vcard svg{width:18px;height:18px;}",
      ".cnct__foot{display:none;}",
      "@media (max-width:760px){",
      ".cnct{align-items:flex-start;}",
      ".cnct__inner{grid-template-columns:1fr;gap:clamp(18px,3vh,26px);max-width:460px;justify-items:center;}",
      ".cnct__panel{width:100%;}",
      ".cnct__links{grid-template-columns:1fr 1fr;}",
      ".cnct__link--wide{grid-column:1 / -1;}",
      "}",
      "@media (max-width:380px){.cnct__links{grid-template-columns:1fr;}}",
    ].join("");
    document.head.appendChild(s);
  }

  // Crop a square that is ALWAYS fully inside the source photo (so the circular
  // avatar is never partially empty). Zooms toward the face, then clamps the
  // square to the image bounds on both axes.
  function faceCrop(iw, ih) {
    var side = Math.min(iw, ih) * 0.72;       // always <= the smaller dimension
    var sx = iw / 2 - side / 2;               // horizontally centred
    var sy = ih * 0.44 - side * 0.40;         // bias toward the face
    sx = Math.max(0, Math.min(sx, iw - side)); // keep inside the photo
    sy = Math.max(0, Math.min(sy, ih - side));
    return { sx: sx, sy: sy, side: side };
  }

  // ---- QR with centred photo ----
  function makeQR(P, img) {
    var canvas = document.getElementById("cnct-qr");
    if (!canvas || typeof qrcode === "undefined") return;

    var text = P.url || location.href;
    var qr = null;
    for (var t = 2; t <= 20 && !qr; t += 1) {
      try {
        var cand = qrcode(t, "H"); // high error correction tolerates the centre logo
        cand.addData(text);
        cand.make();
        qr = cand;
      } catch (e) {
        qr = null;
      }
    }
    if (!qr) return;

    var count = qr.getModuleCount();
    var quiet = 2; // tight quiet zone — the card's white padding supplies the rest
    var total = count + quiet * 2;
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var cssTarget = canvas.clientWidth || 200;
    var scale = Math.max(2, Math.floor((cssTarget * dpr) / total));
    var dim = total * scale;

    canvas.width = dim;
    canvas.height = dim;

    var ctx = canvas.getContext("2d");
    var ink = "#131b2e";

    // background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, dim, dim);

    // modules
    ctx.fillStyle = ink;
    for (var r = 0; r < count; r += 1) {
      for (var c = 0; c < count; c += 1) {
        if (qr.isDark(r, c)) {
          ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
        }
      }
    }

    drawLogo(ctx, dim, count, scale, img);
  }

  function drawLogo(ctx, dim, count, scale, img) {
    var codePx = count * scale;
    var logoSide = Math.round(codePx * 0.26);
    var pad = Math.round(scale * 1.4);
    var cx = dim / 2;
    var cy = dim / 2;
    var rOuter = logoSide / 2 + pad;

    // white knockout disc behind the photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    if (!img || !img.complete || !img.naturalWidth) return;

    // circular photo, cover-cropped
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, logoSide / 2, 0, Math.PI * 2);
    ctx.clip();
    var iw = img.naturalWidth;
    var ih = img.naturalHeight;
    var cr = faceCrop(iw, ih);
    ctx.drawImage(img, cr.sx, cr.sy, cr.side, cr.side, cx - logoSide / 2, cy - logoSide / 2, logoSide, logoSide);
    ctx.restore();

    // thin ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, logoSide / 2, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(1, scale * 0.5);
    ctx.strokeStyle = "rgba(19,27,46,0.12)";
    ctx.stroke();
    ctx.restore();
  }

  // ---- vCard ----
  function escapeV(s) {
    return String(s == null ? "" : s).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  }
  function fold(line) {
    // vCard 3.0 line folding at 75 octets
    if (line.length <= 75) return line;
    var out = line.slice(0, 75);
    var rest = line.slice(75);
    while (rest.length) {
      out += "\r\n " + rest.slice(0, 74);
      rest = rest.slice(74);
    }
    return out;
  }
  function photoB64(img) {
    try {
      if (!img || !img.complete || !img.naturalWidth) return null;
      var s = 320;
      var cv = document.createElement("canvas");
      cv.width = s;
      cv.height = s;
      var cx = cv.getContext("2d");
      var iw = img.naturalWidth, ih = img.naturalHeight;
      var cr = faceCrop(iw, ih);
      cx.drawImage(img, cr.sx, cr.sy, cr.side, cr.side, 0, 0, s, s);
      return cv.toDataURL("image/jpeg", 0.82).split(",")[1] || null;
    } catch (e) {
      return null;
    }
  }
  function buildVCard(P, img) {
    var parts = (P.name || "").trim().split(/\s+/);
    var first = parts.shift() || "";
    var last = parts.join(" ");
    var L = ["BEGIN:VCARD", "VERSION:3.0"];
    L.push("N:" + escapeV(last) + ";" + escapeV(first) + ";;;");
    L.push("FN:" + escapeV(P.name));
    if (P.org) L.push("ORG:" + escapeV(P.org));
    if (P.role) L.push("TITLE:" + escapeV(P.role));
    (P.links || []).forEach(function (lk) {
      if (!lk.href || lk.href.charAt(0) === "#") return;
      if (lk.net === "email") {
        var em = lk.href.replace(/^mailto:/, "");
        L.push("EMAIL;TYPE=INTERNET:" + escapeV(em));
      } else if (lk.net === "telegram") {
        L.push("X-SOCIALPROFILE;TYPE=telegram:" + escapeV(lk.href));
        L.push("URL:" + escapeV(lk.href));
      } else {
        L.push("X-SOCIALPROFILE;TYPE=" + lk.net + ":" + escapeV(lk.href));
        L.push("URL:" + escapeV(lk.href));
      }
    });
    if (P.url) L.push("URL:" + escapeV(P.url));
    var b64 = photoB64(img);
    if (b64) L.push("PHOTO;ENCODING=b;TYPE=JPEG:" + b64);
    L.push("END:VCARD");
    return L.map(fold).join("\r\n");
  }
  function downloadVCard(P, img) {
    var blob = new Blob([buildVCard(P, img)], { type: "text/vcard;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = (P.slug || "contact") + ".vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ---- Build ----
  function linkHTML(lk) {
    var n = NET[lk.net];
    if (!n) return "";
    var wide = lk.net === "email" ? " cnct__link--wide" : "";
    var sub = lk.handle || (lk.href && lk.href.charAt(0) !== "#" ? lk.href.replace(/^https?:\/\//, "").replace(/^mailto:/, "") : "Add link");
    return (
      '<a class="cnct__link' + wide + '" href="' + (lk.href || "#") + '"' +
      (lk.net === "email" ? "" : ' target="_blank" rel="noopener"') + ">" +
      svgFor(lk.net) +
      '<span class="net"><b>' + (lk.title || n.label) + "</b><span>" + sub + "</span></span>" +
      "</a>"
    );
  }

  function build() {
    var P = window.PERSON || {};
    injectCSS();
    var root = document.getElementById("connect");
    if (!root) return;

    var base = (typeof window !== "undefined" && window.SITE_BASE) ? window.SITE_BASE : "../";

    // order links by ORDER, keep only configured ones
    var links = [];
    ORDER.forEach(function (net) {
      var found = (P.links || []).filter(function (l) { return l.net === net; });
      found.forEach(function (l) { links.push(l); });
    });

    root.innerHTML =
      '<div class="cnct"><div class="cnct__inner">' +
      '<div class="cnct__card">' +
      '<div class="cnct__qrwrap"><canvas id="cnct-qr" class="cnct__qr"></canvas></div>' +
      '<div class="cnct__id"><h1 class="cnct__name">' + (P.name || "") + "</h1>" +
      '<div class="cnct__role">' + (P.role || "") + (P.handle ? " · <b>" + P.handle + "</b>" : "") + "</div></div>" +
      "</div>" +
      '<div class="cnct__panel">' +
      '<div class="cnct__links">' + links.map(linkHTML).join("") + "</div>" +
      '<button class="cnct__vcard" id="cnct-vcard" type="button">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>' +
      "Save to contacts</button>" +
      "</div>" +
      "</div></div>";

    // photo: drives both the QR centre and the vCard PHOTO
    var img = new Image();
    img.onload = function () { makeQR(P, img); };
    img.onerror = function () { makeQR(P, null); };
    if (P.photo) img.src = P.photo;
    else makeQR(P, null);

    document.getElementById("cnct-vcard").addEventListener("click", function () {
      downloadVCard(P, img);
    });

    window.addEventListener("resize", debounce(function () { makeQR(P, img); }, 200));
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
