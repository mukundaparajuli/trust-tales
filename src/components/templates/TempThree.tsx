import Image from "next/image";
import { FaStar } from 'react-icons/fa'

const TempThree = (prop) => {
    const stars = Array(5).fill(0); // Create an array for star rating
    const { name, message, project, image, rating } = prop;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" height={1000} width={1000}>

            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F3F4F6" strokeWidth="1" />
                </pattern>
            </defs>

            <rect width="280" height="380" x="10" y="10" rx="0" fill="white" filter="url(#shadow3)" />
            <rect width="280" height="380" x="10" y="10" fill="url(#grid)" />

            {/* Geometric Decorations */}
            <circle cx="40" cy="40" r="15" fill="#EC4899" opacity="0.2" />
            <circle cx="260" cy="340" r="20" fill="#EC4899" opacity="0.2" />

            {/* Quote Text */}
            <foreignObject x="40" y="40" width="220" height="160">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Arial', fontSize: '14px', color: '#374151', lineHeight: 1.6, textAlign: 'justify' }}>
                    {message}</div>
            </foreignObject>

            {/* Image (use <foreignObject> for HTML inside SVG) */}
            <foreignObject x="110" y="220" width="80" height="80">
                <Image src={image} alt="Image" width={80} height={80} />
            </foreignObject>

            <text x="150" y="330" fontFamily="Arial" fontSize="16" fill="#374151" textAnchor="middle" fontWeight="bold">{name}</text>
            <text x="150" y="350" fontFamily="Arial" fontSize="12" fill="#6B7280" textAnchor="middle">{project}</text>
            <defs>
                <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
                </filter>
                <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.2" />
                </filter>
                <filter id="shadow3" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
                </filter>
                <filter id="shadow4" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
                </filter>
            </defs>


            <defs>
                <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
                </filter>
            </defs>
        </svg >
    );
};

export default TempThree;
