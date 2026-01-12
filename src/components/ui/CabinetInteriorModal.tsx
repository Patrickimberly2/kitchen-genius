import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "./dialog";
import { KitchenZone } from "@/types/kitchen";

interface CabinetInteriorModalProps {
  zone: KitchenZone | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CabinetInteriorModal({ zone, isOpen, onClose }: CabinetInteriorModalProps) {
  const [doorOpen, setDoorOpen] = useState(false);

  // Animate doors opening
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setDoorOpen(true), 100);
      return () => clearTimeout(timer);
    } else {
      setDoorOpen(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl p-0 overflow-hidden">
        <div className="relative w-full" style={{ perspective: "1200px" }}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{zone?.name || "Cabinet"}</h2>
              <p className="text-sm text-gray-500">Interior View</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Cabinet Frame */}
          <div
            className="relative mx-auto bg-gradient-to-b from-white to-gray-50 overflow-hidden"
            style={{
              width: "600px",
              height: "400px",
              perspective: "1000px",
            }}
          >
            {/* Doors with 3D animation */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-white border border-gray-300 rounded-l-lg origin-left flex items-center justify-center"
              animate={{
                rotateY: doorOpen ? 0 : -120,
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Door handle */}
              <div className="absolute right-2 w-1 h-20 bg-gray-400 rounded-full"></div>
            </motion.div>

            <motion.div
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-white border border-gray-300 rounded-r-lg origin-right flex items-center justify-center"
              animate={{
                rotateY: doorOpen ? 0 : 120,
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Door handle */}
              <div className="absolute left-2 w-1 h-20 bg-gray-400 rounded-full"></div>
            </motion.div>

            {/* Interior Shelves - Shows when doors open */}
            <AnimatePresence>
              {doorOpen && (
                <motion.div
                  className="absolute inset-0 flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Vertical divider line down the middle */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 transform -translate-x-1/2 z-10"></div>

                  {/* Top Shelf */}
                  <motion.div
                    className="flex-1 flex items-end justify-center gap-8 px-8 py-6 border-b-4 border-gray-200 bg-gradient-to-b from-white to-gray-50"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {/* Sample item - Yellow box */}
                    <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.1, y: -5 }}>
                      <div
                        className="w-20 h-24 rounded shadow-lg flex items-center justify-center text-3xl font-bold text-amber-900"
                        style={{
                          backgroundColor: "#fbbf24",
                          filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.15))",
                        }}
                      >
                        🥣
                      </div>
                      <p className="text-xs font-semibold text-gray-700 mt-2">Cereal</p>
                    </motion.div>
                  </motion.div>

                  {/* Bottom Shelf */}
                  <motion.div
                    className="flex-1 flex items-end justify-center gap-8 px-8 py-6 bg-gradient-to-b from-gray-50 to-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {/* Sample item - Jar */}
                    <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.1, y: -5 }}>
                      <div
                        className="w-20 h-24 rounded shadow-lg flex items-center justify-center text-3xl"
                        style={{
                          backgroundColor: "#fff7ed",
                          border: "2px solid #fed7aa",
                          filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.15))",
                        }}
                      >
                        🍝
                      </div>
                      <p className="text-xs font-semibold text-gray-700 mt-2">Pasta</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
