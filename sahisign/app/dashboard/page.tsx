"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Download, FileText, AlertTriangle, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/api"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface Clause {
    clause_number: number
    clause_text: string
    risk_level: "HIGH" | "MEDIUM" | "LOW"
    plain_english: string
    law_violated: string
    negotiation_tip: string
}

interface AnalysisData {
    overall_score: number
    overall_risk: string
    total_clauses: number
    high_risk_count: number
    medium_risk_count: number
    low_risk_count: number
    clauses: Clause[]
}

const RISK_COLORS = {
    HIGH: { bg: "#EF4444", border: "#EF4444" },
    MEDIUM: { bg: "#F59E0B", border: "#F59E0B" },
    LOW: { bg: "#22C55E", border: "#22C55E" },
}

const SAMPLE_DATA: AnalysisData = {
    overall_score: 72,
    overall_risk: "HIGH",
    total_clauses: 6,
    high_risk_count: 2,
    medium_risk_count: 3,
    low_risk_count: 1,
    clauses: [
        {
            clause_number: 1,
            clause_text: "The Builder reserves the right to forfeit 30% of the total consideration amount in case of cancellation by the Buyer, irrespective of the reason for cancellation.",
            risk_level: "HIGH",
            plain_english: "If you cancel for any reason, the builder keeps 30% of your money — no questions asked.",
            law_violated: "RERA Act 2016, Section 18 — Forfeiture on cancellation is capped at a reasonable amount, typically not exceeding 10% of the apartment cost.",
            negotiation_tip: "Push back and demand the forfeiture clause be reduced to 10% as per RERA guidelines. Cite RERA Section 18 directly.",
        },
        {
            clause_number: 2,
            clause_text: "Possession shall be delivered within 60 months from the date of execution of this agreement, subject to force majeure.",
            risk_level: "HIGH",
            plain_english: "The builder has up to 5 years to give you possession, and can delay even more citing force majeure.",
            law_violated: "RERA Act 2016, Section 18 — Standard possession timelines are typically 36 months. Penalty for delay must be specified.",
            negotiation_tip: "Negotiate timeline down to 36 months. Insist on a penalty clause (e.g., monthly interest on amount paid) for any delay beyond the agreed date.",
        },
        {
            clause_number: 3,
            clause_text: "The carpet area of the flat shall be approximately 850 sq ft, with a loading factor of 45%, making the super built-up area approximately 1232 sq ft.",
            risk_level: "MEDIUM",
            plain_english: "You're paying for 1232 sq ft, but only 850 sq ft is actually usable space inside your flat. The 45% loading is on the higher side.",
            law_violated: "RERA Act 2016 — RERA mandates sale based on carpet area. Loading factors above 30-35% should be scrutinized.",
            negotiation_tip: "Ask for a clear breakdown of common areas included. If loading exceeds 35%, negotiate a price reduction or ask for pricing purely on carpet area.",
        },
        {
            clause_number: 4,
            clause_text: "Maintenance charges shall be decided solely by the builder for the first 3 years post-possession, after which a society shall be formed.",
            risk_level: "MEDIUM",
            plain_english: "The builder controls how much you pay for maintenance for the first 3 years with no say from you.",
            law_violated: "RERA Act 2016 — Society formation should happen within 3 months of majority occupation. Builder-decided maintenance can be inflated.",
            negotiation_tip: "Negotiate a cap on maintenance charges and push for earlier society formation (within 1 year or upon 50% occupation).",
        },
        {
            clause_number: 5,
            clause_text: "Any disputes arising shall be subject to arbitration as per the Arbitration and Conciliation Act, 1996, with the arbitrator appointed by the Builder.",
            risk_level: "MEDIUM",
            plain_english: "If there's a dispute, you can't go to court directly. The builder picks the arbitrator — which may not be neutral.",
            law_violated: "Consumer Protection Act, 2019 — Buyers have the right to approach consumer forums. One-sided arbitrator appointment is unfair.",
            negotiation_tip: "Insist on mutual appointment of the arbitrator or retain the right to approach RERA authority / consumer court.",
        },
        {
            clause_number: 6,
            clause_text: "The builder shall provide a 5-year structural warranty on the building from the date of possession.",
            risk_level: "LOW",
            plain_english: "The builder guarantees the building's structural integrity for 5 years after you move in. This is a standard and fair clause.",
            law_violated: "None — This clause complies with RERA Act 2016, Section 14(3) which mandates a minimum 5-year structural defect liability.",
            negotiation_tip: "This is a standard clause. You may still want to clarify what exactly is covered (e.g., plumbing, electrical, waterproofing).",
        },
    ],
}

