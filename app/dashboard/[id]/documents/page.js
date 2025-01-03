"use client"

import { useState } from 'react'
import { PDFCard } from "@/components/ui/components/pdf-card"
import useFetch from '@/ApiHandle/useFetch'

export default function DocumentsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const {data :documents, loading, error, setData} = useFetch(`/pdf/user/me`)

  const handleStatusChange = async (docId, newStatus) => { 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/pdf/${docId}/switch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access_token}`
        },
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      // Update the documents state with the new status
      setData(prevDocs => 
        prevDocs.map(doc => 
          doc.id === docId ? { ...doc, is_public: newStatus === 'public' } : doc
        )
      )
    } catch (error) {
      console.error('Error updating document status:', error)
    }
  }

  const filteredDocuments = selectedFilter === 'all' 
    ? documents 
    : documents?.filter(doc => doc.is_public === selectedFilter)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="flex items-center space-x-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments?.map((doc) => (
          <PDFCard
            key={doc.id}
            title={doc.title}
            caption={doc.caption}
            status={doc.is_public ? 'public' : 'private'}
            fileName={doc.fileName}
            fileUrl={doc.pdf_url}
            onStatusChange={(newStatus) => handleStatusChange(doc.id, newStatus)}
          />
        ))}
      </div>
    </div>
  )
} 