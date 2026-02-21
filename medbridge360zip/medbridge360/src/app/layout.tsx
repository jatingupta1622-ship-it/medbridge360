import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { ChatWidget } from '@/components/ui/ChatWidget'
import { AuthProvider } from '@/components/layout/AuthProvider'

export const metadata: Metadata = {
  title: 'MedBridge360 - Compare Medical Costs. Choose Smarter.',
  description: 'Find and compare hospitals, medical costs, and treatments worldwide. Make informed healthcare decisions with MedBridge360.',
  keywords: 'medical tourism, hospital comparison, medical costs, healthcare, treatment costs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  )
}
