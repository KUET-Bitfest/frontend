"use client"

import Hero from "@/components/utils/Hero"
import Translator from "@/components/utils/Translator"

export default function TranslatePage() {
  return (
    <main className='bg-main-bg dark:bg-menu-secondary h-screen w-full' >
      <nav className='sticky bg-main-bg dark:bg-menu-secondary z-50 h-20'>
        <Hero landing={true} />
      </nav>
      <div className="container mx-auto flex justify-center items-center h-full">
        <Translator />
      </div>
    </main>
  )
} 