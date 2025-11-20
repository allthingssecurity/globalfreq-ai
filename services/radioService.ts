import { RadioStation } from '../types';

const API_BASE = 'https://de1.api.radio-browser.info/json/stations';

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
    return data;
  } catch (error) {
    console.error("Radio API Error:", error);
    return [];
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
