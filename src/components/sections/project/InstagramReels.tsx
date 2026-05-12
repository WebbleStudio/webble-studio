"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";
import AnimatedStaggerChildren from "@/components/animations/AnimatedStaggerChildren";

interface ReelItem {
  video: string;
  thumbnail: string;
  instagramUrl: string;
}

interface InstagramReelsProps {
  reels: ReelItem[];
  className?: string;
}

const ActiveVideoContext = createContext<{ play: (v: HTMLVideoElement) => void }>({
  play: () => {},
});

function ReelCard({ video, thumbnail, instagramUrl }: ReelItem) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const { play } = useContext(ActiveVideoContext);

  function handlePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      play(v);
      v.play();
      setPlaying(true);
    }
  }

  return (
    <div className="group relative w-full overflow-hidden rounded-[4px] bg-black">
      <div className="aspect-[9/16] w-full">
        <video
          ref={videoRef}
          src={video}
          poster={thumbnail}
          playsInline
          loop
          preload="none"
          onClick={handlePlay}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          className="h-full w-full cursor-pointer object-cover"
        />

        {!playing && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Play video"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform duration-300 hover:scale-110">
              <svg viewBox="0 0 24 24" fill="white" className="ml-1 h-6 w-6">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md transition-colors duration-300 hover:bg-white/25"
          aria-label="View on Instagram"
        >
          <svg viewBox="0 0 24 24" fill="white" className="h-3.5 w-3.5">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          <span className="font-sans text-[10px] font-medium text-white md:text-[11px]">
            Instagram
          </span>
        </a>
      </div>
    </div>
  );
}

export default function InstagramReels({ reels, className = "" }: InstagramReelsProps) {
  const activeRef = useRef<HTMLVideoElement | null>(null);

  const play = useCallback((v: HTMLVideoElement) => {
    if (activeRef.current && activeRef.current !== v) {
      activeRef.current.pause();
    }
    activeRef.current = v;
  }, []);

  return (
    <ActiveVideoContext.Provider value={{ play }}>
      <div className={`mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px] ${className}`}>
        <AnimatedStaggerChildren
          className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4"
          stagger={0.12}
        >
          {reels.map((reel) => (
            <ReelCard key={reel.video} {...reel} />
          ))}
        </AnimatedStaggerChildren>
      </div>
    </ActiveVideoContext.Provider>
  );
}
