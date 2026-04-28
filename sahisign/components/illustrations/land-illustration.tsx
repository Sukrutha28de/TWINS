"use client"

export function LandIllustration({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className={className} fill="none">
            <ellipse cx="200" cy="340" rx="150" ry="20" fill="#1A1A1A" opacity="0.15" />

            <g>
                <path d="M 200 180 L 340 230 L 200 290 L 60 230 Z" fill="#A78BFA" stroke="#0A0A0A" strokeWidth="2.5" />
                <path d="M 60 230 L 60 250 L 200 310 L 200 290 Z" fill="#7C3AED" stroke="#0A0A0A" strokeWidth="2.5" />
                <path d="M 200 290 L 200 310 L 340 250 L 340 230 Z" fill="#8B5CF6" stroke="#0A0A0A" strokeWidth="2.5" />

                <g fill="#22C55E" stroke="#0A0A0A" strokeWidth="1">
                    <path d="M 130 240 Q 132 232, 134 240 Q 136 234, 138 240 Z" />
                    <path d="M 250 250 Q 252 242, 254 250 Q 256 244, 258 250 Z" />
                    <path d="M 180 270 Q 182 262, 184 270 Q 186 264, 188 270 Z" />
                    <path d="M 280 235 Q 282 227, 284 235 Q 286 229, 288 235 Z" />
                </g>

                <path d="M 200 180 L 340 230" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="5 4" />
                <path d="M 340 230 L 200 290" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="5 4" />
                <path d="M 200 290 L 60 230" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="5 4" />
                <path d="M 60 230 L 200 180" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="5 4" />

                <circle cx="200" cy="180" r="5" fill="#FF5722" stroke="#0A0A0A" strokeWidth="1.5" />
                <circle cx="340" cy="230" r="5" fill="#FF5722" stroke="#0A0A0A" strokeWidth="1.5" />
                <circle cx="200" cy="290" r="5" fill="#FF5722" stroke="#0A0A0A" strokeWidth="1.5" />
                <circle cx="60" cy="230" r="5" fill="#FF5722" stroke="#0A0A0A" strokeWidth="1.5" />
            </g>

            <g>
                <rect x="148" y="180" width="4" height="60" fill="#3D2817" stroke="#0A0A0A" strokeWidth="1.5" />
                <rect x="115" y="150" width="70" height="32" fill="#FF5722" stroke="#0A0A0A" strokeWidth="2" />
                <text x="150" y="172" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                    FOR SALE
                </text>
            </g>

            <g>
                <line x1="290" y1="200" x2="280" y2="225" stroke="#0A0A0A" strokeWidth="2.5" />
                <line x1="290" y1="200" x2="300" y2="225" stroke="#0A0A0A" strokeWidth="2.5" />
                <line x1="290" y1="200" x2="295" y2="225" stroke="#0A0A0A" strokeWidth="2.5" />
                <rect x="284" y="190" width="12" height="12" fill="#F5C842" stroke="#0A0A0A" strokeWidth="1.5" />
                <circle cx="290" cy="196" r="3" fill="#0A0A0A" />
            </g>

            <g transform="rotate(8 70 130)">
                <rect x="55" y="115" width="34" height="42" fill="#FFF8E7" stroke="#0A0A0A" strokeWidth="2" />
                <line x1="60" y1="123" x2="84" y2="123" stroke="#0A0A0A" strokeWidth="1" />
                <line x1="60" y1="129" x2="80" y2="129" stroke="#0A0A0A" strokeWidth="1" />
                <line x1="60" y1="135" x2="84" y2="135" stroke="#0A0A0A" strokeWidth="1" />
                <line x1="60" y1="141" x2="76" y2="141" stroke="#0A0A0A" strokeWidth="1" />
                <circle cx="78" cy="150" r="5" fill="none" stroke="#FF5722" strokeWidth="1.5" />
            </g>

            <g transform="rotate(-6 330 110)">
                <rect x="315" y="95" width="30" height="38" fill="#FFF8E7" stroke="#0A0A0A" strokeWidth="2" />
                <line x1="320" y1="103" x2="340" y2="103" stroke="#0A0A0A" strokeWidth="1" />
                <line x1="320" y1="109" x2="336" y2="109" stroke="#0A0A0A" strokeWidth="1" />
                <line x1="320" y1="115" x2="340" y2="115" stroke="#0A0A0A" strokeWidth="1" />
            </g>

            <g fill="#8D99AE" stroke="#0A0A0A" strokeWidth="1.5">
                <ellipse cx="105" cy="245" rx="6" ry="3" />
                <ellipse cx="305" cy="265" rx="5" ry="3" />
            </g>

            <ellipse cx="80" cy="60" rx="14" ry="6" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />
            <ellipse cx="320" cy="50" rx="12" ry="5" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />

            <circle cx="40" cy="100" r="3" fill="#F5C842" />
            <circle cx="370" cy="180" r="3" fill="#22C55E" />
            <circle cx="50" cy="320" r="3" fill="#FF5722" />
        </svg>
    )
}