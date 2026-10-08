import { createFileRoute, Link } from "@tanstack/react-router";
import { DramaHeader } from "@/components/DramaHeader";
import { DramaBottomNav } from "@/components/DramaBottomNav";
import { Flame, TrendingUp, Star, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/discover")({
  component: Discover,
});

const recommendedDramas = [
  { id: 1, title: "Forbidden Love", type: "Romance", views: "12.5K", coverImage: "https://g.cdn.meoo.host/stocu9gwr4pk/ai-images/romance-drama.png?auth_key=c9b3526b47d2f7ae5dc7ede15f014e085836502b3290151d37ef341bc75abb13" },
  { id: 2, title: "Dark Secrets", type: "Thriller", views: "8.9K", coverImage: "https://g.cdn.meoo.host/stocu9gwr4pk/ai-images/thriller-drama.png?auth_key=d8643ade0d821c8df4768165fae53a56c9706081d421b6cde537652050e08c18" },
  { id: 3, title: "Golden Empire", type: "Drama", views: "15.2K", coverImage: "https://g.cdn.meoo.host/stocu9gwr4pk/ai-images/luxury-drama.png?auth_key=f90b555aff5f2f1282bf84142d7d21ec41bb66c22130f4a3ab81bb4756f3db6a" },
  { id: 4, title: "Corporate Wars", type: "Business", views: "6.7K", coverImage: "https://g.cdn.meoo.host/stocu9gwr4pk/ai-images/power-drama.png?auth_key=4c06dd78d1118f202fbfe18e39b66789cc9b6e5f2bf53fea37be01336f4df702" },
  { id: 5, title: "Sunset Dreams", type: "Emotional", views: "10.3K", coverImage: "https://g.cdn.meoo.host/stocu9gwr4pk/ai-images/emotional-drama.png?auth_key=6c466ccf37229c41a581bf0d004fc68eb7f6a8cb4bde3e7902edf23c8cc54ecf" },
  { id: 6, title: "Midnight Gala", type: "Social", views: "9.1K", coverImage: "https://g.cdn.meoo.host/stocu9gwr4pk/ai-images/party-drama.png?auth_key=7b6b54748a84db79b3cc9077b1d1ed468f333707a217bc7d254be42dbb47bec3" },
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

function Discover() {
  const { t } = useI18n();

  const handleShare = async (dramaId: number, title: string) => {
    const shareData = {
      title: title,
      text: `${t("share_to")}《${title}》`,
      url: `${window.location.origin}/drama/${dramaId}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log(`[Discover] Shared ${title} successfully via Web Share API`);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success(t("link_copied"));
      }
    } catch (error) {
      console.error("[Discover] Share failed:", error);
      toast.error(t("share_failed"));
    }
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <DramaHeader />

      {/* Main Content */}
      <div className="pt-16 pb-20 px-4 h-full overflow-y-auto">
        {/* Hot Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              {t("trending_now")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommendedDramas.slice(0, 4).map((drama) => (
              <div key={drama.id} className="relative group">
                <Link
                  to="/drama/$id"
                  params={{ id: String(drama.id) }}
                  className="relative aspect-[9/16] rounded-lg overflow-hidden block cursor-pointer hover:scale-105 transition-transform"
                >
                  <img src={drama.coverImage} alt={drama.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm font-semibold truncate">{drama.title}</p>
                    <p className="text-gray-400 text-xs">{t(typeToKeyMap[drama.type] || drama.type)}</p>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(drama.id, drama.title);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* New Releases Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              {t("new_releases")}
            </h2>
          </div>
          <div className="space-y-3">
            {recommendedDramas.slice(2, 6).map((drama) => (
              <div key={drama.id} className="relative group">
                <Link
                  to="/drama/$id"
                  params={{ id: String(drama.id) }}
                  className="flex gap-3 bg-card/50 rounded-lg p-3 cursor-pointer hover:bg-card/70 transition-colors"
                >
                  <img src={drama.coverImage} alt={drama.title} className="w-20 h-28 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{drama.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{t(typeToKeyMap[drama.type] || drama.type)}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span>{drama.views} {t("views")}</span>
                    </div>
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
        </section>
      </div>

      <DramaBottomNav activeTab="discover" />
    </div>
  );
}
