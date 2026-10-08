import { X, User, Crown, Home, Heart, CreditCard, History, Settings, Info, LogOut, Globe, LogIn } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n, Language } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { t, language, setLanguage } = useI18n();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Check login status on mount
  useEffect(() => {
    const storedInfo = localStorage.getItem("user-info");
    if (storedInfo) {
      const info = JSON.parse(storedInfo);
      setIsLoggedIn(info.isLoggedIn);
      setUserInfo(info);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
    console.log(`[SideMenu] Language changed to: ${lang}`);
    toast.success(`语言已切换为 ${lang === "en" ? "English" : lang === "zh" ? "中文" : "日本語"}`);
  };

  const handleLogout = () => {
    console.log("[SideMenu] User logged out");
    localStorage.removeItem("user-info");
    setIsLoggedIn(false);
    setUserInfo(null);
    toast.success(t("logged_out"));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Side Menu Panel */}
      <div className="fixed top-0 left-0 h-full w-72 bg-[#1a1a1a] z-[70] transform transition-transform duration-300 ease-out overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header with Logo */}
        <div className="p-6 border-b border-white/10">
          <img src="https://conversation.cdn.meoo.host/conversations/303376511170383872/image/2026-10-04/1791102302886-111111.png?auth_key=8d5afda3e3af66827748a8e1622e03d6c92ceb1a2491bc0077fce79c27954eeb" alt="LemoPlay" className="h-[50px] w-auto block mx-auto mb-4" style={{ background: 'none', border: 'none' }} />
        </div>

        {/* User Info or Login Button */}
        {isLoggedIn && userInfo ? (
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{t("welcome")}, {userInfo.username}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Crown className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
                  <span className="text-[#d4af37] text-xs">{t("vip_status")}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 border-b border-white/10">
            <Link
              to="/auth"
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-[#d4af37] hover:bg-[#c4a030] text-black font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              {t("login_register")}
            </Link>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-4">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>{t("menu_home")}</span>
          </Link>

          <Link
            to="/favorites"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span>{t("menu_favorites")}</span>
          </Link>

          <Link
            to="/subscribe"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span>{t("menu_subscription")}</span>
          </Link>

          <Link
            to="/watched"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <History className="w-5 h-5" />
            <span>{t("menu_watch_history")}</span>
          </Link>
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-white/10" />

        {/* System Settings */}
        <div className="p-4">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 px-4">{t("menu_settings")}</p>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="flex-1 text-left">
                {language === "en" ? "English" : language === "zh" ? "中文" : "日本語"}
              </span>
            </button>

            {showLanguageMenu && (
              <div className="ml-4 mt-1 bg-card rounded-lg border border-border shadow-lg overflow-hidden">
                {(["en", "zh", "ja"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      language === lang
                        ? "bg-primary/20 text-primary font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {lang === "en" ? "English" : lang === "zh" ? "中文" : "日本語"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              console.log("[SideMenu] About Us clicked");
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <Info className="w-5 h-5" />
            <span>{t("menu_about")}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{t("menu_logout")}</span>
          </button>
        </div>
      </div>
    </>
  );
}
