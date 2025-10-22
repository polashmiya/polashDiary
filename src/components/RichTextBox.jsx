import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

// Medium-like Markdown editor: toolbar + textarea, emits markdown text
const mdComponents = {
  code({ inline, className, children, ...props }) {
    return (
      <CodeBlock inline={inline} className={className} {...props}>
        {children}
      </CodeBlock>
    );
  },
};

export default function RichTextBox({ value = "", onChange }) {
  const ref = useRef(null);
  const [preview, setPreview] = useState(false);

  const setValue = (next, selStart, selEnd) => {
    onChange?.(next);
    // restore selection on next tick
    queueMicrotask(() => {
      const el = ref.current;
      if (!el) return;
      if (typeof selStart === "number") el.selectionStart = selStart;
      if (typeof selEnd === "number") el.selectionEnd = selEnd ?? selStart;
      el.focus();
    });
  };

  const getSel = () => {
    const el = ref.current;
    if (!el) return null;
    return { el, start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 };
  };

  const wrapSelection = (before, after = before, placeholder = "text") => {
    const sel = getSel();
    if (!sel) return;
  const { start, end } = sel;
  const beforeText = value.slice(0, start);
    const selected = value.slice(start, end) || placeholder;
    const afterText = value.slice(end);
    const next = `${beforeText}${before}${selected}${after}${afterText}`;
    // new caret position selects inserted content
    const newStart = start + before.length;
    const newEnd = newStart + selected.length;
    setValue(next, newStart, newEnd);
  };

  const insertAt = (text, caretOffset = 0) => {
    const sel = getSel();
    if (!sel) return;
    const { start, end } = sel;
    const next = value.slice(0, start) + text + value.slice(end);
    const newPos = start + caretOffset;
    setValue(next, newPos, newPos);
  };

  const toggleLinePrefix = (prefix) => {
    const sel = getSel();
    if (!sel) return;
    const { start, end } = sel;
  const before = value.slice(0, start);
    const chunk = value.slice(start, end);
    const lines = (chunk || value).slice(start, end || undefined).split("\n");
    // determine if all selected lines already have the prefix
    const allPrefixed = lines.every((l) => l.startsWith(prefix));
    const newLines = lines.map((l) => {
      if (allPrefixed) return l.replace(new RegExp(`^${prefix}`), "");
      return `${prefix}${l.replace(/^\s*/, "")}`;
    });
    const replacement = newLines.join("\n");
    const targetStart = before.lastIndexOf("\n") + 1 || start;
    const targetEnd = start + (chunk.length || 0);
    const newValue = value.slice(0, targetStart) + replacement + value.slice(targetEnd);
    const newSelEnd = targetStart + replacement.length;
    setValue(newValue, targetStart, newSelEnd);
  };

  const makeHeading = (level) => () => {
    const hashes = "#".repeat(Math.max(1, Math.min(level, 6)));
    const sel = getSel();
    if (!sel) return;
    const { start } = sel;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEndIdx = value.indexOf("\n", start);
    const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
    const line = value.slice(lineStart, lineEnd).replace(/^\s+/, "");
    // toggle: if already heading with same level, remove; else set
  const exists = /^(#{1,6})\s+/.exec(line);
    let newLine;
    if (exists && exists[1].length === level) {
      newLine = line.replace(/^#{1,6}\s+/, "");
    } else {
      newLine = `${hashes} ${line.replace(/^#{1,6}\s+/, "")}`;
    }
    const next = value.slice(0, lineStart) + newLine + value.slice(lineEnd);
    setValue(next, lineStart + newLine.length, lineStart + newLine.length);
  };

  const onBold = () => wrapSelection("**", "**", "bold");
  const onItalic = () => wrapSelection("*", "*", "italic");
  const onStrike = () => wrapSelection("~~", "~~", "strike");
  const onInlineCode = () => wrapSelection("`", "`", "code");
  const onQuote = () => toggleLinePrefix("> ");
  const onUL = () => toggleLinePrefix("- ");
  const onOL = () => {
    const sel = getSel();
    if (!sel) return;
    const { start, end } = sel;
    const chunk = value.slice(start, end) || "";
    const lines = (chunk || "").split("\n");
    const numbered = lines.map((l, i) => `${i + 1}. ${l.replace(/^\s*/, "")}`);
    const replacement = numbered.join("\n");
    const next = value.slice(0, start) + replacement + value.slice(end);
    setValue(next, start, start + replacement.length);
  };
  const onTask = () => toggleLinePrefix("- [ ] ");
  const onHR = () => insertAt("\n\n---\n\n", 5);
  const onCodeBlock = () => wrapSelection("\n```\n", "\n```\n", "// code");
  const onTable = () => {
    const tpl = `\n\n| Col 1 | Col 2 | Col 3 |\n|------:|:-----:|:------|\n|   1   |   2   |   3   |\n|   4   |   5   |   6   |\n\n`;
    insertAt(tpl, tpl.length);
  };
  const onLink = () => {
    const url = globalThis.prompt?.("Link URL");
    if (!url) return;
    wrapSelection("[", `](${url})`, "link text");
  };
  const onImage = () => {
    const url = globalThis.prompt?.("Image URL");
    if (!url) return;
    const alt = globalThis.prompt?.("Alt text (optional)") || "";
    insertAt(`![${alt}](${url})`, `![${alt}](${url})`.length);
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b bg-slate-50/70 px-2 py-2">
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onBold}><b>B</b></button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onItalic}><i>I</i></button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={makeHeading(1)}>H1</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={makeHeading(2)}>H2</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={makeHeading(3)}>H3</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onStrike}>S</button>
        <span className="mx-2 h-5 w-px bg-slate-300" />
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onUL}>• List</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onOL}>1. List</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onTask}>☑ Tasks</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onQuote}>" Quote</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onInlineCode}>{"< >"}</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onCodeBlock}>{"</>"} Code</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onTable}>▦ Table</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onLink}>🔗 Link</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onImage}>🖼️ Image</button>
        <button type="button" disabled={preview} className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50" onClick={onHR}>— HR</button>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" className={`px-2 py-1 text-sm rounded ${preview ? 'hover:bg-slate-200' : 'bg-slate-200'}`} onClick={() => setPreview(false)}>Edit</button>
          <button type="button" className={`px-2 py-1 text-sm rounded ${preview ? 'bg-slate-200' : 'hover:bg-slate-200'}`} onClick={() => setPreview(true)}>Preview</button>
        </div>
      </div>
      {preview ? (
        <div className="p-4 prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {value || ""}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          ref={ref}
          className="w-full min-h-60 p-4 border-0 focus:outline-none focus:ring-0 font-mono text-sm"
          value={value}
          spellCheck={false}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Write in Markdown... Use the toolbar for quick formatting."
        />
      )}
    </div>
  );
}
