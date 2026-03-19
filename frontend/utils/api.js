/**
 * Wikipedia-powered data layer.
 * No backend required — everything goes directly to the Wikipedia REST API.
 *
 * Endpoints used:
 *   https://en.wikipedia.org/api/rest_v1/page/summary/{title}
 *   https://en.wikipedia.org/w/api.php   (search, links, categories, categorymembers)
 */

const WP_REST   = 'https://en.wikipedia.org/api/rest_v1';
const WP_ACTION = 'https://en.wikipedia.org/w/api.php';

// ─── category detection ────────────────────────────────────────────────────
const CAT_RULES = [
  { cat: 'mathematics', re: /math|calculus|algebra|geometry|statistics|probability|theorem|number|topology|logic/i },
  { cat: 'science',     re: /physics|chemistry|biology|quantum|evolution|genetics|molecule|atom|thermodynam|relativity|neuroscien/i },
  { cat: 'technology',  re: /computer|software|hardware|internet|algorithm|AI|machine learning|neural|robot|cipher|cryptograph/i },
  { cat: 'history',     re: /history|war|empire|ancient|medieval|revolution|dynasty|century|civilisation|civilization|archaeological/i },
  { cat: 'philosophy',  re: /philosophy|ethics|ontology|epistemology|consciousness|mind|existential|metaphysics|logic/i },
  { cat: 'arts',        re: /music|art|film|literature|poetry|theatre|theater|painting|architecture|jazz|classical|novel/i },
  { cat: 'nature',      re: /ecology|ecosystem|ocean|forest|climate|weather|animal|plant|species|biodiversity|geology/i },
  { cat: 'society',     re: /society|culture|politics|economics|psychology|sociology|religion|language|anthropology/i },
];

const CAT_COLORS = {
  mathematics: '#22d3ee', science: '#4af0d0', technology: '#4a9eff',
  history:     '#ffb347', philosophy: '#c084fc', arts: '#f472b6',
  nature:      '#4ade80', society: '#fb923c',   other: '#a78bfa',
};

const CAT_ICONS = {
  mathematics: '∑',  science: '🔬', technology: '💻', history: '📜',
  philosophy:  '🧠', arts: '🎨',    nature: '🌿',     society: '🏛️', other: '🔵',
};

function detectCategory(title, description = '') {
  const text = `${title} ${description}`;
  for (const { cat, re } of CAT_RULES) if (re.test(text)) return cat;
  return 'other';
}

// ─── slug helper ───────────────────────────────────────────────────────────
const toSlug = (t) => encodeURIComponent(t.trim().replace(/ /g, '_'));

// ─── fetch a Wikipedia summary ─────────────────────────────────────────────
async function wpSummary(title) {
  const res = await fetch(`${WP_REST}/page/summary/${toSlug(title)}`, {
    headers: { 'Api-User-Agent': 'RabbitHoleExplorer/1.0' },
  });
  if (!res.ok) throw new Error(`No Wikipedia page for "${title}"`);
  return res.json();
}

// ─── search Wikipedia (fuzzy match) ───────────────────────────────────────
async function wpSearch(query) {
  const params = new URLSearchParams({
    action: 'query', list: 'search', srsearch: query,
    srnamespace: 0, srlimit: 1, format: 'json', origin: '*',
  });
  const res  = await fetch(`${WP_ACTION}?${params}`);
  const data = await res.json();
  const hits = data?.query?.search;
  if (!hits?.length) throw new Error(`No results for "${query}"`);
  return hits[0].title;
}

// ─── get inline links from a page ─────────────────────────────────────────
async function wpLinks(title, limit = 40) {
  const params = new URLSearchParams({
    action: 'query', titles: title, prop: 'links',
    pllimit: limit, plnamespace: 0, format: 'json', origin: '*',
  });
  const res  = await fetch(`${WP_ACTION}?${params}`);
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});
  if (!pages.length) return [];
  return (pages[0].links || [])
    .map(l => l.title)
    .filter(l => !/^(Wikipedia|Help|Template|Category|Portal|File|Talk|User):/i.test(l));
}

// ─── get Wikipedia categories that a page belongs to ──────────────────────
async function wpPageCategories(title, limit = 20) {
  const params = new URLSearchParams({
    action: 'query', titles: title, prop: 'categories',
    cllimit: limit, format: 'json', origin: '*',
  });
  const res  = await fetch(`${WP_ACTION}?${params}`);
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});
  if (!pages.length) return [];
  return (pages[0].categories || [])
    .map(c => c.title.replace(/^Category:/, ''))
    .filter(c => !/^(Articles|Pages|Wikipedia|All |CS1|Use |Webarchive|Good |Featured )/i.test(c));
}

// ─── get members of a Wikipedia category ──────────────────────────────────
async function wpCategoryMembers(category, limit = 20) {
  const params = new URLSearchParams({
    action: 'query', list: 'categorymembers',
    cmtitle: `Category:${category}`,
    cmnamespace: 0, cmlimit: limit, format: 'json', origin: '*',
  });
  const res  = await fetch(`${WP_ACTION}?${params}`);
  const data = await res.json();
  return (data?.query?.categorymembers || []).map(m => m.title);
}

