"use client"
import { mockPDFs } from '@/mock/data'

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Documents Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPDFs.map((pdf) => (
          <div
            key={pdf.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">{pdf.title}</h3>
            <p className="text-sm text-gray-600">{pdf.subtitle}</p>
            <p className="text-xs text-gray-500 mt-2">{pdf.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 