/**
 * ROBO//NEWS — Main Application
 *
 * Video field format in news JSON:
 *   "video": "https://www.youtube.com/watch?v=XXXX"   ← YouTube
 *   "video": "https://youtu.be/XXXX"                  ← YouTube short
 *   "video": "https://www.bilibili.com/video/BVXXXX"  ← Bilibili
 *   "video": "https://example.com/video.mp4"          ← Direct MP4
 */

const App = (() => {
  /* ── Config ── */
  const PAGE_SIZE = 5;

  /* ── State ── */
  let state = {
    currentDate: null,
    data: null,
    page: 1,
    totalPages: 1,
  };

  /* ── DOM refs ── */
  const $ = (id) => document.getElementById(id);
  const els = {
    dateTabs:     $('dateTabs'),
    featuredCard: $('featuredCard'),
    newsList:     $('newsList'),
    feedCount:    $('feedCount'),
    prevBtn:      $('prevBtn'),
    nextBtn:      $('nextBtn'),
    pageNum:      $('pageNum'),
    pageTotal:    $('pageTotal'),
    headerDate:   $('headerDate'),
    cmdText:      $('cmdText'),
    modalOverlay: $('modalOverlay'),
    modalBody:    $('modalBody'),
    modalClose:   $('modalClose'),
    modalCmd:     $('modalCmd'),
    menuToggle:   $('menuToggle'),
  };

  /* ══════════════════════════════════════════
     Init
  ══════════════════════════════════════════ */
  async function init() {
    // Detect and apply locale before any rendering
    const locale = I18n.detectLocale();
    I18n.setLocale(locale);

    setupHeader();
    setupMenuToggle();
    setupModal();
    buildDateTabs();
    rerenderStaticUI();
    await loadDate(NewsData.getAvailableDates()[0]);
  }

  /* ══════════════════════════════════════════
     Header
  ══════════════════════════════════════════ */
  function setupHeader() {
    const now = new Date();
    els.headerDate.textContent = now.toISOString().slice(0,10) + ' ' +
      now.toTimeString().slice(0,8);
    setInterval(() => {
      const d = new Date();
      els.headerDate.textContent = d.toISOString().slice(0,10) + ' ' +
        d.toTimeString().slice(0,8);
    }, 1000);

    buildLangSwitcher();
  }

  /* ── Language switcher ── */
  const LANG_OPTIONS = [
    { value: 'en-US',   label: 'EN-US' },
    { value: 'en-GB',   label: 'EN-GB' },
    { value: 'en-IN',   label: 'EN-IN' },
    { value: 'zh-CN',   label: '中文(简)' },
    { value: 'zh-TW',   label: '中文(繁)' },
    { value: 'zh-HK',   label: '中文(港)' },
    { value: 'es-ES',   label: 'ES' },
    { value: 'es-MX',   label: 'ES-MX' },
    { value: 'es-LA',   label: 'ES-LA' },
    { value: 'fr-FR',   label: 'FR' },
    { value: 'fr-AF',   label: 'FR-AF' },
    { value: 'pt-BR',   label: 'PT-BR' },
    { value: 'pt-PT',   label: 'PT-PT' },
    { value: 'ar-SA',   label: 'عربي' },
    { value: 'ar-EG',   label: 'عربي(مصر)' },
    { value: 'hi-IN',   label: 'हिन्दी' },
    { value: 'hi-IN-S', label: 'Hinglish' },
    { value: 'ru-RU',   label: 'РУС' },
    { value: 'ja-JP',   label: '日本語' },
    { value: 'sw-TZ',   label: 'SW-TZ' },
    { value: 'sw-KE',   label: 'SW-KE' },
  ];

  // Tracks which locale bundles have already been injected
  const _loadedBundles = new Set();

  function loadLocaleBundle(locale) {
    // Resolve to the bundle locale (some locales share a bundle via fallback)
    const BUNDLE_LOCALES = new Set([
      'en-US','zh-CN','zh-TW','es-ES','es-MX','fr-FR','pt-BR',
      'ar-SA','hi-IN','hi-IN-S','ru-RU','ja-JP','sw-TZ'
    ]);
    // Map derived locales to their bundle
    const BUNDLE_MAP = {
      'en-GB':'en-US','en-IN':'en-US','en-XX':'en-US',
      'zh-HK':'zh-TW','zh-XX':'en-US',
      'es-LA':'es-ES','fr-AF':'fr-FR','pt-PT':'pt-BR',
      'ar-EG':'ar-SA','sw-KE':'sw-TZ',
    };
    const bundleLocale = BUNDLE_MAP[locale] || (BUNDLE_LOCALES.has(locale) ? locale : 'en-US');

    // Already loaded (either at startup or previously)
    if (_loadedBundles.has(bundleLocale)) return Promise.resolve();
    if (window.__NEWS_DATA_LOCALES__ && window.__NEWS_DATA_LOCALES__[bundleLocale]) {
      _loadedBundles.add(bundleLocale);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `js/bundles/news-bundle.${bundleLocale}.js`;
      script.onload = () => { _loadedBundles.add(bundleLocale); resolve(); };
      script.onerror = () => resolve(); // fail silently, fetchDate will fallback
      document.head.appendChild(script);
    });
  }

  function buildLangSwitcher() {
    const headerMeta = document.querySelector('.header-meta');
    if (!headerMeta) return;

    // Remove existing switcher if rebuilding
    const existing = document.getElementById('langSwitcher');
    if (existing) existing.remove();

    const sel = document.createElement('select');
    sel.id = 'langSwitcher';
    sel.className = 'lang-switcher';
    sel.setAttribute('aria-label', 'Select language');
    sel.setAttribute('title', 'Select language');

    LANG_OPTIONS.forEach(({ value, label }) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = label;
      if (value === I18n.getLocale()) opt.selected = true;
      sel.appendChild(opt);
    });

    sel.addEventListener('change', async () => {
      const newLocale = sel.value;
      // Dynamically load the locale bundle if not yet loaded
      await loadLocaleBundle(newLocale);
      I18n.setLocale(newLocale);
      rerenderStaticUI();
      await loadDate(state.currentDate);
    });

    // Insert before the date clock
    headerMeta.insertBefore(sel, els.headerDate);
  }

  /* ── Re-render all static UI labels after locale change ── */
  function rerenderStaticUI() {
    const dsLabel = document.querySelector('.ds-label');
    if (dsLabel) dsLabel.textContent = I18n.t('FEED_DATE');

    const featTag = document.querySelector('.featured-section .section-tag');
    if (featTag) featTag.textContent = I18n.t('FEATURED');

    const featBadge = document.querySelector('.featured-section .section-badge');
    if (featBadge) featBadge.textContent = I18n.t('HOT');

    const feedTag = document.querySelector('.feed-section .section-tag');
    if (feedTag) feedTag.textContent = I18n.t('FEED');

    if (els.prevBtn) {
      els.prevBtn.innerHTML = `<span class="btn-prefix">&lt;&lt;</span> ${I18n.t('PREV')}`;
    }
    if (els.nextBtn) {
      els.nextBtn.innerHTML = `${I18n.t('NEXT')} <span class="btn-suffix">&gt;&gt;</span>`;
    }
    if (els.modalClose) {
      els.modalClose.textContent = `✕ ${I18n.t('CLOSE')}`;
    }

    const footerStatus = document.querySelector('.footer-status');
    if (footerStatus) {
      footerStatus.innerHTML = `<span class="status-dot"></span> ${I18n.t('FEED_ACTIVE')}`;
    }

    // Sync switcher selection (in case locale was set externally)
    const sel = document.getElementById('langSwitcher');
    if (sel) sel.value = I18n.getLocale();

    // Rebuild date tabs (labels depend on locale)
    buildDateTabs();

    // Refresh article count if data is loaded
    if (state.data) {
      els.feedCount.textContent = I18n.t('ARTICLES_COUNT', { n: state.data.articles.length });
    }
  }

  function setCmd(text) {
    els.cmdText.textContent = text;
  }

  function setupMenuToggle() {
    const nav = document.getElementById('navBar');
    els.menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
    });
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== els.menuToggle) {
        nav.classList.remove('open');
      }
    });
    // Close menu when a nav link is clicked
    nav.addEventListener('click', () => nav.classList.remove('open'));
  }

  /* ══════════════════════════════════════════
     Date tabs
  ══════════════════════════════════════════ */
  function buildDateTabs() {
    const dates = NewsData.getAvailableDates();
    els.dateTabs.innerHTML = '';
    dates.forEach(d => {
      const btn = document.createElement('button');
      btn.className = 'date-tab';
      btn.textContent = NewsData.formatDateLabel(d);
      btn.dataset.date = d;
      btn.addEventListener('click', () => loadDate(d));
      els.dateTabs.appendChild(btn);
    });
  }

  function setActiveTab(dateStr) {
    els.dateTabs.querySelectorAll('.date-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.date === dateStr);
    });
  }

  /* ══════════════════════════════════════════
     Load date
  ══════════════════════════════════════════ */
  async function loadDate(dateStr) {
    state.currentDate = dateStr;
    state.page = 1;
    setActiveTab(dateStr);
    setCmd(`fetch --date=${dateStr} --locale=${I18n.getLocale()} --source=./news/${dateStr}/${I18n.getLocale()}.json`);
    showSkeleton();

    const data = await NewsData.fetchDate(dateStr, I18n.getLocale());
    if (!data) {
      showError('Failed to load news data. Check console for details.');
      return;
    }

    state.data = data;
    state.totalPages = Math.ceil(data.articles.length / PAGE_SIZE);

    setCmd(`cat ./news/${dateStr}/${I18n.getLocale()}.json | jq '.articles | length' → ${data.articles.length} articles`);
    renderFeatured(data.featured);
    renderFeed();
  }

  /* ══════════════════════════════════════════
     Featured
  ══════════════════════════════════════════ */
  function renderFeatured(f) {
    if (!f) { els.featuredCard.innerHTML = ''; return; }
    els.featuredCard.className = 'featured-card fade-in';

    const hasVideo = !!f.video;
    const videoLabel = hasVideo ? `<span class="featured-video-badge">▶ VIDEO</span>` : '';

    els.featuredCard.innerHTML = `
      <div class="featured-img-wrap" id="featuredMedia">
        <img src="${escHtml(f.image)}" alt="${escHtml(f.title)}" loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop'">
        <div class="featured-img-overlay"></div>
        ${hasVideo ? `
        <button class="featured-play-btn" id="featuredPlayBtn" aria-label="Play video">
          <span class="play-icon">▶</span>
          <span class="play-label">${I18n.t('PLAY_VIDEO')}</span>
        </button>` : ''}
      </div>
      <div class="featured-content">
        <div class="featured-eyebrow">
          <span class="featured-label">// ${I18n.t('FEATURED')}</span>
          ${videoLabel}
          <span class="featured-source">${escHtml(f.source)}</span>
          <span class="featured-time">${NewsData.relativeTime(f.timestamp)}</span>
        </div>
        <h2 class="featured-title">${escHtml(f.title)}</h2>
        <p class="featured-summary">${escHtml(f.summary)}</p>
        <div class="featured-tags">
          ${(f.tags||[]).map(t => `<span class="tag">#${escHtml(t)}</span>`).join('')}
        </div>
        <span class="featured-cta">${I18n.t(hasVideo ? 'WATCH_NOW' : 'READ_MORE')}</span>
      </div>
    `;

    if (hasVideo) {
      // Play button: inline embed in the featured media area
      document.getElementById('featuredPlayBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        embedVideoInline('featuredMedia', f.video, true);
      });
      // Click on content side → open modal (shows video + article)
      els.featuredCard.querySelector('.featured-content').addEventListener('click', () => openModal(f));
    } else {
      els.featuredCard.addEventListener('click', () => openModal(f));
    }
  }

  /* ── Video helpers ── */

  /**
   * Parse a video URL and return { type, embedUrl, isEmbed }
   * type: 'youtube' | 'bilibili' | 'mp4'
   */
  function parseVideo(url) {
    if (!url) return null;
    // YouTube — use youtube-nocookie.com to avoid Error 153 / embedding restrictions
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (ytMatch) {
      return { type: 'youtube', embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1` };
    }
    // Bilibili  BV or av
    const bvMatch = url.match(/bilibili\.com\/video\/(BV[A-Za-z0-9]+|av\d+)/i);
    if (bvMatch) {
      const bvid = bvMatch[1];
      return { type: 'bilibili', embedUrl: `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1` };
    }
    // Direct mp4 / other
    return { type: 'mp4', embedUrl: url };
  }

  /**
   * Replace the content of container (by id) with an embedded player.
   * @param {string} containerId
   * @param {string} videoUrl
   * @param {boolean} keepAspect  true = 16:9 fixed height
   */
  function embedVideoInline(containerId, videoUrl, keepAspect) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const info = parseVideo(videoUrl);
    if (!info) return;

    let playerHtml;
    if (info.type === 'mp4') {
      playerHtml = `
        <video class="inline-video" src="${escHtml(info.embedUrl)}"
          controls autoplay playsinline
          onerror="this.parentElement.innerHTML='<div class=\\'video-error\\'>[ERROR] Cannot load video</div>'">
        </video>`;
    } else {
      playerHtml = `
        <iframe class="inline-iframe"
          src="${escHtml(info.embedUrl)}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin">
        </iframe>`;
    }

    container.innerHTML = `<div class="video-player-wrap${keepAspect ? ' video-aspect' : ''}">${playerHtml}</div>`;
  }

  /**
   * Build video player HTML for the modal body (not inline).
   */
  function buildModalVideoHtml(videoUrl) {
    const info = parseVideo(videoUrl);
    if (!info) return '';
    if (info.type === 'mp4') {
      return `
        <div class="video-player-wrap video-aspect modal-video">
          <video class="inline-video" src="${escHtml(info.embedUrl)}"
            controls playsinline
            onerror="this.parentElement.innerHTML='<div class=\\'video-error\\'>[ERROR] Cannot load video</div>'">
          </video>
        </div>`;
    }
    return `
      <div class="video-player-wrap video-aspect modal-video">
        <iframe class="inline-iframe"
          src="${escHtml(info.embedUrl)}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin">
        </iframe>
      </div>`;
  }

  /* ══════════════════════════════════════════
     Feed list
  ══════════════════════════════════════════ */
  function renderFeed() {
    const articles = state.data.articles;
    state.totalPages = Math.ceil(articles.length / PAGE_SIZE);
    els.feedCount.textContent = I18n.t('ARTICLES_COUNT', { n: articles.length });

    const start = (state.page - 1) * PAGE_SIZE;
    const slice = articles.slice(start, start + PAGE_SIZE);

    els.newsList.innerHTML = '';
    slice.forEach((art, i) => {
      const el = document.createElement('article');
      el.className = 'news-item fade-in';
      el.style.animationDelay = `${i * 0.05}s`;
      const hasVideo = !!art.video;
      el.innerHTML = `
        <span class="news-item-idx">[${String(start + i + 1).padStart(2,'0')}]</span>
        <div class="news-img-wrap">
          <img src="${escHtml(art.image)}" alt="" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop'">
          ${hasVideo ? `<span class="news-video-badge">▶</span>` : ''}
        </div>
        <div class="news-content">
          <div class="news-meta">
            <span class="news-source">${escHtml(art.source)}</span>
            ${hasVideo ? `<span class="news-video-tag">VIDEO</span>` : ''}
            <span class="news-time">${NewsData.relativeTime(art.timestamp)}</span>
          </div>
          <h3 class="news-title">${escHtml(art.title)}</h3>
          <p class="news-summary">${escHtml(art.summary)}</p>
          <div class="news-footer">
            ${(art.tags||[]).map(t => `<span class="tag">#${escHtml(t)}</span>`).join('')}
          </div>
        </div>
      `;
      el.addEventListener('click', () => openModal(art));
      els.newsList.appendChild(el);
    });

    updatePagination();
  }

  function updatePagination() {
    const p = state.page, t = state.totalPages;
    els.pageNum.textContent   = String(p).padStart(2,'0');
    els.pageTotal.textContent = String(t).padStart(2,'0');
    els.prevBtn.disabled = p <= 1;
    els.nextBtn.disabled = p >= t;
  }

  /* ══════════════════════════════════════════
     Pagination controls
  ══════════════════════════════════════════ */
  els.prevBtn.addEventListener('click', () => {
    if (state.page > 1) { state.page--; renderFeed(); scrollToFeed(); }
  });
  els.nextBtn.addEventListener('click', () => {
    if (state.page < state.totalPages) { state.page++; renderFeed(); scrollToFeed(); }
  });

  function scrollToFeed() {
    document.querySelector('.feed-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ══════════════════════════════════════════
     Modal
  ══════════════════════════════════════════ */
  function setupModal() {
    els.modalClose.addEventListener('click', closeModal);
    els.modalOverlay.addEventListener('click', (e) => {
      if (e.target === els.modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Touch swipe-down to close on mobile
    let touchStartY = 0;
    const panel = document.getElementById('modalPanel');
    panel.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    panel.addEventListener('touchend', (e) => {
      const dy = e.changedTouches[0].clientY - touchStartY;
      // swipe down > 80px from top of panel (header area) → close
      if (dy > 80 && panel.scrollTop <= 0) closeModal();
    }, { passive: true });
  }

  function openModal(article) {
    els.modalCmd.textContent = `cat "${truncate(article.title, 50)}"`;

    const hasVideo = !!article.video;

    // Media block: video player or image
    const mediaHtml = hasVideo
      ? buildModalVideoHtml(article.video)
      : `<div class="article-img-wrap">
           <img src="${escHtml(article.image)}" alt="${escHtml(article.title)}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop'">
         </div>`;

    els.modalBody.innerHTML = `
      ${mediaHtml}
      <div class="article-eyebrow">
        <span class="article-label">// ${escHtml((article.tags && article.tags[0]) || 'ROBOTICS')}</span>
        ${hasVideo ? `<span class="article-video-label">▶ VIDEO</span>` : ''}
        <span class="article-source">${escHtml(article.source)}</span>
        <span class="article-time">${NewsData.relativeTime(article.timestamp)}</span>
      </div>
      <h1 class="article-title">${escHtml(article.title)}</h1>
      <p class="article-body">${escHtml(article.summary)}</p>
      <div class="article-tags">
        ${(article.tags||[]).map(t => `<span class="tag">#${escHtml(t)}</span>`).join('')}
      </div>
      <div class="article-actions">
        <a href="${escHtml(article.url)}" class="btn-primary" target="_blank" rel="noopener">
          ↗ ${I18n.t('OPEN_SOURCE')}
        </a>
        <button class="btn-secondary" onclick="App.closeModal()">✕ ${I18n.t('CLOSE')}</button>
      </div>
    `;
    els.modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    // Stop any playing video: remove iframes and pause <video> elements
    els.modalBody.querySelectorAll('iframe').forEach(f => { f.src = ''; });
    els.modalBody.querySelectorAll('video').forEach(v => { v.pause(); v.src = ''; });
    els.modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ══════════════════════════════════════════
     Helpers
  ══════════════════════════════════════════ */
  function showSkeleton() {
    els.featuredCard.className = 'featured-card';
    els.featuredCard.innerHTML = `
      <div class="featured-skeleton">
        <div class="sk-line sk-title"></div>
        <div class="sk-line sk-body"></div>
        <div class="sk-line sk-body sk-short"></div>
      </div>
    `;
    els.newsList.innerHTML = Array(5).fill(null).map(() => `
      <article class="news-item">
        <div class="news-img-wrap" style="background:var(--bg-hover);min-height:90px;"></div>
        <div class="news-content">
          <div class="sk-line" style="width:60%;height:12px;margin-bottom:8px;"></div>
          <div class="sk-line" style="width:90%;height:16px;margin-bottom:6px;"></div>
          <div class="sk-line" style="width:75%;height:12px;"></div>
        </div>
      </article>
    `).join('');
  }

  function showError(msg) {
    els.featuredCard.innerHTML = `<div style="padding:28px;color:var(--red);grid-column:1/-1;">[ERROR] ${escHtml(msg)}</div>`;
    els.newsList.innerHTML = '';
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function truncate(str, n) {
    return str.length > n ? str.slice(0,n) + '...' : str;
  }

  /* Public API */
  return { init, closeModal };
})();

/* Boot */
document.addEventListener('DOMContentLoaded', App.init);
