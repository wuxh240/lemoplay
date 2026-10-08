import { X, Send, Heart, Trash2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: number;
  likes: number;
  isLiked: boolean;
}

interface CommentModalProps {
  dramaTitle: string;
  coverImage?: string;
  comments?: number;
  initialComments?: Comment[];
  onClose: () => void;
}

function formatRelativeTime(timestamp: number, t: (key: string) => string): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return t("just_now") || "刚刚";
  if (minutes < 60) return `${minutes}${t("minutes_ago") || "分钟前"}`;
  if (hours < 24) return `${hours}${t("hours_ago") || "小时前"}`;
  if (days < 7) return `${days}${t("days_ago") || "天前"}`;
  return new Date(timestamp).toLocaleDateString();
}

const defaultComments: Comment[] = [
  {
    id: "1",
    user: "Sarah M.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    text: "This drama is absolutely amazing! Can't wait for the next episode!",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    likes: 24,
    isLiked: false,
  },
  {
    id: "2",
    user: "John D.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    text: "The plot twist in episode 5 blew my mind 🤯",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    likes: 18,
    isLiked: true,
  },
  {
    id: "3",
    user: "Emma W.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    text: "Best series I've watched this year!",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    likes: 42,
    isLiked: false,
  },
];

export function CommentModal({
  dramaTitle,
  coverImage,
  comments: commentCount,
  initialComments = defaultComments,
  onClose,
}: CommentModalProps) {
  const { t } = useI18n();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleSend = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: t("you"),
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      text: newComment.trim(),
      timestamp: Date.now(),
      likes: 0,
      isLiked: false,
    };

    console.log(`[CommentModal] Sending comment: "${comment.text}"`);
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleLike = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isLiked: !c.isLiked,
              likes: c.isLiked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  };

  const handleDeleteClick = (commentId: string) => {
    setDeleteConfirmId(commentId);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    console.log(`[CommentModal] Deleting comment: ${deleteConfirmId}`);
    setComments(comments.filter((c) => c.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container - Video + Comments List */}
      <div
        className="fixed inset-x-0 top-0 z-[9999] flex flex-col bg-card animate-slide-up"
        style={{ bottom: "75px" }}
      >
        {/* Video Cover Section at Top */}
        {coverImage && (
          <div className="shrink-0 relative h-48 overflow-hidden">
            <img
              src={coverImage}
              alt={dramaTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-foreground mb-1">{dramaTitle}</h2>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 bg-background/60 backdrop-blur-sm rounded-full text-foreground hover:bg-background/70 transition-all border border-border text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t("comments")} ({commentCount || comments.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Header with fixed icon spacing */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-border">
          {/* Left side: Title and comment count */}
          <div>
            <h1 className="m-0 text-foreground text-lg font-bold">{dramaTitle}</h1>
            <p className="mt-1 mb-0 text-muted-foreground text-xs">{comments.length} {t("comments_count") || "条评论"}</p>
          </div>
          {/* Right side: Icons with proper spacing */}
          <div className="flex gap-4 items-center">
            <button onClick={onClose} className="text-foreground text-xl cursor-pointer p-1 hover:bg-muted rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comments List - Scrollable, fills remaining space with bottom margin for input bar */}
        <div className="flex-1 overflow-y-auto p-4 pb-4" style={{ marginBottom: "80px" }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 pb-[10px] mb-[10px] border-b border-gray-800/30 last:border-b-0 last:mb-0 last:pb-0"
            >
              <img
                src={comment.avatar}
                alt={comment.user}
                className="w-10 h-10 rounded-full bg-muted shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0 relative flex flex-col pr-[40px]">
                {/* Delete button - absolutely positioned at top-right */}
                <button
                  onClick={() => handleDeleteClick(comment.id)}
                  className="absolute top-0 right-0 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
                {/* Username and time - full width with padding for delete icon */}
                <div className="flex items-center gap-2 w-full pr-[40px] mb-1.5">
                  <span className="font-semibold text-foreground text-sm truncate">
                    {comment.user}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatRelativeTime(comment.timestamp, t)}
                  </span>
                </div>
                {/* Comment text - full width with padding for delete icon */}
                <p className="text-foreground/80 text-sm break-words w-full pr-[40px]">
                  {comment.text}
                </p>
                {/* Like button at bottom left - full width with padding for delete icon */}
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center gap-1 mt-2 text-xs transition-colors hover:opacity-80 w-full pr-[40px]"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      comment.isLiked
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={
                      comment.isLiked ? "text-primary" : "text-muted-foreground"
                    }
                  >
                    {comment.likes}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <>
          <div
            className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-sm"
            onClick={handleDeleteCancel}
          />
          <div className="fixed inset-x-0 top-1/2 -translate-y-1/2 z-[10002] mx-4 max-w-sm bg-black rounded-2xl border border-gray-700 p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-white mb-2">{t("delete_comment")}</h3>
            <p className="text-sm text-gray-300 mb-6">
              {t("delete_confirm")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 py-3 rounded-xl bg-white text-black font-medium hover:bg-gray-100 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 rounded-xl bg-white text-black font-medium hover:bg-gray-100 transition-colors"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Fixed Bottom Input Bar - highest z-index, visible above bottom nav */}
      <div
        className="fixed left-0 w-full z-[99999] bg-card px-5 py-4"
        style={{ bottom: "60px" }}
      >
        <div
          className="flex items-center gap-3 w-full max-w-2xl mx-auto"
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t("write_comment")}
            className="flex-1 h-[45px] px-4 bg-secondary border border-border rounded-full text-white caret-white placeholder:text-gray-400 text-sm outline-none focus:ring-2 focus:ring-primary"
            style={{ caretColor: "#FFFFFF" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!newComment.trim()}
            className="h-[45px] w-[45px] rounded-full bg-white border border-black flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <Send className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </>
  );
}
