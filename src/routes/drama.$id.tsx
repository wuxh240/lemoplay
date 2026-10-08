import { createFileRoute, useRouter } from "@tanstack/react-router";
import { DramaHeader } from "@/components/DramaHeader";
import { DramaBottomNav } from "@/components/DramaBottomNav";
import { ArrowLeft, Heart, Share2, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const FIXED_COVER_URL = "https://img.freepik.com/free-vector/blue-circuit-board-background_1150-44787.jpg";

export const Route = createFileRoute("/drama/$id")({
  component: DramaDetail,
});

// Mock drama data - in real app this would come from API
const dramaData: Record<string, any> = {
  "1": {
    id: 1,
    title: "Rainy Night Encounter",
    type: "Emotional",
    coverImage: FIXED_COVER_URL,
    vid: "30156344c0af71f1b1d25067d0c00102",
    videoUrl: "",
    description: "A lonely cat finds warmth on a rainy night in the park",
    episodes: 1,
    currentEpisode: 1,
    views: "1.2K",
    rating: 4.8,
  },
  "2": {
    id: 2,
    title: "Forbidden Love",
    type: "Romance",
    coverImage: FIXED_COVER_URL,
    description: "A passionate love story that defies all odds. Two souls from different worlds find themselves drawn together despite the obstacles standing in their way.",
    episodes: 10,
    currentEpisode: 3,
    views: "12.5K",
    rating: 4.8,
  },
  "3": {
    id: 3,
    title: "Golden Empire",
    type: "Drama",
    coverImage: FIXED_COVER_URL,
    description: "Power, wealth, and betrayal in the world of high society. Follow the rise and fall of a business empire built on ambition and sacrifice.",
    episodes: 12,
    currentEpisode: 5,
    views: "15.2K",
    rating: 4.9,
  },
  "4": {
    id: 4,
    title: "Corporate Wars",
    type: "Business",
    coverImage: FIXED_COVER_URL,
    description: "The cutthroat world of corporate competition where only the strongest survive. Watch as rivals clash in a battle for market dominance.",
    episodes: 10,
    currentEpisode: 2,
    views: "6.7K",
    rating: 4.5,
  },
  "5": {
    id: 5,
    title: "Sunset Dreams",
    type: "Emotional",
    coverImage: FIXED_COVER_URL,
    description: "A heartwarming tale of dreams, loss, and redemption. Experience the emotional journey of characters finding hope in unexpected places.",
    episodes: 10,
    currentEpisode: 2,
    views: "10.3K",
    rating: 4.7,
  },
  "6": {
    id: 6,
    title: "Midnight Gala",
    type: "Social",
    coverImage: FIXED_COVER_URL,
    description: "Behind the glamour of high-society events lies a web of secrets and scandals. Dive into the exclusive world where appearances are everything.",
    episodes: 8,
    currentEpisode: 1,
    views: "9.1K",
    rating: 4.4,
  },
};

function DramaDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { t } = useI18n();
  const [isFavorite, setIsFavorite] = useState(false);

  const drama = dramaData[id];

  const handleBack = () => {
    console.log("[DramaDetail] Navigating back");
    router.history.back();
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "已取消收藏" : "已添加到收藏");
  };

  const handleShare = async () => {
    console.log("[DramaDetail] Sharing drama");
    const shareData = {
      title: drama.title,
      text: `${t("share_to")}《${drama.title}》`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("[DramaDetail] Shared successfully via Web Share API");
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t("link_copied"));
      }
    } catch (error) {
      console.error("[DramaDetail] Share failed:", error);
      toast.error(t("share_failed"));
    }
  };

  if (!drama) {
    return (
      <div className="relative w-full h-screen bg-background overflow-hidden">
        <DramaHeader />
        <div className="pt-16 px-4 flex items-center justify-center h-full">
          <p className="text-white">剧集不存在</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <DramaHeader />

      {/* Main Content */}
      <div className="pt-16 pb-20 px-4 h-full overflow-y-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        {/* Mux Video Player */}
        <div className="mb-6">
          <iframe
            src="https://player.mux.com/v/028j02s1o02ubAkvnnrS027ChTO2JWOj16dZS4LbrHJc4"
            style={{ width: "100%", border: "none", aspectRatio: "16/9" }}
            allow="autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            title={drama.title}
          />
        </div>

        {/* Drama Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{drama.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
            <span className="px-2 py-1 bg-primary/20 rounded text-primary text-xs font-semibold">
              {drama.type}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {drama.episodes} {t("episode")}s
            </span>
            <span>⭐ {drama.rating}</span>
            <span>🔥 {drama.views}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{drama.description}</p>
        </div>

        {/* Episode List */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">{t("episode")}列表</h2>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: drama.episodes }, (_, i) => i + 1).map((ep) => (
              <div
                key={ep}
                className={`aspect-square rounded-lg flex items-center justify-center font-semibold text-sm ${
                  ep === drama.currentEpisode
                    ? "bg-primary text-white"
                    : ep < drama.currentEpisode
                    ? "bg-muted text-foreground"
                    : "bg-card/50 text-muted-foreground"
                }`}
              >
                {ep}
              </div>
            ))}
          </div>
        </div>
      </div>

      <DramaBottomNav activeTab="discover" />
    </div>
  );
}
