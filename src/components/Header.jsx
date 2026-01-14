import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Search, User, Bell
} from 'lucide-react';

const Header = ({ user }) => (
    <header className="h-16 flex items-center justify-between px-2 shrink-0">
      <div className="w-[300px]"></div>
      <div className="flex-1 flex items-center justify-center gap-4">
        <div className="nav-item text-white shrink-0"><Home size={24}/></div>
        <div className="search-container">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="무엇을 듣고 싶으세요?" className="search-input pr-12" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 w-[300px] pr-2">
        <div className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"><Bell size={22} /></div>
        <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-1.5 pr-4 rounded-full cursor-pointer transition border border-white/5">
          {user?.images?.[0]?.url ? (
            <img src={user.images[0].url} className="w-10 h-10 rounded-full border border-white/10" alt="u" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"><User size={20}/></div>
          )}
          <span className="text-[15px] font-black">{user?.display_name || "사용자"}</span>
        </div>
      </div>
    </header>
  );

export default Header;