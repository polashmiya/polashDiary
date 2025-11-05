import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostEditor from "../components/PostEditor";
import { addPost } from "../lib/posts";
import { useAuth } from "../hooks/useAuth";

function slugify(text = "") {
  const s = text.toString().toLowerCase().trim();
  let out = "";
  let lastDash = false;
  for (const ch of s) {
    const code = ch.codePointAt(0);
    const isAlnum = (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
    if (isAlnum) {
      out += ch;
      lastDash = false;
      continue;
    }
    if (!lastDash && out.length > 0) {
      out += "-";
      lastDash = true;
    }
  }
  // trim trailing dash
  if (out.endsWith("-")) out = out.slice(0, -1);
  return out;
}

const CATEGORIES = ["Frontend", "Backend", "DevOps", "QA", "Others"]; 

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [html, setHtml] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug && title) setSlug(slugify(title));
  }, [title, slug]);

  const submit = async (status) => {
    if (!title || !slug) return;
    setSaving(true);
    try {
      addPost({
        title,
        slug,
        category,
        content: html || "<p></p>",
        authorId: user.id,
        authorName: user.name,
        featuredImage,
        status,
      });
      navigate(`/post/${slug}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Create a Post</h1>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
            <input id="title" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Your amazing title" />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-slate-700">Slug</label>
            <input id="slug" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" value={slug} onChange={(e)=>setSlug(slugify(e.target.value))} placeholder="auto-generated-from-title" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
            <select id="category" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" value={category} onChange={(e)=>setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-slate-700">Featured image URL (optional)</label>
            <input id="featuredImage" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" value={featuredImage} onChange={(e)=>setFeaturedImage(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div>
      <div className="block text-sm font-medium text-slate-700 mb-2">Content</div>
      <PostEditor value={html} onChange={setHtml} />
        </div>

        <div className="flex items-center gap-3">
          <button disabled={saving} onClick={()=>submit("draft")} className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-60">Save draft</button>
          <button disabled={saving} onClick={()=>submit("published")} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60">Publish</button>
        </div>
      </div>
    </div>
  );
}

