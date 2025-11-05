import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import { common, createLowlight } from "lowlight";
const lowlight = createLowlight(common);

import "./tiptap.css";
import Toolbar from "./Toolbar";
import Popover from "./Popover";

function ToolbarButton({ onClick, disabled, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="px-2 py-1 text-sm rounded hover:bg-slate-200 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export default function Tiptap({ value = "", onChange, placeholder = "Type '/' for actions…", withToolbar = true, withPopover = true }) {
  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Typography,
      Link.configure({ linkOnPaste: true, openOnClick: false }),
      CodeBlockLowlight.configure({ lowlight }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder })
    ],
    autofocus: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
      {withToolbar ? <Toolbar editor={editor} /> : null}
      {withPopover ? <Popover editor={editor} /> : null}
      <EditorContent editor={editor} className="tiptap-editor p-4" />
    </div>
  );
}
