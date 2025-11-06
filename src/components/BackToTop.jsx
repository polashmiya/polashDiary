import { useEffect, useState } from "react";
import { AnimatePresence, m as Motion } from "framer-motion";

export default function BackToTop({ threshold = 300 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <Motion.button
          key="back-to-top"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 rounded-full bg-green-600 text-white shadow-lg ring-1 ring-green-300 hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 p-3"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 15l7-7 7 7" />
          </svg>
        </Motion.button>
      )}
    </AnimatePresence>
  );
}
