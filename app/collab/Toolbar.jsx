import { Editor } from "@tiptap/react";

export function Toolbar({ editor }) {
  return (
    <div className="toolbar">
      <select 
        onChange={(e) => editor?.chain().focus().setParagraph().run()}
        className="bg-transparent text-gray-300 border-none outline-none cursor-pointer hover:bg-[#2d333b] rounded px-2 py-1"
      >
        <option value="paragraph">Normal text</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
      </select>
      
      <div className="toolbar-divider" />
      
      <button
        onClick={() => editor?.chain().focus().toggleBold().run()}
        data-active={editor?.isActive("bold")}
        title="Bold"
      >
        B
      </button>
      
      <button
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        data-active={editor?.isActive("italic")}
        title="Italic"
      >
        I
      </button>
      
      <button
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        data-active={editor?.isActive("strike")}
        title="Strike"
      >
        S
      </button>
      
      <div className="toolbar-divider" />
      
      <button
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        data-active={editor?.isActive("bulletList")}
        title="Bullet List"
      >
        •
      </button>
      
      <button
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        data-active={editor?.isActive("orderedList")}
        title="Numbered List"
      >
        1.
      </button>
      
      <div className="toolbar-divider" />
      
      <button
        onClick={() => editor?.chain().focus().addPendingComment().run()}
        data-active={editor?.isActive("liveblocksCommentMark")}
        title="Add Comment"
      >
        💬
      </button>
    </div>
  );
}