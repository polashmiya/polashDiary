import { useEffect, useMemo, useState, useCallback, useRef, useDeferredValue } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import BlogList from "../components/BlogList";
import SearchBar from "../components/SearchBar";
import SkeletonGrid from "../components/SkeletonGrid";
import postsData from "../data/blogs.json";
import { listAllPosts } from "../lib/posts";

const categories = ["All", "Frontend", "Backend", "DevOps", "QA", "Others"];

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get("category") || "All";
  const initialQuery = params.get("q") || "";
  const [selected, setSelected] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [limit, setLimit] = useState(6);
  const observerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const current = new URLSearchParams(location.search).get("category") || "All";
    if (current !== selected) {
      setSelected(current);
    }
  }, [location.search, selected]);

  const filtered = useMemo(() => {
    const merged = listAllPosts(postsData).filter(p => p.status !== "draft");
    let arr = selected === "All" ? merged : merged.filter((p) => p.category === selected);
    if (deferredQuery.trim()) {
      const q = deferredQuery.trim().toLowerCase();
      arr = arr.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return arr;
  }, [selected, deferredQuery]);

  // Reset pagination and show loader when filters change
  useEffect(() => {
    setLimit(6);
    setLoading(true);
  }, [selected, query]);

  // Hide loader after deferred values settle (small grace for UX)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, [selected, deferredQuery]);

  const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);
  const hasMore = visible.length < filtered.length;

  // Callback ref to observe the sentinel reliably as it mounts/unmounts
  const setSentinel = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node || !hasMore || loading) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setLimit((l) => Math.min(l + 6, filtered.length));
        }
      },
      { root: null, rootMargin: "200px 0px 0px 0px", threshold: 0.1 }
    );
    observerRef.current.observe(node);
  }, [hasMore, loading, filtered.length]);

  const onSelect = (cat) => {
    const p = new URLSearchParams();
    if (cat !== "All") p.set("category", cat);
    if (query) p.set("q", query);
    navigate({ pathname: "/", search: p.toString() });
  };

  const onSearch = useCallback((text) => {
    setQuery(text);
    const p = new URLSearchParams();
    if (selected !== "All") p.set("category", selected);
    if (text) p.set("q", text);
    navigate({ pathname: "/", search: p.toString() });
  }, [navigate, selected]);

  return (
    <motion.div
      className="mx-auto max-w-6xl px-4 sm:px-6 py-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Latest Articles</h1>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <SearchBar value={query} onChange={onSearch} />
        </div>
        <div className="sm:col-span-1">
          <CategoryFilter categories={categories} selected={selected} onSelect={onSelect} />
        </div>
      </div>

  {loading ? <SkeletonGrid count={Math.min(6, filtered.length || 6)} /> : <BlogList posts={visible} />}

      <div className="mt-8 flex justify-center">
        {loading && (
          <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" aria-label="Loading" />
        )}
        {!loading && hasMore && (
          <div ref={setSentinel} className="h-8 w-8 animate-pulse rounded-full bg-slate-200" aria-label="Loading more" />
        )}
        {!loading && !hasMore && (
          <p className="text-sm text-slate-500">You’ve reached the end.</p>
        )}
      </div>
    </motion.div>
  );
}
