/* ══════════════════════════════════════════════════════
   SIGNFORGE — app.js
   Modular, documented, production-ready JS
══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────────
     FONT REGISTRY — 24 curated typefaces across 4 moods
  ──────────────────────────────────────────────────── */
  const FONTS = [
    // ── ELEGANT (7) ────────────────────────────────────
    { name: 'Great Vibes',       category: 'elegant',  style: 'cursive',     slant: false },
    { name: 'Alex Brush',        category: 'elegant',  style: 'cursive',     slant: false },
    { name: 'Allura',            category: 'elegant',  style: 'cursive',     slant: false },
    { name: 'Parisienne',        category: 'elegant',  style: 'cursive',     slant: false },
    { name: 'Tangerine',         category: 'elegant',  style: 'cursive',     slant: false },
    { name: 'WindSong',          category: 'elegant',  style: 'cursive',     slant: false },
    { name: 'Pinyon Script',     category: 'elegant',  style: 'cursive',     slant: false },

    // ── BOLD (6) ────────────────────────────────────────
    { name: 'Pacifico',          category: 'bold',     style: 'cursive',     slant: false },
    { name: 'Cookie',            category: 'bold',     style: 'cursive',     slant: false },
    { name: 'Playball',          category: 'bold',     style: 'cursive',     slant: false },
    { name: 'Rouge Script',      category: 'bold',     style: 'cursive',     slant: false },
    { name: 'Lobster',           category: 'bold',     style: 'display',     slant: false },
    { name: 'Dancing Script',    category: 'bold',     style: 'cursive',     slant: false },

    // ── CASUAL (5) ─────────────────────────────────────
    { name: 'Satisfy',           category: 'casual',   style: 'handwriting', slant: true  },
    { name: 'Kalam',             category: 'casual',   style: 'handwriting', slant: true  },
    { name: 'Shadows Into Light',category: 'casual',   style: 'handwriting', slant: true  },
    { name: 'Covered By Your Grace', category: 'casual', style: 'handwriting', slant: true },
    { name: 'Marck Script',      category: 'casual',   style: 'handwriting', slant: true  },

    // ── ARTISTIC (6) ───────────────────────────────────
    { name: 'Caveat',            category: 'artistic', style: 'handwriting', slant: false },
    { name: 'Kaushan Script',    category: 'artistic', style: 'cursive',     slant: false },
    { name: 'Mr Dafoe',          category: 'artistic', style: 'cursive',     slant: false },
    { name: 'Qwigley',           category: 'artistic', style: 'cursive',     slant: false },
    { name: 'Euphoria Script',   category: 'artistic', style: 'cursive',     slant: false },
    { name: 'Pacifico',          category: 'artistic', style: 'cursive',     slant: false },
  ];

  // Deduplicate by name + category
  const uniqueFonts = Array.from(
    new Map(FONTS.map(f => [f.name + f.category, f])).values()
  );

  /* ────────────────────────────────────────────────────
     STATE
  ──────────────────────────────────────────────────── */
  const state = {
    name:      'Alexandra',
    color:     '#0f172a',
    bg:        '#ffffff',
    size:      60,
    filter:    'all',
    search:    '',
    lightFont: null,   // currently open in lightbox
    lightCanvas: null,
    showcaseIdx: 0,
    isDark:    true,
  };

  /* ────────────────────────────────────────────────────
     DOM REFS
  ──────────────────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const el = {
    nav:          $('mainNav'),
    nameInput:    $('nameInput'),
    colorInput:   $('colorInput'),
    bgInput:      $('bgInput'),
    sizeInput:    $('sizeInput'),
    sizeVal:      $('sizeVal'),
    generateBtn:  $('generateBtn'),
    grid:         $('signatureGrid'),
    moodBtns:     document.querySelectorAll('.mood-btn'),
    fontSearch:   $('fontSearch'),
    heroCanvas:   $('heroCanvas'),
    heroPreview:  $('heroPreview'),
    showcaseName: $('showcaseFontName'),
    scPrev:       $('scPrev'),
    scNext:       $('scNext'),
    scDots:       $('scDots'),
    themeToggle:  $('themeToggle'),
    lightbox:     $('lightbox'),
    lbBackdrop:   $('lbBackdrop'),
    lbClose:      $('lbClose'),
    lbCanvas:     $('lbCanvas'),
    lbFontName:   $('lbFontName'),
    lbFontFamily: $('lbFontFamily'),
    lbMoodBadge:  $('lbMoodBadge'),
    lbPng:        $('lbPng'),
    lbJpg:        $('lbJpg'),
    lbCopy:       $('lbCopy'),
    toast:        $('toast'),
    toastMsg:     $('toastMsg'),
    visibleCount: $('visibleCount'),
    activeMoodChip: $('activeMoodChip'),
    inkSwatches:  $('inkSwatches'),
    bgSwatches:   $('bgSwatches'),
    clearName:    $('clearName'),
    cursorGlow:   $('cursorGlow'),
    particles:    $('particles'),
    navLinks:     $('navLinks'),
    navBurger:    $('navBurger'),
    controlPanel: $('controlPanel'),
  };

  /* ════════════════════════════════════════════════════
     PARTICLES
  ════════════════════════════════════════════════════ */
  function spawnParticles() {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: 0;
        --dur: ${6 + Math.random() * 10}s;
        --delay: ${Math.random() * 8}s;
      `;
      el.particles.appendChild(p);
    }
  }

  /* ════════════════════════════════════════════════════
     CURSOR GLOW
  ════════════════════════════════════════════════════ */
  function initCursor() {
    let visible = false;
    document.addEventListener('mousemove', e => {
      el.cursorGlow.style.left = e.clientX + 'px';
      el.cursorGlow.style.top  = e.clientY + 'px';
      if (!visible) { el.cursorGlow.style.opacity = '1'; visible = true; }
    });
    document.addEventListener('mouseleave', () => { el.cursorGlow.style.opacity = '0'; visible = false; });
  }

  /* ════════════════════════════════════════════════════
     THEME TOGGLE
  ════════════════════════════════════════════════════ */
  function initTheme() {
    el.themeToggle.addEventListener('click', () => {
      state.isDark = !state.isDark;
      document.body.classList.toggle('light-mode', !state.isDark);
      el.themeToggle.querySelector('i').className = state.isDark ? 'fas fa-moon' : 'fas fa-sun';
      regenerateAllCanvases();
    });
  }

  /* ════════════════════════════════════════════════════
     NAVIGATION
  ════════════════════════════════════════════════════ */
  function initNav() {
    // Scroll behaviour
    const observer = new IntersectionObserver(
      ([e]) => el.nav.classList.toggle('scrolled', !e.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(document.querySelector('.hero'));

    // Mobile burger
    el.navBurger.addEventListener('click', () => {
      el.navLinks.classList.toggle('open');
    });

    // Close on link click
    el.navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => el.navLinks.classList.remove('open'));
    });

    // Scroll spy
    window.addEventListener('scroll', () => {
      el.controlPanel.classList.toggle('elevated', window.scrollY > 300);
    });
  }

  /* ════════════════════════════════════════════════════
     HERO SHOWCASE CAROUSEL
  ════════════════════════════════════════════════════ */
  function initShowcase() {
    // Build dot indicators
    uniqueFonts.slice(0, 12).forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'sc-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Showcase font ${i + 1}`);
      dot.addEventListener('click', () => goToShowcase(i));
      el.scDots.appendChild(dot);
    });

    el.scPrev.addEventListener('click', () => {
      const max = Math.min(12, uniqueFonts.length);
      goToShowcase((state.showcaseIdx - 1 + max) % max);
    });
    el.scNext.addEventListener('click', () => {
      const max = Math.min(12, uniqueFonts.length);
      goToShowcase((state.showcaseIdx + 1) % max);
    });

    // Auto-rotate every 3s
    let autoTimer = setInterval(() => {
      const max = Math.min(12, uniqueFonts.length);
      goToShowcase((state.showcaseIdx + 1) % max);
    }, 3000);

    [el.scPrev, el.scNext].forEach(btn =>
      btn.addEventListener('click', () => {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => {
          const max = Math.min(12, uniqueFonts.length);
          goToShowcase((state.showcaseIdx + 1) % max);
        }, 3000);
      })
    );

    renderShowcaseCanvas();
  }

  function goToShowcase(idx) {
    state.showcaseIdx = idx;
    // Update dots
    document.querySelectorAll('.sc-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
    renderShowcaseCanvas();
  }

  function renderShowcaseCanvas() {
    const font = uniqueFonts[state.showcaseIdx] || uniqueFonts[0];
    const name = state.name || 'Alexandra';
    const canvas = el.heroCanvas;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = state.color;
    ctx.font = `${state.size + 8}px "${font.name}", ${font.style}, cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    el.showcaseName.textContent = font.name;
    el.heroPreview.textContent = name;
  }

  /* ════════════════════════════════════════════════════
     CANVAS DRAWING ENGINE
  ════════════════════════════════════════════════════ */
  function drawSignature(canvas, font, name, color, bg, size) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Background
    if (bg === 'transparent') {
      ctx.clearRect(0, 0, W, H);
    } else {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
    }

    // Paper grain for casual & artistic
    if (font.category === 'casual' || font.category === 'artistic') {
      ctx.globalAlpha = 0.04;
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = '#888';
        ctx.fillRect(
          Math.random() * W,
          Math.random() * H,
          1 + Math.random(),
          1
        );
      }
      ctx.globalAlpha = 1;
    }

    // Ink stroke with shadow for elegant
    if (font.category === 'elegant') {
      ctx.shadowColor = color;
      ctx.shadowBlur = 3;
    }

    ctx.fillStyle = color;
    ctx.font = `${size}px "${font.name}", ${font.style}, cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (font.slant) {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      const angle = (Math.random() * 0.04) - 0.02;
      ctx.rotate(angle);
      ctx.fillText(name, 0, 0);
      ctx.restore();
    } else {
      ctx.fillText(name, W / 2, H / 2);
    }

    ctx.shadowBlur = 0;
  }

  /* ════════════════════════════════════════════════════
     CARD FACTORY
  ════════════════════════════════════════════════════ */
  function createCard(font, idx) {
    const { name, color, bg, size } = state;

    const card = document.createElement('div');
    card.className = 'sig-card';
    card.dataset.category = font.category;
    card.dataset.fontname  = font.name.toLowerCase();
    card.style.animationDelay = `${idx * 40}ms`;

    // Canvas wrapper
    const wrap = document.createElement('div');
    wrap.className = 'card-canvas-wrap';

    const canvas = document.createElement('canvas');
    canvas.width  = 400;
    canvas.height = 130;

    // Hover overlay with expand icon
    const overlay = document.createElement('div');
    overlay.className = 'card-hover-overlay';
    const overlayIcon = document.createElement('div');
    overlayIcon.className = 'overlay-icon';
    overlayIcon.innerHTML = '<i class="fas fa-expand-alt"></i>';
    overlay.appendChild(overlayIcon);

    wrap.appendChild(canvas);
    wrap.appendChild(overlay);

    // Draw
    drawSignature(canvas, font, name, color, bg, size);

    // Meta row
    const meta = document.createElement('div');
    meta.className = 'card-meta';

    const fontName = document.createElement('div');
    fontName.className = 'card-font-name';
    fontName.textContent = font.name;

    const badge = document.createElement('div');
    badge.className = `card-category-badge badge-${font.category}`;
    const icons = { elegant:'crown', bold:'fire', casual:'feather', artistic:'palette' };
    badge.innerHTML = `<i class="fas fa-${icons[font.category]}"></i> ${font.category}`;

    meta.appendChild(fontName);
    meta.appendChild(badge);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const pngBtn = document.createElement('button');
    pngBtn.className = 'card-dl-btn btn-png';
    pngBtn.innerHTML = '<i class="fas fa-download"></i> PNG';

    const jpgBtn = document.createElement('button');
    jpgBtn.className = 'card-dl-btn btn-jpg';
    jpgBtn.innerHTML = '<i class="fas fa-image"></i> JPG';

    // Download handlers
    pngBtn.addEventListener('click', e => {
      e.stopPropagation();
      downloadCanvas(canvas, name, font.name, 'png');
    });
    jpgBtn.addEventListener('click', e => {
      e.stopPropagation();
      downloadCanvas(canvas, name, font.name, 'jpg');
    });

    actions.appendChild(pngBtn);
    actions.appendChild(jpgBtn);

    card.appendChild(wrap);
    card.appendChild(meta);
    card.appendChild(actions);

    // Click → lightbox
    card.addEventListener('click', () => openLightbox(font, canvas));

    return card;
  }

  /* ════════════════════════════════════════════════════
     GENERATE / RE-GENERATE
  ════════════════════════════════════════════════════ */
  async function generateSignatures() {
    const rawName = el.nameInput.value.trim();
    if (!rawName) {
      showToast('Please enter your name first', true);
      el.nameInput.focus();
      return;
    }

    state.name = rawName;

    // Show skeleton
    showSkeleton();

    // Ensure fonts loaded
    await document.fonts.ready;
    await tick(60);

    // Build cards
    el.grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    uniqueFonts.forEach((font, idx) => {
      fragment.appendChild(createCard(font, idx));
    });
    el.grid.appendChild(fragment);

    updateVisibleCount();
    applyFilter();
    renderShowcaseCanvas();
  }

  function regenerateAllCanvases() {
    const cards = el.grid.querySelectorAll('.sig-card');
    cards.forEach(card => {
      const fontName = card.querySelector('.card-font-name')?.textContent;
      const font = uniqueFonts.find(f => f.name === fontName);
      if (!font) return;
      const canvas = card.querySelector('canvas');
      if (!canvas) return;
      drawSignature(canvas, font, state.name, state.color, state.bg, state.size);
    });
    renderShowcaseCanvas();
    if (el.lbCanvas && state.lightFont) {
      drawLightboxCanvas();
    }
  }

  function showSkeleton() {
    const count = uniqueFonts.length;
    const loading = document.createElement('div');
    loading.className = 'loading-grid';
    loading.id = 'loadingGrid';
    for (let i = 0; i < count; i++) {
      const sk = document.createElement('div');
      sk.className = 'skeleton-card';
      loading.appendChild(sk);
    }
    el.grid.innerHTML = '';
    el.grid.appendChild(loading);
  }

  /* ════════════════════════════════════════════════════
     FILTER & SEARCH
  ════════════════════════════════════════════════════ */
  function applyFilter() {
    const cards = el.grid.querySelectorAll('.sig-card');
    let visible = 0;
    const search = state.search.toLowerCase();

    cards.forEach(card => {
      const catMatch = state.filter === 'all' || card.dataset.category === state.filter;
      const searchMatch = !search || card.dataset.fontname.includes(search);
      const show = catMatch && searchMatch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    // Remove old empty state
    const old = el.grid.querySelector('.empty-state');
    if (old) old.remove();

    if (visible === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = `
        <i class="fas fa-pen-slash"></i>
        <h3>No signatures found</h3>
        <p>Try a different mood or clear the search</p>
      `;
      el.grid.appendChild(empty);
    }

    updateVisibleCount(visible);
  }

  function updateVisibleCount(count) {
    const n = count !== undefined ? count : uniqueFonts.length;
    if (el.visibleCount) {
      el.visibleCount.textContent = `${n} signature${n !== 1 ? 's' : ''}`;
    }
  }

  /* ════════════════════════════════════════════════════
     LIGHTBOX
  ════════════════════════════════════════════════════ */
  function openLightbox(font, sourceCanvas) {
    state.lightFont   = font;
    state.lightCanvas = sourceCanvas;

    el.lbFontName.textContent   = font.name;
    el.lbFontFamily.textContent = font.name;
    el.lbMoodBadge.textContent  = font.category;
    el.lbMoodBadge.className    = `lb-mood-badge`;

    drawLightboxCanvas();

    el.lightbox.classList.add('open');
    el.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function drawLightboxCanvas() {
    const font = state.lightFont;
    if (!font) return;
    drawSignature(el.lbCanvas, font, state.name, state.color, state.bg, state.size + 10);
  }

  function closeLightbox() {
    el.lightbox.classList.remove('open');
    el.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.lightFont   = null;
    state.lightCanvas = null;
  }

  /* ════════════════════════════════════════════════════
     DOWNLOAD ENGINE
  ════════════════════════════════════════════════════ */
  function downloadCanvas(canvas, name, fontName, ext) {
    const offscreen = document.createElement('canvas');
    offscreen.width  = 800;
    offscreen.height = 260;
    const ctx = offscreen.getContext('2d');

    const font = uniqueFonts.find(f => f.name === fontName) || uniqueFonts[0];

    // Draw high-res version
    if (state.bg === 'transparent' && ext === 'png') {
      ctx.clearRect(0, 0, offscreen.width, offscreen.height);
    } else {
      ctx.fillStyle = state.bg === 'transparent' ? '#ffffff' : state.bg;
      ctx.fillRect(0, 0, offscreen.width, offscreen.height);
    }

    ctx.fillStyle = state.color;
    ctx.font = `${state.size * 1.8}px "${fontName}", cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, offscreen.width / 2, offscreen.height / 2);

    try {
      const a = document.createElement('a');
      const safeName = name.replace(/\s+/g, '_');
      const safeFont = fontName.replace(/\s+/g, '_');
      a.download = `${safeName}_${safeFont}_SignForge.${ext}`;
      a.href = offscreen.toDataURL(ext === 'jpg' ? 'image/jpeg' : 'image/png', 0.95);
      a.click();
      showToast(`${ext.toUpperCase()} downloaded — ${fontName}`);
    } catch {
      showToast('Download failed. Try again.', true);
    }
  }

  /* ════════════════════════════════════════════════════
     TOAST
  ════════════════════════════════════════════════════ */
  let toastTimer = null;
  function showToast(msg, isError = false) {
    el.toastMsg.textContent = msg;
    el.toast.querySelector('.toast-icon').style.color = isError ? '#e66b8a' : '#c9a96e';
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), 3000);
  }

  /* ════════════════════════════════════════════════════
     SWATCH HELPERS
  ════════════════════════════════════════════════════ */
  function initSwatches() {
    // Ink swatches
    el.inkSwatches.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        el.inkSwatches.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        state.color = sw.dataset.color;
        el.colorInput.value = state.color.startsWith('#') ? state.color : '#0f172a';
        regenerateAllCanvases();
      });
    });

    el.colorInput.addEventListener('input', () => {
      state.color = el.colorInput.value;
      el.inkSwatches.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      regenerateAllCanvases();
    });

    // BG swatches
    el.bgSwatches.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        el.bgSwatches.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        state.bg = sw.dataset.color;
        el.bgInput.value = state.bg.startsWith('#') ? state.bg : '#ffffff';
        regenerateAllCanvases();
      });
    });

    el.bgInput.addEventListener('input', () => {
      state.bg = el.bgInput.value;
      el.bgSwatches.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      regenerateAllCanvases();
    });
  }

  /* ════════════════════════════════════════════════════
     EVENT LISTENERS
  ════════════════════════════════════════════════════ */
  function bindEvents() {
    // Name input
    el.nameInput.addEventListener('input', () => {
      state.name = el.nameInput.value;
      el.heroPreview.textContent = state.name || 'Reimagined.';
      renderShowcaseCanvas();
    });

    el.nameInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') generateSignatures();
    });

    // Clear name
    el.clearName.addEventListener('click', () => {
      el.nameInput.value = '';
      state.name = '';
      el.nameInput.focus();
    });

    // Size slider
    el.sizeInput.addEventListener('input', () => {
      state.size = parseInt(el.sizeInput.value, 10);
      el.sizeVal.textContent = state.size + 'px';
      regenerateAllCanvases();
    });

    // Generate button
    el.generateBtn.addEventListener('click', generateSignatures);

    // Mood filters
    el.moodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.moodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.filter = btn.dataset.filter;
        const label = btn.textContent.trim().replace(/\d+/g, '').trim();
        if (el.activeMoodChip) el.activeMoodChip.textContent = label;
        applyFilter();
      });
    });

    // Font search
    el.fontSearch.addEventListener('input', () => {
      state.search = el.fontSearch.value;
      applyFilter();
    });

    // Lightbox controls
    el.lbClose.addEventListener('click', closeLightbox);
    el.lbBackdrop.addEventListener('click', closeLightbox);

    el.lbPng.addEventListener('click', () => {
      if (state.lightFont) downloadCanvas(el.lbCanvas, state.name, state.lightFont.name, 'png');
    });
    el.lbJpg.addEventListener('click', () => {
      if (state.lightFont) downloadCanvas(el.lbCanvas, state.name, state.lightFont.name, 'jpg');
    });
    el.lbCopy.addEventListener('click', () => {
      if (state.lightFont) {
        navigator.clipboard?.writeText(`Font: ${state.lightFont.name} | Style: ${state.lightFont.category}`)
          .then(() => showToast('Style info copied to clipboard!'))
          .catch(() => showToast('Could not copy', true));
      }
    });

    // Escape key closes lightbox
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ════════════════════════════════════════════════════
     UTILITIES
  ════════════════════════════════════════════════════ */
  function tick(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ════════════════════════════════════════════════════
     INTERSECTION OBSERVER — card reveal on scroll
  ════════════════════════════════════════════════════ */
  function initScrollReveal() {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach((card, i) => {
      card.style.cssText += `animation: fadeSlideUp 0.5s ease ${i * 80}ms both; animation-play-state: paused;`;
      revealObs.observe(card);
    });
  }

  /* ════════════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════════════ */
  async function init() {
    spawnParticles();
    initCursor();
    initNav();
    initTheme();
    initSwatches();
    bindEvents();
    initScrollReveal();

    // Sync initial values
    el.nameInput.value = state.name;
    el.sizeVal.textContent = state.size + 'px';
    el.heroPreview.textContent = state.name;

    // Load fonts then generate
    await document.fonts.ready;
    initShowcase();
    generateSignatures();
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
