"use client"
import React, { useState, useRef } from "react";
import { FaCopy, FaStar } from 'react-icons/fa';

const TempFour = (prop) => {
    const { name, message, project, photo, rating } = prop;
    const stars = Array(5).fill(0); // Create an array for star rating
    const [hovered, setHovered] = useState(false); // For hover state
    const svgRef = useRef<SVGSVGElement>(null); // Ref for SVG element

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
            {hovered && (
                <button
                    onClick={handleCopy}
                    style={{
                        position: "absolute",
                        top: "60px",
                        right: "10px",
                        padding: "10px 20px",
                        backgroundColor: "#0EA5E9",
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
                    <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#0EA5E9', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>

                {/* Main Card */}
                <rect width="280" height="380" x="10" y="10" rx="30" fill="white" filter="url(#shadow4)" />

                {/* Adjusted Wave Pattern to fit inside the box */}
                <path d="M10 270 Q50 240, 100 270 T190 270 T270 270" fill="none" stroke="url(#gradient4)" strokeWidth="3" />

                {/* Quote Symbol */}
                <text x="40" y="60" fontSize="80" fill="#0EA5E9" opacity="0.1" fontFamily="Arial">"</text>

                {/* Quote Text */}
                <foreignObject x="40" y="40" width="220" height="160">
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Arial', fontSize: '14px', color: '#374151', lineHeight: 1.6, textAlign: 'justify' }}>
                        {message}
                    </div>
                </foreignObject>

                {/* Avatar */}
                <circle cx="150" cy="260" r="40" fill="white" stroke="#0EA5E9" strokeWidth="3" />
                <image
                    href={photo} // URL of the image
                    x="120"
                    y="230"
                    width="60"
                    height="60"
                    style={{ borderRadius: '50%' }}
                    clipPath="circle(50% at 50% 50%)"
                />

                {/* Name and Project */}
                <text x="150" y="330" fontFamily="Arial" fontSize="16" fill="#0EA5E9" textAnchor="middle" fontWeight="bold">{name}</text>
                <text x="150" y="350" fontFamily="Arial" fontSize="12" fill="#6B7280" textAnchor="middle">{project}</text>

                {/* Star Rating */}
                <foreignObject x="100" y="360" width="100" height="50">
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                        {stars.map((_, index) => (
                            <FaStar key={index} color={index < rating ? "#FFD700" : "#E5E7EB"} />
                        ))}
                    </div>
                </foreignObject>

                {/* Filters for Shadows */}
                <defs>
                    <filter id="shadow4" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default TempFour;
