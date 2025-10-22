import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SmartImage from "./SmartImage";

function isBengaliText(text = "") {
  return /[\u0980-\u09FF]/.test(text);
}

const MotionArticle = motion.article;

export default function BlogCard({ post, delay = 0 }) {
  const lang = isBengaliText(`${post.title} ${post.description}`) ? "bn" : "en";
  return (
    <MotionArticle
      lang={lang}
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow transition-shadow"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.8, delay }}
      whileHover={{ y: -2, scale: 1.01 }}
    >
      <Link to={`/post/${post.slug}`} className="block aspect-video overflow-hidden bg-slate-100">
        <SmartImage
          src={post.featuredImage}
          alt={post.title}
          className="h-full w-full"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          imgProps={{ className: "hover:scale-[1.02] transition-transform" }}
        />
      </Link>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-slate-700">{post.category}</span>
          <span>•</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span>•</span>
          <span>{post.author}</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.description}</p>
        <div className="mt-4">
          <Link to={`/post/${post.slug}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Read more →
          </Link>
        </div>
      </div>
    </MotionArticle>
  );
}
