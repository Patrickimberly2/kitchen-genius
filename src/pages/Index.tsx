import { KitchenProvider } from "@/context/KitchenContext";
import { KitchenScene3D } from "@/components/3d/KitchenScene3D";
import { KitchenToolbar } from "@/components/ui/KitchenToolbar";
import { InventoryPanel } from "@/components/ui/InventoryPanel";
import { AISuggestionsPanel } from "@/components/ui/AISuggestionsPanel";
import { WelcomeOverlay } from "@/components/ui/WelcomeOverlay";
import { ControlsHelp } from "@/components/ui/ControlsHelp";
import { ZoneEditPanel } from "@/components/ui/ZoneEditPanel";

const Index = () => {
  return (
    <KitchenProvider>
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
    </KitchenProvider>
  );
};

export default Index;
