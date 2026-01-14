import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { ItemCategory } from "@/types/kitchen";
import { useKitchen } from "@/context/KitchenContext";
import { Package } from "lucide-react";
import { getCategoryIcon, getCategoryLabel } from "@/utils/kitchenUtils";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Textarea } from "./textarea";

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  zoneId: string | null;
  zoneName?: string;
}

const ITEM_CATEGORIES: ItemCategory[] = [
  "food",
  "beverages",
  "spices",
  "cookware",
  "utensils",
  "dishes",
  "storage",
  "cleaning",
  "appliances",
  "other",
];

export function AddItemDialog({ isOpen, onClose, zoneId, zoneName }: AddItemDialogProps) {
  const { addItem } = useKitchen();
  
  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ItemCategory>("food");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  
  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!quantity || parseFloat(quantity) <= 0) {
      newErrors.quantity = "Quantity must be a positive number";
    }
    
    if (!unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    // Date validation - must be future date if provided
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiry < today) {
        newErrors.expiryDate = "Expiry date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !zoneId) {
      return;
    }

    // Generate unique ID
    const newItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      quantity: parseFloat(quantity),
      unit: unit.trim(),
      zone_id: zoneId,
      expiry_date: expiryDate || undefined,
      notes: notes.trim() || undefined,
    };

    // Add item to context
    addItem(newItem);

    // Reset form and close
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setCategory("food");
    setQuantity("");
    setUnit("");
    setExpiryDate("");
    setNotes("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Olive Oil"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ItemCategory)}>
              <SelectTrigger id="category">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span>{getCategoryIcon(category)}</span>
                    <span>{getCategoryLabel(category)}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ITEM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <span>{getCategoryIcon(cat)}</span>
                      <span>{getCategoryLabel(cat)}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                className={errors.quantity ? "border-destructive" : ""}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">
                Unit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., bottle, pieces"
                className={errors.unit ? "border-destructive" : ""}
              />
              {errors.unit && (
                <p className="text-sm text-destructive">{errors.unit}</p>
              )}
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className={errors.expiryDate ? "border-destructive" : ""}
            />
            {errors.expiryDate && (
              <p className="text-sm text-destructive">{errors.expiryDate}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          {/* Footer Buttons */}
          <DialogFooter>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
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
