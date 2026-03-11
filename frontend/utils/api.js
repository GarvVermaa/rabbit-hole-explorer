/**
 * Wikipedia + YouTube data layer.
 * No backend required — everything goes directly to public APIs.
 *
 * Wikipedia Endpoints:
 *   https://en.wikipedia.org/api/rest_v1/page/summary/{title}
 *   https://en.wikipedia.org/w/api.php   (for links / search)
 *
 * YouTube:
 *   We build a YouTube search URL so users can click through to results.
 *   For embedded previews we use the YouTube oEmbed endpoint (no API key needed).
 */

const WP_REST   = 'https://en.wikipedia.org/api/rest_v1';
const WP_ACTION = 'https://en.wikipedia.org/w/api.php';

// ─── category detection ────────────────────────────────────────────────────
const CAT_RULES = [
  { cat:'mathematics',  re:/math|calculus|algebra|geometry|statistics|probability|theorem|number|topology|logic/i },
  { cat:'science',      re:/physics|chemistry|biology|quantum|evolution|genetics|molecule|atom|thermodynam|relativity|neuroscien/i },
  { cat:'technology',   re:/computer|software|hardware|internet|algorithm|AI|machine learning|neural|robot|cipher|cryptograph/i },
  { cat:'history',      re:/history|war|empire|ancient|medieval|revolution|dynasty|century|civilisation|civilization|archaeological/i },
  { cat:'philosophy',   re:/philosophy|ethics|ontology|epistemology|consciousness|mind|existential|metaphysics|logic/i },
  { cat:'arts',         re:/music|art|film|literature|poetry|theatre|theater|painting|architecture|jazz|classical|novel/i },
  { cat:'nature',       re:/ecology|ecosystem|ocean|forest|climate|weather|animal|plant|species|biodiversity|geology/i },
  { cat:'society',      re:/society|culture|politics|economics|psychology|sociology|religion|language|anthropology/i },
];

const CAT_COLORS = {
  mathematics: '#22d3ee', science: '#4af0d0', technology: '#4a9eff',
  history: '#ffb347',    philosophy: '#c084fc', arts: '#f472b6',
  nature: '#4ade80',     society: '#fb923c',    other: '#a78bfa',
};

const CAT_ICONS = {
  mathematics:'∑', science:'🔬', technology:'💻', history:'📜',
  philosophy:'🧠', arts:'🎨',    nature:'🌿',     society:'🏛️', other:'🔵',
};

function detectCategory(title, description = '') {
  const text = `${title} ${description}`;
  for (const { cat, re } of CAT_RULES) if (re.test(text)) return cat;
  return 'other';
}

// ─── title → slug (Wikipedia page key) ────────────────────────────────────
const toSlug = (t) => encodeURIComponent(t.trim().replace(/ /g, '_'));

// ─── fetch Wikipedia summary ───────────────────────────────────────────────
async function wpSummary(title) {
  const res = await fetch(`${WP_REST}/page/summary/${toSlug(title)}`, {
    headers: { 'Api-User-Agent': 'RabbitHoleExplorer/1.0' },
  });
  if (!res.ok) throw new Error(`No Wikipedia page for "${title}"`);
  return res.json();
}

// ─── search Wikipedia (autocomplete / fuzzy) ──────────────────────────────
async function wpSearch(query) {
  const params = new URLSearchParams({
    action: 'query', list: 'search', srsearch: query,
    srnamespace: 0, srlimit: 1, format: 'json', origin: '*',
  });
  const res = await fetch(`${WP_ACTION}?${params}`);
  const data = await res.json();
  const hits = data?.query?.search;
  if (!hits?.length) throw new Error(`No results for "${query}"`);
  return hits[0].title;
}

// ─── get links (related articles) from a page ─────────────────────────────
async function wpLinks(title, limit = 30) {
  const params = new URLSearchParams({
    action: 'query', titles: title, prop: 'links',
    pllimit: limit, plnamespace: 0, format: 'json', origin: '*',
  });
  const res  = await fetch(`${WP_ACTION}?${params}`);
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});
  if (!pages.length) return [];
  const links = (pages[0].links || []).map(l => l.title);
  // filter out meta pages
  return links.filter(l => !/^(Wikipedia|Help|Template|Category|Portal|File|Talk|User):/i.test(l));
}

