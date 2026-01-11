import { motion } from "framer-motion";
import { ChefHat, Grid3X3, Sparkles, Package } from "lucide-react";
import { useKitchen } from "@/context/KitchenContext";
import { KitchenPreset } from "@/types/kitchen";
import { presetLabels } from "@/data/kitchenPresets";

export function WelcomeOverlay() {
  const { loadPreset, zones } = useKitchen();

  if (zones.length > 0) return null;

  const presets: KitchenPreset[] = ["custom-u-shaped", "l-shaped", "galley", "u-shaped", "island"];

  const presetIcons: Record<KitchenPreset, string> = {
    "custom-u-shaped": "⊏⊐",
    "l-shaped": "⌐",
    "galley": "═",
    "u-shaped": "⊔",
    "island": "◫",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center shadow-glow"
          >
            <ChefHat className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          
          <h1 className="text-4xl font-serif font-medium text-foreground mb-3">
            Kitchen Keeper
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Recreate your kitchen in 3D and organize your inventory with AI-powered suggestions
          </p>
        </div>

        {/* Features */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Grid3X3 className="w-4 h-4 text-primary" />
            <span>3D Layout</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="w-4 h-4 text-primary" />
            <span>Inventory Tracking</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Assistant</span>
          </div>
        </div>

        {/* Preset Selection */}
        <div className="kitchen-panel p-6">
          <h2 className="text-lg font-medium text-foreground mb-1 text-center">
            Choose your kitchen layout
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Select a preset to get started, you can customize it later
          </p>

          <div className="grid grid-cols-2 gap-3">
            {presets.map((preset, idx) => (
              <motion.button
                key={preset}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                onClick={() => loadPreset(preset)}
                className="group p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-mono text-primary">{presetIcons[preset]}</span>
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {presetLabels[preset].name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {presetLabels[preset].description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
