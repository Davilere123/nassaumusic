// ─────────────────────────────────────────────
//  mockData.js
//  Dados de exemplo. Quando o back-end (Firebase)
//  estiver pronto, esses dados vêm do Firestore.
// ─────────────────────────────────────────────

export const MOCK_TRACKS = [
  {
    id: '1',
    title: 'SoundHelix Song 1',
    artist: 'SoundHelix',
    album: 'Demo Vol. 1',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artwork: null,
    duration: 372,
  },
  {
    id: '2',
    title: 'SoundHelix Song 2',
    artist: 'SoundHelix',
    album: 'Demo Vol. 1',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    artwork: null,
    duration: 291,
  },
  {
    id: '3',
    title: 'SoundHelix Song 3',
    artist: 'SoundHelix',
    album: 'Demo Vol. 2',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    artwork: null,
    duration: 445,
  },
  {
    id: '4',
    title: 'SoundHelix Song 4',
    artist: 'SoundHelix',
    album: 'Demo Vol. 2',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    artwork: null,
    duration: 338,
  },
];

export const MOCK_FRIENDS = [
  {
    id: 'f1',
    name: 'Ana Lima',
    avatar: null,
    listeningTo: MOCK_TRACKS[0],
    playlists: [
      { id: 'p1', name: 'Favoritas', trackCount: 12, tracks: MOCK_TRACKS.slice(0, 2) },
      { id: 'p2', name: 'Para Relaxar', trackCount: 8, tracks: MOCK_TRACKS.slice(1, 3) },
    ],
  },
  {
    id: 'f2',
    name: 'Carlos Melo',
    avatar: null,
    listeningTo: null,
    playlists: [
      { id: 'p3', name: 'Treino', trackCount: 20, tracks: MOCK_TRACKS.slice(2, 4) },
    ],
  },
  {
    id: 'f3',
    name: 'Bia Souza',
    avatar: null,
    listeningTo: MOCK_TRACKS[2],
    playlists: [
      { id: 'p4', name: 'Noite', trackCount: 15, tracks: MOCK_TRACKS },
    ],
  },
];

export const MOCK_PLAYLISTS = [
  { id: 'my1', name: 'Curtidas', trackCount: 4, tracks: MOCK_TRACKS, pinned: true },
  { id: 'my2', name: 'Minha Viagem', trackCount: 2, tracks: MOCK_TRACKS.slice(0, 2), pinned: false },
];

export const GENRES = ['Pop', 'Rock', 'Rap', 'Sertanejo', 'Funk', 'Samba', 'Reggae', 'Forró'];