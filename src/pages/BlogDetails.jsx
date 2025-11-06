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
// Copy button styles
import "../components/copy.css";

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

  // Enhance rendered content: syntax highlight for HTML path and add copy buttons to blocks
  useEffect(() => {
    if (!post) return;
    const root = contentRef.current;
    if (!root) return;

    const isHtml = /^[\s]*</.test(post.content || "");

    // For raw HTML, apply client-side highlight.js (markdown handled by rehype-highlight)
    if (isHtml) {
      const codes = root.querySelectorAll("pre code");
      codes.forEach((el) => {
        if (!el.classList.contains("hljs")) hljs.highlightElement(el);
      });
    }

    // Add copy buttons to each code block only
    const enhanceCopyButtons = () => {
      const blocks = root.querySelectorAll("pre");

      const doCopy = async (blockEl) => {
        try {
          const clone = blockEl.cloneNode(true);
          // Remove any existing copy buttons in the clone
          clone.querySelectorAll('[data-copy-button="true"]').forEach((n) => n.remove());
          const text = clone.innerText.trim();
          if (!text) return false;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
          }
          // Fallback
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "absolute";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand ? document.execCommand("copy") : false;
          document.body.removeChild(ta);
          return ok;
        } catch {
          return false;
        }
      };

      blocks.forEach((block) => {
        if (block.dataset.copyEnhanced === "true") return;
        block.dataset.copyEnhanced = "true";
        block.classList.add("copy-block");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", "Copy code block");
        btn.setAttribute("data-copy-button", "true");
        btn.className = "copy-btn";
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="copy-label">Copy</span>
        `;

        let copyTimer;
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const success = await doCopy(block);
          btn.classList.toggle("copied", !!success);
          const label = btn.querySelector(".copy-label");
          if (label) label.textContent = success ? "Copied" : "Copy";
          clearTimeout(copyTimer);
          copyTimer = setTimeout(() => {
            btn.classList.remove("copied");
            if (label) label.textContent = "Copy";
          }, 1200);
        });

        // Append button inside pre so it overlays the code block
        block.appendChild(btn);
      });
    };

    enhanceCopyButtons();
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
          className="mt-4 inline-block text-green-600 hover:text-green-800"
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
  <Link to="/" className="text-green-600 hover:text-green-800">
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
        <div ref={contentRef}>
          {/^[\s]*</.test(post.content) ? (
            <div
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
        </div>
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
                className="text-green-600 hover:text-green-800"
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