// ─── build YouTube search URL for a topic ─────────────────────────────────
export function getYouTubeSearchUrl(topicName) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(topicName + ' explained')}`;
}

// ─── fetch a YouTube video via oEmbed (no API key) ────────────────────────
// Uses Invidious public instance to get video IDs without an API key
export async function getYouTubeVideos(topicName) {
  try {
    // Use Invidious public API (no key needed) to search for videos
    const query = encodeURIComponent(topicName + ' explained');
    const res = await fetch(`https://inv.nadeko.net/api/v1/search?q=${query}&type=video&page=1`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('Invidious search failed');
    const results = await res.json();
    return (results || []).slice(0, 3).map(v => ({
      videoId: v.videoId,
      title: v.title,
      author: v.author,
      thumbnail: `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`,
      youtubeUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
    }));
  } catch {
    // Fallback: return a direct YouTube search link instead of individual videos
    return [];
  }
}

// ─── build a node object from a Wikipedia summary ─────────────────────────
function summaryToNode(summary, depth = 1, isCenter = false) {
  const cat = detectCategory(summary.title, summary.extract || '');
  const tags = summary.title.split(/[\s,–-]+/).slice(0, 3).map(w => w.toLowerCase()).filter(w => w.length > 3);
  return {
    id:          summary.key || summary.title.replace(/ /g, '_'),
    name:        summary.title,
    description: summary.extract_html
      ? summary.extract_html.replace(/<[^>]+>/g, '').slice(0, 300)
      : (summary.extract || '').slice(0, 300),
    fullDescription: (summary.extract || '').slice(0, 1200),
    short_description: (summary.extract || '').slice(0, 120),
    category:    cat,
    color:       CAT_COLORS[cat],
    icon:        CAT_ICONS[cat],
    tags,
    depth:       isCenter ? 0 : depth,
    thumbnail:   summary.thumbnail?.source || null,
    wikiUrl:     summary.content_urls?.desktop?.page || null,
    youtubeSearchUrl: getYouTubeSearchUrl(summary.title),
    related_topics: [],
  };
}

// ─── pick N diverse child links to actually fetch ─────────────────────────
function pickLinks(links, n = 6) {
  const shuffled = [...links].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ─── public API ────────────────────────────────────────────────────────────

/**
 * Search a topic → returns initial graph centred on it with 5-7 children
 */
export async function searchTopic(query) {
  const exactTitle = await wpSearch(query);
  const summary    = await wpSummary(exactTitle);
  const center     = summaryToNode(summary, 0, true);

  const allLinks = await wpLinks(exactTitle, 40);
  const chosen   = pickLinks(allLinks, 6);

  const childSummaries = await Promise.allSettled(chosen.map(t => wpSummary(t)));
  const children = childSummaries
    .filter(r => r.status === 'fulfilled')
    .map(r => summaryToNode(r.value, 1));

  center.related_topics = children.map(c => c.name);

  const nodes = [center, ...children];
  const edges = children.map(c => ({
    id:     `${center.id}→${c.id}`,
    source: center.id,
    target: c.id,
  }));

  return {
    graph: { nodes, edges },
    centralTopic: center,
    query,
  };
}

/**
 * Get full topic detail (re-fetch summary + YouTube videos)
 */
export async function getTopicById(id) {
  const title = id.replace(/_/g, ' ');
  try {
    const [summary, videos] = await Promise.all([
      wpSummary(title),
      getYouTubeVideos(title),
    ]);
    const node = summaryToNode(summary, 0, true);
    const links = await wpLinks(title, 20);
    node.related_topics = links.slice(0, 8);
    node.videos = videos;
    return { topic: node };
  } catch {
    return { topic: { id, name: title, description: 'Could not load Wikipedia data.', related_topics: [], videos: [] } };
  }
}

/**
 * Expand a node → fetch its children from Wikipedia
 */
export async function getRelatedTopics(id) {
  const title    = id.replace(/_/g, ' ');
  const allLinks = await wpLinks(title, 40);
  const chosen   = pickLinks(allLinks, 6);

  const childSummaries = await Promise.allSettled(chosen.map(t => wpSummary(t)));
  const children = childSummaries
    .filter(r => r.status === 'fulfilled')
    .map(r => summaryToNode(r.value, 1));

  const edges = children.map(c => ({
    id:     `${id}→${c.id}`,
    source: id,
    target: c.id,
  }));

  return { nodes: children, edges, parentId: id };
}
