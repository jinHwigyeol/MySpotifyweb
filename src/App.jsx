import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Search, Library, Play, Pause, SkipBack, SkipForward, 
  Volume2, Music, PlusSquare, Clock, User, Bell
} from 'lucide-react';

import Header from './components/Header';
import MainContent from './components/MainContent';
import SidebarRight from './components/SidebarRight';
import SidebarLeft from './components/SidebarLeft';
import PlayerBar from './components/PlayerBar';


// ==========================================
// 유틸리티 및 상수 (Shared Logic)
// ==========================================
const getEnvVar = (name) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[name] || "";
    }
  } catch (e) { return ""; }
  return "";
};



const getFixedOrigin = () => {
  const { protocol, hostname, port } = window.location;
  if (hostname === 'localhost') return `${protocol}//127.0.0.1${port ? `:${port}` : ''}`;
  return window.location.origin;
};

const CLIENT_ID = getEnvVar('VITE_SPOTIFY_CLIENT_ID');
const CLIENT_SECRET = getEnvVar('VITE_SPOTIFY_CLIENT_SECRET');
const REDIRECT_URI = `${getFixedOrigin()}/.netlify/functions/callback`;

const DEFAULT_ALBUM_ART = "/img/i1409981040.png";

// 커스텀 앨범 정보 (URI를 키로 하여 앨범 이름과 아티스트를 지정할 수 있음)
const CUSTOM_ALBUMS = {
  "spotify:local:::%5B%EC%BC%80%EC%9D%B8%5D+%ED%97%88%ED%97%88%EC%8B%A4%EC%8B%A4:188": { album: '뭉탱이', artist: '케인' },
  "spotify:local:::God+Chang+Seop+%28%EC%8B%A0%EC%B0%BD%EC%84%AD%29+-+%EB%B0%94%EB%A1%9C+%EB%A6%AC%EB%B6%80%ED%8A%B8+%EC%A0%95%EC%83%81%ED%99%94:140": { album: '바로 리부트 정상화', artist: '신창섭' }
};


const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_API = "https://accounts.spotify.com/api/token";
const SCOPES = [
  "user-read-currently-playing", 
  "user-read-playback-state", 
  "user-modify-playback-state", 
  "user-read-private", 
  "user-library-read", 
  "playlist-read-private"
].join("%20");


