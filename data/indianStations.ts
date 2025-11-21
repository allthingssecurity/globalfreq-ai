import { RadioStation } from '../types';

export const INDIAN_STATE_OPTIONS = [
  { value: 'all', label: 'All India (Top picks)' },
  { value: 'Karnataka', label: 'Karnataka • Bengaluru' },
  { value: 'Maharashtra', label: 'Maharashtra • Mumbai/Pune' },
  { value: 'Delhi', label: 'Delhi NCR' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu • Chennai' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'West Bengal', label: 'West Bengal • Kolkata' },
  { value: 'Telangana', label: 'Telangana • Hyderabad' },
];

const buildStation = (
  stationuuid: string,
  name: string,
  url: string,
  state: string,
  tags: string
): RadioStation => ({
  stationuuid,
  name,
  url,
  url_resolved: url,
  homepage: '',
  tags,
  country: 'India',
  countrycode: 'IN',
  state,
  favicon: '',
  votes: 0,
  codec: 'AAC',
  bitrate: 128,
});

export const INDIAN_STATE_PRESETS: Record<string, RadioStation[]> = {
  all: [
    buildStation(
      'in-karnataka-radiosuno-melody',
      'Radio Mirchi 95 Bengaluru',
      'https://27143.live.streamtheworld.com:443/RADIO_SUNO_MELODY_S06.mp3',
      'Karnataka',
      'bollywood,kannada,mirchi,95'
    ),
    buildStation(
      'in-kerala-digital-malayali',
      'Radio Digital Malayali',
      'https://radio.digitalmalayali.in/listen/stream/radio.mp3',
      'Kerala',
      'malayalam,indie'
    ),
    buildStation(
      'in-karnataka-sandesh',
      'Sandesh Radio',
      'https://sandeshradio2017.radioca.st/;',
      'Karnataka',
      'hindustani,indian classical music'
    ),
  ],
  Karnataka: [
    buildStation(
      'in-karnataka-radiosuno-melody',
      'Radio Mirchi 95 Bengaluru',
      'https://27143.live.streamtheworld.com:443/RADIO_SUNO_MELODY_S06.mp3',
      'Karnataka',
      'bollywood,kannada,mirchi,95'
    ),
    buildStation(
      'in-karnataka-sandesh',
      'Sandesh Radio',
      'https://sandeshradio2017.radioca.st/;',
      'Karnataka',
      'hindustani,indian classical music'
    ),
  ],
  Maharashtra: [],
  Delhi: [],
  'Tamil Nadu': [],
  Kerala: [
    buildStation(
      'in-kerala-digital-malayali',
      'Radio Digital Malayali',
      'https://radio.digitalmalayali.in/listen/stream/radio.mp3',
      'Kerala',
      'malayalam,indie'
    ),
  ],
  'West Bengal': [],
  Telangana: [],
};
