export default function Spinner({ size = 24, className = "" }) {
  const px = typeof size === "number" ? `${size}px` : size;
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 ${className}`}
      style={{ width: px, height: px }}
      aria-label="Loading"
    />
  );
}
