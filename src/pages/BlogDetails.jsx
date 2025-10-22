import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../components/CodeBlock";
import { motion } from "framer-motion";
import postsData from "../data/blogs.json";
import { listAllPosts } from "../lib/posts";
import SmartImage from "../components/SmartImage";
import { sanitizeHtml } from "../lib/sanitize";
import { useAuth } from "../hooks/useAuth";
import { addComment, listComments, hideComment, deleteComment } from "../lib/comments";

const markdownComponents = {
  code({ inline, className, children, ...props }) {
    return (
      <CodeBlock inline={inline} className={className} {...props}>
        {children}
      </CodeBlock>
    );
  },
};

const MotionArticle = motion.article;
const MotionDiv = motion.div;

export default function BlogDetails() {
  const { slug } = useParams();
  const all = listAllPosts(postsData);
  const post = all.find((p) => p.slug === slug);
  const { user } = useAuth();
  const isBn = post ? /[\u0980-\u09FF]/.test(`${post.title} ${post.content}`) : false;
  const [text, setText] = useState("");
  const isAdmin = user?.role === 'admin';
  const [comments, setComments] = useState(() => listComments(slug, { includeHidden: isAdmin }));
  useEffect(() => {
    setComments(listComments(slug, { includeHidden: isAdmin }));
  }, [slug, isAdmin]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    addComment(slug, { authorId: user.id, authorName: user.name, content: value });
    setText("");
    setComments(listComments(slug, { includeHidden: isAdmin }));
  };

  const canViewDraft = user && (user.role === 'admin' || user.id === post?.authorId);
  if (!post || (post.status === 'draft' && !canViewDraft)) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <p className="text-slate-700">Post not found.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">← Back to home</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <p className="text-slate-700">Post not found.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">← Back to home</Link>
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
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">← Back to home</Link>
      </div>
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-slate-700">{post.category}</span>
        <span>•</span>
        <span>{new Date(post.date).toLocaleDateString()}</span>
        <span>•</span>
        <span>{post.author}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{post.title}</h1>

      <MotionDiv className="my-6 overflow-hidden rounded-lg bg-slate-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div className="aspect-video w-full">
          <SmartImage
            src={post.featuredImage}
            alt={post.title}
            className="h-full w-full"
            sizes="100vw"
            priority
          />
        </div>
      </MotionDiv>

      <MotionDiv className="prose prose-slate max-w-none prose-headings:scroll-mt-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        {/^\s*</.test(post.content) ? (
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {post.content}
          </ReactMarkdown>
        )}
      </MotionDiv>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Comments</h2>
        <div className="mt-4 space-y-3">
          {comments.length === 0 ? (
            <div className="text-sm text-slate-500">No comments yet.</div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="border rounded px-3 py-2 text-sm flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-medium text-slate-700">{c.authorName} <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</span></div>
                  <div className={`${c.hidden? 'line-through text-slate-400' : ''}`}>{c.content}</div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button className="border rounded px-2 py-1" onClick={()=>{ hideComment(slug, c.id, !c.hidden); setComments(listComments(slug, { includeHidden: isAdmin })); }}>{c.hidden? 'Unhide':'Hide'}</button>
                    <button className="border rounded px-2 py-1" onClick={()=>{ deleteComment(slug, c.id); setComments(listComments(slug, { includeHidden: isAdmin })); }}>Delete</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-5">
          {user ? (
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <textarea className="w-full border rounded px-3 py-2" rows={3} placeholder="Write a comment..." value={text} onChange={e=>setText(e.target.value)} />
              <button className="rounded bg-slate-900 text-white px-4 py-2">Post Comment</button>
            </form>
          ) : (
            <div className="text-sm text-slate-600">Please <a href="/login" className="text-indigo-600 hover:text-indigo-800">login</a> to comment.</div>
          )}
        </div>
      </section>
    </MotionArticle>
  );
}
