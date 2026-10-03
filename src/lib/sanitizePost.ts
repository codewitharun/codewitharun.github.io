// src/lib/sanitizePost.ts
// Server-side HTML sanitizer for blog post bodies (written in the admin's
// Tiptap editor, sanitized again here as defense in depth).
//
// Uses sanitize-html (pure JS, no DOM) instead of isomorphic-dompurify:
// that one runs on jsdom on the server, which is heavy and breaks in
// Vercel's serverless runtime. Pages prerendered at build time worked,
// but any post rendered at request time - i.e. every NEW post until the
// next deploy - crashed with "This page couldn't load".
import sanitizeHtml from "sanitize-html";

// Exactly what the editor can produce: StarterKit (paragraphs, headings,
// lists, quotes, code, links, hr...) + images with width/alignment styles.
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "u", "s", "del", "code", "pre", "blockquote",
    "ul", "ol", "li", "a", "img", "span", "div", "figure", "figcaption",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "style", "data-align"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  // Only the inline styles the image extension writes.
  allowedStyles: {
    img: {
      width: [/^\d+(\.\d+)?(px|%|rem|em)$/],
      height: [/^auto$/, /^\d+(\.\d+)?(px|%)$/],
      float: [/^(left|right|none)$/],
      display: [/^(block|inline|inline-block)$/],
      clear: [/^(none|both|left|right)$/],
      margin: [/^(auto|[\d.]+(px|rem|em|%)?)( (auto|[\d.]+(px|rem|em|%)?)){0,3}$/],
    },
  },
  transformTags: {
    // External links open in a new tab, safely.
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
};

export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html ?? "", OPTIONS);
}
