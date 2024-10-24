import Image from "next/image";
import React from "react";

const TempTwo = (prop) => {
    const { name, message, project, image, rating } = prop;
    const stars = Array(5).fill(0);

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width={1000} height={1000}>
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
            </foreignObject><text x="150" y="330" fontFamily="Arial" fontSize="16" fill="#E5E7EB" textAnchor="middle" fontWeight="bold">{name}</text>
            <text x="150" y="350" fontFamily="Arial" fontSize="12" fill="#9CA3AF" textAnchor="middle">Tech Lead</text>


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
    );
};

export default TempTwo;
