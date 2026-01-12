import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Package, Coffee, Utensils, Apple, Droplets, Plug, CircleDot, Box, Archive } from "lucide-react";
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

const categoryIcons: Record<ItemCategory, React.ElementType> = {
  food: Apple,
  cookware: CircleDot,
  utensils: Utensils,
  appliances: Plug,
  dishes: Package,
  storage: Box,
  cleaning: Droplets,
  spices: Coffee,
  beverages: Coffee,
  other: Archive,
};

const categoryColors: Record<ItemCategory, string> = {
  food: "bg-green-500",
  cookware: "bg-gray-600",
  utensils: "bg-amber-500",
  appliances: "bg-blue-500",
  dishes: "bg-purple-500",
  storage: "bg-indigo-500",
  cleaning: "bg-cyan-500",
  spices: "bg-orange-500",
  beverages: "bg-red-500",
  other: "bg-slate-500",
};

export function CabinetInteriorModal({ zone, isOpen, onClose }: CabinetInteriorModalProps) {
  const { getItemsInZone, addItem, removeItem, updateItem } = useKitchen();
  const [doorOpen, setDoorOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>("food");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
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

  // Calculate number of shelves based on zone type and height
  const shelfCount = useMemo(() => {
    if (!zone) return 2;
    const { zone_type, dimensions } = zone;
    if (zone_type === "pantry" || zone_type === "pantry_shelf") return 6;
    if (zone_type === "upright_freezer" || zone_type === "freezer_shelf") return 4;
    if (zone_type === "refrigerator" || zone_type === "fridge_door") return 4;
    if (zone_type === "drawer") return 1;
    // Calculate based on height
    return Math.max(1, Math.floor(dimensions.height / 0.25));
  }, [zone]);

  // Distribute items across shelves
  const itemsByShelf = useMemo(() => {
    const shelves: InventoryItem[][] = Array.from({ length: shelfCount }, () => []);
    items.forEach((item, idx) => {
      const shelfIdx = idx % shelfCount;
      shelves[shelfIdx].push(item);
    });
    return shelves;
  }, [items, shelfCount]);

  const handleAddItem = () => {
    if (!zone || !newItemName.trim()) return;
    
    const newItem: InventoryItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newItemName.trim(),
      zone_id: zone.id,
      category: newItemCategory,
      quantity: newItemQuantity,
      unit: "piece",
    };
    
    addItem(newItem);
    setNewItemName("");
    setNewItemQuantity(1);
    setShowAddForm(false);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      const newQty = Math.max(1, item.quantity + delta);
      updateItem(itemId, { quantity: newQty });
    }
  };

  if (!zone) return null;

  const isDrawer = zone.zone_type === "drawer";
  const isPantry = zone.zone_type.includes("pantry");
  const isFridge = zone.zone_type.includes("fridge") || zone.zone_type === "refrigerator";
  const isFreezer = zone.zone_type.includes("freezer");

  // Door styling based on zone type
  const getDoorStyle = () => {
    if (isDrawer) return "bg-gradient-to-b from-amber-700 to-amber-800";
    if (isPantry) return "bg-gradient-to-b from-amber-100 to-amber-200";
    if (isFridge) return "bg-gradient-to-b from-slate-200 to-slate-300";
    if (isFreezer) return "bg-gradient-to-b from-blue-100 to-blue-200";
    return "bg-gradient-to-b from-amber-600 to-amber-700"; // Cabinet
  };

  const getInteriorStyle = () => {
    if (isFridge || isFreezer) return "bg-gradient-to-b from-slate-100 to-slate-200";
    if (isPantry) return "bg-gradient-to-b from-amber-50 to-amber-100";
    return "bg-gradient-to-b from-amber-100 to-amber-200";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-transparent border-none shadow-2xl">
        <div className="relative" style={{ perspective: "1200px" }}>
          {/* Cabinet Frame */}
          <div className={cn(
            "relative w-full rounded-lg overflow-hidden",
            "border-4 border-amber-800 shadow-xl",
            getInteriorStyle()
          )}>
            <DialogHeader className="absolute top-2 left-2 right-2 z-20 bg-background/80 backdrop-blur-sm rounded-md p-2">
              <DialogTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                {zone.name}
              </DialogTitle>
            </DialogHeader>

            {/* Interior with Shelves */}
            <div className="pt-12 pb-4 px-4 min-h-[400px]">
              <AnimatePresence>
                {itemsByShelf.map((shelfItems, shelfIdx) => (
                  <motion.div
                    key={shelfIdx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: doorOpen ? 1 : 0, y: doorOpen ? 0 : 20 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: shelfIdx * 0.1, duration: 0.3 }}
                    className={cn(
                      "relative mb-2 p-3 rounded-md cursor-pointer transition-colors",
                      "border-b-2 border-amber-300/50",
                      selectedShelf === shelfIdx ? "bg-amber-200/50" : "hover:bg-amber-100/50",
                      isFridge && "border-slate-300/50",
                      isFridge && (selectedShelf === shelfIdx ? "bg-slate-200/50" : "hover:bg-slate-100/50")
                    )}
                    onClick={() => setSelectedShelf(shelfIdx)}
                  >
                    {/* Shelf Label */}
                    <div className="text-xs text-muted-foreground mb-2 font-medium">
                      {isDrawer ? "Drawer" : `Shelf ${shelfIdx + 1}`}
                    </div>
                    
                    {/* Items on Shelf */}
                    <div className="flex flex-wrap gap-2 min-h-[60px]">
                      {shelfItems.length === 0 ? (
                        <div className="text-xs text-muted-foreground italic flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Empty - click to add items
                        </div>
                      ) : (
                        shelfItems.map((item) => {
                          const Icon = categoryIcons[item.category] || Package;
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="group relative flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border hover:shadow-lg transition-shadow"
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-md flex items-center justify-center text-white shadow-inner",
                                categoryColors[item.category]
                              )}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium truncate max-w-[100px]">
                                  {item.name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(item.id, -1); }}
                                    className="text-xs text-muted-foreground hover:text-foreground w-4 h-4 flex items-center justify-center rounded hover:bg-muted"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs text-muted-foreground">
                                    {item.quantity} {item.unit}
                                  </span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(item.id, 1); }}
                                    className="text-xs text-muted-foreground hover:text-foreground w-4 h-4 flex items-center justify-center rounded hover:bg-muted"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              
                              {/* Delete button */}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Add Item Form */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-background/90 backdrop-blur-sm rounded-lg border shadow-lg"
                  >
                    <div className="flex flex-col gap-3">
                      <Input
                        placeholder="Item name..."
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Select value={newItemCategory} onValueChange={(v) => setNewItemCategory(v as ItemCategory)}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(categoryIcons).map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min={1}
                          value={newItemQuantity}
                          onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddItem} size="sm" className="flex-1">
                          <Plus className="w-4 h-4 mr-1" /> Add Item
                        </Button>
                        <Button onClick={() => setShowAddForm(false)} size="sm" variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Add Item Button */}
            {!showAddForm && (
              <div className="absolute bottom-4 right-4">
                <Button
                  onClick={() => setShowAddForm(true)}
                  size="sm"
                  className="shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Item
                </Button>
              </div>
            )}

            {/* Door Overlay with 3D Transform */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-lg shadow-2xl",
                getDoorStyle(),
                "origin-left"
              )}
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              initial={{ rotateY: 0 }}
              animate={{ 
                rotateY: doorOpen ? (isDrawer ? 0 : -105) : 0,
                translateZ: isDrawer ? (doorOpen ? 150 : 0) : 0,
                translateX: isDrawer ? (doorOpen ? -50 : 0) : 0,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20,
                duration: 0.6
              }}
            >
              {/* Door Handle */}
              <div className={cn(
                "absolute bg-gradient-to-b from-slate-400 to-slate-500 rounded-md shadow-md",
                isDrawer 
                  ? "left-1/2 -translate-x-1/2 top-2 w-16 h-3"
                  : "right-4 top-1/2 -translate-y-1/2 w-3 h-16"
              )} />
              
              {/* Door Panel Details */}
              <div className={cn(
                "absolute inset-4 rounded border-2 opacity-30",
                isDrawer ? "border-amber-600" : "border-amber-500"
              )} />
              
              {/* Door Label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-amber-900/50 font-medium text-lg">
                  {isDrawer ? "Pull to open" : "Click to open"}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 z-30 w-8 h-8 bg-background rounded-full shadow-lg flex items-center justify-center hover:bg-muted transition-colors border"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Item Count Badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            {items.length} items
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
