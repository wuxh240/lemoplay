import { Play, Heart, MessageCircle, Share2, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PaywallModal } from "./PaywallModal";
import { CommentModal } from "./CommentModal";
import { ShareFallbackModal } from "./ShareFallbackModal";
import { useI18n } from "@/lib/i18n";

interface DramaCardProps {
  id: number;
  title: string;
  subtitle: string;
  coverImage: string;
  type: string;
  views: string;
  likes: number;
  comments: number;
  isFree: boolean;
  episodeNumber?: number;
  videoUrl?: string;
  vid?: string;
}

// Map English type names to translation keys
const typeToKeyMap: Record<string, string> = {
  "Romance": "type_romance",
  "Thriller": "type_thriller",
  "Drama": "type_drama",
  "Business": "type_business",
  "Emotional": "type_emotional",
  "Social": "type_social",
};

export function DramaCard({
  id,
  title,
  subtitle,
  coverImage,
  type,
  views,
  likes: initialLikes,
  comments,
  isFree,
  episodeNumber,
  videoUrl,
  vid,
}: DramaCardProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareFallback, setShowShareFallback] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handlePlay = () => {
    if (videoUrl || vid) {
      console.log('[DramaCard] 跳转到播放页, id:', id);
      navigate({ to: '/drama/$id', params: { id: String(id) } });
    } else if (!isFree) {
      console.log(`[DramaCard] Episode ${episodeNumber || 'unknown'} is locked, showing paywall`);
      setShowPaywall(true);
    } else {
      console.log(`[DramaCard] Playing free episode`);
      toast.success(t("resume"));
    }
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `${t("share_to")}《${title}》`,
      url: "https://stocu9gwr4pk.meoo.info",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("[DramaCard] Shared successfully via Web Share API");
      } else {
        // Web Share API not supported, show fallback modal
        console.log("[DramaCard] Web Share API not supported, showing fallback modal");
        setShowShareFallback(true);
      }
    } catch (error) {
      console.error("[DramaCard] Share failed:", error);
      // User cancelled or error, show fallback modal
      console.log("[DramaCard] Showing fallback modal after share error");
      setShowShareFallback(true);
    }
  };

  return (
    <>
      <div className="bg-card rounded-2xl overflow-hidden card-shadow">
        {/* Poster Image Card */}
        <div className="relative w-full h-[55vh] overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />

          {/* Premium Badge */}
          {!isFree && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
              <Lock className="w-3.5 h-3.5" />
              <span>Premium</span>
            </div>
          )}

          {/* Play Button Overlay */}
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all group-hover:scale-110 shadow-xl">
              {isFree ? (
                <Play className="w-10 h-10 text-black fill-black ml-1" />
              ) : (
                <Lock className="w-10 h-10 text-black" />
              )}
            </div>
          </button>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Title & Meta */}
          <div>
            <h2
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="px-2.5 py-1 bg-primary/20 rounded text-primary text-xs font-semibold">
                {t(typeToKeyMap[type] || type)}
              </span>
              <span className="text-gray-400">🔥 {views}</span>
              {episodeNumber && (
                <span className="text-xs text-gray-500">第{episodeNumber}集</span>
              )}
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-gray-300 text-sm leading-relaxed">{subtitle}</p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            {/* Left: Comments Button */}
            <button
              onClick={handleComment}
              className="flex items-center gap-2 px-5 py-2.5 bg-muted hover:bg-muted/80 rounded-full text-white transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{t("comments")} ({comments})</span>
            </button>

            {/* Right: Like & Share */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-all ${
                  isLiked
                    ? "bg-red-500/20 text-red-500"
                    : "bg-muted hover:bg-muted/80 text-white"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-full text-white transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">{t("share")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          episodeNumber={episodeNumber || 0}
          dramaTitle={title}
          onClose={() => {
            console.log(`[DramaCard] Closing paywall for episode ${episodeNumber}`);
            setShowPaywall(false);
          }}
        />
      )}

      {/* Comment Modal */}
      {showComments && (
        <CommentModal
          dramaTitle={title}
          coverImage={coverImage}
          comments={comments}
          onClose={() => setShowComments(false)}
        />
      )}

      {/* Share Fallback Modal */}
      {showShareFallback && (
        <ShareFallbackModal
          dramaTitle={title}
          shareUrl="https://stocu9gwr4pk.meoo.info"
          onClose={() => setShowShareFallback(false)}
        />
      )}
    </>
  );
}
