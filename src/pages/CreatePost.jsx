import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PostEditor from "../components/PostEditor";
import { createPost } from "../lib/posts";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { toast } from "react-hot-toast";

const CATEGORIES = ["Frontend", "Backend", "DevOps", "QA", "Others"]; 

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [html, setHtml] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Hide page scrollbar while on the Create page
  useEffect(() => {
    document.body.classList.add("no-scrollbar");
    return () => {
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: only JPG/JPEG/PNG
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG or PNG images are allowed");
      e.target.value = "";
      return;
    }

    // Validate size: max 1 MB
    const MAX_BYTES = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_BYTES) {
      toast.error("Max file size is 1 MB");
      e.target.value = "";
      return;
    }

    // Upload
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res?.url;
      const message = res?.message || "Image uploaded successfully";
      if (url) {
        setFeaturedImage(url);
        toast.success(message);
      } else {
        toast.error("Upload failed: No URL returned");
      }
    } finally {
      setUploading(false);
      // reset so same file can be selected again if needed
      if (e?.target) e.target.value = "";
    }
  };

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
    <div className="mx-auto max-w-4xl px-2 sm:px-6 py-6 sm:py-8">
      <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 text-center sm:text-left">Create a Post</h1>

      <form className="mt-6 grid gap-6" style={{ width: "100%" }}>
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
          <input
            id="title"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-green-500 focus:outline-none text-base sm:text-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your amazing title"
            autoComplete="off"
          />
        </div>

        {/* Category & Image Upload */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
            <select
              id="category"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-green-500 focus:outline-none text-base"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="featuredImageUpload" className="block text-sm font-medium text-slate-700">Upload Featured Image (optional)</label>
            <div className="mt-1">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                id="featuredImageUpload"
                accept="image/png,image/jpeg"
                onChange={onFileChange}
                className="hidden"
              />

              {featuredImage ? (
                <div className="rounded-md border border-slate-200 p-3 flex flex-col sm:flex-row items-start gap-3">
                  <img src={featuredImage} alt="Featured" className="h-20 w-20 rounded object-cover shrink-0 mb-2 sm:mb-0" />
                  <div className="flex-1 w-full">
                    <div className="text-sm text-slate-600 mb-2">Image uploaded</div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <button type="button" onClick={onPickFile} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer w-full sm:w-auto">Replace</button>
                      <button type="button" onClick={() => setFeaturedImage("")} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer w-full sm:w-auto">Remove</button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onPickFile}
                  disabled={uploading}
                  className="w-full justify-center rounded-md border border-dashed border-slate-300 px-4 py-6 text-slate-600 hover:bg-slate-50 disabled:opacity-60 cursor-pointer text-sm"
                >
                  {uploading ? "Uploading..." : "Click to upload JPG/PNG (max 1 MB)"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div style={{ width: "100%", overflow: "hidden" }}>
          <div className="block text-sm font-medium text-slate-700 mb-2">Content</div>
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm" style={{ width: "100%", overflow: "hidden" }}>
            <PostEditor value={html} onChange={setHtml} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* ...existing code... */}
          <button disabled={saving || uploading} onClick={submit} className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-60 cursor-pointer">
            {saving ? "Saving..." : "Save draft"}
          </button>
          <button disabled={saving || uploading} onClick={submit} className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60 cursor-pointer">
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}

