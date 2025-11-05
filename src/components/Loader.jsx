import Spinner from "./Spinner";

export default function Loader({ show = true, label = "Loading...", overlay = false }) {
  if (!show) return null;
  if (overlay) {
    // Full-screen blocking overlay
    return (
      <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-lg bg-white/90 shadow px-4 py-3 ring-1 ring-slate-200">
          <Spinner size={20} />
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
      </div>
    );
  }

  // Non-blocking, inline loader (no overlay, doesn't capture pointer events)
  return (
    <div className="w-full flex items-center justify-center py-6">
      <div className="flex items-center gap-3 rounded-lg bg-white shadow-sm px-4 py-2 ring-1 ring-slate-200">
        <Spinner size={20} />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
    </div>
  );
}
