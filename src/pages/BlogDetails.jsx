import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// Use highlight.js classes in markdown too, so it matches the editor (tiptap lowlight)
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";
import SmartImage from "../components/SmartImage";
import { sanitizeHtml } from "../lib/sanitize";
import { useAuth } from "../hooks/useAuth";
import { addComment as apiAddComment } from "../lib/comments";
import { getPostById } from "../lib/posts";
import Loader from "../components/Loader";
// Import editor styles so published posts render the same as in the editor
import "../components/tiptap.css";
// Client-side highlighter for HTML content saved from Tiptap
import hljs from "highlight.js/lib/common";

// We intentionally don't override the `code` element renderer.
// `rehype-highlight` will add the appropriate hljs-* spans/classes and
// our imported tiptap.css includes the highlight.js GitHub-like theme.

const MotionArticle = motion.article;
const MotionDiv = motion.div;

export default function BlogDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    let canceled = false;
    async function run() {
      setLoading(true);
      setError("");
      try {
        const data = await getPostById(id);
        if (!canceled) setPost(data);
      } catch (e) {
        if (!canceled) setError(e.message || "Failed to load post");
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    run();
    return () => {
      canceled = true;
    };
  }, [id]);

  // When content is HTML, run highlight.js to add hljs markup
  useEffect(() => {
    if (!post) return;
    const isHtml = /^[\s]*</.test(post.content || "");
    if (!isHtml) return; // markdown handled by rehype-highlight path
    const root = contentRef.current;
    if (!root) return;
    const codes = root.querySelectorAll("pre code");
    codes.forEach((el) => {
      // Avoid double-highlighting
      if (!el.classList.contains("hljs")) hljs.highlightElement(el);
    });
  }, [post]);

  const isBn = useMemo(
    () =>
      post ? /[\u0980-\u09FF]/.test(`${post.title} ${post.content}`) : false,
    [post]
  );

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    try {
      setPosting(true);
      await apiAddComment(post._id || post.id, { text: value });
      setText("");
      // refresh post to get latest comments
      const data = await getPostById(id);
      setPost(data);
    } catch (e) {
      // optionally surface error
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <Loader show label="Loading post..." overlay={false} />;

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <p className="text-slate-700">{error || "Post not found."}</p>
        <Link
          to="/"
          className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <MotionArticle
      lang={isBn ? "bn" : "en"}
      className="mx-auto max-w-3xl px-4 sm:px-6 py-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="mb-6">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          ← Back to home
        </Link>
      </div>
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-slate-700">
          {post.category}
        </span>
        <span>•</span>
        <span>
          {new Date(
            post.createdAt || post.updatedAt || Date.now()
          ).toLocaleDateString()}
        </span>
        <span>•</span>
        <span>
          {typeof post.author === "object"
            ? post.author.name || post.author.email || "Author"
            : post.authorName || "Author"}
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
        {post.title}
      </h1>

      <MotionDiv
        className="my-6 overflow-hidden rounded-lg bg-slate-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="aspect-video w-full">
          <SmartImage
            src={post.imageUrl || post.featuredImage}
            alt={post.title}
            className="h-full w-full"
            sizes="100vw"
            priority
          />
        </div>
      </MotionDiv>

      <MotionDiv
        className="ProseMirror prose prose-slate max-w-none prose-headings:scroll-mt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/^[\s]*</.test(post.content) ? (
          <div
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        )}
      </MotionDiv>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Comments</h2>
        <div className="mt-4 space-y-3">
          {!post.comments?.length ? (
            <div className="text-sm text-slate-500">No comments yet.</div>
          ) : (
            post.comments.map((c) => (
              <div
                key={c._id || c.id}
                className="border rounded px-3 py-2 text-sm flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="font-medium text-slate-700">
                    {c.author?.name || c.authorName || "Anonymous"}{" "}
                    <span className="text-xs text-slate-400">
                      {new Date(c.createdAt || Date.now()).toLocaleString()}
                    </span>
                  </div>
                  <div>{c.text || c.content}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5">
          {user ? (
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Write a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={posting}
              />
              <button
                disabled={posting}
                className="rounded bg-slate-900 text-white px-4 py-2 disabled:opacity-60"
              >
                {posting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <div className="text-sm text-slate-600">
              Please{" "}
              <a
                href="/login"
                className="text-indigo-600 hover:text-indigo-800"
              >
                login
              </a>{" "}
              to comment.
            </div>
          )}
        </div>
      </section>
    </MotionArticle>
  );
}
