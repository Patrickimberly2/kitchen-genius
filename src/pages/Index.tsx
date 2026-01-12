import { useState, useEffect } from "react";
import { KitchenProvider, useKitchen } from "@/context/KitchenContext";
import { KitchenScene3D } from "@/components/3d/KitchenScene3D";
import { KitchenToolbar } from "@/components/ui/KitchenToolbar";
import { InventoryPanel } from "@/components/ui/InventoryPanel";
import { AISuggestionsPanel } from "@/components/ui/AISuggestionsPanel";
import { WelcomeOverlay } from "@/components/ui/WelcomeOverlay";
import { ControlsHelp } from "@/components/ui/ControlsHelp";
import { ZoneEditPanel } from "@/components/ui/ZoneEditPanel";
import { MobileInventoryPanel } from "@/components/ui/MobileInventoryPanel";
import { useIsMobile } from "@/hooks/use-mobile";

function KitchenApp() {
  const isMobile = useIsMobile();
  const { setMobileView, isMobileView } = useKitchen();
  
  useEffect(() => {
    setMobileView(isMobile);
  }, [isMobile, setMobileView]);

  // Show 2D mobile view on small screens
  if (isMobileView) {
    return (
      <div className="fixed inset-0 bg-background">
        <MobileInventoryPanel />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background">
      {/* 3D Scene */}
      <KitchenScene3D />
      
      {/* UI Overlays */}
      <KitchenToolbar />
      <InventoryPanel />
      <AISuggestionsPanel />
      <ControlsHelp />
      <ZoneEditPanel />
      
      {/* Welcome / Onboarding */}
      <WelcomeOverlay />
    </div>
  );
}

const Index = () => {
  return (
    <KitchenProvider>
      <KitchenApp />
    </KitchenProvider>
  );
};

export default Index;
