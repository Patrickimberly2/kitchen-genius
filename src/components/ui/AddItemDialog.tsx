import { useState } from "react";
import { useKitchen } from "@/context/KitchenContext";
import { ItemCategory } from "@/types/kitchen";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getCategoryLabel } from "@/utils/kitchenUtils";

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  zoneId: string;
  zoneName: string;
}

const CATEGORIES: ItemCategory[] = [
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
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ItemCategory>("food");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("pieces");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: { name?: string } = {};
    if (!name.trim()) {
      newErrors.name = "Item name is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate unique ID
    const itemId = crypto.randomUUID();
    
    // Create new item
    const newItem = {
      id: itemId,
      name: name.trim(),
      zone_id: zoneId,
      category,
      quantity: parseInt(quantity) || 1,
      unit,
      expiry_date: expiryDate || undefined,
      notes: notes || undefined,
    };

    // Add item to context
    addItem(newItem);

    // Reset form and close dialog
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setCategory("food");
    setQuantity("1");
    setUnit("pieces");
    setExpiryDate("");
    setNotes("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] kitchen-panel">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Add Item</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new item to {zoneName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Item Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="e.g., Pasta, Olive Oil, Frying Pan"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ItemCategory)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="pieces, box, bottle"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about this item..."
              className="resize-none"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="btn-kitchen-secondary"
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-kitchen">
              Save Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
