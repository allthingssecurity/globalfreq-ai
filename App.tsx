import React, { useState, useEffect, useCallback } from 'react';
import Globe3D from './components/Globe3D';
import StationSidebar from './components/StationSidebar';
import RadioPlayer from './components/RadioPlayer';
import { getStationsByCountry, getStationsByIndianState } from './services/radioService';
import { getCountryMusicInsight, getDJIntro } from './services/geminiService';
import { RadioStation, GeoFeature, AIInsightData } from './types';
import { MapPin, Sparkles } from 'lucide-react';
import { INDIAN_STATE_OPTIONS } from './data/indianStations';

const INDIA_COORDS = { lat: 20.5937, lng: 78.9629 };

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedIndiaState, setSelectedIndiaState] = useState<string>('all');
  const [targetLocation, setTargetLocation] = useState<{ lat: number, lng: number } | null>(null);
  
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const [aiInsight, setAiInsight] = useState<AIInsightData | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [djIntro, setDjIntro] = useState<string | null>(null);

  const handleCountrySelect = useCallback(async (geo: GeoFeature, lat: number, lng: number) => {
    const countryCode = geo.properties.ISO_A2;
    const countryName = geo.properties.ADMIN;

    setSelectedCountry(countryName);
    setSelectedIndiaState('all');
    setTargetLocation({ lat, lng }); // Updates Globe camera
    
    setIsLoadingStations(true);
    setIsInsightLoading(true);
    setStations([]);
    setCurrentStation(null);
    setIsPlaying(false);
    setAiInsight(null);
    setDjIntro(null);

    // Fetch Radio Data
    try {
      const fetchedStations = await getStationsByCountry(countryCode);
      setStations(fetchedStations);
    } catch (e) {
      console.error("Failed to load stations", e);
    } finally {
      setIsLoadingStations(false);
    }

    // Fetch AI Insight
    try {
        const insight = await getCountryMusicInsight(countryName);
        setAiInsight(insight);
    } catch (e) {
        console.error(e);
    } finally {
        setIsInsightLoading(false);
    }

  }, []);

  const handleIndiaStateChange = async (stateValue: string) => {
    if (selectedCountry !== 'India') return;
    if (stateValue === selectedIndiaState) return;
    setSelectedIndiaState(stateValue);
    setIsLoadingStations(true);
    setStations([]);
    setCurrentStation(null);
    setDjIntro(null);
    setIsPlaying(false);

    try {
      const fetched = stateValue === 'all'
        ? await getStationsByCountry('IN')
        : await getStationsByIndianState(stateValue);
      setStations(fetched);
    } catch (e) {
      console.error("Failed to load Indian state stations", e);
    } finally {
      setIsLoadingStations(false);
    }
  };

  const handleStationSelect = async (station: RadioStation) => {
    setCurrentStation(station);
    setIsPlaying(true);
    
    // Reset intro
    setDjIntro(null);
    
    // Generate DJ Intro
    const intro = await getDJIntro(station.name, station.country, station.tags);
    setDjIntro(intro);
  };

  const goToIndia = () => {
    // Manually simulate clicking India
    // We create a fake GeoFeature for India to reuse the handler logic partially
    // But mainly we just want to set the location and fetch data.
    const indiaGeo = {
        properties: { ISO_A2: 'IN', ADMIN: 'India' },
        type: 'Feature',
        geometry: {}
    } as any;
    
    handleCountrySelect(indiaGeo, INDIA_COORDS.lat, INDIA_COORDS.lng);
  };

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      
      {/* Header */}
      <header className="absolute top-0 left-0 p-6 z-40 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              <span className="text-2xl font-bold">G</span>
          </div>
          <div>
              <h1 className="text-2xl font-space font-bold tracking-tighter text-white leading-none">
                GlobalFreq <span className="text-indigo-500 text-lg font-normal">AI</span>
              </h1>
              <p className="text-xs text-gray-400 tracking-widest uppercase">Live World Radio</p>
          </div>
      </header>

      {/* Quick Action: India */}
      <div className="absolute bottom-32 right-6 z-40 flex flex-col gap-3">
        <button 
          onClick={goToIndia}
          className="bg-gradient-to-r from-orange-500 via-white to-green-500 p-[1px] rounded-full hover:scale-105 transition-transform shadow-lg group"
        >
           <div className="bg-black/90 rounded-full px-4 py-2 flex items-center gap-2">
               <MapPin size={16} className="text-white group-hover:text-orange-400 transition-colors" />
               <span className="text-sm font-bold text-white">Explore India</span>
               <Sparkles size={14} className="text-yellow-400 animate-pulse" />
           </div>
        </button>
      </div>

      {/* 3D Globe Layer */}
      <Globe3D 
        onCountrySelect={handleCountrySelect} 
        targetLocation={targetLocation}
      />

      {/* Sidebar UI */}
      <StationSidebar 
        countryName={selectedCountry}
        stations={stations}
        isLoading={isLoadingStations}
        currentStation={currentStation}
        onStationSelect={handleStationSelect}
        aiInsight={aiInsight}
        isInsightLoading={isInsightLoading}
        djIntro={djIntro}
        indiaStateOptions={INDIAN_STATE_OPTIONS}
        selectedIndiaState={selectedIndiaState}
        onIndiaStateChange={handleIndiaStateChange}
      />

      {/* Player */}
      <RadioPlayer 
        station={currentStation}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        volume={volume}
        onVolumeChange={setVolume}
      />

      {/* Loading Indicator for initial app load if needed */}
      {!selectedCountry && stations.length === 0 && (
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 text-xs z-30">
             Interact with the globe to start listening
         </div>
      )}
    </div>
  );
};

export default App;
