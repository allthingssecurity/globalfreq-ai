import React, { useEffect, useRef, useState, useCallback } from 'react';
// Safe import for react-globe.gl which can sometimes behave differently in ESM/CDN environments
import * as GlobeGL from 'react-globe.gl';
import { GeoFeature } from '../types';

// Handle default export interop
const Globe = (GlobeGL as any).default || GlobeGL;

interface Globe3DProps {
  onCountrySelect: (geo: GeoFeature, lat: number, lng: number) => void;
  targetLocation: { lat: number, lng: number } | null;
}

const Globe3D: React.FC<Globe3DProps> = ({ onCountrySelect, targetLocation }) => {
  const globeEl = useRef<any>(undefined);
  const [countries, setCountries] = useState<GeoFeature[]>([]);
  const [hoverD, setHoverD] = useState<GeoFeature | null>(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    // Load country polygons
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        setCountries(data.features);
      })
      .catch(err => console.error("Failed to load globe data", err));

    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (targetLocation && globeEl.current) {
      globeEl.current.pointOfView({
        lat: targetLocation.lat,
        lng: targetLocation.lng,
        altitude: 1.8 // Zoom level
      }, 2000);
    }
  }, [targetLocation]);

  // Initial auto-rotate
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
    }
  }, []);

  const handleCountryClick = useCallback((polygon: object, event: MouseEvent, coords: { lat: number, lng: number, altitude: number } | undefined) => {
      const p = polygon as GeoFeature;
      if (globeEl.current) {
          // Stop auto rotation on interaction
          globeEl.current.controls().autoRotate = false;
          
          // Safe access to coordinates with fallback
          const lat = coords ? coords.lat : 0;
          const lng = coords ? coords.lng : 0;

          onCountrySelect(p, lat, lng);
          
          globeEl.current.pointOfView({
            lat: lat,
            lng: lng,
            altitude: 1.5
          }, 1500);
      }
  }, [onCountrySelect]);

  return (
    <div className="absolute inset-0 bg-black">
      <Globe
        ref={globeEl}
        width={width}
        height={height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        lineHoverPrecision={0}
        polygonsData={countries}
        polygonAltitude={(d: any) => d === hoverD ? 0.12 : 0.06}
        polygonCapColor={(d: any) => d === hoverD ? 'rgba(79, 70, 229, 0.4)' : 'rgba(255, 255, 255, 0.05)'}
        polygonSideColor={() => 'rgba(255, 255, 255, 0.05)'}
        polygonStrokeColor={() => '#374151'}
        polygonLabel={({ properties: d }: any) => `
          <div style="background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); font-family: sans-serif; font-size: 12px;">
            ${d.ADMIN}
          </div>
        `}
        onPolygonHover={setHoverD as any}
        onPolygonClick={handleCountryClick as any}
        atmosphereColor="#4f46e5"
        atmosphereAltitude={0.15}
      />
      
      {/* Atmospheric overlay gradient for cinematic look */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none opacity-60" />
    </div>
  );
};

export default Globe3D;
