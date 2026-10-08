import { Home, Compass, Heart, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

const navItems = [
  { id: "home", icon: Home, labelKey: "nav_home", to: "/" },
  { id: "discover", icon: Compass, labelKey: "nav_discover", to: "/discover" },
  { id: "favorites", icon: Heart, labelKey: "nav_favorites", to: "/favorites" },
  { id: "profile", icon: User, labelKey: "nav_profile", to: "/profile" },
];

interface DramaBottomNavProps {
  activeTab?: string;
}

export function DramaBottomNav({ activeTab }: DramaBottomNavProps) {
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t" style={{ background: '#F5F5F5', borderColor: '#E0E0E0' }}>
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
                isActive ? "" : "hover:opacity-70"
              }`}
            >
              <item.icon className="w-6 h-6" style={{ color: isActive ? '#22c55e' : '#444444' }} />
              <span className="text-xs" style={{ color: isActive ? '#22c55e' : '#444444' }}>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
