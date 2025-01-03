"use client"
import { Quicksand, Poppins, Lato } from 'next/font/google'
const poppins = Lato({ subsets: ['latin'], weight: '700' })
const playfair = Quicksand({ subsets: ['latin'], weight: '400' })
import Lottie from 'lottie-react'
import landing from '@/components/lottie/ai.json'
import Link from 'next/link'
import { Button } from '@/components/ui/components/button'
import { BsLightningFill } from 'react-icons/bs'
import { MdTranslate, MdChat, MdPictureAsPdf, MdVoiceChat } from 'react-icons/md'
import SupportChat from '@/components/utils/chat/SupportChat'
import { useEffect } from 'react'
import { emailSend } from '@/components/utilities/sms'

export default function Home() {
  const features = [
    {
      icon: <MdTranslate className="w-6 h-6 text-primary" />,
      title: "Smart Translation",
      description: "Instant Banglish to Bangla conversion with AI-powered accuracy"
    },
    {
      icon: <MdChat className="w-6 h-6 text-primary" />,
      title: "Intelligent Chatbot",
      description: "Interactive conversations in both Banglish and Bangla"
    },
    {
      icon: <MdPictureAsPdf className="w-6 h-6 text-primary" />,
      title: "PDF Export",
      description: "Export and share your translated content easily"
    },
    {
      icon: <MdVoiceChat className="w-6 h-6 text-primary" />,
      title: "Voice Features",
      description: "Voice input and output for seamless interaction"
    }
  ]

  return (
    <main className={`${playfair.className} w-full overflow-hidden h-screen bg-main-bg dark:bg-menu-secondary`}>
      <section className='h-[90%] flex flex-col mx-auto'>
        <div className='flex w-[90%] mx-auto h-screen justify-center items-center bg-light-blue dark:bg-slate-900 rounded-t-3xl'>
          <div className='w-[55%] flex flex-col justify-center items-center'>
            <Button variant="outline" center leftIcon={<BsLightningFill />}>Translate Instantly</Button>
            <h1 className={`${poppins.className} mt-4 mb-4 text-text-primary text-center tracking-wider font-bold text-3xl w-[46rem] bg-clip-text`}>"Express in Banglish, Share in Bangla: Bayanno Makes it Simple!"</h1>
            <p className='text-md text-center mx-auto w-[78%] bg-clip-text leading-[2rem] text-text-primary'>Transform your Banglish text into beautiful Bangla instantly. Whether you're writing stories, chatting, or creating content, Bayanno is your smart companion for seamless language conversion.</p>
            <div className='p-6 flex justify-center gap-4'>
              <Button size="sm" variant="primary" to="/signup">Try For Free</Button>
              <Button size="sm" variant="outline" to="/pricing">View Pricing</Button>
            </div>
          </div>
          <Lottie className='w-[45%]' animationData={landing} />
        </div>
        <section className='w-full my-4'>
          <div className='max-w-7xl mx-auto px-4'>
            <div className='grid grid-cols-4 gap-8'>
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className='flex flex-col items-center text-center p-6 rounded-lg hover:bg-light-blue dark:hover:bg-slate-900 transition-colors'
                >
                  <div className='mb-4'>
                    {feature.icon}
                  </div>
                  <h3 className='text-lg font-semibold text-text-primary mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
      <SupportChat />
    </main>
  )
}
