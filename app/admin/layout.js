"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  MdDashboard,
  MdMenu,
  MdChevronLeft,
  MdAnalytics 
} from 'react-icons/md'
import { BiBookContent } from 'react-icons/bi'
import { cn } from '@/components/utilities/cn'
import Hero from '@/components/utils/Hero'
import { VscOutput } from 'react-icons/vsc'
import { useLanguage } from '@/components/context/LanguageContext'
import { translations } from '@/components/constants/languages'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { currentLanguage } = useLanguage()

  const menuItems = [
    {
      title: translations.admin.menu.statistics.title[currentLanguage],
      icon: <MdAnalytics className="w-6 h-6" />,
      href: "/admin/statistics",
      description: translations.admin.menu.statistics.description[currentLanguage]
    },
    {
      title: translations.admin.menu.documents.title[currentLanguage],
      icon: <BiBookContent className="w-6 h-6" />,
      href: "/admin/documents",
      description: translations.admin.menu.documents.description[currentLanguage]
    },
    {
      title: translations.admin.menu.trainData.title[currentLanguage],
      icon: <MdDashboard className="w-6 h-6" />,
      href: "/admin/train",
      description: translations.admin.menu.trainData.description[currentLanguage]
    },
    {
      title: translations.admin.menu.logs.title[currentLanguage],
      icon: <VscOutput className="w-6 h-6" />,
      href: "/admin/logs",
      description: translations.admin.menu.logs.description[currentLanguage]
    },
    {
      title: translations.admin.menu.adminList.title[currentLanguage],
      icon: <MdDashboard className="w-6 h-6" />,
      href: "/admin/adminlist",
      description: translations.admin.menu.adminList.description[currentLanguage]
    }
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation */}
      <div className="w-full">
        <Hero landing={false} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div 
          className={cn(
            "bg-white dark:bg-gray-800 h-full transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700",
            collapsed ? "w-20" : "w-80"
          )}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {!collapsed && <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {translations.admin.title[currentLanguage]}
            </h2>}
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
                    ? "bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-600" 
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                  collapsed && "justify-center"
                )}
              >
                <div className={cn(
                  "transition-colors duration-200",
                  pathname === item.href 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-600 dark:text-gray-400"
                )}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <div>
                    <div className={cn(
                      "font-medium",
                      pathname === item.href 
                        ? "text-blue-600 dark:text-blue-400" 
                        : "text-gray-700 dark:text-gray-200"
                    )}>
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 