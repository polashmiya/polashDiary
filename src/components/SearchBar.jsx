import { useState, useEffect } from "react";

export default function SearchBar({ value, onChange, placeholder = "Search articles..." }) {
  const [text, setText] = useState(value || "");

  useEffect(() => {
    setText(value || "");
  }, [value]);

  useEffect(() => {
    const id = setTimeout(() => onChange?.(text), 250);
    return () => clearTimeout(id);
  }, [text, onChange]);

  return (
    <div className="relative">
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white pr-10 pl-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none"
        placeholder={placeholder}
      />
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </div>
  );
}
