"use client";

import { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Minus,
  List,
  ListOrdered,
  LinkIcon,
  Unlink,
  ImageIcon,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
  CodeSquare,
  Eraser,
  Maximize2,
  Minimize2,
  FileCode2,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
      aria-pressed={active}
      title={label}
      className={`p-2 rounded-md border transition-colors disabled:opacity-40 ${
        active
          ? "bg-indigo-600 border-indigo-600 text-white"
          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceDraft, setSourceDraft] = useState(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      ImageExt,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder: "Start writing the story…" }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "article-body min-h-[320px] focus:outline-none px-4 py-4",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor || uploadingRef.current) return;
      uploadingRef.current = true;
      try {
        const supabase = createClient();
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from("article-images")
          .upload(path, file);
        if (error) {
          alert(`Image upload failed: ${error.message}`);
          return;
        }
        const { data } = supabase.storage.from("article-images").getPublicUrl(path);
        editor.chain().focus().setImage({ src: data.publicUrl }).run();
      } finally {
        uploadingRef.current = false;
      }
    },
    [editor]
  );

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const toggleSourceMode = () => {
    if (!editor) return;
    if (!sourceMode) {
      setSourceDraft(editor.getHTML());
      setSourceMode(true);
    } else {
      editor.commands.setContent(sourceDraft);
      onChange(sourceDraft);
      setSourceMode(false);
    }
  };

  if (!editor) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 flex items-center justify-center text-slate-400">
        <Loader2 className="animate-spin" size={20} />
      </div>
    );
  }

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 bg-white flex flex-col"
          : "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      }
    >
      <div className="flex flex-wrap gap-1.5 p-2.5 border-b border-slate-200 bg-slate-50">
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={15} />
        </ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={15} />
        </ToolbarButton>
        <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={15} />
        </ToolbarButton>
        <ToolbarButton label="Heading 4" active={editor.isActive("heading", { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
          <Heading4 size={15} />
        </ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={15} />
        </ToolbarButton>
        <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight size={15} />
        </ToolbarButton>
        <ToolbarButton label="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          <AlignJustify size={15} />
        </ToolbarButton>
        <ToolbarButton label="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code size={15} />
        </ToolbarButton>
        <ToolbarButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <CodeSquare size={15} />
        </ToolbarButton>
        <ToolbarButton label="Superscript" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
          <SuperscriptIcon size={15} />
        </ToolbarButton>
        <ToolbarButton label="Subscript" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()}>
          <SubscriptIcon size={15} />
        </ToolbarButton>
        <ToolbarButton label="Insert link" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton
          label="Remove link"
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink size={15} />
        </ToolbarButton>
        <ToolbarButton label="Insert image" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={15} />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
            e.target.value = "";
          }}
        />
        <ToolbarButton
          label="Clear formatting"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          <Eraser size={15} />
        </ToolbarButton>
        <span className="flex-1" />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 size={15} />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          label={sourceMode ? "Switch to visual editor" : "Edit HTML source"}
          active={sourceMode}
          onClick={toggleSourceMode}
        >
          <FileCode2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          label={fullscreen ? "Exit fullscreen" : "Distraction-free fullscreen"}
          active={fullscreen}
          onClick={() => setFullscreen((v) => !v)}
        >
          {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </ToolbarButton>
      </div>

      {sourceMode ? (
        <textarea
          value={sourceDraft}
          onChange={(e) => setSourceDraft(e.target.value)}
          className={`w-full font-mono text-sm p-4 focus:outline-none resize-none ${
            fullscreen ? "flex-1" : "min-h-[320px]"
          }`}
          spellCheck={false}
        />
      ) : (
        <div className={fullscreen ? "flex-1 overflow-y-auto" : ""}>
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}