export default function DashboardPage() {
    const router = useRouter()
    const [visibleCards, setVisibleCards] = useState<number[]>([])
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
    const [documentType, setDocumentType] = useState("")
    const [documentName, setDocumentName] = useState("")
    const [isDownloading, setIsDownloading] = useState(false)
    const [displayScore, setDisplayScore] = useState(0)
    const [isDemo, setIsDemo] = useState(false)

    useEffect(() => {
        const results = localStorage.getItem("sahisign_results")
        const docType = localStorage.getItem("sahisign_doc_type")
        const docName = localStorage.getItem("sahisign_doc_name")

        if (!results) {
            // No real data — load sample demo data instead of redirecting
            setAnalysisData(SAMPLE_DATA)
            setDocumentType("Builder Agreement")
            setDocumentName("sample_agreement.pdf")
            setIsDemo(true)
            return
        }

        setAnalysisData(JSON.parse(results))
        setDocumentType(docType || "")
        setDocumentName(docName || "")
    }, [router])

    useEffect(() => {
        if (!analysisData) return
        const target = analysisData.overall_score
        const duration = 1500
        const startTime = performance.now()
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayScore(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }, [analysisData])

    useEffect(() => {
        if (!analysisData) return
        analysisData.clauses.forEach((_, index) => {
            setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
            }, 80 * index + 400)
        })
    }, [analysisData])

    const handleDownload = async () => {
        if (!analysisData) return
        setIsDownloading(true)
        try {
            const response = await fetch(`${API_URL}/generate-redlined-pdf`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    document_type: documentType,
                    analysis_results: analysisData,
                }),
            })
            if (!response.ok) throw new Error("Download failed")
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "sahisign_report.pdf"
            a.click()
            URL.revokeObjectURL(url)
        } catch {
            alert("Could not download report. Please try again.")
        } finally {
            setIsDownloading(false)
        }
    }

    if (!analysisData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5]">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0A0A0A]" />
                    <p className="text-[#3D2817] text-lg font-bold">Loading analysis...</p>
                </div>
            </div>
        )
    }

    const showCriticalAlert = analysisData.high_risk_count >= 3
    const scoreColor =
        analysisData.overall_score >= 70 ? "#EF4444"
            : analysisData.overall_score >= 40 ? "#F59E0B"
                : "#22C55E"
    const riskLabel =
        analysisData.overall_score >= 70 ? "HIGH RISK"
            : analysisData.overall_score >= 40 ? "MEDIUM RISK"
                : "LOW RISK"

    const donutData = [
        { name: "High", value: analysisData.high_risk_count, color: "#EF4444" },
        { name: "Medium", value: analysisData.medium_risk_count, color: "#F59E0B" },
        { name: "Low", value: analysisData.low_risk_count, color: "#22C55E" },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-[#FFFDF5]">
            <Navbar />

            <main className="flex-1 py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isDemo && (
                        <div className="mb-8 bg-[#A78BFA] text-white rounded-xl p-4 flex items-center gap-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0_0_#0A0A0A]">
                            <FileText className="h-6 w-6 shrink-0" />
                            <p className="font-bold">
                                Demo Mode — Showing sample analysis. <a href="/upload" className="underline hover:text-[#FFF8E7]">Upload a real document</a> to see your results.
                            </p>
                        </div>
                    )}
                    {showCriticalAlert && (
                        <div className="mb-8 bg-[#EF4444] text-white rounded-xl p-4 flex items-center gap-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0_0_#0A0A0A] animate-pulse">
                            <AlertTriangle className="h-6 w-6 shrink-0" />
                            <p className="font-bold">
                                Critical Alert: This document contains serious risks. Do not sign without legal consultation.
                            </p>
                        </div>
                    )}

                    <div className="mb-12">
                        <div className="inline-block bg-[#FF5722] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4">
                            Step 2 — Analysis Complete
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-[#0A0A0A] tracking-tight leading-[0.95] mb-4">
                            Risk{" "}
                            <span className="relative inline-block">
                                Report
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none">
                                    <path d="M 0 8 Q 50 2, 100 6 T 200 6" stroke="#FF5722" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                            .
                        </h1>
                        <p className="text-[#3D2817]">
                            {documentType} <span className="text-[#FF5722]">·</span> {documentName}{" "}
                            <span className="text-[#FF5722]">·</span>{" "}
                            {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-2xl p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0_0_#0A0A0A]">
                            <h2 className="text-xs font-black uppercase tracking-wider text-[#0A0A0A] mb-4 text-center">
                                Overall Risk Score
                            </h2>
                            <div className="relative h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={95}
                                            paddingAngle={3}
                                            dataKey="value"
                                            strokeWidth={2}
                                            stroke="#0A0A0A"
                                        >
                                            {donutData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black" style={{ color: scoreColor }}>
                                        {displayScore}
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: scoreColor }}>
                                        {riskLabel}
                                    </span>
                                    <span className="text-[10px] text-[#3D2817] mt-1 italic">
                                        Based on clause severity
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 mt-2">
                                <Legend color="#EF4444" label="High" />
                                <Legend color="#F59E0B" label="Medium" />
                                <Legend color="#22C55E" label="Low" />
                            </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Total Clauses" value={analysisData.total_clauses} bgColor="#FFF8E7" textColor="#0A0A0A" icon={<FileText className="h-5 w-5" />} />
                            <StatCard label="High Risk" value={analysisData.high_risk_count} bgColor="#EF4444" textColor="#FFFFFF" icon={<AlertTriangle className="h-5 w-5" />} />
                            <StatCard label="Medium Risk" value={analysisData.medium_risk_count} bgColor="#F59E0B" textColor="#FFFFFF" icon={<AlertCircle className="h-5 w-5" />} />
                            <StatCard label="Low Risk" value={analysisData.low_risk_count} bgColor="#22C55E" textColor="#FFFFFF" icon={<CheckCircle className="h-5 w-5" />} />
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-[#0A0A0A] mb-2">Detailed Clause Analysis</h2>
                        <p className="text-[#3D2817] mb-8">Every clause, broken down. Color-coded by risk.</p>

                        <div className="space-y-4">
                            {analysisData.clauses.map((clause, index) => {
                                const colors = RISK_COLORS[clause.risk_level]
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            opacity: visibleCards.includes(index) ? 1 : 0,
                                            transform: visibleCards.includes(index) ? "translateY(0)" : "translateY(20px)",
                                            transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                                            borderLeftColor: colors.border,
                                        }}
                                        className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#0A0A0A] border-l-[10px] shadow-[6px_6px_0_0_#0A0A0A]"
                                    >
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className="text-sm font-black uppercase tracking-wider text-[#0A0A0A]">
                                                Clause {clause.clause_number}
                                            </span>
                                            <span
                                                className="inline-block px-3 py-1 rounded text-xs font-black uppercase tracking-wider text-white"
                                                style={{ backgroundColor: colors.bg }}
                                            >
                                                {clause.risk_level} RISK
                                            </span>
                                        </div>

                                        <p className="italic text-[#3D2817] mb-5 pl-4 border-l-4 border-[#FFF8E7]">
                                            &ldquo;{clause.clause_text}&rdquo;
                                        </p>

                                        <div className="space-y-4">
                                            <ClauseSection label="Plain English" content={clause.plain_english} color="#0A0A0A" />
                                            <ClauseSection label="Law Violated" content={clause.law_violated} color="#FF5722" />
                                            <ClauseSection label="Negotiation Tip" content={clause.negotiation_tip} color="#22C55E" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-[#0A0A0A] text-white rounded-2xl p-8 md:p-12 border-2 border-[#0A0A0A] shadow-[6px_6px_0_0_#FF5722] text-center">
                        <h3 className="text-2xl md:text-4xl font-black mb-3">Take this report with you.</h3>
                        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                            Download your full risk report as a PDF. Share it with your lawyer or use it during negotiation.
                        </p>
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="inline-flex items-center gap-2 bg-[#FF5722] hover:bg-white hover:text-[#0A0A0A] text-white px-10 py-5 rounded font-bold text-lg transition-colors disabled:opacity-50"
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <Download className="h-5 w-5" />
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

function StatCard({ label, value, bgColor, textColor, icon }: { label: string; value: number; bgColor: string; textColor: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-2xl p-5 border-2 border-[#0A0A0A] shadow-[6px_6px_0_0_#0A0A0A] flex flex-col" style={{ backgroundColor: bgColor }}>
            <div className="flex items-center justify-between mb-3" style={{ color: textColor }}>{icon}</div>
            <span className="text-4xl md:text-5xl font-black" style={{ color: textColor }}>{value}</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: textColor }}>{label}</span>
        </div>
    )
}

function ClauseSection({ label, content, color }: { label: string; content: string; color: string }) {
    return (
        <div>
            <div className="text-xs font-black uppercase tracking-wider mb-1" style={{ color }}>{label}</div>
            <p className="text-sm text-[#3D2817] leading-relaxed">{content}</p>
        </div>
    )
}

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-[#0A0A0A]" style={{ backgroundColor: color }} />
            <span className="text-xs font-bold text-[#3D2817]">{label}</span>
        </div>
    )
}