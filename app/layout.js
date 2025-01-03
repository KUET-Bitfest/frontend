import { Geist, Geist_Mono, Lato, Titillium_Web } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes' 
import { LanguageProvider } from '../components/context/LanguageContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const titilliumWeb = Titillium_Web({
  variable: "--font-titillium-web",
  subsets: ["latin"],
  weight: '400',
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: '400',
});


export const metadata = {
  title: "Bayanno.ai",
  description: "A platform to make your banglish life easier",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lato.variable} antialiased`}
      >
        <LanguageProvider>
          <ThemeProvider attribute="class">
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
