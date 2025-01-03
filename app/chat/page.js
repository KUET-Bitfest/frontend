"use client"

import ChatContainer from '@/components/chat/ChatContainer'
import Hero from '@/components/utils/Hero'

export default function ChatPage() {
  return (
    <main className='bg-main-bg dark:bg-menu-secondary h-full w-full' >
      <nav className='sticky bg-main-bg dark:bg-menu-secondary z-50 h-20'>
        <Hero landing = {true} />
      </nav>
      <div className="container w-full mx-auto h-full">
        <div className="h-[calc(100vh-100px)] w-full rounded-lg overflow-hidden shadow-lg">
            <ChatContainer />
        </div>
    </div>
    </main>
  )
} 