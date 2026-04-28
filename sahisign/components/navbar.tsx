"use client"

import Link from "next/link"
import { Logo } from "./logo"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <nav className="bg-[#0A0A0A] text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Logo variant="light" size="md" />

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-bold hover:text-[#FF5722] transition-colors">
                            Home
                        </Link>
                        <Link href="/upload" className="text-sm font-bold hover:text-[#FF5722] transition-colors">
                            Upload
                        </Link>
                        <Link href="/dashboard" className="text-sm font-bold hover:text-[#FF5722] transition-colors">
                            Dashboard
                        </Link>
                    </div>

                    <Link
                        href="/upload"
                        className="hidden md:inline-flex items-center bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2.5 rounded text-sm font-bold transition-colors"
                    >
                        Get Started
                    </Link>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {mobileOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <Link href="/" className="block py-2 text-sm font-bold hover:text-[#FF5722]">Home</Link>
                        <Link href="/upload" className="block py-2 text-sm font-bold hover:text-[#FF5722]">Upload</Link>
                        <Link href="/dashboard" className="block py-2 text-sm font-bold hover:text-[#FF5722]">Dashboard</Link>
                        <Link href="/upload" className="inline-block bg-[#FF5722] text-white px-5 py-2.5 rounded text-sm font-bold mt-2">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}