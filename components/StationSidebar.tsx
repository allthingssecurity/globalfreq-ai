import React from 'react';
import { RadioStation, AIInsightData } from '../types';
import { Play, Music, Info, Globe } from 'lucide-react';

interface StationSidebarProps {
  countryName: string | null;
  stations: RadioStation[];
  isLoading: boolean;
  currentStation: RadioStation | null;
  onStationSelect: (station: RadioStation) => void;
  aiInsight: AIInsightData | null;
  isInsightLoading: boolean;
  djIntro: string | null;
}

const StationSidebar: React.FC<StationSidebarProps> = ({
  countryName,
  stations,
  isLoading,
  currentStation,
  onStationSelect,
  aiInsight,
  isInsightLoading,
  djIntro
}) => {
  if (!countryName) {
    return (
      <div className="absolute top-24 left-6 w-80 lg:w-96 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-left z-40 shadow-2xl shadow-black/60">
        <Globe className="w-12 h-12 text-indigo-500 mx-auto mb-4 opacity-80" />
        <h2 className="text-xl font-bold mb-2 text-white text-center tracking-tight">Welcome to GlobalFreq AI</h2>
        <p className="text-gray-400 text-sm text-center">
          Spin the globe and tap any country to instantly jump into its live radio soundscape.
        </p>
        <div className="mt-4 p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/30">
            <p className="text-indigo-300 text-xs font-mono text-center">
              TIP: Try <span className="font-semibold text-white">Explore India</span> for a curated first experience.
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-24 left-6 w-[320px] lg:w-[380px] max-h-[calc(100vh-160px)] flex flex-col gap-4 z-40 pointer-events-none">
        {/* AI Insight Card */}
        <div className="bg-black/80 backdrop-blur-xl border border-indigo-500/40 rounded-2xl p-5 shadow-2xl shadow-black/70 pointer-events-auto transition-all duration-300">
            <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 rounded-md">
                     <Music size={16} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">{countryName}</h2>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-indigo-300 bg-indigo-950/60 px-2 py-1 rounded-full border border-indigo-500/40">
                  <Info size={10} /> AI Insight
                </span>
            </div>

            {isInsightLoading ? (
                <div className="animate-pulse space-y-2">
                    <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-700 rounded w-5/6"></div>
                </div>
            ) : aiInsight ? (
                <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">{aiInsight.summary}</p>
                    <div className="flex flex-wrap gap-2">
                        {aiInsight.popularGenres.slice(0, 4).map(g => (
                            <span key={g} className="text-[10px] uppercase font-bold px-2 py-1 bg-white/10 rounded-full text-indigo-200 border border-white/5">
                                {g}
                            </span>
                        ))}
                    </div>
                    <div className="mt-2 p-2 bg-indigo-950/50 rounded border-l-2 border-indigo-500">
                         <p className="text-xs text-indigo-200 italic">"{aiInsight.musicCulture}"</p>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-400">Select a station to analyze local vibes...</p>
            )}
            
            {djIntro && (
                <div className="mt-3 pt-3 border-t border-white/10 animate-in slide-in-from-left-2 fade-in duration-500">
                    <p className="text-xs text-green-400 font-mono mb-1">AI DJ LIVE •••</p>
                    <p className="text-sm text-white font-medium">"{djIntro}"</p>
                </div>
            )}
        </div>

        {/* Station List */}
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col pointer-events-auto flex-1 min-h-0">
            <div className="p-4 border-b border-white/10 bg-white/5/10">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <RadioIcon /> Live Stations <span className="text-xs font-normal text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded-full ml-auto">{stations.length}</span>
                </h3>
            </div>
            
            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : stations.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">
                        No stations found for this region. Try another!
                    </div>
                ) : (
                    stations.map((station) => {
                        const isCurrent = currentStation?.stationuuid === station.stationuuid;
                        return (
                            <button
                                key={station.stationuuid}
                                onClick={() => onStationSelect(station)}
                                className={`w-full text-left p-3 rounded-lg transition-all duration-200 group flex items-center gap-3
                                    ${isCurrent 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                                        : 'hover:bg-white/10 text-gray-300 hover:text-white'
                                    }
                                `}
                            >
                                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 transition-colors ${isCurrent ? 'bg-indigo-700' : 'bg-gray-800 group-hover:bg-gray-700'}`}>
                                    {isCurrent ? <div className="w-2 h-2 bg-white rounded-full animate-ping" /> : <Play size={12} />}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">{station.name}</p>
                                    <p className={`text-xs truncate ${isCurrent ? 'text-indigo-200' : 'text-gray-500'}`}>
                                        {station.tags ? station.tags.split(',').slice(0, 2).join(', ') : 'Various'}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    </div>
  );
};

const RadioIcon = () => (
    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

export default StationSidebar;
