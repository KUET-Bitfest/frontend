"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useParams } from 'next/navigation'
import { LuLayoutDashboard } from "react-icons/lu";
import { CiTimer } from "react-icons/ci";
import { TbChartHistogram } from "react-icons/tb";
import { CgCompressLeft } from "react-icons/cg";
import { Button } from '@/components/ui/components/button'
import LinkItem from '@/components/ui/components/LinkItem'
import Hero from '@/components/utils/Hero';
import Image from 'next/image';
import { Toaster } from "@/components/ui/components/toaster"

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()

  const navItems = [
    {
      title: "Dashboard",
      to: `/dashboard/${params.id}`,
      icon: <LuLayoutDashboard />,
    },
    {
      title: "Thor Stake",
      to: `/dashboard/${params.id}/thor-stake`,
      icon: <CiTimer />,
    },
    {
      title: "Pending Liquidity",
      to: `/dashboard/${params.id}/pending-liquidity`,
      icon: <CiTimer />,
    },
    {
      title: "Stats",
      to: `/dashboard/${params.id}/stats`,
      icon: <TbChartHistogram />,
    },
    {
      title: "Collapse Sidebar",
      to: `/dashboard/${params.id}/collapse`,
      icon: <CgCompressLeft />,
    },
  ]

  const handleSignOut = () => {
    localStorage.removeItem('token')
    router.push('/')
  }
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    async function getProfile() {
      let token = localStorage.getItem("token")
      if (!token) {
        return
      }

      token = JSON.parse(token)
      const endpoint = process.env.NEXT_PUBLIC_ENDPOINT
      const response = await fetch(`${endpoint}/profile`, {
        method: 'GET',
        headers : {'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.accessToken,
        "ngrok-skip-browser-warning": "69420"
      }
    })
      const ans = await response.json()        
      setProfile(ans)   
    }
    getProfile()
  }, [])

  return (
    <div className="flex flex-col">
      <nav className='sticky top-0 z-50 bg-main-bg dark:bg-menu-secondary'>
        <Hero landing={false} />
      </nav>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-50 dark:bg-[#1A1B1E] text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-800 flex flex-col h-[calc(100vh-84px)]">
          <div className="p-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/profile.png" alt="Thor" width={100} height={100} className="rounded-full" />
              <span className="text-xl font-bold">Thor</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => (
              <LinkItem 
                key={item.to}
                to={item.to} 
                title={item.title} 
                leftIcon={item.icon}
                variant={
                  item.alwaysGreen 
                    ? "primary" 
                    : item.alwaysBlue 
                      ? "secondary"
                      : pathname === item.to 
                        ? "primary" 
                        : "default"
                }
              />
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Button 
              onClick={handleSignOut}
              variant="dark"
              size="lg"
              center
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-main-bg dark:bg-menu-secondary overflow-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}
