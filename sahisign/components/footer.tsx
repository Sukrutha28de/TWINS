"use client"

import { Logo } from "./logo"

export function Footer() {
    return (
        <footer className="bg-[#0A0A0A] text-white">
            <div className="flex h-3">
                <div className="flex-1 bg-[#FF5722]" />
                <div className="flex-[2] bg-[#A78BFA]" />
                <div className="flex-1 bg-[#F5C842]" />
                <div className="flex-1 bg-[#22C55E]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <Logo variant="light" size="sm" />
                        <p className="text-sm text-gray-400 leading-relaxed mt-4">
                            <span style={{ fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif" }}>सही</span>{" "}
                            sign karne se pehle, <span style={{ fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif" }}>सही</span>{" "}
                            check karo.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-black text-sm uppercase tracking-wider mb-4 text-[#FF5722]">Pages</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:text-[#FF5722] transition-colors">Home</a></li>
                            <li><a href="/upload" className="hover:text-[#FF5722] transition-colors">Upload</a></li>
                            <li><a href="/dashboard" className="hover:text-[#FF5722] transition-colors">Dashboard</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-sm uppercase tracking-wider mb-4 text-[#FF5722]">We Check Against</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>RERA Act 2016</li>
                            <li>Karnataka Rent Control Act</li>
                            <li>RBI Guidelines</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
                    © 2026 SahiSign. Built for the hackathon.
                </div>
            </div>
        </footer>
    )
}