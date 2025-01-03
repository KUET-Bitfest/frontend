"use client";

import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Threads } from "./Threads";
import { Toolbar } from "./Toolbar";
import "./styles.css";
import html2pdf from 'html2pdf.js';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast, Toaster } from 'sonner';

export function Editor() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const liveblocks = useLiveblocksExtension();

  const editor = useEditor({
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false,
      }),
    ],
    content: "<p>Start typing here...</p>",
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  const generatePDF = () => {
    const editorContent = document.querySelector('.ProseMirror');
    const opt = {
      margin: 1,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Create a clone of the content with white background for PDF
    const contentClone = editorContent.cloneNode(true);
    
    // Remove all cursor elements
    const cursors = contentClone.querySelectorAll('.collaboration-cursor__caret');
    const cursorLabels = contentClone.querySelectorAll('.collaboration-cursor__label');
    cursors.forEach(cursor => cursor.remove());
    cursorLabels.forEach(label => label.remove());
    
    // Create temporary div for PDF generation
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(contentClone);
    tempDiv.style.background = 'white';
    tempDiv.style.color = 'black';
    tempDiv.style.padding = '20px';
    
    html2pdf().set(opt).from(tempDiv).save();
  };

  const handleTranslate = async (text, targetLang) => {
    setIsTranslating(true);
    try {
      // Your translation logic here
      const translatedText = await translateText(text, targetLang);
      editor?.commands.setContent(translatedText);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleShare = () => {
    const uniqueKey = uuidv4();
    const url = `/collab/share?token=${uniqueKey}`;
    setShareUrl(url);
    
    // Copy to clipboard
    navigator.clipboard.writeText(window.location.origin + url)
      .then(() => {
        toast.success('Share link copied to clipboard!', {
          duration: 3000,
          style: {
            background: '#1a1d21',
            color: '#fff',
            border: '1px solid #2d333b',
            padding: '16px 24px',
            fontSize: '1rem',
            maxWidth: '400px',
            textAlign: 'center'
          },
        });
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy link to clipboard', {
          duration: 3000,
          position: 'bottom-right',
        });
      });
  };

  return (
    <div className="editor-container">
      <Toaster />
      {isTranslating && (
        <div className="loader-container">
          <div className="loader"></div>
          <span>Translating...</span>
        </div>
      )}
      <Toolbar editor={editor} onTranslate={handleTranslate} />
      <EditorContent editor={editor} className="editor" />
      <Threads editor={editor} />
      <div className="pdf-button-container" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleShare}
          className="generate-pdf-button"
          style={{ 
            backgroundColor: '#4F46E5',
            '&:hover': {
              backgroundColor: '#4338CA'
            }
          }}
        >
          Share Document
        </button>
        <button 
          onClick={generatePDF}
          className="generate-pdf-button"
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
}