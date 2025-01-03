"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Image from '@tiptap/extension-image'
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
  FileDown,
  Eye
} from 'lucide-react'
import ErrorCheckModal from './ErrorCheckModal'
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { z } from "zod"
import html2pdf from 'html2pdf.js'

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

// Define the schema for error analysis
const ErrorAnalysis = z.object({
  errorWords: z.array(z.string()),
  suggestedText: z.string()
});

const Editor = () => {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showFontFamily, setShowFontFamily] = useState(false)
  const [showFontSize, setShowFontSize] = useState(false)
  const recognitionRef = useRef(null)
  const imageInputRef = useRef(null)
  const [selectedText, setSelectedText] = useState('')
  const [showErrorCheck, setShowErrorCheck] = useState(false)
  const [errorCheckPosition, setErrorCheckPosition] = useState({ x: 0, y: 0 })
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [errorAnalysis, setErrorAnalysis] = useState(null)

  const handleTextSelection = () => {
    if (editor) {
      const { from, to } = editor.state.selection
      const text = editor.state.doc.textBetween(from, to).trim()
      
      if (text) {
        // Get the DOM node and position of the selection
        const domSel = window.getSelection()
        if (domSel.rangeCount > 0) {
          const range = domSel.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          
          setSelectedText(text)
          setErrorCheckPosition({
            x: rect.left + rect.width / 2,
            y: rect.bottom + window.scrollY
          })
          setShowErrorCheck(true)
        }
      } else {
        setShowErrorCheck(false)
      }
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] w-full p-4',
      },
      handleDOMEvents: {
        mouseup: () => {
          handleTextSelection()
          return false
        },
        keyup: () => {
          handleTextSelection()
          return false
        }
      }
    },
  });

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'bn-BD'

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

        if (event.results[0].isFinal && editor) {
          editor.commands.insertContent(transcript + ' ')
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        if (isListening) {
          recognition.start() 
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

  const checkErrors = async () => {
    setShowErrorCheck(false)
    setIsErrorModalOpen(true)
    
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a Banglish (Bengali written in English) text analyzer. Analyze the text for common errors and provide suggestions. Respond with a JSON object containing 'errorWords' (array of incorrect words) and 'suggestedText' (improved version)."
          },
          {
            role: "user",
            content: selectedText
          }
        ],
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(completion.choices[0].message.content);
      setErrorAnalysis(analysis);
    } catch (error) {
      console.error('Error checking text:', error);
    }
  }

  const translateText = async () => {
    setShowErrorCheck(false)
    
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a Banglish to Bangla translator. Convert the given Banglish text (Bengali language written in English alphabets) to proper Bangla text. Only return the translated Bengali text, nothing else."
          },
          {
            role: "user",
            content: selectedText
          }
        ]
      });

      const translatedText = completion.choices[0].message.content;
      
      // Replace the selected text with translated text
      const { from, to } = editor.state.selection;
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(translatedText)
        .run();

    } catch (error) {
      console.error('Error translating text:', error);
    }
  }

  const generatePDF = (preview = false) => {
    // Create a temporary div to render the content
    const tempDiv = document.createElement('div')
    
    // Add the editor content to the div
    tempDiv.innerHTML = editor.getHTML()
    
    // Add some styling to the temp div
    tempDiv.style.padding = '40px'
    tempDiv.style.fontSize = '14px'
    tempDiv.style.fontFamily = 'Kalpurush, Inter, sans-serif'
    
    const opt = {
      margin: 20,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    }

    if (preview) {
      // For preview, generate and open in new tab
      html2pdf().set(opt).from(tempDiv).outputPdf().then((pdf) => {
        const blob = new Blob([pdf], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
      })
    } else {
      // For download
      html2pdf().set(opt).from(tempDiv).save()
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

        {/* PDF Buttons */}
        <button
          onClick={() => generatePDF(true)}
          className="p-2 rounded hover:bg-slate-600 text-white flex items-center gap-2"
          title="Preview PDF"
        >
          <Eye className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => generatePDF(false)}
          className="p-2 rounded hover:bg-slate-600 text-white flex items-center gap-2"
          title="Download PDF"
        >
          <FileDown className="w-5 h-5" />
        </button>

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
      </div>

      {/* Voice Input Status */}
      {isListening && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <Mic className="w-4 h-4 animate-pulse" />
          <span>Listening...</span>
        </div>
      )}

      {/* Error Check Tooltip */}
      {showErrorCheck && (
        <div 
          className="fixed z-50 bg-slate-800 rounded-lg shadow-lg p-2 cursor-pointer"
          style={{
            left: `${errorCheckPosition.x + 80}px`,
            top: `${errorCheckPosition.y + 10}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex gap-2">
            <button
              onClick={checkErrors}
              className="px-3 py-1.5 text-sm text-white hover:text-purple-400 flex items-center gap-2"
            >
              <span>Check for errors</span>
              <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                AI
              </span>
            </button>

            <div className="w-px bg-slate-600" /> {/* Divider */}

            <button
              onClick={translateText}
              className="px-3 py-1.5 text-sm text-white hover:text-purple-400 flex items-center gap-2"
            >
              <span>Translate</span>
              <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                AI
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Error Check Modal */}
      <ErrorCheckModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        originalText={selectedText}
        errorWords={errorAnalysis?.errorWords || []}
        suggestedText={errorAnalysis?.suggestedText || ''}
        editor={editor}
      />
    </div>
  )
}

export default Editor 