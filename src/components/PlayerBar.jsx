import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, Heart, Shuffle, Repeat, Mic2, ListMusic, 
  Maximize2,
} from 'lucide-react';


const formatTime = (ms) => {
  if (!ms) return "0:00";
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const PlayerBar = ({ currentTrack, isPlaying, progress, onControl, defaultAlbumArt }) => (
    <footer className="h-24 bg-black flex items-center justify-between px-4 shrink-0 border-t border-white/5">
      {/* 곡 정보 */}
      <div className="w-[380px] flex items-center gap-4 overflow-hidden shrink-0">
        {currentTrack && (
          <>
            <img src={currentTrack.cover || defaultAlbumArt} className="w-16 h-16 rounded shadow-xl shrink-0" alt="f" />
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-bold truncate text-white">{currentTrack.title}</span>
              <span className="text-xs text-gray-400 truncate">{currentTrack.artist}</span>
            </div>
            <Heart size={20} className="text-spotify ml-2 shrink-0" fill="currentColor" />
          </>
        )}
      </div>
  
      {/* 재생 컨트롤 */}
      <div className="flex flex-col items-center gap-2 w-full max-w-[40%] px-4">
        <div className="flex items-center gap-6 text-gray-400">
          <Shuffle size={18} className="hover:text-white cursor-pointer" />
          <SkipBack size={26} fill="currentColor" className="hover:text-white cursor-pointer" onClick={() => onControl("previous", "POST")} />
          <div className="bg-white p-2.5 rounded-full hover:scale-105 active:scale-95 cursor-pointer text-black" onClick={() => onControl(isPlaying ? "pause" : "play")}>
            {isPlaying ? <Pause fill="black" size={26} /> : <Play fill="black" size={26} className="ml-1" />}
          </div>
          <SkipForward size={26} fill="currentColor" className="hover:text-white cursor-pointer" onClick={() => onControl("next", "POST")} />
          <Repeat size={18} className="hover:text-white cursor-pointer" />
        </div>
        <div className="w-full flex items-center gap-2 text-[11px] text-gray-500">
          <span className="w-10 text-right font-medium">{formatTime(progress)}</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full" 
              style={{ width: `${currentTrack ? Math.min((progress / currentTrack.duration) * 100, 100) : 0}%` }}
            ></div>
          </div>
          <span className="w-10 font-medium">{formatTime(currentTrack?.duration)}</span>
        </div>
      </div>
  
      {/* 볼륨 및 기타 */}
      <div className="w-[380px] flex items-center justify-end gap-5 shrink-0 pr-4">
        <Mic2 size={18} className="text-gray-400 hover:text-white cursor-pointer" />
        <ListMusic size={18} className="text-gray-400 hover:text-white cursor-pointer" />
        <div className="flex items-center gap-2 group w-32">
          <Volume2 size={20} className="text-gray-400" />
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative">
            <div className="w-2/3 h-full bg-white/60 group-hover:bg-spotify"></div>
          </div>
        </div>
        <Maximize2 size={18} className="text-gray-400 hover:text-white cursor-pointer" />
      </div>
    </footer>
  );

  export default PlayerBar;