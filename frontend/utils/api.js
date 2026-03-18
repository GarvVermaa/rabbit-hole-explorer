/**
 * Wikipedia-powered data layer.
 * No backend required — everything goes directly to the Wikipedia REST API.
 *
 * Endpoints used:
 *   https://en.wikipedia.org/api/rest_v1/page/summary/{title}
 *   https://en.wikipedia.org/w/api.php   (for links / search)
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
  // filter out meta pages (Wikipedia:, Help:, Template:, etc.)
  return links.filter(l => !/^(Wikipedia|Help|Template|Category|Portal|File|Talk|User):/i.test(l));
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
    related_topics: [], // filled in after
  };
}

// ─── pick N diverse child links to actually fetch ─────────────────────────
function pickLinks(links, n = 6) {
  // shuffle and pick first n
  const shuffled = [...links].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ─── public API ────────────────────────────────────────────────────────────

/**
 * Search a topic → returns initial graph centred on it with 5-7 children
 */
export async function searchTopic(query) {
  // 1. Find best matching Wikipedia title
  const exactTitle = await wpSearch(query);
  const summary    = await wpSummary(exactTitle);
  const center     = summaryToNode(summary, 0, true);

  // 2. Get links from the page
  const allLinks = await wpLinks(exactTitle, 40);
  const chosen   = pickLinks(allLinks, 6);

  // 3. Fetch summaries for children (parallel, ignore failures)
  const childSummaries = await Promise.allSettled(chosen.map(t => wpSummary(t)));
  const children = childSummaries
    .filter(r => r.status === 'fulfilled')
    .map(r => summaryToNode(r.value, 1));

  // update center's related_topics
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
 * Get full topic detail (re-fetch summary for freshest data)
 */
export async function getTopicById(id) {
  const title = id.replace(/_/g, ' ');
  try {
    const summary = await wpSummary(title);
    const node    = summaryToNode(summary, 0, true);
    // get related_topics list without full fetch
    const links = await wpLinks(title, 20);
    node.related_topics = links.slice(0, 8);
    return { topic: node };
  } catch {
    return { topic: { id, name: title, description: 'Could not load Wikipedia data.', related_topics: [] } };
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

// ─── Backend API helpers ──────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiFetch(path, options = {}) {
  const { token, ...fetchOpts } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...fetchOpts, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data.data;
}

export async function apiLogin(email, password) {
  return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function apiRegister(email, password) {
  return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function apiLogout(token) {
  return apiFetch('/auth/logout', { method: 'POST', token });
}

export async function apiGetProfile(token) {
  return apiFetch('/auth/me', { token });
}

export async function apiGetFavourites(token) {
  return apiFetch('/favourites', { token });
}

export async function apiSaveFavourite(token, { title, path }) {
  return apiFetch('/favourites', { method: 'POST', token, body: JSON.stringify({ title, path }) });
}

export async function apiDeleteFavourite(token, id) {
  return apiFetch(`/favourites/${id}`, { method: 'DELETE', token });
}
