import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";

interface TempTwoProps {
    name: string;
    message: string;
    project: string;
    image: string;
    rating: number;
}

const TempTwo: React.FC<TempTwoProps> = ({ name, message, project, image, rating }) => {
    const [hovered, setHovered] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    const handleCopy = () => {
        if (svgRef.current) {
            const svgContent = svgRef.current.outerHTML;
            navigator.clipboard.writeText(svgContent)
                .then(() => alert("SVG template copied!"))
                .catch(err => console.error("Error copying SVG template:", err));
        }
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ position: "relative" }}
        >
            {/* Copy Button */}
            {hovered && (
                <button
                    onClick={handleCopy}
                    style={{
                        position: "absolute",
                        top: "60px",
                        right: "10px",
                        padding: "10px 20px",
                        backgroundColor: "#6366F1",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        zIndex: 1
                    }}
                >
                    <FaCopy />
                </button>
            )}

            <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width={400} height={600}>
                {/* Second Card: Minimalist Dark */}
                <rect width="280" height="380" x="10" y="10" rx="15" fill="#1F2937" filter="url(#shadow2)" />

                {/* Decorative Element */}
                <path d="M40 40 L260 40" stroke="#4B5563" strokeWidth="2" />
                <circle cx="150" cy="40" r="15" fill="#10B981" />

                {/* Quote Text */}
                <foreignObject x="40" y="60" width="220" height="160">
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Arial', fontSize: '14px', color: '#E5E7EB', lineHeight: 1.6, textAlign: 'justify' }}>
                        {message}
                    </div>
                </foreignObject>

                {/* Avatar */}
                <foreignObject x="110" y="220" width="80" height="80" clipPath="url(#circleClip1)">
                    <Image src={image} alt="Image" width={80} height={80} style={{ borderRadius: '50%' }} />
                </foreignObject>

                <text x="150" y="330" fontFamily="Arial" fontSize="16" fill="#E5E7EB" textAnchor="middle" fontWeight="bold">{name}</text>
                <text x="150" y="350" fontFamily="Arial" fontSize="12" fill="#9CA3AF" textAnchor="middle">{project}</text>

                {/* Filters for Shadows */}
                <defs>
                    <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
                    </filter>
                    <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.2" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default TempTwo;
