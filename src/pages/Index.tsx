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
import { CabinetInteriorModal } from "@/components/ui/CabinetInteriorModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { KitchenZone } from "@/types/kitchen";

function KitchenApp() {
  const isMobile = useIsMobile();
  const { setMobileView, isMobileView, zones, selectedZoneId, selectZone } = useKitchen();
  const [interiorModalZone, setInteriorModalZone] = useState<KitchenZone | null>(null);
  
  useEffect(() => {
    setMobileView(isMobile);
  }, [isMobile, setMobileView]);

  // Open modal when a storage zone is selected (double-click triggers this)
  const handleOpenInterior = (zone: KitchenZone) => {
    const storageTypes = [
      "upper_cabinet", "lower_cabinet", "drawer", "pantry", "pantry_shelf",
      "refrigerator", "freezer", "upright_freezer", "freezer_shelf",
      "fridge_door", "fridge_drawer", "cabinet_upper", "cabinet_lower"
    ];
    if (storageTypes.includes(zone.zone_type)) {
      setInteriorModalZone(zone);
    }
  };

  // Watch for selected zone changes to potentially open interior view
  useEffect(() => {
    if (selectedZoneId) {
      const zone = zones.find(z => z.id === selectedZoneId);
      if (zone) {
        // We'll use a custom event or context to trigger the modal
        // For now, clicking once selects, the modal can be opened via ZoneMesh3D double-click
      }
    }
  }, [selectedZoneId, zones]);

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
      <KitchenScene3D onOpenInterior={handleOpenInterior} />
      
      {/* UI Overlays */}
      <KitchenToolbar />
      <InventoryPanel />
      <AISuggestionsPanel />
      <ControlsHelp />
      <ZoneEditPanel />
      
      {/* Cabinet Interior Modal */}
      <CabinetInteriorModal
        zone={interiorModalZone}
        isOpen={interiorModalZone !== null}
        onClose={() => setInteriorModalZone(null)}
      />
      
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
