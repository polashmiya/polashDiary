import Tiptap from "./Tiptap";

export default function PostEditor({ value, onChange }) {
  return <Tiptap value={value} onChange={onChange} />;
}
