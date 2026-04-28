"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BuildingIllustration } from "@/components/illustrations/building-illustration"
import { LandIllustration } from "@/components/illustrations/land-illustration"
import { HouseIllustration } from "@/components/illustrations/house-illustration"
import { Upload, FileText, X, Loader2, ArrowRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { API_URL } from "@/lib/api"

const documentTypes = [
    {
        value: "Builder Agreement",
        label: "Builder Agreement",
        color: "#F5C842",
        Illustration: BuildingIllustration,
        textColor: "#0A0A0A",
    },
    {
        value: "Sale Deed",
        label: "Sale Deed",
        color: "#A78BFA",
        Illustration: LandIllustration,
        textColor: "#FFFFFF",
    },
    {
        value: "Home Loan Sanction Letter",
        label: "Home Loan Letter",
        color: "#22C55E",
        Illustration: HouseIllustration,
        textColor: "#FFFFFF",
    },
]

function UploadPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [documentType, setDocumentType] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const typeFromUrl = searchParams.get("type")
        if (typeFromUrl && documentTypes.some((d) => d.value === typeFromUrl)) {
            setDocumentType(typeFromUrl)
        }
    }, [searchParams])

    const handleFileSelect = useCallback((selectedFile: File) => {
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile)
        } else {
            alert("Please upload a PDF file")
        }
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
            const droppedFile = e.dataTransfer.files[0]
            if (droppedFile) handleFileSelect(droppedFile)
        },
        [handleFileSelect]
    )

    const handleUpload = useCallback(async () => {
        if (!file || !documentType) return
        setIsUploading(true)
        setUploadProgress(0)

        const interval = setInterval(() => {
            setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 5))
        }, 200)

        try {
            // Clear old analysis data so dashboard doesn't show stale results
            localStorage.removeItem("sahisign_results")
            localStorage.removeItem("sahisign_doc_type")
            localStorage.removeItem("sahisign_doc_name")

            const formData = new FormData()
            formData.append("file", file)
            formData.append("document_type", documentType)

            const response = await fetch(`${API_URL}/analyze`, {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Analysis failed")
            const data = await response.json()

            localStorage.setItem("sahisign_results", JSON.stringify(data))
            localStorage.setItem("sahisign_doc_type", documentType)
            localStorage.setItem("sahisign_doc_name", file.name)

            clearInterval(interval)
            setUploadProgress(100)
            setTimeout(() => router.push("/dashboard"), 500)
        } catch {
            clearInterval(interval)
            setIsUploading(false)
            setUploadProgress(0)
            alert("Could not analyze document. Please try again.")
        }
    }, [file, documentType, router])

    return (
        <div className="min-h-screen flex flex-col bg-[#FFFDF5]">
            <Navbar />

            <main className="flex-1 py-16 md:py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="inline-block bg-[#FF5722] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4">
                        Step 1
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-[#0A0A0A] tracking-tight leading-[0.95] mb-4">
                        Upload your{" "}
                        <span className="relative inline-block">
                            document
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none">
                                <path d="M 0 8 Q 50 2, 100 6 T 200 6" stroke="#FF5722" strokeWidth="4" fill="none" strokeLinecap="round" />
                            </svg>
                        </span>
                        .
                    </h1>
                    <p className="text-lg text-[#3D2817] mb-12 max-w-2xl">
                        Pick your document type, upload the PDF, and let our AI do the rest.
                    </p>

                    <div className="mb-10">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A] mb-4">
                            Document Type
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {documentTypes.map((doc) => {
                                const isSelected = documentType === doc.value
                                const Illust = doc.Illustration
                                return (
                                    <button
                                        key={doc.value}
                                        onClick={() => setDocumentType(doc.value)}
                                        disabled={isUploading}
                                        className={`relative rounded-xl p-5 border-2 border-[#0A0A0A] transition-all duration-200 text-left ${isSelected
                                            ? "shadow-[6px_6px_0_0_#0A0A0A] -translate-y-1"
                                            : "shadow-[3px_3px_0_0_#0A0A0A] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#0A0A0A]"
                                            }`}
                                        style={{ backgroundColor: doc.color }}
                                    >
                                        <div className="aspect-square mb-3">
                                            <Illust className="w-full h-full" />
                                        </div>
                                        <div className="font-black text-sm" style={{ color: doc.textColor }}>
                                            {doc.label}
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-[#0A0A0A] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black">
                                                ✓
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A] mb-4">
                            Upload your PDF document
                        </h2>

                        {!file ? (
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setIsDragging(true)
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed border-[#0A0A0A] rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragging ? "bg-[#FF5722] text-white" : "bg-[#FFF8E7] hover:bg-[#FFE082]"
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0]
                                        if (f) handleFileSelect(f)
                                    }}
                                />
                                <Upload className="h-12 w-12 mx-auto mb-4 text-[#0A0A0A]" />
                                <p className="text-lg font-bold mb-1 text-[#0A0A0A]">Drop your PDF here, or click to browse</p>
                                <p className="text-sm text-[#3D2817]">PDF only — max 10MB</p>
                            </div>
                        ) : (
                            <div className="bg-[#FFF8E7] border-2 border-[#0A0A0A] rounded-2xl p-6 flex items-center gap-4 shadow-[4px_4px_0_0_#0A0A0A]">
                                <div className="bg-[#FF5722] text-white p-3 rounded-lg">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-[#0A0A0A] truncate">{file.name}</p>
                                    <p className="text-xs text-[#3D2817]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                {!isUploading && (
                                    <button
                                        onClick={() => setFile(null)}
                                        className="bg-[#0A0A0A] text-white p-2 rounded hover:bg-[#FF5722] transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {isUploading && (
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-[#0A0A0A]">Analyzing your document...</span>
                                <span className="text-sm font-bold text-[#FF5722]">{uploadProgress}%</span>
                            </div>
                            <div className="h-3 bg-[#FFF8E7] rounded-full overflow-hidden border-2 border-[#0A0A0A]">
                                <div
                                    className="h-full bg-[#FF5722] transition-all duration-200"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file || !documentType || isUploading}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#0A0A0A] text-white px-10 py-5 rounded font-bold text-lg hover:bg-[#FF5722] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0A0A0A]"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                Analyze Document
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default function UploadPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FFFDF5]" />}>
            <UploadPageContent />
        </Suspense>
    )
}