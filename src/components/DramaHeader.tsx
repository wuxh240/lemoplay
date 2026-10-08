import { Search, Globe, Menu } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n, Language } from "@/lib/i18n";
import { CodeLogo } from "./CodeLogo";

interface DramaHeaderProps {
  onMenuClick?: () => void;
}

export function DramaHeader({ onMenuClick }: DramaHeaderProps) {
  const { language, setLanguage, t } = useI18n();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.info(t("search_placeholder"));
      return;
    }
    console.log(`[DramaHeader] Searching for: "${searchQuery}"`);
    toast.success(`${t("search")}: ${searchQuery}`);
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
    console.log(`[DramaHeader] Language changed to: ${lang}`);
    toast.success(`语言已切换为 ${lang === "en" ? "English" : lang === "zh" ? "中文" : "日本語"}`);
  };

  const getLanguageLabel = () => {
    return language.toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b h-[60px]" style={{ background: '#F5F5F5', borderColor: '#E0E0E0' }}>
      <div className="flex items-center gap-3 h-full">
        {/* Hamburger Menu Button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center"
            style={{ background: 'transparent' }}
          >
            <Menu className="w-6 h-6" style={{ color: '#222222' }} />
          </button>
        )}
        <CodeLogo />
      </div>

      {showSearch ? (
        <div className="flex items-center gap-2 flex-1 max-w-xs ml-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            className="flex-1 px-3 py-1.5 bg-black/5 rounded-full text-[#222222] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            onClick={() => {
              setShowSearch(false);
              setSearchQuery("");
            }}
            className="p-1.5 rounded-full hover:bg-black/5 transition-colors text-[#222222] text-sm"
          >
            {t("search_cancel")}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 h-full">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="p-2 rounded-full hover:bg-black/5 transition-colors flex items-center gap-1"
            >
              <Globe className="w-5 h-5" style={{ color: '#222222' }} />
              <span className="text-xs font-semibold" style={{ color: '#222222' }}>{getLanguageLabel()}</span>
            </button>

            {/* Language Menu Dropdown */}
            {showLanguageMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLanguageMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-36 bg-card rounded-lg border border-border shadow-lg z-50 overflow-hidden">
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
              </>
            )}
          </div>

          <button
            onClick={() => {
              console.log("[DramaHeader] Opening search");
              setShowSearch(true);
            }}
            className="p-2 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center"
          >
            <Search className="w-5 h-5" style={{ color: '#222222' }} />
          </button>
        </div>
      )}
    </header>
  );
}
