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
import useFetch from '@/ApiHandle/useFetch'

export default function AdminTrainPage() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {data: trainData, isLoading, isError, refetch} = useFetch(`/training-data/all`)

  const truncateText = (text, maxLength = 50) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'
    }
    return text
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return 'success'
      case -1:
        return 'warning'
      case 0:
        return 'danger'
      default:
        return ''
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Approved'
      case -1:
        return 'Pending'  
      case 0:
        return 'Rejected'
      default:
        return ''
    }
  }

  const filteredData = selectedStatus === 'all' 
    ? trainData 
    : trainData?.filter(item => item.is_approved === selectedStatus)

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"))
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/training-data/${itemId}/approve-switch?is_approved=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token.access_token,
          "ngrok-skip-browser-warning": "69420"
        }
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      refetch()
      setIsModalOpen(false)
      // Send notification to user
      const notifyUser = async (userId, status) => {
        const message = status === 1 
          ? "Your training data has been approved"
          : "Your training data has been rejected";
          
        try {
          await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/notification/user/${userId}?message=${encodeURIComponent(message)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token.access_token,
              "ngrok-skip-browser-warning": "69420"
            }
          });
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }

      // Send notification if status is approved or rejected
      if (newStatus === 1 || newStatus === 0) {
        console.log("Sending notification to user")
        const item = trainData.find(i => i.id === itemId);
        if (item?.user_id) {
          await notifyUser(item.user_id, newStatus);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
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
                checked={selectedStatus === 1}
                onChange={(e) => setSelectedStatus(1)}
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
                checked={selectedStatus === -1}
                onChange={(e) => setSelectedStatus(-1)}
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
                checked={selectedStatus === 0}
                onChange={(e) => setSelectedStatus(0)}
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
            {filteredData?.map((item) => (
              <TableRow 
                key={item.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => {
                  setSelectedItem(item)
                  setIsModalOpen(true)
                }}
              >
                <TableCell className="font-medium max-w-[400px] truncate">
                  {truncateText(item.banglish_text)}
                </TableCell>
                <TableCell className="max-w-[400px] truncate">
                  {truncateText(item.bangla_text)}
                </TableCell>
                <TableCell className="w-[200px]">{formatTimestamp(item.created_at)}</TableCell>
                <TableCell className="w-[150px]">
                  <span className="flex items-center space-x-2">
                    <Dot variant={getStatusColor(item.is_approved)} />
                    <Badge variant={getStatusColor(item.is_approved)}>{getStatusText(item.is_approved)}</Badge>
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
                {selectedItem?.banglish_text}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Bengali Answer
              </h3>
              <p className="text-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                {selectedItem?.bangla_text}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimestamp(selectedItem?.created_at)}
              </span>
              <div className="flex space-x-4">
                <Button
                  onClick={() => handleStatusChange(selectedItem?.id, 1)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={selectedItem?.is_approved === 1}
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusChange(selectedItem?.id, 0)}
                  variant="danger"
                  disabled={selectedItem?.is_approved === 0}
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