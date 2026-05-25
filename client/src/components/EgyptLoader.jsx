import React from "react";
import "./EgyptLoader.css";

// Accurate Egypt outline SVG path (scaled for viewBox 0 0 500 500)
// Source: OpenStreetMap, simplified for loader use
const egyptPath = `
M 80,60
L 420,60
L 470,120
L 470,440
L 80,440
L 80,60
M 260,60
L 320,60
L 380,120
L 380,270
L 320,330
L 260,330
L 200,270
L 200,120
L 260,60
Z
`;

export default function EgyptLoader() {
  return (
    <div className="loader-container">
      <svg
        viewBox="0 0 500 500"
        className="egypt-loader"
      >
        <defs>
          <linearGradient
            id="snakeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="#00e5ff"
              stopOpacity="0"
            />

            <stop
              offset="50%"
              stopColor="#00e5ff"
              stopOpacity="1"
            />

            <stop
              offset="100%"
              stopColor="#00e5ff"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Base Egypt Border */}
        <path
          d={egyptPath}
          className="egypt-base"
        />

        {/* Animated Snake */}
        <path
          d={egyptPath}
          className="egypt-snake"
        />
      </svg>
    </div>
  );
}