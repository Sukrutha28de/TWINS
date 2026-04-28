"use client"

export function HouseIllustration({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className={className} fill="none">
            <ellipse cx="200" cy="340" rx="140" ry="20" fill="#1A1A1A" opacity="0.15" />

            <g>
                <path d="M 230 200 L 310 220 L 310 320 L 230 300 Z" fill="#16A34A" stroke="#0A0A0A" strokeWidth="2" />
                <path d="M 130 220 L 230 200 L 230 300 L 130 320 Z" fill="#22C55E" stroke="#0A0A0A" strokeWidth="2" />

                <rect x="170" y="250" width="22" height="50" fill="#3D2817" stroke="#0A0A0A" strokeWidth="2" />
                <circle cx="187" cy="275" r="2" fill="#F5C842" />

                <rect x="200" y="240" width="22" height="22" fill="#FFF8E7" stroke="#0A0A0A" strokeWidth="2" />
                <line x1="211" y1="240" x2="211" y2="262" stroke="#0A0A0A" strokeWidth="1.5" />
                <line x1="200" y1="251" x2="222" y2="251" stroke="#0A0A0A" strokeWidth="1.5" />
                <rect x="195" y="240" width="5" height="22" fill="#3D2817" stroke="#0A0A0A" strokeWidth="1.5" />
                <rect x="222" y="240" width="5" height="22" fill="#3D2817" stroke="#0A0A0A" strokeWidth="1.5" />
            </g>

            <g>
                <path d="M 230 200 L 310 220 L 270 170 L 200 155 Z" fill="#78350F" stroke="#0A0A0A" strokeWidth="2" />
                <path d="M 130 220 L 230 200 L 200 155 L 110 175 Z" fill="#92400E" stroke="#0A0A0A" strokeWidth="2" />
                <line x1="200" y1="155" x2="270" y2="170" stroke="#0A0A0A" strokeWidth="2" />
            </g>

            <g>
                <rect x="240" y="135" width="14" height="30" fill="#FF5722" stroke="#0A0A0A" strokeWidth="2" />
                <rect x="237" y="130" width="20" height="6" fill="#0A0A0A" />
                <circle cx="247" cy="120" r="5" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />
                <circle cx="252" cy="108" r="6" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />
                <circle cx="246" cy="95" r="7" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />
            </g>

            <g>
                <rect x="80" y="270" width="8" height="35" fill="#3D2817" stroke="#0A0A0A" strokeWidth="1.5" />
                <circle cx="84" cy="265" r="22" fill="#22C55E" stroke="#0A0A0A" strokeWidth="2" />
                <circle cx="74" cy="258" r="14" fill="#16A34A" stroke="#0A0A0A" strokeWidth="2" />
                <circle cx="92" cy="252" r="13" fill="#16A34A" stroke="#0A0A0A" strokeWidth="2" />
            </g>

            <g transform="rotate(-15 340 230)">
                <circle cx="335" cy="220" r="14" fill="#F5C842" stroke="#0A0A0A" strokeWidth="2.5" />
                <circle cx="335" cy="220" r="6" fill="#FFF8E7" stroke="#0A0A0A" strokeWidth="2" />
                <rect x="349" y="217" width="28" height="6" fill="#F5C842" stroke="#0A0A0A" strokeWidth="2.5" />
                <rect x="370" y="223" width="4" height="6" fill="#F5C842" stroke="#0A0A0A" strokeWidth="2" />
                <rect x="362" y="223" width="4" height="4" fill="#F5C842" stroke="#0A0A0A" strokeWidth="2" />
            </g>

            <g>
                <ellipse cx="55" cy="320" rx="18" ry="6" fill="#F5C842" stroke="#0A0A0A" strokeWidth="2" />
                <ellipse cx="55" cy="312" rx="18" ry="6" fill="#F5C842" stroke="#0A0A0A" strokeWidth="2" />
                <ellipse cx="55" cy="304" rx="18" ry="6" fill="#F5C842" stroke="#0A0A0A" strokeWidth="2" />
                <text x="55" y="307" textAnchor="middle" fill="#0A0A0A" fontSize="10" fontWeight="900" fontFamily="sans-serif">₹</text>
            </g>

            <path d="M 175 305 L 165 340 L 195 340 L 195 305 Z" fill="#D6D3D1" stroke="#0A0A0A" strokeWidth="1.5" opacity="0.7" />

            <g transform="rotate(-5 60 230)">
                <rect x="38" y="225" width="44" height="22" fill="#EF4444" stroke="#0A0A0A" strokeWidth="2" />
                <text x="60" y="241" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif">SOLD</text>
                <line x1="60" y1="247" x2="60" y2="265" stroke="#0A0A0A" strokeWidth="2" />
            </g>

            <g>
                <circle cx="365" cy="80" r="14" fill="#F5C842" stroke="#0A0A0A" strokeWidth="2" />
                <line x1="365" y1="55" x2="365" y2="62" stroke="#0A0A0A" strokeWidth="2" />
                <line x1="385" y1="80" x2="392" y2="80" stroke="#0A0A0A" strokeWidth="2" />
            </g>

            <ellipse cx="100" cy="80" rx="14" ry="6" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />

            <circle cx="40" cy="160" r="3" fill="#A78BFA" />
            <circle cx="360" cy="280" r="3" fill="#FF5722" />
            <circle cx="30" cy="220" r="3" fill="#F5C842" />
        </svg>
    )
}