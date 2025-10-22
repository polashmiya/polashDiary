import RichTextBox from "./RichTextBox";

export default function PostEditor({ value, onChange }) {
  return <RichTextBox value={value} onChange={onChange} />;
}
