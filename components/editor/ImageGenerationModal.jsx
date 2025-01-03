import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from "@/components/ui/components/input"
import { Button } from "@/components/ui/components/button"

const ImageGenerationModal = ({ isOpen, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/ai/image-generation?prompt=${encodeURIComponent(prompt)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
      })

      if (!response.ok) throw new Error('Failed to generate image')

      const data = await response.json()
      onGenerate(data.response)
      onClose()
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-10 w-full max-w-md min-h-[400px] relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Generate Image</h2>
          <p className="text-gray-600">Enter a detailed description of the image you want to create</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Image Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A serene landscape with mountains and a lake at sunset..."
              className="w-full min-h-[150px] p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 resize-none"
            />
          </div>

          <Button
            type="submit"
            center
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating your image...</span>
              </div>
            ) : (
              'Generate Image'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ImageGenerationModal 