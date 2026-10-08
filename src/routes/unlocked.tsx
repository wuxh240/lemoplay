import { createFileRoute, useRouter } from "@tanstack/react-router";
import { DramaHeader } from "@/components/DramaHeader";
import { DramaBottomNav } from "@/components/DramaBottomNav";
import { Lock, Play, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/unlocked")({
  component: Unlocked,
});

const unlockedList = [
  { id: 1, title: "Forbidden Love", episodes: "Episodes 1-8", unlockedAt: "Oct 15, 2024" },
  { id: 2, title: "Dark Secrets", episodes: "Episodes 1-3", unlockedAt: "Oct 10, 2024" },
  { id: 3, title: "Golden Empire", episodes: "Episodes 1-5", unlockedAt: "Sep 28, 2024" },
  { id: 4, title: "Corporate Wars", episodes: "Episodes 1-2", unlockedAt: "Sep 20, 2024" },
  { id: 5, title: "Sunset Dreams", episodes: "Episodes 1-4", unlockedAt: "Sep 15, 2024" },
];

function Unlocked() {
  const router = useRouter();
  const { t } = useI18n();

  const handleBack = () => {
    console.log("[Unlocked] Navigating back to profile");
    router.history.back();
  };

  const handleWatch = (title: string) => {
    console.log(`[Unlocked] Watching: ${title}`);
    toast.info(`${t("continue_watching")}《${title}》`);
  };

  return (
    <>
      <div className="relative w-full h-screen bg-background overflow-hidden">
        <DramaHeader />

        {/* Main Content */}
        <div className="pt-16 pb-20 px-4 h-full overflow-y-auto">
          {/* Header with Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <Lock className="w-6 h-6 text-foreground" />
            <h2 className="text-2xl font-bold text-foreground">{t("unlocked_episodes")}</h2>
          </div>

          {/* Unlocked List */}
          <div className="space-y-3">
            {unlockedList.map((item) => (
              <div key={item.id} className="p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-foreground font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-xs">{item.episodes} • {t("unlocked")} {item.unlockedAt}</p>
                  </div>
                  <button
                    onClick={() => handleWatch(item.title)}
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-full font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    {t("resume")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DramaBottomNav activeTab="profile" />
      </div>
    </>
  );
}
