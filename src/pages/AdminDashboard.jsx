import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Roles, listUsers, setUserActive, createUser } from "../lib/auth";
import postsData from "../data/blogs.json";
import { addPost } from "../lib/posts";
import { listComments, hideComment, deleteComment } from "../lib/comments";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState(listUsers());
  const [, setRefresh] = useState(0);
  const [form, setForm] = useState({ title: "", slug: "", category: "Frontend", featuredImage: "", content: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: Roles.User, active: true });

  const allComments = (() => {
    const map = {};
    postsData.forEach(p => { map[p.slug] = listComments(p.slug, { includeHidden: true }); });
    return map;
  })();

  const createPost = (e) => {
    e.preventDefault();
    if (!form.slug) return;
    addPost({ ...form, authorId: user.id, authorName: user.name, status: "published" });
    setForm({ title: "", slug: "", category: "Frontend", featuredImage: "", content: "" });
    alert("Post created");
  };

  const onToggleActive = (id, active) => {
    setUserActive(id, active);
    setUsers(listUsers());
  };

  const onCreateUser = (e) => {
    e.preventDefault();
    createUser(newUser);
    setUsers(listUsers());
    setNewUser({ name: "", email: "", password: "", role: Roles.User, active: true });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-semibold mb-3">Create Post</h2>
          <form onSubmit={createPost} className="space-y-3">
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
            <button className="rounded bg-indigo-600 text-white px-4 py-2">Publish</button>
          </form>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Users</h2>
          <form onSubmit={onCreateUser} className="space-y-2 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <input className="border rounded px-2 py-1" placeholder="Name" value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})} required />
              <input className="border rounded px-2 py-1" placeholder="Email" type="email" value={newUser.email} onChange={e=>setNewUser({...newUser,email:e.target.value})} required />
              <input className="border rounded px-2 py-1" placeholder="Password" type="password" value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})} required />
              <select className="border rounded px-2 py-1" value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}>
                <option value={Roles.User}>User</option>
                <option value={Roles.Author}>Author</option>
                <option value={Roles.Admin}>Admin</option>
              </select>
            </div>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={newUser.active} onChange={e=>setNewUser({...newUser,active:e.target.checked})} /> Active</label>
            <button className="rounded bg-slate-900 text-white px-3 py-1">Create User</button>
          </form>
          <ul className="divide-y border rounded">
            {users.map(u => (
              <li key={u.id} className="flex items-center justify-between px-3 py-2 text-sm">
                <div>
                  <div className="font-medium">{u.name} <span className="text-slate-500">({u.role})</span></div>
                  <div className="text-slate-500">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${u.active?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{u.active?"Active":"Inactive"}</span>
                  <button onClick={()=>onToggleActive(u.id, !u.active)} className="border rounded px-2 py-1">Toggle</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Moderate Comments</h2>
        <div className="space-y-4">
          {Object.entries(allComments).map(([slug, arr]) => (
            <div key={slug} className="border rounded p-3">
              <div className="font-semibold mb-2">{slug}</div>
              {arr.length === 0 ? (
                <div className="text-sm text-slate-500">No comments</div>
              ) : (
                <ul className="space-y-2">
                  {arr.map(c => (
                    <li key={c.id} className="text-sm flex items-center justify-between gap-2">
                      <div>
                        <div className="font-medium">{c.authorName} <span className="text-slate-400 text-xs">{new Date(c.createdAt).toLocaleString()}</span></div>
                        <div className={`${c.hidden?"line-through text-slate-400":""}`}>{c.content}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="border rounded px-2 py-1" onClick={()=>{ hideComment(slug, c.id, !c.hidden); setRefresh(v=>v+1); }}>{c.hidden?"Unhide":"Hide"}</button>
                        <button className="border rounded px-2 py-1" onClick={()=>{ deleteComment(slug, c.id); setRefresh(v=>v+1); }}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
