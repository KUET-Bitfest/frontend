"use client"
import { Quicksand, Poppins, Lato } from 'next/font/google'
import Lottie from 'lottie-react'
import landing from '@/components/lottie/ai.json'
import Link from 'next/link'
import { Button } from '@/components/ui/components/button'
import { BsLightningFill } from 'react-icons/bs'
import { MdTranslate, MdChat, MdPictureAsPdf, MdVoiceChat } from 'react-icons/md'
import SupportChat from '@/components/utils/chat/SupportChat'
import { useLanguage } from '@/components/context/LanguageContext'
import { translations } from '@/components/constants/languages'
import Hero from '@/components/utils/Hero'

const poppins = Lato({ subsets: ['latin'], weight: '700' })
const playfair = Quicksand({ subsets: ['latin'], weight: '400' })

export default function Home() {
  const { currentLanguage } = useLanguage();

  const features = [
    {
      icon: <MdTranslate className="w-6 h-6 text-primary" />,
      title: translations.landing.features.smartTranslation.title[currentLanguage],
      description: translations.landing.features.smartTranslation.description[currentLanguage]
    },
    {
      icon: <MdChat className="w-6 h-6 text-primary" />,
      title: translations.landing.features.intelligentChatbot.title[currentLanguage],
      description: translations.landing.features.intelligentChatbot.description[currentLanguage]
    },
    {
      icon: <MdPictureAsPdf className="w-6 h-6 text-primary" />,
      title: translations.landing.features.pdfExport.title[currentLanguage],
      description: translations.landing.features.pdfExport.description[currentLanguage]
    },
    {
      icon: <MdVoiceChat className="w-6 h-6 text-primary" />,
      title: translations.landing.features.voiceFeatures.title[currentLanguage],
      description: translations.landing.features.voiceFeatures.description[currentLanguage]
    }
  ]

  return (
    <main className={`${playfair.className} w-full overflow-hidden h-screen bg-main-bg dark:bg-menu-secondary`}>
      <nav className='sticky bg-main-bg dark:bg-menu-secondary z-50 h-20'>
        <Hero landing={true} />
      </nav>
      <section className='h-[90%] flex flex-col mx-auto'>
        <div className='flex w-[90%] mx-auto h-screen justify-center items-center bg-light-blue dark:bg-slate-900 rounded-t-3xl'>
          <div className='w-[55%] flex flex-col justify-center items-center'>
            <Button 
              variant="outline" 
              center 
              leftIcon={<BsLightningFill />}
            >
              {translations.landing.hero.translateInstantly[currentLanguage]}
            </Button>
            <h1 className={`${poppins.className} mt-4 mb-4 text-text-primary text-center tracking-wider font-bold text-3xl w-[46rem] bg-clip-text`}>
              {translations.landing.hero.title[currentLanguage]}
            </h1>
            <p className='text-md text-center mx-auto w-[78%] bg-clip-text leading-[2rem] text-text-primary'>
              {translations.landing.hero.subtitle[currentLanguage]}
            </p>
            <div className='p-6 flex justify-center gap-4'>
              <Button size="sm" variant="primary" to="/signup">
                {translations.landing.hero.tryForFree[currentLanguage]}
              </Button>
              <Button size="sm" variant="outline" to="/pricing">
                {translations.landing.hero.viewPricing[currentLanguage]}
              </Button>
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
