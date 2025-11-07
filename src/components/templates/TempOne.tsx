"use client"
import React, { useState, useRef } from "react";
import { FaCopy } from "react-icons/fa";

interface TempOneProps {
    name: string;
    message: string;
    project: string;
    photo: string;
    rating: number;
}

const TempOne: React.FC<TempOneProps> = ({ name, message, project, photo }) => {
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
                        zIndex: 1
                    }}
                >
                    <FaCopy />
                </button>
            )}

            <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" height={600} width={400}>
                <defs>
                    {/* Filters for Shadows */}
                    <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
                    </filter>
                </defs>

                {/* First Card */}
                <rect width="280" height="380" x="10" y="10" rx="20" fill="white" filter="url(#shadow1)" />
                <rect width="280" height="120" x="10" y="270" rx="20" fill="#000000" />

                {/* Quote Symbol */}
                <text x="40" y="60" fontSize="60" fill="#000000" fontFamily="Arial">&quot;</text>

                {/* Quote Text */}
                <foreignObject x="40" y="40" width="230" height="500">
                    <div style={{ fontFamily: 'Arial', fontSize: '14px', color: '#4B5563', lineHeight: 1.6, textAlign: 'justify' }}>
                        {message}
                    </div>
                </foreignObject>

                {/* Avatar */}
                <circle cx="150" cy="260" r="40" fill="white" stroke="#374151" strokeWidth="3" />
                <image
                    href={photo} // URL of the image
                    x="110"
                    y="220"
                    width="80"
                    height="80"
                    style={{ borderRadius: '50%' }}
                    clipPath="circle(50% at 50% 50%)"
                />

                {/* Name and Project */}
                <text x="150" y="330" fontFamily="Arial" fontSize="16" fill="white" textAnchor="middle" fontWeight="bold">{name}</text>
                <text x="150" y="350" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">{project}</text>
            </svg>
        </div>
    );
};

export default TempOne;
