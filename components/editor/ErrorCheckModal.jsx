"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/components/dialog"
import { Copy, Check, Replace } from "lucide-react"
import { useState } from "react"

export default function ErrorCheckModal({ 
  isOpen, 
  onClose, 
  originalText, 
  errorWords = [], 
  suggestedText,
  editor
}) {
  const [replaced, setReplaced] = useState(false)

  const highlightErrors = (text) => {
    let highlightedText = text;
    errorWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<span class="underline decoration-red-500 decoration-wavy underline-offset-4">${word}</span>`
      );
    });
    return highlightedText;
  };

  const replaceText = () => {
    if (editor) {
      const { from, to } = editor.state.selection
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(suggestedText)
        .run()
      
      setReplaced(true)
      setTimeout(() => {
        setReplaced(false)
        onClose()
      }, 1000)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Banglish Text Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {/* Original Text Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-200">
                Original Text
              </h3>
              {errorWords.length > 0 && (
                <span className="text-sm text-red-400">
                  {errorWords.length} error{errorWords.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
            <div 
              className="p-4 bg-slate-800 rounded-lg min-h-[200px] text-gray-100"
              dangerouslySetInnerHTML={{ 
                __html: highlightErrors(originalText) 
              }}
            />
          </div>
          
          {/* Suggested Text Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-200">
                Suggested Text
              </h3>
              <button
                onClick={replaceText}
                disabled={!suggestedText}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors
                  ${replaced 
                    ? 'bg-green-600 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {replaced ? (
                  <>
                    <Check className="w-4 h-4" />
                    Replaced!
                  </>
                ) : (
                  <>
                    <Replace className="w-4 h-4" />
                    Replace Text
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg min-h-[200px] text-gray-100">
              {suggestedText || (
                <span className="text-gray-400 italic">
                  Loading suggestions...
                </span>
              )}
            </div>
          </div>
        </div>

        {errorWords.length > 0 && (
          <div className="mt-6 p-4 bg-slate-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-200 mb-2">
              Detected Errors:
            </h4>
            <div className="flex flex-wrap gap-2">
              {errorWords.map((word, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 