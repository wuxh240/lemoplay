import { useState, useRef, useCallback } from "react";
import { DramaCard } from "./DramaCard";

const FIXED_COVER_URL = "https://img.freepik.com/free-vector/blue-circuit-board-background_1150-44787.jpg";

const dramaData = [
  {
    id: 1,
    title: "Rainy Night Encounter",
    subtitle: "A lonely cat finds warmth on a rainy night in the park",
    coverImage: FIXED_COVER_URL,
    type: "Emotional",
    views: "1.2K",
    likes: 345,
    comments: 28,
    isFree: true,
    vid: "30156344c0af71f1b1d25067d0c00102",
    videoUrl: "",
  },
  {
    id: 2,
    title: "Forbidden Love",
    subtitle: "A passionate romance that defies all odds in the heart of Manhattan",
    coverImage: FIXED_COVER_URL,
    type: "Romance",
    views: "12.5K",
    likes: 2340,
    comments: 156,
    isFree: true,
  },
  {
    id: 3,
    title: "Dark Secrets",
    subtitle: "When the past comes knocking, no one is safe from the truth",
    coverImage: FIXED_COVER_URL,
    type: "Thriller",
    views: "8.9K",
    likes: 1890,
    comments: 203,
    isFree: true,
  },
  {
    id: 4,
    title: "Golden Empire",
    subtitle: "Power, wealth, and betrayal in the world of high society",
    coverImage: FIXED_COVER_URL,
    type: "Drama",
    views: "15.2K",
    likes: 3120,
    comments: 287,
    isFree: true,
  },
  {
    id: 5,
    title: "Corporate Wars",
    subtitle: "In the boardroom, loyalty is a luxury nobody can afford",
    coverImage: FIXED_COVER_URL,
    type: "Business",
    views: "6.7K",
    likes: 1450,
    comments: 98,
    isFree: false,
  },
  {
    id: 6,
    title: "Sunset Dreams",
    subtitle: "Sometimes letting go is the hardest thing to do",
    coverImage: FIXED_COVER_URL,
    type: "Emotional",
    views: "10.3K",
    likes: 2670,
    comments: 342,
    isFree: false,
  },
  {
    id: 7,
    title: "Midnight Gala",
    subtitle: "Behind every smile lies a story waiting to be told",
    coverImage: FIXED_COVER_URL,
    type: "Social",
    views: "9.1K",
    likes: 2100,
    comments: 178,
    isFree: false,
  },
  {
    id: 8,
    title: "Hidden Agenda",
    subtitle: "Every alliance has a price, every friendship has an expiration",
    coverImage: FIXED_COVER_URL,
    type: "Suspense",
    views: "7.8K",
    likes: 1920,
    comments: 145,
    isFree: false,
  },
  {
    id: 9,
    title: "Royal Scandal",
    subtitle: "When crown meets commoner, chaos ensues",
    coverImage: FIXED_COVER_URL,
    type: "Romance",
    views: "11.4K",
    likes: 2890,
    comments: 267,
    isFree: false,
  },
  {
    id: 10,
    title: "Last Chance",
    subtitle: "One final shot at redemption before it's too late",
    coverImage: FIXED_COVER_URL,
    type: "Drama",
    views: "5.6K",
    likes: 1340,
    comments: 89,
    isFree: false,
  },
  {
    id: 11,
    title: "Final Reckoning",
    subtitle: "The truth will set you free, or destroy everything you love",
    coverImage: FIXED_COVER_URL,
    type: "Thriller",
    views: "13.2K",
    likes: 3450,
    comments: 412,
    isFree: false,
  },
];

export function DramaFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const isScrolling = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY.current === null || isScrolling.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      if (Math.abs(deltaY) > 50) {
        isScrolling.current = true;
        if (deltaY > 0 && currentIndex < dramaData.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else if (deltaY < 0 && currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
        setTimeout(() => {
          isScrolling.current = false;
        }, 300);
      }

      touchStartY.current = null;
    },
    [currentIndex]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isScrolling.current) return;

      if (e.deltaY > 0 && currentIndex < dramaData.length - 1) {
        isScrolling.current = true;
        setCurrentIndex((prev) => prev + 1);
        setTimeout(() => {
          isScrolling.current = false;
        }, 300);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        isScrolling.current = true;
        setCurrentIndex((prev) => prev - 1);
        setTimeout(() => {
          isScrolling.current = false;
        }, 300);
      }
    },
    [currentIndex]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-background pt-16 pb-24 px-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div className="max-w-md mx-auto space-y-6">
        {dramaData.map((drama, index) => (
          <div
            key={drama.id}
            className="transition-opacity duration-300"
            style={{
              opacity: index === currentIndex ? 1 : 0.6,
            }}
          >
            <DramaCard {...drama} episodeNumber={drama.id} />
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        {dramaData.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex ? "bg-primary scale-125" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
