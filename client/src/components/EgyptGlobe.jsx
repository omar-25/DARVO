import React, { useEffect, useState, useRef } from 'react';
import './EgyptGlobe.css';
import egyptMap from '../assets/egypt-map.svg';

export default function EgyptGlobe({ theme = 'dark' }) {
  const variant = theme === 'dark' ? 'egypt-globe-dark' : 'egypt-globe-light';
  const [paths, setPaths] = useState([]);
  const [viewBox, setViewBox] = useState('0 0 500 500');
  const pathRefs = useRef([]);

  useEffect(() => {
    // Fetch the packed SVG at runtime and extract path elements for an accurate outline
    let cancelled = false;
    fetch(egyptMap)
      .then((r) => r.text())
      .then((text) => {
        if (cancelled) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (!svg) return;
        const vb = svg.getAttribute('viewBox');
        if (vb) setViewBox(vb);

        // Collect all <path> elements; if none exist, try to collect polygons/polyline as fallback
        const pathEls = Array.from(svg.querySelectorAll('path'));
        if (pathEls.length > 0) {
          setPaths(pathEls.map((p) => p.getAttribute('d') || ''));
          return;
        }

        // fallback: convert polygons to d strings
        const polyEls = Array.from(svg.querySelectorAll('polygon, polyline, rect'));
        if (polyEls.length > 0) {
          const converted = polyEls.map((el) => {
            if (el.tagName.toLowerCase() === 'rect') {
              const x = parseFloat(el.getAttribute('x') || '0');
              const y = parseFloat(el.getAttribute('y') || '0');
              const w = parseFloat(el.getAttribute('width') || '0');
              const h = parseFloat(el.getAttribute('height') || '0');
              return `M ${x} ${y} h ${w} v ${h} h ${-w} Z`;
            }
            const points = (el.getAttribute('points') || '').trim();
            const pts = points.split(/\s+/).join(' ');
            return `M ${pts} Z`;
          });
          setPaths(converted);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  // After paths mount, measure lengths and set CSS variables
  useEffect(() => {
    pathRefs.current.forEach((el, i) => {
      if (!el) return;
      try {
        const len = el.getTotalLength();
        const dash = Math.max(Math.round(len * 0.06), 80);
        el.style.setProperty('--dashlen', `${len}px`);
        el.style.setProperty('--dashsize', `${dash}px`);
        // set stroke-dasharray using JS so it's exact
        el.style.strokeDasharray = `${dash} ${len}`;
        // make the animation a bit faster: larger divisor -> shorter duration
        const duration = Math.max((len / 600).toFixed(2), 1.6);
        el.style.animation = `outlineMove ${duration}s linear infinite`;
      } catch (e) {
        // ignore
      }
    });
  }, [paths]);

  return (
    <div className={`egypt-globe-shell ${variant}`}>
      <div className="egypt-map-frame">
        <img src={egyptMap} alt="Egypt map" className="egypt-map-image" />

        {/* Animated glowing outline overlay built from the actual SVG paths */}
        <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="egypt-outline-svg" aria-hidden>
          <defs>
              <linearGradient id="glowGradGlobe" x1="0%" y1="0%" x2="100%" y2="0">
                <stop offset="0%" stopColor="#ffd56b" stopOpacity="0" />
                <stop offset="40%" stopColor="#ffd56b" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffd56b" stopOpacity="0" />
              </linearGradient>
          </defs>

            {paths.map((d, idx) => (
              <path
                key={idx}
                ref={(el) => (pathRefs.current[idx] = el)}
                d={d}
                className="egypt-outline-path"
                stroke="url(#glowGradGlobe)"
              />
            ))}
        </svg>

        <div className="egypt-map-overlay" />
      </div>
    </div>
  );
}
