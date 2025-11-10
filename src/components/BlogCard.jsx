import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SmartImage from "./SmartImage";
import { sanitizeHtml } from "../lib/sanitize";
import "./tiptap.css";
import "./card.css";

function isBengaliText(text = "") {
  return /[\u0980-\u09FF]/.test(text);
}

const MotionArticle = motion.article;

export default function BlogCard({ post, delay = 0 }) {
  const lang = isBengaliText(`${post.title} ${post.description}`) ? "bn" : "en";
  const isHtml = /^\s*</.test(post.content || "");
  const previewRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const check = () => setHasOverflow(el.scrollHeight - 1 > el.clientHeight); // -1 avoids off-by-one
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isHtml, post.content, post.description]);
  return (
    <MotionArticle
      lang={lang}
      className="h-full flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow transition-shadow"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.8, delay }}
      whileHover={{ y: -2, scale: 1.01 }}
    >
  <Link to={`/post/${post.id}`} className="block aspect-video overflow-hidden bg-slate-100">
        <SmartImage
          src={post.featuredImage || post.imageUrl || ""}
          alt={post.title}
          className="h-full w-full"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          imgProps={{ className: "hover:scale-[1.02] transition-transform" }}
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-slate-700">{post.category}</span>
          <span>•</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span>•</span>
          <span>{post.author}</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h3>
        <div className="PreviewContainer mt-2">
          {isHtml ? (
            <div
              ref={previewRef}
              className="ProseMirror preview-html prose prose-slate"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            />
          ) : (
            <p ref={previewRef} className="preview-text text-sm text-slate-600">{post.description}</p>
          )}
          {hasOverflow && <span aria-hidden className="ellipsis">…</span>}
        </div>
        <div className="mt-auto pt-4">
          <Link to={`/post/${post.id}`} className="text-sm font-medium text-green-600 hover:text-green-800">
            Read more →
          </Link>
        </div>
      </div>
    </MotionArticle>
  );
}
