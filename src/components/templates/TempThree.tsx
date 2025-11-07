"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaCopy } from 'react-icons/fa';

interface TempThreeProps {
    name: string;
    message: string;
    project: string;
    photo: string;
    rating: number;
}

const TempThree: React.FC<TempThreeProps> = ({ name, message, project, photo, rating }) => {
    const [hovered, setHovered] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    const handleCopy = () => {
        if (svgRef.current) {
            const svgContent = svgRef.current.outerHTML;
            navigator.clipboard.writeText(svgContent)
                .then(() => alert("SVG template copied!"))
                .catch(err => { });
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
                        backgroundColor: "#374151",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        zIndex: 1,
                    }}
                >
                    <FaCopy />
                </button>
            )}

            <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" height={600} width={400}>
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F3F4F6" strokeWidth="1" />
                    </pattern>
                    <filter id="shadow3" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
                    </filter>
                </defs>

                <rect width="280" height="380" x="10" y="10" rx="0" fill="white" filter="url(#shadow3)" />
                <rect width="280" height="380" x="10" y="10" fill="url(#grid)" />

                {/* Geometric Decorations */}
                <circle cx="40" cy="40" r="15" fill="#EC4899" opacity="0.2" />
                <circle cx="260" cy="340" r="20" fill="#EC4899" opacity="0.2" />

                {/* Quote Text */}
                <foreignObject x="40" y="40" width="220" height="160">
                    <div style={{ fontFamily: 'Arial', fontSize: '14px', color: '#374151', lineHeight: 1.6, textAlign: 'justify' }}>
                        {message}
                    </div>
                </foreignObject>

                {/* Image */}
                <foreignObject x="110" y="220" width="80" height="80">
                    <Image src={photo} alt="Profile Picture" width={80} height={80} />
                </foreignObject>

                {/* Name and Project Text */}
                <text x="150" y="330" fontFamily="Arial" fontSize="16" fill="#374151" textAnchor="middle" fontWeight="bold">{name}</text>
                <text x="150" y="350" fontFamily="Arial" fontSize="12" fill="#6B7280" textAnchor="middle">{project}</text>
            </svg>
        </div>
    );
};

export default TempThree;
