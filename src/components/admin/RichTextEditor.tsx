"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link2,
  ImagePlus,
  Minus,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Loader2,
} from "lucide-react";
import { uploadPostImage } from "@/lib/posts";

// Extends the stock Image extension with two attributes so inserted
// images can actually be resized/aligned from within the editor (the
// bubble menu below), instead of always rendering at their raw upload
// size. Both render into a single merged `style` attribute — Tiptap's
// mergeAttributes combines `style` contributions from every attribute
// definition rather than letting one clobber the other.
const ResizableImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => element.style.width || element.getAttribute("width") || "100%",
        renderHTML: (attributes) => ({
          style: `width: ${attributes.width}; height: auto;`,
        }),
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        // "left"/"right" float the image so paragraph text actually wraps
        // around it — a plain block+margin approach (what this used to do)
        // just parks the image on its own row with dead space beside it,
        // which is exactly the "left side is empty" bug this replaces.
        // "center" stays a non-floated block, since a centered image with
        // wrapping text on both sides doesn't make sense.
        renderHTML: (attributes) => {
          const align = attributes.align || "center";
          if (align === "left") {
            return {
              "data-align": align,
              style: "float: left; margin: 0.35rem 1.5rem 0.75rem 0; clear: none;",
            };
          }
          if (align === "right") {
            return {
              "data-align": align,
              style: "float: right; margin: 0.35rem 0 0.75rem 1.5rem; clear: none;",
            };
          }
          return {
            "data-align": align,
            style: "display: block; float: none; margin: 1rem auto; clear: both;",
          };
        },
      },
    };
  },
});

const WIDTH_PRESETS = [
  { label: "S", width: "35%" },
  { label: "M", width: "60%" },
  { label: "L", width: "85%" },
  { label: "Full", width: "100%" },
];

type RichTextEditorProps = {
  value: string; // HTML
  onChange: (html: string) => void;
  slug: string; // used to namespace uploaded image paths in Storage
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`rounded-md p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-mint/15 text-mint"
          : "text-ink-soft hover:bg-bg-raised hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, slug }: { editor: Editor; slug: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  function setLink() {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadPostImage(slug || "post", file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      window.alert("Image upload failed — check Storage rules are deployed.");
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border border-b-0 border-border bg-bg-raised px-2 py-1.5">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code2 size={15} />
      </ToolbarButton>

      <span className="mx-1 h-4 w-px bg-border" />

      <ToolbarButton
        label="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={15} />
      </ToolbarButton>

      <span className="mx-1 h-4 w-px bg-border" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={15} />
      </ToolbarButton>

      <span className="mx-1 h-4 w-px bg-border" />

      <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
        <Link2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        label={uploadingImage ? "Uploading…" : "Insert image"}
        disabled={uploadingImage}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploadingImage ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploadingImage}
        onChange={handleImageFile}
      />
      <ToolbarButton
        label="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={15} />
      </ToolbarButton>

      <span className="mx-1 h-4 w-px bg-border" />

      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={15} />
      </ToolbarButton>

      {uploadingImage && (
        <span className="ml-auto flex items-center gap-1.5 text-xs text-ink-faint">
          <Loader2 size={13} className="animate-spin" />
          Compressing &amp; uploading…
        </span>
      )}
    </div>
  );
}

export default function RichTextEditor({ value, onChange, slug }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false, // configured separately below with our own defaults
      }),
      TiptapLink.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      ResizableImage,
      Placeholder.configure({
        placeholder: "Write the post…",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "markdown-content min-h-[280px] px-4 py-3 outline-none",
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  // Keep the editor in sync when a different post is loaded into the same
  // mounted editor instance (switching between "New post" and "Edit").
  const lastExternalValue = useRef(value);
  useEffect(() => {
    if (!editor) return;
    if (value !== lastExternalValue.current && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
    lastExternalValue.current = value;
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[320px] rounded-lg border border-border bg-bg" aria-hidden />
    );
  }

  return (
    <div>
      <Toolbar editor={editor} slug={slug} />
      <div className="rounded-b-lg border border-border bg-bg text-sm text-ink">
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor: e }) => e.isActive("image")}
          options={{ placement: "top" }}
        >
          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-bg-raised p-1 shadow-lg">
            {WIDTH_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                title={preset.label}
                onClick={() =>
                  editor.chain().focus().updateAttributes("image", { width: preset.width }).run()
                }
                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  editor.getAttributes("image").width === preset.width
                    ? "bg-mint/15 text-mint"
                    : "text-ink-soft hover:bg-bg hover:text-ink"
                }`}
              >
                {preset.label}
              </button>
            ))}
            <span className="mx-1 h-4 w-px bg-border" />
            <ToolbarButton
              label="Align left"
              active={editor.getAttributes("image").align === "left"}
              onClick={() => editor.chain().focus().updateAttributes("image", { align: "left" }).run()}
            >
              <AlignLeft size={15} />
            </ToolbarButton>
            <ToolbarButton
              label="Align center"
              active={editor.getAttributes("image").align === "center"}
              onClick={() => editor.chain().focus().updateAttributes("image", { align: "center" }).run()}
            >
              <AlignCenter size={15} />
            </ToolbarButton>
            <ToolbarButton
              label="Align right"
              active={editor.getAttributes("image").align === "right"}
              onClick={() => editor.chain().focus().updateAttributes("image", { align: "right" }).run()}
            >
              <AlignRight size={15} />
            </ToolbarButton>
          </div>
        </BubbleMenu>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
