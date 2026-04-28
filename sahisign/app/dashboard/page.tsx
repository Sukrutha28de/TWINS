"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
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
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
    const [documentType, setDocumentType] = useState("")
    const [documentName, setDocumentName] = useState("")
    const [isDownloading, setIsDownloading] = useState(false)
    const [displayScore, setDisplayScore] = useState(0)
    const [openClauses, setOpenClauses] = useState<Set<number>>(new Set())
    const [visibleCards, setVisibleCards] = useState<number[]>([])
    const [isDemo, setIsDemo] = useState(false)

    useEffect(() => {
        const results = localStorage.getItem("sahisign_results")
        const docType = localStorage.getItem("sahisign_doc_type")
        const docName = localStorage.getItem("sahisign_doc_name")
        if (!results) {
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
        const animate = (now: number) => {
            const elapsed = now - startTime
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
            }, 80 * index + 300)
        })
    }, [analysisData])

    const toggleClause = (index: number) => {
        setOpenClauses((prev) => {
            const next = new Set(prev)
            if (next.has(index)) next.delete(index)
            else next.add(index)
            return next
        })
    }

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
            a.download = "SahiSign_Risk_Report.pdf"
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
                <p className="text-[#3D2817] text-lg font-bold">Loading analysis...</p>
            </div>
        )
    }

    const showCriticalAlert = analysisData.high_risk_count >= 3
    const scoreColor =
        analysisData.overall_score >= 70 ? "#22C55E"
            : analysisData.overall_score >= 40 ? "#F59E0B"
                : "#EF4444"
    const riskLabel =
        analysisData.overall_score >= 70 ? "Low Risk"
            : analysisData.overall_score >= 40 ? "Medium Risk"
                : "High Risk"

    const donutData = [
        { name: "High", value: analysisData.high_risk_count, color: "#EF4444" },
        { name: "Medium", value: analysisData.medium_risk_count, color: "#F59E0B" },
        { name: "Low", value: analysisData.low_risk_count, color: "#22C55E" },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-[#FFFDF5]">
            <Navbar />

            <main className="flex-1 px-6 md:px-12 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Demo Banner */}
                    {isDemo && (
                        <div className="mb-8 bg-[#A78BFA] text-white rounded-xl px-6 py-4 flex items-center gap-3 font-semibold">
                            <span>📋</span>
                            Demo Mode — Showing sample analysis.{" "}
                            <a href="/upload" className="underline hover:text-[#FFF8E7]">Upload a real document</a>{" "}
                            to see your results.
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex justify-between items-start flex-wrap gap-4 mb-10">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-[#0A0A0A] tracking-tight leading-none">
                                Risk Report
                            </h1>
                            <p className="text-[#888] text-sm mt-2">
                                {documentType} · {documentName} · Analyzed just now
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/upload")}
                            className="border-2 border-[#0A0A0A] text-[#0A0A0A] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#0A0A0A] hover:text-[#FFFDF5] transition-colors"
                        >
                            + New Analysis
                        </button>
                    </div>

                    {/* Critical Alert */}
                    {showCriticalAlert && (
                        <div className="bg-[#EF4444] text-white rounded-xl px-6 py-4 flex items-center gap-3 font-semibold mb-8 animate-pulse">
                            <span>⚠️</span>
                            Critical Alert: This document contains serious risks. Do not sign without legal consultation.
                        </div>
                    )}

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatCard label="Total Clauses" value={analysisData.total_clauses} type="total" />
                        <StatCard label="High Risk" value={analysisData.high_risk_count} type="high" />
                        <StatCard label="Medium Risk" value={analysisData.medium_risk_count} type="medium" />
                        <StatCard label="Low Risk" value={analysisData.low_risk_count} type="low" />
                    </div>

                    {/* Main Grid: Score Card + Clauses */}
                    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
                        {/* Score Card */}
                        <div className="bg-[#0A0A0A] text-[#FFFDF5] rounded-2xl p-8 text-center lg:sticky lg:top-24 self-start">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#666] mb-6">
                                Overall Risk Score
                            </p>
                            <div className="relative w-44 h-44 mx-auto mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={62}
                                            outerRadius={85}
                                            paddingAngle={2}
                                            dataKey="value"
                                            strokeWidth={0}
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
                                    <span className="text-xs text-[#666] mt-1">{riskLabel}</span>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6 text-left px-2">
                                <LegendItem color="#EF4444" label={`High Risk (${analysisData.high_risk_count} clauses)`} />
                                <LegendItem color="#F59E0B" label={`Medium Risk (${analysisData.medium_risk_count} clauses)`} />
                                <LegendItem color="#22C55E" label={`Low Risk (${analysisData.low_risk_count} clauses)`} />
                            </div>

                            <div className="h-px bg-[#1a1a1a] mb-6" />

                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="w-full bg-[#FF5722] hover:opacity-85 text-white py-3 rounded-lg font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
                            >
                                {isDownloading ? "Generating..." : "⬇ Download Risk Report PDF"}
                            </button>
                        </div>

                        {/* Clauses */}
                        <div>
                            <h2 className="text-2xl font-black text-[#0A0A0A] mb-6 tracking-tight">
                                Detailed Clause Analysis
                            </h2>

                            <div className="space-y-3">
                                {analysisData.clauses.map((clause, index) => {
                                    const isOpen = openClauses.has(index)
                                    const visible = visibleCards.includes(index)
                                    const borderColor =
                                        clause.risk_level === "HIGH" ? "#EF4444"
                                            : clause.risk_level === "MEDIUM" ? "#F59E0B"
                                                : "#22C55E"

                                    return (
                                        <div
                                            key={index}
                                            className="bg-white border border-[#eee] rounded-xl overflow-hidden"
                                            style={{
                                                borderLeftWidth: "5px",
                                                borderLeftColor: borderColor,
                                                opacity: visible ? 1 : 0,
                                                transform: visible ? "translateY(0)" : "translateY(16px)",
                                                transition: "opacity 0.4s, transform 0.4s",
                                            }}
                                        >
                                            <div
                                                className="px-6 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#fafaf7]"
                                                onClick={() => toggleClause(index)}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <span className="text-xs font-bold text-[#bbb] whitespace-nowrap">
                                                        CLAUSE {clause.clause_number}
                                                    </span>
                                                    <RiskBadge level={clause.risk_level} />
                                                    <span className="text-sm text-[#666] italic truncate">
                                                        &ldquo;{clause.clause_text.substring(0, 90)}...&rdquo;
                                                    </span>
                                                </div>
                                                <span
                                                    className="text-xs text-[#bbb] transition-transform"
                                                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                                                >
                                                    ▼
                                                </span>
                                            </div>

                                            {isOpen && (
                                                <div className="px-6 pb-6">
                                                    <div className="bg-[#f9f9f7] border-l-4 border-[#e5e5e0] rounded-lg p-4 italic text-sm text-[#333] leading-relaxed mb-4">
                                                        &ldquo;{clause.clause_text}&rdquo;
                                                    </div>

                                                    <InfoBlock
                                                        label="Plain English Explanation"
                                                        content={clause.plain_english}
                                                        bgColor="#f5f5f0"
                                                        labelColor="#888"
                                                        textColor="#333"
                                                    />

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                                        <InfoBlock
                                                            label="Indian Law Violated"
                                                            content={clause.law_violated}
                                                            bgColor="#eff6ff"
                                                            labelColor="#1d4ed8"
                                                            textColor="#1e40af"
                                                        />
                                                        <InfoBlock
                                                            label="Negotiation Tip"
                                                            content={clause.negotiation_tip}
                                                            bgColor="#f0fdf4"
                                                            labelColor="#15803d"
                                                            textColor="#166534"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

function StatCard({ label, value, type }: { label: string; value: number; type: "total" | "high" | "medium" | "low" }) {
    const styles = {
        total: { bg: "#f5f5f0", border: "#e5e5e0", num: "#0A0A0A" },
        high: { bg: "#fef2f2", border: "#fecaca", num: "#EF4444" },
        medium: { bg: "#fffbeb", border: "#fde68a", num: "#d97706" },
        low: { bg: "#f0fdf4", border: "#bbf7d0", num: "#16a34a" },
    }
    const s = styles[type]
    return (
        <div
            className="rounded-xl p-6 text-center border-[1.5px]"
            style={{ background: s.bg, borderColor: s.border }}
        >
            <div className="text-5xl font-black" style={{ color: s.num }}>
                {value}
            </div>
            <div className="text-xs text-[#888] mt-1 font-medium uppercase tracking-wider">{label}</div>
        </div>
    )
}

function RiskBadge({ level }: { level: "HIGH" | "MEDIUM" | "LOW" }) {
    const styles = {
        HIGH: { bg: "#fef2f2", text: "#dc2626" },
        MEDIUM: { bg: "#fffbeb", text: "#d97706" },
        LOW: { bg: "#f0fdf4", text: "#16a34a" },
    }
    const s = styles[level]
    return (
        <span
            className="px-2.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"
            style={{ background: s.bg, color: s.text }}
        >
            {level}
        </span>
    )
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-2 text-sm text-[#777]">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
            {label}
        </div>
    )
}

function InfoBlock({
    label,
    content,
    bgColor,
    labelColor,
    textColor,
}: {
    label: string
    content: string
    bgColor: string
    labelColor: string
    textColor: string
}) {
    return (
        <div className="rounded-lg p-4" style={{ background: bgColor }}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: labelColor }}>
                {label}
            </div>
            <div className="text-sm leading-relaxed" style={{ color: textColor }}>
                {content}
            </div>
        </div>
    )
}