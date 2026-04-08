/**
 * ROBO//NEWS — i18n Module
 *
 * Provides UI string translations and locale management.
 * Must be loaded FIRST, before any bundle or app scripts.
 *
 * Public API:
 *   I18n.setLocale(localeStr)   — set language, update <html>, persist to localStorage
 *   I18n.getLocale()            — current locale string
 *   I18n.detectLocale()         — auto-detect: ?lang= → localStorage → navigator → en-US
 *   I18n.t(key, vars?)          — translate key, supports {n} substitution
 *   I18n.isRTL()                — true for ar-SA, ar-EG
 *   I18n.getDateLocale()        — BCP47 tag for toLocaleDateString()
 */

const I18n = (() => {

  /* ── Fallback chain table ─────────────────────────────────────────────── */
  const FALLBACKS = {
    'en-GB':   ['en-XX', 'en-US'],
    'en-IN':   ['en-XX', 'en-US'],
    'en-XX':   ['en-US'],
    'zh-HK':   ['zh-TW', 'zh-XX', 'en-US'],
    'zh-TW':   ['zh-XX', 'en-US'],
    'zh-XX':   ['en-US'],
    'es-MX':   ['es-ES', 'es-XX', 'en-US'],
    'es-LA':   ['es-XX', 'en-US'],
    'es-XX':   ['en-US'],
    'fr-AF':   ['fr-FR', 'en-US'],
    'pt-PT':   ['pt-BR', 'en-US'],
    'ar-EG':   ['ar-SA', 'en-US'],
    'hi-IN-S': ['hi-IN', 'en-US'],
    'sw-KE':   ['sw-TZ', 'en-US'],
  };

  /* ── RTL locales ──────────────────────────────────────────────────────── */
  const RTL_LOCALES = new Set(['ar-SA', 'ar-EG']);

  /* ── All known locale codes ───────────────────────────────────────────── */
  const KNOWN_LOCALES = new Set([
    'en-US', 'en-GB', 'en-IN', 'en-XX',
    'zh-CN', 'zh-TW', 'zh-HK', 'zh-XX',
    'es-ES', 'es-MX', 'es-LA', 'es-XX',
    'fr-FR', 'fr-AF',
    'pt-BR', 'pt-PT',
    'ar-SA', 'ar-EG',
    'hi-IN', 'hi-IN-S',
    'ru-RU',
    'ja-JP',
    'sw-TZ', 'sw-KE',
  ]);

  /* ── String catalogs ──────────────────────────────────────────────────── */
  const STRINGS = {

    'en-US': {
      FEED_DATE:       '// FEED_DATE:',
      FEATURED:        '[ FEATURED ]',
      HOT:             'HOT',
      FEED:            '[ FEED ]',
      READ_MORE:       'READ_MORE',
      WATCH_NOW:       'WATCH_NOW',
      OPEN_SOURCE:     'OPEN_SOURCE',
      CLOSE:           'CLOSE',
      PREV:            'PREV',
      NEXT:            'NEXT',
      LOADING:         'LOADING...',
      ERROR:           'ERROR',
      PLAY_VIDEO:      'PLAY_VIDEO',
      TODAY:           'TODAY',
      YESTERDAY:       'YESTERDAY',
      ARTICLES_COUNT:  '{n} articles',
      N_SECONDS_AGO:   '{n}s ago',
      N_MINUTES_AGO:   '{n}m ago',
      N_HOURS_AGO:     '{n}h ago',
      N_DAYS_AGO:      '{n}d ago',
      FEED_ACTIVE:     'FEED ACTIVE',
      DATE_LOCALE:     'en-US',
    },

    'en-XX': {
      DATE_LOCALE: 'en',
    },

    'zh-CN': {
      FEED_DATE:       '// 资讯日期:',
      FEATURED:        '[ 精选 ]',
      HOT:             '热门',
      FEED:            '[ 资讯 ]',
      READ_MORE:       '阅读更多',
      WATCH_NOW:       '立即观看',
      OPEN_SOURCE:     '打开来源',
      CLOSE:           '关闭',
      PREV:            '上一页',
      NEXT:            '下一页',
      LOADING:         '加载中...',
      ERROR:           '错误',
      PLAY_VIDEO:      '播放视频',
      TODAY:           '今天',
      YESTERDAY:       '昨天',
      ARTICLES_COUNT:  '{n} 篇文章',
      N_SECONDS_AGO:   '{n}秒前',
      N_MINUTES_AGO:   '{n}分钟前',
      N_HOURS_AGO:     '{n}小时前',
      N_DAYS_AGO:      '{n}天前',
      FEED_ACTIVE:     '实时更新',
      DATE_LOCALE:     'zh-CN',
    },

    'zh-TW': {
      FEED_DATE:       '// 資訊日期:',
      FEATURED:        '[ 精選 ]',
      HOT:             '熱門',
      FEED:            '[ 資訊 ]',
      READ_MORE:       '閱讀更多',
      WATCH_NOW:       '立即觀看',
      OPEN_SOURCE:     '開啟來源',
      CLOSE:           '關閉',
      PREV:            '上一頁',
      NEXT:            '下一頁',
      LOADING:         '載入中...',
      ERROR:           '錯誤',
      PLAY_VIDEO:      '播放影片',
      TODAY:           '今天',
      YESTERDAY:       '昨天',
      ARTICLES_COUNT:  '{n} 篇文章',
      N_SECONDS_AGO:   '{n}秒前',
      N_MINUTES_AGO:   '{n}分鐘前',
      N_HOURS_AGO:     '{n}小時前',
      N_DAYS_AGO:      '{n}天前',
      FEED_ACTIVE:     '實時更新',
      DATE_LOCALE:     'zh-TW',
    },

    'zh-XX': {
      DATE_LOCALE: 'zh',
    },

    'es-ES': {
      FEED_DATE:       '// FECHA:',
      FEATURED:        '[ DESTACADO ]',
      HOT:             'POPULAR',
      FEED:            '[ NOTICIAS ]',
      READ_MORE:       'LEER_MÁS',
      WATCH_NOW:       'VER_AHORA',
      OPEN_SOURCE:     'ABRIR_FUENTE',
      CLOSE:           'CERRAR',
      PREV:            'ANTERIOR',
      NEXT:            'SIGUIENTE',
      LOADING:         'CARGANDO...',
      ERROR:           'ERROR',
      PLAY_VIDEO:      'REPRODUCIR',
      TODAY:           'HOY',
      YESTERDAY:       'AYER',
      ARTICLES_COUNT:  '{n} artículos',
      N_SECONDS_AGO:   'hace {n}s',
      N_MINUTES_AGO:   'hace {n}m',
      N_HOURS_AGO:     'hace {n}h',
      N_DAYS_AGO:      'hace {n}d',
      FEED_ACTIVE:     'FEED ACTIVO',
      DATE_LOCALE:     'es-ES',
    },

    'es-XX': {
      DATE_LOCALE: 'es',
    },

    'fr-FR': {
      FEED_DATE:       '// DATE:',
      FEATURED:        '[ À LA UNE ]',
      HOT:             'TENDANCE',
      FEED:            '[ ACTUALITÉS ]',
      READ_MORE:       'LIRE_PLUS',
      WATCH_NOW:       'REGARDER',
      OPEN_SOURCE:     'OUVRIR_SOURCE',
      CLOSE:           'FERMER',
      PREV:            'PRÉCÉDENT',
      NEXT:            'SUIVANT',
      LOADING:         'CHARGEMENT...',
      ERROR:           'ERREUR',
      PLAY_VIDEO:      'LIRE_VIDÉO',
      TODAY:           "AUJOURD'HUI",
      YESTERDAY:       'HIER',
      ARTICLES_COUNT:  '{n} articles',
      N_SECONDS_AGO:   'il y a {n}s',
      N_MINUTES_AGO:   'il y a {n}m',
      N_HOURS_AGO:     'il y a {n}h',
      N_DAYS_AGO:      'il y a {n}j',
      FEED_ACTIVE:     'FLUX ACTIF',
      DATE_LOCALE:     'fr-FR',
    },

    'pt-BR': {
      FEED_DATE:       '// DATA:',
      FEATURED:        '[ DESTAQUE ]',
      HOT:             'POPULAR',
      FEED:            '[ NOTÍCIAS ]',
      READ_MORE:       'LEIA_MAIS',
      WATCH_NOW:       'ASSISTIR',
      OPEN_SOURCE:     'ABRIR_FONTE',
      CLOSE:           'FECHAR',
      PREV:            'ANTERIOR',
      NEXT:            'PRÓXIMO',
      LOADING:         'CARREGANDO...',
      ERROR:           'ERRO',
      PLAY_VIDEO:      'REPRODUZIR',
      TODAY:           'HOJE',
      YESTERDAY:       'ONTEM',
      ARTICLES_COUNT:  '{n} artigos',
      N_SECONDS_AGO:   'há {n}s',
      N_MINUTES_AGO:   'há {n}m',
      N_HOURS_AGO:     'há {n}h',
      N_DAYS_AGO:      'há {n}d',
      FEED_ACTIVE:     'FEED ATIVO',
      DATE_LOCALE:     'pt-BR',
    },

    'ar-SA': {
      FEED_DATE:       '// تاريخ التغذية:',
      FEATURED:        '[ مميز ]',
      HOT:             'ساخن',
      FEED:            '[ تغذية ]',
      READ_MORE:       'اقرأ_المزيد',
      WATCH_NOW:       'شاهد_الآن',
      OPEN_SOURCE:     'فتح_المصدر',
      CLOSE:           'إغلاق',
      PREV:            'السابق',
      NEXT:            'التالي',
      LOADING:         'جارٍ التحميل...',
      ERROR:           'خطأ',
      PLAY_VIDEO:      'تشغيل_الفيديو',
      TODAY:           'اليوم',
      YESTERDAY:       'أمس',
      ARTICLES_COUNT:  '{n} مقالة',
      N_SECONDS_AGO:   'منذ {n}ث',
      N_MINUTES_AGO:   'منذ {n}د',
      N_HOURS_AGO:     'منذ {n}س',
      N_DAYS_AGO:      'منذ {n}ي',
      FEED_ACTIVE:     'التغذية نشطة',
      DATE_LOCALE:     'ar-SA',
    },

    'hi-IN': {
      FEED_DATE:       '// फ़ीड तारीख:',
      FEATURED:        '[ विशेष ]',
      HOT:             'ट्रेंडिंग',
      FEED:            '[ फ़ीड ]',
      READ_MORE:       'और_पढ़ें',
      WATCH_NOW:       'अभी_देखें',
      OPEN_SOURCE:     'स्रोत_खोलें',
      CLOSE:           'बंद_करें',
      PREV:            'पिछला',
      NEXT:            'अगला',
      LOADING:         'लोड हो रहा है...',
      ERROR:           'त्रुटि',
      PLAY_VIDEO:      'वीडियो_चलाएं',
      TODAY:           'आज',
      YESTERDAY:       'कल',
      ARTICLES_COUNT:  '{n} लेख',
      N_SECONDS_AGO:   '{n} सेकंड पहले',
      N_MINUTES_AGO:   '{n} मिनट पहले',
      N_HOURS_AGO:     '{n} घंटे पहले',
      N_DAYS_AGO:      '{n} दिन पहले',
      FEED_ACTIVE:     'फ़ीड सक्रिय',
      DATE_LOCALE:     'hi-IN',
    },

    'hi-IN-S': {
      FEED_DATE:       '// FEED DATE:',
      FEATURED:        '[ FEATURED ]',
      HOT:             'HOT',
      FEED:            '[ FEED ]',
      READ_MORE:       'और READ करें',
      WATCH_NOW:       'अभी WATCH करें',
      OPEN_SOURCE:     'SOURCE खोलें',
      CLOSE:           'CLOSE',
      PREV:            'PREV',
      NEXT:            'NEXT',
      LOADING:         'LOADING...',
      ERROR:           'ERROR',
      PLAY_VIDEO:      'VIDEO चलाएं',
      TODAY:           'आज',
      YESTERDAY:       'कल',
      ARTICLES_COUNT:  '{n} ARTICLES',
      N_SECONDS_AGO:   '{n}s पहले',
      N_MINUTES_AGO:   '{n}m पहले',
      N_HOURS_AGO:     '{n}h पहले',
      N_DAYS_AGO:      '{n}d पहले',
      FEED_ACTIVE:     'FEED ACTIVE',
      DATE_LOCALE:     'hi-IN',
    },

    'ru-RU': {
      FEED_DATE:       '// ДАТА:',
      FEATURED:        '[ ГЛАВНОЕ ]',
      HOT:             'ГОРЯЧЕЕ',
      FEED:            '[ ЛЕНТА ]',
      READ_MORE:       'ЧИТАТЬ',
      WATCH_NOW:       'СМОТРЕТЬ',
      OPEN_SOURCE:     'ОТКРЫТЬ',
      CLOSE:           'ЗАКРЫТЬ',
      PREV:            'НАЗАД',
      NEXT:            'ВПЕРЁД',
      LOADING:         'ЗАГРУЗКА...',
      ERROR:           'ОШИБКА',
      PLAY_VIDEO:      'ВОСПРОИЗВЕСТИ',
      TODAY:           'СЕГОДНЯ',
      YESTERDAY:       'ВЧЕРА',
      ARTICLES_COUNT:  '{n} статей',
      N_SECONDS_AGO:   '{n}с назад',
      N_MINUTES_AGO:   '{n}м назад',
      N_HOURS_AGO:     '{n}ч назад',
      N_DAYS_AGO:      '{n}д назад',
      FEED_ACTIVE:     'ЛЕНТА АКТИВНА',
      DATE_LOCALE:     'ru-RU',
    },

    'ja-JP': {
      FEED_DATE:       '// 日付:',
      FEATURED:        '[ 特集 ]',
      HOT:             '注目',
      FEED:            '[ フィード ]',
      READ_MORE:       '続きを読む',
      WATCH_NOW:       '今すぐ見る',
      OPEN_SOURCE:     'ソースを開く',
      CLOSE:           '閉じる',
      PREV:            '前へ',
      NEXT:            '次へ',
      LOADING:         '読み込み中...',
      ERROR:           'エラー',
      PLAY_VIDEO:      '動画を再生',
      TODAY:           '今日',
      YESTERDAY:       '昨日',
      ARTICLES_COUNT:  '{n}件',
      N_SECONDS_AGO:   '{n}秒前',
      N_MINUTES_AGO:   '{n}分前',
      N_HOURS_AGO:     '{n}時間前',
      N_DAYS_AGO:      '{n}日前',
      FEED_ACTIVE:     'フィード稼働中',
      DATE_LOCALE:     'ja-JP',
    },

    'sw-TZ': {
      FEED_DATE:       '// TAREHE:',
      FEATURED:        '[ ILIYOANGAZIWA ]',
      HOT:             'MOTO',
      FEED:            '[ HABARI ]',
      READ_MORE:       'SOMA_ZAIDI',
      WATCH_NOW:       'TAZAMA_SASA',
      OPEN_SOURCE:     'FUNGUA_CHANZO',
      CLOSE:           'FUNGA',
      PREV:            'ILIYOTANGULIA',
      NEXT:            'INAYOFUATA',
      LOADING:         'INAPAKIA...',
      ERROR:           'HITILAFU',
      PLAY_VIDEO:      'CHEZA_VIDEO',
      TODAY:           'LEO',
      YESTERDAY:       'JANA',
      ARTICLES_COUNT:  'makala {n}',
      N_SECONDS_AGO:   '{n}s iliyopita',
      N_MINUTES_AGO:   '{n}d iliyopita',
      N_HOURS_AGO:     '{n}s iliyopita',
      N_DAYS_AGO:      '{n}s iliyopita',
      FEED_ACTIVE:     'INAFANYA KAZI',
      DATE_LOCALE:     'sw-TZ',
    },

  };

  /* ── State ────────────────────────────────────────────────────────────── */
  let _locale   = 'en-US';
  let _resolved = STRINGS['en-US'];   // merged strings after fallback chain

  /* ── Private helpers ──────────────────────────────────────────────────── */

  function _buildResolved(locale) {
    const chain = [locale, ...(FALLBACKS[locale] || []), 'en-US'];
    const result = {};
    // Apply chain from least-specific to most-specific so closer entries win
    for (let i = chain.length - 1; i >= 0; i--) {
      const catalog = STRINGS[chain[i]];
      if (catalog) Object.assign(result, catalog);
    }
    return result;
  }

  function _applyToDOM(locale) {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    html.setAttribute('lang', locale);
    if (RTL_LOCALES.has(locale)) {
      html.setAttribute('dir', 'rtl');
      document.body && document.body.classList.add('rtl');
    } else {
      html.setAttribute('dir', 'ltr');
      document.body && document.body.classList.remove('rtl');
    }
  }

  function _persist(locale) {
    try { localStorage.setItem('robo_locale', locale); } catch (_) {}
  }

  function _isKnown(locale) {
    return KNOWN_LOCALES.has(locale);
  }

  function _findByTrunk(trunk) {
    // e.g. 'zh' → 'zh-CN', 'fr' → 'fr-FR'
    for (const k of KNOWN_LOCALES) {
      if (k.startsWith(trunk + '-') && STRINGS[k]) return k;
    }
    return null;
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  function setLocale(localeStr) {
    if (!_isKnown(localeStr)) localeStr = 'en-US';
    _locale   = localeStr;
    _resolved = _buildResolved(localeStr);
    _applyToDOM(localeStr);
    _persist(localeStr);
  }

  function getLocale() {
    return _locale;
  }

  function detectLocale() {
    // 1. URL param: ?lang=zh-CN
    if (typeof location !== 'undefined') {
      try {
        const p = new URLSearchParams(location.search).get('lang');
        if (p && _isKnown(p)) return p;
      } catch (_) {}
    }
    // 2. localStorage
    try {
      const stored = localStorage.getItem('robo_locale');
      if (stored && _isKnown(stored)) return stored;
    } catch (_) {}
    // 3. navigator.languages
    if (typeof navigator !== 'undefined') {
      const langs = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
      for (const lang of langs) {
        if (_isKnown(lang)) return lang;
        const trunk = lang.split('-')[0];
        const match = _findByTrunk(trunk);
        if (match) return match;
      }
    }
    return 'en-US';
  }

  function t(key, vars) {
    let str = (_resolved && _resolved[key] !== undefined)
      ? _resolved[key]
      : (STRINGS['en-US'][key] !== undefined ? STRINGS['en-US'][key] : key);
    if (vars) {
      Object.keys(vars).forEach(function(k) {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return str;
  }

  function isRTL() {
    return RTL_LOCALES.has(_locale);
  }

  function getDateLocale() {
    return t('DATE_LOCALE');
  }

  return { setLocale, getLocale, detectLocale, t, isRTL, getDateLocale };

})();
