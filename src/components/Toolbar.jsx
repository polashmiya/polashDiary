import React from "react";
import classNames from "classnames";
import { useInView } from "react-cool-inview";
import sample from "lodash-es/sample.js";
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiCodeSSlashLine,
  RiEmotionLine,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiH6,
  RiParagraph,
  RiListOrdered,
  RiListUnordered,
  RiCodeBoxLine,
  RiLink,
  RiLinkUnlink,
  RiDoubleQuotesL,
  RiSeparator,
  RiTextWrap,
  RiFormatClear,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
} from "react-icons/ri";
import { setLink } from "../helpers/editor";
import "./toolbar.css";

export default function Toolbar({ editor }) {
  const { observe, inView } = useInView({
    rootMargin: "-1px 0px 0px 0px",
    threshold: [1],
  });
  if (!editor) return null;
  const isCursorOverLink = !!editor.getAttributes("link").href;

  const insertEmoji = () => {
    const emoji = sample(["😀", "😁", "😂", "😎", "😍", "😱"]) || "😀";
    editor.chain().focus().insertContent(emoji).run();
  };

  // Helper to check active state for headings
  const isHeadingActive = (level) => editor.isActive("heading", { level });

  return (
    <div className={classNames("ToolbarContainer", { sticky: !inView })} ref={observe}>
      <div className="Toolbar">
        <div
          className={classNames("icon", { active: editor.isActive("bold") })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        >
          <RiBold />
        </div>
        <div
          className={classNames("icon", { active: editor.isActive("italic") })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        >
          <RiItalic />
        </div>
        <div
          className={classNames("icon", { active: editor.isActive("strike") })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        >
          <RiStrikethrough />
        </div>
        <div
          className={classNames("icon", { active: editor.isActive("code") })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
        >
          <RiCodeSSlashLine />
        </div>
        <div className="divider"></div>
        <div className="icon" onMouseDown={(e) => { e.preventDefault(); insertEmoji(); }}>
          <RiEmotionLine />
        </div>
        <div className="divider"></div>
        <div
          className={classNames("icon", { active: isHeadingActive(1) })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
        >
          <RiH1 />
        </div>
        <div
          className={classNames("icon", { active: isHeadingActive(2) })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
        >
          <RiH2 />
        </div>
        <div
          className={classNames("icon", { active: isHeadingActive(3) })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
        >
          <RiH3 />
        </div>
        <div
          className={classNames("icon", { active: isHeadingActive(4) })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 4 }).run(); }}
        >
          <RiH4 />
        </div>
        <div
          className={classNames("icon", { active: isHeadingActive(5) })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 5 }).run(); }}
        >
          <RiH5 />
        </div>
        <div
          className={classNames("icon", { active: isHeadingActive(6) })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 6 }).run(); }}
        >
          <RiH6 />
        </div>
        <div
          className={classNames("icon", { active: editor.isActive("paragraph") })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setParagraph().run(); }}
        >
          <RiParagraph />
        </div>
        <div
          className={classNames("icon", { active: editor.isActive("bulletList") })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        >
          <RiListUnordered />
        </div>
        <div
          className={classNames("icon", { active: editor.isActive("orderedList") })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        >
          <RiListOrdered />
        </div>
        <div
          className={classNames("icon", { active: editor.isActive("codeBlock") })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run(); }}
        >
          <RiCodeBoxLine />
        </div>
        <div className="divider"></div>
        <div
          className={classNames("icon", { active: editor.isActive("link") })}
          onMouseDown={(e) => { e.preventDefault(); setLink(editor); }}
        >
          <RiLink />
        </div>
        <div
          className={classNames("icon", { disabled: !isCursorOverLink })}
          onMouseDown={(e) => { e.preventDefault(); if (isCursorOverLink) editor.chain().focus().unsetLink().run(); }}
        >
          <RiLinkUnlink />
        </div>
        <div className="divider"></div>
        <div
          className={classNames("icon", { active: editor.isActive("blockquote") })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
        >
          <RiDoubleQuotesL />
        </div>
        <div className={classNames("icon")} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setHorizontalRule().run(); }}>
          <RiSeparator />
        </div>
        <div className="divider"></div>
        <div className={classNames("icon")} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setHardBreak().run(); }}>
          <RiTextWrap />
        </div>
        <div className={classNames("icon")} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetAllMarks().clearNodes().run(); }}>
          <RiFormatClear />
        </div>
        <div className="divider"></div>
        <div className={classNames("icon")} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}>
          <RiArrowGoBackLine />
        </div>
        <div className={classNames("icon")} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}>
          <RiArrowGoForwardLine />
        </div>
      </div>
    </div>
  );
}
