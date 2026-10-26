/* UTV Produtora, versão alternativa: comportamento e animações.
   Não é preciso editar este arquivo para trocar conteúdo: use conteudo.js. */
(function () {
  'use strict';

  var C = window.UTV || { trabalhos: [] };
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var G = window.gsap;
  var ST = window.ScrollTrigger;
  var motion = !reduce && !!(G && ST);
  var lenis = null;
  if (!motion) root.classList.add('no-motion');

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function pad(n) { return String(n).padStart(2, '0'); }

  /* ---------- Hora de Londrina (vale para quem acessa de qualquer lugar) ---------- */
  var fmt = null;
  try { fmt = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }); } catch (e) { fmt = null; }
  function londrina() {
    var d = new Date();
    if (!fmt) return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() };
    var o = {};
    fmt.formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
    return { h: Number(o.hour) % 24, m: Number(o.minute), s: Number(o.second) };
  }

  /* ---------- YouTube ---------- */
  function ytId(url) {
    if (!url) return '';
    var m = String(url).match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/|live\/)([\w-]{11})/);
    if (m) return m[1];
    return /^[\w-]{11}$/.test(url) ? url : '';
  }
  function makeFrame(src, title) {
    var f = document.createElement('iframe');
    f.src = src; f.title = title || 'Vídeo';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    return f;
  }

  /* ---------- Relógios ---------- */
  var clocks = $$('[data-clock]');
  function tick() {
    var t = londrina();
    var txt = pad(t.h) + ':' + pad(t.m) + ':' + pad(t.s);
    clocks.forEach(function (el) { el.textContent = txt; });
  }
  if (clocks.length) { tick(); setInterval(tick, 1000); }

  /* ---------- Portfólio ---------- */
  var FALLBACK = ['crepusculo', 'estudio', 'palco', 'ilha', 'cidade', 'janela', 'luz-quente', 'contraluz'].map(function (n) { return 'assets/img/' + n + '.jpg'; });
  var works = $('[data-works]');
  var filters = $('[data-filters]');

  function markFeature() {
    var first = true;
    $$('.work', works).forEach(function (w) {
      w.classList.toggle('is-feature', !w.hidden && first);
      if (!w.hidden) first = false;
    });
  }
  function applyFilter(cat) {
    $$('button', filters).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cat === cat)); });
    var items = $$('.work', works);
    var state = motion && window.Flip ? window.Flip.getState(items) : null;
    items.forEach(function (w) { w.hidden = !(cat === 'Todos' || w.dataset.cat === cat); });
    markFeature();
    if (state) {
      window.Flip.from(state, {
        duration: 0.8, ease: 'power3.inOut', absolute: true, nested: true,
        onEnter: function (els) { return G.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.2 }); },
        onComplete: function () { ST.refresh(); }
      });
    } else if (ST) { ST.refresh(); }
  }
  if (works && filters) {
    (C.trabalhos || []).forEach(function (t, i) {
      var id = ytId(t.video);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'work';
      b.dataset.cat = t.categoria || '';
      b.dataset.video = t.video || '';
      b.dataset.title = t.titulo || '';
      b.innerHTML = '<span class="work__media"><img alt="" loading="lazy"></span>' +
        '<span class="work__umd"><span class="work__title"></span><span class="work__info"></span></span>';
      $('img', b).src = t.imagem || (id ? 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg' : FALLBACK[i % FALLBACK.length]);
      $('.work__title', b).textContent = t.titulo || '';
      $('.work__info', b).textContent = [t.cliente, t.ano].filter(Boolean).join(', ');
      works.appendChild(b);
    });
    var cats = ['Todos'];
    (C.trabalhos || []).forEach(function (t) { if (t.categoria && cats.indexOf(t.categoria) < 0) cats.push(t.categoria); });
    cats.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.dataset.cat = c; b.textContent = c;
      b.setAttribute('aria-pressed', String(c === 'Todos'));
      filters.appendChild(b);
    });
    markFeature();
    filters.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) applyFilter(b.dataset.cat); });
  }

  /* ---------- Janela de vídeo ---------- */
  var lb = $('[data-lightbox]');
  function openVideo(url, title) {
    if (!lb) return;
    $('#lightbox-title', lb).textContent = title || '';
    var screen = $('[data-screen]', lb);
    screen.innerHTML = '';
    var id = ytId(url);
    if (id) screen.appendChild(makeFrame('https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0', title));
    else { var p = document.createElement('p'); p.className = 'placeholder'; p.textContent = '[Cole o link do YouTube deste vídeo em conteudo.js]'; screen.appendChild(p); }
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    if (lenis) lenis.stop();
    if (motion) {
      G.fromTo(lb, { clipPath: 'inset(50% 0% 50% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.out' });
      G.fromTo($('.lightbox__inner', lb), { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.15, ease: 'power3.out' });
    }
  }
  if (lb) {
    lb.addEventListener('close', function () { $('[data-screen]', lb).innerHTML = ''; if (lenis) lenis.start(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }
  document.addEventListener('click', function (e) {
    var v = e.target.closest('[data-video]');
    if (v) { openVideo(v.dataset.video === 'showreel' ? C.showreel : v.dataset.video, v.dataset.title); return; }
    if (e.target.closest('[data-close]') && lb) lb.close();
  });

  /* ---------- Canal: live, playlist e cabeçote da grade ---------- */
  var live = $('[data-live]');
  if (live && C.youtubeCanalId) {
    var ph = $('.placeholder', live); if (ph) ph.remove();
    live.insertBefore(makeFrame('https://www.youtube.com/embed/live_stream?channel=' + encodeURIComponent(C.youtubeCanalId) + '&autoplay=1&mute=1', 'Canal UTV ao vivo'), live.firstChild);
  }
  var pl = $('[data-playlist]');
  if (pl && C.playlistReprises) {
    pl.innerHTML = '';
    pl.appendChild(makeFrame('https://www.youtube-nocookie.com/embed/videoseries?list=' + encodeURIComponent(C.playlistReprises), 'Reprises do Canal UTV'));
  }
  var now = $('[data-now]');
  var elapsed = $('[data-elapsed]');
  var slots = $$('[data-slot]');
  function placeNow() {
    if (!now) return;
    var t = londrina();
    var pct = (t.h * 60 + t.m) / 1440 * 100;
    now.style.left = pct.toFixed(2) + '%';
    if (elapsed) elapsed.style.width = pct.toFixed(2) + '%';
    var tag = $('.timeline__tag', now);
    tag.textContent = 'Agora ' + pad(t.h) + ':' + pad(t.m);
    tag.classList.toggle('is-start', pct < 6);
    tag.classList.toggle('is-end', pct > 94);
    var cur = Math.floor(t.h / 6);
    slots.forEach(function (li, i) { li.classList.toggle('is-now', i === cur); });
  }
  placeNow();
  if (now) setInterval(placeNow, 60000);

  /* ---------- Navegação ---------- */
  var nav = $('.nav');
  var bar = $('.progress');
  var themed = $$('[data-nav]');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    if (nav) {
      var theme = 'dark';
      for (var i = 0; i < themed.length; i++) {
        var r = themed[i].getBoundingClientRect();
        if (r.top <= 36 && r.bottom > 36) { theme = themed[i].dataset.nav; break; }
      }
      nav.classList.toggle('on-light', theme === 'light');
      nav.classList.toggle('is-scrolled', y > 60);
      if (Math.abs(y - lastY) > 4) { nav.classList.toggle('is-hidden', y > lastY && y > 240); lastY = y; }
    }
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu no celular ---------- */
  var menu = $('#menu');
  var openBtn = $('.nav .nav__toggle');
  function setMenu(open) {
    if (!menu || !openBtn) return;
    menu.classList.toggle('is-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    if (open) { var c = $('.menu__close', menu); if (c) c.focus(); } else { openBtn.focus({ preventScroll: true }); }
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  if (menu) {
    menu.addEventListener('click', function (e) { if (e.target.closest('.menu__close') || e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
  }

  /* ---------- Aviso de rolagem quando a pessoa fica parada ---------- */
  var hint = $('[data-idle-hint]');
  if (hint) {
    var hintText = $('[data-idle-text]', hint);
    if (hintText && window.matchMedia('(pointer: coarse)').matches) hintText.textContent = 'Deslize para continuar';
    var idleTimer = null;
    var showHint = function () {
      var nearEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 320;
      var busy = (lb && lb.open) || (menu && menu.classList.contains('is-open'));
      if (!nearEnd && !busy) hint.classList.add('is-visible');
    };
    var resetIdle = function () {
      hint.classList.remove('is-visible');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(showHint, 5000);
    };
    ['scroll', 'wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) { window.addEventListener(ev, resetIdle, { passive: true }); });
    resetIdle();
  }

  /* ---------- Sem animação: para aqui ---------- */
  if (!motion) return;

  G.registerPlugin.apply(G, [ST, window.SplitText, window.Flip].filter(Boolean));
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ST.update);
    G.ticker.add(function (t) { lenis.raf(t * 1000); });
    G.ticker.lagSmoothing(0);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var href = a.getAttribute('href');
    var target = href === '#' ? null : $(href);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.6 }); else target.scrollIntoView({ behavior: 'smooth' });
  });

  var Split = window.SplitText;
  function revealLines(el) {
    if (!Split) return;
    Split.create(el, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: function (self) {
        return G.from(self.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
      }
    });
  }
  function wipeLowerThird(lt, tl, at) {
    var b = $('b', lt), s = $('span', lt);
    tl.fromTo(b, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.out' }, at)
      .fromTo(s, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.out' }, at + 0.2);
  }

  /* ---------- Entrada: os monitores ligam um a um ---------- */
  function bootIn() {
    var tl = G.timeline();
    var tiles = [$('[data-pgm]')].concat($$('[data-tile]')).filter(function (t) { return t && t.offsetParent !== null; });
    tiles.forEach(function (t, i) {
      tl.fromTo(t, { opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.05 }, { opacity: 0.25, duration: 0.05 }, { opacity: 1, duration: 0.12 }] }, 0.1 + i * 0.09);
    });
    var title = $('[data-hero-title]');
    if (title && Split) {
      var s = Split.create(title, { type: 'lines,words,chars', mask: 'lines' });
      tl.from(s.chars, { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.03 }, 0.5);
    }
    var lt = $('[data-hero-lt]');
    if (lt) wipeLowerThird(lt, tl, 0.9);
    $$('.ch-hero [data-fade]').forEach(function (el) { tl.from(el, { opacity: 0, y: 24, duration: 1, ease: 'power3.out' }, 0.6); });
    var player = $('[data-live]');
    if (player) tl.from(player, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'expo.inOut' }, 0.3);
  }

  /* ---------- Animações de rolagem ---------- */
  function scrollScenes() {
    var mm = G.matchMedia();

    // Abertura: a câmera "corta" para o PGM, que ocupa a tela inteira
    var stage = $('[data-mv-stage]'), grid = $('[data-mv-grid]'), pgm = $('[data-pgm]');
    if (stage && grid && pgm) {
      var others = $$('[data-tile]', grid);
      var content = $('.pgm__content', pgm);
      // Quanto ampliar: em tela deitada a imagem cobre a tela toda; em celular em pé, só a largura.
      var zoom = function () {
        var vw = stage.clientWidth, vh = stage.clientHeight;
        var pw = pgm.offsetWidth, ph = pgm.offsetHeight;
        var s = vw / vh < 1 ? vw / pw : Math.max(vw / pw, vh / ph) * 1.002;
        var cx = pgm.offsetLeft + pw / 2, cy = pgm.offsetTop + ph / 2;
        return {
          s: s, x: vw / 2 - grid.offsetLeft - s * cx, y: vh / 2 - grid.offsetTop - s * cy,
          // parte da imagem que sai da tela depois do zoom: o texto recua essa medida para nunca ser cortado
          ix: Math.max(0, (pw - vw / s) / 2), iy: Math.max(0, (ph - vh / s) / 2)
        };
      };
      G.timeline({ scrollTrigger: { trigger: stage, start: 'top top', end: '+=130%', pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true } })
        .fromTo(grid, { x: 0, y: 0, scale: 1 }, { x: function () { return zoom().x; }, y: function () { return zoom().y; }, scale: function () { return zoom().s; }, ease: 'power2.inOut', duration: 1, immediateRender: false }, 0)
        .fromTo(others, { opacity: 1 }, { opacity: 0, duration: 0.35, immediateRender: false }, 0)
        .fromTo(content, { left: 0, right: 0, top: 0, bottom: 0 }, { left: function () { return zoom().ix; }, right: function () { return zoom().ix; }, top: function () { return zoom().iy; }, bottom: function () { return zoom().iy; }, ease: 'power2.inOut', duration: 1, immediateRender: false }, 0)
        .fromTo($('.umd', pgm), { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 0.1)
        .fromTo(pgm, { outlineColor: 'rgba(224,38,47,1)' }, { outlineColor: 'rgba(224,38,47,0)', duration: 0.4, immediateRender: false }, 0.5)
        .fromTo('[data-reel-btn]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2 }, 0.82)
        .to({}, { duration: 0.15 });
    }

    // Fundo das cenas mais lento que a página
    $$('[data-parallax]').forEach(function (el) {
      G.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    $$('[data-lines]').forEach(revealLines);
    $$('[data-chars]').forEach(function (el) {
      if (!Split) return;
      var s = Split.create(el, { type: 'lines,words,chars', mask: 'lines' });
      G.from(s.chars, { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.04, scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
    });
    $$('[data-fade]').forEach(function (el) {
      if (el.closest('.ch-hero')) return;
      G.from(el, { opacity: 0, y: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    // Portfólio: o quadro abre e a foto acompanha a rolagem; a tarja sobe junto
    if (works) {
      $$('.work', works).forEach(function (w) {
        var media = $('.work__media', w), img = $('img', media), umd = $('.work__umd', w);
        var feature = w.classList.contains('is-feature');
        G.fromTo(media, { clipPath: feature ? 'inset(14% 12% 14% 12%)' : 'inset(16% 14% 16% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: w, start: 'top bottom', end: feature ? 'top 30%' : 'top 45%', scrub: 0.5 } });
        G.fromTo(img, { scale: 1.35, yPercent: -5 }, { scale: 1.15, yPercent: 5, ease: 'none', scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
        G.fromTo(umd, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: media, start: 'bottom bottom', end: 'bottom 72%', scrub: 0.5 } });
      });
    }

    // Serviços: a luz de "no ar" passa de uma etapa para a outra
    var rd = $('[data-rundown]');
    if (rd) {
      var steps = $$('[data-step]', rd);
      var light = function (i) { steps.forEach(function (s, k) { s.classList.toggle('is-live', k === i); }); };
      light(0);
      mm.add('(min-width: 861px)', function () {
        G.fromTo('[data-rundown-fill]', { scaleX: 0 }, {
          scaleX: 1, ease: 'none',
          scrollTrigger: {
            trigger: rd, start: 'center center', end: function () { return '+=' + Math.round(window.innerHeight * 0.8 * steps.length); },
            pin: true, scrub: 0.4, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: function (self) { light(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999))); }
          }
        });
      });
      mm.add('(max-width: 860px)', function () {
        G.fromTo('[data-rundown-fill]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: rd, start: 'top 60%', end: 'bottom 60%', scrub: true } });
        steps.forEach(function (s, i) { ST.create({ trigger: s, start: 'top 60%', end: 'bottom 60%', onToggle: function (self) { if (self.isActive) light(i); } }); });
      });
    }

    // Placa "NO AR": acende piscando quando aparece
    var sign = $('[data-sign]');
    if (sign) {
      var on = function () { sign.classList.add('is-on'); }, off = function () { sign.classList.remove('is-on'); };
      off();
      ST.create({
        trigger: sign, start: 'top 75%',
        onEnter: function () { G.timeline().call(on).call(off, null, 0.07).call(on, null, 0.14).call(off, null, 0.2).call(on, null, 0.42); },
        onLeaveBack: off
      });
    }

    // Bastidores: faixa horizontal
    var bs = $('[data-backstage]'), track = $('[data-backstage-track]');
    if (bs && track) {
      var viewport = $('.backstage__viewport', bs);
      bs.classList.add('is-pinned');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var hz = G.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: viewport, start: 'center center', end: function () { return '+=' + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
      $$('[data-shot-img]', track).forEach(function (img) {
        G.fromTo(img, { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: hz, start: 'left right', end: 'right left', scrub: true } });
      });
    }

    $$('[data-clip]').forEach(function (el) {
      G.fromTo(el, { clipPath: 'inset(12% 10% 12% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 40%', scrub: 0.5 } });
    });
    $$('[data-inner-parallax]').forEach(function (img) {
      G.fromTo(img, { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.14, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Clientes: letreiro de telejornal, mais rápido quando a página rola
    var tk = $('[data-ticker]'), row = $('[data-ticker-row]');
    if (tk && row) {
      var items = $$('li', row);
      for (var k = 0; k < 2; k++) items.forEach(function (li) { var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); row.appendChild(c); });
      tk.classList.add('is-moving');
      var w = row.scrollWidth / 3, x = 0, visible = false;
      window.addEventListener('resize', function () { w = row.scrollWidth / 3; });
      ST.create({ trigger: tk, start: 'top bottom', end: 'bottom top', onToggle: function (self) { visible = self.isActive; } });
      G.ticker.add(function (time, delta) {
        if (!visible) return;
        var v = lenis ? Math.abs(lenis.velocity) : 0;
        x -= (0.06 + Math.min(v, 60) * 0.012) * delta;
        if (x <= -w) x += w;
        G.set(row, { x: x });
      });
      G.from('.ticker__label', { xPercent: -100, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: tk, start: 'top 85%', once: true } });
    }

    // Tarjas de contato e de "onde assistir": entram uma a uma
    $$('[data-lts]').forEach(function (box) {
      var tl = G.timeline({ scrollTrigger: { trigger: box, start: 'top 85%', toggleActions: 'play none none reverse' } });
      $$('.lt', box).forEach(function (lt, i) { wipeLowerThird(lt, tl, i * 0.18); });
    });

    // Grade do canal
    var rule = $('[data-rule]');
    if (rule) {
      G.from(rule, { scaleX: 0, ease: 'none', scrollTrigger: { trigger: rule, start: 'top 85%', end: 'top 55%', scrub: true } });
      G.from('[data-slot]', { opacity: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: rule, start: 'top 80%', once: true } });
      if (now) G.from(now, { opacity: 0, y: -14, duration: 1, ease: 'power3.out', delay: 0.5, scrollTrigger: { trigger: rule, start: 'top 80%', once: true } });
    }

    ST.sort();
    ST.refresh();
  }

  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fontsReady.then(function () {
    scrollScenes();
    bootIn();
    if (location.hash) {
      var t = $(location.hash);
      if (t && lenis) setTimeout(function () { lenis.scrollTo(t, { immediate: true }); }, 60);
    }
    window.addEventListener('load', function () { ST.refresh(); });
  });
})();
