"use client"

import { useState, useEffect } from 'react'
import { MdClose, MdSearch } from 'react-icons/md'
import Image from 'next/image'

export default function SearchSidebar({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ users: [], pdfs: [] })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ users: [], pdfs: [] })
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/user/pdf/search?query=${encodeURIComponent(searchQuery)}`)
        console.log(response.data)
        if (!response.ok) throw new Error('Search failed')
        const data = await response.json()
        setSearchResults(data)
      } catch (error) {
        console.error('Search error:', error)
        // Optionally show error to user
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(fetchSearchResults, 300)
    return () => clearTimeout(timeoutId)
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
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            Loading...
          </div>
        ) : (
          <>
            {/* People Section */}
            {searchResults.users?.length > 0 && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">PEOPLE</h3>
                <div className="space-y-3">
                  {searchResults.users.map(user => (
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
                        {user.place && (
                          <div className="text-xs text-gray-400">{user.place}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PDFs Section */}
            {searchResults.pdfs?.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">PDFs</h3>
                <div className="space-y-3">
                  {searchResults.pdfs.map(pdf => (
                    <div 
                      key={pdf.id}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      <div className="font-medium">{pdf.title}</div>
                      <div className="text-sm text-gray-500">{pdf.caption}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-gray-400">
                          {new Date(pdf.created_at).toLocaleDateString()}
                        </div>
                        {pdf.is_public && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Public
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && !isLoading && 
             searchResults.users?.length === 0 && 
             searchResults.pdfs?.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No results found
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 