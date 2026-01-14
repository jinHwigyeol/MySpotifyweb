import React from 'react';
import { 
  Library, PlusSquare,
} from 'lucide-react';

const SidebarLeft = ({ playlists, selectedPlaylist, activePlaylistId, onSelect }) => {
  // Step 1: 영어 우선 정렬 로직 적용 (English First)
  const sortedPlaylists = [...playlists].sort((a, b) => {
    // locale을 'en'으로 설정하여 영어를 우선순위에 둠
    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
  });

  return (
    <aside className="w-[380px] flex flex-col gap-2 shrink-0">
      <div className="bg-[#121212] flex-1 rounded-xl flex flex-col overflow-hidden">
        <div className="p-5 flex items-center justify-between text-gray-400 font-bold border-b border-white/5">
          <div className="flex items-center gap-3 hover:text-white cursor-pointer transition">
            <Library size={26}/> <span className="text-[17px]">내 라이브러리</span>
          </div>
          <PlusSquare size={22} className="hover:text-white cursor-pointer" />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sortedPlaylists.map(pl => {
            const isSelected = selectedPlaylist?.id === pl.id;
            const isPlaying = activePlaylistId === pl.id;
            return (
              <div
                key={pl.id}
                onClick={() => onSelect(pl.id)}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition ${isSelected ? 'bg-white/10' : 'hover:bg-[#1a1a1a]'}`}
              >
                <img 
                  src={pl.images?.[0]?.url || 'https://via.placeholder.com/150'} 
                  className="w-12 h-12 rounded shadow-lg object-cover" 
                  alt="playlist cover" 
                />
                <div className="flex flex-col min-w-0">
                  <span className={`text-[16px] font-bold truncate ${isPlaying ? 'text-[#1DB954]' : 'text-gray-200'}`}>
                    {pl.name}
                  </span>
                  <span className="text-[14px] text-gray-500 truncate">
                    플레이리스트 • {pl.owner.display_name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default SidebarLeft;