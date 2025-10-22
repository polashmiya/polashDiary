import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
// Using default code block from StarterKit to avoid lowlight peer dependency conflicts

export default function PostEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit, // includes codeBlock by default
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ autolink: true, openOnClick: true, linkOnPaste: true }),
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
    ],
    content: value || "<p></p>",
    autofocus: false,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && typeof value === 'string' && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Image URL (or paste)");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addImageFromFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result;
      editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b bg-slate-50/80 px-2 py-2 sticky top-16 z-10">
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => editor.chain().focus().toggleCode().run()}>Code</button>
        <span className="mx-2 h-5 w-px bg-slate-300" />
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <span className="mx-2 h-5 w-px bg-slate-300" />
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => editor.chain().focus().setHorizontalRule().run()}>HR</button>
        <span className="mx-2 h-5 w-px bg-slate-300" />
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code Block</button>
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={insertTable}>Table</button>
        <button className="px-2 py-1 rounded hover:bg-slate-200" onClick={addImage}>Image URL</button>
        <label className="px-2 py-1 rounded hover:bg-slate-200 cursor-pointer">Upload
          <input type="file" accept="image/*" className="hidden" onChange={addImageFromFile} />
        </label>
      </div>
      <div className="prose prose-slate max-w-none p-3 min-h-[360px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
