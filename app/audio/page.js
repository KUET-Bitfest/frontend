"use client"

import { Button } from '@/components/ui/components/button'
import { Spinner } from '@/components/ui/components/spinner'
import Hero from '@/components/utils/Hero'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import { useState } from 'react'
import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ChevronDown
} from 'lucide-react'
import Loading from '@/components/ui/components/loading'
import { BsWindowSidebar } from 'react-icons/bs'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2">
      <select
        onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
        className="h-8 outline-none dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded px-2"
      >
        <option value="Inter">Default</option>
        <option value="Comic Sans MS">Comic Sans</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
        >
          <Underline size={16} />
        </button>
      </div>

      <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
        >
          <AlignLeft size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
        >
          <AlignCenter size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
        >
          <AlignRight size={16} />
        </button>
      </div>

      <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
      >
        <List size={16} />
      </button>
    </div>
  )
}

export default function StoryPage() {
  const [generatedLink, setGeneratedLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg lg:prose-xl xl:prose-2xl mx-auto focus:outline-none w-full h-full min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
        setText(editor.getText())
    }
  })

  const handleGenerateLink = async () => {
    if (!editor) return

    const content = editor.getText()
    console.log('Submitting content:', content)

    setLoading(true)
    try {
      let token = localStorage.getItem('token')
      if (!token) {
        return
      }
      token = JSON.parse(token)
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/ai/story-vision?prompt=${content}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.access_token}`,
          'ngrok-skip-browser-warning': '69420',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to generate link')
      }

      const data = await response.json()

      setGeneratedLink(data.video_url)
    } catch (error) {
      console.error('Error generating link:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='bg-main-bg dark:bg-menu-secondary min-h-screen w-full'>
      {loading ? (
        <div className="h-screen w-full flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <nav className='sticky bg-main-bg dark:bg-menu-secondary z-50 h-20'>
            <Hero landing={true} />
          </nav>
          <div className="w-full h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 gap-6">
            {!generatedLink ? (
              <>
                {/* Editor Container */}
                <div className="w-full max-w-5xl h-[700px]">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                    <MenuBar editor={editor} />
                    <div className="flex-1 overflow-auto">
                      <EditorContent 
                        editor={editor} 
                        className="h-full w-full cursor-text"
                      />
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="w-full max-w-5xl flex justify-end">
                  <Button
                    center
                    onClick={handleGenerateLink}
                    disabled={loading}
                    isLoading={loading}
                  >
                    Generate Story Book
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full max-w-4xl space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mr-2"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedLink)}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                </div>
                
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <video 
                    controls 
                    className="w-full h-full"
                    src={generatedLink}
                  >
                    Your browser does not support the video tag.
                  </video>
                  
                </div>

                <div className="w-full flex justify-center items-center">
                  <Button onClick={
                    ()=>
                    {
                      window.location.reload();
                    }
                  }>Generate Again</Button>
                </div>
              </div>
              
            )}
          </div>
        </>
      )}
    </main>
  )
} 