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
}) {
  const [loaded, setLoaded] = useState(false);
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
  const fetchpriority = priority ? "high" : undefined;
  const decoding = "async";

  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || priority) return;
    const el = ref.current;
    const handler = () => setLoaded(true);
    el.addEventListener("load", handler);
    el.addEventListener("error", handler);
    return () => {
      el.removeEventListener("load", handler);
      el.removeEventListener("error", handler);
    };
  }, [priority]);

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
        fetchpriority={fetchpriority}
        style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
        onLoad={() => setLoaded(true)}
        {...imgProps}
      />
    </div>
  );
}
