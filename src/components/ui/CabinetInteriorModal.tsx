import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { useKitchen } from "@/context/KitchenContext";
import { KitchenZone, InventoryItem, ItemCategory } from "@/types/kitchen";
import { cn } from "@/lib/utils";

interface CabinetInteriorModalProps {
  zone: KitchenZone | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryColors: Record<ItemCategory, string> = {
  food: "#fbbf24",
  cookware: "#9ca3af",
  utensils: "#f97316",
  appliances: "#3b82f6",
  dishes: "#a855f7",
  storage: "#6366f1",
  cleaning: "#06b6d4",
  spices: "#d97706",
  beverages: "#ec4899",
  other: "#64748b",
};

export function CabinetInteriorModal({ zone, isOpen, onClose }: CabinetInteriorModalProps) {
  const { getItemsInZone, addItem, removeItem } = useKitchen();
  const [doorOpen, setDoorOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>("food");
  const [selectedShelf, setSelectedShelf] = useState(0);

  // Animate door opening when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setDoorOpen(true), 100);
      return () => clearTimeout(timer);
    } else {
      setDoorOpen(false);
    }
  }, [isOpen]);

  const items = useMemo(() => {
    if (!zone) return [];
    return getItemsInZone(zone.id);
  }, [zone, getItemsInZone]);

  const shelves = useMemo(() => {
    const shelfCount = 2; // Two shelves like the pantry planner
    const shelfItems: InventoryItem[][] = Array(shelfCount)
      .fill(null)
      .map(() => []);
    items.forEach((item, index) => {
      const shelfIndex = index % shelfCount;
      shelfItems[shelfIndex].push(item);
    });
    return shelfItems;
  }, [items]);

  const handleAddItem = () => {
    if (newItemName.trim() && zone) {
      addItem({
        id: Date.now().toString(),
        name: newItemName,
        category: newItemCategory,
        quantity: 1,
        zone_id: zone.id,
      });
      setNewItemName("");
      setShowAddForm(false);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white border-0 shadow-2xl p-0 overflow-hidden">
        <div className="relative w-full" style={{ perspective: "1200px" }}>
          {/* Cabinet Frame with Door Animation */}
          <div className="w-full bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{zone?.name || "Cabinet"}</h2>
                <p className="text-sm text-gray-500">Interior View</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cabinet Interior - Two Shelves */}
            <div className="relative mx-auto my-8" style={{ maxWidth: "800px", minHeight: "400px" }}>
              {/* Doors with 3D perspective */}
              <motion.div
                className="absolute inset-0"
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Left Door */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1/2 bg-white border border-gray-300 rounded-l-lg origin-left"
                  animate={{
                    rotateY: doorOpen ? 0 : -120,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-gray-50 to-white flex items-center justify-center">
                    <div className="w-1 h-20 bg-gray-400 rounded-full"></div>
                  </div>
                </motion.div>

                {/* Right Door */}
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-1/2 bg-white border border-gray-300 rounded-r-lg origin-right"
                  animate={{
                    rotateY: doorOpen ? 0 : 120,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="h-full w-full bg-gradient-to-l from-gray-50 to-white flex items-center justify-center">
                    <div className="w-1 h-20 bg-gray-400 rounded-full"></div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Shelves Container */}
              <AnimatePresence>
                {doorOpen && (
                  <motion.div
                    className="absolute inset-0 pointer-events-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {/* Vertical Divider */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 transform -translate-x-1/2 z-10"></div>

                    {/* Shelves */}
                    {shelves.map((shelfItems, shelfIndex) => (
                      <motion.div
                        key={shelfIndex}
                        className={`absolute left-0 right-0 flex items-end justify-center gap-6 px-8 py-6 bg-gradient-to-b ${
                          shelfIndex === 0
                            ? "top-8 h-1/2 from-white to-gray-50"
                            : "bottom-8 h-1/2 from-gray-50 to-white"
                        }`}
                        style={{
                          borderBottom: shelfIndex === 0 ? "4px solid #e5e7eb" : "none",
                        }}
                        initial={{ opacity: 0, y: shelfIndex === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + shelfIndex * 0.1 }}
                      >
                        {/* Items */}
                        <div className="flex gap-4 items-end justify-center flex-wrap">
                          {shelfItems.map((item) => (
                            <motion.div
                              key={item.id}
                              className="flex flex-col items-center cursor-pointer group"
                              whileHover={{ scale: 1.15, y: -10 }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                              {/* Item Visual */}
                              <motion.div
                                className="w-20 h-24 rounded shadow-lg flex items-center justify-center text-3xl relative"
                                style={{
                                  backgroundColor: categoryColors[item.category],
                                  filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.15))",
                                }}
                              >
                                <span className="text-white font-bold">{item.name.charAt(0)}</span>
                                {/* Remove Button */}
                                <motion.button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  whileHover={{ scale: 1.2 }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </motion.button>
                              </motion.div>
                              {/* Item Label */}
                              <p className="text-xs font-semibold text-gray-700 mt-2 text-center max-w-20 truncate">
                                {item.name}
                              </p>
                            </motion.div>
                          ))}

                          {/* Add Item Button */}
                          <motion.button
                            onClick={() => setShowAddForm(true)}
                            className="w-20 h-24 rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Plus className="w-6 h-6 text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1">Add</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Add Item Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-50"
              >
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Add Item to {zone?.name}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Item Name</label>
                      <Input
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="e.g., Cereal, Pasta"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Category</label>
                      <Select value={newItemCategory} onValueChange={(val) => setNewItemCategory(val as ItemCategory)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="cookware">Cookware</SelectItem>
                          <SelectItem value="utensils">Utensils</SelectItem>
                          <SelectItem value="dishes">Dishes</SelectItem>
                          <SelectItem value="storage">Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleAddItem} className="flex-1 bg-blue-500 hover:bg-blue-600">
                        Add Item
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
