import React, { useEffect, useState } from "react";
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiH1,
  RiH2,
  RiCodeSSlashLine,
  RiLink,
  RiLinkUnlink,
} from "react-icons/ri";
import { setLink } from "../helpers/editor";
import "./popover.css";

export default function Popover({ editor }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const { from, to } = editor.state.selection;
      const isEmpty = from === to;
      if (isEmpty) { setVisible(false); return; }
      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount === 0) { setVisible(false); return; }
      const rect = domSelection.getRangeAt(0).getBoundingClientRect();
      if (!rect || (rect.x === 0 && rect.y === 0 && rect.width === 0 && rect.height === 0)) { setVisible(false); return; }
  // Place popover to the right of the selection
  // Place popover to the right of the selection, vertically centered
  const top = rect.top + window.scrollY + rect.height / 2;
  const left = rect.right + 16 + window.scrollX; // 16px gap to the right for better spacing
  setPos({ top, left });
      setVisible(true);
    };
    update();
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor || !visible) return null;
  const isSelectionOverLink = !!editor.getAttributes("link").href;

  return (
  <div className="Popover" style={{ position: "absolute", top: pos.top, left: pos.left, transform: "translateY(-50%)" }}>
      <div className="icon" onMouseDown={(e)=>{ e.preventDefault(); editor.chain().focus().toggleBold().run(); }}>
        <RiBold />
      </div>
      <div className="icon" onMouseDown={(e)=>{ e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}>
        <RiItalic />
      </div>
      <div className="icon" onMouseDown={(e)=>{ e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}>
        <RiStrikethrough />
      </div>
      <div className="icon" onMouseDown={(e)=>{ e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}>
        <RiH1 />
      </div>
      <div className="icon" onMouseDown={(e)=>{ e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}>
        <RiH2 />
      </div>
      <div className="icon" onMouseDown={(e)=>{ e.preventDefault(); (isSelectionOverLink ? editor.chain().focus().unsetLink().run() : setLink(editor)); }}>
        {isSelectionOverLink ? <RiLinkUnlink /> : <RiLink />}
      </div>
      <div className="icon" onMouseDown={(e)=>{ e.preventDefault(); editor.chain().focus().toggleCode().run(); }}>
        <RiCodeSSlashLine />
      </div>
    </div>
  );
}
