const POSTS_KEY = "userPosts"; // user-generated posts

export function loadUserPosts() {
  try { return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]"); } catch { return []; }
}

export function saveUserPosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function addPost({ title, slug, category, content, authorId, authorName, featuredImage, status = "draft" }) {
  const posts = loadUserPosts();
  const id = crypto.randomUUID();
  const date = new Date().toISOString().slice(0,10);
  const description = stripHtml(content).slice(0, 160);
  const post = { id, slug, title, category, date, author: authorName, authorId, featuredImage, description, content, status };
  posts.push(post);
  saveUserPosts(posts);
  return post;
}

export function listAllPosts(staticPosts) {
  const userPosts = loadUserPosts().filter(p => p.status !== "deleted");
  // Merge by slug (user posts can override by slug if same)
  const map = new Map();
  staticPosts.forEach(p => map.set(p.slug, p));
  userPosts.forEach(p => map.set(p.slug, p));
  return Array.from(map.values());
}

export function listUserPosts(authorId) {
  return loadUserPosts().filter(p => p.authorId === authorId && p.status !== "deleted");
}

export function updatePostStatus(slug, status) {
  const posts = loadUserPosts();
  const idx = posts.findIndex(p => p.slug === slug);
  if (idx !== -1) {
    posts[idx].status = status;
    saveUserPosts(posts);
  }
}
