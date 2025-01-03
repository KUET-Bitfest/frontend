"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  MdTranslate, 
  MdHistory, 
  MdPictureAsPdf,
  MdChat,
  MdSettings,
  MdDashboard,
  MdVoiceChat,
  MdHelp,
  MdMenu,
  MdChevronLeft
} from 'react-icons/md'
import { BiBookContent } from 'react-icons/bi'
import { cn } from '@/components/utilities/cn'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    {
      title: "Overview",
      icon: <MdDashboard className="w-6 h-6" />,
      href: "/dashboard",
      description: "Translation stats and activity"
    },
    {
      title: "Quick Translate",
      icon: <MdTranslate className="w-6 h-6" />,
      href: "/dashboard/translate",
      description: "Banglish to Bangla conversion"
    },
    {
      title: "My Documents",
      icon: <BiBookContent className="w-6 h-6" />,
      href: "/dashboard/documents",
      description: "Manage saved translations"
    },
    {
      title: "Chat Assistant",
      icon: <MdChat className="w-6 h-6" />,
      href: "/dashboard/chat",
      description: "AI-powered chat help"
    },
    {
      title: "Voice Input",
      icon: <MdVoiceChat className="w-6 h-6" />,
      href: "/dashboard/voice",
      description: "Voice translation"
    },
    {
      title: "History",
      icon: <MdHistory className="w-6 h-6" />,
      href: "/dashboard/history",
      description: "Past translations"
    },
    {
      title: "PDF Export",
      icon: <MdPictureAsPdf className="w-6 h-6" />,
      href: "/dashboard/pdf",
      description: "Generate PDF documents"
    },
    {
      title: "Settings",
      icon: <MdSettings className="w-6 h-6" />,
      href: "/dashboard/settings",
      description: "Account preferences"
    },
    {
      title: "Help & Support",
      icon: <MdHelp className="w-6 h-6" />,
      href: "/dashboard/help",
      description: "Get assistance"
    }
  ]

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-white dark:bg-gray-800 h-screen transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {collapsed ? <MdMenu className="w-6 h-6" /> : <MdChevronLeft className="w-6 h-6" />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200",
                pathname === item.href 
                  ? "bg-primary text-white" 
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                collapsed && "justify-center"
              )}
            >
              {item.icon}
              {!collapsed && (
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
