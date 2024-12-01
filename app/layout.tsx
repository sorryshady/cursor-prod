import { Inter } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AuthProvider } from '@/contexts/auth-context'
import './globals.css'
import { Toaster } from 'sonner'
import { CookieConsent } from "@/components/cookie-consent";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  )
}