// ==========================================
// 메인 App 컴포넌트
// ==========================================
export default function App() {
  const [token, setToken] = useState(""); 
  const [currentTrack, setCurrentTrack] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [currentPlayingPlaylistId, setCurrentPlayingPlaylistId] = useState(null);
  const [playingPlaylistDetails, setPlayingPlaylistDetails] = useState(null);
  const [playingPlaylistTracks, setPlayingPlaylistTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [user, setUser] = useState(null);

  const mainContentRef = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const localToken = window.localStorage.getItem("token");
    if (code) exchangeCodeForToken(code);
    else if (localToken) setToken(localToken);
  }, []);

  const exchangeCodeForToken = async (code) => {
    const response = await fetch(SPOTIFY_TOKEN_API, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`) 
      },
      body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI })
    });
    const data = await response.json();
    if (data.access_token) {
      window.localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      window.history.pushState({}, null, "/");
    }
  };

  const fetchWebApi = async (endpoint, method = "GET", body = null) => {
    const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null
    });
    if (res.status === 401) {
      window.localStorage.removeItem("token");
      setToken("");
      return null;
    }
    return res.status === 204 ? null : await res.json();
  };

  const loadUserData = async () => {
    const profile = await fetchWebApi("me");
    if (profile) setUser(profile);
    const plData = await fetchWebApi("me/playlists?limit=50");
    if (plData) setPlaylists(plData.items);
    // Do not auto-select the first playlist to avoid always highlighting it.
    // updatePlaybackState will run after loading and sync periodically.
    updatePlaybackState();
  };

  const fetchPlaylistDetails = async (id) => {
    const data = await fetchWebApi(`playlists/${id}`);
    if (data) {
      setSelectedPlaylist(data);
      setPlaylistTracks(data.tracks.items);
      if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
    }
  };

  const fetchPlayingPlaylistDetails = async (id) => {
    if (!id) return setPlayingPlaylistDetails(null);
    const data = await fetchWebApi(`playlists/${id}`);
    if (data) {
      setPlayingPlaylistDetails(data);
      setPlayingPlaylistTracks(data.tracks.items);
    }
  };

  const updatePlaybackState = async () => {
    const state = await fetchWebApi("me/player/currently-playing");
    console.debug('updatePlaybackState -> context:', state?.context?.uri);
    if (state?.item) {
      console.log('Track URI:', state.item.uri); // URI 확인용
      const custom = CUSTOM_ALBUMS[state.item.uri];
      setCurrentTrack({
        id: state.item.id,
        title: state.item.name,
        artist: custom?.artist || state.item.artists.map(a => a.name).join(", "),
        album: custom?.album || state.item.album.name,
        cover: state.item.album.images[0]?.url,
        albumImage: state.item.album.images[1]?.url || DEFAULT_ALBUM_ART,
        uri: state.item.uri,
        duration: state.item.duration_ms
      });
      setIsPlaying(state.is_playing);
      setProgress(state.progress_ms);
      const contextUri = state.context?.uri;
      if (contextUri && contextUri.includes('playlist')) {
        const parts = contextUri.split(':');
        const pid = parts[parts.length - 1];
        console.debug('derived playing playlist id:', pid);
        setCurrentPlayingPlaylistId(pid);
      } else {
        console.debug('no playlist context in playback state');
        setCurrentPlayingPlaylistId(null);
      }
    }
  };

  useEffect(() => {
    if (currentPlayingPlaylistId && token) {
      // fetch details for display, but don't overwrite user's selectedPlaylist
      fetchPlayingPlaylistDetails(currentPlayingPlaylistId);
    } else {
      setPlayingPlaylistDetails(null);
      setPlayingPlaylistTracks([]);
    }
  }, [currentPlayingPlaylistId, token]);

  useEffect(() => {
    if (token) {
      loadUserData();
      const sync = setInterval(updatePlaybackState, 5000);
      return () => clearInterval(sync);
    }
  }, [token]);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => setProgress(p => p + 1000), 1000);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const handleControl = async (command, method = "PUT") => {
    await fetchWebApi(`me/player/${command}`, method);
    setTimeout(updatePlaybackState, 500);
  };

  if (!token) {
    const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPES}&show_dialog=true`;
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
        <Music size={80} className="text-[#1db954] mb-8 animate-pulse" />
        <h1 className="text-7xl font-black mb-12 tracking-tighter">GIGACHAD</h1>
        <a href={loginUrl} className="bg-[#1db954] text-black font-black py-4 px-12 rounded-full hover:scale-105 transition-all text-sm uppercase tracking-widest">
          AUTHENTICATE
        </a>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white p-2 gap-2 overflow-hidden font-sans">
      <Header user={user} />
      <div className="flex-1 flex gap-2 overflow-hidden">
        <SidebarLeft
          playlists={playlists}
          selectedPlaylist={selectedPlaylist}
          activePlaylistId={currentPlayingPlaylistId}
          onSelect={fetchPlaylistDetails}
        />
        <MainContent
          mainRef={mainContentRef}
          selectedPlaylist={selectedPlaylist || playingPlaylistDetails}
          tracks={selectedPlaylist ? playlistTracks : playingPlaylistTracks}
          currentTrack={currentTrack}
          defaultAlbumArt={DEFAULT_ALBUM_ART}
          customAlbums={CUSTOM_ALBUMS}
        />
        <SidebarRight currentTrack={currentTrack} defaultAlbumArt={DEFAULT_ALBUM_ART} />
      </div>
        <PlayerBar currentTrack={currentTrack} isPlaying={isPlaying} progress={progress} onControl={handleControl} defaultAlbumArt={DEFAULT_ALBUM_ART} />
    </div>
  );
}