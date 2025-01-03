import { Editor } from "@tiptap/react";

export function Toolbar({ editor }) {
  return (
    <div className="toolbar">
      <button
        onClick={() => {
          editor?.chain().focus().addPendingComment().run();
        }}
        data-active={editor?.isActive("liveblocksCommentMark")}
      >
        💬 New comment
      </button>
    </div>
  );
}