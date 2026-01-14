import React from 'react';
import { 
  Play, Music, Heart, Clock, MoreHorizontal,
} from 'lucide-react';

// 시간을 포맷팅하는 유틸리티 함수
const formatTime = (ms) => {
  if (!ms) return "0:00";
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};



const MainContent = ({ selectedPlaylist, tracks, currentTrack, onScroll, mainRef, defaultAlbumArt, customAlbums }) => {
  // 1. 현재 보여줄 데이터 소스 결정 (선택된 플레이리스트만 표시)
  const displayPlaylist = selectedPlaylist;

  return (
    <main ref={mainRef} onScroll={onScroll} className="flex-1 bg-[#121212] rounded-xl overflow-y-auto relative spotify-gradient">
      {displayPlaylist ? (
        <div className="flex flex-col">
          {/* 2. 헤더 부분: 그라데이션과 함께 웅장하게 표시 */}
          <div className="p-8 pt-12 flex items-end gap-6 bg-gradient-to-b from-[#2a2a2a] to-[#121212]/40">
            {displayPlaylist.images?.[0]?.url ? (
              <img 
                src={displayPlaylist.images[0].url} 
                className="w-56 h-56 shadow-[0_8px_40px_rgba(0,0,0,0.5)] rounded-sm shrink-0 object-cover transition-transform duration-500 hover:scale-105" 
                alt="cover"
              />
            ) : (
              <img 
                src={defaultAlbumArt} 
                className="w-56 h-56 shadow-[0_8px_40px_rgba(0,0,0,0.5)] rounded-sm shrink-0 object-cover transition-transform duration-500 hover:scale-105" 
                alt="cover"
              />
            )}
            <div className="flex flex-col gap-3 min-w-0 flex-1 h-56 justify-end pb-3">
              <span className="text-[16px] font-black uppercase tracking-widest text-gray-300">
                {selectedPlaylist ? "플레이리스트" : "나우 플레잉"}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-snug mb-0">
                {displayPlaylist.name}
              </h1>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <span>{displayPlaylist.owner.display_name}</span>
                {tracks.length > 0 && (
                  <span className="text-gray-400">• {tracks.length}곡</span>
                )}
              </div>
            </div>
          </div>

          {/* 3. 리스트 부분 */}
          <div className="px-6 py-6 bg-black/20 backdrop-blur-sm min-h-screen">
            <div className="flex items-center gap-8 mb-6">
              <button className="bg-[#1db954] w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition shadow-xl active:scale-95">
                <Play fill="black" size={28} className="ml-1 text-black" />
              </button>
              <Heart size={30} className="text-gray-400 hover:text-[#1db954] cursor-pointer transition-colors" />
              <MoreHorizontal size={30} className="text-gray-400 hover:text-white cursor-pointer" />
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="text-[11px] uppercase tracking-widest text-gray-500 border-b border-white/10">
                <tr>
                  <th className="p-3 w-12 text-center font-normal">#</th>
                  <th className="p-3 font-normal">제목</th>
                  <th className="p-3 font-normal hidden sm:table-cell">앨범</th>
                  <th className="p-3 text-right pr-6 font-normal w-24"><Clock size={16} className="inline"/></th>
                </tr>
              </thead>
              <tbody className="before:block before:h-4">
                {tracks.map((item, i) => {
                  const track = item.track;
                  if (!track) return null;
                  const isActive = track.uri === currentTrack?.uri;
                  const custom = customAlbums[track.uri];
                  
                  return (
                    <tr key={`${track.id}-${i}`} className="group hover:bg-white/10 transition-colors duration-200">
                      <td className="p-3 text-center text-gray-400">
                        {isActive ? (
                          <div className="flex items-center justify-center gap-0.5 h-4">
                            <div className="w-1 bg-[#1db954] animate-[bounce_1s_infinite_0ms]" style={{height: '60%'}}></div>
                            <div className="w-1 bg-[#1db954] animate-[bounce_1s_infinite_200ms]" style={{height: '100%'}}></div>
                            <div className="w-1 bg-[#1db954] animate-[bounce_1s_infinite_400ms]" style={{height: '80%'}}></div>
                          </div>
                        ) : (
                          <span className="group-hover:hidden">{i + 1}</span>
                        )}
                        {!isActive && <Play size={12} className="hidden group-hover:inline-block text-white" fill="white" />}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={track.album?.images?.[track.album.images.length-1]?.url || defaultAlbumArt} 
                            className="w-10 h-10 rounded shadow-sm" 
                            alt="t" 
                          />
                          <div className="flex flex-col min-w-0">
                            <span className={`text-[15px] font-bold truncate ${isActive ? 'text-[#1db954]' : 'text-white'}`}>
                              {track.name}
                            </span>
                            <span className="text-[13px] text-gray-400 truncate group-hover:text-white transition-colors">
                              {custom?.artist || track.artists.map(a => a.name).join(", ")}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-[13px] text-gray-400 hidden sm:table-cell group-hover:text-white transition-colors">
                        {custom?.album || track.album?.name}
                      </td>
                      <td className="p-3 text-right pr-6 text-[13px] text-gray-400 group-hover:text-white transition-colors">
                        {formatTime(track.duration_ms)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 아무것도 재생 중이지 않고 선택된 플레이리스트도 없을 때만 표시 */
        <div className="h-full flex flex-col items-center justify-center gap-6 text-white/20">
          <Music size={100} strokeWidth={1} />
          <p className="text-sm font-bold tracking-widest uppercase">음악을 선택하거나 재생하세요</p>
        </div>
      )}
    </main>
  );
};

export default MainContent;