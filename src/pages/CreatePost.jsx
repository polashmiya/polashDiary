import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostEditor from "../components/PostEditor";
import { createPost } from "../lib/posts";
import { useAuth } from "../hooks/useAuth";

const CATEGORIES = ["Frontend", "Backend", "DevOps", "QA", "Others"]; 

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [html, setHtml] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [saving, setSaving] = useState(false);

  // Hide page scrollbar while on the Create page
  useEffect(() => {
    document.body.classList.add("no-scrollbar");
    return () => {
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  const submit = async () => {
    if (!title) return;
    setSaving(true);
    try {
      const created = await createPost({
        title,
        imageUrl: featuredImage,
        content: html || "<p></p>",
        category,
        author: user.id,
      });
      const id = created?._id || created?.id;
      navigate(`/post/${id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Create a Post</h1>

      <div className="mt-6 grid gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
          <input id="title" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-green-500 focus:outline-none" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Your amazing title" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
            <select id="category" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-green-500 focus:outline-none" value={category} onChange={(e)=>setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-slate-700">Featured image URL (optional)</label>
            <input id="featuredImage" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-green-500 focus:outline-none" value={featuredImage} onChange={(e)=>setFeaturedImage(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div>
      <div className="block text-sm font-medium text-slate-700 mb-2">Content</div>
      <PostEditor value={html} onChange={setHtml} />
        </div>

        <div className="flex items-center gap-3">
          <button disabled={saving} onClick={submit} className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            {saving ? "Saving..." : "Save draft"}
          </button>
          <button disabled={saving} onClick={submit} className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60">
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

