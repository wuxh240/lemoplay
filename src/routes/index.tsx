import { createFileRoute } from "@tanstack/react-router";
import { DramaHeader } from "@/components/DramaHeader";
import { DramaFeed } from "@/components/DramaFeed";
import { DramaBottomNav } from "@/components/DramaBottomNav";
import { SideMenu } from "@/components/SideMenu";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="relative w-full min-h-screen bg-background max-w-full overflow-x-hidden">
        <DramaHeader onMenuClick={() => setIsMenuOpen(true)} />
        <div className="pt-[60px]">
          <DramaFeed />
        </div>
        <DramaBottomNav activeTab="home" />
      </div>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
