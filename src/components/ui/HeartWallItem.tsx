
interface HeartWallItemProps {
  id: number;
  reasonText: string;
  isOpened: boolean;
  onClick: () => void;
}

export default function HeartWallItem({ id, reasonText, isOpened, onClick }: HeartWallItemProps) {
  return (
    <div 
      onClick={onClick}
      className="relative w-20 h-20 md:w-24 md:h-24 perspective-[1000px] cursor-pointer select-none hover-target"
    >
      {/* 3D Flippable card core */}
      <div
        className={`w-full h-full duration-700 transform-style-3d relative transition-transform ${
          isOpened ? 'rotate-y-180' : ''
        }`}
      >
        
        {/* FRONT CARD FACE (Pink heart with index number) */}
        <div className="absolute inset-0 w-full h-full bg-[#fdeef2]/5 hover:bg-[#fdeef2]/10 border border-white/5 rounded-2xl flex flex-col items-center justify-center shadow-md backface-hidden group hover:border-gold/30 hover:shadow-xl transition-all duration-300">
          
          {/* Symmetrical Heart Vector Shape */}
          <svg
            viewBox="0 0 24 24"
            className={`w-12 h-12 md:w-14 md:h-14 transition-all duration-500 ${
              isOpened 
                ? 'text-[#f0a2b1] opacity-40' 
                : 'text-love-red/25 group-hover:text-love-red/45 group-hover:scale-106'
            }`}
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>

          {/* Centered Numeric Badge overlay */}
          <span className="absolute text-[10px] md:text-[11px] font-sans font-bold text-gold tracking-tighter uppercase select-none pointer-events-none group-hover:scale-110 transition-transform">
            {id}
          </span>
          
          {/* Subtle Glow aura behind active cards */}
          <div className="absolute inset-2 rounded-xl bg-love-red/2 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
        </div>

        {/* BACK CARD FACE (Flipped gold frosted layout displaying text) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#faf6ee] to-[#f7ebd4] border border-gold/45 text-love-dark rounded-2xl shadow-xl p-2 flex items-center justify-center text-center backface-hidden rotate-y-180 overflow-hidden">
          <p className="text-[7.5px] md:text-[9.5px] leading-tight font-serif text-[#4e3a37] tracking-tight line-clamp-4 font-medium px-0.5 select-text">
            {reasonText}
          </p>
          
          {/* Tiny gold heart seal in the corner */}
          <span className="absolute bottom-1 right-1.5 text-[7px] text-love-red opacity-80 pointer-events-none">
            ❤️
          </span>
        </div>

      </div>
    </div>
  );
}