// ─── build a node from a Wikipedia summary ────────────────────────────────
function summaryToNode(summary, depth = 1, isCenter = false) {
  const cat  = detectCategory(summary.title, summary.extract || '');
  const tags = summary.title
    .split(/[\s,–\-]+/)
    .slice(0, 3)
    .map(w => w.toLowerCase())
    .filter(w => w.length > 3);
  return {
    id:               summary.key || summary.title.replace(/ /g, '_'),
    name:             summary.title,
    description:      summary.extract_html
      ? summary.extract_html.replace(/<[^>]+>/g, '').slice(0, 300)
      : (summary.extract || '').slice(0, 300),
    fullDescription:  (summary.extract || '').slice(0, 1200),
    short_description:(summary.extract || '').slice(0, 120),
    category:         cat,
    color:            CAT_COLORS[cat],
    icon:             CAT_ICONS[cat],
    tags,
    depth:            isCenter ? 0 : depth,
    thumbnail:        summary.thumbnail?.source || null,
    wikiUrl:          summary.content_urls?.desktop?.page || null,
    related_topics:   [],
  };
}

// ─── category-aware candidate picker ──────────────────────────────────────
// Strategy:
//   1. Fetch the page's own Wikipedia categories.
//   2. For each relevant category, fetch its members → these are topically
//      related articles in the same domain.
//   3. Combine with inline page links as a fallback pool.
//   4. Fetch summaries for all candidates, keep only those whose detected
//      category matches (or is adjacent to) the parent's category.
//   5. If not enough same-category results, fill up with the closest ones.

// Categories that are considered "adjacent" (share a domain)
const ADJACENT_CATS = {
  mathematics:  ['science', 'technology'],
  science:      ['mathematics', 'technology', 'nature'],
  technology:   ['science', 'mathematics'],
  history:      ['society', 'arts'],
  philosophy:   ['science', 'society', 'arts'],
  arts:         ['history', 'society', 'philosophy'],
  nature:       ['science', 'society'],
  society:      ['history', 'arts', 'philosophy'],
  other:        [],
};

function categoryScore(nodeCategory, parentCategory) {
  if (nodeCategory === parentCategory) return 2;
  if (ADJACENT_CATS[parentCategory]?.includes(nodeCategory)) return 1;
  return 0;
}

async function getCategoryAwareCandidates(title, parentCategory, targetCount = 6) {
  // 1. Page's own Wikipedia categories → pull members
  const pageCats = await wpPageCategories(title, 15);

  // pick up to 3 most relevant-sounding Wikipedia categories
  const relevantCats = pageCats
    .filter(c => {
      const lower = c.toLowerCase();
      // skip overly broad or maintenance cats
      return lower.length > 5 && !/^(\d{4}|births|deaths|living|stub|categories)/i.test(c);
    })
    .slice(0, 3);

  // 2. Fetch members from those categories in parallel
  const memberArrays = await Promise.allSettled(
    relevantCats.map(c => wpCategoryMembers(c, 20))
  );
  const categoryMembers = memberArrays
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(t => t !== title);

  // 3. Inline links as fallback pool
  const inlineLinks = await wpLinks(title, 40);

  // 4. Deduplicated candidate pool — category members first (more relevant)
  const seen = new Set([title]);
  const candidates = [];
  for (const t of [...categoryMembers, ...inlineLinks]) {
    if (!seen.has(t)) { seen.add(t); candidates.push(t); }
    if (candidates.length >= 24) break; // cap to avoid too many fetches
  }

  // 5. Fetch summaries in parallel, score by category match
  const results = await Promise.allSettled(candidates.map(t => wpSummary(t)));
  const scored = results
    .filter(r => r.status === 'fulfilled')
    .map(r => {
      const node  = summaryToNode(r.value, 1);
      const score = categoryScore(node.category, parentCategory);
      return { node, score };
    })
    .sort((a, b) => b.score - a.score);   // best matches first

  // return top N nodes
  return scored.slice(0, targetCount).map(s => s.node);
}

// ─── public API ────────────────────────────────────────────────────────────

/**
 * Search a topic → returns initial graph centred on it with category-aware children
 */
export async function searchTopic(query) {
  const exactTitle = await wpSearch(query);
  const summary    = await wpSummary(exactTitle);
  const center     = summaryToNode(summary, 0, true);

  const children = await getCategoryAwareCandidates(exactTitle, center.category, 6);

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
    const links   = await wpLinks(title, 20);
    node.related_topics = links.slice(0, 8);
    return { topic: node };
  } catch {
    return { topic: { id, name: title, description: 'Could not load Wikipedia data.', related_topics: [] } };
  }
}

/**
 * Expand a node → fetch category-aware children
 */
export async function getRelatedTopics(id) {
  const title  = id.replace(/_/g, ' ');

  // detect the parent's category from its own summary
  let parentCategory = 'other';
  try {
    const summary    = await wpSummary(title);
    parentCategory   = detectCategory(summary.title, summary.extract || '');
  } catch { /* fall through with 'other' */ }

  const children = await getCategoryAwareCandidates(title, parentCategory, 6);

  const edges = children.map(c => ({
    id:     `${id}→${c.id}`,
    source: id,
    target: c.id,
  }));

  return { nodes: children, edges, parentId: id };
}

// ─── Backend API helpers (auth + favourites) ──────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiFetch(path, options = {}) {
  const { token, ...fetchOpts } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res  = await fetch(`${API_BASE}${path}`, { ...fetchOpts, headers });
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