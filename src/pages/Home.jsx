import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  useDeferredValue,
} from "react";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import BlogList from "../components/BlogList";
import SearchBar from "../components/SearchBar";
import { getPosts } from "../lib/posts";

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
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const current =
      new URLSearchParams(location.search).get("category") || "All";
    if (current !== selected) {
      setSelected(current);
    }
  }, [location.search, selected]);

  // Utility to map API post to UI shape used by cards
  const stripHtml = useCallback((html) => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    const text = (div.textContent || div.innerText || "")
      .trim()
      .split(/\s+/)
      .join(" ");
    return text;
  }, []);
  const mapPost = useCallback(
    (p) => {
      const id = p._id || p.id;
      const authorName =
        typeof p.author === "object"
          ? p.author.name || p.author.email || "Author"
          : p.authorName || "Author";
      const created = p.createdAt || p.updatedAt || new Date().toISOString();
      return {
        id,
        slug: id, // kept for components that read slug
        title: p.title,
        category: p.category,
        date: created,
        author: authorName,
        featuredImage: p.imageUrl || p.featuredImage || "",
        description: stripHtml(p.content).slice(0, 160),
        content: p.content,
      };
    },
    [stripHtml]
  );

  const filtered = useMemo(() => {
    const base = allPosts.map(mapPost);
    let arr =
      selected === "All" ? base : base.filter((p) => p.category === selected);
    return arr;
  }, [selected, allPosts, mapPost]);

  // Fetch posts when query changes (send search only during search time)
  useEffect(() => {
    let canceled = false;
    async function run() {
      setLoading(true);
      try {
        const data = await getPosts({
          search: deferredQuery.trim() ? deferredQuery : undefined,
        });
        if (!canceled)
          setAllPosts(Array.isArray(data) ? data : data?.posts || []);
      } catch {
        if (!canceled) setAllPosts([]);
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    run();
    // reset pagination on new fetch
    setLimit(6);
    return () => {
      canceled = true;
    };
  }, [deferredQuery]);

  // Hide loader small grace on category change and reset pagination
  useEffect(() => {
    setLimit(6);
  }, [selected]);

  const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);
  const hasMore = visible.length < filtered.length;

  // Callback ref to observe the sentinel reliably as it mounts/unmounts
  const setSentinel = useCallback(
    (node) => {
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
    },
    [hasMore, loading, filtered.length]
  );

  const onSelect = (cat) => {
    const p = new URLSearchParams();
    if (cat !== "All") p.set("category", cat);
    if (query) p.set("q", query);
    navigate({ pathname: "/", search: p.toString() });
  };

  const onSearch = useCallback(
    (text) => {
      setQuery(text);
      const p = new URLSearchParams();
      if (selected !== "All") p.set("category", selected);
      if (text) p.set("q", text);
      navigate({ pathname: "/", search: p.toString() });
    },
    [navigate, selected]
  );

  console.log("Rendering Home with loading:", loading, allPosts, filtered);
  return (
    <motion.div
      className="mx-auto max-w-6xl px-4 sm:px-6 py-8 min-h-[60vh]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Latest Articles
        </h1>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <SearchBar value={query} onChange={onSearch} />
        </div>
        <div className="sm:col-span-1">
          <CategoryFilter
            categories={categories}
            selected={selected}
            onSelect={onSelect}
          />
        </div>
      </div>
      {(() => {
        if (loading) {
          return (
            <Loader show={loading} label="Loading posts..." overlay={false} />
          );
        }
        if (filtered.length === 0) {
          return (
            <div className="text-center py-10 text-slate-600">
              <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-xl">📰</span>
              </div>
              <p className="text-base font-medium">No posts or blogs found.</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          );
        }
        return <BlogList posts={visible} />;
      })()}

      {filtered.length > 0 && (
        <div className="mt-8 flex justify-center">
          {!loading && hasMore && (
            <div
              ref={setSentinel}
              className="h-8 w-8 animate-pulse rounded-full bg-slate-200"
              aria-label="Loading more"
            />
          )}
          {!loading && !hasMore && (
            <p className="text-sm text-slate-500">You’ve reached the end.</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
