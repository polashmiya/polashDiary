import { api } from "./api";

export async function getPosts({ search } = {}) {
  const params = search && search.trim() ? { search: search.trim() } : undefined;
  const data = await api.get("/posts", { params });
  return Array.isArray(data) ? data : (data?.posts || []);
}

export async function getPostById(id) {
  const data = await api.get(`/posts/${id}`);
  return data?.post || data;
}

export async function createPost({ title, imageUrl, content, category, author }) {
  const created = await api.post("/posts", { title, imageUrl: imageUrl || null, content, category, author });
  return created?.post || created;
}
