import { RadioStation } from '../types';
import { INDIAN_STATE_PRESETS } from '../data/indianStations';

const API_BASE = 'https://de1.api.radio-browser.info/json/stations';

const dedupeStations = (stations: RadioStation[]): RadioStation[] => {
  const seen = new Set<string>();
  return stations.filter((station) => {
    const key = station.stationuuid || `${station.name}-${station.url_resolved}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const getStationsByCountry = async (countryCode: string): Promise<RadioStation[]> => {
  try {
    // We prefer HTTPS streams to avoid mixed content warnings
    const response = await fetch(
      `${API_BASE}/bycountrycodeexact/${countryCode}?limit=30&order=votes&reverse=true&hidebroken=true&is_https=true`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch stations');
    }
    const data = await response.json();
    if (countryCode === 'IN') {
      const curated = INDIAN_STATE_PRESETS['all'] || [];
      return dedupeStations([...curated, ...data]);
    }
    return data;
  } catch (error) {
    console.error("Radio API Error:", error);
    return [];
  }
};

export const getStationsByIndianState = async (state: string): Promise<RadioStation[]> => {
  try {
    const presets = INDIAN_STATE_PRESETS[state] || [];
    const params = new URLSearchParams({
      countrycode: 'IN',
      state,
      limit: '40',
      order: 'votes',
      reverse: 'true',
      hidebroken: 'true',
      is_https: 'true',
    });
    const response = await fetch(`${API_BASE}/search?${params.toString()}`);
    const apiData = response.ok ? await response.json() : [];
    return dedupeStations([...presets, ...(apiData || [])]);
  } catch (error) {
    console.error("Radio API Error:", error);
    return INDIAN_STATE_PRESETS[state] || [];
  }
};

export const getTopStations = async (): Promise<RadioStation[]> => {
  try {
    const response = await fetch(
      `${API_BASE}/topclick?limit=10&hidebroken=true&is_https=true`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Radio API Error:", error);
    return [];
  }
};
