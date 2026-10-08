import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { DramaHeader } from "@/components/DramaHeader";
import { DramaBottomNav } from "@/components/DramaBottomNav";
import { SettingsModal } from "@/components/SettingsModal";
import { EditProfileModal } from "@/components/EditProfileModal";
import { User, History, Settings, LogOut, Crown, Users, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

const watchHistory = [
  { id: 1, title: "Forbidden Love", episode: "Episode 3", time: "2 hours ago" },
  { id: 2, title: "Dark Secrets", episode: "Episode 1", time: "Yesterday" },
  { id: 3, title: "Golden Empire", episode: "Episode 5", time: "3 days ago" },
];

function Profile() {
  const router = useRouter();
  const { t } = useI18n();
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [username, setUsername] = useState("Drama Fan");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [invitedCount, setInvitedCount] = useState(0);

  // Check login status and load user info
  useEffect(() => {
    const storedInfo = localStorage.getItem("user-info");
    if (storedInfo) {
      const info = JSON.parse(storedInfo);
      setIsLoggedIn(info.isLoggedIn);
      setUserInfo(info);
      setUsername(info.username || "Drama Fan");
    }

    // Load invited count
    const count = parseInt(localStorage.getItem("invited-count") || "0");
    setInvitedCount(count);
  }, []);

  const handleLogout = () => {
    console.log("[Profile] User logged out");
    localStorage.removeItem("user-info");
    setIsLoggedIn(false);
    setUserInfo(null);
    toast.success(t("logged_out"));
    // Redirect to home page
    setTimeout(() => {
      router.navigate({ to: "/" });
    }, 500);
  };

  const handleResumeWatch = (title: string) => {
    console.log(`[Profile] Resuming watch: ${title}`);
    toast.info(`${t("continue_watching")}《${title}》`);
  };

  const handleSaveProfile = (newName: string, newAvatar: string) => {
    setUsername(newName);
    setAvatarUrl(newAvatar);
  };

  return (
    <>
      <div className="relative w-full min-h-screen bg-background max-w-full overflow-x-hidden">
        <DramaHeader />

        {/* Main Content */}
        <div className="pt-[60px] pb-20 px-5">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-4 p-4 bg-card rounded-xl border border-border card-shadow">
            <button
              onClick={() => {
                console.log("[Profile] Opening edit profile modal");
                setShowEditProfile(true);
              }}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-8 h-8 text-primary-foreground" />
              )}
            </button>
            <div className="flex-1">
              <button
                onClick={() => {
                  console.log("[Profile] Opening edit profile modal from username");
                  setShowEditProfile(true);
                }}
                className="text-foreground font-bold text-lg hover:text-primary/80 transition-colors cursor-pointer"
              >
                {username}
              </button>
              {isLoggedIn && userInfo && (
                <div className="flex items-center gap-2 mt-1">
                  {userInfo.contactType === "email" ? (
                    <Mail className="w-3 h-3 text-gray-400" />
                  ) : (
                    <Phone className="w-3 h-3 text-gray-400" />
                  )}
                  <p className="text-muted-foreground text-xs">{userInfo.contactValue}</p>
                </div>
              )}
              {!isLoggedIn && (
                <Link
                  to="/auth"
                  className="text-[#d4af37] text-sm hover:underline mt-1 inline-block"
                >
                  {t("login_register")}
                </Link>
              )}
            </div>
            <button
              onClick={() => {
                console.log("[Profile] Opening settings modal");
                setShowSettings(true);
              }}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* VIP Banner */}
          <Link
            to="/subscribe"
            className="block mb-4 p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30 hover:border-amber-500/50 transition-colors card-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-amber-400 fill-amber-400" />
                <div>
                  <p className="text-white font-semibold">{t("subscribe")}</p>
                  <p className="text-gray-400 text-xs">{t("vip_benefits")}</p>
                </div>
              </div>
              <span className="text-amber-400 text-sm font-medium">→</span>
            </div>
          </Link>

          {/* My Invites Section (only show when logged in) */}
          {isLoggedIn && (
            <Link
              to="/invite"
              className="block mb-4 p-4 bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/5 rounded-xl border border-[#d4af37]/30 hover:border-[#d4af37]/50 transition-colors card-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-[#d4af37] fill-[#d4af37]" />
                  <div>
                    <p className="text-white font-semibold">{t("my_invites_section")}</p>
                    <p className="text-gray-400 text-xs">{invitedCount} {t("people")}</p>
                  </div>
                </div>
                <span className="text-[#d4af37] text-sm font-medium">→</span>
              </div>
            </Link>
          )}

          {/* Invite Friends Banner (show for non-logged users) */}
          {!isLoggedIn && (
            <Link
              to="/invite"
              className="block mb-4 p-4 bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/5 rounded-xl border border-[#d4af37]/30 hover:border-[#d4af37]/50 transition-colors card-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-[#d4af37] fill-[#d4af37]" />
                  <div>
                    <p className="text-white font-semibold">{t("invite_friends")}</p>
                    <p className="text-gray-400 text-xs">{t("invite_reward")}</p>
                  </div>
                </div>
                <span className="text-[#d4af37] text-sm font-medium">→</span>
              </div>
            </Link>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Link to="/watched" className="text-center p-4 bg-card rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer block card-shadow">
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-muted-foreground text-xs">{t("watched")}</p>
            </Link>
            <Link to="/favorites" className="text-center p-4 bg-card rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer block card-shadow">
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-muted-foreground text-xs">{t("favorites")}</p>
            </Link>
            <Link to="/unlocked" className="text-center p-4 bg-card rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer block card-shadow">
              <p className="text-2xl font-bold text-foreground">5</p>
              <p className="text-muted-foreground text-xs">{t("unlocked")}</p>
            </Link>
          </div>

          {/* Watch History */}
          <section className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-foreground" />
              <h3 className="text-xl font-bold text-foreground">{t("watch_history")}</h3>
            </div>
            <div className="space-y-4">
              {watchHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border card-shadow">
                  <div>
                    <p className="text-foreground font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-xs">{item.episode} • {item.time}</p>
                  </div>
                  <button
                    onClick={() => handleResumeWatch(item.title)}
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-full font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {t("resume")}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t("sign_out")}
          </button>
        </div>

        <DramaBottomNav activeTab="profile" />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          initialName={username}
          initialAvatar={avatarUrl}
          onClose={() => setShowEditProfile(false)}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
}
