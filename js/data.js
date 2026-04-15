/**
 * ROBO//NEWS — Data Manager
 *
 * 新闻数据直接内嵌在此文件，无需服务器，双击 index.html 即可使用。
 *
 * 如何添加新闻：
 *   1. 在 NEWS_DB 对象中添加新的日期键（格式 'YYYY-MM-DD'）
 *   2. 按照现有格式填写 featured 和 articles
 *   3. 在 AVAILABLE_DATES 数组顶部加入该日期
 */

const NewsData = (() => {

  // ── 注册可用日期（最新在前）──
  const AVAILABLE_DATES = [
    '2026-04-14',
    '2026-04-13',
    '2026-04-12',
    '2026-04-09',
    '2026-04-08',
    '2026-04-07',
    '2026-04-06',
    '2026-04-05',
    '2026-04-04',
    '2026-04-03',
    '2026-04-02',
    '2026-04-01',
    '2026-03-31',
  ];

  // ── 内嵌新闻数据库 ──
  const NEWS_DB = {
    '2026-04-06': {
      "date": "2026-04-06",
      "featured": {
        "id": "featured-001",
        "title": "Boston Dynamics Unveils Atlas Gen-3: Humanoid Robot Achieves Human-Level Dexterity Milestone",
        "summary": "Boston Dynamics has officially unveiled the third generation of its Atlas humanoid robot, claiming it has achieved human-level dexterity in complex manipulation tasks. The robot can now assemble small electronic components, perform surgical-grade procedures in simulation, and adapt to unstructured environments without pre-programming.",
        "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop",
        "video": "https://www.youtube.com/watch?v=29ECwExc-_M",
        "source": "MIT Technology Review",
        "url": "#",
        "tags": ["Boston Dynamics", "Humanoid", "Dexterity"],
        "timestamp": "2026-04-06T08:00:00Z"
      },
      "articles": [
        {
          "id": "art-001",
          "title": "Tesla Optimus Achieves 1 Million Hours of Autonomous Factory Operation",
          "summary": "Tesla's Optimus humanoid robots have collectively logged over one million hours of autonomous operation at the Gigafactory in Austin, marking a major reliability milestone for commercial humanoid deployment.",
          "image": "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=250&fit=crop",
          "source": "Electrek",
          "url": "#",
          "tags": ["Tesla", "Optimus", "Factory"],
          "timestamp": "2026-04-06T07:30:00Z"
        },
        {
          "id": "art-002",
          "title": "China's UnitreeH1 Breaks World Record in Robot Marathon with 42km Completion",
          "summary": "Unitree Robotics' H1 humanoid completed a full marathon in 4 hours 22 minutes, surpassing previous robotic endurance records and demonstrating advances in energy efficiency and gait optimization.",
          "image": "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=250&fit=crop",
          "video": "https://www.youtube.com/watch?v=tF4DML7FIWk",
          "source": "IEEE Spectrum",
          "url": "#",
          "tags": ["Unitree", "Marathon", "Record"],
          "timestamp": "2026-04-06T06:15:00Z"
        },
        {
          "id": "art-003",
          "title": "NASA's MOXIE Successor Robot Produces Breathable Oxygen on Mars Surface",
          "summary": "NASA's next-generation MOXIE-2 robotic system aboard Perseverance 2 has successfully produced enough oxygen to sustain one human for 24 hours, a critical step toward long-term Mars colonization.",
          "image": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=250&fit=crop",
          "source": "NASA JPL",
          "url": "#",
          "tags": ["NASA", "Mars", "Space Robotics"],
          "timestamp": "2026-04-06T05:00:00Z"
        },
        {
          "id": "art-004",
          "title": "OpenAI Releases RoboAgent-1: Foundation Model for Physical Robot Control",
          "summary": "OpenAI has launched RoboAgent-1, a multimodal foundation model fine-tuned for physical robot manipulation. Early benchmarks show it outperforms task-specific models across 47 of 50 standardized manipulation benchmarks.",
          "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
          "source": "OpenAI Blog",
          "url": "#",
          "tags": ["OpenAI", "AI Model", "Foundation Model"],
          "timestamp": "2026-04-06T04:00:00Z"
        },
        {
          "id": "art-005",
          "title": "EU Passes Landmark Robot Rights Framework: AI Sentience Tests Required by 2028",
          "summary": "The European Parliament has passed the Artificial Sentience Assessment Act, requiring all humanoid robots sold in the EU to undergo standardized consciousness testing by 2028, sparking global debate among AI ethicists.",
          "image": "https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=400&h=250&fit=crop",
          "source": "Reuters Tech",
          "url": "#",
          "tags": ["EU", "Regulation", "Ethics"],
          "timestamp": "2026-04-06T03:30:00Z"
        },
        {
          "id": "art-006",
          "title": "Agility Robotics Digit v4 Deployed in 200 Amazon Warehouses Globally",
          "summary": "Amazon has expanded its partnership with Agility Robotics, deploying 10,000 Digit v4 units across 200 fulfillment centers worldwide. The robots handle sorting, stacking, and package movement with 99.7% accuracy.",
          "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
          "source": "The Verge",
          "url": "#",
          "tags": ["Amazon", "Agility", "Warehouse"],
          "timestamp": "2026-04-06T02:00:00Z"
        },
        {
          "id": "art-007",
          "title": "DARPA's SwarmBot Project Demonstrates 1000-Robot Autonomous Coordination",
          "summary": "DARPA's SwarmBot initiative successfully demonstrated 1,000 ground robots coordinating autonomously in a simulated urban environment, with no human intervention required for mission adaptation.",
          "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop",
          "source": "Defense News",
          "url": "#",
          "tags": ["DARPA", "Swarm", "Military"],
          "timestamp": "2026-04-06T01:00:00Z"
        },
        {
          "id": "art-008",
          "title": "Surgical Robot da Vinci 5 Performs First Fully Autonomous Appendectomy",
          "summary": "Intuitive Surgical's da Vinci 5 system, operating in full autonomous mode under physician supervision, completed a laparoscopic appendectomy in 34 minutes — 22% faster than the human-assisted average.",
          "image": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
          "source": "MedCity News",
          "url": "#",
          "tags": ["Medical", "Surgery", "Autonomous"],
          "timestamp": "2026-04-05T23:00:00Z"
        },
        {
          "id": "art-009",
          "title": "Spot Enterprise Robots Map and Monitor Tokyo's Aging Sewer Infrastructure",
          "summary": "Tokyo Metropolitan Government has contracted 50 Boston Dynamics Spot Enterprise units to autonomously inspect and map 13,000 km of sewer infrastructure, reducing inspection costs by 60%.",
          "image": "https://images.unsplash.com/photo-1545987796-200677ee1011?w=400&h=250&fit=crop",
          "source": "Japan Times",
          "url": "#",
          "tags": ["Spot", "Infrastructure", "Japan"],
          "timestamp": "2026-04-05T21:00:00Z"
        },
        {
          "id": "art-010",
          "title": "Figure AI Raises $2.1B Series C, Valuation Reaches $12B",
          "summary": "Figure AI, the humanoid robotics startup, has closed a $2.1 billion Series C funding round led by Microsoft and BlackRock, pushing its valuation to $12 billion and accelerating commercialization plans.",
          "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop",
          "source": "TechCrunch",
          "url": "#",
          "tags": ["Figure AI", "Funding", "Startup"],
          "timestamp": "2026-04-05T20:00:00Z"
        }
      ]
    },

    '2026-04-05': {
      "date": "2026-04-05",
      "featured": {
        "id": "featured-002",
        "title": "Google DeepMind's RT-3 Robot Learns New Tasks from Single Video Demonstration",
        "summary": "Google DeepMind unveiled RT-3 (Robotics Transformer 3), a robot that can learn to perform new physical tasks by watching a single YouTube video. The system uses a novel cross-modal attention mechanism to translate visual instructions into physical actions with 89% success rate on first attempt.",
        "image": "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=600&fit=crop",
        "video": "https://www.youtube.com/watch?v=fRj34o4hN4I",
        "source": "Google DeepMind Blog",
        "url": "#",
        "tags": ["Google DeepMind", "RT-3", "Learning"],
        "timestamp": "2026-04-05T09:00:00Z"
      },
      "articles": [
        {
          "id": "art-011",
          "title": "Xiaomi CyberOne 2 Begins Mass Production: $18,000 Consumer Humanoid",
          "summary": "Xiaomi has started mass production of CyberOne 2, targeting the consumer market at $18,000 — the lowest price point for a full humanoid robot yet, with 28 degrees of freedom and 12-hour battery life.",
          "image": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=250&fit=crop",
          "source": "South China Morning Post",
          "url": "#",
          "tags": ["Xiaomi", "Consumer", "Price"],
          "timestamp": "2026-04-05T08:00:00Z"
        },
        {
          "id": "art-012",
          "title": "MIT CSAIL Develops Soft Robot that Repairs Its Own Damage Mid-Task",
          "summary": "MIT's Computer Science and AI Lab has created a soft robotic gripper that can detect structural damage and autonomously repair itself using embedded shape-memory polymer actuators, without interrupting ongoing tasks.",
          "image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop",
          "source": "MIT News",
          "url": "#",
          "tags": ["MIT", "Soft Robotics", "Self-Repair"],
          "timestamp": "2026-04-05T07:00:00Z"
        },
        {
          "id": "art-013",
          "title": "Waymo's RoboTaxi Fleet Crosses 500 Million Autonomous Miles",
          "summary": "Waymo announced its fully driverless fleet has surpassed 500 million miles of autonomous operation across San Francisco, Phoenix, and Austin, with a safety record 8x better than the human driving average.",
          "image": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop",
          "source": "Waymo Blog",
          "url": "#",
          "tags": ["Waymo", "Autonomous Driving", "Milestone"],
          "timestamp": "2026-04-05T06:00:00Z"
        },
        {
          "id": "art-014",
          "title": "Stanford HAI Report: Robots Will Displace 18% of Manual Labor Jobs by 2030",
          "summary": "Stanford's Human-Centered AI Institute released its 2026 annual report, projecting that advanced robotics will automate 18% of manual labor roles globally by 2030, with warehouse and food service sectors most affected.",
          "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
          "source": "Stanford HAI",
          "url": "#",
          "tags": ["Research", "Labor", "Economics"],
          "timestamp": "2026-04-05T05:00:00Z"
        },
        {
          "id": "art-015",
          "title": "Hyundai Boston Dynamics Merger Produces First Joint Platform: HYBOT-1",
          "summary": "Following their 2021 acquisition, Hyundai and Boston Dynamics have launched HYBOT-1, a hybrid platform combining Boston Dynamics' locomotion research with Hyundai's automotive-grade manufacturing quality.",
          "image": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=250&fit=crop",
          "source": "Bloomberg Tech",
          "url": "#",
          "tags": ["Hyundai", "Boston Dynamics", "Platform"],
          "timestamp": "2026-04-05T04:00:00Z"
        }
      ]
    }
  };

  // In-memory cache（兼容未来 fetch 扩展）
  const _cache = {};

  /**
   * 获取指定日期的新闻数据（支持多语言）。
   * 优先级：
   *   1. window.__NEWS_DATA_LOCALES__[locale][dateStr]   ← per-locale bundle
   *   2. fallback chain for locale                       ← 逐级 fallback
   *   3. window.__NEWS_DATA__[dateStr]                   ← legacy en-US bundle
   *   4. NEWS_DB[dateStr]                                ← inline data
   *   5. fetch news/<dateStr>/<locale>.json              ← HTTP server mode
   *   6. fetch news/<dateStr>.json                       ← legacy flat file
   *
   * @param {string} dateStr  'YYYY-MM-DD'
   * @param {string} [locale] BCP47 locale code; defaults to I18n.getLocale()
   */
  async function fetchDate(dateStr, locale) {
    if (!locale) {
      locale = (typeof I18n !== 'undefined') ? I18n.getLocale() : 'en-US';
    }

    // Build locale fallback chain to try in order
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
    const localeChain = [locale, ...(FALLBACKS[locale] || []), 'en-US'];

    // 1 & 2. per-locale bundle (window.__NEWS_DATA_LOCALES__)
    if (window.__NEWS_DATA_LOCALES__) {
      for (const loc of localeChain) {
        const locData = window.__NEWS_DATA_LOCALES__[loc];
        if (locData && locData[dateStr]) return locData[dateStr];
      }
    }

    // 3. Legacy en-US bundle
    if (window.__NEWS_DATA__ && window.__NEWS_DATA__[dateStr]) {
      return window.__NEWS_DATA__[dateStr];
    }

    // 4. Inline data (existing NEWS_DB, English only)
    if (NEWS_DB[dateStr]) return NEWS_DB[dateStr];

    // 5. Cache
    const cacheKey = `${dateStr}/${locale}`;
    if (_cache[cacheKey]) return _cache[cacheKey];

    // 6. HTTP server mode: try locale-specific then flat fallback
    const urlsToTry = [
      `news/${dateStr}/${locale}.json`,
      `news/${dateStr}.json`,
    ];
    for (const url of urlsToTry) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        _cache[cacheKey] = data;
        return data;
      } catch (_) {}
    }

    console.error(`[NewsData] Failed to load data for ${dateStr}/${locale}`);
    return null;
  }

  function getAvailableDates() {
    return [...AVAILABLE_DATES];
  }

  function formatDateLabel(dateStr) {
    // Parse YYYY-MM-DD parts directly to avoid UTC/local-midnight ambiguity.
    const [y, m, day] = dateStr.split('-').map(Number);
    const now = new Date();
    const [ty, tm, td] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];

    const diff = Math.round(
      (new Date(y, m - 1, day) - new Date(ty, tm - 1, td)) / 86400000
    );

    const i18n = (typeof I18n !== 'undefined') ? I18n : null;
    if (diff === 0)  return i18n ? i18n.t('TODAY')     : 'TODAY';
    if (diff === -1) return i18n ? i18n.t('YESTERDAY') : 'YESTERDAY';

    const dateLocale = i18n ? i18n.getDateLocale() : 'en-US';
    return new Date(y, m - 1, day)
      .toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' })
      .toUpperCase();
  }

  function relativeTime(isoStr) {
    const diff = (Date.now() - new Date(isoStr).getTime()) / 1000;
    const i18n = (typeof I18n !== 'undefined') ? I18n : null;
    if (!i18n) {
      if (diff < 60)    return `${Math.floor(diff)}s ago`;
      if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    }
    if (diff < 60)    return i18n.t('N_SECONDS_AGO', { n: Math.floor(diff) });
    if (diff < 3600)  return i18n.t('N_MINUTES_AGO', { n: Math.floor(diff / 60) });
    if (diff < 86400) return i18n.t('N_HOURS_AGO',   { n: Math.floor(diff / 3600) });
    return i18n.t('N_DAYS_AGO', { n: Math.floor(diff / 86400) });
  }

  return { fetchDate, getAvailableDates, formatDateLabel, relativeTime };
})();
