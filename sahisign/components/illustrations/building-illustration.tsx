"use client"

export function BuildingIllustration({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className={className} fill="none">
            <ellipse cx="200" cy="340" rx="140" ry="20" fill="#1A1A1A" opacity="0.15" />

            <g>
                <path d="M 230 90 L 290 110 L 290 310 L 230 290 Z" fill="#D4A017" />
                <path d="M 170 110 L 230 90 L 230 290 L 170 310 Z" fill="#F5C842" />
                <path d="M 170 110 L 230 90 L 290 110 L 230 130 Z" fill="#FFE082" />

                {[0, 1, 2, 3, 4].map((row) =>
                    [0, 1].map((col) => (
                        <rect key={`f-${row}-${col}`} x={183 + col * 22} y={140 + row * 30} width="14" height="18" fill="#0A0A0A" opacity="0.85" />
                    ))
                )}

                <path d="M 170 110 L 230 90 L 290 110 L 290 310 L 230 290 L 170 310 Z M 170 110 L 170 310 M 230 90 L 230 290 M 230 130 L 230 290" stroke="#0A0A0A" strokeWidth="2" fill="none" />
            </g>

            <g>
                <path d="M 110 200 L 170 220 L 170 350 L 110 330 Z" fill="#FF8C42" />
                <path d="M 60 220 L 110 200 L 110 330 L 60 350 Z" fill="#FFA661" />
                <path d="M 60 220 L 110 200 L 170 220 L 110 240 Z" fill="#FFD7B5" />

                {[0, 1, 2].map((row) =>
                    [0, 1].map((col) => (
                        <rect key={`s-${row}-${col}`} x={70 + col * 18} y={250 + row * 28} width="12" height="16" fill="#0A0A0A" opacity="0.85" />
                    ))
                )}

                <rect x="80" y="305" width="14" height="22" fill="#3D2817" />
                <path d="M 60 220 L 110 200 L 170 220 L 170 350 L 110 330 L 60 350 Z M 60 220 L 60 350 M 110 200 L 110 330 M 110 240 L 110 330" stroke="#0A0A0A" strokeWidth="2" fill="none" />
            </g>

            <g>
                <line x1="250" y1="50" x2="250" y2="90" stroke="#0A0A0A" strokeWidth="3" />
                <line x1="250" y1="50" x2="320" y2="60" stroke="#0A0A0A" strokeWidth="3" />
                <line x1="250" y1="50" x2="220" y2="45" stroke="#0A0A0A" strokeWidth="3" />
                <line x1="310" y1="58" x2="310" y2="80" stroke="#0A0A0A" strokeWidth="2" />
                <rect x="305" y="78" width="14" height="10" fill="#FF5722" stroke="#0A0A0A" strokeWidth="1.5" />
                <circle cx="250" cy="50" r="4" fill="#FF5722" stroke="#0A0A0A" strokeWidth="1.5" />
            </g>

            <g>
                <rect x="30" y="320" width="6" height="20" fill="#3D2817" />
                <circle cx="33" cy="315" r="14" fill="#22C55E" stroke="#0A0A0A" strokeWidth="1.5" />
            </g>
            <g>
                <rect x="320" y="295" width="6" height="20" fill="#3D2817" />
                <circle cx="323" cy="290" r="14" fill="#22C55E" stroke="#0A0A0A" strokeWidth="1.5" />
            </g>

            <g transform="rotate(-8 350 180)">
                <rect x="335" y="165" width="32" height="40" fill="#FFF8E7" stroke="#0A0A0A" strokeWidth="1.5" />
                <line x1="340" y1="172" x2="362" y2="172" stroke="#A78BFA" strokeWidth="1" />
                <line x1="340" y1="178" x2="358" y2="178" stroke="#A78BFA" strokeWidth="1" />
                <line x1="340" y1="184" x2="362" y2="184" stroke="#A78BFA" strokeWidth="1" />
                <line x1="340" y1="190" x2="354" y2="190" stroke="#A78BFA" strokeWidth="1" />
            </g>

            <ellipse cx="80" cy="80" rx="14" ry="6" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />
            <ellipse cx="340" cy="40" rx="12" ry="5" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />

            <circle cx="50" cy="150" r="3" fill="#FF5722" />
            <circle cx="370" cy="220" r="3" fill="#A78BFA" />
            <circle cx="40" cy="280" r="3" fill="#22C55E" />
        </svg>
    )
}