// mockData.js
export const tracks = [
  {
    id: 'track_01', 
    title: 'Brisa de Verão', 
    artist: 'Banda Maré',
    artwork: 'https://picsum.photos/id/10/200/200',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 
  },
  {
    id: 'track_02',
    title: 'Oceano Profundo',
    artist: 'Indie Rock',
    artwork: 'https://picsum.photos/id/20/200/200',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', // ATUALIZADO: Song 5 inserida aqui
  },
  {
    id: 'track_03',
    title: 'Foco e Estudo',
    artist: 'Indie Rock',
    artwork: 'https://picsum.photos/id/30/200/200',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // NOVO: Track 3 adicionada aqui
  },
];

export const recommendedAlbums = [
  { 
    id: 'album_01', 
    title: 'Indie Vibes', 
    type: 'Playlist', 
    image: 'https://picsum.photos/id/1025/200/200',
    songs: [tracks[0], tracks[1]] 
  },
  { 
    id: 'album_02', 
    title: 'Vibe Musical', 
    type: 'Playlist', 
    image: 'https://picsum.photos/id/1032/200/200',
    songs: [tracks[0]] 
  },
  { 
    id: 'album_03', 
    title: 'Foco e Estudo', 
    type: 'Playlist', 
    image: 'https://picsum.photos/id/1010/200/200',
    songs: [tracks[2]] // ATUALIZADO: Agora toca diretamente a track_03 de foco
  },
];

export const friendsActivity = [
  { id: 'friend_01', name: 'Lucas S.', listening: 'Brisa de Verão', avatar: 'https://i.pravatar.cc/150?u=lucas' },
  { id: 'friend_02', name: 'Camila', listening: 'Lo-Fi Chill', avatar: 'https://i.pravatar.cc/150?u=camila' },
  { id: 'friend_03', name: 'Pedro', listening: 'Oceano Profundo', avatar: 'https://i.pravatar.cc/150?u=pedro' },
];