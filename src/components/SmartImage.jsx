import { useEffect, useMemo, useRef, useState } from "react";

// Build an optimized Unsplash URL with desired width/quality
function toUnsplashUrl(src, { w, q = 70 }) {
  try {
    const u = new URL(src);
    if (!u.hostname.includes("images.unsplash.com")) return src; // non-unsplash
    // Respect existing params but override width/quality
    if (w) u.searchParams.set("w", String(w));
    u.searchParams.set("q", String(q));
    u.searchParams.set("auto", "format");
    // Keep crop/fit if present; default to crop
    if (!u.searchParams.has("fit")) u.searchParams.set("fit", "crop");
    return u.toString();
  } catch {
    return src;
  }
}

function isUnsplash(src) {
  try { return new URL(src).hostname.includes("images.unsplash.com"); } catch { return false; }
}

export default function SmartImage({
  src,
  alt,
  className,
  priority = false,
  widths = [320, 480, 640, 768, 1024, 1280],
  sizes,
  style,
  imgProps = {},
  showPlaceholder = true,
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const isUns = isUnsplash(src);

  const srcSet = useMemo(() => {
    if (!isUns) return undefined;
    return widths.map((w) => `${toUnsplashUrl(src, { w, q: 70 })} ${w}w`).join(", ");
  }, [src, widths, isUns]);

  const bestSrc = useMemo(() => {
    if (!isUns) return src;
    // Choose a conservative default width for immediate src
    const fallbackW = 768;
    return toUnsplashUrl(src, { w: fallbackW, q: 70 });
  }, [src, isUns]);

  // Tiny blurred placeholder for nice perception
  const placeholder = useMemo(() => {
    if (!isUns) return undefined;
    return toUnsplashUrl(src, { w: 24, q: 20 });
  }, [src, isUns]);

  // Priority images should not be lazy
  const loading = priority ? undefined : "lazy";
  const fetchPriority = priority ? "high" : undefined;
  const decoding = "async";

  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || priority) return;
    const el = ref.current;
    const loadHandler = () => setLoaded(true);
    const errorHandler = () => { setLoaded(true); setFailed(true); };
    el.addEventListener("load", loadHandler);
    el.addEventListener("error", errorHandler);
    return () => {
      el.removeEventListener("load", loadHandler);
      el.removeEventListener("error", errorHandler);
    };
  }, [priority]);

  // If no src provided, render a neutral placeholder block
  if ((!src || failed) && showPlaceholder) {
    return (
      <div
        className={`relative ${className || ""}`}
        style={{ backgroundColor: "#f1f5f9", ...style }}
        aria-label={alt || "Image placeholder"}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 select-none">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 7a2 2 0 0 1 2-2h3l2-2h4l2 2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"></path>
            <circle cx="12" cy="13" r="3"></circle>
          </svg>
          <span className="mt-1 text-xs">No image</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className || ""}`}
      style={{
        backgroundImage: placeholder ? `url(${placeholder})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: !loaded && placeholder ? "blur(12px)" : undefined,
        transition: "filter 200ms ease",
        ...style,
      }}
    >
      <img
        ref={ref}
        src={bestSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(true); setFailed(true); }}
        {...imgProps}
      />
    </div>
  );
}
