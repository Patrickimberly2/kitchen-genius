import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Calendar, Edit2, Trash2 } from "lucide-react";
import { useKitchen } from "@/context/KitchenContext";
import { getZoneLabel, getCategoryIcon, getCategoryLabel } from "@/utils/kitchenUtils";
import { format, parseISO, differenceInDays } from "date-fns";
import { AddItemDialog } from "./AddItemDialog";

export function InventoryPanel() {
  const {
    zones,
    selectedZoneId,
    selectZone,
    getItemsInZone,
    removeItem,
  } = useKitchen();
  
  const [showAddDialog, setShowAddDialog] = useState(false);

  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const items = selectedZoneId ? getItemsInZone(selectedZoneId) : [];

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const days = differenceInDays(parseISO(expiryDate), new Date());
    if (days < 0) return { label: "Expired", color: "text-destructive" };
    if (days <= 3) return { label: `${days}d left`, color: "text-destructive" };
    if (days <= 7) return { label: `${days}d left`, color: "text-accent" };
    return { label: format(parseISO(expiryDate), "MMM d"), color: "text-muted-foreground" };
  };

  return (
    <AnimatePresence>
      {selectedZone && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-4 top-4 bottom-4 w-80 kitchen-panel overflow-hidden flex flex-col z-20"
        >
          {/* Header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {getZoneLabel(selectedZone.zone_type)}
                </p>
                <h2 className="text-lg font-serif font-medium text-foreground">
                  {selectedZone.name}
                </h2>
              </div>
              <button
                onClick={() => selectZone(null)}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Zone dimensions */}
            <p className="text-xs text-muted-foreground mt-2">
              {(selectedZone.dimensions.width * 100).toFixed(0)}cm × 
              {(selectedZone.dimensions.height * 100).toFixed(0)}cm × 
              {(selectedZone.dimensions.depth * 100).toFixed(0)}cm
            </p>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No items in this zone</p>
                <p className="text-muted-foreground/60 text-xs mt-1">
                  Add items from the inventory
                </p>
              </div>
            ) : (
              items.map((item) => {
                const expiry = getExpiryStatus(item.expiry_date);
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inventory-item group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{getCategoryIcon(item.category)}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">
                            {item.quantity} {item.unit}
                          </span>
                          <span className="text-muted-foreground/40">•</span>
                          <span className="text-xs text-muted-foreground">
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                        {expiry && (
                          <div className={`flex items-center gap-1 mt-1 text-xs ${expiry.color}`}>
                            <Calendar className="w-3 h-3" />
                            {expiry.label}
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-muted">
                          <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive/70" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <button 
              onClick={() => setShowAddDialog(true)}
              className="btn-kitchen w-full"
            >
              <Package className="w-4 h-4" />
              Add Item
            </button>
          </div>
          
          {/* Add Item Dialog */}
          <AddItemDialog
            isOpen={showAddDialog}
            onClose={() => setShowAddDialog(false)}
            zoneId={selectedZoneId}
            zoneName={selectedZone?.name}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
