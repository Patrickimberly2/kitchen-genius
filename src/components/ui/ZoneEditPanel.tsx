import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Move, Save, X, AlertTriangle, RotateCw } from "lucide-react";
import { useKitchen } from "@/context/KitchenContext";
import { getZoneLabel, getZoneIcon } from "@/utils/kitchenUtils";

export function ZoneEditPanel() {
  const {
    zones,
    selectedZoneId,
    selectZone,
    updateZone,
    removeZone,
    getItemCountInZone,
  } = useKitchen();

  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const [isEditing, setIsEditing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Position editing state
  const [editPosition, setEditPosition] = useState({ x: 0, y: 0, z: 0 });
  
  // Rotation editing state (in degrees for user display)
  const [editRotation, setEditRotation] = useState({ x: 0, y: 0, z: 0 });
  
  // Reset edit state when zone changes
  useEffect(() => {
    if (selectedZone) {
      setEditPosition({
        x: selectedZone.position.x,
        y: selectedZone.position.y,
        z: selectedZone.position.z,
      });
      // Convert radians to degrees for display
      const rot = selectedZone.rotation || { x: 0, y: 0, z: 0 };
      setEditRotation({
        x: Math.round((rot.x * 180) / Math.PI),
        y: Math.round((rot.y * 180) / Math.PI),
        z: Math.round((rot.z * 180) / Math.PI),
      });
    }
    setIsEditing(false);
    setIsRotating(false);
    setShowDeleteConfirm(false);
  }, [selectedZoneId, selectedZone]);

  if (!selectedZone) return null;

  const itemCount = getItemCountInZone(selectedZone.id);

  const handleSavePosition = () => {
    updateZone(selectedZone.id, {
      position: editPosition,
    });
    setIsEditing(false);
  };

  const handleSaveRotation = () => {
    // Convert degrees to radians
    updateZone(selectedZone.id, {
      rotation: {
        x: (editRotation.x * Math.PI) / 180,
        y: (editRotation.y * Math.PI) / 180,
        z: (editRotation.z * Math.PI) / 180,
      },
    });
    setIsRotating(false);
  };

  const handleDeleteZone = () => {
    removeZone(selectedZone.id);
    selectZone(null);
    setShowDeleteConfirm(false);
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setEditPosition((prev) => ({
      ...prev,
      [axis]: value,
    }));
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setEditRotation((prev) => ({
      ...prev,
      [axis]: value,
    }));
  };

  // Snap to 0.25m grid
  const snapToGrid = (value: number) => Math.round(value * 4) / 4;
  
  // Snap rotation to 15 degree increments
  const snapRotation = (value: number) => Math.round(value / 15) * 15;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 kitchen-panel px-4 py-3 z-20 flex items-center gap-4"
      >
        {/* Zone info */}
        <div className="flex items-center gap-3 pr-4 border-r border-border">
          <span className="text-2xl">{getZoneIcon(selectedZone.zone_type)}</span>
          <div>
            <p className="font-medium text-foreground text-sm">{selectedZone.name}</p>
            <p className="text-xs text-muted-foreground">
              {getZoneLabel(selectedZone.zone_type)}
              {itemCount > 0 && ` • ${itemCount} items`}
            </p>
          </div>
        </div>

        {/* Position editing */}
        {isEditing ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground w-6">X:</label>
              <input
                type="number"
                step="0.25"
                value={editPosition.x}
                onChange={(e) => handlePositionChange('x', parseFloat(e.target.value) || 0)}
                onBlur={(e) => handlePositionChange('x', snapToGrid(parseFloat(e.target.value) || 0))}
                className="w-16 px-2 py-1 text-sm rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground w-6">Y:</label>
              <input
                type="number"
                step="0.25"
                value={editPosition.y}
                onChange={(e) => handlePositionChange('y', parseFloat(e.target.value) || 0)}
                onBlur={(e) => handlePositionChange('y', snapToGrid(parseFloat(e.target.value) || 0))}
                className="w-16 px-2 py-1 text-sm rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground w-6">Z:</label>
              <input
                type="number"
                step="0.25"
                value={editPosition.z}
                onChange={(e) => handlePositionChange('z', parseFloat(e.target.value) || 0)}
                onBlur={(e) => handlePositionChange('z', snapToGrid(parseFloat(e.target.value) || 0))}
                className="w-16 px-2 py-1 text-sm rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
              />
            </div>
            
            <button
              onClick={handleSavePosition}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
            <button
              onClick={() => {
                setEditPosition(selectedZone.position);
                setIsEditing(false);
              }}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : isRotating ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground w-6">X°:</label>
              <input
                type="number"
                step="15"
                value={editRotation.x}
                onChange={(e) => handleRotationChange('x', parseFloat(e.target.value) || 0)}
                onBlur={(e) => handleRotationChange('x', snapRotation(parseFloat(e.target.value) || 0))}
                className="w-16 px-2 py-1 text-sm rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground w-6">Y°:</label>
              <input
                type="number"
                step="15"
                value={editRotation.y}
                onChange={(e) => handleRotationChange('y', parseFloat(e.target.value) || 0)}
                onBlur={(e) => handleRotationChange('y', snapRotation(parseFloat(e.target.value) || 0))}
                className="w-16 px-2 py-1 text-sm rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground w-6">Z°:</label>
              <input
                type="number"
                step="15"
                value={editRotation.z}
                onChange={(e) => handleRotationChange('z', parseFloat(e.target.value) || 0)}
                onBlur={(e) => handleRotationChange('z', snapRotation(parseFloat(e.target.value) || 0))}
                className="w-16 px-2 py-1 text-sm rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
              />
            </div>
            
            <button
              onClick={handleSaveRotation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
            <button
              onClick={() => {
                const rot = selectedZone.rotation || { x: 0, y: 0, z: 0 };
                setEditRotation({
                  x: Math.round((rot.x * 180) / Math.PI),
                  y: Math.round((rot.y * 180) / Math.PI),
                  z: Math.round((rot.z * 180) / Math.PI),
                });
                setIsRotating(false);
              }}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Move button */}
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-sm transition-colors"
            >
              <Move className="w-3.5 h-3.5" />
              Move
            </button>
            
            {/* Rotate button */}
            <button
              onClick={() => setIsRotating(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-sm transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Rotate
            </button>
            
            {/* Delete button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="kitchen-panel p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-foreground">
                  Remove Zone?
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedZone.name}
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              This will remove the zone from your kitchen layout.
              {itemCount > 0 && (
                <span className="text-destructive font-medium">
                  {" "}The {itemCount} item{itemCount > 1 ? "s" : ""} in this zone will become unassigned.
                </span>
              )}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-kitchen-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteZone}
                className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
              >
                Remove
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
