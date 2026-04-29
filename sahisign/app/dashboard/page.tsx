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

export default function DashboardPage() {
    const router = useRouter()
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
    const [documentType, setDocumentType] = useState("")
    const [documentName, setDocumentName] = useState("")
    const [isDownloading, setIsDownloading] = useState(false)
    const [displayScore, setDisplayScore] = useState(0)
    const [openClauses, setOpenClauses] = useState<Set<number>>(new Set())
    const [visibleCards, setVisibleCards] = useState<number[]>([])

    useEffect(() => {
        const results = localStorage.getItem("sahisign_results")
        const docType = localStorage.getItem("sahisign_doc_type")
        const docName = localStorage.getItem("sahisign_doc_name")
        if (!results) {
            router.push("/upload")
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
                        <div className="bg-[#0A0A0A] text-[#FFFDF5] rounded-2xl p-6 lg:sticky lg:top-24 self-start">
                            {/* Verdict header */}
                            <div className="text-center mb-5">
                                <div className="flex items-baseline justify-center gap-1 mb-2">
                                    <span className="text-6xl font-black" style={{ color: scoreColor }}>
                                        {displayScore}
                                    </span>
                                    <span className="text-lg font-bold text-[#666]">/100</span>
                                </div>
                                <div className="h-px w-12 mx-auto mb-3" style={{ backgroundColor: scoreColor }} />
                                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: scoreColor }}>
                                    {analysisData.overall_score >= 70 && "Looks Safe"}
                                    {analysisData.overall_score >= 40 && analysisData.overall_score < 70 && "Proceed With Caution"}
                                    {analysisData.overall_score < 40 && "Do Not Sign As-Is"}
                                </p>
                            </div>

                            {/* Verdict message */}
                            <div className="bg-[#1a1a1a] rounded-lg p-4 mb-5 text-left border-l-4" style={{ borderLeftColor: scoreColor }}>
                                <p className="text-xs font-bold mb-1" style={{ color: scoreColor }}>
                                    {analysisData.overall_score >= 70 && "✓ You're in good shape"}
                                    {analysisData.overall_score >= 40 && analysisData.overall_score < 70 && "⚠ Don't sign yet"}
                                    {analysisData.overall_score < 40 && "✕ Walk away or renegotiate"}
                                </p>
                                <p className="text-xs text-[#aaa] leading-relaxed">
                                    {analysisData.overall_score >= 70 && `Out of ${analysisData.total_clauses} clauses, only ${analysisData.high_risk_count + analysisData.medium_risk_count} need attention. Review them, but the agreement is largely fair.`}
                                    {analysisData.overall_score >= 40 && analysisData.overall_score < 70 && `${analysisData.high_risk_count} of ${analysisData.total_clauses} clauses could cost you money. Negotiate them before signing.`}
                                    {analysisData.overall_score < 40 && `${analysisData.high_risk_count} serious red flags found. This document is heavily one-sided. Get a lawyer involved.`}
                                </p>
                            </div>

                            {/* Donut */}
                            <div className="relative w-40 h-40 mx-auto mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={75}
                                            paddingAngle={3}
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
                                    <span className="text-3xl font-black" style={{ color: scoreColor }}>
                                        {analysisData.total_clauses}
                                    </span>
                                    <span className="text-[9px] uppercase tracking-wider text-[#666] mt-0.5">Clauses</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-1.5 mb-5 text-left">
                                <LegendItem color="#EF4444" label={`${analysisData.high_risk_count} High`} />
                                <LegendItem color="#F59E0B" label={`${analysisData.medium_risk_count} Medium`} />
                                <LegendItem color="#22C55E" label={`${analysisData.low_risk_count} Low`} />
                            </div>

                            <div className="h-px bg-[#1a1a1a] mb-4" />

                            {/* Download */}
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="w-full bg-[#FF5722] hover:opacity-85 text-white py-3 rounded-lg font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
                            >
                                {isDownloading ? "Generating..." : "⬇ Download Report"}
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
                                                        fullWidth
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
    fullWidth = false,
}: {
    label: string
    content: string
    bgColor: string
    labelColor: string
    textColor: string
    fullWidth?: boolean
}) {
    return (
        <div className={`rounded-lg p-4 ${fullWidth ? "" : ""}`} style={{ background: bgColor }}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: labelColor }}>
                {label}
            </div>
            <div className="text-sm leading-relaxed" style={{ color: textColor }}>
                {content}
            </div>
        </div>
    )
}