"use client"

import { useState } from 'react'
import Hero from '@/components/utils/Hero'
import useFetch from '@/ApiHandle/useFetch'

export default function AdminLogsPage() {
  const [selectedMethod, setSelectedMethod] = useState('all')
  const { data: logs } = useFetch('/logs/all')

  const filteredLogs = selectedMethod === 'all'
    ? logs
    : logs?.filter(log => log.method.toLowerCase() === selectedMethod)

  return (
    
      <div className="container mx-auto px-6 pb-8">
        <div className="h-[calc(100vh-140px)] rounded-lg overflow-hidden">
          <div className="space-y-6 p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">System Logs</h1>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="all"
                    name="filter"
                    value="all"
                    checked={selectedMethod === 'all'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="all" className="text-sm text-gray-700 dark:text-gray-200">All</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="get"
                    name="filter"
                    value="get"
                    checked={selectedMethod === 'get'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="get" className="text-sm text-gray-700 dark:text-gray-200">GET</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="post"
                    name="filter"
                    value="post"
                    checked={selectedMethod === 'post'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="text-yellow-600 focus:ring-yellow-500"
                  />
                  <label htmlFor="post" className="text-sm text-gray-700 dark:text-gray-200">POST</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="put"
                    name="filter"
                    value="put"
                    checked={selectedMethod === 'put'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="put" className="text-sm text-gray-700 dark:text-gray-200">PUT</label>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLogs?.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{log.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{log.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${log.method === 'get' ? 'bg-green-100 text-green-800' : 
                          log.method === 'post' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                          {log.method.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  )
}
