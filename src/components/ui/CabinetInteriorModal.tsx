import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { Dialog, DialogContent } from "./dialog";
import { KitchenZone, InventoryItem } from "@/types/kitchen";
import { useKitchen } from "@/context/KitchenContext";

interface CabinetInteriorModalProps {
  zone: KitchenZone | null;
  isOpen: boolean;
  onClose: () => void;
}

// Wood grain gradient styles
const woodGrainStyle = {
  background: `linear-gradient(135deg, 
    #c4956a 0%, 
    #b8845a 15%, 
    #d4a574 30%, 
    #c4956a 45%, 
    #a67c52 60%, 
    #c4956a 75%, 
    #d4a574 90%, 
    #c4956a 100%)`,
};

const darkWoodStyle = {
  background: `linear-gradient(135deg, 
    #8b6914 0%, 
    #7a5d12 20%, 
    #9a7520 40%, 
    #8b6914 60%, 
    #6d5410 80%, 
    #8b6914 100%)`,
};

const lightWoodStyle = {
  background: `linear-gradient(135deg, 
    #deb887 0%, 
    #d4a574 25%, 
    #e8c9a0 50%, 
    #deb887 75%, 
    #d4a574 100%)`,
};

export function CabinetInteriorModal({ zone, isOpen, onClose }: CabinetInteriorModalProps) {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { items } = useKitchen();

  const isDrawerType = zone?.zone_type === "drawer";
  const zoneItems = items.filter(item => item.zone_id === zone?.id);

  // Animate doors/drawer opening
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (isDrawerType) {
          setDrawerOpen(true);
        } else {
          setDoorsOpen(true);
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setDoorsOpen(false);
      setDrawerOpen(false);
    }
  }, [isOpen, isDrawerType]);

  if (!zone) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-amber-50 to-orange-50 border-0 shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-amber-200 flex justify-between items-center bg-gradient-to-r from-amber-100/80 to-orange-100/80">
          <div>
            <h2 className="text-xl font-bold text-amber-900">{zone.name}</h2>
            <p className="text-sm text-amber-700">
              {isDrawerType ? "Drawer Interior" : "Cabinet Interior"} • {zoneItems.length} items
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-amber-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-amber-800" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6" style={{ perspective: "1200px" }}>
          {isDrawerType ? (
            <DrawerView 
              isOpen={drawerOpen} 
              items={zoneItems}
              zone={zone}
            />
          ) : (
            <CabinetView 
              isOpen={doorsOpen} 
              items={zoneItems}
              zone={zone}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Drawer View Component
function DrawerView({ 
  isOpen, 
  items,
  zone 
}: { 
  isOpen: boolean; 
  items: InventoryItem[];
  zone: KitchenZone;
}) {
  return (
    <div className="relative mx-auto" style={{ width: "500px", height: "320px", perspective: "800px" }}>
      {/* Drawer Box - 3D container */}
      <motion.div
        className="relative w-full h-full"
        style={{ 
          transformStyle: "preserve-3d",
          transformOrigin: "center bottom",
        }}
        animate={{
          rotateX: isOpen ? -15 : 0,
          translateZ: isOpen ? 40 : 0,
        }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Back Wall */}
        <div 
          className="absolute top-0 left-8 right-8 h-16 rounded-t-sm shadow-inner"
          style={{
            ...darkWoodStyle,
            transform: "translateZ(-20px)",
          }}
        />

        {/* Left Wall */}
        <div 
          className="absolute top-0 left-0 w-8 h-full rounded-l-sm"
          style={{
            ...woodGrainStyle,
            boxShadow: "inset -4px 0 8px rgba(0,0,0,0.2)",
          }}
        />

        {/* Right Wall */}
        <div 
          className="absolute top-0 right-0 w-8 h-full rounded-r-sm"
          style={{
            ...woodGrainStyle,
            boxShadow: "inset 4px 0 8px rgba(0,0,0,0.2)",
          }}
        />

        {/* Bottom Panel - Wood Grain */}
        <div 
          className="absolute bottom-16 left-8 right-8 top-16 rounded-sm"
          style={{
            ...lightWoodStyle,
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {/* Items Grid inside drawer */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute inset-4 grid grid-cols-3 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {items.slice(0, 6).map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <span className="text-2xl mb-1">{getCategoryIcon(item.category)}</span>
                    <span className="text-xs font-medium text-amber-900 text-center truncate w-full">
                      {item.name}
                    </span>
                    <span className="text-xs text-amber-600">{item.quantity} {item.unit}</span>
                  </motion.div>
                ))}
                {items.length === 0 && (
                  <div className="col-span-3 flex flex-col items-center justify-center text-amber-600">
                    <Plus className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm">Empty drawer</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Drawer Front Panel */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-16 rounded-b-lg flex items-center justify-center"
          style={{
            ...woodGrainStyle,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
          animate={{
            translateZ: isOpen ? 60 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Brass Knob */}
          <div 
            className="w-8 h-8 rounded-full shadow-lg"
            style={{
              background: "radial-gradient(circle at 30% 30%, #d4af37 0%, #b8860b 50%, #8b6914 100%)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Shadow underneath */}
      <motion.div
        className="absolute -bottom-4 left-1/2 w-3/4 h-4 rounded-full bg-black/20 blur-md"
        style={{ transform: "translateX(-50%)" }}
        animate={{
          scaleX: isOpen ? 1.2 : 1,
          opacity: isOpen ? 0.3 : 0.2,
        }}
      />
    </div>
  );
}

// Cabinet View Component
function CabinetView({ 
  isOpen, 
  items,
  zone 
}: { 
  isOpen: boolean; 
  items: InventoryItem[];
  zone: KitchenZone;
}) {
  const shelfCount = zone.dimensions.height > 0.6 ? 2 : 1;

  return (
    <div className="relative mx-auto" style={{ width: "520px", height: "380px", perspective: "1000px" }}>
      {/* Cabinet Frame */}
      <div 
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{
          ...darkWoodStyle,
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        {/* Center Divider */}
        <div 
          className="absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 z-10"
          style={{
            ...woodGrainStyle,
            boxShadow: "0 0 8px rgba(0,0,0,0.3)",
          }}
        />

        {/* Shelves */}
        {Array.from({ length: shelfCount }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-3"
            style={{
              ...woodGrainStyle,
              top: `${((i + 1) / (shelfCount + 1)) * 100}%`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          />
        ))}

        {/* Items on shelves */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute inset-4 grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Left compartments */}
              <div className="flex flex-col gap-2">
                {items.filter((_, i) => i % 2 === 0).slice(0, shelfCount + 1).map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="flex-1 flex items-end justify-center p-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <motion.div 
                      className="flex flex-col items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm"
                      whileHover={{ scale: 1.1, y: -4 }}
                    >
                      <span className="text-3xl mb-1">{getCategoryIcon(item.category)}</span>
                      <span className="text-xs font-semibold text-amber-900">{item.name}</span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              {/* Right compartments */}
              <div className="flex flex-col gap-2">
                {items.filter((_, i) => i % 2 === 1).slice(0, shelfCount + 1).map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="flex-1 flex items-end justify-center p-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <motion.div 
                      className="flex flex-col items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm"
                      whileHover={{ scale: 1.1, y: -4 }}
                    >
                      <span className="text-3xl mb-1">{getCategoryIcon(item.category)}</span>
                      <span className="text-xs font-semibold text-amber-900">{item.name}</span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              {items.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center text-amber-200">
                  <Plus className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-sm">Empty cabinet</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Left Door */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1/2 rounded-l-lg overflow-hidden"
        style={{
          ...woodGrainStyle,
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
        }}
        animate={{
          rotateY: isOpen ? -105 : 0,
        }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Recessed Panel */}
        <div 
          className="absolute inset-4 rounded-md border-2 border-amber-700/30"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)",
            boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.2), inset -1px -1px 2px rgba(255,255,255,0.1)",
          }}
        />
        
        {/* Hinges */}
        <div className="absolute left-1 top-8 w-2 h-8 rounded-sm bg-gradient-to-b from-gray-300 to-gray-500 shadow-md" />
        <div className="absolute left-1 bottom-8 w-2 h-8 rounded-sm bg-gradient-to-b from-gray-300 to-gray-500 shadow-md" />
        
        {/* Handle - right side of left door */}
        <div 
          className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-16 rounded-full"
          style={{
            background: "linear-gradient(90deg, #a8a8a8 0%, #d0d0d0 50%, #a8a8a8 100%)",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
          }}
        />
      </motion.div>

      {/* Right Door */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-1/2 rounded-r-lg overflow-hidden"
        style={{
          ...woodGrainStyle,
          transformOrigin: "right center",
          transformStyle: "preserve-3d",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
        }}
        animate={{
          rotateY: isOpen ? 105 : 0,
        }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Recessed Panel */}
        <div 
          className="absolute inset-4 rounded-md border-2 border-amber-700/30"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)",
            boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.2), inset -1px -1px 2px rgba(255,255,255,0.1)",
          }}
        />
        
        {/* Hinges */}
        <div className="absolute right-1 top-8 w-2 h-8 rounded-sm bg-gradient-to-b from-gray-300 to-gray-500 shadow-md" />
        <div className="absolute right-1 bottom-8 w-2 h-8 rounded-sm bg-gradient-to-b from-gray-300 to-gray-500 shadow-md" />
        
        {/* Handle - left side of right door */}
        <div 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-16 rounded-full"
          style={{
            background: "linear-gradient(90deg, #a8a8a8 0%, #d0d0d0 50%, #a8a8a8 100%)",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
          }}
        />
      </motion.div>

      {/* Shadow underneath */}
      <motion.div
        className="absolute -bottom-6 left-1/2 w-4/5 h-6 rounded-full bg-black/15 blur-lg"
        style={{ transform: "translateX(-50%)" }}
        animate={{
          scaleX: isOpen ? 1.4 : 1,
          opacity: isOpen ? 0.25 : 0.15,
        }}
      />
    </div>
  );
}

// Helper function to get category icons
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    food: "🍎",
    cookware: "🍳",
    utensils: "🥄",
    appliances: "⚡",
    dishes: "🍽️",
    storage: "📦",
    cleaning: "🧹",
    spices: "🌶️",
    beverages: "🥤",
    other: "📋",
  };
  return icons[category] || "📦";
}
