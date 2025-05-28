import React from 'react';

interface ZigzagTextProps {
  text: string;
  className?: string;
  underlineColor?: string;
  underlineWidth?: number;
  highlightChars?: number;
  animated?: boolean;
}

const ZigzagText: React.FC<ZigzagTextProps> = ({
  text,
  className = '',
  underlineColor = '#3b82f6', // Default blue color
  underlineWidth = 2,
  highlightChars = 4,
  animated = true
}) => {
  if (!text) return null;
  
  // Split the text into the part to be underlined and the rest
  const firstPart = text.substring(0, highlightChars);
  const restPart = text.substring(highlightChars);

  return (
    <span className={`relative inline-block group ${className}`}>
      <span className="relative">
        {firstPart}
        <span className="absolute bottom-[-6px] left-0 w-full">
          <svg 
            width="100%" 
            height={underlineWidth * 3} 
            viewBox="0 0 100 6" 
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <path 
              d="M0,3 L5,1 L10,3 L15,5 L20,3 L25,1 L30,3 L35,5 L40,3 L45,1 L50,3 L55,5 L60,3 L65,1 L70,3 L75,5 L80,3 L85,1 L90,3 L95,5 L100,3" 
              fill="none"
              stroke={underlineColor}
              strokeWidth={underlineWidth}
              strokeLinecap="round"
              className={`
                transition-all duration-300
                ${animated ? 'group-hover:stroke-[3px] group-hover:stroke-opacity-80' : ''}
              `}
              style={{
                filter: animated ? 'drop-shadow(0 0 0 transparent)' : 'none',
                transition: 'filter 0.3s ease, stroke-width 0.3s ease, stroke-opacity 0.3s ease'
              }}
              onMouseOver={animated ? (e) => {
                const target = e.target as SVGPathElement;
                target.style.filter = `drop-shadow(0 0 2px ${underlineColor})`;
              } : undefined}
              onMouseOut={animated ? (e) => {
                const target = e.target as SVGPathElement;
                target.style.filter = 'drop-shadow(0 0 0 transparent)';
              } : undefined}
            />
            {animated && (
              <path 
                d="M0,3 L5,1 L10,3 L15,5 L20,3 L25,1 L30,3 L35,5 L40,3 L45,1 L50,3 L55,5 L60,3 L65,1 L70,3 L75,5 L80,3 L85,1 L90,3 L95,5 L100,3" 
                fill="none"
                stroke={underlineColor}
                strokeWidth={underlineWidth * 0.8}
                strokeLinecap="round"
                strokeDasharray="30"
                strokeDashoffset="0"
                opacity="0"
                className="group-hover:opacity-30"
                style={{
                  animation: 'dash 1.5s linear infinite',
                  transition: 'opacity 0.3s ease'
                }}
              />
            )}
          </svg>

        </span>
      </span>
      {restPart}
    </span>
  );
};

export default ZigzagText;