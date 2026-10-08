import { X, User, Palette, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { t } = useI18n();
  const [nickname, setNickname] = useState("Drama Fan");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveNickname = () => {
    if (!nickname.trim()) {
      toast.error(t("username_required"));
      return;
    }
    console.log(`[SettingsModal] Nickname updated to: "${nickname}"`);
    toast.success(t("profile_updated"));
    setIsEditing(false);
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    console.log(`[SettingsModal] Theme changed to: ${newTheme}`);
    toast.success(`已切换到${newTheme === "dark" ? "深色" : "浅色"}主题`);
  };

  const handleClearCache = () => {
    console.log("[SettingsModal] Clearing cache...");
    // Simulate cache clearing
    setTimeout(() => {
      toast.success("缓存已清理");
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{t("settings")}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Settings List */}
        <div className="space-y-6">
          {/* Nickname */}
          <div>
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <User className="w-5 h-5 text-primary" />
              {t("edit_profile")}
            </label>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  onClick={handleSaveNickname}
                  className="px-4 py-2 bg-primary rounded-lg text-white font-semibold"
                >
                  {t("save")}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-white">{nickname}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary text-sm font-semibold"
                >
                  {t("edit_profile")}
                </button>
              </div>
            )}
          </div>

          {/* Theme */}
          <div>
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <Palette className="w-5 h-5 text-primary" />
              更换主题
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === "light"
                    ? "border-primary bg-primary/10"
                    : "border-gray-700 bg-gray-800"
                }`}
              >
                <div className="w-full h-12 bg-white rounded mb-2" />
                <span className="text-white text-sm">浅色模式</span>
                {theme === "light" && (
                  <Check className="w-4 h-4 text-primary mt-1 mx-auto" />
                )}
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === "dark"
                    ? "border-primary bg-primary/10"
                    : "border-gray-700 bg-gray-800"
                }`}
              >
                <div className="w-full h-12 bg-gray-900 rounded mb-2" />
                <span className="text-white text-sm">深色模式</span>
                {theme === "dark" && (
                  <Check className="w-4 h-4 text-primary mt-1 mx-auto" />
                )}
              </button>
            </div>
          </div>

          {/* Clear Cache */}
          <div>
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <Trash2 className="w-5 h-5 text-primary" />
              清理缓存
            </label>
            <button
              onClick={handleClearCache}
              className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-semibold transition-colors"
            >
              立即清理
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
