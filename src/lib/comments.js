const COMMENTS_KEY = "postComments";

function loadAll() {
  try { return JSON.parse(localStorage.getItem(COMMENTS_KEY) || "{}"); } catch { return {}; }
}

function saveAll(map) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(map));
}

export function listComments(slug, { includeHidden = false } = {}) {
  const map = loadAll();
  const arr = map[slug] || [];
  return includeHidden ? arr : arr.filter(c => !c.hidden && !c.deleted);
}

export function addComment(slug, { authorId, authorName, content }) {
  const map = loadAll();
  const arr = map[slug] || [];
  const c = { id: crypto.randomUUID(), authorId, authorName, content, createdAt: Date.now(), hidden: false, deleted: false };
  arr.push(c);
  map[slug] = arr;
  saveAll(map);
  return c;
}

export function hideComment(slug, id, hidden = true) {
  const map = loadAll();
  const arr = map[slug] || [];
  const idx = arr.findIndex(c => c.id === id);
  if (idx !== -1) { arr[idx].hidden = !!hidden; saveAll(map); }
}

export function deleteComment(slug, id) {
  const map = loadAll();
  const arr = map[slug] || [];
  const idx = arr.findIndex(c => c.id === id);
  if (idx !== -1) { arr[idx].deleted = true; saveAll(map); }
}
