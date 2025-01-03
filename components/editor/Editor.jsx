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
  ChevronDown,
  Image as ImageIcon,
  Type,
  FileDown,
  Eye,
  Wand2,
  BookOpen
} from 'lucide-react'
import ErrorCheckModal from './ErrorCheckModal'
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { z } from "zod"
import html2pdf from 'html2pdf.js'
import { Input } from "@/components/ui/components/input"
import { Button } from "@/components/ui/components/button"
import { cn } from "@/lib/utils"
import ImageGenerationModal from './ImageGenerationModal'
import StoryGenerationModal from './StoryGenerationModal'

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
  const [showFontFamily, setShowFontFamily] = useState(false)
  const [showFontSize, setShowFontSize] = useState(false)
  const imageInputRef = useRef(null)
  const [selectedText, setSelectedText] = useState('')
  const [showErrorCheck, setShowErrorCheck] = useState(false)
  const [errorCheckPosition, setErrorCheckPosition] = useState({ x: 0, y: 0 })
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [errorAnalysis, setErrorAnalysis] = useState(null)
  const [documentMeta, setDocumentMeta] = useState({
    title: '',
    caption: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [showImageGenModal, setShowImageGenModal] = useState(false)
  const [showStoryModal, setShowStoryModal] = useState(false)

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
        model: "gpt-4o",
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

  const generatePDF = async (preview = false) => {
    // Create a temporary div to render the content
    const tempDiv = document.createElement('div')
    
    // Add title and caption if they exist
    let contentHTML = '';
    if (documentMeta.title.trim()) {
      contentHTML += `
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px; text-align: center;">
          ${documentMeta.title}
        </h1>
      `;
    }
    if (documentMeta.caption.trim()) {
      contentHTML += `
        <p style="font-size: 16px; color: #666; margin-bottom: 24px; text-align: center; font-style: italic;">
          ${documentMeta.caption}
        </p>
      `;
    }
    
    // Add the editor content
    contentHTML += editor.getHTML();
    
    // Set the complete HTML content
    tempDiv.innerHTML = contentHTML;
    
    // Add some styling to the temp div
    tempDiv.style.padding = '40px'
    tempDiv.style.fontSize = '14px'
    tempDiv.style.fontFamily = 'Kalpurush, Inter, sans-serif'
    
    const opt = {
      margin: 20,
      filename: documentMeta.title.trim() ? `${documentMeta.title}.pdf` : 'document.pdf',
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
      // For sending to backend
      console.log("Sending to backend")
      const formData = new FormData()
      const pdfBlob = await html2pdf().set(opt).from(tempDiv).outputPdf('blob').then((pdf) => {
        return new Blob([pdf], { type: 'application/pdf' })
      })
      formData.append('file', pdfBlob)

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/pdf/create?title=${documentMeta.title}&caption=${documentMeta.caption}`, {
          method: 'POST',
          headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")).access_token,
            "ngrok-skip-browser-warning": "69420"
          },
          body: formData
        })

        if (!response.ok) {
          throw new Error('Failed to upload PDF')
        }

        const data = await response.json()
        console.log('PDF uploaded successfully:', data)
      } catch (error) {
        console.error('Error uploading PDF:', error)
      }
    }
  }

  const generateMetadata = async () => {
    if (!editor?.getHTML()) return

    setIsGenerating(true)
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
        dangerouslyAllowBrowser: true
      });

      const content = editor.getHTML().replace(/<[^>]*>/g, '')

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a document metadata generator. You must ALWAYS respond in Bengali script (not Banglish). Generate a concise title (around 10 words) and a descriptive caption (20-30 words) for the given content. The content might be in English, Banglish, or Bengali - but your response must always be in Bengali script. Respond in JSON format with 'title' and 'caption' fields."
          },
          {
            role: "user",
            content: content
          }
        ],
        response_format: { type: "json_object" }
      });

      const metadata = JSON.parse(completion.choices[0].message.content);
      setDocumentMeta({
        title: metadata.title,
        caption: metadata.caption
      });
    } catch (error) {
      console.error('Error generating metadata:', error);
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleVoiceRecording = async () => {
    try {
      if (isListening) {
        // Stop recording
        mediaRecorderRef.current?.stop();
        setIsListening(false);
      } else {
        // Start recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Try different MIME types in order of preference
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
            ? 'audio/ogg;codecs=opus'
            : 'audio/webm';

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: mimeType
        });
        
        mediaRecorder.onstart = () => {
          chunksRef.current = [];
        };

        mediaRecorder.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          setIsProcessingVoice(true);
          try {
            // Create audio blob
            const audioBlob = new Blob(chunksRef.current, { type: mimeType });
            
            // Convert WebM to WAV
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            // Create WAV file
            const wavBuffer = audioBufferToWav(audioBuffer);
            const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
            
            // Create a File object from the WAV Blob
            const audioFile = new File([wavBlob], 'recording.wav', {
              type: 'audio/wav',
              lastModified: Date.now()
            });

            const formData = new FormData();
            formData.append('file', audioFile);
            
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/ai/speech-to-bangla`, {
                method: 'POST',
                body: formData
              });
              const data = await response.json();
              
              if (data.response) {
                editor?.chain().focus().insertContent(data.response).run();
              }
            } catch (error) {
              console.error('Upload failed:', error);
            }
            
            // Clean up
            stream.getTracks().forEach(track => track.stop());
            audioContext.close();
          } catch (error) {
            console.error('Error processing audio:', error);
          } finally {
            setIsProcessingVoice(false);
          }
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorderRef.current.start();
        setIsListening(true);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Add this helper function to convert AudioBuffer to WAV format
  function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2;
    const buffer2 = new ArrayBuffer(44 + length);
    const view = new DataView(buffer2);
    const channels = [];
    let sample;
    let offset = 0;
    let pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(36 + length);                        // file length - 8
    setUint32(0x45564157);                         // "WAVE"
    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);  // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit
    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length);                             // chunk length

    // write interleaved data
    for(let i = 0; i < buffer.numberOfChannels; i++)
      channels.push(buffer.getChannelData(i));

    while(pos < buffer.length) {
      for(let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][pos]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0;
        view.setInt16(44 + offset, sample, true); 
        offset += 2;
      }
      pos++;
    }

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }

    return buffer2;
  }

  const handleGeneratedImage = (imageUrl) => {
    editor?.chain().focus().setImage({ src: imageUrl }).run()
  }

  const handleGeneratedStory = (story) => {
    editor?.chain().focus().insertContent(story).run()
  }

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full p-4 bg-slate-900 scrollbar-hidden">
      {/* Document Metadata Section */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Title Section */}
          <div className="space-y-2">
            <Input
              value={documentMeta.title}
              onChange={(e) => setDocumentMeta(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a descriptive title..."
              className="w-full bg-slate-700/50 border-slate-600/50 text-white text-lg font-medium placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          {/* Caption Section */}
          <div className="space-y-2">
            <Input
              value={documentMeta.caption}
              onChange={(e) => setDocumentMeta(prev => ({ ...prev, caption: e.target.value }))}
              placeholder="Add a brief caption..."
              className="w-full bg-slate-700/50 border-slate-600/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              onClick={generateMetadata}
              disabled={!editor?.getHTML() || isGenerating}
              
            >
              <div className="flex items-center gap-2">
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-white/70">Generating...</span>
                  </>
                ) : (
                  <>
                    <span className="text-white">Generate Using</span>
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-purple-100 bg-purple-500/50 rounded-full group-hover:bg-purple-500/70 transition-colors">
                      AI
                    </span>
                  </>
                )}
              </div>
              
              {/* Hover tooltip */}
              {!isGenerating && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Generate title and caption from content
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

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

        <button
          onClick={() => setShowImageGenModal(true)}
          className="p-2 rounded hover:bg-slate-600"
          title="Generate image with AI"
        >
          <Wand2 className="w-5 h-5 text-white" />
        </button>

        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        <button
          onClick={() => setShowStoryModal(true)}
          className="p-2 rounded hover:bg-slate-600"
          title="Generate story with AI"
        >
          <BookOpen className="w-5 h-5 text-white" />
        </button>

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

        {/* Voice Input Button */}
        <button
          onClick={toggleVoiceRecording}
          className={cn(
            "p-2 rounded hover:bg-slate-600 transition-colors relative",
            isListening ? "bg-red-600" : isProcessingVoice ? "bg-yellow-600" : "bg-slate-700"
          )}
          title={
            isListening 
              ? 'Stop recording' 
              : isProcessingVoice 
                ? 'Processing voice...' 
                : 'Start recording'
          }
          disabled={isProcessingVoice}
        >
          {isProcessingVoice ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="absolute left-full ml-2 whitespace-nowrap text-sm bg-slate-800 px-2 py-1 rounded">
                Processing voice...
              </span>
            </div>
          ) : isListening ? (
            <MicOff className="w-5 h-5 text-white animate-pulse" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 bg-slate-800 rounded-lg overflow-auto text-white relative scrollbar-hidden">
        <EditorContent editor={editor} />
      </div>

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

      <ImageGenerationModal
        isOpen={showImageGenModal}
        onClose={() => setShowImageGenModal(false)}
        onGenerate={handleGeneratedImage}
      />

      <StoryGenerationModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onGenerate={handleGeneratedStory}
      />
    </div>
  )
}

export default Editor 