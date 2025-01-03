import { Inter } from 'next/font/google'
import './globals.css'
import Hero from '@/components/utils/Hero'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bayanno',
  description: 'Banglish to Bangla Conversion Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className='sticky bg-main-bg dark:bg-menu-secondary z-50 h-20'>
          <Hero />
        </nav>
        {children}
      </body>
    </html>
  )
}
