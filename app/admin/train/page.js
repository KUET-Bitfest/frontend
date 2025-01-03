"use client"

import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/components/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/components/dialog"
import { Button } from "@/components/ui/components/button"
import { formatTimestamp } from "@/components/utilities/time"
import { Dot } from '@/components/ui/components/status'
import { Badge } from '@/components/ui/components/badge'
import { Textarea } from "@/components/ui/components/textarea"

export default function AdminTrainPage() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [trainDataState, setTrainDataState] = useState([
    {
      id: 1,
      banglishPrompt: "Amar sonar bangla ami tomake valobashi. Chirodin tomar akash tomar batash amar prane bajay bashi. O ma, fagune tor amer bone ghrane pagol kore, mori hay hay re. O ma, oghrane tor bhora khete ami ki dekhechhi modhur hashi.",
      bengaliAnswer: "আমার সোনার বাংলা আমি তোমাকে ভালোবাসি। চিরদিন তোমার আকাশ তোমার বাতাস আমার প্রাণে বাজায় বাঁশি। ও মা, ফাগুনে তোর আমের বনে ঘ্রাণে পাগল করে, মরি হায় হায় রে। ও মা, অঘ্রাণে তোর ভরা ক্ষেতে আমি কি দেখেছি মধুর হাসি।",
      timestamp: "2024-01-20T14:30:00",
      status: "pending"
    },
    {
      id: 2,
      banglishPrompt: "Ami tomake valobashi",
      bengaliAnswer: "আমি তোমাকে ভালোবাসি",
      timestamp: "2024-01-20T15:45:00",
      status: "pending"
    },
    {
      id: 3,
      banglishPrompt: "Kemon acho",
      bengaliAnswer: "কেমন আছো",
      timestamp: "2024-01-20T16:20:00",
      status: "pending"
    },
  ])

  const truncateText = (text, maxLength = 50) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'
    }
    return text
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'danger'
      default:
        return ''
    }
  }

  const filteredData = selectedStatus === 'all' 
    ? trainDataState 
    : trainDataState.filter(item => item.status === selectedStatus)

  const handleStatusChange = (itemId, newStatus) => {
    // Update the status in the state
    setTrainDataState(prevData => 
      prevData.map(item => 
        item.id === itemId 
          ? { ...item, status: newStatus }
          : item
      )
    )

    // Update the selected item's status
    setSelectedItem(prev => prev ? { ...prev, status: newStatus } : null)

    // Here you would typically make an API call to update the status
    console.log(`Updating item ${itemId} to status: ${newStatus}`)
    
    // Close the modal after a short delay
    setTimeout(() => {
      setIsModalOpen(false)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold min-w-[120px]">Training Data Management</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="all"
                name="status"
                value="all"
                checked={selectedStatus === 'all'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="all" className="text-sm text-gray-700 dark:text-gray-200">All</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="approved"
                name="status"
                value="approved"
                checked={selectedStatus === 'approved'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-green-600 focus:ring-green-500"
              />
              <label htmlFor="approved" className="text-sm text-gray-700 dark:text-gray-200">Approved</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="pending"
                name="status"
                value="pending"
                checked={selectedStatus === 'pending'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="pending" className="text-sm text-gray-700 dark:text-gray-200">Pending</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="rejected"
                name="status"
                value="rejected"
                checked={selectedStatus === 'rejected'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-red-600 focus:ring-red-500"
              />
              <label htmlFor="rejected" className="text-sm text-gray-700 dark:text-gray-200">Rejected</label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Banglish Prompt</TableHead>
              <TableHead className="w-[400px]">Bengali Answer</TableHead>
              <TableHead className="w-[200px]">Timestamp</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow 
                key={item.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => {
                  setSelectedItem(item)
                  setIsModalOpen(true)
                }}
              >
                <TableCell className="font-medium max-w-[400px] truncate">
                  {truncateText(item.banglishPrompt)}
                </TableCell>
                <TableCell className="max-w-[400px] truncate">
                  {truncateText(item.bengaliAnswer)}
                </TableCell>
                <TableCell className="w-[200px]">{formatTimestamp(item.timestamp)}</TableCell>
                <TableCell className="w-[150px]">
                  <span className="flex items-center space-x-2">
                    <Dot variant={getStatusColor(item.status)} />
                    <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl bg-white dark:bg-[#000]">
          <DialogHeader>
            <DialogTitle>Translation Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Banglish Prompt
              </h3>
              <p className="text-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                {selectedItem?.banglishPrompt}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Bengali Answer
              </h3>
              <p className="text-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                {selectedItem?.bengaliAnswer}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimestamp(selectedItem?.timestamp)}
              </span>
              <div className="flex space-x-4">
                <Button
                  onClick={() => handleStatusChange(selectedItem?.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={selectedItem?.status === 'approved'}
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusChange(selectedItem?.id, 'rejected')}
                  variant="danger"
                  disabled={selectedItem?.status === 'rejected'}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 