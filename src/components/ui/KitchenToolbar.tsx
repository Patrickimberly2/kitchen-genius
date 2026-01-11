import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Grid3X3, Lightbulb, Package, ChevronDown } from "lucide-react";
import { useKitchen } from "@/context/KitchenContext";
import { KitchenPreset } from "@/types/kitchen";
import { presetLabels } from "@/data/kitchenPresets";

export function PresetSelector() {
  const { loadPreset, currentPreset, zones } = useKitchen();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmPreset, setConfirmPreset] = useState<KitchenPreset | null>(null);

  const handleSelectPreset = (preset: KitchenPreset) => {
    if (zones.length > 0 && currentPreset !== preset) {
      setConfirmPreset(preset);
    } else {
      loadPreset(preset);
      setIsOpen(false);
    }
  };

  const handleConfirm = () => {
    if (confirmPreset) {
      loadPreset(confirmPreset);
      setConfirmPreset(null);
      setIsOpen(false);
    }
  };

  const presets: KitchenPreset[] = ["l-shaped", "galley", "u-shaped", "island"];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="kitchen-panel px-4 py-3 flex items-center gap-3 hover:bg-card transition-colors"
      >
        <Grid3X3 className="w-5 h-5 text-primary" />
        <div className="text-left">
          <p className="text-xs text-muted-foreground">Layout</p>
          <p className="text-sm font-medium text-foreground">
            {currentPreset ? presetLabels[currentPreset].name : "Select preset"}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-72 kitchen-panel p-2 z-30"
          >
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => handleSelectPreset(preset)}
                className={`w-full p-3 rounded-xl text-left transition-colors ${
                  currentPreset === preset
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted"
                }`}
              >
                <p className="font-medium text-foreground">{presetLabels[preset].name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {presetLabels[preset].description}
                </p>
              </button>
            ))}
          </motion.div>
        )}

        {confirmPreset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setConfirmPreset(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="kitchen-panel p-6 max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-serif font-medium text-foreground">
                Change layout?
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                This will replace your current kitchen layout with the{" "}
                <strong>{presetLabels[confirmPreset].name}</strong> preset.
                Your items will be redistributed automatically.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setConfirmPreset(null)}
                  className="btn-kitchen-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="btn-kitchen flex-1"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function KitchenToolbar() {
  const { zones, items, generateSuggestions, suggestions } = useKitchen();

  return (
    <div className="fixed top-4 left-4 z-20 flex flex-col gap-3">
      {/* Logo/Title */}
      <div className="kitchen-panel px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <ChefHat className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-serif text-lg font-medium text-foreground">Kitchen Keeper</h1>
          <p className="text-xs text-muted-foreground">3D Inventory</p>
        </div>
      </div>

      {/* Preset Selector */}
      <PresetSelector />

      {/* Quick Stats */}
      {zones.length > 0 && (
        <div className="kitchen-panel px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{zones.length} zones</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{items.length} items</span>
          </div>
        </div>
      )}

      {/* AI Suggestions Button */}
      {zones.length > 0 && (
        <button
          onClick={generateSuggestions}
          className="kitchen-panel px-4 py-3 flex items-center gap-3 hover:bg-card transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
            <Lightbulb className="w-4 h-4 text-accent" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">AI Suggestions</p>
            <p className="text-xs text-muted-foreground">
              {suggestions.length > 0
                ? `${suggestions.length} suggestion${suggestions.length > 1 ? "s" : ""}`
                : "Get organization tips"}
            </p>
          </div>
        </button>
      )}
    </div>
  );
}
