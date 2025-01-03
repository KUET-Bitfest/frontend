"use client"

import { useState } from 'react'
import { PDFCard } from "@/components/ui/components/pdf-card"
import useFetch from '@/ApiHandle/useFetch'
import Hero from '@/components/utils/Hero'

export default function DocumentsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const {data :documents, loading, error, setData} = useFetch(`/pdf/all`)

  const filteredDocuments = selectedFilter === 'all' 
    ? documents 
    : documents?.filter(doc => doc.is_public === selectedFilter)

  return (
    <main className='bg-main-bg dark:bg-menu-secondary h-full w-full' >
      <nav className='sticky bg-main-bg dark:bg-menu-secondary z-50 h-20'>
        <Hero landing = {true} />
      </nav>
      <div className="container mx-auto px-6 py-8">
        <div className="h-[calc(100vh-140px)] rounded-lg overflow-hidden ">
          <div className="space-y-6 p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="all"
                    name="filter"
                    value="all"
                    checked={selectedFilter === 'all'}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="all" className="text-sm text-gray-700 dark:text-gray-200">All</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="public"
                    name="filter"
                    value="public"
                    checked={selectedFilter === true}
                    onChange={(e) => setSelectedFilter(true)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="public" className="text-sm text-gray-700 dark:text-gray-200">Public</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="private"
                    name="filter"
                    value="private"
                    checked={selectedFilter === false}
                    onChange={(e) => setSelectedFilter(false)}
                    className="text-yellow-600 focus:ring-yellow-500"
                  />
                  <label htmlFor="private" className="text-sm text-gray-700 dark:text-gray-200">Private</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments?.map((doc) => (
                <PDFCard
                  key={doc.id}
                  title={doc.title}
                  caption={doc.caption}
                  status={doc.is_public ? 'public' : 'private'}
                  fileName={doc.fileName}
                  fileUrl={doc.pdf_url}
                  isAdmin={true}
                  user={doc.user}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
    
  )
}
