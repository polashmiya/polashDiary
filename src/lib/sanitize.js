// Lightweight HTML sanitizer to remove obviously dangerous content
// - strips script/style/meta/link/object/embed/iframe tags
// - removes on* event handler attributes
// - ensures href/src use http(s) protocols only

export function sanitizeHtml(input) {
  if (!input || typeof input !== "string") return "";
  const template = document.createElement("template");
  template.innerHTML = input;
  const forbidden = new Set(["SCRIPT","STYLE","META","LINK","OBJECT","EMBED","IFRAME"]);

  const tree = template.content;
  const walker = document.createTreeWalker(tree, NodeFilter.SHOW_ELEMENT, null);
  const toRemove = [];

  while (walker.nextNode()) {
    const el = walker.currentNode;
    if (forbidden.has(el.tagName)) {
      toRemove.push(el);
      continue;
    }
    // remove event handlers
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
        continue;
      }
      if ((name === "src" || name === "href") && attr.value) {
        const val = String(attr.value).trim();
        const lower = val.toLowerCase();
        if (!(lower.startsWith("http://") || lower.startsWith("https://"))) {
          el.removeAttribute(attr.name);
        }
      }
    }
  }

  for (const n of toRemove) n.remove();
  return template.innerHTML;
}
