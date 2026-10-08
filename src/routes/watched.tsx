import { createFileRoute, useRouter } from "@tanstack/react-router";
import { DramaHeader } from "@/components/DramaHeader";
import { DramaBottomNav } from "@/components/DramaBottomNav";
import { History, Play, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/watched")({
  component: Watched,
});

const watchedList = [
  { id: 1, title: "Forbidden Love", episode: "Episode 3", time: "2 hours ago", progress: 75 },
  { id: 2, title: "Dark Secrets", episode: "Episode 1", time: "Yesterday", progress: 30 },
  { id: 3, title: "Golden Empire", episode: "Episode 5", time: "3 days ago", progress: 100 },
  { id: 4, title: "Corporate Wars", episode: "Episode 2", time: "1 week ago", progress: 50 },
  { id: 5, title: "Sunset Dreams", episode: "Episode 4", time: "2 weeks ago", progress: 90 },
];

function Watched() {
  const router = useRouter();
  const { t } = useI18n();

  const handleBack = () => {
    console.log("[Watched] Navigating back to profile");
    router.history.back();
  };

  const handleResumeWatch = (title: string) => {
    console.log(`[Watched] Resuming watch: ${title}`);
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
            <History className="w-6 h-6 text-foreground" />
            <h2 className="text-2xl font-bold text-foreground">{t("watch_history")}</h2>
          </div>

          {/* Watched List */}
          <div className="space-y-3">
            {watchedList.map((item) => (
              <div key={item.id} className="p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-foreground font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-xs">{item.episode} • {item.time}</p>
                  </div>
                  <button
                    onClick={() => handleResumeWatch(item.title)}
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-full font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    {t("resume")}
                  </button>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="text-muted-foreground text-xs mt-1">{item.progress}% {t("completed")}</p>
              </div>
            ))}
          </div>
        </div>

        <DramaBottomNav activeTab="profile" />
      </div>
    </>
  );
}
