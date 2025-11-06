import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { addPost, listUserPosts, updatePostStatus } from "../lib/posts";

export default function AuthorDashboard() {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: "", slug: "", category: "Frontend", featuredImage: "", content: "" });
  const [posts, setPosts] = useState(listUserPosts(user?.id));

  const create = (status) => (e) => {
    e.preventDefault();
    if (!form.slug) return;
    addPost({ ...form, authorId: user.id, authorName: user.name, status });
    setForm({ title: "", slug: "", category: "Frontend", featuredImage: "", content: "" });
    setPosts(listUserPosts(user.id));
  };

  const setStatus = (slug, status) => {
    updatePostStatus(slug, status);
    setPosts(listUserPosts(user.id));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold">Author Dashboard</h1>
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Write a post</h2>
        <form className="space-y-3" onSubmit={e=>e.preventDefault()}>
          <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
          <input className="w-full border rounded px-3 py-2" placeholder="Slug" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} required />
          <input className="w-full border rounded px-3 py-2" placeholder="Featured Image URL" value={form.featuredImage} onChange={e=>setForm({...form,featuredImage:e.target.value})} />
          <select className="w-full border rounded px-3 py-2" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            <option>Frontend</option>
            <option>Backend</option>
            <option>DevOps</option>
            <option>QA</option>
            <option>Others</option>
          </select>
          <textarea className="w-full border rounded px-3 py-2" rows={6} placeholder="Content (Markdown)" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} />
          <div className="flex gap-2">
            <button className="rounded bg-slate-900 text-white px-4 py-2" onClick={create("draft")}>Save Draft</button>
            <button className="rounded bg-green-600 text-white px-4 py-2" onClick={create("published")}>Publish</button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Your Posts</h2>
        <ul className="divide-y border rounded">
          {posts.map(p => (
            <li key={p.slug} className="px-3 py-2 text-sm flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-slate-500">{p.status} • {p.category}</div>
              </div>
              <div className="flex items-center gap-2">
                {p.status !== "published" && <button className="border rounded px-2 py-1" onClick={()=>setStatus(p.slug, "published")}>Publish</button>}
                {p.status !== "draft" && <button className="border rounded px-2 py-1" onClick={()=>setStatus(p.slug, "draft")}>Draft</button>}
                <button className="border rounded px-2 py-1" onClick={()=>setStatus(p.slug, "deleted")}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
