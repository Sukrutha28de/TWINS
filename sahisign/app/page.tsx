"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BuildingIllustration } from "@/components/illustrations/building-illustration"
import { LandIllustration } from "@/components/illustrations/land-illustration"
import { HouseIllustration } from "@/components/illustrations/house-illustration"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF5]">
      <Navbar />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <div className="inline-block bg-[#0A0A0A] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-6">
                  AI-Powered Risk Analysis
                </div>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#0A0A0A] tracking-tight leading-[0.95] mb-6">
                  Don&apos;t sign{" "}
                  <span className="relative inline-block">
                    blind
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none">
                      <path d="M 0 8 Q 50 2, 100 6 T 200 6" stroke="#FF5722" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                  .
                </h1>
                <p className="text-lg md:text-xl text-[#3D2817] max-w-2xl leading-relaxed mb-10">
                  AI-powered risk analysis for Indian property documents. We catch what your lawyer won&apos;t.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/upload"
                    className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white px-8 py-4 rounded font-bold hover:bg-[#FF5722] transition-colors"
                  >
                    Upload Document
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  
                    href="#services"
                    className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] text-[#0A0A0A] px-8 py-4 rounded font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors"
                  >
                    How it works
                  </a>
                </div>
              </div>

              <div className="lg:col-span-2 hidden lg:block">
                <BuildingIllustration className="w-full h-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* COLOR STRIPE */}
        <div className="flex h-12">
          <div className="flex-1 bg-[#FF5722]" />
          <div className="flex-[2] bg-[#A78BFA]" />
          <div className="flex-1 bg-[#F5C842]" />
          <div className="flex-1 bg-[#22C55E]" />
        </div>

        {/* DOCUMENT CARDS */}
        <section className="bg-[#FFFDF5] py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 max-w-3xl">
              <div className="inline-block bg-[#FF5722] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4">
                Choose your document
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] tracking-tight leading-tight">
                What are you signing?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/upload?type=Builder+Agreement"
                className="group relative bg-[#F5C842] rounded-2xl p-6 overflow-hidden border-2 border-[#0A0A0A] hover:-translate-y-2 transition-transform duration-300 shadow-[6px_6px_0_0_#0A0A0A] hover:shadow-[10px_10px_0_0_#0A0A0A]"
              >
                <div className="aspect-square mb-4">
                  <BuildingIllustration className="w-full h-full" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#3D2817] mb-1">01</div>
                    <h3 className="text-2xl font-black text-[#0A0A0A] leading-tight">Builder Agreement</h3>
                  </div>
                  <div className="bg-[#0A0A0A] text-white p-2 rounded group-hover:bg-[#FF5722] transition-colors">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>

              <Link
                href="/upload?type=Sale+Deed"
                className="group relative bg-[#A78BFA] rounded-2xl p-6 overflow-hidden border-2 border-[#0A0A0A] hover:-translate-y-2 transition-transform duration-300 shadow-[6px_6px_0_0_#0A0A0A] hover:shadow-[10px_10px_0_0_#0A0A0A]"
              >
                <div className="aspect-square mb-4">
                  <LandIllustration className="w-full h-full" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">02</div>
                    <h3 className="text-2xl font-black text-white leading-tight">Sale Deed</h3>
                  </div>
                  <div className="bg-white text-[#0A0A0A] p-2 rounded group-hover:bg-[#FF5722] group-hover:text-white transition-colors">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>

              <Link
                href="/upload?type=Home+Loan+Sanction+Letter"
                className="group relative bg-[#22C55E] rounded-2xl p-6 overflow-hidden border-2 border-[#0A0A0A] hover:-translate-y-2 transition-transform duration-300 shadow-[6px_6px_0_0_#0A0A0A] hover:shadow-[10px_10px_0_0_#0A0A0A]"
              >
                <div className="aspect-square mb-4">
                  <HouseIllustration className="w-full h-full" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">03</div>
                    <h3 className="text-2xl font-black text-white leading-tight">Home Loan Letter</h3>
                  </div>
                  <div className="bg-white text-[#0A0A0A] p-2 rounded group-hover:bg-[#FF5722] group-hover:text-white transition-colors">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="bg-[#0A0A0A] text-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 max-w-3xl">
              <div className="inline-block bg-[#FF5722] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4">
                Services
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                What we do.
              </h2>
            </div>

            <div className="space-y-px">
              <div className="border-t border-gray-800 py-8 grid grid-cols-12 gap-4 items-start">
                <div className="col-span-12 md:col-span-2 text-sm font-bold text-[#FF5722]">( 01 )</div>
                <div className="col-span-12 md:col-span-7">
                  <h3 className="text-2xl md:text-4xl font-black mb-2">Document Analysis</h3>
                </div>
                <div className="col-span-12 md:col-span-3 text-sm text-gray-400 leading-relaxed">
                  We scan every clause in your document against current Indian property law. No clause goes unchecked.
                </div>
              </div>

              <div className="border-t border-gray-800 py-8 grid grid-cols-12 gap-4 items-start">
                <div className="col-span-12 md:col-span-2 text-sm font-bold text-[#FF5722]">( 02 )</div>
                <div className="col-span-12 md:col-span-7">
                  <h3 className="text-2xl md:text-4xl font-black mb-2">Risk Detection</h3>
                </div>
                <div className="col-span-12 md:col-span-3 text-sm text-gray-400 leading-relaxed">
                  We flag clauses by severity — high, medium, low. You see exactly which traps the document is hiding.
                </div>
              </div>

              <div className="border-t border-b border-gray-800 py-8 grid grid-cols-12 gap-4 items-start">
                <div className="col-span-12 md:col-span-2 text-sm font-bold text-[#FF5722]">( 03 )</div>
                <div className="col-span-12 md:col-span-7">
                  <h3 className="text-2xl md:text-4xl font-black mb-2">Negotiation Tips</h3>
                </div>
                <div className="col-span-12 md:col-span-3 text-sm text-gray-400 leading-relaxed">
                  We tell you exactly what to push back on, citing the law. Walk into the meeting prepared.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPLIANCE */}
        <section className="bg-[#FFFDF5] py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 max-w-3xl">
              <div className="inline-block bg-[#0A0A0A] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4">
                About / Compliance
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] tracking-tight leading-tight">
                What we check against.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#FFF8E7] rounded-2xl p-8 border-2 border-[#0A0A0A] shadow-[6px_6px_0_0_#0A0A0A]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FF5722] mb-3">Law 01</div>
                <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">RERA Act 2016</h3>
                <p className="text-sm text-[#3D2817] leading-relaxed mb-4">
                  Real Estate Regulation and Development Act. We verify:
                </p>
                <ul className="text-sm text-[#3D2817] space-y-2">
                  <li className="flex gap-2"><span className="text-[#FF5722] font-bold">→</span> Forfeiture limits on cancellation</li>
                  <li className="flex gap-2"><span className="text-[#FF5722] font-bold">→</span> Possession timelines and delay penalties</li>
                  <li className="flex gap-2"><span className="text-[#FF5722] font-bold">→</span> Super built-up area & loading caps</li>
                  <li className="flex gap-2"><span className="text-[#FF5722] font-bold">→</span> Society formation timelines</li>
                </ul>
              </div>

              <div className="bg-[#A78BFA] rounded-2xl p-8 border-2 border-[#0A0A0A] shadow-[6px_6px_0_0_#0A0A0A]">
                <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">Law 02</div>
                <h3 className="text-2xl font-black text-white mb-4">Karnataka Rent Act</h3>
                <p className="text-sm text-white/90 leading-relaxed mb-4">
                  State rental regulations. We verify:
                </p>
                <ul className="text-sm text-white space-y-2">
                  <li className="flex gap-2"><span className="text-[#FFFDF5] font-bold">→</span> Security deposit limits</li>
                  <li className="flex gap-2"><span className="text-[#FFFDF5] font-bold">→</span> Annual rent escalation rules</li>
                  <li className="flex gap-2"><span className="text-[#FFFDF5] font-bold">→</span> Eviction notice periods</li>
                  <li className="flex gap-2"><span className="text-[#FFFDF5] font-bold">→</span> Tenant rights and protections</li>
                </ul>
              </div>

              <div className="bg-[#22C55E] rounded-2xl p-8 border-2 border-[#0A0A0A] shadow-[6px_6px_0_0_#0A0A0A]">
                <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">Law 03</div>
                <h3 className="text-2xl font-black text-white mb-4">RBI Guidelines</h3>
                <p className="text-sm text-white/90 leading-relaxed mb-4">
                  Reserve Bank of India norms. We verify:
                </p>
                <ul className="text-sm text-white space-y-2">
                  <li className="flex gap-2"><span className="text-[#FFFDF5] font-bold">→</span> Home loan interest rate caps</li>
                  <li className="flex gap-2"><span className="text-[#FFFDF5] font-bold">→</span> Prepayment penalty rules</li>
                  <li className="flex gap-2"><span className="text-[#FFFDF5] font-bold">→</span> Foreclosure conditions</li>
                  <li className="flex gap-2"><span className="text-[#FFFDF5] font-bold">→</span> Hidden fees and charges</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[#FF5722] text-white py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.95] mb-8">
              <span style={{ fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif" }}>सही</span> sign karne se pehle,<br />
              <span style={{ fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif" }}>सही</span> check karo.
            </h2>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white px-10 py-5 rounded font-bold text-lg hover:bg-white hover:text-[#0A0A0A] transition-colors"
            >
              Upload Your Document
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div >
  )
}