import { api } from "./api";

// Add a comment to a post
// POST /posts/:id/comments  { text: string }
export async function addComment(postId, { text }) {
  if (!postId) throw new Error("postId is required");
  if (!text || !text.trim()) throw new Error("Comment text is required");
  return api.post(`/posts/${postId}/comments`, { text: text.trim() });
}

// Listing/moderation should be done via the post details endpoint. No client-side store here.
