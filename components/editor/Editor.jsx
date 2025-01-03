"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Image from '@tiptap/extension-image'
import { Extension } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { useState, useEffect, useRef } from 'react'
import { 
  Bold, 
  Italic, 
  List, 
  Heading, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  ChevronDown,
  Image as ImageIcon,
  Type,
  AlertCircle
} from 'lucide-react'

// Custom extension for spell checking
const SpellChecker = Extension.create({
  name: 'spellchecker',
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations = [];
            
            doc.descendants((node, pos) => {
              if (node.isText) {
                const words = node.text.split(/\s+/);
                let offset = 0;
                
                words.forEach(word => {
                  if (word.length > 2 && !isWordValid(word)) {
                    decorations.push(
                      Decoration.inline(
                        pos + offset,
                        pos + offset + word.length,
                        { class: 'typo-error' }
                      )
                    );
                  }
                  offset += word.length + 1;
                });
              }
            });
            
            return DecorationSet.create(doc, decorations);
          }
        }
      })
    ];
  }
});

const fontFamilies = [
  { name: 'Default', value: 'Inter' },
  { name: 'Serif', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'SutonnyMJ', value: 'SutonnyMJ' },
  { name: 'Kalpurush', value: 'Kalpurush' },
  { name: 'Nikosh', value: 'Nikosh' },
]

const fontSizes = [
  '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'
]

const Editor = () => {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showFontFamily, setShowFontFamily] = useState(false)
  const [showFontSize, setShowFontSize] = useState(false)
  const recognitionRef = useRef(null)
  const imageInputRef = useRef(null)
  const [typos, setTypos] = useState(new Set());
  const [suggestions, setSuggestions] = useState([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Image.configure({
        allowBase64: true,
      }),
      SpellChecker,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] w-full p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      checkSpelling(content);
    },
  });

  const checkSpelling = (content) => {
    // Simple spell checking logic (replace with a proper dictionary/API)
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/);
    const newTypos = new Set();
    
    words.forEach(word => {
      if (word.length > 2 && !isWordValid(word)) {
        newTypos.add(word);
      }
    });
    
    setTypos(newTypos);
  };

  const isWordValid = (word) => {
    // Replace this with proper dictionary lookup or API call
    const commonBanglaWords = new Set(['আমি', 'তুমি', 'সে', 'আমরা', 'তারা']);
    return commonBanglaWords.has(word);
  };

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'bn-BD' // Set to Bangla

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

        if (event.results[0].isFinal && editor) {
          // Insert text at current cursor position instead of replacing all content
          editor.commands.insertContent(transcript + ' ')
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        if (isListening) {
          recognition.start() // Restart if it was supposed to be listening
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isListening, editor])

  const toggleVoiceInput = () => {
    try {
      if (isListening) {
        recognitionRef.current?.stop()
      } else {
        recognitionRef.current?.start()
      }
      setIsListening(!isListening)
    } catch (error) {
      console.error('Error toggling voice input:', error)
      setIsListening(false)
    }
  }

  const speakContent = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance()
      speech.text = editor?.getHTML().replace(/<[^>]*>/g, '') || ''
      speech.lang = 'bn-BD'
      
      speech.onstart = () => setIsSpeaking(true)
      speech.onend = () => setIsSpeaking(false)
      
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        window.speechSynthesis.speak(speech)
      }
    }
  }

  const addImage = () => {
    imageInputRef.current?.click()
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        editor?.chain().focus().setImage({ src: reader.result }).run()
      }
      reader.readAsDataURL(file)
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full p-4 bg-slate-900 scrollbar-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg sticky top-0 z-10">
        {/* Font Family Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFontFamily(!showFontFamily)}
            className="flex items-center gap-2 p-2 rounded hover:bg-slate-600 text-white"
          >
            <Type className="w-5 h-5" />
            <ChevronDown className="w-4 h-4" />
          </button>
          {showFontFamily && (
            <div className="absolute top-full left-0 mt-1 bg-slate-700 rounded-lg shadow-lg overflow-hidden">
              {fontFamilies.map((font) => (
                <button
                  key={font.value}
                  onClick={() => {
                    editor.chain().focus().setFontFamily(font.value).run()
                    setShowFontFamily(false)
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-slate-600"
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFontSize(!showFontSize)}
            className="flex items-center gap-2 p-2 rounded hover:bg-slate-600 text-white"
          >
            <span className="text-sm">Size</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showFontSize && (
            <div className="absolute top-full left-0 mt-1 bg-slate-700 rounded-lg shadow-lg overflow-hidden">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    editor.chain().focus().setFontSize(size).run()
                    setShowFontSize(false)
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-slate-600"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Existing formatting buttons */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-600 ${editor.isActive('bold') ? 'bg-slate-700' : ''}`}
        >
          <Bold className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-600 ${editor.isActive('italic') ? 'bg-slate-700' : ''}`}
        >
          <Italic className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-600 ${editor.isActive('bulletList') ? 'bg-slate-700' : ''}`}
        >
          <List className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-slate-600 ${editor.isActive('heading') ? 'bg-slate-700' : ''}`}
        >
          <Heading className="w-5 h-5 text-white" />
        </button>

        {/* Image Upload Button */}
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-slate-600"
          title="Add image"
        >
          <ImageIcon className="w-5 h-5 text-white" />
        </button>

        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        <div className="flex-1" />

        {/* Voice Input and Speech buttons */}
        <button
          onClick={toggleVoiceInput}
          className={`p-2 rounded hover:bg-slate-600 ${isListening ? 'bg-red-600' : 'bg-slate-700'}`}
          title={isListening ? 'Stop voice input' : 'Start voice input'}
        >
          {isListening ? (
            <MicOff className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </button>

        <button
          onClick={speakContent}
          className={`p-2 rounded hover:bg-slate-600 ${isSpeaking ? 'bg-purple-600' : 'bg-slate-700'}`}
          title={isSpeaking ? 'Stop speaking' : 'Speak content'}
        >
          {isSpeaking ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 bg-slate-800 rounded-lg overflow-auto text-white relative scrollbar-hidden">
        <EditorContent editor={editor} />
        
        {/* Typo indicators */}
        {typos.size > 0 && (
          <div className="absolute bottom-4 left-4 bg-red-600/90 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{typos.size} possible spelling errors</span>
          </div>
        )}
      </div>

      {/* Voice Input Status */}
      {isListening && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <Mic className="w-4 h-4 animate-pulse" />
          <span>Listening...</span>
        </div>
      )}

      <style jsx global>{`
        .typo-error {
          text-decoration: wavy underline red;
          text-decoration-skip-ink: none;
        }
        
        .suggestion-popup {
          position: absolute;
          background: #1e293b;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          padding: 0.5rem;
          z-index: 50;
        }
        
        .suggestion-item {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          text-align: left;
          color: white;
          border-radius: 0.25rem;
        }
        
        .suggestion-item:hover {
          background: #334155;
        }
      `}</style>
    </div>
  )
}

export default Editor 