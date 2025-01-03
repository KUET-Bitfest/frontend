"use client"
import Hero from '@/components/utils/Hero'
import Editor from '@/components/editor/Editor'

export default function DocumentsPage() {
  return (
    <main className='bg-main-bg dark:bg-menu-secondary h-screen w-full' >
      <nav className='sticky top-0 bg-main-bg dark:bg-menu-secondary z-50 h-20'>
        <Hero landing={true} />
      </nav>
      <div className="h-[calc(100vh-5rem)] w-full">
        <Editor />
      </div>
    </main>
  )
} 