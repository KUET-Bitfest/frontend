"use client"

import { useState, useEffect } from 'react'
import { MdClose, MdSearch } from 'react-icons/md'
import { mockUsers, mockPDFs } from '@/mock/data'
import Image from 'next/image'

export default function SearchSidebar({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [filteredPDFs, setFilteredPDFs] = useState([])

  useEffect(() => {
    if (searchQuery) {
      const users = mockUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      const pdfs = mockPDFs.filter(pdf =>
        pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pdf.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )

      setFilteredUsers(users)
      setFilteredPDFs(pdfs)
    } else {
      setFilteredUsers([])
      setFilteredPDFs([])
    }
  }, [searchQuery])

  return (
    <div 
      className={`fixed top-0 right-0 h-screen w-96 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Search</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <MdClose className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users or PDFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Results */}
      <div className="overflow-auto h-[calc(100vh-140px)]">
        {/* People Section */}
        {filteredUsers.length > 0 && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">PEOPLE</h3>
            <div className="space-y-3">
              {filteredUsers.map(user => (
                <div 
                  key={user.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={"/profile.png"}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PDFs Section */}
        {filteredPDFs.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">PDFs</h3>
            <div className="space-y-3">
              {filteredPDFs.map(pdf => (
                <div 
                  key={pdf.id}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <div className="font-medium">{pdf.title}</div>
                  <div className="text-sm text-gray-500">{pdf.subtitle}</div>
                  <div className="text-xs text-gray-400 mt-1">{pdf.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery && filteredUsers.length === 0 && filteredPDFs.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No results found
          </div>
        )}
      </div>
    </div>
  )
} 