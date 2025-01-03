"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

export default function LinkGeneratorPage() {
  const [generatedLink, setGeneratedLink] = useState('')
  const [loading, setLoading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Write your text here...</p>',
  })

  const handleGenerateLink = async () => {
    if (!editor) return
    const plainText = editor.getText()
    console.log('Plain text:', plainText)

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/generate-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access_token}`,
          'ngrok-skip-browser-warning': '69420',
        },
        body: JSON.stringify({
          text: plainText
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate link')
      }

      const data = await response.json()
      setGeneratedLink(data.link)
    } catch (error) {
      console.error('Error generating link:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Generate Link from Text
      </h1>

      {/* Editor */}
      <div className="prose max-w-none">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <EditorContent 
            editor={editor} 
            className="min-h-[200px] p-4 focus:outline-none"
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end">
        <button
          onClick={handleGenerateLink}
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Link'
          )}
        </button>
      </div>

      {generatedLink && (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Generated Link:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={generatedLink}
              readOnly
              className="flex-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            />
            <button
              onClick={() => navigator.clipboard.writeText(generatedLink)}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}