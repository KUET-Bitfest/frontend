'use client'

import { useState, useEffect, useRef } from 'react'
import useFetch from '@/ApiHandle/useFetch'
import { emailSend } from '@/components/utilities/sms'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/components/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/components/dialog'
import Loading from '@/components/ui/components/loading'

export default function AdminList() {
  const closeRef = useRef(null)
  const { data: admins, loading, error, setData: setAdmins, refetch } = useFetch('/admin/all')
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    name: '',
    phone: '',
    place: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewAdmin(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = JSON.parse(localStorage.getItem("token"))
    const base_url = process.env.NEXT_PUBLIC_ENDPOINT
    const password = Math.random().toString(36).slice(-8)
    
    try {
      const response = await fetch(`${base_url}/auth/admin/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token.access_token,
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({...newAdmin, password})
      })
      
      if (!response.ok) {
        throw new Error('Failed to create admin')
      }
      
      const data = await response.json()
      setAdmins(prev => [...prev, data])
      setNewAdmin({ email: '', name: '', phone: '', place: '' })
      
      await emailSend(
        newAdmin.email,
        newAdmin.name,
        newAdmin.email,
        password,
        process.env.NEXT_PUBLIC_TEMPLATE_ID
      )
      
      // Close the modal
      closeRef.current?.click()
      
    } catch (error) {
      console.error('Error creating admin:', error)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div className="p-6">Error: {error}</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin List</h1>
        <Dialog>
          <DialogTrigger className="px-4 py-2 bg-primary text-white rounded-md">
            Add Admin
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newAdmin.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newAdmin.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={newAdmin.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Place</label>
                <input
                  type="text"
                  name="place"
                  value={newAdmin.place}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-white rounded-md"
              >
                Create Admin
              </button>
            </form>
            <DialogClose ref={closeRef} className="hidden" />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Place</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins?.map((admin, index) => (
            <TableRow key={index}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.phone}</TableCell>
              <TableCell>{admin.place}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
