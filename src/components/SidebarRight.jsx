import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, MoreHorizontal,
} from 'lucide-react';

const SidebarRight = ({ currentTrack, defaultAlbumArt }) => (
    <aside className="w-[380px] bg-[#121212] rounded-xl flex flex-col overflow-hidden shrink-0 border border-white/5">
      <div className="p-5 flex justify-between items-center border-b border-white/5">
        <span className="font-black text-lg uppercase tracking-widest text-spotify">현재 재생 중</span>
        <MoreHorizontal size={20} className="text-gray-400 hover:text-white cursor-pointer" />
      </div>
      <div className="p-6 flex flex-col gap-6 overflow-y-auto">
        {currentTrack ? (
          <>
            <img src={currentTrack.cover || defaultAlbumArt} className="w-full aspect-square object-cover rounded-xl shadow-2xl" alt="c" />
            <div className="flex flex-col gap-1 min-w-0">
              <h2 className="text-3xl font-black tracking-tighter truncate leading-tight">{currentTrack.title}</h2>
              <p className="text-gray-400 font-bold text-lg hover:text-white cursor-pointer">{currentTrack.artist}</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-4">앨범 정보</span>
              <div className="flex items-center gap-4">
                <img src={currentTrack.albumImage} className="w-12 h-12 rounded shrink-0" alt="album" />
                <span className="text-[15px] font-bold truncate text-gray-200">{currentTrack.album}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-20 py-40">
            <Music size={60} />
            <p className="mt-4 font-bold">재생 중인 곡이 없습니다</p>
          </div>
        )}
      </div>
    </aside>
  );

  export default SidebarRight;