import type { Metadata } from "next"
import { Inter, Noto_Sans_Devanagari } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
})

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-devanagari",
})

export const metadata: Metadata = {
  title: "SahiSign — Don't sign blind",
  description: "AI-powered risk analysis for Indian property documents.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoDevanagari.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  )
}