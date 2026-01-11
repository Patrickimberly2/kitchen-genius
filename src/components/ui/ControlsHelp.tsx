import { motion } from "framer-motion";
import { RotateCcw, ZoomIn, ZoomOut, Move } from "lucide-react";

export function ControlsHelp() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-4 right-4 z-10"
    >
      <div className="kitchen-panel px-4 py-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Drag to rotate</span>
        </div>
        <div className="w-px h-3 bg-border" />
        <div className="flex items-center gap-1.5">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Scroll to zoom</span>
        </div>
        <div className="w-px h-3 bg-border" />
        <div className="flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5" />
          <span>Right-click to pan</span>
        </div>
      </div>
    </motion.div>
  );
}
