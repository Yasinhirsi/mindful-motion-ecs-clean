import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import LayoutWithBackButton from "@/components/LayoutWithBackButton";

import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// Update the metadata
export const metadata = {
  title: "Mindful Motion",
  description: "A comprehensive platform for physical and mental wellbeing"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LayoutWithBackButton>
            {children}
          </LayoutWithBackButton>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

