import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, Filter, ChevronDown, GripVertical, AlertCircle, Plus } from "lucide-react";
import { useKitchen } from "@/context/KitchenContext";
import { InventoryItem, ItemCategory } from "@/types/kitchen";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon, getCategoryLabel } from "@/utils/kitchenUtils";
import { getCategoryColor } from "@/utils/itemShapeUtils";
import { AddItemDialog } from "./AddItemDialog";

interface DraggableItemProps {
  item: InventoryItem;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function DraggableItem({ item, onDragStart, onDragEnd }: DraggableItemProps) {
  const { zones } = useKitchen();
  const zone = zones.find(z => z.id === item.zone_id);
  const isExpiringSoon = item.expiry_date && new Date(item.expiry_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  return (
    <div
      draggable
      onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("itemId", item.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className="group flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-card/80 border border-border/50 cursor-grab active:cursor-grabbing transition-all hover:shadow-md"
      style={{ borderLeftColor: getCategoryColor(item.category), borderLeftWidth: 3 }}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{item.name}</span>
          {isExpiringSoon && (
            <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {item.quantity} {item.unit}
          </span>
          {zone && (
            <Badge variant="outline" className="text-[10px] h-4 px-1.5">
              {zone.name}
            </Badge>
          )}
        </div>
      </div>
      
      <span className="text-lg">{getCategoryIcon(item.category)}</span>
    </div>
  );
}

export function MobileInventoryPanel() {
  const { items, zones, startDrag, endDrag, moveItemToZone } = useKitchen();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedZoneForAdd, setSelectedZoneForAdd] = useState<{ id: string; name: string } | null>(null);

  const categories: (ItemCategory | "all")[] = ["all", "food", "beverages", "spices", "cookware", "utensils", "dishes", "storage", "cleaning", "appliances"];
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const unassignedItems = filteredItems.filter(i => !i.zone_id);
  const assignedItems = filteredItems.filter(i => i.zone_id);

  // Group assigned items by zone
  const itemsByZone = new Map<string, InventoryItem[]>();
  assignedItems.forEach(item => {
    const existing = itemsByZone.get(item.zone_id) || [];
    existing.push(item);
    itemsByZone.set(item.zone_id, existing);
  });

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");
    if (itemId) {
      moveItemToZone(itemId, zoneId);
    }
    setDragOverZone(null);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg">Inventory</h2>
          <Badge variant="secondary" className="ml-auto">{items.length} items</Badge>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Filter toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full mt-2 justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {selectedCategory === "all" ? "All Categories" : getCategoryLabel(selectedCategory)}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </Button>
        
        {/* Category filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-1.5 pt-3">
                {categories.map(cat => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === "all" ? "All" : getCategoryIcon(cat)} {getCategoryLabel(cat)}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Unassigned items */}
        {unassignedItems.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Unassigned ({unassignedItems.length})
            </h3>
            <div className="space-y-2">
              {unassignedItems.map(item => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  onDragStart={() => startDrag({ itemId: item.id, item })}
                  onDragEnd={endDrag}
                />
              ))}
            </div>
          </div>
        )}

        {/* Drop zones */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Drop zones</h3>
          {zones
            .filter(z => !["countertop", "window", "sink", "stove"].includes(z.zone_type))
            .slice(0, 10)
            .map(zone => {
              const zoneItems = itemsByZone.get(zone.id) || [];
              const isDragOver = dragOverZone === zone.id;
              
              return (
                <div
                  key={zone.id}
                  onDragOver={e => {
                    e.preventDefault();
                    setDragOverZone(zone.id);
                  }}
                  onDragLeave={() => setDragOverZone(null)}
                  onDrop={e => handleDrop(e, zone.id)}
                  className={`p-3 rounded-lg border-2 border-dashed transition-all ${
                    isDragOver 
                      ? "border-primary bg-primary/10" 
                      : "border-border/50 bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{zone.name}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedZoneForAdd({ id: zone.id, name: zone.name });
                          setShowAddItem(true);
                        }}
                        className="h-6 px-2 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                      <Badge variant="outline" className="text-xs">
                        {zoneItems.length} items
                      </Badge>
                    </div>
                  </div>
                  
                  {zoneItems.length > 0 && (
                    <div className="space-y-1">
                      {zoneItems.slice(0, 3).map(item => (
                        <DraggableItem
                          key={item.id}
                          item={item}
                          onDragStart={() => startDrag({ itemId: item.id, item })}
                          onDragEnd={endDrag}
                        />
                      ))}
                      {zoneItems.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center py-1">
                          +{zoneItems.length - 3} more
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Add Item Dialog */}
      {selectedZoneForAdd && (
        <AddItemDialog
          isOpen={showAddItem}
          onClose={() => {
            setShowAddItem(false);
            setSelectedZoneForAdd(null);
          }}
          zoneId={selectedZoneForAdd.id}
          zoneName={selectedZoneForAdd.name}
        />
      )}
    </div>
  );
}
