import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ className, children, inline, ...props }) {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || "");
  const code = String(children || "").replace(/\n$/, "");
  const language = match ? match[1] : undefined;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // best-effort copy fallback
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  if (inline) {
    return (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.85em]">{children}</code>
    );
  }

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 rounded border border-slate-600/40 bg-slate-800/70 px-2 py-1 text-xs text-slate-100 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        wrapLongLines
        showLineNumbers
        customStyle={{
          borderRadius: 8,
          margin: 0,
          fontSize: "0.9rem",
        }}
        codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' } }}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
