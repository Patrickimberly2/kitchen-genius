import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { useKitchen } from "@/context/KitchenContext";
import { ItemCategory } from "@/types/kitchen";
import { Package, Calendar } from "lucide-react";

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  zoneId: string;
  zoneName: string;
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

const UNIT_SUGGESTIONS = [
  "piece",
  "box",
  "bottle",
  "bag",
  "container",
  "gallon",
  "carton",
  "grinder",
];

export function AddItemDialog({ isOpen, onClose, zoneId, zoneName }: AddItemDialogProps) {
  const { addItem } = useKitchen();
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ItemCategory | "">("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");

  const clearForm = () => {
    setName("");
    setCategory("");
    setQuantity("");
    setUnit("");
    setExpiryDate("");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name || !category || !quantity || !unit) {
      return;
    }

    // Create new item
    const newItem = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      zone_id: zoneId,
      category: category as ItemCategory,
      quantity: parseFloat(quantity),
      unit,
      expiry_date: expiryDate || undefined,
      notes: notes || undefined,
    };

    addItem(newItem);
    clearForm();
    onClose();
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Add Item to {zoneName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="item-name">
              Item Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Milk, Flour, Salt"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ItemCategory)} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {ITEM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">
                Unit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="piece, box, etc."
                list="unit-suggestions"
                required
              />
              <datalist id="unit-suggestions">
                {UNIT_SUGGESTIONS.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiry-date" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Expiry Date (optional)
            </Label>
            <Input
              id="expiry-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !category || !quantity || !unit}>
              <Package className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
