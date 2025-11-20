import React, { useEffect, useRef, useState } from 'react';
import { RadioStation } from '../types';
import { Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';

interface RadioPlayerProps {
  station: RadioStation | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (val: number) => void;
}

const RadioPlayer: React.FC<RadioPlayerProps> = ({ 
  station, 
  isPlaying, 
  onTogglePlay,
  volume,
  onVolumeChange
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (station && audioRef.current) {
      setLoadError(false);
      setIsLoading(true);
      audioRef.current.src = station.url_resolved;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsLoading(false);
            if (!isPlaying) onTogglePlay(); // Ensure state sync
          })
          .catch((error) => {
            console.error("Playback failed:", error);
            setIsLoading(false);
            setLoadError(true);
          });
      }
    }
  }, [station]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
         if (playPromise !== undefined) {
             playPromise.catch(() => { /* Auto-play policy handled in src change */ });
         }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  if (!station) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 p-4 z-50 transition-all duration-500 ease-in-out translate-y-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Station Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded bg-indigo-600 flex items-center justify-center shrink-0 overflow-hidden relative group">
             {station.favicon ? (
                 <img src={station.favicon} alt="logo" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
             ) : (
                 <Radio className="text-white w-6 h-6" />
             )}
             {isLoading && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                     <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                 </div>
             )}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-white font-bold text-lg truncate leading-tight">{station.name}</h3>
            <p className="text-gray-400 text-sm truncate">{station.country} • {station.tags || 'Variety'}</p>
            {loadError && <span className="text-red-400 text-xs">Stream unavailable. Try another.</span>}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 focus:outline-none"
          >
            {isPlaying && !isLoading ? <Pause fill="black" /> : <Play fill="black" className="ml-1" />}
          </button>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center gap-2 w-32">
           <button onClick={() => onVolumeChange(volume === 0 ? 0.5 : 0)} className="text-gray-400 hover:text-white">
             {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
           </button>
           <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
           />
        </div>
        
        <audio 
            ref={audioRef} 
            crossOrigin="anonymous"
            onError={() => { setLoadError(true); setIsLoading(false); }}
            onPlaying={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

export default RadioPlayer;
