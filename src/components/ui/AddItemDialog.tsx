import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { ItemCategory, InventoryItem } from "@/types/kitchen";
import { useKitchen } from "@/context/KitchenContext";
import { Package } from "lucide-react";
import { getCategoryIcon, getCategoryLabel } from "@/utils/kitchenUtils";

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  zoneId: string | null;
  zoneName?: string;
}

const categories: ItemCategory[] = [
  "food",
  "beverages",
  "spices",
  "cookware",
  "utensils",
  "dishes",
  "storage",
  "cleaning",
  "appliances",
];

export function AddItemDialog({ isOpen, onClose, zoneId, zoneName }: AddItemDialogProps) {
  const { addItem } = useKitchen();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "food" as ItemCategory,
    quantity: "",
    unit: "",
    expiryDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    quantity: "",
    unit: "",
    expiryDate: "",
  });

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      quantity: "",
      unit: "",
      expiryDate: "",
    };

    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Quantity validation
    if (!formData.quantity.trim()) {
      newErrors.quantity = "Quantity is required";
      isValid = false;
    } else {
      const qty = parseFloat(formData.quantity);
      if (isNaN(qty) || qty <= 0) {
        newErrors.quantity = "Quantity must be a positive number";
        isValid = false;
      }
    }

    // Unit validation
    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
      isValid = false;
    }

    // Expiry date validation (if provided)
    if (formData.expiryDate) {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate < today) {
        newErrors.expiryDate = "Expiry date must be in the future";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !zoneId) {
      return;
    }

    // Create new item with unique ID
    const newItem: InventoryItem = {
      id: Math.random().toString(36).substring(2, 11),
      name: formData.name.trim(),
      category: formData.category,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit.trim(),
      zone_id: zoneId,
      expiry_date: formData.expiryDate || undefined,
      notes: formData.notes.trim() || undefined,
    };

    addItem(newItem);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: "",
      category: "food",
      quantity: "",
      unit: "",
      expiryDate: "",
      notes: "",
    });
    setErrors({
      name: "",
      quantity: "",
      unit: "",
      expiryDate: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="kitchen-panel max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Package className="w-5 h-5" />
            Add Item to {zoneName || "Zone"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Olive Oil"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as ItemCategory })}
            >
              <SelectTrigger id="category">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span>{getCategoryIcon(formData.category)}</span>
                    <span>{getCategoryLabel(formData.category)}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <span className="flex items-center gap-2">
                      <span>{getCategoryIcon(category)}</span>
                      <span>{getCategoryLabel(category)}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity and Unit - Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                placeholder="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className={errors.quantity ? "border-destructive" : ""}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">
                Unit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="unit"
                placeholder="pieces"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className={errors.unit ? "border-destructive" : ""}
              />
              {errors.unit && (
                <p className="text-xs text-destructive">{errors.unit}</p>
              )}
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className={errors.expiryDate ? "border-destructive" : ""}
            />
            {errors.expiryDate && (
              <p className="text-xs text-destructive">{errors.expiryDate}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="min-h-[80px]"
            />
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-kitchen"
            >
              <Package className="w-4 h-4" />
              Add Item
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
