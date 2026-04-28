"use client"

import Link from "next/link"

interface LogoProps {
    variant?: "light" | "dark"
    size?: "sm" | "md" | "lg"
}

export function Logo({ variant = "light", size = "md" }: LogoProps) {
    const textColor = variant === "light" ? "#FFFFFF" : "#0A0A0A"
    const accentColor = "#FF5722"

    const sizes = {
        sm: { iconSize: 28, hindiSize: "text-xl", englishSize: "text-xl" },
        md: { iconSize: 36, hindiSize: "text-2xl md:text-3xl", englishSize: "text-2xl md:text-3xl" },
        lg: { iconSize: 56, hindiSize: "text-5xl md:text-6xl", englishSize: "text-5xl md:text-6xl" },
    }
    const s = sizes[size]

    return (
        <Link href="/" className="flex items-center gap-2 group">
            <svg
                width={s.iconSize}
                height={s.iconSize}
                viewBox="0 0 40 40"
                fill="none"
                className="transition-transform group-hover:rotate-12"
            >
                <path d="M 20 4 L 36 12 L 36 28 L 20 36 L 4 28 L 4 12 Z" fill={accentColor} stroke={textColor} strokeWidth="2" strokeLinejoin="round" />
                <path d="M 12 20 L 18 26 L 28 14" stroke={textColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>

            <div className="flex items-baseline gap-1">
                <span
                    className={`${s.hindiSize} font-black leading-none`}
                    style={{ color: textColor, fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif" }}
                >
                    सही
                </span>
                <span
                    className={`${s.englishSize} font-black leading-none tracking-tight`}
                    style={{ color: textColor }}
                >
                    Sign
                </span>
                <span
                    className="w-1.5 h-1.5 rounded-full mb-1"
                    style={{ backgroundColor: accentColor }}
                />
            </div>
        </Link>
    )
}