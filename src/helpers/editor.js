export function setLink(editor) {
  const previousUrl = editor.getAttributes('link').href;
  const url = window.prompt('URL', previousUrl || 'https://');
  if (url === null) return;
  if (url === '') {
    editor.chain().focus().unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}
