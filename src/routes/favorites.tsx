import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { DramaHeader } from "@/components/DramaHeader";
import { DramaBottomNav } from "@/components/DramaBottomNav";
import { Heart, ArrowLeft, Play, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/favorites")({
  component: Favorites,
});

const favoriteDramas = [
  { id: 1, title: "Forbidden Love", type: "Romance", episode: "Episode 3/10", currentEpisode: 3, coverImage: "https://g.cdn.meoo.host/stocu9gwr4pk/ai-images/romance-drama.png?auth_key=c9b3526b47d2f7ae5dc7ede15f014e085836502b3290151d37ef341bc75abb13" },
  { id: 3, title: "Golden Empire", type: "Drama", episode: "Episode 5/10", currentEpisode: 5, coverImage: "https://g.cdn.meoo.host/stocu9gwr4pk/ai-images/luxury-drama.png?auth_key=f90b555aff5f2f1282bf84142d7d21ec41bb66c22130f4a3ab81bb4756f3db6a" },
  { id: 5, title: "Sunset Dreams", type: "Emotional", episode: "Episode 2/10", currentEpisode: 2, coverImage: "https://g.cdn.meoo.host/stocu9gwr4pk/ai-images/emotional-drama.png?auth_key=6c466ccf37229c41a581bf0d004fc68eb7f6a8cb4bde3e7902edf23c8cc54ecf" },
];

// Map English type names to translation keys
const typeToKeyMap: Record<string, string> = {
  "Romance": "type_romance",
  "Thriller": "type_thriller",
  "Drama": "type_drama",
  "Business": "type_business",
  "Emotional": "type_emotional",
  "Social": "type_social",
};

function Favorites() {
  const router = useRouter();
  const { t } = useI18n();

  const handleBack = () => {
    console.log("[Favorites] Navigating back to profile");
    router.history.back();
  };

  const handleContinueWatching = (dramaId: number, episode: number, title: string) => {
    console.log(`[Favorites] Continue watching ${title} from episode ${episode}`);
    toast.info(`${t("continue_watching")} ${title} - Episode ${episode}`);
    // Navigate to player with drama ID and episode
    // router.navigate({ to: '/player', search: { dramaId, episode } });
  };

  const handleShare = async (dramaId: number, title: string) => {
    const shareData = {
      title: title,
      text: `${t("share_to")}《${title}》`,
      url: `${window.location.origin}/drama/${dramaId}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log(`[Favorites] Shared ${title} successfully via Web Share API`);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success(t("link_copied"));
      }
    } catch (error) {
      console.error("[Favorites] Share failed:", error);
      toast.error(t("share_failed"));
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-background max-w-full overflow-x-hidden">
      <DramaHeader />

      {/* Main Content */}
      <div className="pt-[60px] pb-20 px-4">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <Heart className="w-5 h-5 text-primary fill-primary" />
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            {t("my_favorites")}
          </h2>
        </div>

        {favoriteDramas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Heart className="w-16 h-16 mb-4 opacity-30" />
            <p>{t("no_favorites")}</p>
            <p className="text-sm mt-2">{t("start_exploring")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteDramas.map((drama) => (
              <div key={drama.id} className="relative group">
                <Link
                  to="/drama/$id"
                  params={{ id: String(drama.id) }}
                  className="flex gap-3 bg-card/50 rounded-lg p-3 cursor-pointer hover:bg-card/70 transition-colors block"
                >
                  <img src={drama.coverImage} alt={drama.title} className="w-24 h-32 object-cover rounded" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">{drama.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{t(typeToKeyMap[drama.type] || drama.type)}</p>
                      <p className="text-primary text-xs">{drama.episode}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation when clicking button
                        handleContinueWatching(drama.id, drama.currentEpisode, drama.title);
                      }}
                      className="self-start px-3 py-1.5 bg-primary/20 text-primary text-xs rounded-full font-semibold hover:bg-primary/30 transition-colors flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      {t("continue_watching")}
                    </button>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(drama.id, drama.title);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <DramaBottomNav activeTab="favorites" />
    </div>
  );
}
