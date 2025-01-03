"use client"

import { useState } from 'react'
import { PDFCard } from "@/components/ui/components/pdf-card"

export default function DocumentsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Medical Report Translation",
      caption: "Translated from English to Bengali",
      status: "private",
      fileName: "medical_report_2024.pdf",
      fileUrl: "example.pdf"
    },
    {
      id: 2,
      title: "Academic Certificate",
      caption: "Official document translation",
      status: "public",
      fileName: "certificate_2024.pdf",
      fileUrl: "example.pdf"
    },
    {
      id: 3,
      title: "Legal Document",
      caption: "Contract translation with certification",
      status: "private",
      fileName: "legal_doc_2024.pdf",
      fileUrl: "example.pdf"
    },
    {
      id: 4,
      title: "Research Paper",
      caption: "Technical document translation",
      status: "public",
      fileName: "research_2024.pdf",
      fileUrl: "example.pdf"
    }
  ])

  const handleStatusChange = (docId, newStatus) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === docId ? { ...doc, status: newStatus } : doc
      )
    )
  }

  const filteredDocuments = selectedFilter === 'all' 
    ? documents 
    : documents.filter(doc => doc.status === selectedFilter)

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
              checked={selectedFilter === 'public'}
              onChange={(e) => setSelectedFilter(e.target.value)}
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
              checked={selectedFilter === 'private'}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-yellow-600 focus:ring-yellow-500"
            />
            <label htmlFor="private" className="text-sm text-gray-700 dark:text-gray-200">Private</label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <PDFCard
            key={doc.id}
            title={doc.title}
            caption={doc.caption}
            status={doc.status}
            fileName={doc.fileName}
            fileUrl={doc.fileUrl}
            onStatusChange={(newStatus) => handleStatusChange(doc.id, newStatus)}
          />
        ))}
      </div>
    </div>
  )
} 